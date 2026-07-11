import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { blogEditorialNotice, blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Oto Ekspertiz Blogu ve Günlük Saha Notları",
  description:
    "Ekspertiz Bursa'nın kaporta, boya, motor, mekanik ve OBD kontrollerinden ilham alan kurgusal ve anonimleştirilmiş saha hikâyelerini okuyun.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <SiteShell>
      <section className="subpage-hero blog-index-hero">
        <div className="page-shell">
          <p className="eyebrow eyebrow-light">Ekspertiz Bursa blog</p>
          <h1>Günlük ekspertiz deneyimleri, anlaşılır kontrol notları.</h1>
          <p>
            Sık karşılaşılan kontrol başlıklarını, gerçek kişi veya araç bilgisi kullanmadan hazırlanan kurgusal hikâyelerle anlaşılır biçimde anlatıyoruz.
          </p>
        </div>
      </section>
      <section className="section section-paper">
        <div className="page-shell">
          <div className="blog-privacy-note">
            <strong>Editoryal açıklama</strong>
            <p>{blogEditorialNotice}</p>
          </div>
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <article className="blog-card" key={post.slug}>
                <div className="blog-card-meta">
                  <span>{post.category}</span>
                  <time dateTime={post.publishedAt}>{post.displayDate}</time>
                </div>
                <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                <p>{post.description}</p>
                <span className="blog-fiction-label">Kurgusal ekspertiz hikâyesi</span>
                <div className="blog-card-footer">
                  <span>{post.readingTime}</span>
                  <Link href={`/blog/${post.slug}`} data-event={`blog_${post.slug}_click`}>
                    Yazıyı oku <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="final-cta">
        <div className="page-shell final-cta-inner">
          <div><p className="eyebrow eyebrow-light">Aracınıza özel kontrol</p><h2>Genel bilgilerden sonra gerçek durumu ekspertizle netleştirin.</h2></div>
          <Link className="button button-primary" href="/randevu" data-event="blog_appointment_click">Randevu talebi oluştur</Link>
        </div>
      </section>
    </SiteShell>
  );
}
