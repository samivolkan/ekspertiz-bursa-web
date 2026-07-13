export const analyticsEventNames = [
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
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];

type AnalyticsParameters = Partial<Record<
  | "service_name"
  | "package_name"
  | "cta_location"
  | "delivery_method"
  | "field_name"
  | "error_type",
  string
>>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const recentEvents = new Map<string, number>();

function safeText(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 120) : undefined;
}

function trafficParameters() {
  if (typeof window === "undefined") return {};
  const search = new URLSearchParams(window.location.search);
  return {
    traffic_source: safeText(search.get("utm_source")) || "direct",
    traffic_medium: safeText(search.get("utm_medium")) || "none",
    traffic_campaign: safeText(search.get("utm_campaign")) || "none",
  };
}

export function trackEvent(name: AnalyticsEventName, parameters: AnalyticsParameters = {}) {
  if (typeof window === "undefined" || !analyticsEventNames.includes(name)) return false;
  const payload = {
    event: name,
    page_path: window.location.pathname,
    page_title: document.title,
    device_type: window.matchMedia("(max-width: 820px)").matches ? "mobile" : "desktop",
    ...trafficParameters(),
    ...Object.fromEntries(Object.entries(parameters).map(([key, value]) => [key, safeText(value)]).filter(([, value]) => value)),
  };
  const fingerprint = `${name}:${payload.page_path}:${payload.service_name ?? ""}:${payload.package_name ?? ""}:${payload.cta_location ?? ""}`;
  const now = Date.now();
  if (now - (recentEvents.get(fingerprint) ?? 0) < 750) return false;
  recentEvents.set(fingerprint, now);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  return true;
}
