import assert from "node:assert/strict";

const origin = "https://bursaekspertiz.com";

function headOf(html) {
  return html.slice(0, html.indexOf("</head>") + 7);
}

async function fetchText(url, options = {}) {
  const response = await fetch(url, { cache: "no-store", ...options });
  return { response, text: await response.text() };
}

for (const [url, location] of [
  ["http://bursaekspertiz.com/", `${origin}/`],
  ["https://www.bursaekspertiz.com/", `${origin}/`],
]) {
  const response = await fetch(url, { redirect: "manual", cache: "no-store" });
  assert.equal(response.status, 301, `${url} must use a permanent redirect.`);
  assert.equal(response.headers.get("location"), location, `${url} redirect target differs.`);
}

const sitemapResponse = await fetch(`${origin}/sitemap.xml`, { cache: "no-store" });
assert.equal(sitemapResponse.status, 200);
const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.equal(urls.length, 17, "Live sitemap URL count differs from the verified build.");

const titles = new Set();
const descriptions = new Set();
for (const url of urls) {
  const { response, text: html } = await fetchText(url);
  assert.equal(response.status, 200, url);
  const head = headOf(html);
  const title = head.match(/<title>([^<]+)<\/title>/i)?.[1];
  const description = head.match(/<meta name="description" content="([^"]+)"\/>/i)?.[1];
  const canonical = head.match(/<link rel="canonical" href="([^"]+)"\/>/i)?.[1];

  assert.ok(title, `${url}: missing title.`);
  assert.ok(description, `${url}: missing description.`);
  assert.equal(canonical, url, `${url}: canonical mismatch.`);
  assert.equal(titles.has(title), false, `${url}: duplicate title.`);
  assert.equal(descriptions.has(description), false, `${url}: duplicate description.`);
  assert.equal((html.match(/<h1(?:\s|>)/gi) ?? []).length, 1, `${url}: H1 count differs.`);
  assert.match(head, /<meta property="og:url" content="https:\/\/bursaekspertiz\.com\/[^"]*"\/>/i, `${url}: missing og:url.`);
  assert.match(head, /<meta name="twitter:card" content="summary_large_image"\/>/i, `${url}: missing Twitter card.`);
  titles.add(title);
  descriptions.add(description);
}

const { response: homeResponse, text: homeHtml } = await fetchText(`${origin}/`);
for (const header of [
  "strict-transport-security",
  "content-security-policy",
  "x-content-type-options",
  "referrer-policy",
  "x-frame-options",
  "permissions-policy",
  "cross-origin-opener-policy",
  "cross-origin-resource-policy",
]) {
  assert.ok(homeResponse.headers.get(header), `Live response is missing ${header}.`);
}
assert.match(homeResponse.headers.get("strict-transport-security"), /max-age=31536000/);
assert.match(homeResponse.headers.get("content-security-policy"), /frame-ancestors 'none'/);
assert.equal(homeResponse.headers.get("x-frame-options"), "DENY");
assert.match(homeHtml, /"@type":"AutoRepair"/);
assert.match(homeHtml, /"@type":"WebSite"/);
assert.match(homeHtml, /"@type":"FAQPage"/);

for (const route of ["/kvkk/", "/cerez-politikasi/"]) {
  const { response, text } = await fetchText(`${origin}${route}`);
  assert.equal(response.status, 200);
  assert.match(headOf(text), /<meta name="robots" content="noindex, follow"\/>/i, route);
}

const notFound = await fetch(`${origin}/seo-audit-not-found-20260713/`, { cache: "no-store" });
assert.equal(notFound.status, 404);
const notFoundHead = headOf(await notFound.text());
assert.match(notFoundHead, /<meta name="robots" content="noindex(?:, nofollow)?"\/>/i);
assert.doesNotMatch(notFoundHead, /<meta name="robots" content="index, follow"\/>/i);
assert.doesNotMatch(notFoundHead, /<link rel="canonical"/i);

console.log(`Live audit passed: ${urls.length} canonical pages, ${titles.size} unique titles, security headers and 404 controls verified.`);
