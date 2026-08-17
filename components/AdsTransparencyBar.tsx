import Link from "next/link";
import styles from "./AdsTransparencyBar.module.css";
import { adsCompliance } from "@/lib/ads-compliance";

export function AdsTransparencyBar() {
  return (
    <aside
      className={styles.notice}
      aria-label="Hizmet bölgesi ve fiziksel şube açıklaması"
      data-ads-transparency="service-area"
    >
      <div className={styles.inner}>
        <p>
          <strong>{adsCompliance.serviceAreaLabel}.</strong>{" "}
          {adsCompliance.serviceAreaDisclosure}
        </p>
        <Link href="/iletisim">Adres ve yol tarifi</Link>
      </div>
    </aside>
  );
}
