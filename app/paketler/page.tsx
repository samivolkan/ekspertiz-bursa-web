import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { absoluteUrl, breadcrumbSchema, createPageMetadata } from "@/lib/seo";
import { packages, siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Oto Ekspertiz Paketleri ve Fiyatları",
  description: "Ekspertiz Bursa Mini Ekspertiz Kaporta, Mini Ekspertiz Motor-Mekanik, Mini, Orta, Tam ve Full paket kapsamlarını ve güncel fiyatlarını karşılaştırın.",
  path: "/paketler",
  keywords: ["Bursa oto ekspertiz fiyatları", "oto ekspertiz paketleri", "Nilüfer oto ekspertiz", "araç ekspertiz fiyatı"],
});

const packagesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Bursa oto ekspertiz paketleri ve fiyatları",
  url: absoluteUrl("/paketler"),
  numberOfItems: packages.length,
  itemListElement: packages.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      "@id": `${absoluteUrl("/paketler")}#${item.slug}`,
      name: item.name,
      description: item.description,
      provider: { "@id": `${siteConfig.canonicalUrl}/#business` },
      areaServed: siteConfig.city,
      ...(item.price ? { offers: { "@type": "Offer", price: item.price.replace(/\D/g, ""), priceCurrency: "TRY", url: `${absoluteUrl("/paketler")}#${item.slug}` } } : {}),
    },
  })),
};

const packagesBreadcrumbSchema = breadcrumbSchema([
  { name: "Ana sayfa", path: "/" },
  { name: "Oto ekspertiz paketleri", path: "/paketler" },
]);

export default function PackagesPage() {
  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(packagesSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(packagesBreadcrumbSchema) }} />
      <section className="subpage-hero" data-page-event="package_view">
        <div className="page-shell">
          <Breadcrumbs items={[{ label: "Ana sayfa", href: "/" }, { label: "Paketler" }]} />
          <p className="eyebrow eyebrow-light">Oto ekspertiz paketleri</p>
          <h1>İhtiyacınıza göre net kapsam, açık fiyat.</h1>
          <p>Tek alana odaklanan kontrollerden airbag dahil en geniş pakete kadar tüm seçenekleri karşılaştırın.</p>
        </div>
      </section>
      <section className="section section-paper">
        <div className="page-shell">
          <div className="package-scope-note">
            <strong>Kontrol kapsamını açın</strong>
            <p>Her karttaki “Paket özellikleri” alanından ana kontrol gruplarını ve alt başlıkları inceleyebilirsiniz. Başlıklar araç modeli, teknik uygunluk ve erişilebilirliğe göre uygulanır; parça sökümü yapılmaz. {siteConfig.priceTaxNote}</p>
          </div>
          <div className="package-detail-grid">
            {packages.map((item) => {
              const controlHeadingCount = item.featureGroups.reduce((total, group) => total + group.items.length, 0);

              return <article className={`package-detail-card ${item.slug === "full" ? "featured" : ""}`} id={item.slug} key={item.slug}>
                {item.slug === "full" ? <span className="popular-package-badge">En çok tercih edilen paket</span> : null}
                <div className="package-detail-header"><h2>{item.name}</h2><span>{item.badge}</span></div>
                <p>{item.description}</p>
                <div className="package-best"><strong>Uygun kullanım:</strong> {item.bestFor}</div>
                <ul>{item.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                <div className="package-detail-footer">
                  <Link className={item.slug === "full" ? "button button-primary button-full" : "button button-dark button-full"} href={`/randevu?paket=${item.slug}`} data-event={`package_detail_${item.slug}_click`} data-analytics-event="package_select" data-package-name={item.name} data-cta-location="packages_page">
                    Bu paketle randevu al
                  </Link>
                </div>
                <details className="package-feature-disclosure" data-control-heading-count={controlHeadingCount}>
                  <summary>
                    <span>Paket özellikleri</span>
                    <span className="package-feature-price-meta">
                      <span><small>Süre</small><b>{item.duration}</b></span>
                      <span><small>Fiyat</small><b>{item.price ?? "Bilgi için arayın"}</b></span>
                    </span>
                    <strong>{controlHeadingCount} kontrol başlığı</strong>
                    <i aria-hidden="true">+</i>
                  </summary>
                  <div className="package-feature-groups">
                    {item.featureGroups.map((group) => (
                      <details className="package-feature-group" key={group.name}>
                        <summary>
                          <span>{group.name}</span>
                          <strong>{group.items.length}</strong>
                          <i aria-hidden="true">+</i>
                        </summary>
                        <ul>{group.items.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                      </details>
                    ))}
                  </div>
                </details>
              </article>;
            })}
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
