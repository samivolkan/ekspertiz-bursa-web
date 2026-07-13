import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function readJson(path, fallback) {
  try { return JSON.parse(readFileSync(path, "utf8")); } catch { return fallback; }
}

function summaryMarkdown(report) {
  const issueLines = report.issues.slice(0, 15).map((issue) =>
    `- **${issue.severity.toUpperCase()}** ${issue.title}${issue.affectedUrls.length ? ` — ${issue.affectedUrls.slice(0, 3).join(", ")}` : ""}`,
  );
  const human = report.issues.filter((issue) => issue.humanActionRequired).map((issue) => `- ${issue.title}: ${issue.affectedUrls.join(", ") || issue.recommendation}`);
  return [
    `# SEO Günlük Raporu — ${report.totalScore}/100`,
    "",
    `- Tarih: ${report.generatedAt}`,
    `- Hedef: ${report.target}`,
    `- Önceki puan: ${report.previousScore ?? "İlk ölçüm"}`,
    `- Günlük fark: ${report.delta === null ? "—" : report.delta >= 0 ? `+${report.delta}` : report.delta}`,
    `- Taranan/indekslenebilir sayfa: ${report.stats.crawledPages}/${report.stats.indexablePages}`,
    "",
    "## Kategori puanları",
    "",
    ...Object.values(report.categories).map((category) => `- ${category.label}: **${category.score}/${category.weight}**`),
    "",
    "## Öncelikli bulgular",
    "",
    ...(issueLines.length ? issueLines : ["- Kritik veya yüksek öncelikli bulgu yok."]),
    "",
    "## İnsan müdahalesi gerekenler",
    "",
    ...(human.length ? human : ["- Yok."]),
    "",
    `Son 7 ölçüm: ${report.trend7.map((entry) => `${entry.score} (${entry.generatedAt.slice(0, 10)})`).join(" → ") || "İlk ölçüm"}`,
  ].join("\n");
}

