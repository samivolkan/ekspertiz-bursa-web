import type { Metadata } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { siteConfig } from "@/lib/site";

const themeInitScript = `(()=>{try{const key="ekspertiz_bursa_theme_v1";const saved=localStorage.getItem(key);document.documentElement.dataset.theme=saved==="amber"||saved==="red"?saved:"red";}catch{document.documentElement.dataset.theme="red";}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.canonicalUrl),
  title: {
    default: "Ekspertiz Bursa | Bursa Oto Ekspertiz ve Randevu",
    template: "%s | Ekspertiz Bursa",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
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
        url: "/og-red.png",
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
    images: ["/og-red.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-theme="red" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}<Analytics /></body>
    </html>
  );
}
