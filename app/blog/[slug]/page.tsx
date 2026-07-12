import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { blogHeadingId, blogPosts, findBlogPost, getBlogImage } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = findBlogPost(slug);
  if (!post) return {};
  const image = getBlogImage(post);

  return {
    title: post.title,
    description: post.description,
    keywords: [post.category, "Bursa oto ekspertiz", "ikinci el araç kontrolü", post.title],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      url: `/blog/${post.slug}`,
      images: [{ url: image.src, alt: image.alt }],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = findBlogPost(slug);
  if (!post) notFound();
  const image = getBlogImage(post);
  const relatedPosts = blogPosts.filter((candidate) => candidate.slug !== post.slug).sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category)).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    inLanguage: "tr-TR",
    articleSection: post.category,
    keywords: [post.category, "Bursa oto ekspertiz", "ikinci el araç kontrolü"].join(", "),
    isPartOf: { "@type": "Blog", name: "Ekspertiz Bursa Blog", url: `${siteConfig.canonicalUrl}/blog` },
    mainEntityOfPage: `${siteConfig.canonicalUrl}/blog/${post.slug}`,
    image: `${siteConfig.canonicalUrl}${image.src}`,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana sayfa", item: siteConfig.canonicalUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.canonicalUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${siteConfig.canonicalUrl}/blog/${post.slug}` },
    ],
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <section className="subpage-hero blog-detail-hero">
        <div className="page-shell narrow-shell">
          <Link className="blog-back-link" href="/blog">← Tüm saha notları</Link>
          <p className="eyebrow eyebrow-light">{post.category}</p>
          <h1>{post.title}</h1>
          <div className="blog-detail-meta">
            <time dateTime={post.publishedAt}>{post.displayDate}</time>
            <span>{post.readingTime}</span>
          </div>
        </div>
      </section>
      <section className="section section-paper">
        <article className="blog-article">
          <figure className="blog-feature-image">
            <div><Image src={image.src} alt={image.alt} fill sizes="(max-width: 820px) 100vw, 820px" priority unoptimized /></div>
            <figcaption>{image.caption}</figcaption>
          </figure>
          <nav className="blog-table-of-contents" aria-label="Yazı içeriği">
            <strong>Bu rehberde</strong>
            <ol>{post.sections.map((section) => <li key={section.heading}><a href={`#${blogHeadingId(section.heading)}`}>{section.heading}</a></li>)}</ol>
          </nav>
          <p className="blog-introduction">{post.introduction}</p>
          {post.sections.map((section) => (
            <section id={blogHeadingId(section.heading)} key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
          <aside className="blog-decision-card">
            <span>Satın alma kararında sonraki adım</span>
            <h2>Bu bulguyu tek başına değil, doğru paket kapsamıyla değerlendirin.</h2>
            <p>Kaporta, mekanik, OBD ve güvenlik başlıklarının hangi paketlerde yer aldığını karşılaştırın; araç için gerekli kapsamı randevu öncesinde netleştirin.</p>
            <div><Link href="/paketler">Paketleri karşılaştır</Link><Link href="/randevu">Randevu talebi oluştur</Link></div>
          </aside>
          <section className="blog-takeaways">
            <h2>Bu kontrolden akılda kalanlar</h2>
            <ul>{post.takeaways.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <aside className="blog-disclaimer">
            <strong>Bilgilendirme notu</strong>
            <p>Bu yazı genel bilgilendirme içindir. Her aracın bulgusu farklıdır; kesin değerlendirme araca fiziksel kontrol uygulanarak yapılır.</p>
          </aside>
        </article>
      </section>
      <section className="section blog-related-section">
        <div className="page-shell">
          <div className="blog-section-heading"><div><span>Okumaya devam edin</span><h2>İlgili ekspertiz rehberleri</h2></div></div>
          <div className="blog-related-grid">
            {relatedPosts.map((related) => {
              const relatedImage = getBlogImage(related);
              return <article key={related.slug}>
                <Link className="blog-related-media" href={`/blog/${related.slug}`}><Image src={relatedImage.src} alt={relatedImage.alt} fill loading="eager" sizes="(max-width: 620px) 100vw, 33vw" unoptimized /></Link>
                <span>{related.category}</span>
                <h3><Link href={`/blog/${related.slug}`}>{related.title}</Link></h3>
                <Link className="text-link" href={`/blog/${related.slug}`}>Rehberi oku <span>→</span></Link>
              </article>;
            })}
          </div>
        </div>
      </section>
      <section className="final-cta">
        <div className="page-shell final-cta-inner">
          <div><p className="eyebrow eyebrow-light">Bursa&apos;da ekspertiz</p><h2>Aracınızın gerçek durumunu seçtiğiniz paketle kontrol ettirin.</h2></div>
          <Link className="button button-primary" href="/randevu" data-event={`blog_detail_${post.slug}_appointment_click`}>Randevu talebi oluştur</Link>
        </div>
      </section>
    </SiteShell>
  );
}
