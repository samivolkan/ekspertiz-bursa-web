import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Çerez Politikası",
  description: "Ekspertiz Bursa web sitesindeki zorunlu, analitik ve reklam çerezlerine ilişkin çerez politikası.",
  path: "/cerez-politikasi",
  index: false,
});

export default function CookiePolicyPage() {
  return (
    <SiteShell>
      <section className="section section-paper">
        <article className="legal-article">
          <p className="eyebrow">Tercih ve şeffaflık</p>
          <h1>Çerez Politikası</h1>
          <div className="draft-alert"><strong>Şeffaflık notu:</strong> Zorunlu teknolojiler siteyi çalıştırmak için kullanılır. Analitik ve reklam ölçümü ise yalnız açık onayınız olduğunda etkinleşir.</div>

          <section>
            <h2>Çerez nedir?</h2>
            <p>Çerezler ve benzeri yerel depolama teknolojileri, internet sitesinin temel işlevlerini çalıştırmak, tercihlerinizi hatırlamak ve izniniz olduğunda site performansını ölçmek için tarayıcınızda sınırlı veri saklayabilir.</p>
          </section>

          <section>
            <h2>Kullanım kategorileri</h2>
            <h3>Zorunlu teknolojiler</h3>
            <p>Form güvenliği, çerez tercihinizin kaydı ve sitenin temel işlevleri için kullanılır. Sitenin çalışması için gerekli olduklarından tamamen kapatılamayabilir.</p>
            <h3>Analitik teknolojiler</h3>
            <p>Sayfaların ve randevu akışının toplu performansını anlamaya yardımcı olur. Yalnız onay vermeniz halinde etkinleştirilir.</p>
            <h3>Reklam ölçümü</h3>
            <p>Google Ads gibi kampanyalarda başarılı randevu taleplerini ve izin verilen diğer dönüşümleri ölçmek için kullanılabilir. Yalnız onay vermeniz ve ilgili ölçüm etiketlerinin eklenmesi halinde çalışır.</p>
          </section>

          <section>
            <h2>Tercihler nasıl yönetilir?</h2>
            <p>İlk ziyaretinizde gösterilen panelden yalnız zorunlu teknolojilerle devam edebilir veya analitik ve reklam ölçümüne onay verebilirsiniz. Daha sonra tercih değiştirmek isterseniz tarayıcı ayarlarınızdan bu siteye ait yerel kayıtları silebilir ve panelin yeniden görünmesini sağlayabilirsiniz.</p>
            <button type="button" className="button button-dark" data-cookie-reset="true">
              Çerez tercihlerini yeniden aç
            </button>
          </section>

          <section>
            <h2>Google Consent Mode</h2>
            <p>Google Tag Manager kimliği eklendiğinde analitik ve reklam depolama sinyalleri varsayılan olarak reddedilir; yalnız kullanıcı tercihi sonrasında güncellenir. Başarılı randevu kaydı, ölçüm altyapısı etkinleştirildiğinde ana dönüşüm olayı olarak kullanılacaktır.</p>
          </section>
        </article>
      </section>
    </SiteShell>
  );
}
