import {
  copyFileSync,
  existsSync,
  readFileSync,
  readdirSync,
  renameSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { spawnSync } from "node:child_process";
import { extname, join } from "node:path";

const apiDirectory = "app/api";
const parkedApiDirectory = ".static-hosting-api";

function collectFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? collectFiles(path) : [path];
  });
}

function sanitizeSharedHostingAssetNames(outputDirectory) {
  const renamePairs = collectFiles(outputDirectory)
    .filter((path) => path.includes("~"))
    .map((oldPath) => {
      const newPath = oldPath.replaceAll("~", "-");
      if (existsSync(newPath)) {
        throw new Error(`Cannot sanitize ${oldPath}; ${newPath} already exists.`);
      }
      renameSync(oldPath, newPath);
      return {
        oldName: oldPath.split(/[\\/]/).at(-1),
        newName: newPath.split(/[\\/]/).at(-1),
      };
    });

  const textExtensions = new Set([".css", ".html", ".js", ".json", ".txt", ".xml"]);
  for (const path of collectFiles(outputDirectory)) {
    if (!textExtensions.has(extname(path))) continue;
    const original = readFileSync(path, "utf8");
    const updated = renamePairs.reduce(
      (content, pair) => content.replaceAll(pair.oldName, pair.newName),
      original,
    );
    if (updated !== original) writeFileSync(path, updated, "utf8");
  }
}

if (existsSync(parkedApiDirectory)) {
  throw new Error(`${parkedApiDirectory} already exists; refusing to overwrite it.`);
}

try {
  if (existsSync(apiDirectory)) renameSync(apiDirectory, parkedApiDirectory);
  const result = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
    stdio: "inherit",
    env: {
      ...process.env,
      STATIC_HOSTING: "true",
      NEXT_PUBLIC_STATIC_HOSTING: "true",
    },
  });
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
  } else {
    sanitizeSharedHostingAssetNames("out");
    copyFileSync("hosting/.htaccess", "out/.htaccess");
  }
} finally {
  if (existsSync(parkedApiDirectory)) renameSync(parkedApiDirectory, apiDirectory);
}
