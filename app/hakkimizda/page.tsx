import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { absoluteUrl, breadcrumbSchema, createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Hakkımızda",
  description: "Ekspertiz Bursa'nın açık paket kapsamı, doğrulanmış bilgi ve anlaşılır bulgu aktarımı yaklaşımını tanıyın.",
  path: "/hakkimizda",
  keywords: ["Ekspertiz Bursa hakkında", "Nilüfer oto ekspertiz", "Bursa araç kontrol merkezi"],
});

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${absoluteUrl("/hakkimizda")}#about`,
  url: absoluteUrl("/hakkimizda"),
  name: "Ekspertiz Bursa hakkında",
  description: "Ekspertiz Bursa'nın açık kapsam, doğrulanmış bilgi ve anlaşılır bulgu aktarımı yaklaşımı.",
  inLanguage: "tr-TR",
  mainEntity: { "@id": `${siteConfig.canonicalUrl}/#business` },
};

const aboutBreadcrumbSchema = breadcrumbSchema([
  { name: "Ana sayfa", path: "/" },
  { name: "Hakkımızda", path: "/hakkimizda" },
]);

const principles = [
  { title: "Önce kapsam", text: "Müşteri, seçtiği pakette hangi kontrol başlıklarının bulunduğunu işlem öncesinde görür." },
  { title: "Yalnız doğrulanmış bilgi", text: "Belge, cihaz, garanti, müşteri yorumu veya performans iddiası kanıtlanmadan yayınlanmaz." },
  { title: "Anlaşılır bulgular", text: "Kontrol sonuçları teknik karmaşaya boğulmadan, karar vermeyi kolaylaştıran başlıklarla aktarılır." },
];

export default function AboutPage() {
  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutBreadcrumbSchema) }} />
      <section className="subpage-hero">
        <div className="page-shell">
          <Breadcrumbs items={[{ label: "Ana sayfa", href: "/" }, { label: "Hakkımızda" }]} />
          <p className="eyebrow eyebrow-light">Ekspertiz Bursa</p>
          <h1>Araç kararında daha açık ve kontrollü bir deneyim.</h1>
          <p>Nilüfer&apos;de konumlanan Ekspertiz Bursa, ikinci el araç kontrolünü paket seçimi, randevu ve bulgu aktarımıyla tek bir anlaşılır akışta toplamayı hedefler.</p>
        </div>
      </section>
      <section className="section section-paper">
        <div className="page-shell content-grid">
          {principles.map((item, index) => (
            <article className="content-card" key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span><h2>{item.title}</h2><p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="final-cta">
        <div className="page-shell final-cta-inner">
          <div><p className="eyebrow eyebrow-light">Aracınız için başlayın</p><h2>Paketleri karşılaştırın ve uygun gün için talep oluşturun.</h2></div>
          <Link className="button button-primary" href="/randevu">Randevu al</Link>
        </div>
      </section>
    </SiteShell>
  );
}
