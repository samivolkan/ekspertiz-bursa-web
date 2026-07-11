"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = "eb_cookie_consent_v1";

function pushConsent(value: "granted" | "denied") {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push([
    "consent",
    "update",
    {
      analytics_storage: value,
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
    },
  ]);
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

    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-event]");
      if (!target?.dataset.event) return;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: target.dataset.event });
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
          <a href="/cerez-politikasi">çerez politikasını</a> inceleyin.
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
