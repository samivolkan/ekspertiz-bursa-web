const defaultGa4MeasurementId = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true"
  ? ""
  : "G-K6LBGJQ8T1";

export const businessConfig = {
  SITE_URL: "https://www.bursaekspertiz.com",
  SITE_NAME: "Ekspertiz Bursa",
  BUSINESS_NAME: "Ekspertiz Bursa",
  LEGAL_BUSINESS_NAME: "",
  PHONE: "+905527415143",
  WHATSAPP_PHONE: "+905527415143",
  EMAIL: "info@ekspertizbursa.com",
  STREET_ADDRESS: "Üçevler Mahallesi, Küçük Sanayi Sitesi 18. Blok No: 21/2",
  DISTRICT: "Nilüfer",
  CITY: "Bursa",
  POSTAL_CODE: "",
  COUNTRY: "TR",
  LATITUDE: "",
  LONGITUDE: "",
  GOOGLE_MAPS_URL:
    "https://www.google.com/maps/search/?api=1&query=%C3%9C%C3%A7evler%20Mahallesi%20K%C3%BC%C3%A7%C3%BCk%20Sanayi%20Sitesi%2018.%20Blok%20No%2021%2F2%20Nil%C3%BCfer%20Bursa",
  GOOGLE_BUSINESS_PROFILE_URL: "",
  INSTAGRAM_URL: "",
  FACEBOOK_URL: "",
  YOUTUBE_URL: "",
  OPENING_HOURS: "Mo-Su 08:30-18:30",
  PRICE_RANGE: "",
  LOGO_URL: "/brand/ekspertiz-bursa-mark.png",
  DEFAULT_OG_IMAGE: "/og-red.png",
  GA4_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim() || defaultGa4MeasurementId,
  GTM_CONTAINER_ID: process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? "",
  PACKAGE_PRICE_UPDATED_AT: "2026-07-13",
  PACKAGE_TAX_STATUS: "unverified",
} as const;

export const siteConfig = {
  name: businessConfig.SITE_NAME,
  shortName: "EB",
  tagline: "Aracınızı almadan önce, gerçeği görün.",
  description:
    "Bursa Nilüfer'de ikinci el araç alımından önce paket kapsamını karşılaştırabileceğiniz ve çevrim içi randevu talebi oluşturabileceğiniz oto ekspertiz hizmeti.",
  canonicalUrl: businessConfig.SITE_URL,
  city: businessConfig.CITY,
  district: businessConfig.DISTRICT,
  phoneDisplay: "0552 741 51 43",
  phoneHref: `tel:${businessConfig.PHONE}`,
  whatsappHref: `https://wa.me/${businessConfig.WHATSAPP_PHONE.replace(/\D/g, "")}?text=${encodeURIComponent("Merhaba, Ekspertiz Bursa hakkında bilgi almak istiyorum.")}`,
  email: businessConfig.EMAIL,
  address: `${businessConfig.STREET_ADDRESS}, ${businessConfig.DISTRICT}/${businessConfig.CITY}`,
  mapUrl: businessConfig.GOOGLE_MAPS_URL,
  legalName: businessConfig.LEGAL_BUSINESS_NAME,
  legalEntityNote:
    "Resmî ticari unvan ve vergi bilgisi işletme tarafından doğrulandığında bu sayfada ayrıca gösterilecektir.",
  privacyEmail: "info@ekspertizbursa.com",
  priceTaxNote:
    "Fiyatlar bilgilendirme amaçlıdır; KDV, ödeme yöntemi ve nihai kapsam randevu teyidinde işletme tarafından netleştirilir.",
  workingHours: `Her gün ${businessConfig.OPENING_HOURS.replace(/^Mo-Su\s+/, "").replace("-", "–")}`,
  openingHours: businessConfig.OPENING_HOURS,
  missingVerifiedFields: [
    !businessConfig.LEGAL_BUSINESS_NAME ? "Resmî ticari unvan" : "",
    !businessConfig.POSTAL_CODE ? "Posta kodu" : "",
    !businessConfig.LATITUDE || !businessConfig.LONGITUDE ? "Koordinatlar" : "",
    !businessConfig.GOOGLE_BUSINESS_PROFILE_URL ? "Google Business Profile bağlantısı" : "",
    !businessConfig.INSTAGRAM_URL && !businessConfig.FACEBOOK_URL && !businessConfig.YOUTUBE_URL ? "Sosyal medya hesapları" : "",
    !businessConfig.GA4_MEASUREMENT_ID && !businessConfig.GTM_CONTAINER_ID ? "GA4 veya GTM kimliği" : "",
    businessConfig.PACKAGE_TAX_STATUS === "unverified" ? "Paket fiyatlarının KDV durumu" : "",
  ].filter(Boolean),
} as const;

