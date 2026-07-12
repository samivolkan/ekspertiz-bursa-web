import { existsSync, renameSync } from "node:fs";
import { spawnSync } from "node:child_process";

const apiDirectory = "app/api";
const parkedApiDirectory = ".github-pages-api";

if (existsSync(parkedApiDirectory)) {
  throw new Error(`${parkedApiDirectory} already exists; refusing to overwrite it.`);
}

try {
  if (existsSync(apiDirectory)) renameSync(apiDirectory, parkedApiDirectory);
  const result = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
    stdio: "inherit",
    env: {
      ...process.env,
      GITHUB_PAGES: "true",
      NEXT_PUBLIC_GITHUB_PAGES: "true",
      NEXT_PUBLIC_BASE_PATH: "/ekspertiz-bursa-web",
    },
  });
  if (result.status !== 0) process.exitCode = result.status ?? 1;
} finally {
  if (existsSync(parkedApiDirectory)) renameSync(parkedApiDirectory, apiDirectory);
}
