import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true"
  ? "https://samivolkan.github.io/ekspertiz-bursa-web"
  : "https://www.bursaekspertiz.com";

const blockedPaths = [
  "/api/",
  "/_sites-preview/",
  "/wp-admin/",
  "/wp-login.php",
  "/xmlrpc.php",
  "/*.php$",
  "/*.zip$",
];

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "AdsBot-Google",
        allow: "/",
      },
      {
        userAgent: "AdsBot-Google-Mobile",
        allow: "/",
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: blockedPaths,
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: blockedPaths,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