export type PackageItem = {
  slug: string;
  name: string;
  badge: string;
  description: string;
  duration: string;
  price: string | null;
  features: string[];
  featureGroups: PackageFeatureGroup[];
  bestFor: string;
  draft: boolean;
};

export type PackageFeatureGroup = {
  name: string;
  items: string[];
};

const bodyworkGroup: PackageFeatureGroup = {
  name: "Kaporta ve boya kontrolleri",
  items: [
    "Boya kalınlığı ölçümü",
    "Boyalı veya değişen parça şüphesi",
    "Panel aralıkları ve hizalama",
    "Kaput, bagaj ve kapı yüzeyleri",
    "Tampon ve dış gövde yüzeyleri",
    "Çizik, gamze ve göçük izleri",
    "Görsel deformasyon kontrolü",
    "Parça bazlı bulgu notları",
  ],
};

const engineMechanicalGroup: PackageFeatureGroup = {
  name: "Motor ve mekanik kontroller",
  items: [
    "Motor yağı seviye ve görünümü",
    "Soğutma suyu seviye ve görünümü",
    "Görülebilen yağ ve sıvı kaçak izleri",
    "Erişilebilen kayış ve hortumlar",
    "Motor sesi ve titreşim bulguları",
    "Egzoz dumanına ilişkin gözlem",
    "Alt mekanik bölgelerde görsel kontrol",
    "Mekanik bulgu özeti",
  ],
};

const obdGroup: PackageFeatureGroup = {
  name: "Beyin ve OBD kontrolleri",
  items: [
    "Aktif arıza kodlarının taranması",
    "Geçmiş arıza kodlarının taranması",
    "Kontrol üniteleriyle iletişim durumu",
    "Gösterge uyarılarının kontrolü",
    "Voltaj ve iletişim kayıtlarının yorumu",
    "Elektronik bulgu özeti",
  ],
};

const transmissionGroup: PackageFeatureGroup = {
  name: "Şanzıman kontrolleri",
  items: [
    "Görülebilen kaçak izleri",
    "Vites geçiş bulguları",
    "Şanzıman kontrol ünitesi kayıtları",
    "Çalışma sesi ve titreşim gözlemi",
    "Genel şanzıman bulgu özeti",
  ],
};

const interiorExteriorGroup: PackageFeatureGroup = {
  name: "İç ve dış kontroller",
  items: [
    "Aydınlatma ve sinyal ekipmanları",
    "Camlar ve aynalar",
    "Kumanda ve düğmelerin genel durumu",
    "Koltuk, döşeme ve iç trim gözlemi",
    "Lastiklerin görsel durumu",
    "Dış donanım ve genel durum notları",
  ],
};

const gasketGroup: PackageFeatureGroup = {
  name: "Conta ve soğutma sistemi kontrolleri",
  items: [
    "Genleşme kabı görünümü",
    "Motor yağ kapağı çevresi",
    "Görülebilen basınç ve kaçak izleri",
    "Yağ ve su karışımı şüphesi",
    "Gerekirse ileri test önerisi",
  ],
};

const airbagGroup: PackageFeatureGroup = {
  name: "Airbag ve emniyet sistemi kontrolleri",
  items: [
    "Airbag kontrol ünitesi taraması",
    "Airbag uyarı lambası davranışı",
    "Emniyet kemeri ve gergi sistemi kayıtları",
    "Direksiyon ve torpido çevresinde görsel kontrol",
    "Müdahale şüphesi bulunan alanların notlanması",
  ],
};

