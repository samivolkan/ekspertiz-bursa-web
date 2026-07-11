import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description: "Ekspertiz Bursa randevu sürecinde kişisel verilerin işlenmesine ilişkin yayın öncesi aydınlatma metni taslağı.",
  alternates: { canonical: "/kvkk" },
};

function Pending({ children }: { children: string }) {
  return <span className="pending-value">[{children} yayın öncesi teyit edilecek]</span>;
}

export default function KvkkPage() {
  return (
    <SiteShell>
      <section className="section section-paper">
        <article className="legal-article">
          <p className="eyebrow">Kişisel verilerin korunması</p>
          <h1>KVKK Aydınlatma Metni</h1>
          <div className="draft-alert"><strong>Yayın öncesi taslak:</strong> Bu metin hukuki danışmanlık değildir. Veri sorumlusunun ticari unvanı, iletişim kanalı, saklama süreleri, hizmet sağlayıcıları ve hukuki sebepleri gerçek operasyonla eşleştirildikten sonra hukuk danışmanı tarafından son haline getirilmelidir.</div>

          <section>
            <h2>1. Veri sorumlusu</h2>
            <p><strong>Ticari unvan:</strong> {siteConfig.legalName ?? <Pending>ticari unvan</Pending>}</p>
            <p><strong>Adres:</strong> {siteConfig.address}</p>
            <p><strong>KVKK iletişim kanalı:</strong> {siteConfig.privacyEmail ?? <Pending>e-posta adresi</Pending>}</p>
          </section>

          <section>
            <h2>2. İşlenen veri kategorileri</h2>
            <p>Randevu formunda paylaştığınız ad-soyad, telefon, isteğe bağlı e-posta, iletişim tercihi, araç bilgisi, seçilen paket, tercih edilen tarih ve saat ile pazarlama izni tercihi işlenebilir. Kimlik numarası, ödeme kartı bilgisi veya özel nitelikli kişisel veri talep edilmez.</p>
          </section>

          <section>
            <h2>3. İşleme amaçları</h2>
            <p>Veriler; randevu talebini kaydetmek, uygunluk ve paket kapsamını teyit etmek, talebiniz üzerine sizinle iletişim kurmak, form güvenliğini sağlamak ve yasal yükümlülükleri yerine getirmek amacıyla sınırlı olarak kullanılır.</p>
          </section>

          <section>
            <h2>4. Aktarım ve saklama</h2>
            <p>Randevu sürecinin yürütülmesi için gerekli olması halinde veriler yalnız yetkili çalışanlar ve sözleşmeli teknik hizmet sağlayıcılarıyla, gerekli olduğu ölçüde paylaşılabilir. Barındırma konumu, olası yurt dışı aktarım ve kesin saklama süresi yayın öncesi veri envanterine göre bu metne eklenecektir.</p>
          </section>

          <section>
            <h2>5. İlgili kişi hakları</h2>
            <p>KVKK&apos;nın 11. maddesi kapsamındaki haklarınız için veri sorumlusuna başvurabilirsiniz. Doğrulanmış başvuru kanalı ve başvuru usulü iletişim bilgileri kesinleştiğinde burada yayınlanacaktır.</p>
          </section>

          <section>
            <h2>6. Aydınlatma ve pazarlama izni ayrımı</h2>
            <p>Bu metin bilgilendirme amacı taşır. Kampanya ve hizmet duyurularına ilişkin isteğe bağlı iletişim izni randevu formunda ayrı bir seçim alanıdır; bu izni vermemek randevu talebi oluşturmanıza engel olmaz.</p>
          </section>
        </article>
      </section>
    </SiteShell>
  );
}

