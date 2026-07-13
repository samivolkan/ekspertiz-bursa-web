import { crawlLive, crawlStatic } from "./crawler.mjs";
import { runChecks } from "./checks.mjs";
import { renderLatest, writeReports } from "./report.mjs";
import { measurePageSpeed } from "./lighthouse.mjs";

function argument(name, fallback = null) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] ?? fallback : fallback;
}

const reportOnly = process.argv.includes("--report-only");
const label = argument("--label", process.argv.includes("--url") ? "production" : "local");

if (reportOnly) {
  const report = renderLatest(label);
  console.log(`SEO report refreshed: ${report.totalScore}/100 (${label}).`);
} else {
  const origin = argument("--url", "https://bursaekspertiz.com");
  const source = argument("--source", null);
  const crawl = source
    ? crawlStatic({ outputDirectory: source, origin })
    : await crawlLive({ origin });
  const result = runChecks(crawl);
  if (!source) result.lighthouse = await measurePageSpeed(origin);
  const { report, latestDirectory } = writeReports({ label, target: source ? `${source} (${origin})` : origin, result });
  console.log(`SEO audit completed: ${report.totalScore}/100, ${report.issues.length} findings, ${report.stats.crawledPages} pages.`);
  console.log(`Reports: ${latestDirectory}`);
}
