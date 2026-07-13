export type ServiceLandingPage = {
  slug: string;
  eyebrow: string;
  title: string;
  seoTitle: string;
  description: string;
  introduction: string;
  checks: string[];
  helpsIdentify: string[];
  limitations: string[];
  relatedPackageSlugs: string[];
  relatedBlogSlugs: string[];
  faq: Array<{ question: string; answer: string }>;
  reportExample?: boolean;
};

export const serviceLandingPages: ServiceLandingPage[] = [
  {
    slug: "bursa-oto-ekspertiz",
    eyebrow: "Bursa'da araç satın alma kontrolü",
    title: "Bursa oto ekspertiz seçeneklerini ihtiyacınıza göre karşılaştırın.",
    seoTitle: "Bursa Oto Ekspertiz Paketleri ve Randevu",
    description: "Bursa'da ikinci el araç almadan önce kaporta, motor-mekanik, OBD, şanzıman, conta ve airbag kontrol kapsamlarını karşılaştırın.",
    introduction: "Bursa genelinden gelecek araçlar için doğru başlangıç noktası, aracın risklerini ve hangi kontrol başlıklarına ihtiyaç duyulduğunu netleştirmektir. Paketler tek bir bulguya değil, satın alma kararında birlikte değerlendirilmesi gereken sistemlere göre kademelenir.",
    checks: ["Kaporta ve boya yüzeyi", "Motor ve mekanik bulgular", "OBD ve kontrol ünitesi kayıtları", "Pakete göre şanzıman, conta ve airbag başlıkları"],
    helpsIdentify: ["Görünür gövde ve hizalama farklılıkları", "Erişilebilen bölgelerde kaçak veya aşınma şüphesi", "Aktif ve geçmiş elektronik hata kayıtları", "İleri servis incelemesi gerektirebilecek bulgular"],
    limitations: ["Ekspertiz, aracın gelecekte arıza çıkarmayacağını garanti etmez.", "Parça sökülmeden erişilemeyen alanlar için kesin iç durum beyanı verilmez.", "Kontrol kapsamı seçilen paket ve aracın teknik uygunluğuyla sınırlıdır."],
    relatedPackageSlugs: ["mini", "orta", "tam", "full"],
    relatedBlogSlugs: ["boya-olcumunde-tek-panel-farki", "obd-gecmis-hata-kodlari", "test-surusundeki-tek-tikirti"],
    faq: [
      { question: "Bursa oto ekspertiz için hangi paket uygun?", answer: "Yalnız gövde veya motor odağı varsa ilgili Mini Ekspertiz paketi; daha geniş satın alma kontrolü gerekiyorsa Mini, Orta, Tam veya Full paket kapsamları karşılaştırılabilir." },
      { question: "Randevu formu kesin randevu oluşturur mu?", answer: "Hayır. Form bir randevu talebi oluşturur; saat, fiyat ve kapsam işletmenin dönüşüyle kesinleşir." },
    ],
  },
  {
    slug: "nilufer-oto-ekspertiz",
    eyebrow: "Nilüfer Üçevler şube bilgisi",
    title: "Nilüfer oto ekspertiz randevusunu konum ve kapsamla birlikte planlayın.",
    seoTitle: "Nilüfer Oto Ekspertiz ve Üçevler Randevu",
    description: "Nilüfer Üçevler'deki doğrulanmış şube adresini, çalışma saatlerini, yol tarifini ve oto ekspertiz paketlerini tek sayfada inceleyin.",
    introduction: "Nilüfer sayfası yalnız bir konum adı tekrarı değildir; Üçevler şube adresi, yol tarifi, çalışma saatleri ve randevu teyit sürecini bir araya getirir. Araç için doğru paket seçildikten sonra tarih talebi oluşturulabilir.",
    checks: ["Paket kapsamına göre araç sistemleri", "Şube adresi ve yol tarifi", "Telefon ve WhatsApp ile aynı gün müsaitlik sorgusu", "Çevrim içi randevu talebi"],
    helpsIdentify: ["Araç için gerekli kontrol derinliği", "Şubeye ulaşım ve iletişim kanalları", "Müsaitlik teyidinden önce hazırlanması gereken bilgiler"],
    limitations: ["Çevrim içi talep kesin randevu değildir.", "Aynı gün müsaitliği yalnız işletme teyidiyle kesinleşir.", "Sitede doğrulanmamış mesafe veya ulaşım süresi yayınlanmaz."],
    relatedPackageSlugs: ["kaporta", "motor-mekanik", "full"],
    relatedBlogSlugs: ["temiz-motor-her-zaman-iyi-haber-degil", "parlak-kaput-hizalama-farki"],
    faq: [
      { question: "Nilüfer şubesi hangi saatlerde açık?", answer: "Yayınlanan doğrulanmış çalışma saati her gün 08:30–18:30'dur. Resmî tatil veya özel durumlar için gelmeden önce telefonla teyit önerilir." },
      { question: "Yol tarifini nereden açabilirim?", answer: "İletişim alanındaki Google Haritalar yol tarifi bağlantısı doğrulanmış Üçevler adresiyle açılır." },
    ],
  },
  {
    slug: "kaporta-boya-ekspertiz",
    eyebrow: "Gövde geçmişini okumaya yardımcı kontrol",
    title: "Kaporta boya ekspertizinde yüzey, ölçüm ve hizalama birlikte değerlendirilir.",
    seoTitle: "Kaporta Boya Ekspertiz Bursa",
    description: "Boya kalınlığı, panel hizası, yüzey deformasyonu ve değişen parça şüphesinin kaporta boya ekspertizinde nasıl değerlendirildiğini öğrenin.",
    introduction: "Tek bir boya kalınlığı değeri aracın geçmişini tek başına açıklamaz. Karşılıklı paneller, kenar bölgeleri, bağlantı noktaları ve yüzey görünümü birlikte okunarak doğrulanabilen bulgular raporlanır.",
    checks: ["Boya kalınlığı ölçümü", "Panel aralıkları ve hizalama", "Kaput, bagaj ve kapı yüzeyleri", "Çizik, gamze, göçük ve görsel deformasyon"],
    helpsIdentify: ["Boya veya işlem şüphesi bulunan bölgeler", "Karşılıklı paneller arasındaki ölçüm farkları", "Sökme veya ayar ihtimalini düşündüren erişilebilir bağlantı izleri"],
    limitations: ["Ölçüm değeri tek başına değişen parça kanıtı değildir.", "Kapalı yüzeyler parça sökülmeden incelenmez.", "Kozmetik görünüm ile yapısal durum aynı şey değildir."],
    relatedPackageSlugs: ["kaporta", "mini", "full"],
    relatedBlogSlugs: ["boya-olcumunde-tek-panel-farki", "parlak-kaput-hizalama-farki"],
    faq: [
      { question: "Boyalı parça kesin olarak anlaşılır mı?", answer: "Ölçüm ve görsel bulgular işlem şüphesini güçlendirebilir; ancak erişilemeyen yüzeyler ve farklı onarım teknikleri nedeniyle sonuç bulgunun sınırlarıyla aktarılır." },
      { question: "Sadece kaporta kontrolü seçilebilir mi?", answer: "Mini Ekspertiz Kaporta Paketi gövde ve boya odağı için sunulur; satın alma riskine göre mekanik ve elektronik başlıkların da eklenmesi düşünülebilir." },
    ],
  },
  {
    slug: "motor-mekanik-ekspertiz",
    eyebrow: "Motor bölümü ve mekanik bulgular",
    title: "Motor mekanik ekspertizinde görülebilen izler ve çalışma bulguları ayrılır.",
    seoTitle: "Motor Mekanik Ekspertiz Bursa",
    description: "Motor sesi, titreşim, sıvı görünümü, erişilebilen kaçak izleri ve temel mekanik bulguların Bursa oto ekspertizinde nasıl incelendiğini görün.",
    introduction: "Motor ve mekanik kontrol, anlık çalışma davranışını erişilebilen görsel izlerle birlikte değerlendirir. Bulgular, kesin parça ömrü tahmini veya geleceğe dönük garanti gibi sunulmaz.",
    checks: ["Motor yağı ve soğutma sıvısı görünümü", "Görülebilen kaçak izleri", "Erişilebilen kayış ve hortumlar", "Motor sesi, titreşim ve egzoz gözlemi"],
    helpsIdentify: ["İleri inceleme gerektirebilecek ses ve titreşimler", "Sıvı seviyesi veya görünümündeki dikkat noktaları", "Erişilebilen bölgelerde kaçak şüphesi"],
    limitations: ["Motor açılmadan iç aşınma kesinleştirilemez.", "Yeni temizlenmiş motor eski kaçak izlerini gizleyebilir.", "Anlık kontrol uzun dönem performans garantisi değildir."],
    relatedPackageSlugs: ["motor-mekanik", "mini", "orta", "full"],
    relatedBlogSlugs: ["temiz-motor-her-zaman-iyi-haber-degil", "test-surusundeki-tek-tikirti", "yeni-aku-eski-sarj-sorusu"],
    faq: [
      { question: "Motor ekspertizi arızayı kesin teşhis eder mi?", answer: "Ekspertiz satın alma öncesi bulgu ve riskleri gösterir. Kesin arıza teşhisi için gerektiğinde marka veya branş servisi incelemesi önerilir." },
      { question: "Motor yıkanmışsa kontrol yapılabilir mi?", answer: "Kontrol yapılabilir; ancak temizliğin eski kaçak izlerini etkileyebileceği rapor sınırı olarak belirtilir." },
    ],
  },
  {
    slug: "obd-beyin-kontrolu",
    eyebrow: "Elektronik kontrol ünitesi taraması",
    title: "OBD beyin kontrolü aktif ve geçmiş kayıtları bağlamıyla inceler.",
    seoTitle: "OBD Beyin Kontrolü Bursa",
    description: "Aktif ve geçmiş arıza kodları, kontrol ünitesi iletişimi, gösterge uyarıları ve voltaj kayıtlarının OBD kontrolünde nasıl yorumlandığını öğrenin.",
    introduction: "Gösterge panelinde uyarı ışığı bulunmaması, araçta kayıt olmadığı anlamına gelmez. OBD taramasında kodun aktif veya geçmiş olması, hangi ünitede görüldüğü ve ortak bir voltaj/iletişim nedeni ihtimali birlikte değerlendirilir.",
    checks: ["Aktif ve geçmiş arıza kodları", "Kontrol üniteleriyle iletişim", "Gösterge uyarıları", "Voltaj ve iletişim kayıtları"],
    helpsIdentify: ["Göstergeye yansımayan geçmiş kayıtlar", "Tekrarlayan elektronik iletişim sorunları", "İleri diagnostik inceleme gerektiren kodlar"],
    limitations: ["Kod silinmişse önceki kayıt görünmeyebilir.", "Arıza kodu tek başına parça değişimi kararı değildir.", "Bazı marka/model sistemleri standart taramaya sınırlı yanıt verebilir."],
    relatedPackageSlugs: ["mini", "orta", "tam", "full"],
    relatedBlogSlugs: ["obd-gecmis-hata-kodlari", "gosterge-sessizdi-beyin-kayitlari-degildi", "yeni-aku-eski-sarj-sorusu"],
    faq: [
      { question: "Arıza ışığı yanmıyorsa OBD kontrolü gerekir mi?", answer: "Evet. Geçmiş veya aralıklı kayıtlar gösterge ışığı sürekli yanmadan da kontrol ünitelerinde bulunabilir." },
      { question: "OBD kodu arızalı parçayı kesin gösterir mi?", answer: "Hayır. Kod, etkilenen sistem ve koşul hakkında yön verir; kesin neden için ölçüm ve gerektiğinde ileri diagnostik gerekir." },
    ],
  },
  {
    slug: "sanziman-kontrolu",
    eyebrow: "Vites geçişi ve elektronik kayıtlar",
    title: "Şanzıman kontrolü çalışma bulgularını ve erişilebilen kayıtları birleştirir.",
    seoTitle: "Şanzıman Kontrolü Bursa",
    description: "Vites geçiş bulguları, çalışma sesi, görülebilen kaçak izleri ve şanzıman kontrol ünitesi kayıtlarının nasıl değerlendirildiğini inceleyin.",
    introduction: "Şanzıman değerlendirmesinde çalışma davranışı, uygun koşullardaki geçiş gözlemi ve elektronik kayıtlar birlikte ele alınır. Araç tipi ve güvenli test imkânı uygulanabilecek kontrolü etkiler.",
    checks: ["Vites geçiş bulguları", "Çalışma sesi ve titreşim", "Görülebilen kaçak izleri", "Şanzıman kontrol ünitesi kayıtları"],
    helpsIdentify: ["Takip veya servis incelemesi gerektiren geçiş davranışları", "Elektronik kayıt ile sürüş bulgusunun uyuşması", "Erişilebilen bölgelerde kaçak şüphesi"],
    limitations: ["Kısa kontrol uzun dönem dayanıklılık garantisi değildir.", "Şanzıman sökülmeden iç mekanik durum kesinleştirilemez.", "Her trafik ve yol koşulu test edilemeyebilir."],
    relatedPackageSlugs: ["orta", "tam", "full"],
    relatedBlogSlugs: ["test-surusundeki-tek-tikirti", "gosterge-sessizdi-beyin-kayitlari-degildi"],
    faq: [
      { question: "Şanzıman kontrolü hangi paketlerde var?", answer: "Yayınlanan kapsamda şanzıman başlıkları Orta, Tam ve Full paketlerde yer alır." },
      { question: "Şanzımanın ömrü belirlenebilir mi?", answer: "Hayır. Kontrol anındaki bulgular ve kayıtlar aktarılır; gelecekteki ömür veya arızasızlık garantisi verilmez." },
    ],
  },
  {
    slug: "airbag-kontrolu",
    eyebrow: "Emniyet sistemi elektronik ve görsel kontrolü",
    title: "Airbag kontrolü gösterge davranışından daha fazlasını inceler.",
    seoTitle: "Airbag Kontrolü Bursa",
    description: "Airbag kontrol ünitesi, uyarı lambası, emniyet kemeri kayıtları ve erişilebilen müdahale şüphesi alanlarının nasıl kontrol edildiğini görün.",
    introduction: "Airbag ışığının kontak sonrasında sönmesi ilk kontroldür; geçmiş kayıtları ve erişilebilen fiziksel noktaları tek başına açıklamaz. Elektronik tarama ile görsel bulgular ayrı ayrı notlanır.",
    checks: ["Airbag kontrol ünitesi taraması", "Uyarı lambası davranışı", "Emniyet kemeri ve gergi sistemi kayıtları", "Direksiyon ve torpido çevresinde erişilebilen görsel alanlar"],
    helpsIdentify: ["Aktif veya geçmiş emniyet sistemi kayıtları", "Elektronik ve görsel bulgu uyumsuzlukları", "Uzman servis doğrulaması gerektiren şüpheler"],
    limitations: ["Kapalı airbag modülleri sökülmeden iç durum beyanı verilmez.", "Kod silinmiş veya sistem değiştirilmişse geçmiş sınırlı görünebilir.", "Güvenlik şüphesi branş servisinde doğrulanmalıdır."],
    relatedPackageSlugs: ["full"],
    relatedBlogSlugs: ["airbag-isigi-sonuyordu-kontrol-bitmedi", "gosterge-sessizdi-beyin-kayitlari-degildi"],
    faq: [
      { question: "Airbag kontrolü hangi pakette bulunuyor?", answer: "Yayınlanan paket yapısında airbag kontrolü Full Paket kapsamındadır." },
      { question: "Airbag ışığı sönüyorsa sistem sağlam mıdır?", answer: "Işığın normal sönmesi olumlu bir başlangıçtır; geçmiş kayıtlar ve erişilebilen görsel noktalar ayrıca kontrol edilir." },
    ],
  },
  {
    slug: "conta-kontrolu",
    eyebrow: "Yağ ve soğutma sistemi belirtileri",
    title: "Conta kontrolünde tek belirti yerine birbiriyle ilişkili bulgular aranır.",
    seoTitle: "Conta Kontrolü Bursa",
    description: "Genleşme kabı, motor yağ kapağı, görülebilen basınç ve kaçak izleri ile yağ-su karışımı şüphesinin nasıl değerlendirildiğini öğrenin.",
    introduction: "Renk, koku veya seviye değişimi tek başına kesin conta sonucu değildir. Motor sıcaklığı, yakın bakım geçmişi ve birden fazla belirtinin aynı yönde olup olmadığı birlikte değerlendirilir.",
    checks: ["Genleşme kabı görünümü", "Motor yağ kapağı çevresi", "Görülebilen basınç ve kaçak izleri", "Yağ ve su karışımı şüphesi"],
    helpsIdentify: ["İleri basınç veya kimyasal test gerektirebilecek belirtiler", "Soğutma ve yağ sistemindeki görünür tutarsızlıklar", "Takip kontrolü gerektiren sınırda bulgular"],
    limitations: ["Ekspertiz gözlemi motor açılmadan kesin iç hasar teşhisi koymaz.", "Motor sıcaklığı ve yakın bakım sonucu etkileyebilir.", "Şüphe durumunda ileri servis testi gerekir."],
    relatedPackageSlugs: ["tam", "full"],
    relatedBlogSlugs: ["conta-kontrolunde-ilk-isaretler", "temiz-motor-her-zaman-iyi-haber-degil"],
    faq: [
      { question: "Conta kontrolü kesin sonuç verir mi?", answer: "Görsel ve çalışma bulguları şüpheyi değerlendirmeye yardımcı olur. Kesin teşhis için gerektiğinde basınç, kaçak veya kimyasal test önerilir." },
      { question: "Conta kontrolü hangi paketlerde var?", answer: "Yayınlanan kapsamda conta kontrolü Tam ve Full paketlerde yer alır." },
    ],
  },
  {
    slug: "ikinci-el-arac-ekspertiz",
    eyebrow: "Satın alma öncesi karar desteği",
    title: "İkinci el araç ekspertizi bulguyu, sınırı ve sonraki adımı ayırır.",
    seoTitle: "İkinci El Araç Ekspertiz Bursa",
    description: "İkinci el araç alımında kaporta, mekanik, elektronik ve güvenlik bulgularını paket kapsamıyla birlikte değerlendirin.",
    introduction: "İkinci el araç kontrolünün amacı kusursuz araç ilan etmek değil, satın alma kararındaki belirsizliği azaltmaktır. Doğrulanabilen bulgu, kontrolün sınırı ve önerilen ileri inceleme birbirinden ayrılır.",
    checks: ["Araç geçmişine işaret edebilecek gövde bulguları", "Motor-mekanik çalışma ve görsel izler", "Elektronik kontrol ünitesi kayıtları", "Pakete göre şanzıman, conta ve airbag başlıkları"],
    helpsIdentify: ["Pazarlık veya ileri kontrol gerektirebilecek riskler", "Farklı sistemlerde ortak neden ihtimali", "Satın alma öncesi sorulması gereken ek sorular"],
    limitations: ["Ekspertiz hukuki garanti veya değerleme raporu değildir.", "Resmî kilometre ve hasar geçmişi ilgili kayıt kaynaklarından ayrıca doğrulanmalıdır.", "Gelecekteki arızalar garanti edilemez."],
    relatedPackageSlugs: ["mini", "orta", "tam", "full"],
    relatedBlogSlugs: ["dusuk-kilometre-ic-mekan-izleri", "parlak-kaput-hizalama-farki", "gosterge-sessizdi-beyin-kayitlari-degildi"],
    faq: [
      { question: "Ekspertiz raporu aracı almam gerektiğini söyler mi?", answer: "Hayır. Rapor bulguları ve sınırları açıklar; satın alma kararı kullanıcıya aittir." },
      { question: "Hasar ve kilometre geçmişi ayrıca kontrol edilmeli mi?", answer: "Evet. Fiziksel ekspertiz, resmî kayıt ve belge doğrulamasının yerine geçmez; birlikte değerlendirilmelidir." },
    ],
  },
  {
    slug: "oto-ekspertiz-raporu",
    eyebrow: "Bulguların açık aktarımı",
    title: "Oto ekspertiz raporu görüleni, sınırı ve önerilen takibi ayırmalıdır.",
    seoTitle: "Oto Ekspertiz Raporu Nasıl Okunur?",
    description: "Oto ekspertiz raporunda kontrol kapsamı, doğrulanabilen bulgular, kontrol sınırları ve önerilen ileri inceleme adımlarını nasıl okuyacağınızı öğrenin.",
    introduction: "Sağlıklı bir ekspertiz raporu kesinlik izlenimi vermek yerine hangi başlığın kontrol edildiğini, hangi bulgunun görüldüğünü ve hangi alanın ileri inceleme gerektirdiğini açıklar. Sitede gerçek müşteriye ait rapor, plaka veya kişisel veri örneği yayınlanmaz.",
    checks: ["Seçilen paket ve uygulanan kontrol başlıkları", "Parça veya sistem bazlı bulgu notları", "Kontrolün teknik sınırları", "Gerekli görülen ileri servis önerileri"],
    helpsIdentify: ["Kritik ve takip gerektiren bulguların ayrımı", "Bir bulgunun hangi yöntemle gözlendiği", "Karar öncesi sorulması gereken ek sorular"],
    limitations: ["Rapor, kontrol anı ve seçilen paket kapsamını yansıtır.", "Kişisel veri içeren gerçek raporlar açık izin olmadan paylaşılmaz.", "Rapor hukuki garanti veya gelecekteki arıza taahhüdü değildir."],
    relatedPackageSlugs: ["mini", "orta", "tam", "full"],
    relatedBlogSlugs: ["boya-olcumunde-tek-panel-farki", "obd-gecmis-hata-kodlari", "conta-kontrolunde-ilk-isaretler"],
    reportExample: true,
    faq: [
      { question: "Sitede örnek ekspertiz raporu var mı?", answer: "Kişisel veri ve araç bilgisi içermeyen, işletme tarafından onaylanmış gerçek bir örnek henüz yayınlanmamıştır. Bu sayfa raporun nasıl okunacağını açıklar." },
      { question: "Rapordaki her bulgu arıza anlamına gelir mi?", answer: "Hayır. Bulgular önem düzeyi, gözlem yöntemi ve önerilen sonraki adımla birlikte değerlendirilmelidir." },
    ],
  },
];

export function findServiceLandingPage(slug: string) {
  return serviceLandingPages.find((page) => page.slug === slug);
}
