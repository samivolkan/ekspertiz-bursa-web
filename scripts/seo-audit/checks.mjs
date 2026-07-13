import { CATEGORY_DEFINITIONS, REQUIRED_CONVERSION_EVENTS, REQUIRED_SERVICE_PATHS, SEVERITY_ORDER } from "./config.mjs";

function content(html, pattern) {
  return html.match(pattern)?.[1]?.trim() ?? "";
}

function headOf(html) {
  const end = html.search(/<\/head>/i);
  return end >= 0 ? html.slice(0, end + 7) : html;
}

function bodyOf(html) {
  const match = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  return match?.[1] ?? html;
}

function stripTags(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeRoute(value, origin) {
  try {
    const url = new URL(value, origin);
    if (url.origin !== new URL(origin).origin) return null;
    const path = url.pathname || "/";
    if (path === "/") return path;
    if (/\.[a-z0-9]{2,6}$/i.test(path)) return path;
    return `${path.replace(/\/+$/, "")}/`;
  } catch {
    return null;
  }
}

function parseJsonLd(html, route, addIssue) {
  const values = [];
  const invalid = [];
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      values.push(JSON.parse(match[1]));
    } catch (error) {
      invalid.push(error instanceof Error ? error.message : String(error));
    }
  }
  if (invalid.length) {
    addIssue({
      category: "structuredData",
      severity: "high",
      code: "invalid_json_ld",
      title: "Geçersiz JSON-LD bulundu",
      deduction: 2,
      affectedUrls: [route],
      recommendation: "JSON-LD çıktısını JSON.stringify ile üretin ve build testine ekleyin.",
      autoFixable: true,
    });
  }
  return values;
}

function schemaTypes(value, result = new Set()) {
  if (!value || typeof value !== "object") return result;
  if (Array.isArray(value)) {
    value.forEach((item) => schemaTypes(item, result));
    return result;
  }
  const type = value["@type"];
  if (Array.isArray(type)) type.forEach((item) => result.add(item));
  else if (typeof type === "string") result.add(type);
  Object.values(value).forEach((item) => schemaTypes(item, result));
  return result;
}

