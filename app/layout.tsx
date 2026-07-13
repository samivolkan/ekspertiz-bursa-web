import type { Metadata } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { siteConfig } from "@/lib/site";
import { assetPath } from "@/lib/assets";

const isGitHubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";
const publicSiteUrl = isGitHubPages ? "https://samivolkan.github.io/ekspertiz-bursa-web" : siteConfig.canonicalUrl;

const themeInitScript = `(()=>{try{const key="ekspertiz_bursa_theme_v1";const saved=localStorage.getItem(key);document.documentElement.dataset.theme=saved==="light"||saved==="amber"||saved==="red"?saved:"light";}catch{document.documentElement.dataset.theme="light";}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(publicSiteUrl),
  title: {
    default: "Ekspertiz Bursa | Bursa Oto Ekspertiz ve Randevu",
    template: "%s | Ekspertiz Bursa",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "Otomotiv",
  formatDetection: { telephone: false, email: false, address: false },
  alternates: { canonical: "/" },
  keywords: [
    "oto ekspertiz Bursa",
    "Bursa oto ekspertiz",
    "Bursa ekspertiz randevu",
    "oto ekspertiz paketleri",
    "ikinci el araç kontrolü Bursa",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: siteConfig.name,
    title: "Ekspertiz Bursa | Aracınızı almadan önce, gerçeği görün",
    description: siteConfig.description,
    url: "/",
    images: [
      {
        url: assetPath("/og-red.png"),
        width: 1200,
        height: 630,
        alt: "Ekspertiz Bursa - Aracınızı almadan önce, gerçeği görün.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ekspertiz Bursa",
    description: siteConfig.description,
    images: [assetPath("/og-red.png")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}<Analytics /></body>
    </html>
  );
}
