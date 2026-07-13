import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { assertSafeBranch, fixExternalLinkRel } from "./fixers.mjs";

function collectFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? collectFiles(path) : [path];
  });
}

const dryRun = process.argv.includes("--dry-run");
const branchResult = spawnSync("git", ["branch", "--show-current"], { encoding: "utf8", windowsHide: true });
if (branchResult.status !== 0) throw new Error(branchResult.stderr || "Unable to determine current branch.");
const branch = branchResult.stdout.trim();
assertSafeBranch(branch, dryRun);

const files = ["app", "components"]
  .flatMap(collectFiles)
  .filter((path) => /\.tsx?$/.test(path));
const fixes = [];

for (const path of files) {
  const source = readFileSync(path, "utf8");
  const result = fixExternalLinkRel(source);
  if (!result.changed) continue;
  fixes.push({ path, fix: "noopener_noreferrer", changes: result.changed });
  if (!dryRun) writeFileSync(path, result.output, "utf8");
}

mkdirSync("outputs/seo-audit", { recursive: true });
const summary = {
  generatedAt: new Date().toISOString(),
  branch,
  dryRun,
  changedFiles: fixes.length,
  changes: fixes.reduce((total, item) => total + item.changes, 0),
  fixes,
};
writeFileSync("outputs/seo-audit/fix-result.json", `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(`${dryRun ? "Dry-run" : "Auto-fix"}: ${summary.changes} safe changes across ${summary.changedFiles} files.`);
