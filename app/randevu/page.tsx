import type { Metadata } from "next";
import { AppointmentForm } from "@/components/AppointmentForm";
import { SiteShell } from "@/components/SiteShell";
import { siteConfig } from "@/lib/site";

const isGitHubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";

export const metadata: Metadata = {
  title: "Bursa Oto Ekspertiz Randevu",
  description: "Ekspertiz Bursa için paket, araç, tarih ve iletişim tercihinizi seçerek çevrim içi randevu talebi oluşturun.",
  alternates: { canonical: "/randevu" },
};

export default function AppointmentPage() {
  return (
    <SiteShell>
      <section className="subpage-hero">
        <div className="page-shell narrow-shell">
          <p className="eyebrow eyebrow-light">Online randevu talebi</p>
          <h1>Ekspertiz için uygun günü planlayın.</h1>
          <p>{isGitHubPages ? "Form bilgileriniz WhatsApp mesajına hazırlanır ve doğrudan işletme hattına gönderilir." : "Talebiniz kalıcı olarak kaydedilir ve size bir referans kodu verilir."} Randevu, işletme saati teyit ettiğinde kesinleşir.</p>
        </div>
      </section>
      <section className="section section-paper">
        <div className="page-shell appointment-page-grid">
          <aside className="appointment-aside">
            <span>Nasıl çalışır?</span>
            <ol>
              <li><b>1</b>Paket ve araç bilgilerinizi girin.</li>
              <li><b>2</b>Uygun tarih ve saat aralığını seçin.</li>
              <li><b>3</b>{isGitHubPages ? "Hazırlanan mesajı WhatsApp'tan gönderin." : "Referans kodunuzu kaydedin."}</li>
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
