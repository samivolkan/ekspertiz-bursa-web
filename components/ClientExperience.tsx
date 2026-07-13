"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type AnalyticsEventName, analyticsEventNames, trackEvent } from "@/lib/analytics";

const CONSENT_KEY = "eb_cookie_consent_v1";

function pushConsent(value: "granted" | "denied") {
  window.dataLayer = window.dataLayer || [];
  const consent = { analytics_storage: value, ad_storage: value, ad_user_data: value, ad_personalization: value };
  if (window.gtag) window.gtag("consent", "update", consent);
  else window.dataLayer.push(["consent", "update", consent]);
}

function eventNameFor(target: HTMLElement): AnalyticsEventName | null {
  const explicit = target.dataset.analyticsEvent;
  if (explicit && analyticsEventNames.includes(explicit as AnalyticsEventName)) return explicit as AnalyticsEventName;
  const href = target.getAttribute("href") ?? "";
  const legacy = target.dataset.event ?? "";
  if (href.startsWith("tel:")) return "phone_click";
  if (/wa\.me\//i.test(href)) return "whatsapp_click";
  if (/google\.com\/maps/i.test(href)) return "map_click";
  if (/package|paket|price_drawer/i.test(legacy)) return "package_select";
  return null;
}

export function ClientExperience() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(CONSENT_KEY);
    if (!saved) {
      queueMicrotask(() => setVisible(true));
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push([
        "consent",
        "default",
        {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          wait_for_update: 500,
        },
      ]);
    } else {
      pushConsent(saved === "accepted" ? "granted" : "denied");
    }

    const pageEventTarget = document.querySelector<HTMLElement>("[data-page-event]");
    if (pageEventTarget?.dataset.pageEvent && analyticsEventNames.includes(pageEventTarget.dataset.pageEvent as AnalyticsEventName)) {
      trackEvent(pageEventTarget.dataset.pageEvent as AnalyticsEventName, {
        service_name: pageEventTarget.dataset.serviceName,
        package_name: pageEventTarget.dataset.packageName,
        cta_location: "page_view",
      });
    }

    const onClick = (event: MouseEvent) => {
      const cookieReset = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-cookie-reset]");
      if (cookieReset) {
        event.preventDefault();
        setVisible(true);
        return;
      }

      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-event], [data-analytics-event]");
      if (!target) return;
      const name = eventNameFor(target);
      if (!name) return;
      trackEvent(name, {
        service_name: target.dataset.serviceName,
        package_name: target.dataset.packageName,
        cta_location: target.dataset.ctaLocation || target.dataset.event,
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function choose(value: "accepted" | "rejected") {
    window.localStorage.setItem(CONSENT_KEY, value);
    pushConsent(value === "accepted" ? "granted" : "denied");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside className="cookie-banner" aria-label="Çerez tercihleri">
      <div>
        <strong>Çerez tercihleri</strong>
        <p>
          Zorunlu çerezler randevu ve güvenlik için kullanılır. Analitik ve reklam ölçümü yalnız izninizle etkinleşir. Ayrıntılar için{" "}
          <Link href="/cerez-politikasi">çerez politikasını</Link> inceleyin.
        </p>
      </div>
      <div className="cookie-actions">
        <button type="button" className="button button-ghost button-small" onClick={() => choose("rejected")}>
          Yalnız zorunlu
        </button>
        <button type="button" className="button button-primary button-small" onClick={() => choose("accepted")}>
          Tümünü kabul et
        </button>
      </div>
    </aside>
  );
}
