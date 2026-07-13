import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true"
  ? "https://samivolkan.github.io/ekspertiz-bursa-web"
  : "https://bursaekspertiz.com";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_sites-preview/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
