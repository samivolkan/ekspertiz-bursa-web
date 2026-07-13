import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AppointmentForm } from "@/components/AppointmentForm";
import { SiteShell } from "@/components/SiteShell";
import { faqItems, localSeoTargets, packages, services, siteConfig } from "@/lib/site";
import { assetPath } from "@/lib/assets";
import { localBusinessSchema, organizationSchema } from "@/lib/structured-data";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Ekspertiz Bursa | Bursa Nilüfer Oto Ekspertiz" },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

const homeLocalBusinessSchema = localBusinessSchema();
const homeOrganizationSchema = organizationSchema();

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.canonicalUrl}/#website`,
  url: `${siteConfig.canonicalUrl}/`,
  name: siteConfig.name,
  description: siteConfig.description,
  inLanguage: "tr-TR",
  publisher: { "@id": `${siteConfig.canonicalUrl}/#organization` },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const localSeoSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Bursa ve Nilüfer oto ekspertiz arama hedefleri",
  itemListElement: localSeoTargets.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      name: item.title,
      areaServed: item.area,
      description: item.description,
      provider: { "@id": `${siteConfig.canonicalUrl}/#business` },
      url: absoluteUrl(item.href),
    },
  })),
};

const trustProofItems = [
  {
    title: "Doğrulanabilir yorum",
    text: "Gerçek Google veya sosyal medya yorumu, kaynak bağlantısı ve müşteri onayı oluşmadan yayınlanmaz.",
  },
  {
    title: "Açık paket kapsamı",
    text: "Her paketin hangi kontrol başlıklarını içerdiği işlem öncesinde net biçimde gösterilir.",
  },
  {
    title: "Teyitli randevu süreci",
    text: "Form veya WhatsApp talebi sonrasında tarih, saat, fiyat ve kapsam işletme dönüşüyle kesinleşir.",
  },
];

