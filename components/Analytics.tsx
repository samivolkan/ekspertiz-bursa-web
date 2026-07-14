import Script from "next/script";
import { businessConfig } from "@/lib/site";

export function Analytics() {
  const gtmId = businessConfig.GTM_CONTAINER_ID;
  const ga4Id = businessConfig.GA4_MEASUREMENT_ID;
  const hasGtm = /^GTM-[A-Z0-9]+$/.test(gtmId);
  const hasGa4 = /^G-[A-Z0-9]+$/.test(ga4Id);
  if (!hasGtm && !hasGa4) return null;

  return (
    <>
      <Script id="analytics-consent-default" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments)};window.__EB_GTM_ID='${hasGtm ? gtmId : ""}';window.__EB_GA4_ID='${hasGa4 ? ga4Id : ""}';gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`}
      </Script>
    </>
  );
}
