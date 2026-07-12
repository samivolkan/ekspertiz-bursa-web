export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  displayDate: string;
  readingTime: string;
  introduction: string;
  sections: BlogSection[];
  takeaways: string[];
};

export type BlogImage = {
  src: string;
  alt: string;
  caption: string;
};

const blogImages: Record<string, BlogImage> = {
  "boya-olcumunde-tek-panel-farki": {
    src: assetPath("/images/blog/boya-olcumunde-tek-panel-farki.webp"),
    alt: "Araç kaportasında boya kalınlığı ölçümü yapan ekspertiz uzmanı",
    caption: "Boya ölçümü tek noktadan değil, panel boyunca karşılaştırmalı yapılır.",
  },
  "obd-gecmis-hata-kodlari": {
    src: assetPath("/images/blog/obd-gecmis-hata-kodlari.webp"),
    alt: "Motor bölümünde tablet ile OBD diagnostik kontrolü",
    caption: "Elektronik tarama aktif ve geçmiş hata kayıtlarını birlikte gösterir.",
  },
  "conta-kontrolunde-ilk-isaretler": {
    src: assetPath("/images/blog/conta-kontrolunde-ilk-isaretler.webp"),
    alt: "Lift üzerindeki aracın motor ve mekanik bölümlerini kontrol eden teknisyen",
    caption: "Conta şüphesi birden fazla görsel ve mekanik bulgunun birlikte okunmasını gerektirir.",
  },
  "gosterge-sessizdi-beyin-kayitlari-degildi": {
    src: assetPath("/images/blog/gosterge-sessizdi-beyin-kayitlari-degildi.webp"),
    alt: "Araç kontrol ünitelerini diagnostik cihazla tarayan ekspertiz uzmanı",
    caption: "Gösterge paneli sessiz olsa da kontrol ünitelerinde geçmiş kayıtlar bulunabilir.",
  },
  "parlak-kaput-hizalama-farki": {
    src: assetPath("/images/blog/parlak-kaput-hizalama-farki.webp"),
    alt: "Araç panel yüzeyinde boya ve hizalama kontrolü",
    caption: "Parlak bir yüzey, panel aralıkları ve boya değerleri incelenmeden tek başına yeterli değildir.",
  },
  "test-surusundeki-tek-tikirti": {
    src: assetPath("/images/blog/test-surusundeki-tek-tikirti.webp"),
    alt: "Lift üzerindeki aracın alt mekanik kontrollerini yapan teknisyen",
    caption: "Test sürüşündeki sesler lift üzerindeki mekanik bulgularla birlikte değerlendirilir.",
  },
  "yeni-aku-eski-sarj-sorusu": {
    src: assetPath("/images/blog/yeni-aku-eski-sarj-sorusu.webp"),
    alt: "Motor bölümünde elektrik ve şarj sistemi kontrolü",
    caption: "Yeni akü, şarj sisteminin tamamının sorunsuz olduğunu tek başına kanıtlamaz.",
  },
  "airbag-isigi-sonuyordu-kontrol-bitmedi": {
    src: assetPath("/images/blog/airbag-isigi-sonuyordu-kontrol-bitmedi.webp"),
    alt: "Araç güvenlik sistemlerini elektronik cihazla kontrol eden teknisyen",
    caption: "Airbag kontrolü gösterge davranışı, elektronik kayıt ve görsel bulguları birleştirir.",
  },
  "dusuk-kilometre-ic-mekan-izleri": {
    src: assetPath("/images/blog/dusuk-kilometre-ic-mekan-izleri.webp"),
    alt: "Ekspertiz merkezinde genel araç durum kontrolü",
    caption: "Kullanım izleri, kilometre kayıtları ve aracın genel durumu birlikte okunur.",
  },
  "temiz-motor-her-zaman-iyi-haber-degil": {
    src: assetPath("/images/blog/temiz-motor-her-zaman-iyi-haber-degil.webp"),
    alt: "Temiz motor bölümünde kaçak ve mekanik kontrol yapan uzman",
    caption: "Yakın zamanda temizlenen motor bölümü eski kaçak izlerinin görülmesini zorlaştırabilir.",
  },
};

