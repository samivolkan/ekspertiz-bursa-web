import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { ClientExperience } from "./ClientExperience";
import { navItems, packages, siteConfig } from "@/lib/site";
import { assetPath } from "@/lib/assets";

export function Brand() {
  return (
    <span className="brand-lockup">
      <Image
        className="brand-wordmark"
        src={assetPath("/brand/ekspertiz-bursa-wordmark.png")}
        alt="Ekspertiz Bursa"
        width={1600}
        height={274}
        unoptimized
        sizes="(max-width: 620px) 150px, 205px"
      />
    </span>
  );
}

function PackagePriceDrawer() {
  return (
    <details className="price-drawer">
      <summary aria-label="Ekspertiz fiyatlarını aç">
        <span aria-hidden="true">‹</span>
        <strong>Ekspertiz fiyatları</strong>
      </summary>
      <div className="price-drawer-panel">
        <div className="price-drawer-heading">
          <div>
            <span>Güncel paketler</span>
            <h2>Ekspertiz fiyatları</h2>
          </div>
          <small>6 paket</small>
        </div>
        <div className="price-drawer-list">
          {packages.map((item) => (
            <article key={item.slug}>
              <div>
                <h3>{item.name}</h3>
                <p>{item.duration}</p>
              </div>
              <strong>{item.price}</strong>
              <Link href={`/paketler#${item.slug}`} data-event={`price_drawer_${item.slug}_click`} data-analytics-event="package_select" data-package-name={item.name} data-cta-location="price_drawer">
                İncele
              </Link>
            </article>
          ))}
        </div>
        <p className="price-drawer-footnote">{siteConfig.priceTaxNote}</p>
      </div>
    </details>
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
            <a className="button button-light button-small" href={siteConfig.phoneHref} data-event="header_phone_click" data-analytics-event="phone_click" data-cta-location="header">
              Hemen ara
            </a>
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
                <a className="mobile-call-link" href={siteConfig.phoneHref} data-event="mobile_menu_phone_click" data-analytics-event="phone_click" data-cta-location="mobile_menu">
                  <span aria-hidden="true"><FaPhoneAlt /></span>
                  <strong>Hemen ara: {siteConfig.phoneDisplay}</strong>
                </a>
                <a className="mobile-whatsapp-link" href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" data-event="mobile_menu_whatsapp_click" data-analytics-event="whatsapp_click" data-cta-location="mobile_menu">
                  <span aria-hidden="true"><FaWhatsapp /></span>
                  <strong>WhatsApp</strong>
                </a>
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
            <a href={siteConfig.phoneHref} data-event="footer_phone_click" data-analytics-event="phone_click" data-cta-location="footer">{siteConfig.phoneDisplay}</a>
            <a href={siteConfig.whatsappHref} target="_blank" rel="noopener noreferrer" data-event="footer_whatsapp_click" data-analytics-event="whatsapp_click" data-cta-location="footer">WhatsApp ile yazın</a>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <p>{siteConfig.workingHours}</p>
            <p>{siteConfig.address}</p>
            <p>{siteConfig.legalEntityNote}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ekspertiz Bursa</span>
          <span>Canonical alan adı: www.bursaekspertiz.com</span>
        </div>
      </footer>
      <PackagePriceDrawer />
      <a
        className="whatsapp-float"
        href={siteConfig.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp üzerinden Ekspertiz Bursa'ya yazın"
        data-event="floating_whatsapp_click"
        data-analytics-event="whatsapp_click"
        data-cta-location="floating_button"
      >
        <span aria-hidden="true"><FaWhatsapp /></span>
        <span><strong>WhatsApp</strong><small>Hemen yazın</small></span>
      </a>
      <Link className="mobile-appointment" href="/randevu" data-event="mobile_sticky_appointment_click">
        Randevu talebi oluştur
      </Link>
      <ClientExperience />
    </>
  );
}
