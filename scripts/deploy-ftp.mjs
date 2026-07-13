import { existsSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import ftp from "basic-ftp";

const outputDirectory = "out";

function hasArg(name) {
  return process.argv.includes(name);
}

function env(name, fallback = "") {
  const value = process.env[name];
  return value == null || value.trim() === "" ? fallback : value.trim();
}

function parsePort(value) {
  const port = Number.parseInt(value, 10);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Geçersiz FTP portu: ${value}`);
  }
  return port;
}

function parseSecure(value) {
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "evet", "ftps"].includes(normalized)) return true;
  if (["false", "0", "no", "hayir", "hayır", "ftp"].includes(normalized)) return false;
  if (["implicit", "ftps-implicit", "990"].includes(normalized)) return "implicit";
  throw new Error("FTP_SECURE değeri true, false veya implicit olmalı.");
}

async function ask(rl, question, fallback = "") {
  const suffix = fallback ? ` (${fallback})` : "";
  const answer = await rl.question(`${question}${suffix}: `);
  return answer.trim() || fallback;
}

async function askHidden(question) {
  if (!input.isTTY) {
    const rl = createInterface({ input, output });
    try {
      return (await rl.question(question)).trim();
    } finally {
      rl.close();
    }
  }

  return new Promise((resolve) => {
    let value = "";
    output.write(question);
    input.setRawMode(true);
    input.resume();
    input.setEncoding("utf8");

    function onData(chunk) {
      const char = String(chunk);
      if (char === "\u0003") {
        output.write("\n");
        process.exit(130);
      }
      if (char === "\r" || char === "\n" || char === "\u0004") {
        output.write("\n");
        input.setRawMode(false);
        input.pause();
        input.off("data", onData);
        resolve(value.trim());
        return;
      }
      if (char === "\u007f" || char === "\b") {
        value = value.slice(0, -1);
        return;
      }
      value += char;
    }

    input.on("data", onData);
  });
}

function runStaticBuild() {
  const result = spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "build:static-hosting"], {
    stdio: "inherit",
    env: { ...process.env },
  });
  if (result.status !== 0) {
    throw new Error("Statik hosting build başarısız oldu; FTP yükleme yapılmadı.");
  }
}

function assertOutputDirectory() {
  if (!existsSync(outputDirectory) || !statSync(outputDirectory).isDirectory()) {
    throw new Error(`${outputDirectory} klasörü bulunamadı. Önce npm run build:static-hosting çalıştırın.`);
  }
}

async function main() {
  if (!hasArg("--skip-build")) runStaticBuild();
  assertOutputDirectory();

  const rl = createInterface({ input, output });
  const host = await ask(rl, "FTP sunucu adresi", env("FTP_HOST", "ftp.bursaekspertiz.com"));
  const port = parsePort(await ask(rl, "FTP port", env("FTP_PORT", "21")));
  const user = await ask(rl, "FTP kullanıcı adı", env("FTP_USER"));
  const remoteDir = await ask(rl, "Uzak klasör", env("FTP_REMOTE_DIR", "/public_html"));
  const secure = parseSecure(await ask(rl, "Bağlantı türü: true=FTPS, false=FTP, implicit=FTPS 990", env("FTP_SECURE", "true")));
  rl.close();

  const password = env("FTP_PASSWORD") || await askHidden("FTP şifresi (ekranda görünmez): ");
  if (!host || !user || !password || !remoteDir) {
    throw new Error("FTP host, kullanıcı, şifre ve uzak klasör zorunludur.");
  }

  const config = { host, port, user, password, remoteDir, secure };

  const client = new ftp.Client(60_000);
  client.ftp.verbose = hasArg("--verbose");

  try {
    await client.access({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      secure: config.secure,
      secureOptions: { rejectUnauthorized: false },
    });

    await client.ensureDir(config.remoteDir);
    if (hasArg("--clean")) {
      output.write(`Uyarı: ${config.remoteDir} içeriği temizlenecek.\n`);
      await client.clearWorkingDir();
    }

    await client.uploadFromDir(outputDirectory);
    output.write(`FTP yükleme tamamlandı: ${config.host}:${config.remoteDir}\n`);
  } finally {
    client.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
