export const CATEGORY_DEFINITIONS = {
  technical: { label: "Teknik taranabilirlik ve indekslenebilirlik", weight: 20 },
  onPage: { label: "Sayfa içi SEO", weight: 15 },
  local: { label: "Yerel SEO ve NAP tutarlılığı", weight: 15 },
  performance: { label: "Performans ve Core Web Vitals", weight: 15 },
  structuredData: { label: "Yapısal veri", weight: 10 },
  content: { label: "İçerik mimarisi ve iç bağlantılar", weight: 10 },
  conversion: { label: "Dönüşüm ve ölçümleme", weight: 10 },
  accessibility: { label: "Erişilebilirlik ve temel UX", weight: 5 },
};

export const EXPECTED_TOTAL = Object.values(CATEGORY_DEFINITIONS)
  .reduce((total, category) => total + category.weight, 0);

export const REQUIRED_SERVICE_PATHS = [
  "/bursa-oto-ekspertiz/",
  "/nilufer-oto-ekspertiz/",
  "/kaporta-boya-ekspertiz/",
  "/motor-mekanik-ekspertiz/",
  "/obd-beyin-kontrolu/",
  "/sanziman-kontrolu/",
  "/airbag-kontrolu/",
  "/conta-kontrolu/",
  "/ikinci-el-arac-ekspertiz/",
  "/oto-ekspertiz-raporu/",
];

export const REQUIRED_CONVERSION_EVENTS = [
  "phone_click",
  "whatsapp_click",
  "appointment_start",
  "appointment_submit",
  "appointment_success",
  "appointment_error",
  "package_view",
  "package_select",
  "service_view",
  "service_to_appointment",
  "map_click",
  "report_example_view",
  "form_validation_error",
];

export const SEVERITY_ORDER = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  info: 4,
};

if (EXPECTED_TOTAL !== 100) {
  throw new Error(`SEO category weights must total 100, received ${EXPECTED_TOTAL}.`);
}
