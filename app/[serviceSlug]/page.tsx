import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { blogPosts } from "@/lib/blog";
import { absoluteUrl, breadcrumbSchema, createPageMetadata } from "@/lib/seo";
import { findServiceLandingPage, serviceLandingPages } from "@/lib/service-pages";
import { packages, siteConfig } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceLandingPages.map((page) => ({ serviceSlug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ serviceSlug: string }> }): Promise<Metadata> {
  const { serviceSlug } = await params;
  const page = findServiceLandingPage(serviceSlug);
  if (!page) return {};
  return createPageMetadata({
    title: page.seoTitle,
    description: page.description,
    path: `/${page.slug}`,
    keywords: [page.seoTitle, "Bursa oto ekspertiz", "Nilüfer oto ekspertiz", page.eyebrow],
  });
}

export default async function ServiceLandingPageRoute({ params }: { params: Promise<{ serviceSlug: string }> }) {
  const { serviceSlug } = await params;
  const page = findServiceLandingPage(serviceSlug);
  if (!page) notFound();

  const relatedPackages = packages.filter((item) => page.relatedPackageSlugs.includes(item.slug));
  const relatedPosts = blogPosts.filter((post) => page.relatedBlogSlugs.includes(post.slug));
  const url = absoluteUrl(`/${page.slug}`);
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: page.seoTitle,
    description: page.description,
    url,
    provider: { "@id": `${siteConfig.canonicalUrl}/#business` },
    areaServed: [{ "@type": "City", name: siteConfig.city }, { "@type": "AdministrativeArea", name: siteConfig.district }],
    availableChannel: [
      { "@type": "ServiceChannel", serviceUrl: absoluteUrl("/randevu") },
      { "@type": "ServiceChannel", servicePhone: siteConfig.phoneHref.replace("tel:", "") },
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };
  const breadcrumbs = breadcrumbSchema([
    { name: "Ana sayfa", path: "/" },
    { name: "Oto ekspertiz kontrolleri", path: "/hizmetler" },
    { name: page.seoTitle, path: `/${page.slug}` },
  ]);

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <section className="subpage-hero service-landing-hero" data-page-event="service_view" data-service-name={page.seoTitle}>
        <div className="page-shell narrow-shell">
          <nav className="page-breadcrumbs" aria-label="Sayfa yolu">
            <Link href="/">Ana sayfa</Link><span aria-hidden="true">/</span><Link href="/hizmetler">Kontroller</Link><span aria-hidden="true">/</span><span>{page.seoTitle}</span>
          </nav>
          <p className="eyebrow eyebrow-light">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.introduction}</p>
          <div className="button-row">
            <Link className="button button-primary" href={`/randevu?hizmet=${page.slug}`} data-event={`service_${page.slug}_appointment_click`} data-analytics-event="service_to_appointment" data-service-name={page.seoTitle} data-cta-location="service_hero">Randevu talebi oluştur</Link>
            <Link className="button button-light" href="/paketler" data-event={`service_${page.slug}_packages_click`} data-analytics-event="package_view" data-service-name={page.seoTitle} data-cta-location="service_hero">Paketleri karşılaştır</Link>
          </div>
        </div>
      </section>

      <section className="section section-paper">
        <div className="page-shell service-detail-grid">
          <article className="service-detail-card"><span>01</span><h2>Neler kontrol edilir?</h2><ul>{page.checks.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article className="service-detail-card"><span>02</span><h2>Hangi riskleri görmeye yardımcı olur?</h2><ul>{page.helpsIdentify.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article className="service-detail-card service-limit-card"><span>03</span><h2>Kontrolün sınırları</h2><ul>{page.limitations.map((item) => <li key={item}>{item}</li>)}</ul></article>
        </div>
      </section>

      {page.reportExample ? (
        <section className="section section-white"><div className="page-shell narrow-shell"><details className="report-explainer"><summary data-event="report_example_open" data-analytics-event="report_example_view" data-service-name={page.seoTitle} data-cta-location="report_explainer">Rapor bölüm örneğinin yapısını görün</summary><div><h2>Kişisel veri içermeyen örnek yapı</h2><ol><li>Kontrol başlığı ve uygulanan yöntem</li><li>Doğrulanabilen bulgu</li><li>Kontrolün sınırı</li><li>Önerilen takip veya servis incelemesi</li></ol><p>Bu alan gerçek bir araç sonucu değildir; rapor okuma düzenini açıklar.</p></div></details></div></section>
      ) : null}

      <section className="section section-white">
        <div className="page-shell">
          <div className="section-heading split-heading"><div><p className="eyebrow">İlgili paketler</p><h2>Kontrol derinliğini paket kapsamıyla eşleştirin.</h2></div><p>Süre ve fiyat bilgileri yayınlanan paket verisinden gelir; paket fiyatlarına KDV dahildir. Nihai kapsam ve ödeme yöntemi randevu teyidinde netleşir.</p></div>
          <div className="service-package-grid">{relatedPackages.map((item) => <article key={item.slug}><span>{item.badge}</span><h3>{item.name}</h3><p>{item.description}</p><div><strong>{item.duration}</strong><strong>{item.price ?? "Bilgi için arayın"}</strong></div><Link href={`/randevu?paket=${item.slug}&hizmet=${page.slug}`} data-event={`service_${page.slug}_package_${item.slug}_click`} data-analytics-event="package_select" data-package-name={item.name} data-service-name={page.seoTitle} data-cta-location="service_packages">Bu paketle talep oluştur</Link></article>)}</div>
        </div>
      </section>

      <section className="section section-paper">
        <div className="page-shell">
          <div className="section-heading"><p className="eyebrow">İlgili rehberler</p><h2>Kontrol bulgularını örnek senaryolarla okuyun.</h2></div>
          <div className="service-blog-grid">{relatedPosts.map((post) => <article key={post.slug}><span>{post.category}</span><h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3><p>{post.description}</p><Link className="text-link" href={`/blog/${post.slug}`}>Rehberi oku <span>→</span></Link></article>)}</div>
        </div>
      </section>

      <section className="section section-white">
        <div className="page-shell faq-layout"><div className="section-heading faq-heading"><p className="eyebrow">Sık sorulan sorular</p><h2>{page.seoTitle} hakkında kısa yanıtlar.</h2></div><div className="faq-list">{page.faq.map((item) => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></div>
      </section>

      <section className="final-cta"><div className="page-shell final-cta-inner"><div><p className="eyebrow eyebrow-light">Kararınızı netleştirin</p><h2>Kontrol kapsamını araç bilgilerinize göre planlayın.</h2></div><Link className="button button-primary" href={`/randevu?hizmet=${page.slug}`} data-event={`service_${page.slug}_footer_appointment_click`} data-analytics-event="service_to_appointment" data-service-name={page.seoTitle} data-cta-location="service_footer">Randevu talebi oluştur</Link></div></section>
    </SiteShell>
  );
}
