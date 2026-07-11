import type { Metadata } from "next";
import { AppointmentForm } from "@/components/AppointmentForm";
import { SiteShell } from "@/components/SiteShell";
import { packages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Bursa Oto Ekspertiz Randevu",
  description: "Ekspertiz Bursa için paket, araç, tarih ve iletişim tercihinizi seçerek çevrim içi randevu talebi oluşturun.",
  alternates: { canonical: "/randevu" },
};

export default async function AppointmentPage({ searchParams }: { searchParams: Promise<{ paket?: string }> }) {
  const query = await searchParams;
  const selected = packages.find((item) => item.slug === query.paket)?.name ?? "";

  return (
    <SiteShell>
      <section className="subpage-hero">
        <div className="page-shell narrow-shell">
          <p className="eyebrow eyebrow-light">Online randevu talebi</p>
          <h1>Ekspertiz için uygun günü planlayın.</h1>
          <p>Talebiniz kalıcı olarak kaydedilir ve size bir referans kodu verilir. Randevu, işletme saati teyit ettiğinde kesinleşir.</p>
        </div>
      </section>
      <section className="section section-paper">
        <div className="page-shell appointment-page-grid">
          <aside className="appointment-aside">
            <span>Nasıl çalışır?</span>
            <ol>
              <li><b>1</b>Paket ve araç bilgilerinizi girin.</li>
              <li><b>2</b>Uygun tarih ve saat aralığını seçin.</li>
              <li><b>3</b>Referans kodunuzu kaydedin.</li>
              <li><b>4</b>İşletmenin teyit dönüşünü bekleyin.</li>
            </ol>
            <p>Aynı gün randevusu çevrim içi formdan alınmaz; telefon bilgisi doğrulandıktan sonra müsaitlik sorulabilir.</p>
          </aside>
          <div className="form-card"><AppointmentForm defaultPackage={selected} /></div>
        </div>
      </section>
    </SiteShell>
  );
}

