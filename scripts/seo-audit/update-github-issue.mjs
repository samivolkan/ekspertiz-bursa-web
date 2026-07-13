import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const TRACKING_TITLE = "SEO Günlük Sağlık ve Eksik Takibi";

export function findTrackingIssue(issues) {
  return issues.find((issue) => issue.title === TRACKING_TITLE && !issue.pull_request) ?? null;
}

function currentBody(report, previousBody = "") {
  const previousItems = [...previousBody.matchAll(/- \[[ x]\] (.*?) <!-- seo-code:([^ ]+) -->/g)]
    .map((match) => ({ title: match[1], code: match[2] }));
  const open = report.issues.filter((issue) => issue.severity !== "info");
  const openCodes = new Set(open.map((issue) => issue.code));
  const resolved = previousItems.filter((item) => !openCodes.has(item.code));
  const human = report.issues.filter((issue) => issue.humanActionRequired);
  return [
    `# Son durum: ${report.totalScore}/100`,
    "",
    `Son audit: ${report.generatedAt}`,
    `Önceki puan: ${report.previousScore ?? "İlk ölçüm"} · Fark: ${report.delta ?? "—"}`,
    "",
    "## Açık maddeler",
    "",
    ...(open.length ? open.map((issue) => `- [ ] ${issue.title} <!-- seo-code:${issue.code} -->`) : ["- [x] Kritik veya yüksek öncelikli açık madde yok."]),
    "",
    "## Çözülen maddeler",
    "",
    ...(resolved.length ? resolved.map((item) => `- [x] ${item.title} <!-- seo-code:${item.code} -->`) : ["- Yeni çözülen madde yok."]),
    "",
    "## Kullanıcı müdahalesi gerekenler",
    "",
    ...(human.length ? human.map((issue) => `- [ ] ${issue.title}: ${issue.affectedUrls.join(", ") || issue.recommendation}`) : ["- Yok."]),
    "",
    "Günlük JSON ve HTML raporları workflow artifact'i olarak saklanır; bu issue tek takip kaydıdır.",
  ].join("\n");
}

function alertRequired(report) {
  const alertCodes = new Set(["server_or_network_error", "robots_block", "missing_sitemap", "sitemap_mismatch", "canonical_mismatch", "analytics_event_coverage", "whatsapp_cta", "appointment_flow"]);
  return report.totalScore < 90
    || (report.delta !== null && report.delta <= -3)
    || report.issues.some((issue) => issue.severity === "critical" || alertCodes.has(issue.code));
}

async function githubRequest(path, token, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!response.ok) throw new Error(`GitHub API ${response.status}: ${await response.text()}`);
  return response.status === 204 ? null : response.json();
}

async function notifyWebhook(url, payload) {
  if (!url) return;
  try {
    const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) console.warn(`Optional webhook returned ${response.status}.`);
  } catch (error) {
    console.warn(`Optional webhook failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  const reportPath = process.argv[2] ?? "outputs/seo-audit/production/latest/report.json";
  if (!token || !repository) throw new Error("GITHUB_TOKEN and GITHUB_REPOSITORY are required.");
  const report = JSON.parse(readFileSync(reportPath, "utf8"));
  const issues = await githubRequest(`/repos/${repository}/issues?state=open&per_page=100`, token);
  let issue = findTrackingIssue(issues);
  const body = currentBody(report, issue?.body ?? "");
  if (!issue) {
    issue = await githubRequest(`/repos/${repository}/issues`, token, { method: "POST", body: JSON.stringify({ title: TRACKING_TITLE, body }) });
  } else {
    issue = await githubRequest(`/repos/${repository}/issues/${issue.number}`, token, { method: "PATCH", body: JSON.stringify({ body }) });
  }
  const summary = `Günlük audit: **${report.totalScore}/100** · ${report.delta === null ? "ilk ölçüm" : `fark ${report.delta >= 0 ? "+" : ""}${report.delta}`} · ${report.issues.filter((item) => item.severity === "critical").length} kritik bulgu.\n\n${report.issues.slice(0, 8).map((item) => `- ${item.severity.toUpperCase()}: ${item.title}`).join("\n") || "Açık bulgu yok."}`;
  await githubRequest(`/repos/${repository}/issues/${issue.number}/comments`, token, { method: "POST", body: JSON.stringify({ body: summary }) });
  if (alertRequired(report)) {
    const text = `Ekspertiz Bursa SEO uyarısı: ${report.totalScore}/100 (${report.delta ?? "ilk ölçüm"}). ${issue.html_url}`;
    await Promise.all([
      notifyWebhook(process.env.SLACK_WEBHOOK_URL, { text }),
      notifyWebhook(process.env.DISCORD_WEBHOOK_URL, { content: text }),
    ]);
  }
  console.log(`SEO tracking issue updated: ${issue.html_url}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
