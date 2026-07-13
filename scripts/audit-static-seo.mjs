import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";

const outputDirectory = "out";
const origin = "https://bursaekspertiz.com";

function collectFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? collectFiles(path) : [path];
  });
}

function decodeEntities(value) {
  return value
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function headOf(html) {
  return html.slice(0, html.indexOf("</head>") + 7);
}

function matchContent(html, pattern, label, route) {
  const match = html.match(pattern);
  assert.ok(match, `${route}: missing ${label}`);
  return decodeEntities(match[1]);
}

function routeFromFile(path) {
  const route = relative(outputDirectory, path).split(sep).join("/").replace(/index\.html$/, "");
  return route ? `/${route}` : "/";
}

const allFiles = collectFiles(outputDirectory);
assert.equal(allFiles.some((path) => path.includes("~")), false, "Shared-hosting output contains a rejected ~ filename.");

const pageFiles = allFiles.filter((path) => path.endsWith(`${sep}index.html`) || path === join(outputDirectory, "index.html"));
const indexablePages = [];
const titleOwners = new Map();
const descriptionOwners = new Map();
let jsonLdBlocks = 0;
let internalReferences = 0;

for (const path of pageFiles) {
  const route = routeFromFile(path);
  if (route === "/404/" || route === "/_not-found/") continue;

  const html = readFileSync(path, "utf8");
  const head = headOf(html);
  const title = matchContent(head, /<title>([^<]+)<\/title>/i, "title", route);
  const description = matchContent(head, /<meta name="description" content="([^"]+)"\/>/i, "meta description", route);
  const canonical = matchContent(head, /<link rel="canonical" href="([^"]+)"\/>/i, "canonical", route);
  const robots = matchContent(head, /<meta name="robots" content="([^"]+)"\/>/i, "robots", route);

  assert.match(html, /<html[^>]+lang="tr"/i, `${route}: html lang must be tr.`);
  assert.ok(title.length >= 25 && title.length <= 70, `${route}: title length is ${title.length}.`);
  assert.ok(description.length >= 90 && description.length <= 180, `${route}: description length is ${description.length}.`);
  assert.equal((html.match(/<h1(?:\s|>)/gi) ?? []).length, 1, `${route}: exactly one H1 is required.`);
  assert.equal(canonical, `${origin}${route}`, `${route}: canonical must match the final trailing-slash URL.`);
  assert.match(head, /<meta property="og:title" content="[^"]+"\/>/i, `${route}: missing og:title.`);
  assert.match(head, /<meta property="og:description" content="[^"]+"\/>/i, `${route}: missing og:description.`);
  assert.match(head, new RegExp(`<meta property="og:url" content="${canonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"\\/>`, "i"), `${route}: og:url must match canonical.`);
  assert.match(head, /<meta property="og:image" content="https:\/\/bursaekspertiz\.com\/[^"]+"\/>/i, `${route}: missing absolute OG image.`);
  assert.match(head, /<meta name="twitter:card" content="summary_large_image"\/>/i, `${route}: missing Twitter card.`);
  assert.doesNotMatch(head, /(?:src|href)="http:\/\//i, `${route}: mixed-content reference found.`);

  if (/noindex/i.test(robots)) {
    assert.ok(route === "/kvkk/" || route === "/cerez-politikasi/", `${route}: unexpected noindex.`);
  } else {
    indexablePages.push(canonical);
    assert.equal(titleOwners.has(title), false, `${route}: duplicate title also used by ${titleOwners.get(title)}.`);
    assert.equal(descriptionOwners.has(description), false, `${route}: duplicate description also used by ${descriptionOwners.get(description)}.`);
    titleOwners.set(title, route);
    descriptionOwners.set(description, route);
  }

  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    JSON.parse(match[1]);
    jsonLdBlocks += 1;
  }

  for (const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/gi)) {
    const reference = match[1].split(/[?#]/)[0];
    if (!reference || reference.startsWith("//")) continue;
    const relativeReference = reference.replace(/^\//, "");
    const target = reference.endsWith("/") || !extname(relativeReference)
      ? join(outputDirectory, relativeReference, "index.html")
      : join(outputDirectory, relativeReference);
    assert.ok(existsSync(target), `${route}: broken internal reference ${reference}.`);
    internalReferences += 1;
  }
}

const sitemap = readFileSync(join(outputDirectory, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.deepEqual(new Set(sitemapUrls).size, sitemapUrls.length, "Sitemap contains duplicate URLs.");
assert.deepEqual([...sitemapUrls].sort(), [...indexablePages].sort(), "Sitemap and indexable canonical URLs differ.");

const robots = readFileSync(join(outputDirectory, "robots.txt"), "utf8");
assert.match(robots, /Sitemap: https:\/\/bursaekspertiz\.com\/sitemap\.xml/i);
assert.match(robots, /Host: https:\/\/bursaekspertiz\.com/i);

for (const path of [join(outputDirectory, "404.html"), join(outputDirectory, "404", "index.html")]) {
  const head = headOf(readFileSync(path, "utf8"));
  assert.match(head, /<meta name="robots" content="noindex(?:, nofollow)?"\/>/i, `${path}: 404 must be noindex.`);
  assert.doesNotMatch(head, /<meta name="robots" content="index, follow"\/>/i, `${path}: 404 contains conflicting index directive.`);
  assert.doesNotMatch(head, /<link rel="canonical"/i, `${path}: 404 must not canonicalize to an indexable page.`);
}

const htaccess = readFileSync(join(outputDirectory, ".htaccess"), "utf8");
for (const header of [
  "Strict-Transport-Security",
  "Content-Security-Policy",
  "X-Content-Type-Options",
  "Referrer-Policy",
  "X-Frame-Options",
  "Permissions-Policy",
  "Cross-Origin-Opener-Policy",
]) {
  assert.ok(htaccess.includes(header), `.htaccess is missing ${header}.`);
}

console.log(`SEO audit passed: ${indexablePages.length} indexable pages, ${jsonLdBlocks} JSON-LD blocks, ${internalReferences} internal references.`);
