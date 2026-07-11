import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";

const port = 4317;
const baseUrl = `http://localhost:${port}`;
let server;
let serverLog = "";

before(async () => {
  const cwd = fileURLToPath(new URL("../", import.meta.url));
  const command = process.platform === "win32" ? (process.env.ComSpec || "cmd.exe") : "npm";
  const args = process.platform === "win32"
    ? ["/d", "/s", "/c", `npm.cmd run dev -- --host 127.0.0.1 --port ${port}`]
    : ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(port)];
  server = spawn(command, args, {
    cwd,
    env: { ...process.env, NODE_ENV: "production" },
    windowsHide: true,
  });
  server.stdout?.on("data", (chunk) => { serverLog += chunk.toString(); });
  server.stderr?.on("data", (chunk) => { serverLog += chunk.toString(); });

  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Test server exited early.\n${serverLog}`);
    }
    try {
      const response = await fetch(`${baseUrl}/`);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Test server did not become ready.\n${serverLog}`);
});

after(() => {
  if (!server?.pid) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], { windowsHide: true });
  } else {
    server.kill("SIGTERM");
  }
});

test("renders the Ekspertiz Bursa buyer flow with verified business data", async () => {
  const response = await fetch(`${baseUrl}/`);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="tr"/i);
  assert.match(html, /Ekspertiz Bursa/);
  assert.match(html, /Aracı almadan önce/);
  assert.match(html, /Full Paket/);
  assert.match(html, /En çok tercih edilen paket/);
  assert.match(html, /5\.000 TL/);
  assert.match(html, /7\.500 TL/);
  assert.match(html, /10\.000 TL/);
  assert.match(html, /12\.500 TL/);
  assert.match(html, /0552 741 51 43/);
  assert.match(html, /Mo-Su 08:30-18:30/);
  assert.match(html, /"telephone":"\+905527415143"/);
  assert.match(html, /"email":"info@ekspertizbursa\.com"/);
  assert.doesNotMatch(html, /Telefon, çalışma saatleri.*onay bekliyor/);
  assert.match(html, /Üçevler Mahallesi/);
  assert.match(html, /"@type":"AutoRepair"/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview|react-loading-skeleton/);
});

test("renders conversion, package and legal routes", async () => {
  for (const [path, expected] of [
    ["/randevu", "Ekspertiz için uygun günü planlayın"],
    ["/paketler", "İhtiyacınıza göre net kapsam"],
    ["/hizmetler", "Aracın farklı sistemlerini"],
    ["/iletisim", "Nilüfer şubemiz"],
    ["/kvkk", "KVKK Aydınlatma Metni"],
    ["/cerez-politikasi", "Çerez Politikası"],
  ]) {
    const response = await fetch(`${baseUrl}${path}`);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), new RegExp(expected), path);
  }
});

test("renders verified contact channels and business hours", async () => {
  const response = await fetch(`${baseUrl}/iletisim`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /href="tel:\+905527415143"/);
  assert.match(html, /wa\.me\/905527415143/);
  assert.match(html, /info@ekspertizbursa\.com/);
  assert.match(html, /Her gün 08:30–18:30/);
});

test("renders selectable amber and red themes on package pages", async () => {
  const homeResponse = await fetch(`${baseUrl}/`);
  assert.equal(homeResponse.status, 200);
  const homeHtml = await homeResponse.text();
  assert.match(homeHtml, /data-theme-choice="amber"/);
  assert.match(homeHtml, /data-theme-choice="red"/);
  assert.match(homeHtml, /ekspertiz_bursa_theme_v1/);

  const packagesResponse = await fetch(`${baseUrl}/paketler`);
  assert.equal(packagesResponse.status, 200);
  const packagesHtml = await packagesResponse.text();
  assert.match(packagesHtml, /En çok tercih edilen paket/);
});

test("rejects an incomplete appointment before persistence", async () => {
  const response = await fetch(`${baseUrl}/api/appointments`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({}),
  });
  assert.equal(response.status, 400);
  const payload = await response.json();
  assert.equal(payload.ok, false);
  assert.equal(payload.field, "kvkkAccepted");
});
