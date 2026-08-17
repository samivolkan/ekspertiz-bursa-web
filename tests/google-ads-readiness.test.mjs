import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(`${root}${path}`, "utf8");

test("publishes explicit AdsBot crawl permissions", () => {
  const robots = read("app/robots.ts");
  assert.match(robots, /userAgent: "AdsBot-Google"/);
  assert.match(robots, /userAgent: "AdsBot-Google-Mobile"/);
});

test("shows the physical branch and Bursa service scope site-wide", () => {
  const shell = read("components/SiteShell.tsx");
  const compliance = read("lib/ads-compliance.ts");
  assert.match(shell, /<AdsTransparencyBar \/>/);
  assert.match(compliance, /Nilüfer \/ Üçevler, Bursa/);
  assert.match(compliance, /Bursa geneli/);
  assert.match(compliance, /mobil\/yerinde ekspertiz hizmeti/);
});

test("ships the health endpoint and destination audit", () => {
  const health = read("public/.well-known/adsbot-health.txt");
  const audit = read("scripts/audit-google-ads-destination.mjs");
  assert.match(health, /^status=ok$/m);
  assert.match(health, /^business_operator=Bahar Gacıroğlu$/m);
  assert.match(audit, /HEAD\/GET mismatch/);
  assert.match(audit, /AdsBot-Google-Mobile/);
});
