import { businessConfig, packages, siteConfig } from "@/lib/site";

function compact<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => {
      if (item === null || item === undefined || item === "") return false;
      if (Array.isArray(item)) return item.length > 0;
      return true;
    }),
  ) as Partial<T>;
}

function openingDays(value: string) {
  if (value.startsWith("Mo-Fr")) {
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  }

  return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
}

export function organizationSchema() {
  const sameAs = [
    businessConfig.GOOGLE_BUSINESS_PROFILE_URL,
    businessConfig.INSTAGRAM_URL,
    businessConfig.FACEBOOK_URL,
    businessConfig.YOUTUBE_URL,
  ].filter(Boolean);

  return compact({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.canonicalUrl}/#organization`,
    name: businessConfig.BUSINESS_NAME,
    alternateName: ["Bursa Ekspertiz", "EkspertizBursa"],
    legalName: businessConfig.LEGAL_BUSINESS_NAME,
    url: siteConfig.canonicalUrl,
    logo: `${siteConfig.canonicalUrl}${businessConfig.LOGO_URL}`,
    email: businessConfig.EMAIL,
    telephone: businessConfig.PHONE,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: businessConfig.PHONE,
      contactType: "customer service",
      areaServed: businessConfig.COUNTRY,
      availableLanguage: ["tr"],
    },
    sameAs,
    subOrganization: { "@id": `${siteConfig.canonicalUrl}/#business` },
  });
}

export function localBusinessSchema() {
  const hasCoordinates = Boolean(businessConfig.LATITUDE && businessConfig.LONGITUDE);
  const hourRange = businessConfig.OPENING_HOURS.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
  const sameAs = [
    businessConfig.GOOGLE_BUSINESS_PROFILE_URL,
    businessConfig.INSTAGRAM_URL,
    businessConfig.FACEBOOK_URL,
    businessConfig.YOUTUBE_URL,
  ].filter(Boolean);

  return compact({
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "@id": `${siteConfig.canonicalUrl}/#business`,
    name: businessConfig.BUSINESS_NAME,
    alternateName: ["Bursa Ekspertiz", "EkspertizBursa"],
    legalName: businessConfig.LEGAL_BUSINESS_NAME,
    url: siteConfig.canonicalUrl,
    logo: `${siteConfig.canonicalUrl}${businessConfig.LOGO_URL}`,
    image: `${siteConfig.canonicalUrl}${businessConfig.DEFAULT_OG_IMAGE}`,
    description: siteConfig.description,
    telephone: businessConfig.PHONE,
    email: businessConfig.EMAIL,
    priceRange: businessConfig.PRICE_RANGE,
    currenciesAccepted: "TRY",
    openingHours: businessConfig.OPENING_HOURS,
    openingHoursSpecification: hourRange ? {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: openingDays(businessConfig.OPENING_HOURS),
      opens: hourRange[1],
      closes: hourRange[2],
    } : undefined,
    address: compact({
      "@type": "PostalAddress",
      streetAddress: businessConfig.STREET_ADDRESS,
      addressLocality: businessConfig.DISTRICT,
      addressRegion: businessConfig.CITY,
      postalCode: businessConfig.POSTAL_CODE,
      addressCountry: businessConfig.COUNTRY,
    }),
    geo: hasCoordinates ? {
      "@type": "GeoCoordinates",
      latitude: businessConfig.LATITUDE,
      longitude: businessConfig.LONGITUDE,
    } : undefined,
    areaServed: [
      { "@type": "City", name: businessConfig.CITY },
      { "@type": "AdministrativeArea", name: businessConfig.DISTRICT },
      { "@type": "Place", name: "Küçük Sanayi" },
      { "@type": "Place", name: "Üçevler" },
      { "@type": "Place", name: "Beşevler" },
      { "@type": "Place", name: "Odunluk" },
      { "@type": "Place", name: "Ataevler" },
    ],
    hasMap: businessConfig.GOOGLE_MAPS_URL,
    sameAs,
    knowsAbout: [
      "Bursa oto ekspertiz",
      "Nilüfer oto ekspertiz",
      "Kaporta boya ekspertiz",
      "Motor mekanik kontrol",
      "OBD beyin kontrolü",
      "İkinci el araç ekspertizi",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: businessConfig.PHONE,
      contactType: "customer service",
      areaServed: businessConfig.COUNTRY,
      availableLanguage: ["tr"],
    },
    parentOrganization: { "@id": `${siteConfig.canonicalUrl}/#organization` },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Oto ekspertiz paketleri",
      itemListElement: packages.map((item) => ({
        "@type": "Offer",
        ...(item.price ? { price: item.price.replace(/\D/g, ""), priceCurrency: "TRY" } : {}),
        itemOffered: {
          "@type": "Service",
          name: item.name,
          description: item.description,
          provider: { "@id": `${siteConfig.canonicalUrl}/#business` },
          areaServed: businessConfig.CITY,
        },
      })),
    },
  });
}
