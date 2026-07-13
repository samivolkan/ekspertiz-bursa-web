import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const isStaticHosting = process.env.STATIC_HOSTING === "true";

const nextConfig: NextConfig = {
  ...(isGitHubPages || isStaticHosting
    ? {
        output: "export" as const,
        ...(isGitHubPages
          ? {
              basePath: "/ekspertiz-bursa-web",
              assetPrefix: "/ekspertiz-bursa-web/",
            }
          : {}),
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