export const blogPosts: BlogPost[] = [
  {
    slug: "boya-olcumunde-tek-panel-farki",
    title: "Boya ölçümünde tek panel farkı ne anlatır?",
    description:
      "Kaporta boya ölçümünde yalnızca bir panelde farklı değer görülürse bunun nasıl yorumlandığını günlük ekspertiz notlarımızla anlatıyoruz.",
    category: "Kaporta ve boya",
    publishedAt: "2026-07-11",
    displayDate: "11 Temmuz 2026",
    readingTime: "4 dk okuma",
    introduction:
      "Bu kurgusal senaryoda yalnızca tek panelde farklı boya kalınlığı görülüyor. Tek bir ölçümle karar vermek yerine panelin tamamını ve komşu parçaları birlikte değerlendirmenin neden önemli olduğunu adım adım ele alıyoruz.",
    sections: [
      {
        heading: "Tek değer değil, ölçüm haritası önemlidir",
        paragraphs: [
          "Boya kalınlığı kaput, tavan, çamurluk ve kapı gibi farklı yüzeylerde birden fazla noktadan ölçülür. Aynı panel içinde tutarlı ilerleyen değerler ile yalnızca küçük bir bölgede yükselen değerler farklı ihtimallere işaret edebilir.",
          "Komşu panellerdeki değerler, bağlantı noktaları ve yüzeydeki görsel izler ölçümün bağlamını oluşturur. Bu nedenle cihazdaki tek rakam, tek başına parça değişimi ya da ağır onarım sonucu anlamına gelmez.",
        ],
      },
      {
        heading: "Görsel kontrol ölçümü tamamlar",
        paragraphs: [
          "Ton farkı, vernik dokusu, kenar bant izi, cıvata ve bağlantı noktaları gibi ayrıntılar cihaz ölçümüyle birlikte incelenir. İki bulgu birbirini desteklediğinde yorum daha sağlıklı hale gelir.",
          "Ekspertiz raporunda amaç kesin olmayan bir geçmişi varsaymak değil, görülen ve ölçülen durumu açık biçimde aktarmaktır.",
        ],
      },
    ],
    takeaways: [
      "Her panel birden fazla noktadan karşılaştırılmalıdır.",
      "Komşu parçalar ve bağlantı noktaları ölçümün bağlamını gösterir.",
      "Tek bir yüksek değer, tek başına kesin onarım kararı değildir.",
    ],
  },
  {
    slug: "obd-gecmis-hata-kodlari",
    title: "OBD taramasında geçmiş hata kodları neden önemlidir?",
    description:
      "Araç beyninde kayıtlı geçmiş hata kodlarının güncel arızadan farkını ve ekspertiz sırasında neden birlikte değerlendirildiğini açıklıyoruz.",
    category: "Beyin ve OBD",
    publishedAt: "2026-07-10",
    displayDate: "10 Temmuz 2026",
    readingTime: "5 dk okuma",
    introduction:
      "Bu kurgusal bileşik senaryoda gösterge panelinde uyarı bulunmamasına rağmen elektronik taramada geçmiş kayıtlar görülüyor. Her hata kodunun aktif arıza anlamına gelmediğini ve kayıtların nasıl ayrıştırıldığını anlatıyoruz.",
    sections: [
      {
        heading: "Aktif ve geçmiş kayıt arasındaki fark",
        paragraphs: [
          "Aktif kod, ilgili kontrol ünitesinin koşulu inceleme sırasında hâlâ algıladığını gösterebilir. Geçmiş kod ise düşük akü voltajı, geçici bir bağlantı kesintisi veya daha önce giderilmiş bir sorun nedeniyle hafızada kalmış olabilir.",
          "Kodun açıklaması, tekrar sayısı ve mevcut gösterge uyarıları birlikte okunur. Araç çalışırken yapılan gözlem ve uygun olduğunda kısa kullanım kontrolü de elektronik bulgunun önemini anlamaya yardımcı olur.",
        ],
      },
      {
        heading: "Kod silmek geçmişi açıklamaz",
        paragraphs: [
          "Tarama öncesinde kayıtların silinmiş olması, sistemin hemen yeniden kod üretmemesine yol açabilir. Bu yüzden yalnızca kod listesine değil, hazır olma monitörleri ve kontrol üniteleri arasındaki iletişim durumuna da bakılır.",
          "Raporda kodun hangi ünitede görüldüğü ve inceleme anındaki durumu belirtilir; kesin arıza teşhisi gerekiyorsa ilgili branş servisine yönlendirme önerilir.",
        ],
      },
    ],
    takeaways: [
      "Her kayıt aktif arıza anlamına gelmez.",
      "Kod, aracın mevcut davranışı ve gösterge uyarılarıyla birlikte yorumlanır.",
      "Elektronik tarama, gerektiğinde ayrıntılı servis teşhisinin yerini tutmaz.",
    ],
  },
  {
    slug: "conta-kontrolunde-ilk-isaretler",
    title: "Conta kontrolünde ilk bakılan işaretler",
    description:
      "Silindir kapak contası şüphesinde ekspertiz sırasında gözlenen temel işaretleri ve neden tek bulguyla karar verilmediğini paylaşıyoruz.",
    category: "Motor ve mekanik",
    publishedAt: "2026-07-09",
    displayDate: "9 Temmuz 2026",
    readingTime: "4 dk okuma",
    introduction:
      "Bu kurgusal senaryoda motor çevresindeki birkaç küçük iz, conta kontrolünü gündeme getiriyor. Tek bir renk, koku veya seviye değişimiyle kesin hüküm vermek yerine belirtilerin birbirini destekleyip desteklemediğine bakıyoruz.",
    sections: [
      {
        heading: "Soğutma ve yağ sistemleri birlikte incelenir",
        paragraphs: [
          "Genleşme kabındaki seviye ve görünüm, motor yağı kapağı çevresi, görülebilen kaçak izleri ve hortumların genel durumu ilk kontrol başlıkları arasındadır. İnceleme güvenli motor sıcaklığında ve erişilebilen bölgelerde yapılır.",
          "Kısa mesafe kullanım, mevsim koşulları veya yakın zamanda yapılan bakım bazı izlerin yorumunu değiştirebilir. Bu nedenle araç sahibinden alınan bakım bilgisi de bulguların bağlamına eklenir.",
        ],
      },
      {
        heading: "Şüphe varsa ileri test gerekir",
        paragraphs: [
          "Birden fazla belirti aynı yönde şüphe oluşturuyorsa basınç, kaçak veya kimyasal test gibi daha ayrıntılı kontroller önerilebilir. Ekspertiz gözlemi, motor açılmadan kesin iç hasar teşhisi koymaz.",
          "Müşteriye aktarılan sonuç, görülen bulgular ile önerilen sonraki adımı birbirinden ayırır. Böylece satın alma kararı varsayımdan değil, doğrulanabilir bilgiden ilerler.",
        ],
      },
    ],
    takeaways: [
      "Conta şüphesi birden fazla bulgunun birlikte değerlendirilmesini gerektirir.",
      "Motor sıcaklığı ve yakın bakım geçmişi yorumu etkileyebilir.",
      "Kesin teşhis için gerektiğinde ileri servis testleri önerilir.",
    ],
  },
  {
    slug: "gosterge-sessizdi-beyin-kayitlari-degildi",
    title: "Gösterge sessizdi, beyin kayıtları değildi",
    description:
      "Gösterge panelinde arıza ışığı olmayan bir araçta OBD taraması neden yine de kritik olabilir? Kurgusal ekspertiz hikâyesiyle açıklıyoruz.",
    category: "Beyin ve OBD",
    publishedAt: "2026-07-08",
    displayDate: "8 Temmuz 2026",
    readingTime: "4 dk okuma",
    introduction:
      "Kurgusal senaryomuzdaki araç ilk çalıştırmada sessiz, gösterge paneli ise uyarısız görünüyor. OBD taraması başladığında birden fazla kontrol ünitesinde aralıklı iletişim kayıtlarıyla karşılaşılıyor.",
    sections: [
      {
        heading: "Uyarı ışığı neden yeterli değildir?",
        paragraphs: [
          "Bazı kayıtlar aralıklı oluştuğu veya belirli koşullar tekrar gerçekleşmediği için gösterge ışığını sürekli yakmayabilir. Kodun statüsü, zamanı ve hangi kontrol ünitesinde bulunduğu bu nedenle önem taşır.",
          "Düşük voltaj geçmişi gibi ortak bir neden, farklı ünitelerde benzer kayıtlar bırakabilir. Bulguları tek tek arıza gibi saymak yerine ortak neden ihtimali araştırılır.",
        ],
      },
      {
        heading: "Sonuç nasıl aktarılır?",
        paragraphs: [
          "Tarama sonucu aktif ve geçmiş kayıtlar ayrılarak rapora eklenir. Mevcut sürüş davranışı normal olsa bile tekrar kontrolü veya branş servis incelemesi önerilebilecek başlıklar açıkça belirtilir.",
        ],
      },
    ],
    takeaways: [
      "Uyarı ışığının sönük olması kayıt bulunmadığını göstermez.",
      "Birden fazla kod ortak bir voltaj veya iletişim sorunundan kaynaklanabilir.",
      "Kod statüsü, açıklaması kadar önemlidir.",
    ],
  },
  {
    slug: "parlak-kaput-hizalama-farki",
    title: "Parlak kaputun altında saklanan hizalama farkı",
    description:
      "Temiz ve parlak görünen bir otomobilde kaporta panel aralıkları, bağlantı noktaları ve boya ölçümü birlikte nasıl okunur?",
    category: "Kaporta ve boya",
    publishedAt: "2026-07-07",
    displayDate: "7 Temmuz 2026",
    readingTime: "5 dk okuma",
    introduction:
      "Bu kurgusal ekspertiz hikâyesinde aracın kaputu ilk bakışta kusursuz görünüyor. Fakat sağ ve sol panel aralıkları karşılaştırıldığında küçük bir hizalama farkı, kontrolün bağlantı noktalarına doğru genişletilmesini gerektiriyor.",
    sections: [
      {
        heading: "Parlak yüzey neden tek başına güvence değildir?",
        paragraphs: [
          "Profesyonel temizlik yüzeydeki küçük ton ve doku farklarını ilk bakışta gizleyebilir. Gün ışığı açısı, boya kalınlığı ve kenar bölgeleri birlikte incelendiğinde daha tutarlı bir tablo oluşur.",
          "Kaput cıvatalarındaki izler de tek başına değişim kanıtı değildir; ayar işlemi veya bakım için sökme gibi ihtimaller bulunur. Bu nedenle ölçüm ve görsel bulgu birlikte raporlanır.",
        ],
      },
      {
        heading: "Hizalama farkı nasıl doğrulanır?",
        paragraphs: [
          "Karşılıklı boşluklar, kaput kapanma çizgisi ve çamurluk bağlantıları aynı açıdan kıyaslanır. Sonuç, kesin geçmiş iddiası yerine gözlenen farklılık ve önerilen ileri kontrol olarak aktarılır.",
        ],
      },
    ],
    takeaways: [
      "Panel aralıkları aracın iki tarafı karşılaştırılarak okunmalıdır.",
      "Cıvata izi tek başına parça değişimi anlamına gelmez.",
      "Boya ölçümü ve görsel kontrol birbirini tamamlar.",
    ],
  },
  {
    slug: "test-surusundeki-tek-tikirti",
    title: "Kısa test sürüşündeki tek tıkırtı ne anlattı?",
    description:
      "Ön takımdan gelen aralıklı bir tıkırtının ekspertizde yol yüzeyi, hız ve mekanik kontrolle nasıl daraltıldığını anlatan kurgusal vaka.",
    category: "Motor ve mekanik",
    publishedAt: "2026-07-06",
    displayDate: "6 Temmuz 2026",
    readingTime: "5 dk okuma",
    introduction:
      "Kurgusal bileşik senaryomuzda araç düz yolda sessiz ilerliyor, düşük hızdaki küçük bir yüzey bozukluğunda ise tek bir tık sesi duyuluyor. Sesin kaynağını varsaymak yerine oluştuğu koşullar not edilerek mekanik kontrol derinleştiriliyor.",
    sections: [
      {
        heading: "Sesin oluştuğu koşul kaynağı daraltır",
        paragraphs: [
          "Dönüş yönü, frenleme anı, yol yüzeyi ve hız değişimi sesin tekrarlanıp tekrarlanmadığını anlamaya yardımcı olur. Aynı sesin her koşulda oluşmaması, kontrolün farklı bağlantı ve burç noktalarına yönelmesini sağlayabilir.",
          "Lift kontrolünde görülen boşluk veya aşınma izi test sürüşündeki gözlemle birlikte değerlendirilir. Tek başına ses üzerinden parça adı vermek doğru değildir.",
        ],
      },
      {
        heading: "Raporda ses nasıl ifade edilir?",
        paragraphs: [
          "Sesin duyulduğu koşul, kontrol edilen alan ve doğrulanabilen mekanik bulgu ayrı ayrı yazılır. Kesinleştirilemeyen durumlarda ayrıntılı ön takım kontrolü önerilir.",
        ],
      },
    ],
    takeaways: [
      "Yol yüzeyi ve hız bilgisi ses kontrolünün parçasıdır.",
      "Test sürüşü ile lift bulguları birlikte okunmalıdır.",
      "Kaynağı doğrulanmayan ses için kesin parça iddiası yazılmaz.",
    ],
  },
  {
    slug: "yeni-aku-eski-sarj-sorusu",
    title: "Yeni akü, eski şarj sorusunu çözmedi",
    description:
      "Yeni takılmış aküye rağmen düşük voltaj kayıtları neden görülebilir? Alternatör ve şarj sistemi kontrolünü kurgusal hikâyeyle anlatıyoruz.",
    category: "Elektrik sistemi",
    publishedAt: "2026-07-05",
    displayDate: "5 Temmuz 2026",
    readingTime: "4 dk okuma",
    introduction:
      "Bu kurgusal senaryoda araçta yeni tarihli bir akü bulunuyor; buna rağmen farklı kontrol ünitelerinde düşük voltaj geçmişi görülüyor. Akünün yenilenmiş olması, şarj sisteminin tamamının sağlıklı olduğunu tek başına göstermiyor.",
    sections: [
      {
        heading: "Akü ve şarj sistemi farklı başlıklardır",
        paragraphs: [
          "Akü ilk çalıştırma için enerji depolarken alternatör sürüş sırasında sistemi besler. Kutup bağlantıları, şarj voltajı ve elektrik tüketicileri devredeyken oluşan değerler birlikte incelenir.",
          "Geçmiş düşük voltaj kayıtları eski akü döneminden kalmış olabilir. Aktif ölçüm normal ise kayıtların zamanı ve tekrar durumu raporda bu ayrımla belirtilir.",
        ],
      },
      {
        heading: "Neden takip önerilebilir?",
        paragraphs: [
          "Sınırda veya dalgalı ölçüm varsa farklı yük koşullarında ayrıntılı elektrik testi gerekebilir. Ekspertiz anındaki ölçüm, uzun süreli şarj performansının tamamını tek başına temsil etmez.",
        ],
      },
    ],
    takeaways: [
      "Yeni akü, alternatörün de yeni veya sorunsuz olduğu anlamına gelmez.",
      "Geçmiş voltaj kodları aktif ölçümle birlikte yorumlanır.",
      "Dalgalı sonuçlarda ayrıntılı elektrik testi önerilir.",
    ],
  },
  {
    slug: "airbag-isigi-sonuyordu-kontrol-bitmedi",
    title: "Airbag ışığı sönüyordu ama kontrol bitmemişti",
    description:
      "Airbag uyarı ışığının normal sönmesi neden tek başına yeterli değildir? Full Paket kapsamındaki elektronik ve görsel kontrolleri açıklıyoruz.",
    category: "Airbag kontrolü",
    publishedAt: "2026-07-04",
    displayDate: "4 Temmuz 2026",
    readingTime: "5 dk okuma",
    introduction:
      "Kurgusal hikâyemizde airbag ışığı kontak açıldığında yanıyor ve kısa süre sonra normal biçimde sönüyor. Yine de Full Paket kapsamındaki kontrol, sistem taraması ve erişilebilen görsel noktalar incelenmeden tamamlanmıyor.",
    sections: [
      {
        heading: "Gösterge davranışı yalnızca ilk adımdır",
        paragraphs: [
          "Kontak döngüsündeki ışık davranışı sistemin kendi kontrolüne dair bir işarettir, ancak geçmiş kayıtları veya fiziksel müdahale izlerini tek başına açıklamaz. Airbag kontrol ünitesindeki kodlar ve iletişim durumu ayrıca taranır.",
          "Erişilebilen emniyet kemeri, direksiyon ve torpido çevresindeki görsel farklılıklar da not edilir. Kapalı sistem parçaları sökülmeden kesin iç durum iddiası kurulmaz.",
        ],
      },
      {
        heading: "Güvenlik sistemi bulgusu nasıl yazılır?",
        paragraphs: [
          "Elektronik kayıt ile görsel gözlem birbirinden ayrılarak aktarılır. Şüpheli bir bulgu varsa yetkili veya uzman servis doğrulaması önerilir.",
        ],
      },
    ],
    takeaways: [
      "Airbag ışığının sönmesi kontrolün tamamı değildir.",
      "Elektronik tarama ve erişilebilen görsel noktalar birlikte incelenir.",
      "Güvenlik sistemi şüphesi uzman servis doğrulaması gerektirir.",
    ],
  },
  {
    slug: "dusuk-kilometre-ic-mekan-izleri",
    title: "Düşük kilometre iddiası, yüksek kullanım izleri",
    description:
      "Kilometre göstergesi ile direksiyon, pedal ve koltuk kullanım izleri uyuşmadığında ekspertizde hangi veriler karşılaştırılır?",
    category: "İç ve dış kontrol",
    publishedAt: "2026-07-03",
    displayDate: "3 Temmuz 2026",
    readingTime: "5 dk okuma",
    introduction:
      "Bu kurgusal bileşik senaryoda gösterge kilometresi düşük görünüyor, fakat bazı iç mekân temas noktalarında beklenenden belirgin kullanım izleri bulunuyor. Görsel izler tek başına kilometre düşürme kanıtı sayılmadan farklı kayıtlarla karşılaştırılıyor.",
    sections: [
      {
        heading: "Kullanım izi neden kesin kanıt değildir?",
        paragraphs: [
          "Direksiyon kaplaması, pedal lastiği ve sürücü koltuğu kullanım biçimine, malzeme kalitesine ve önceki değişimlere göre farklı hızlarda aşınabilir. Bu nedenle yalnızca bir parçanın görünümü üzerinden kilometre sonucu çıkarılmaz.",
          "Varsa bakım kayıtları, muayene geçmişi ve elektronik ünitelerde erişilebilen kilometre bilgileri birbirleriyle kıyaslanır. Tutarsızlık varsa doğrulanabilen veri açıkça belirtilir.",
        ],
      },
      {
        heading: "Şüphe ile kanıt arasındaki çizgi",
        paragraphs: [
          "Raporda görünür aşınma ve kayıt farklılığı ayrı başlıklar olarak yazılır. Kesin kilometre geçmişi için resmi kayıtların ve servis belgelerinin doğrulanması önerilir.",
        ],
      },
    ],
    takeaways: [
      "İç mekân aşınması tek başına kilometre kanıtı değildir.",
      "Farklı kayıt kaynakları karşılaştırılmalıdır.",
      "Şüphe ile doğrulanmış tutarsızlık raporda ayrılır.",
    ],
  },
  {
    slug: "temiz-motor-her-zaman-iyi-haber-degil",
    title: "Tertemiz motor neden her zaman iyi haber değildir?",
    description:
      "Yeni yıkanmış motor bölümünde yağ ve sıvı kaçak izleri nasıl değerlendirilir? Ekspertiz öncesi motor temizliğinin etkisini anlatıyoruz.",
    category: "Motor ve mekanik",
    publishedAt: "2026-07-02",
    displayDate: "2 Temmuz 2026",
    readingTime: "4 dk okuma",
    introduction:
      "Kurgusal senaryomuzdaki motor bölümü olağanüstü temiz görünüyor. Temizliğin bakım titizliğini gösterebileceği gibi yakın zamandaki kaçak izlerini görünmez hale getirebileceği ihtimali de kontrol planına ekleniyor.",
    sections: [
      {
        heading: "Temizlik bulguyu nasıl etkiler?",
        paragraphs: [
          "Yağ, soğutma sıvısı veya yakıt çevresindeki eski izler yıkama sonrasında kaybolabilir. Erişilebilen conta kenarları, hortum bağlantıları ve alt koruma bölgeleri bu nedenle dikkatle incelenir.",
          "Yeni bir ıslaklık görülmemesi, uzun dönem sızdırmazlığı kesinleştirmez. Motor sıcaklığı ve kısa kullanım sonrası tekrar gözlem daha anlamlı olabilir.",
        ],
      },
      {
        heading: "Temiz motor nasıl raporlanır?",
        paragraphs: [
          "Motor bölümünün yakın zamanda temizlendiği görülüyorsa bu durum, kaçak kontrolünün sınırıyla birlikte belirtilir. Şüphe halinde sonraki kullanımda yeniden kontrol önerilir.",
        ],
      },
    ],
    takeaways: [
      "Motor temizliği olumlu görünse de eski kaçak izlerini silebilir.",
      "Sıcaklık ve kullanım sonrası gözlem önemlidir.",
      "Kontrolün sınırı raporda açıkça belirtilmelidir.",
    ],
  },
];

export function findBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogImage(post: BlogPost): BlogImage {
  return blogImages[post.slug] ?? {
    src: assetPath("/images/hero-inspection.webp"),
    alt: "Ekspertiz merkezinde araç kontrolü",
    caption: "Kontrol kapsamı aracın durumuna ve seçilen pakete göre uygulanır.",
  };
}

export function blogHeadingId(heading: string) {
  return heading
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
import { assetPath } from "@/lib/assets";
