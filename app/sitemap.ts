import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";

const siteUrl = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true"
  ? "https://samivolkan.github.io/ekspertiz-bursa-web"
  : "https://www.ekspertizbursa.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-12T00:00:00+03:00");
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(`${post.publishedAt}T12:00:00+03:00`),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/paketler`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/randevu`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/hizmetler`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...blogRoutes,
    {
      url: `${siteUrl}/iletisim`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/hakkimizda`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/kvkk`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/cerez-politikasi`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
