import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı",
  description: "Aradığınız sayfa bulunamadı. Ekspertiz Bursa ana sayfasına dönün veya oto ekspertiz paketlerini inceleyin.",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <SiteShell>
      <section className="subpage-hero">
        <div className="page-shell narrow-shell">
          <p className="eyebrow eyebrow-light">404 · Sayfa bulunamadı</p>
          <h1>Aradığınız sayfaya ulaşılamıyor.</h1>
          <p>Bağlantı değişmiş veya sayfa kaldırılmış olabilir. Ana sayfaya dönebilir ya da güncel ekspertiz paketlerini inceleyebilirsiniz.</p>
          <div className="button-row">
            <Link className="button button-primary" href="/">Ana sayfaya dön</Link>
            <Link className="button button-light" href="/paketler">Paketleri incele</Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
