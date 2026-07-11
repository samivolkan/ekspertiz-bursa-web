import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Ekspertiz Bursa'nın açık paket kapsamı, doğrulanmış bilgi ve anlaşılır bulgu aktarımı yaklaşımını tanıyın.",
  alternates: { canonical: "/hakkimizda" },
};

const principles = [
  { title: "Önce kapsam", text: "Müşteri, seçtiği pakette hangi kontrol başlıklarının bulunduğunu işlem öncesinde görür." },
  { title: "Yalnız doğrulanmış bilgi", text: "Belge, cihaz, garanti, müşteri yorumu veya performans iddiası kanıtlanmadan yayınlanmaz." },
  { title: "Anlaşılır bulgular", text: "Kontrol sonuçları teknik karmaşaya boğulmadan, karar vermeyi kolaylaştıran başlıklarla aktarılır." },
];

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="subpage-hero">
        <div className="page-shell">
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

