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
  assert.match(html, /12\.500 TL/);
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
