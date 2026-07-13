import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";

function collectFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? collectFiles(path) : [path];
  });
}

function routeFromFile(outputDirectory, path) {
  const value = relative(outputDirectory, path).split(sep).join("/");
  if (value === "index.html") return "/";
  if (value.endsWith("/index.html")) return `/${value.slice(0, -"index.html".length)}`;
  return `/${value}`;
}

function canonicalRoute(value) {
  const path = value.split(/[?#]/)[0] || "/";
  if (path === "/") return path;
  if (extname(path)) return path;
  return `${path.replace(/\/+$/, "")}/`;
}

function discoverLinks(html, baseUrl) {
  const urls = [];
  for (const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)) {
    try {
      const url = new URL(match[1], baseUrl);
      if (url.origin !== new URL(baseUrl).origin) continue;
      url.hash = "";
      url.search = "";
      urls.push(url.href);
    } catch {
      // Malformed URLs are reported by the checks layer.
    }
  }
  return urls;
}

export async function fetchWithRetry(url, options = {}, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { cache: "no-store", redirect: "follow", ...options });
      if (response.status >= 500 && attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 400));
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, attempt * 400));
    }
  }
  throw lastError ?? new Error(`Unable to fetch ${url}`);
}

export function crawlStatic({ outputDirectory, origin }) {
  const absoluteOutput = join(process.cwd(), outputDirectory);
  if (!existsSync(absoluteOutput)) {
    throw new Error(`${outputDirectory} does not exist. Run the production/static build first.`);
  }

  const files = collectFiles(absoluteOutput);
  const relativeFiles = new Set(files.map((path) => relative(absoluteOutput, path).split(sep).join("/")));
  const pageFiles = files.filter((path) => path.endsWith(`${sep}index.html`) || path === join(absoluteOutput, "index.html"));
  const pages = pageFiles.map((path) => {
    const route = routeFromFile(absoluteOutput, path);
    return {
      route,
      url: new URL(route, origin).href,
      status: route === "/404/" || route === "/_not-found/" ? 404 : 200,
      html: readFileSync(path, "utf8"),
      headers: {},
    };
  });

  const readOptional = (name) => {
    const path = join(absoluteOutput, name);
    return existsSync(path) ? readFileSync(path, "utf8") : "";
  };

  return {
    mode: "static",
    origin,
    pages,
    robots: readOptional("robots.txt"),
    sitemap: readOptional("sitemap.xml"),
    hostingRules: readOptional(".htaccess"),
    relativeFiles,
    sourceText: files
      .filter((path) => path.endsWith(".js"))
      .map((path) => readFileSync(path, "utf8"))
      .join("\n"),
    assetSize(pathname) {
      const relativePath = pathname.replace(/^\/+/, "");
      const path = join(absoluteOutput, relativePath);
      return existsSync(path) && !statSync(path).isDirectory() ? statSync(path).size : null;
    },
    routeExists(pathname) {
      const route = canonicalRoute(pathname);
      if (extname(route)) return relativeFiles.has(route.replace(/^\/+/, ""));
      const file = route === "/" ? "index.html" : `${route.replace(/^\/+/, "")}index.html`;
      return relativeFiles.has(file);
    },
  };
}

export async function crawlLive({ origin, maxPages = 100 }) {
  const normalizedOrigin = new URL(origin);
  normalizedOrigin.pathname = "/";
  normalizedOrigin.search = "";
  normalizedOrigin.hash = "";

  const [robotsResponse, sitemapResponse] = await Promise.all([
    fetchWithRetry(new URL("/robots.txt", normalizedOrigin)),
    fetchWithRetry(new URL("/sitemap.xml", normalizedOrigin)),
  ]);
  const robots = await robotsResponse.text();
  const sitemap = await sitemapResponse.text();
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((match) => match[1].trim());
  const queue = [...new Set([normalizedOrigin.href, ...sitemapUrls])];
  const seen = new Set();
  const pages = [];

  while (queue.length && pages.length < maxPages) {
    const url = queue.shift();
    if (!url || seen.has(url)) continue;
    seen.add(url);
    const parsed = new URL(url, normalizedOrigin);
    if (parsed.origin !== normalizedOrigin.origin) continue;
    parsed.search = "";
    parsed.hash = "";

    try {
      const response = await fetchWithRetry(parsed.href);
      const contentType = response.headers.get("content-type") ?? "";
      const html = /text\/html/i.test(contentType) ? await response.text() : "";
      pages.push({
        route: canonicalRoute(parsed.pathname),
        url: parsed.href,
        status: response.status,
        html,
        headers: Object.fromEntries(response.headers.entries()),
      });
      if (html) {
        for (const discovered of discoverLinks(html, parsed.href)) {
          if (!seen.has(discovered) && queue.length + pages.length < maxPages * 2) queue.push(discovered);
        }
      }
    } catch (error) {
      pages.push({
        route: canonicalRoute(parsed.pathname),
        url: parsed.href,
        status: 0,
        html: "",
        headers: {},
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const scriptUrls = [...new Set(pages.flatMap((page) => [...page.html.matchAll(/<script\b[^>]*src=["']([^"']+)["']/gi)].map((match) => {
    try {
      const url = new URL(match[1], page.url);
      return url.origin === normalizedOrigin.origin ? url.href : null;
    } catch { return null; }
  })).filter(Boolean))].slice(0, 40);
  const scriptResponses = await Promise.all(scriptUrls.map(async (url) => {
    try {
      const response = await fetchWithRetry(url, {}, 2);
      return response.ok ? await response.text() : "";
    } catch { return ""; }
  }));

  return {
    mode: "live",
    origin: normalizedOrigin.origin,
    pages,
    robots,
    sitemap,
    hostingRules: "",
    relativeFiles: new Set(),
    sourceText: scriptResponses.join("\n"),
    assetSize() { return null; },
    routeExists(pathname) {
      const wanted = canonicalRoute(pathname);
      return pages.some((page) => page.route === wanted && page.status >= 200 && page.status < 400);
    },
  };
}
