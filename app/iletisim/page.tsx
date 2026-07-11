import type { Metadata } from "next";
import { AppointmentForm } from "@/components/AppointmentForm";
import { SiteShell } from "@/components/SiteShell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "İletişim, Adres ve Randevu",
  description: "Ekspertiz Bursa Nilüfer şube adresini görüntüleyin, yol tarifi alın ve çevrim içi oto ekspertiz randevu talebi oluşturun.",
  alternates: { canonical: "/iletisim" },
};

export default function ContactPage() {
  return (
    <SiteShell>
      <section className="subpage-hero">
        <div className="page-shell">
          <p className="eyebrow eyebrow-light">İletişim ve randevu</p>
          <h1>Nilüfer şubemiz için randevu talebi oluşturun.</h1>
          <p>Talebiniz referans koduyla kaydedilir. Tarih, saat, paket süresi ve fiyat bilgisi işletmenin teyidiyle kesinleşir.</p>
        </div>
      </section>
      <section className="section section-paper">
        <div className="page-shell info-layout">
          <aside className="info-panel">
            <h2>Şube bilgileri</h2>
            <p>Her gün 08:30–18:30 arasında telefon, WhatsApp ve e-posta üzerinden bize ulaşabilirsiniz.</p>
            <dl>
              <div><dt>Adres</dt><dd>{siteConfig.address}</dd></div>
              <div><dt>Telefon</dt><dd><a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a></dd></div>
              <div><dt>E-posta</dt><dd><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></dd></div>
              <div><dt>Çalışma saatleri</dt><dd>{siteConfig.workingHours}</dd></div>
            </dl>
            <div className="contact-actions">
              <a className="button button-primary button-full" href={siteConfig.phoneHref} data-event="contact_phone_click">Hemen ara</a>
              <a className="button button-light button-full" href={siteConfig.whatsappHref} target="_blank" rel="noreferrer" data-event="contact_whatsapp_click">WhatsApp ile yazın</a>
              <a className="button button-light button-full" href={siteConfig.mapUrl} target="_blank" rel="noreferrer" data-event="directions_click">Google Haritalar&apos;da yol tarifi</a>
            </div>
          </aside>
          <div className="form-card" id="randevu"><AppointmentForm /></div>
        </div>
      </section>
    </SiteShell>
  );
}