function htmlReport(report) {
  const categories = Object.values(report.categories).map((category) => `
    <article><div><strong>${escapeHtml(category.label)}</strong><span>${category.score}/${category.weight}</span></div><progress max="${category.weight}" value="${category.score}"></progress></article>`).join("");
  const issues = report.issues.map((issue) => `
    <article class="issue ${issue.severity}">
      <header><span>${escapeHtml(issue.severity)}</span><strong>${escapeHtml(issue.title)}</strong><em>-${issue.deduction}</em></header>
      <p>${escapeHtml(issue.recommendation)}</p>
      ${issue.affectedUrls.length ? `<details><summary>Etkilenen alanlar (${issue.affectedUrls.length})</summary><ul>${issue.affectedUrls.map((url) => `<li>${escapeHtml(url)}</li>`).join("")}</ul></details>` : ""}
      <footer>${issue.autoFixable ? "Otomatik düzeltilebilir" : issue.humanActionRequired ? "İnsan müdahalesi gerekli" : "Kod/işletme incelemesi gerekli"}</footer>
    </article>`).join("");
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SEO Günlük Raporu — ${report.totalScore}/100</title><style>
    :root{color-scheme:light;font-family:Inter,system-ui,sans-serif;background:#f5f2e9;color:#161a1b}*{box-sizing:border-box}body{margin:0}.wrap{width:min(1100px,calc(100% - 32px));margin:32px auto}.hero{background:#161a1b;color:white;border-radius:24px;padding:32px;display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:center}.score{display:grid;place-items:center;width:150px;height:150px;border:12px solid #ffb200;border-radius:50%;font-size:36px;font-weight:900}.hero h1{margin:0 0 10px}.hero p{margin:5px 0;color:#d8dddd}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin:24px 0}.grid article,.issue{background:white;border:1px solid #ded9ce;border-radius:16px;padding:18px}.grid article div{display:flex;justify-content:space-between;gap:20px}progress{width:100%;accent-color:#ffb200;margin-top:12px}.issues{display:grid;gap:12px}.issue header{display:flex;align-items:center;gap:12px}.issue header span{text-transform:uppercase;font-size:12px;font-weight:800}.issue header strong{flex:1}.issue header em{font-style:normal}.issue.critical{border-left:6px solid #b42318}.issue.high{border-left:6px solid #e5484d}.issue.medium{border-left:6px solid #f2a20c}.issue.low{border-left:6px solid #3b82f6}.issue.info{border-left:6px solid #6b7280}.issue footer{font-size:13px;font-weight:700;color:#687273}.muted{color:#687273}@media(max-width:720px){.hero{grid-template-columns:1fr}.score{width:120px;height:120px}.grid{grid-template-columns:1fr}}
  </style></head><body><main class="wrap"><section class="hero"><div class="score">${report.totalScore}</div><div><h1>SEO Günlük Sağlık Raporu</h1><p>${escapeHtml(report.target)}</p><p>${escapeHtml(report.generatedAt)} · Önceki: ${report.previousScore ?? "İlk ölçüm"} · Fark: ${report.delta ?? "—"}</p></div></section><section class="grid">${categories}</section><h2>Bulgular</h2><p class="muted">${report.stats.crawledPages} sayfa tarandı; ${report.stats.indexablePages} sayfa indekslenebilir.</p><section class="issues">${issues || "<p>Bulgu yok.</p>"}</section></main></body></html>`;
}

export function writeReports({ label, target, result, outputRoot = "outputs/seo-audit", historyRoot = ".seo-audit-history" }) {
  mkdirSync(outputRoot, { recursive: true });
  mkdirSync(historyRoot, { recursive: true });
  const historyPath = join(historyRoot, `${label}.json`);
  const history = readJson(historyPath, []);
  const previous = history.at(-1) ?? null;
  const generatedAt = new Date().toISOString();
  const report = {
    schemaVersion: 1,
    generatedAt,
    label,
    target,
    previousScore: previous?.score ?? null,
    delta: previous ? Math.round((result.totalScore - previous.score) * 10) / 10 : null,
    trend7: [...history.slice(-6), { generatedAt, score: result.totalScore }],
    ...result,
    build: { lint: null, typeCheck: null, tests: null, productionBuild: null },
    appliedFixes: [],
  };
  const safeTimestamp = generatedAt.replace(/[:.]/g, "-");
  const runDirectory = join(outputRoot, label, safeTimestamp);
  const latestDirectory = join(outputRoot, label, "latest");
  mkdirSync(runDirectory, { recursive: true });
  rmSync(latestDirectory, { recursive: true, force: true });
  mkdirSync(latestDirectory, { recursive: true });
  const payloads = {
    "report.json": `${JSON.stringify(report, null, 2)}\n`,
    "report.html": htmlReport(report),
    "summary.md": `${summaryMarkdown(report)}\n`,
  };
  for (const [name, value] of Object.entries(payloads)) {
    writeFileSync(join(runDirectory, name), value, "utf8");
    copyFileSync(join(runDirectory, name), join(latestDirectory, name));
  }
  const updatedHistory = [...history, { generatedAt, score: result.totalScore }].slice(-30);
  writeFileSync(historyPath, `${JSON.stringify(updatedHistory, null, 2)}\n`, "utf8");
  return { report, runDirectory, latestDirectory };
}

export function renderLatest(label = "production", outputRoot = "outputs/seo-audit") {
  const path = join(outputRoot, label, "latest", "report.json");
  if (!existsSync(path)) throw new Error(`Latest ${label} report not found.`);
  const report = readJson(path, null);
  if (!report) throw new Error(`Latest ${label} report is not valid JSON.`);
  writeFileSync(join(outputRoot, label, "latest", "report.html"), htmlReport(report), "utf8");
  writeFileSync(join(outputRoot, label, "latest", "summary.md"), `${summaryMarkdown(report)}\n`, "utf8");
  return report;
}
