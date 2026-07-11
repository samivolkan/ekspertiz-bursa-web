import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { blogEditorialNotice, blogPosts, findBlogPost, getBlogImage } from "@/lib/blog";
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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.canonicalUrl}/blog/${post.slug}`,
    image: `${siteConfig.canonicalUrl}${image.src}`,
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
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
          <aside className="blog-editorial-note">
            <strong>Kurgusal ve anonimleştirilmiş hikâye</strong>
            <p>{blogEditorialNotice}</p>
          </aside>
          <p className="blog-introduction">{post.introduction}</p>
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
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
      <section className="final-cta">
        <div className="page-shell final-cta-inner">
          <div><p className="eyebrow eyebrow-light">Bursa&apos;da ekspertiz</p><h2>Aracınızın gerçek durumunu seçtiğiniz paketle kontrol ettirin.</h2></div>
          <Link className="button button-primary" href="/randevu" data-event={`blog_detail_${post.slug}_appointment_click`}>Randevu talebi oluştur</Link>
        </div>
      </section>
    </SiteShell>
  );
}