export const packages: PackageItem[] = [
  {
    slug: "kaporta",
    name: "Mini Ekspertiz Kaporta Paketi",
    badge: "Gövde kontrolü",
    description:
      "Aracın kaporta ve boya yüzeyindeki görünür durumun parça bazında değerlendirilmesi için.",
    duration: "15 dk",
    price: "3.500 TL",
    features: [
      "Kaporta kontrolü",
      "Boya yüzeyi kontrolü",
      "Parça bazlı bulgu notları",
      "Görsel dış yüzey değerlendirmesi",
    ],
    featureGroups: [bodyworkGroup],
    bestFor: "Gövde ve boya geçmişine odaklanan kontrol",
    draft: false,
  },
  {
    slug: "motor-mekanik",
    name: "Mini Ekspertiz Motor-Mekanik Paketi",
    badge: "Mekanik kontrol",
    description:
      "Motor bölümü ve temel mekanik başlıklara odaklanan ekspertiz seçeneği.",
    duration: "20 dk",
    price: "3.500 TL",
    features: [
      "Motor kontrolü",
      "Mekanik kontrol başlıkları",
      "Görsel sıvı ve kaçak izi kontrolü",
      "Mekanik bulgu özeti",
    ],
    featureGroups: [engineMechanicalGroup],
    bestFor: "Motor ve mekanik duruma odaklanan kontrol",
    draft: false,
  },
  {
    slug: "mini",
    name: "Mini Paket",
    badge: "Başlangıç",
    description:
      "Kaporta, motor, mekanik ve beyin kontrollerini tek pakette birleştiren başlangıç seçeneği.",
    duration: "25 dk",
    price: "5.000 TL",
    features: [
      "Kaporta kontrolü",
      "Motor kontrolü",
      "Mekanik kontrol",
      "Beyin / OBD kontrolü",
    ],
    featureGroups: [bodyworkGroup, engineMechanicalGroup, obdGroup],
    bestFor: "Temel gövde, mekanik ve elektronik kontrolü birlikte isteyenler",
    draft: false,
  },
  {
    slug: "orta",
    name: "Orta Paket",
    badge: "Dengeli kapsam",
    description:
      "Mini pakete şanzıman ile iç ve dış kontrol başlıklarını ekleyen genişletilmiş seçenek.",
    duration: "30 dk",
    price: "7.500 TL",
    features: [
      "Kaporta, motor ve mekanik kontrol",
      "Beyin / OBD kontrolü",
      "Şanzıman kontrolü",
      "İç ve dış kontrol",
    ],
    featureGroups: [bodyworkGroup, engineMechanicalGroup, obdGroup, transmissionGroup, interiorExteriorGroup],
    bestFor: "Şanzıman ve genel iç-dış durumu da değerlendirmek isteyenler",
    draft: false,
  },
  {
    slug: "tam",
    name: "Tam Paket",
    badge: "Geniş kapsam",
    description:
      "Orta paket kapsamına conta kontrolünü ekleyen daha ayrıntılı ekspertiz seçeneği.",
    duration: "35 dk",
    price: "10.000 TL",
    features: [
      "Kaporta, motor ve mekanik kontrol",
      "Beyin / OBD ve şanzıman kontrolü",
      "İç ve dış kontrol",
      "Conta kontrolü",
    ],
    featureGroups: [bodyworkGroup, engineMechanicalGroup, obdGroup, transmissionGroup, interiorExteriorGroup, gasketGroup],
    bestFor: "Motor çevresi ve conta durumunu da kapsama almak isteyenler",
    draft: false,
  },
  {
    slug: "full",
    name: "Full Paket",
    badge: "En geniş kapsam",
    description:
      "Tam paket kapsamına airbag kontrolünü ekleyen en geniş ekspertiz seçeneği.",
    duration: "40 dk",
    price: "12.500 TL",
    features: [
      "Kaporta, motor ve mekanik kontrol",
      "Beyin / OBD ve şanzıman kontrolü",
      "İç-dış ve conta kontrolü",
      "Airbag kontrolü",
    ],
    featureGroups: [bodyworkGroup, engineMechanicalGroup, obdGroup, transmissionGroup, interiorExteriorGroup, gasketGroup, airbagGroup],
    bestFor: "Paylaşılan paketler içindeki en geniş kontrol kapsamını isteyenler",
    draft: false,
  },
];

export type ServiceItem = {
  slug: string;
  name: string;
  description: string;
  features: string[];
};

export const services: ServiceItem[] = [
  {
    slug: "kaporta-boya",
    name: "Kaporta ve boya",
    description:
      "Parça bazlı yüzey, boya ve değişim şüphesi bulunan bölgelerin kontrollü değerlendirilmesi.",
    features: ["Boya yüzeyi", "Parça durumu", "Görsel deformasyon"],
  },
  {
    slug: "motor-mekanik",
    name: "Motor ve mekanik",
    description:
      "Motor bölümü, görünür sıvı veya kaçak izleri ve mekanik bulguların paket kapsamına göre incelenmesi.",
    features: ["Motor bölümü", "Sıvı ve kaçak izi", "Mekanik bulgular"],
  },
  {
    slug: "beyin-obd",
    name: "Beyin ve OBD",
    description:
      "Araç kontrol ünitelerindeki kayıtların taranması ve elektronik uyarıların değerlendirilmesi.",
    features: ["Arıza kodları", "Kontrol ünitesi", "Elektronik bulgular"],
  },
  {
    slug: "sanziman",
    name: "Şanzıman",
    description:
      "Orta, Tam ve Full paketlerde yer alan şanzıman kontrol başlıklarının değerlendirilmesi.",
    features: ["Çalışma bulguları", "Görsel kontrol", "Paket kapsamı"],
  },
  {
    slug: "ic-dis-kontrol",
    name: "İç ve dış kontrol",
    description:
      "Aracın görülebilen iç ve dış bölümlerinin genel durumunun paket kapsamına göre incelenmesi.",
    features: ["İç bölüm", "Dış bölüm", "Genel durum notları"],
  },
  {
    slug: "conta-airbag",
    name: "Conta ve airbag",
    description:
      "Conta kontrolünün Tam ve Full, airbag kontrolünün ise Full paket kapsamında değerlendirilmesi.",
    features: ["Conta kontrolü", "Airbag kontrolü", "Kapsam notları"],
  },
];

