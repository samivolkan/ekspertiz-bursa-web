import { readFileSync } from "node:fs";

const [beforePath, afterPath] = process.argv.slice(2);
if (!beforePath || !afterPath) throw new Error("Usage: compare-scores.mjs <before.json> <after.json>");
const before = JSON.parse(readFileSync(beforePath, "utf8"));
const after = JSON.parse(readFileSync(afterPath, "utf8"));
if (after.totalScore <= before.totalScore) {
  console.error(`Auto-fix did not improve the score (${before.totalScore} -> ${after.totalScore}).`);
  process.exitCode = 1;
} else {
  console.log(`Auto-fix score improved: ${before.totalScore} -> ${after.totalScore}.`);
}