export default function Home() {
  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeLocalBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeOrganizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSeoSchema) }} />

      <section className="hero-section">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="page-shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light">Bursa Nilüfer&apos;de satın alma öncesi araç kontrolü</p>
            <h1>
              Bursa&apos;da oto ekspertiz ile <span>gerçeği görün.</span>
            </h1>
            <p className="hero-lead">
              Nilüfer&apos;de paket kapsamını karşılaştırın, kontrol başlıklarını görün ve size uygun tarih için çevrim içi randevu talebi oluşturun.
            </p>
            <div className="button-row">
              <Link className="button button-primary" href="/randevu" data-event="hero_appointment_click">
                Randevu talebi oluştur
              </Link>
              <Link className="button button-light" href="/paketler" data-event="hero_packages_click">
                Paketleri karşılaştır
              </Link>
            </div>
            <ul className="hero-proof" aria-label="Hizmet ilkeleri">
              <li><span>01</span>Açık paket kapsamı</li>
              <li><span>02</span>Tarafsız bulgu dili</li>
              <li><span>03</span>Kayıtlı randevu talebi</li>
            </ul>
          </div>

          <div className="inspection-visual" aria-label="Örnek ekspertiz kontrol akışı">
            <div className="visual-topline">
              <span>Örnek kontrol akışı</span>
              <span className="live-pill">Bursa</span>
            </div>
            <div className="hero-photo">
              <Image
                src={assetPath("/images/hero-inspection.webp")}
                alt="Lift üzerindeki araçta ekspertiz kontrolü yapan teknisyen"
                width={1536}
                height={1024}
                priority
                unoptimized
                sizes="(max-width: 820px) 100vw, 46vw"
              />
              <span>Doğal servis ortamı</span>
            </div>
            <div className="inspection-list">
              <div><span className="status-dot status-green" /><p><strong>Kaporta ve boya</strong><small>Parça bazlı değerlendirme</small></p><b>01</b></div>
              <div><span className="status-dot status-amber" /><p><strong>Motor ve mekanik</strong><small>Görsel ve işitsel bulgular</small></p><b>02</b></div>
              <div><span className="status-dot status-blue" /><p><strong>OBD ve elektronik</strong><small>Kontrol ünitesi taraması</small></p><b>03</b></div>
            </div>
            <p className="visual-caption">Gösterim temsili bir süreç kartıdır; gerçek bulgular araca ve seçilen pakete göre oluşur.</p>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Ekspertiz Bursa yaklaşımı">
        <div className="page-shell trust-grid">
          <p><strong>Net kapsam</strong><span>Pakette ne olduğunu işlem öncesi görün.</span></p>
          <p><strong>Doğrulanmış bilgi</strong><span>Onaysız belge, fiyat ve yorum yayınlanmaz.</span></p>
          <p><strong>Kolay randevu</strong><span>Talebinizi form veya WhatsApp üzerinden hızlıca iletin.</span></p>
        </div>
      </section>

      <section className="section local-seo-section" aria-labelledby="local-seo-heading">
        <div className="page-shell">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Bursa ve Nilüfer odaklı aramalar</p>
              <h2 id="local-seo-heading">Oto ekspertiz ihtiyacınızı konuma ve kapsama göre netleştirin.</h2>
            </div>
            <p>
              Bursa oto ekspertiz, Nilüfer oto ekspertiz, kaporta boya kontrolü ve OBD/motor-mekanik aramalarında kullanıcıyı doğrudan doğru paket, adres ve randevu akışına taşıyan içerik yapısı.
            </p>
          </div>
          <div className="local-seo-grid">
            {localSeoTargets.map((item) => (
              <article key={item.title}>
                <span>{item.area}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <ul>
                  {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                </ul>
                <Link className="text-link" href={item.href}>{item.cta} <span>→</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-paper" id="paketler">
        <div className="page-shell">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Ekspertiz paketleri</p>
              <h2>Risk düzeyine göre doğru kapsamı seçin.</h2>
            </div>
            <div>
              <p>Mini Ekspertiz Kaporta, Mini Ekspertiz Motor-Mekanik, Mini, Orta, Tam ve Full paketlerin kapsamını, sürelerini ve güncel fiyatlarını karşılaştırın.</p>
              <Link className="text-link" href="/paketler">Tüm paketleri karşılaştır <span>→</span></Link>
            </div>
          </div>
          <div className="package-grid">
            {packages.map((item, index) => (
              <article className={`package-card ${item.slug === "full" ? "package-card-featured" : ""}`} key={item.slug}>
                {item.slug === "full" ? <span className="popular-package-badge">En çok tercih edilen paket</span> : null}
                <div className="package-card-top">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.name}</h3>
                  <em>{item.badge}</em>
                </div>
                <p>{item.description}</p>
                <ul>{item.features.slice(0, 4).map((feature) => <li key={feature}>{feature}</li>)}</ul>
                <div className="package-meta-row">
                  <div className="package-meta"><span>Süre</span><strong>{item.duration}</strong></div>
                  <div className="package-meta"><span>Fiyat</span><strong>{item.price ?? "Bilgi için arayın"}</strong></div>
                </div>
                <Link className={item.slug === "full" ? "button button-primary button-full" : "button button-dark button-full"} href={`/randevu?paket=${item.slug}`} data-event={`package_${item.slug}_click`}>
                  Bu paketle randevu al
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="page-shell">
          <div className="section-heading section-heading-light">
            <p className="eyebrow eyebrow-light">Kontrol başlıkları</p>
            <h2>Aracın görünen yüzünden elektronik geçmişine.</h2>
            <p>Her kontrol başlığı seçtiğiniz pakete ve aracın teknik uygunluğuna göre uygulanır.</p>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <article key={service.slug}>
                <div className="service-card-heading">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{service.name}</h3>
                </div>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
          <div className="image-story-grid">
            <figure>
              <Image src={assetPath("/images/paint-check.webp")} alt="Araç kaportasında boya kalınlığı ölçümü" width={1448} height={1086} sizes="(max-width: 820px) 100vw, 50vw" unoptimized />
              <figcaption><strong>Yüzey kontrolü</strong><span>Kaporta ve boya bulgularını parça bazında değerlendirin.</span></figcaption>
            </figure>
            <figure>
              <Image src={assetPath("/images/diagnostics-check.webp")} alt="Motor bölümünde tablet ile elektronik diagnostik kontrol" width={1448} height={1086} sizes="(max-width: 820px) 100vw, 50vw" unoptimized />
              <figcaption><strong>Elektronik ve mekanik</strong><span>Motor, mekanik ve beyin kontrollerini paket kapsamında birlikte görün.</span></figcaption>
            </figure>
          </div>
          <Link className="button button-light section-action" href="/hizmetler">Tüm kontrol başlıklarını incele</Link>
        </div>
      </section>

      <section className="section section-white">
        <div className="page-shell process-layout">
          <div className="section-heading process-heading">
            <p className="eyebrow">Randevudan karara</p>
            <h2>Dört adımda kontrollü ekspertiz süreci.</h2>
            <p>Önce ihtiyacınızı netleştirir, sonra araç ve paket uygunluğuna göre süreci planlarız.</p>
          </div>
          <ol className="process-steps">
            <li><span>1</span><div><strong>Paket seçimi</strong><p>Araç ve risk durumuna uygun kapsamı karşılaştırın.</p></div></li>
            <li><span>2</span><div><strong>Randevu talebi</strong><p>Tarih, saat ve iletişim tercihinizi güvenle kaydedin.</p></div></li>
            <li><span>3</span><div><strong>Teyit ve kontrol</strong><p>İşletme müsaitliği teyit eder; seçilen kontroller uygulanır.</p></div></li>
            <li><span>4</span><div><strong>Bulguların aktarımı</strong><p>Kontrol kapsamı ve tespitler açık bir dille paylaşılır.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="section testimonial-section" aria-labelledby="testimonial-heading">
        <div className="page-shell">
          <div className="section-heading testimonial-heading">
            <p className="eyebrow">Güven ve şeffaflık</p>
            <h2 id="testimonial-heading">Yorum ve kanıt alanlarını doğrulanabilir kaynakla yayınlıyoruz.</h2>
            <p>Gerçek müşteri yorumu, şube fotoğrafı veya rapor örneği eklenecekse kaynağı doğrulanmış ve yayın izni alınmış içerikler kullanılacak.</p>
          </div>
          <div className="testimonial-grid">
            {trustProofItems.map((item, index) => (
              <article key={item.title}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <div className="testimonial-disclaimer">
            <strong>Sahte yorum yok</strong>
            <p>Google yorum linki, gerçek müşteri izni veya işletmeye ait fotoğraflar geldiğinde bu alan doğrudan canlı güven kanıtlarına dönüşecek.</p>
          </div>
        </div>
      </section>

      <section className="section section-accent" id="randevu">
        <div className="page-shell appointment-layout">
          <div className="appointment-copy">
            <p className="eyebrow">Çevrim içi randevu</p>
            <h2>Uygun günü seçin, talebiniz işletmeye ulaşsın.</h2>
            <p>Formu doldurun; mevcut yayın ortamına göre talebiniz WhatsApp mesajı olarak hazırlanır veya kayıtlı randevu talebi olarak alınır. İşletme uygun saat ve kapsamı teyit eder.</p>
            <div className="appointment-note">
              <strong>Önemli</strong>
              <p>Form onayı kesin randevu değildir. Tarih ve saat, işletmenin dönüşüyle kesinleşir.</p>
            </div>
          </div>
          <div className="form-card"><AppointmentForm /></div>
        </div>
      </section>

      <section className="section section-paper">
        <div className="page-shell faq-layout">
          <div className="section-heading faq-heading">
            <p className="eyebrow">Sık sorulan sorular</p>
            <h2>Randevudan önce bilmeniz gerekenler.</h2>
          </div>
          <div className="faq-list">
            {faqItems.map((item) => (
              <details key={item.question}>
                <summary>{item.question}<span aria-hidden="true">+</span></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="page-shell final-cta-inner">
          <div><p className="eyebrow eyebrow-light">Kararınızı şansa bırakmayın</p><h2>Aracınız için doğru kontrol kapsamını bugün planlayın.</h2></div>
          <Link className="button button-primary" href="/randevu" data-event="footer_cta_appointment_click">Randevu talebi oluştur</Link>
        </div>
      </section>
    </SiteShell>
  );
}