export type LocalSeoTarget = {
  title: string;
  area: string;
  description: string;
  highlights: string[];
  href: string;
  cta: string;
};

export const localSeoTargets: LocalSeoTarget[] = [
  {
    title: "Nilüfer oto ekspertiz",
    area: "Nilüfer / Bursa",
    description:
      "Nilüfer ve Üçevler çevresinde araç almadan önce kaporta, motor-mekanik, OBD ve paket kapsamını netleştirmek isteyen kullanıcılar için randevu akışı.",
    highlights: ["Nilüfer şube bilgisi", "Üçevler adres yönlendirmesi", "Aynı gün müsaitlik için telefon/WhatsApp"],
    href: "/nilufer-oto-ekspertiz",
    cta: "Nilüfer oto ekspertiz sayfasını gör",
  },
  {
    title: "Bursa oto ekspertiz fiyatları",
    area: "Bursa geneli",
    description:
      "Mini Ekspertiz Kaporta, Mini Ekspertiz Motor-Mekanik, Mini, Orta, Tam ve Full paketleri fiyat, süre ve kontrol başlıklarıyla karşılaştırın.",
    highlights: ["6 paket karşılaştırması", "Fiyat ve süre görünürlüğü", "Full Paket en çok tercih edilen seçenek"],
    href: "/bursa-oto-ekspertiz",
    cta: "Bursa oto ekspertiz seçeneklerini gör",
  },
  {
    title: "Kaporta boya ekspertiz Bursa",
    area: "Kaporta ve boya kontrolü",
    description:
      "Boya kalınlığı, değişen parça şüphesi, panel hizalama ve görsel deformasyon gibi kaporta-boya bulgularını paket kapsamına göre inceleyin.",
    highlights: ["Boya kalınlığı ölçümü", "Parça bazlı bulgu dili", "Kaporta odaklı Mini Paket"],
    href: "/kaporta-boya-ekspertiz",
    cta: "Kaporta boya kontrolünü incele",
  },
  {
    title: "OBD ve motor mekanik kontrol",
    area: "Motor, mekanik ve elektronik",
    description:
      "Bursa'da ikinci el araç alırken motor-mekanik bulgular, görülebilen kaçak izleri ve OBD arıza kayıtlarını birlikte değerlendirin.",
    highlights: ["Motor ve mekanik bulgular", "Aktif/geçmiş OBD kodları", "Paket kapsamına göre şanzıman ve airbag"],
    href: "/motor-mekanik-ekspertiz",
    cta: "Motor ve mekanik kontrolü incele",
  },
];

export const faqItems = [
  {
    question: "Randevu talebi oluşturunca randevum kesinleşir mi?",
    answer:
      "Hayır. Formu tamamladığınızda talebiniz işletmeye iletilir veya kayıt altına alınır. İşletme sizinle iletişime geçip uygun saat ve kapsam teyidi verdiğinde randevu kesinleşir.",
  },
  {
    question: "Hangi paketi seçmeliyim?",
    answer:
      "Kontrol etmek istediğiniz başlıklara göre seçim yapabilirsiniz. Mini Ekspertiz Kaporta ve Mini Ekspertiz Motor-Mekanik paketleri tek alana odaklanır; Mini, Orta, Tam ve Full paketleri kademeli olarak daha geniş kontrol başlıkları içerir.",
  },
  {
    question: "Ekspertiz ne kadar sürer?",
    answer:
      "Paketler yaklaşık 15 ile 40 dakika arasında sürer. Araç tipi, seçilen kapsam ve kontrol sırasında karşılaşılan bulgular süreyi etkileyebilir; kesin plan randevu teyidinde paylaşılır.",
  },
  {
    question: "Aynı gün randevu alabilir miyim?",
    answer:
      "Çevrim içi form en erken ertesi gün için talep kabul eder. Aynı gün müsaitliğini 0552 741 51 43 numaralı telefondan veya WhatsApp üzerinden sorabilirsiniz.",
  },
  {
    question: "Paket fiyatlarına KDV dahil mi?",
    answer:
      "Sitedeki Mini Ekspertiz Kaporta, Mini Ekspertiz Motor-Mekanik, Mini, Orta, Tam ve Full paket fiyatları bilgilendirme amaçlıdır. KDV, ödeme yöntemi ve nihai kapsam randevu teyidinde işletme tarafından netleştirilir.",
  },
];

export const navItems = [
  { href: "/paketler", label: "Paketler" },
  { href: "/hizmetler", label: "Kontroller" },
  { href: "/blog", label: "Blog" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];
