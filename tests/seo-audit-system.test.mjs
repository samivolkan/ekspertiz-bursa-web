import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import { CATEGORY_DEFINITIONS, EXPECTED_TOTAL, REQUIRED_CONVERSION_EVENTS } from "../scripts/seo-audit/config.mjs";
import { fetchWithRetry } from "../scripts/seo-audit/crawler.mjs";
import { runChecks } from "../scripts/seo-audit/checks.mjs";
import { assertSafeBranch, fixExternalLinkRel } from "../scripts/seo-audit/fixers.mjs";
import { writeReports } from "../scripts/seo-audit/report.mjs";
import { measurePageSpeed } from "../scripts/seo-audit/lighthouse.mjs";
import { findTrackingIssue, TRACKING_TITLE } from "../scripts/seo-audit/update-github-issue.mjs";

const temporaryDirectories = [];
after(() => temporaryDirectories.forEach((path) => rmSync(path, { recursive: true, force: true })));

test("SEO category weights total exactly 100", () => {
  assert.equal(EXPECTED_TOTAL, 100);
  assert.equal(Object.values(CATEGORY_DEFINITIONS).reduce((total, item) => total + item.weight, 0), 100);
});

test("category scores never become negative", () => {
  const result = runChecks({
    mode: "live",
    origin: "https://www.bursaekspertiz.com",
    pages: [{ route: "/", url: "https://www.bursaekspertiz.com/", status: 500, html: "", headers: {} }],
    robots: "",
    sitemap: "",
    sourceText: "",
    assetSize: () => null,
    routeExists: () => false,
  });
  for (const category of Object.values(result.categories)) {
    assert.ok(category.score >= 0);
    assert.ok(category.score <= category.weight);
  }
});

test("safe external link fixer is idempotent", () => {
  const source = '<a href="https://example.com" target="_blank" rel="noreferrer">Örnek</a>';
  const first = fixExternalLinkRel(source);
  const second = fixExternalLinkRel(first.output);
  assert.equal(first.changed, 1);
  assert.match(first.output, /rel="noreferrer noopener"|rel="noopener noreferrer"/);
  assert.equal(second.changed, 0);
  assert.equal(second.output, first.output);
});

test("auto-fix refuses protected branches", () => {
  assert.throws(() => assertSafeBranch("main"), /refuses to write directly/);
  assert.doesNotThrow(() => assertSafeBranch("automation/seo-fixes-2026-07-14"));
  assert.doesNotThrow(() => assertSafeBranch("main", true));
});

test("production fetch retries transient 5xx responses", async () => {
  let requests = 0;
  const server = createServer((request, response) => {
    requests += 1;
    if (requests < 3) {
      response.writeHead(503, { "content-type": "text/plain" });
      response.end("temporary");
      return;
    }
    response.writeHead(200, { "content-type": "text/plain" });
    response.end("ok");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const address = server.address();
    assert.ok(address && typeof address === "object");
    const response = await fetchWithRetry(`http://127.0.0.1:${address.port}/`, {}, 3);
    assert.equal(response.status, 200);
    assert.equal(requests, 3);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("PageSpeed quota errors never invent Lighthouse scores", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response("quota", { status: 429 });
  try {
    const result = await measurePageSpeed("https://www.bursaekspertiz.com/");
    assert.equal(result.performance, null);
    assert.equal(result.seo, null);
    assert.match(result.note, /429/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("report writer produces JSON HTML Markdown and trend history", () => {
  const root = mkdtempSync(join(tmpdir(), "seo-audit-test-"));
  temporaryDirectories.push(root);
  const result = {
    totalScore: 100,
    categories: Object.fromEntries(Object.entries(CATEGORY_DEFINITIONS).map(([key, value]) => [key, { ...value, score: value.weight }])),
    issues: [],
    stats: { crawledPages: 27, indexablePages: 27, sitemapUrls: 27 },
    lighthouse: { performance: null, note: "test" },
  };
  const outputRoot = join(root, "outputs");
  const historyRoot = join(root, "history");
  const { report, latestDirectory } = writeReports({ label: "test", target: "https://example.com", result, outputRoot, historyRoot });
  assert.equal(report.schemaVersion, 1);
  assert.equal(JSON.parse(readFileSync(join(latestDirectory, "report.json"), "utf8")).totalScore, 100);
  assert.match(readFileSync(join(latestDirectory, "report.html"), "utf8"), /SEO Günlük Sağlık Raporu/);
  assert.match(readFileSync(join(latestDirectory, "summary.md"), "utf8"), /100\/100/);
});

test("single GitHub tracking issue is selected without creating duplicates", () => {
  const issue = findTrackingIssue([
    { number: 1, title: "Başka issue" },
    { number: 2, title: TRACKING_TITLE, body: "" },
    { number: 3, title: TRACKING_TITLE, pull_request: {} },
  ]);
  assert.equal(issue?.number, 2);
});

test("analytics source declares every required event and excludes PII parameters", () => {
  const source = readFileSync("lib/analytics.ts", "utf8");
  for (const event of REQUIRED_CONVERSION_EVENTS) assert.ok(source.includes(`"${event}"`), event);
  for (const piiKey of ["fullName", "email", "phone_number", "vehicle", "plate", "message"]) {
    assert.equal(new RegExp(`["']${piiKey}["']`).test(source), false, piiKey);
  }
});
