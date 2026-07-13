import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { absoluteUrl, breadcrumbSchema, createPageMetadata } from "@/lib/seo";
import { services, siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Oto Ekspertiz Kontrolleri",
  description: "Kaporta, motor-mekanik, beyin/OBD, şanzıman, iç-dış, conta ve airbag kontrol başlıklarını inceleyin.",
  path: "/hizmetler",
  keywords: ["Bursa oto ekspertiz hizmetleri", "kaporta boya kontrolü", "OBD kontrolü", "airbag ekspertiz"],
});

const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Bursa oto ekspertiz kontrol başlıkları",
  url: absoluteUrl("/hizmetler"),
  numberOfItems: services.length,
  itemListElement: services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      "@id": `${absoluteUrl("/hizmetler")}#${service.slug}`,
      name: service.name,
      description: service.description,
      provider: { "@id": `${siteConfig.canonicalUrl}/#business` },
      areaServed: siteConfig.city,
    },
  })),
};

const servicesBreadcrumbSchema = breadcrumbSchema([
  { name: "Ana sayfa", path: "/" },
  { name: "Oto ekspertiz kontrolleri", path: "/hizmetler" },
]);

export default function ServicesPage() {
  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesBreadcrumbSchema) }} />
      <section className="subpage-hero">
        <div className="page-shell">
          <Breadcrumbs items={[{ label: "Ana sayfa", href: "/" }, { label: "Kontroller" }]} />
          <p className="eyebrow eyebrow-light">Kontrol başlıkları</p>
          <h1>Aracın farklı sistemlerini tek karar akışında görün.</h1>
          <p>Uygulanacak kontroller seçilen pakete ve aracın teknik uygunluğuna göre işlem öncesinde netleştirilir.</p>
        </div>
      </section>
      <section className="section section-paper">
        <div className="page-shell content-grid">
          {services.map((service, index) => (
            <article className="content-card" id={service.slug} key={service.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{service.name}</h2>
              <p>{service.description}</p>
              <ul>{service.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>
      <section className="final-cta">
        <div className="page-shell final-cta-inner">
          <div><p className="eyebrow eyebrow-light">Kontrol kapsamını seçin</p><h2>Hangi başlıkların hangi pakette olduğunu karşılaştırın.</h2></div>
          <Link className="button button-primary" href="/paketler">Paketleri incele</Link>
        </div>
      </section>
    </SiteShell>
  );
}
