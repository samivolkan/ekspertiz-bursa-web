import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { blogPosts, getBlogImage } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Oto Ekspertiz Blogu ve Günlük Saha Notları",
  description:
    "Bursa oto ekspertiz sürecinde kaporta, boya, motor, mekanik, OBD, airbag ve ikinci el araç kontrolü hakkında hazırlanan açıklayıcı rehberleri okuyun.",
  alternates: { canonical: "/blog" },
  keywords: ["Bursa oto ekspertiz blog", "ikinci el araç kontrolü", "kaporta boya ekspertiz", "OBD kontrolü", "Nilüfer oto ekspertiz"],
};

export default function BlogPage() {
  const featuredPost = blogPosts[0];
  const featuredImage = getBlogImage(featuredPost);
  const categories = [...new Set(blogPosts.map((post) => post.category))];
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Ekspertiz Bursa Blog",
    description: "İkinci el araç alımında ekspertiz bulgularını anlamaya yardımcı olan Bursa odaklı rehberler.",
    url: `${siteConfig.canonicalUrl}/blog`,
    inLanguage: "tr-TR",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: blogPosts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteConfig.canonicalUrl}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <section className="subpage-hero blog-index-hero">
        <div className="page-shell">
          <p className="eyebrow eyebrow-light">Ekspertiz Bursa blog</p>
          <h1>Günlük ekspertiz deneyimleri, anlaşılır kontrol notları.</h1>
          <p>
            İkinci el araç alırken karşılaşabileceğiniz kaporta, motor, elektronik ve güvenlik bulgularını Bursa&apos;daki araç alıcıları için sade ve uygulanabilir rehberlere dönüştürüyoruz.
          </p>
          <div className="blog-topic-chips" aria-label="Blog konu başlıkları">
            {categories.map((category) => <span key={category}>{category}</span>)}
          </div>
        </div>
      </section>
      <section className="section section-paper">
        <div className="page-shell">
          <article className="blog-featured-card">
            <Link className="blog-featured-media" href={`/blog/${featuredPost.slug}`} aria-label={`${featuredPost.title} yazısını oku`}>
              <Image src={featuredImage.src} alt={featuredImage.alt} fill priority sizes="(max-width: 820px) 100vw, 58vw" unoptimized />
            </Link>
            <div className="blog-featured-copy">
              <span className="blog-featured-label">Öne çıkan rehber</span>
              <div className="blog-card-meta"><span>{featuredPost.category}</span><time dateTime={featuredPost.publishedAt}>{featuredPost.displayDate}</time></div>
              <h2><Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link></h2>
              <p>{featuredPost.description}</p>
              <ul>{featuredPost.takeaways.slice(0, 2).map((item) => <li key={item}>{item}</li>)}</ul>
              <Link className="button button-dark" href={`/blog/${featuredPost.slug}`} data-event={`blog_featured_${featuredPost.slug}_click`}>Rehberi oku</Link>
            </div>
          </article>
          <div className="blog-section-heading">
            <div><span>Ekspertiz bilgi merkezi</span><h2>Son saha rehberleri</h2></div>
            <p>Her yazı, satın alma kararında bir bulguyu nasıl yorumlayacağınızı ve hangi durumda ileri kontrol isteyebileceğinizi açıklar.</p>
          </div>
          <div className="blog-grid">
            {blogPosts.slice(1).map((post) => {
              const image = getBlogImage(post);

              return <article className="blog-card" key={post.slug}>
                <Link className="blog-card-media" href={`/blog/${post.slug}`} aria-label={`${post.title} yazısını oku`}>
                  <Image src={image.src} alt={image.alt} fill sizes="(max-width: 620px) 100vw, (max-width: 1060px) 50vw, 33vw" unoptimized />
                  <span>{post.category}</span>
                </Link>
                <div className="blog-card-meta">
                  <span>{post.category}</span>
                  <time dateTime={post.publishedAt}>{post.displayDate}</time>
                </div>
                <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                <p>{post.description}</p>
                <span className="blog-fiction-label">Ekspertiz rehberi</span>
                <div className="blog-card-footer">
                  <span>{post.readingTime}</span>
                  <Link href={`/blog/${post.slug}`} data-event={`blog_${post.slug}_click`}>
                    Yazıyı oku <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>;
            })}
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
