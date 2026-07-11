import Link from "next/link";
import type { ReactNode } from "react";
import { ClientExperience } from "./ClientExperience";
import { navItems, siteConfig } from "@/lib/site";

export function Brand() {
  return (
    <span className="brand-lockup">
      <span className="brand-mark" aria-hidden="true">
        EB
      </span>
      <span className="brand-copy">
        <strong>Ekspertiz Bursa</strong>
        <small>Oto ekspertiz ve karar desteği</small>
      </span>
    </span>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      {siteConfig.previewMode ? (
        <div className="preview-notice" role="status">
          <span>Ön izleme</span>
          Telefon, çalışma saatleri, KDV durumu ve iki paket fiyatı yayın öncesi onay bekliyor.
        </div>
      ) : null}
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand-link" aria-label="Ekspertiz Bursa ana sayfa">
            <Brand />
          </Link>
          <nav className="desktop-nav" aria-label="Ana menü">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link className="button button-dark button-small" href="/randevu" data-event="header_appointment_click">
              Randevu al
            </Link>
            <details className="mobile-menu">
              <summary aria-label="Menüyü aç">Menü</summary>
              <div className="mobile-menu-panel">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
                <Link href="/randevu">Randevu al</Link>
              </div>
            </details>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <Brand />
            <p className="footer-description">
              Bursa&apos;da ikinci el araç kararını daha açık, kontrollü ve izlenebilir hale getiren ekspertiz deneyimi.
            </p>
          </div>
          <div>
            <h2>Hızlı erişim</h2>
            <Link href="/paketler">Ekspertiz paketleri</Link>
            <Link href="/hizmetler">Kontrol başlıkları</Link>
            <Link href="/randevu">Randevu talebi</Link>
            <Link href="/iletisim">İletişim</Link>
          </div>
          <div>
            <h2>Yasal</h2>
            <Link href="/kvkk">KVKK aydınlatma metni</Link>
            <Link href="/cerez-politikasi">Çerez politikası</Link>
            <p>{siteConfig.address}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ekspertiz Bursa</span>
          <span>Canonical alan adı: ekspertizbursa.com</span>
        </div>
      </footer>
      <Link className="mobile-appointment" href="/randevu" data-event="mobile_sticky_appointment_click">
        Randevu talebi oluştur
      </Link>
      <ClientExperience />
    </>
  );
}