export function runChecks(crawl) {
  const issues = [];
  const issueKeys = new Set();
  const addIssue = (issue) => {
    const key = `${issue.category}:${issue.code}`;
    if (issueKeys.has(key)) {
      const existing = issues.find((item) => `${item.category}:${item.code}` === key);
      if (existing && issue.affectedUrls) {
        existing.affectedUrls = [...new Set([...existing.affectedUrls, ...issue.affectedUrls])].slice(0, 30);
      }
      return;
    }
    issueKeys.add(key);
    issues.push({
      autoFixable: false,
      humanActionRequired: false,
      affectedUrls: [],
      recommendation: "",
      deduction: 0,
      ...issue,
    });
  };

  const indexablePages = [];
  const titles = new Map();
  const descriptions = new Map();
  const allSchemaTypes = new Set();
  const pageByRoute = new Map(crawl.pages.map((page) => [page.route, page]));
  const brokenStatusPages = crawl.pages.filter((page) => page.status === 0 || page.status >= 400).filter((page) => !["/404/", "/_not-found/"].includes(page.route));

  if (brokenStatusPages.some((page) => page.status >= 500 || page.status === 0)) {
    addIssue({
      category: "technical", severity: "critical", code: "server_or_network_error",
      title: "Erişilemeyen veya 5xx dönen sayfa var", deduction: 6,
      affectedUrls: brokenStatusPages.map((page) => page.url),
      recommendation: "Sunucu erişimini ve son deploy loglarını kontrol edin; geçici ağ hatasında yeniden deneyin.",
    });
  }
  if (brokenStatusPages.some((page) => page.status >= 400 && page.status < 500)) {
    addIssue({
      category: "technical", severity: "high", code: "indexable_4xx",
      title: "Tarama kapsamındaki URL 4xx döndürüyor", deduction: 3,
      affectedUrls: brokenStatusPages.map((page) => page.url),
      recommendation: "Kırık URL'yi düzeltin veya sitemap ve iç bağlantılardan kaldırın.",
    });
  }

  for (const page of crawl.pages) {
    if (!page.html || ["/404/", "/_not-found/"].includes(page.route)) continue;
    const head = headOf(page.html);
    const body = bodyOf(page.html);
    const robots = content(head, /<meta\b[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i)
      || content(head, /<meta\b[^>]*content=["']([^"']+)["'][^>]*name=["']robots["']/i);
    const noindex = /noindex/i.test(robots);
    if (!noindex) indexablePages.push(page);

    if (!/<html\b[^>]*\blang=["']tr(?:-TR)?["']/i.test(page.html)) {
      addIssue({ category: "technical", severity: "medium", code: "html_lang", title: "Türkçe HTML dil tanımı eksik", deduction: 1, affectedUrls: [page.url], recommendation: "Kök html etiketinde lang=\"tr\" veya tr-TR kullanın." });
    }
    if (!/<meta\b[^>]*name=["']viewport["']/i.test(head)) {
      addIssue({ category: "technical", severity: "high", code: "mobile_viewport", title: "Mobil viewport eksik", deduction: 1, affectedUrls: [page.url], recommendation: "Responsive sayfalara standart viewport meta etiketini ekleyin." });
    }
    if (/(?:src|href)=["']http:\/\//i.test(page.html)) {
      addIssue({ category: "technical", severity: "high", code: "mixed_content", title: "HTTP kaynağı veya mixed content bulundu", deduction: 2, affectedUrls: [page.url], recommendation: "Tüm iç kaynak ve bağlantıları HTTPS kullanacak şekilde güncelleyin.", autoFixable: true });
    }

    const canonical = content(head, /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
    if (!noindex && !canonical) {
      addIssue({ category: "technical", severity: "high", code: "missing_canonical", title: "İndekslenebilir sayfada canonical eksik", deduction: 3, affectedUrls: [page.url], recommendation: "Mutlak ve self-referencing canonical üretin.", autoFixable: true });
    } else if (!noindex && canonical && new URL(canonical, crawl.origin).href !== page.url) {
      addIssue({ category: "technical", severity: "high", code: "canonical_mismatch", title: "Canonical sayfanın nihai URL'siyle eşleşmiyor", deduction: 3, affectedUrls: [page.url], recommendation: "Query içermeyen nihai HTTPS URL'yi canonical olarak kullanın." });
    }

    if (!noindex) {
      const title = content(head, /<title>([^<]+)<\/title>/i);
      const description = content(head, /<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
      const h1Count = (body.match(/<h1(?:\s|>)/gi) ?? []).length;
      if (!title) addIssue({ category: "onPage", severity: "high", code: "missing_title", title: "SEO title eksik", deduction: 3, affectedUrls: [page.url], recommendation: "Sayfanın niyetini açıklayan benzersiz bir title ekleyin." });
      else {
        if (titles.has(title)) addIssue({ category: "onPage", severity: "high", code: "duplicate_title", title: "Yinelenen title bulundu", deduction: 2, affectedUrls: [page.url, titles.get(title)], recommendation: "Her indekslenebilir sayfaya benzersiz title yazın." });
        titles.set(title, page.url);
        if (title.length < 25 || title.length > 70) addIssue({ category: "onPage", severity: "low", code: "title_quality", title: "Title uzunluğu kalite aralığının dışında", deduction: 0.5, affectedUrls: [page.url], recommendation: "Doğal anlatımı bozmadan title'ı yaklaşık 25-70 karakter aralığında tutun." });
      }
      if (!description) addIssue({ category: "onPage", severity: "high", code: "missing_description", title: "Meta description eksik", deduction: 3, affectedUrls: [page.url], recommendation: "Kullanıcı niyetine uygun benzersiz açıklama ekleyin." });
      else {
        if (descriptions.has(description)) addIssue({ category: "onPage", severity: "high", code: "duplicate_description", title: "Yinelenen meta description bulundu", deduction: 2, affectedUrls: [page.url, descriptions.get(description)], recommendation: "Her sayfanın açıklamasını benzersizleştirin." });
        descriptions.set(description, page.url);
        if (description.length < 90 || description.length > 180) addIssue({ category: "onPage", severity: "low", code: "description_quality", title: "Meta description uzunluğu kalite aralığının dışında", deduction: 0.5, affectedUrls: [page.url], recommendation: "Açıklamayı doğal biçimde yaklaşık 90-180 karakter aralığına getirin." });
      }
      if (h1Count !== 1) addIssue({ category: "onPage", severity: "high", code: "h1_count", title: "Sayfada tam olarak bir H1 bulunmuyor", deduction: 3, affectedUrls: [page.url], recommendation: "Sayfa ana konusunu tek bir H1 ile açıklayın." });
      if (!/<meta\b[^>]*property=["']og:title["']/i.test(head) || !/<meta\b[^>]*property=["']og:image["']/i.test(head) || !/<meta\b[^>]*name=["']twitter:card["']/i.test(head)) {
        addIssue({ category: "onPage", severity: "medium", code: "social_metadata", title: "Open Graph veya X kart metadata'sı eksik", deduction: 2, affectedUrls: [page.url], recommendation: "Merkezi metadata fallback değerlerini kullanın.", autoFixable: true });
      }
    }

    const schemas = parseJsonLd(page.html, page.url, addIssue);
    schemas.forEach((schema) => schemaTypes(schema, allSchemaTypes).forEach((type) => allSchemaTypes.add(type)));

    const images = [...body.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
    if (images.some((image) => !/\balt=["'][^"']*["']/i.test(image))) {
      addIssue({ category: "accessibility", severity: "medium", code: "image_alt", title: "Alt niteliği olmayan görsel bulundu", deduction: 1, affectedUrls: [page.url], recommendation: "İçerik görsellerine anlamlı alt, dekoratif görsellere boş alt ekleyin.", autoFixable: false });
    }
    if (images.some((image) => !/data-nimg=["']fill["']/i.test(image) && (!/\bwidth=["']?\d+/i.test(image) || !/\bheight=["']?\d+/i.test(image)))) {
      addIssue({ category: "performance", severity: "medium", code: "image_dimensions", title: "Boyut bilgisi olmayan görsel bulundu", deduction: 2, affectedUrls: [page.url], recommendation: "CLS riskini azaltmak için bilinen width ve height değerlerini ekleyin.", autoFixable: true });
    }
    const oversized = images.filter((image) => {
      const src = content(image, /\bsrc=["']([^"']+)["']/i);
      const size = src ? crawl.assetSize(new URL(src, crawl.origin).pathname) : null;
      return size !== null && size > 500_000;
    });
    if (oversized.length) addIssue({ category: "performance", severity: "medium", code: "oversized_images", title: "500 KB üzerinde görsel bulundu", deduction: 2, affectedUrls: [page.url], recommendation: "Görseli uygun çözünürlükte WebP veya AVIF olarak yeniden üretin." });

    const mainText = stripTags(content(body, /<main\b[^>]*>([\s\S]*?)<\/main>/i) || body);
    if (!noindex && mainText.length < 250) addIssue({ category: "content", severity: "medium", code: "thin_content", title: "Ana içerik çok kısa", deduction: 1, affectedUrls: [page.url], recommendation: "Kullanıcı kararını destekleyen özgün ve doğrulanabilir içerik ekleyin." });
  }

  const sitemapUrls = [...crawl.sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((match) => match[1].trim());
  if (!crawl.sitemap || !sitemapUrls.length) addIssue({ category: "technical", severity: "critical", code: "missing_sitemap", title: "Sitemap eksik veya boş", deduction: 4, recommendation: "Canonical ve indekslenebilir URL'lerden XML sitemap üretin.", autoFixable: true });
  else {
    const indexableUrls = new Set(indexablePages.map((page) => page.url));
    const sitemapSet = new Set(sitemapUrls);
    const differences = [...indexableUrls].filter((url) => !sitemapSet.has(url)).concat(sitemapUrls.filter((url) => !indexableUrls.has(url)));
    if (differences.length) addIssue({ category: "technical", severity: "high", code: "sitemap_mismatch", title: "Sitemap ile indekslenebilir sayfalar eşleşmiyor", deduction: 2, affectedUrls: differences, recommendation: "Yalnızca 200 dönen canonical sayfaları sitemap'e dahil edin.", autoFixable: true });
  }
  if (!crawl.robots || /Disallow:\s*\/\s*(?:\r?\n|$)/i.test(crawl.robots)) addIssue({ category: "technical", severity: "critical", code: "robots_block", title: "Robots dosyası eksik veya tüm siteyi engelliyor", deduction: 4, recommendation: "Production robots.txt içinde ana siteyi taranabilir tutun ve sitemap adresini bildirin.", autoFixable: true });
  if (!/Sitemap:\s*https:\/\/www\.bursaekspertiz\.com\/sitemap\.xml/i.test(crawl.robots)) addIssue({ category: "technical", severity: "high", code: "robots_sitemap", title: "Robots dosyasında canonical sitemap bildirimi yok", deduction: 1, recommendation: "Robots.txt dosyasına mutlak sitemap URL'sini ekleyin.", autoFixable: true });

  const missingServices = REQUIRED_SERVICE_PATHS.filter((path) => !crawl.routeExists(path));
  if (missingServices.length) {
    addIssue({ category: "local", severity: "high", code: "missing_local_service_pages", title: "Bursa/Nilüfer veya temel hizmet sayfaları eksik", deduction: 3, affectedUrls: missingServices, recommendation: "Kopya doorway içerik üretmeden her hizmet niyeti için özgün ve yararlı sayfa oluşturun." });
    addIssue({ category: "content", severity: "high", code: "missing_service_architecture", title: "Hizmet içerik mimarisi tamamlanmamış", deduction: 3, affectedUrls: missingServices, recommendation: "Hizmetleri paket, blog ve randevu akışıyla karşılıklı bağlayın." });
  }

  const combinedHtml = crawl.pages.map((page) => page.html).join("\n");
  const searchableSource = `${combinedHtml}\n${crawl.sourceText ?? ""}`;
  const homeAndContact = [pageByRoute.get("/"), pageByRoute.get("/iletisim/")].filter(Boolean).map((page) => page.html).join("\n");
  for (const [code, pattern, title, deduction] of [
    ["nap_name", /Ekspertiz Bursa/i, "İşletme adı görünür değil", 2],
    ["nap_phone", /(?:\+90|0)552\s*741\s*51\s*43/i, "Telefon NAP alanlarında bulunamadı", 2],
    ["nap_address", /Üçevler Mahallesi/i, "Doğrulanmış adres görünür değil", 2],
    ["opening_hours", /08:30[^<\n]{0,20}18:30/i, "Çalışma saatleri görünür değil", 1],
    ["map_link", /google\.com\/maps/i, "Harita bağlantısı bulunamadı", 2],
  ]) {
    if (!pattern.test(homeAndContact)) addIssue({ category: "local", severity: "high", code, title, deduction, recommendation: "Yalnızca işletme tarafından doğrulanmış NAP bilgisini merkezi yapılandırmadan yayınlayın.", humanActionRequired: true });
  }
  if (/info@ekspertizbursa\.com/i.test(homeAndContact)) addIssue({ category: "local", severity: "info", code: "email_domain_review", title: "E-posta alan adı canonical domain ile farklı", deduction: 0, recommendation: "info@ekspertizbursa.com adresinin işletmeye ait olduğunu doğrulayın; doğrulanmışsa değiştirmeyin.", humanActionRequired: true });

  if (!["LocalBusiness", "AutoRepair", "AutomotiveBusiness"].some((type) => allSchemaTypes.has(type))) addIssue({ category: "structuredData", severity: "high", code: "local_business_schema", title: "LocalBusiness/AutoRepair şeması eksik", deduction: 2, recommendation: "Doğrulanmış işletme alanlarıyla yerel işletme şeması üretin." });
  if (!allSchemaTypes.has("Organization")) addIssue({ category: "structuredData", severity: "medium", code: "organization_schema", title: "Organization şeması eksik", deduction: 2, recommendation: "LocalBusiness ile aynı @id ailesine bağlı Organization şeması ekleyin." });
  const nonHomeIndexable = indexablePages.filter((page) => page.route !== "/");
  if (nonHomeIndexable.some((page) => !page.html.includes('"@type":"BreadcrumbList"'))) addIssue({ category: "structuredData", severity: "medium", code: "breadcrumb_schema", title: "İç sayfalarda BreadcrumbList eksik", deduction: 2, affectedUrls: nonHomeIndexable.filter((page) => !page.html.includes('"@type":"BreadcrumbList"')).map((page) => page.url), recommendation: "Görünür gezinimle uyumlu BreadcrumbList ekleyin." });
  const blogPages = indexablePages.filter((page) => page.route.startsWith("/blog/") && page.route !== "/blog/");
  if (blogPages.some((page) => !/(?:BlogPosting|Article)/.test(page.html))) addIssue({ category: "structuredData", severity: "medium", code: "article_schema", title: "Blog detayında Article/BlogPosting eksik", deduction: 1, affectedUrls: blogPages.map((page) => page.url), recommendation: "Gerçek yayın ve güncellenme tarihleriyle BlogPosting üretin." });
  if (/"@type":"FAQPage"/.test(combinedHtml) && !/<(?:details|h[2-4])\b[^>]*>[\s\S]*?(?:Sık sorulan|sorular)/i.test(combinedHtml)) addIssue({ category: "structuredData", severity: "high", code: "hidden_faq_schema", title: "FAQ şeması görünür içerikle eşleşmiyor", deduction: 1, recommendation: "Yalnız kullanıcıya görünür soru-cevapları FAQPage ile işaretleyin." });

  const brokenLinks = [];
  for (const page of crawl.pages) {
    for (const match of page.html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)) {
      const route = normalizeRoute(match[1], page.url);
      if (!route || /^(?:mailto:|tel:|javascript:)/i.test(match[1])) continue;
      if (route.startsWith("/") && !crawl.routeExists(route) && !pageByRoute.has(route)) brokenLinks.push(`${page.route} -> ${route}`);
    }
  }
  if (brokenLinks.length) addIssue({ category: "content", severity: "high", code: "broken_internal_links", title: "Kırık iç bağlantı bulundu", deduction: 3, affectedUrls: brokenLinks, recommendation: "Hedefi düzeltin veya bağlantıyı kaldırın.", autoFixable: true });
  if (missingServices.length) addIssue({ category: "content", severity: "medium", code: "service_internal_links", title: "Eksik hizmet sayfaları nedeniyle blog-hizmet bağlantı ağı kurulamıyor", deduction: 2, affectedUrls: missingServices, recommendation: "Her hizmet sayfasını ilgili paket, blog ve randevu sayfalarına bağlayın." });

  if (!/<a\b[^>]*href=["']tel:/i.test(combinedHtml)) addIssue({ category: "conversion", severity: "high", code: "phone_cta", title: "Telefon CTA'sı bulunamadı", deduction: 2, recommendation: "Doğrulanmış numarayı tel: bağlantısıyla yayınlayın." });
  if (!/wa\.me\/905527415143/i.test(combinedHtml)) addIssue({ category: "conversion", severity: "high", code: "whatsapp_cta", title: "WhatsApp CTA'sı bulunamadı", deduction: 2, recommendation: "Uluslararası telefon formatıyla WhatsApp bağlantısı ekleyin." });
  if (!/<form\b/i.test(combinedHtml) || !/name=["']servicePackage["']/i.test(combinedHtml)) addIssue({ category: "conversion", severity: "high", code: "appointment_flow", title: "Randevu/paket form akışı eksik", deduction: 2, recommendation: "Erişilebilir doğrulamalı formu ve paket aktarımını koruyun." });
  if (!/data-event=["'][^"']*package/i.test(combinedHtml)) addIssue({ category: "conversion", severity: "medium", code: "package_tracking", title: "Paket seçimi ölçümü görünmüyor", deduction: 1, recommendation: "Paket seçimini kişisel veri içermeyen standart event ile ölçün." });
  if (!/data-event=["'](?:map_click|directions_click)/i.test(combinedHtml)) addIssue({ category: "conversion", severity: "medium", code: "map_tracking", title: "Harita tıklaması ölçümü görünmüyor", deduction: 1, recommendation: "Harita CTA'sını map_click event'i ile ölçün." });
  const missingEvents = REQUIRED_CONVERSION_EVENTS.filter((event) => !searchableSource.includes(event));
  if (missingEvents.length) addIssue({ category: "conversion", severity: "high", code: "analytics_event_coverage", title: "Standart dönüşüm event kapsamı eksik", deduction: 4, affectedUrls: missingEvents, recommendation: "Merkezi ve PII filtreli analytics yardımcı fonksiyonu ile eksik event'leri uygulayın." });

  const anchorsBlank = [...combinedHtml.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)].map((match) => match[0]);
  if (anchorsBlank.some((anchor) => !/rel=["'][^"']*noopener[^"']*noreferrer|rel=["'][^"']*noreferrer[^"']*noopener/i.test(anchor))) addIssue({ category: "accessibility", severity: "medium", code: "external_link_rel", title: "Yeni sekme bağlantısında noopener/noreferrer eksik", deduction: 0.5, recommendation: "target=_blank bağlantılarına rel=\"noopener noreferrer\" ekleyin.", autoFixable: true });
  if (/<img\b(?![^>]*\balt=)[^>]*>/i.test(combinedHtml)) addIssue({ category: "accessibility", severity: "medium", code: "global_image_alt", title: "Alt niteliği olmayan görsel var", deduction: 1, recommendation: "Görsel amacına göre anlamlı veya boş alt değeri ekleyin." });
  if (/<button\b(?![^>]*(?:aria-label|>\s*[^<\s]))[^>]*>\s*</i.test(combinedHtml)) addIssue({ category: "accessibility", severity: "medium", code: "button_name", title: "Erişilebilir adı olmayan buton olabilir", deduction: 1, recommendation: "İkon butonlara aria-label ekleyin." });

  const missingHumanFields = [
    ["Google Business Profile", /google\.com\/(?:business|maps\/place)/i],
    ["Koordinatlar", /"geo"\s*:/i],
    ["Sosyal medya hesapları", /"sameAs"\s*:/i],
    ["GA4 veya GTM kimliği", /GTM-[A-Z0-9]+|G-[A-Z0-9]+/i],
  ].filter(([, pattern]) => !pattern.test(combinedHtml)).map(([label]) => label);
  if (missingHumanFields.length) addIssue({ category: "local", severity: "info", code: "missing_verified_business_fields", title: "Doğrulanmış işletme/ölçüm bilgileri eksik", deduction: 0, affectedUrls: missingHumanFields, recommendation: "Bu alanları yalnızca işletme tarafından doğrulandıktan sonra merkezi yapılandırmaya ekleyin.", humanActionRequired: true });

  const categories = Object.fromEntries(Object.entries(CATEGORY_DEFINITIONS).map(([key, definition]) => {
    const deduction = issues.filter((issue) => issue.category === key).reduce((total, issue) => total + issue.deduction, 0);
    return [key, { ...definition, score: Math.max(0, Math.round((definition.weight - deduction) * 10) / 10) }];
  }));
  const totalScore = Math.round(Object.values(categories).reduce((total, category) => total + category.score, 0) * 10) / 10;
  issues.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || b.deduction - a.deduction);

  return {
    totalScore,
    categories,
    issues,
    stats: {
      crawledPages: crawl.pages.length,
      indexablePages: indexablePages.length,
      sitemapUrls: sitemapUrls.length,
      uniqueTitles: titles.size,
      uniqueDescriptions: descriptions.size,
      schemaTypes: [...allSchemaTypes].sort(),
      brokenInternalLinks: brokenLinks.length,
      missingServicePages: missingServices.length,
      missingConversionEvents: missingEvents.length,
    },
    lighthouse: {
      performance: null,
      seo: null,
      accessibility: null,
      bestPractices: null,
      lcp: null,
      cls: null,
      totalBlockingTime: null,
      note: "Lighthouse ölçümü bu hızlı crawler çalışmasına dahil değil; CI tarayıcı ortamı sağlandığında ayrıca eklenebilir.",
    },
  };
}
