import type { Metadata } from "next";
import { assetPath } from "@/lib/assets";
import { siteConfig } from "@/lib/site";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  index?: boolean;
};

export function canonicalPath(path: string) {
  if (path === "/") return "/";
  return `${path.replace(/^\/+|\/+$/g, "")}/`.replace(/^/, "/");
}

export function absoluteUrl(path: string) {
  return `${siteConfig.canonicalUrl}${canonicalPath(path)}`;
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  index = true,
}: PageMetadataInput): Metadata {
  const canonical = canonicalPath(path);
  const socialTitle = `${title} | ${siteConfig.name}`;
  const image = assetPath("/og-red.png");

  return {
    title,
    description,
    ...(keywords.length ? { keywords } : {}),
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: siteConfig.name,
      title: socialTitle,
      description,
      url: canonical,
      images: [{ url: image, width: 1200, height: 630, alt: socialTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image],
    },
    robots: {
      index,
      follow: true,
      googleBot: {
        index,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
