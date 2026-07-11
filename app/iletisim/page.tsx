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
            <p>Doğrulanmış adres aşağıdadır. Telefon, WhatsApp, e-posta ve çalışma saatleri bilgisi geldiğinde aynı alanda yayınlanacaktır.</p>
            <dl>
              <div><dt>Adres</dt><dd>{siteConfig.address}</dd></div>
              <div><dt>Telefon / WhatsApp</dt><dd>İşletme teyidi bekleniyor</dd></div>
              <div><dt>Çalışma saatleri</dt><dd>İşletme teyidi bekleniyor</dd></div>
            </dl>
            <a className="button button-primary button-full" href={siteConfig.mapUrl} target="_blank" rel="noreferrer" data-event="directions_click">Google Haritalar&apos;da yol tarifi</a>
          </aside>
          <div className="form-card" id="randevu"><AppointmentForm /></div>
        </div>
      </section>
    </SiteShell>
  );
}

