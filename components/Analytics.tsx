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
        {`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments)};gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});`}
      </Script>
      {hasGtm ? (
        <Script id="gtm-loader" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      ) : (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
          <Script id="ga4-config" strategy="afterInteractive">
            {`gtag('js',new Date());gtag('config','${ga4Id}',{send_page_view:true,allow_google_signals:false});`}
          </Script>
        </>
      )}
    </>
  );
}
