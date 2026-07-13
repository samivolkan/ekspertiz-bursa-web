import type { Metadata } from "next";
import { AppointmentForm } from "@/components/AppointmentForm";
import { SiteShell } from "@/components/SiteShell";
import { absoluteUrl, breadcrumbSchema, createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const usesWhatsAppLeadFlow =
  process.env.NEXT_PUBLIC_GITHUB_PAGES === "true" ||
  process.env.NEXT_PUBLIC_STATIC_HOSTING === "true";

export const metadata: Metadata = createPageMetadata({
  title: "Bursa Oto Ekspertiz Randevu",
  description: "Ekspertiz Bursa için paket, araç, tarih ve iletişim tercihinizi seçerek çevrim içi randevu talebi oluşturun.",
  path: "/randevu",
  keywords: ["Bursa oto ekspertiz randevu", "Nilüfer ekspertiz randevu", "oto ekspertiz rezervasyon"],
});

const appointmentPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${absoluteUrl("/randevu")}#webpage`,
  url: absoluteUrl("/randevu"),
  name: "Bursa oto ekspertiz randevu talebi",
  description: "Paket, araç, tarih ve iletişim tercihiyle çevrim içi oto ekspertiz randevu talebi oluşturma sayfası.",
  inLanguage: "tr-TR",
  about: { "@id": `${siteConfig.canonicalUrl}/#business` },
};

const appointmentBreadcrumbSchema = breadcrumbSchema([
  { name: "Ana sayfa", path: "/" },
  { name: "Randevu", path: "/randevu" },
]);

export default function AppointmentPage() {
  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appointmentPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appointmentBreadcrumbSchema) }} />
      <section className="subpage-hero">
        <div className="page-shell narrow-shell">
          <p className="eyebrow eyebrow-light">Online randevu talebi</p>
          <h1>Ekspertiz için uygun günü planlayın.</h1>
          <p>{usesWhatsAppLeadFlow ? "Form bilgileriniz WhatsApp mesajına hazırlanır; mesajı gönderdiğinizde işletme hattına ulaşır." : "Talebiniz kalıcı olarak kaydedilir ve size bir referans kodu verilir."} Randevu, işletme saati teyit ettiğinde kesinleşir.</p>
        </div>
      </section>
      <section className="section section-paper">
        <div className="page-shell appointment-page-grid">
          <aside className="appointment-aside">
            <span>Nasıl çalışır?</span>
            <ol>
              <li><b>1</b>Paket ve araç bilgilerinizi girin.</li>
              <li><b>2</b>Uygun tarih ve saat aralığını seçin.</li>
              <li><b>3</b>{usesWhatsAppLeadFlow ? "Hazırlanan mesajı WhatsApp'tan gönderin." : "Referans kodunuzu kaydedin."}</li>
              <li><b>4</b>İşletmenin teyit dönüşünü bekleyin.</li>
            </ol>
            <p>Aynı gün müsaitliği ve paket seçimi için <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a> numarasını arayabilir veya <a href={siteConfig.whatsappHref} target="_blank" rel="noreferrer">WhatsApp üzerinden yazabilirsiniz</a>. Çalışma saatlerimiz {siteConfig.workingHours.toLocaleLowerCase("tr-TR")}.</p>
          </aside>
          <div className="form-card"><AppointmentForm /></div>
        </div>
      </section>
    </SiteShell>
  );
}
