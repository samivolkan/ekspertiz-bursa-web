import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { packages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Oto Ekspertiz Paketleri ve Fiyatları",
  description: "Ekspertiz Bursa Kaporta, Motor-Mekanik, Mini, Orta, Tam ve Full paket kapsamlarını ve paylaşılan fiyatları karşılaştırın.",
  alternates: { canonical: "/paketler" },
};

export default function PackagesPage() {
  return (
    <SiteShell>
      <section className="subpage-hero">
        <div className="page-shell">
          <p className="eyebrow eyebrow-light">Oto ekspertiz paketleri</p>
          <h1>İhtiyacınıza göre net kapsam, açık fiyat.</h1>
          <p>Tek alana odaklanan kontrollerden airbag dahil en geniş pakete kadar tüm seçenekleri karşılaştırın.</p>
        </div>
      </section>
      <section className="section section-paper">
        <div className="page-shell">
          <div className="draft-alert">
            <strong>Fiyat ve süre notu:</strong> Kaporta ve Motor-Mekanik paketleri 3.500 TL, Mini 5.000 TL, Orta 7.500 TL, Tam 10.000 TL ve Full 12.500 TL&apos;dir. Paket süreleri yaklaşık 15–40 dakika arasındadır ve aracın durumuna göre değişebilir. KDV durumunu 0552 741 51 43 numaralı telefondan teyit edebilirsiniz.
          </div>
          <div className="package-detail-grid">
            {packages.map((item) => (
              <article className={`package-detail-card ${item.slug === "full" ? "featured" : ""}`} id={item.slug} key={item.slug}>
                {item.slug === "full" ? <span className="popular-package-badge">En çok tercih edilen paket</span> : null}
                <div className="package-detail-header"><h2>{item.name}</h2><span>{item.badge}</span></div>
                <p>{item.description}</p>
                <div className="package-best"><strong>Uygun kullanım:</strong> {item.bestFor}</div>
                <ul>{item.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                <div className="package-detail-footer">
                  <p><span>Süre</span><strong>{item.duration}</strong></p>
                  <p><span>Fiyat</span><strong>{item.price ?? "Bilgi için arayın"}</strong></p>
                  <Link className={item.slug === "full" ? "button button-primary button-full" : "button button-dark button-full"} href={`/randevu?paket=${item.slug}`} data-event={`package_detail_${item.slug}_click`}>
                    Bu paketle randevu al
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="final-cta">
        <div className="page-shell final-cta-inner">
          <div><p className="eyebrow eyebrow-light">Paket seçiminizden emin değil misiniz?</p><h2>Araç bilgilerinizi paylaşın, kapsamı birlikte netleştirelim.</h2></div>
          <Link className="button button-primary" href="/randevu">Randevu talebi oluştur</Link>
        </div>
      </section>
    </SiteShell>
  );
}
