import { readFileSync } from "node:fs";

const path = process.argv[2] ?? "outputs/seo-audit/production/latest/report.json";
const report = JSON.parse(readFileSync(path, "utf8"));
const critical = report.issues.filter((issue) => issue.severity === "critical");
if (critical.length) {
  console.error(`SEO quality gate failed with ${critical.length} critical finding(s).`);
  process.exitCode = 1;
} else {
  console.log(`SEO quality gate passed: ${report.totalScore}/100.`);
}
