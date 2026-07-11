import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ClientExperience } from "./ClientExperience";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { navItems, siteConfig } from "@/lib/site";

export function Brand() {
  return (
    <span className="brand-lockup">
      <Image
        className="brand-wordmark"
        src="/brand/ekspertiz-bursa-wordmark.png"
        alt="Ekspertiz Bursa"
        width={1600}
        height={274}
        unoptimized
        sizes="(max-width: 620px) 150px, 205px"
      />
    </span>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
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
            <ThemeSwitcher className="theme-switcher-desktop" />
            <a className="button button-light button-small" href={siteConfig.phoneHref} data-event="header_phone_click">
              Hemen ara
            </a>
            <Link className="button button-dark button-small" href="/randevu" data-event="header_appointment_click">
              Randevu al
            </Link>
            <details className="mobile-menu">
              <summary aria-label="Menüyü aç">Menü</summary>
              <div className="mobile-menu-panel">
                <div className="mobile-theme-panel">
                  <ThemeSwitcher className="theme-switcher-mobile" />
                </div>
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
                <a href={siteConfig.phoneHref}>Hemen ara: {siteConfig.phoneDisplay}</a>
                <a href={siteConfig.whatsappHref} target="_blank" rel="noreferrer">WhatsApp</a>
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
            <Link href="/blog">Ekspertiz hikâyeleri</Link>
            <Link href="/randevu">Randevu talebi</Link>
            <Link href="/iletisim">İletişim</Link>
          </div>
          <div>
            <h2>Yasal</h2>
            <Link href="/kvkk">KVKK aydınlatma metni</Link>
            <Link href="/cerez-politikasi">Çerez politikası</Link>
            <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>
            <a href={siteConfig.whatsappHref} target="_blank" rel="noreferrer">WhatsApp ile yazın</a>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <p>{siteConfig.workingHours}</p>
            <p>{siteConfig.address}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ekspertiz Bursa</span>
          <span>Canonical alan adı: ekspertizbursa.com</span>
        </div>
      </footer>
      <a
        className="whatsapp-float"
        href={siteConfig.whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp üzerinden Ekspertiz Bursa'ya yazın"
        data-event="floating_whatsapp_click"
      >
        <span aria-hidden="true">WA</span>
        <span><strong>WhatsApp</strong><small>Hemen yazın</small></span>
      </a>
      <Link className="mobile-appointment" href="/randevu" data-event="mobile_sticky_appointment_click">
        Randevu talebi oluştur
      </Link>
      <ClientExperience />
    </>
  );
}
