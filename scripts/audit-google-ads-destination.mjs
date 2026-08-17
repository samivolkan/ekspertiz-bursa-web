import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const origin = (process.env.ADS_AUDIT_ORIGIN || "https://www.bursaekspertiz.com").replace(/\/+$/, "");
const outputPath = process.env.ADS_AUDIT_OUTPUT || "outputs/google-ads-destination/latest/report.json";
const timeoutMs = Number.parseInt(process.env.ADS_AUDIT_TIMEOUT_MS || "20000", 10);
const strictGoogleAgents = process.env.ADS_AUDIT_STRICT_GOOGLE_AGENTS === "true";

const userAgents = {
  browser: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  neutral: "EkspertizBursa-Destination-Audit/1.0",
  adsDesktop: "AdsBot-Google (+http://www.google.com/adsbot.html)",
  adsMobile: "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36 (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/adsbot.html)",
  googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
};

const routes = [
  ["/", "html", ["data-ads-transparency=\"service-area\"", "Ekspertiz Bursa"]],
  ["/randevu/", "html", ["data-ads-transparency=\"service-area\"", "Randevu, işletme saati teyit ettiğinde kesinleşir"]],
  ["/iletisim/", "html", ["data-ads-transparency=\"service-area\"", "Bahar Gacıroğlu", "Üçevler"]],
  ["/hakkimizda/", "html", ["data-ads-transparency=\"service-area\"", "Bahar Gacıroğlu"]],
  ["/paketler/", "html", ["data-ads-transparency=\"service-area\"", "KDV"]],
  ["/bursa-oto-ekspertiz/", "html", ["data-ads-transparency=\"service-area\"", "Bursa genelinden"]],
  ["/nilufer-oto-ekspertiz/", "html", ["data-ads-transparency=\"service-area\"", "Nilüfer"]],
  ["/robots.txt", "text", ["User-agent: AdsBot-Google", "User-agent: AdsBot-Google-Mobile", "Sitemap: https://www.bursaekspertiz.com/sitemap.xml"]],
  ["/sitemap.xml", "xml", ["https://www.bursaekspertiz.com/randevu/", "https://www.bursaekspertiz.com/bursa-oto-ekspertiz/"]],
  ["/.well-known/adsbot-health.txt", "text", ["status=ok", "physical_service_location=Nilüfer/Üçevler, Bursa", "business_operator=Bahar Gacıroğlu"]],
].map(([path, kind, required]) => ({ path, kind, required }));

const syntheticGoogleRoutes = ["/", "/randevu/", "/bursa-oto-ekspertiz/", "/robots.txt"];
const challengeMarkers = [
  "please wait while your request is being verified",
  "one moment, please",
  "just a moment",
  "checking your browser",
  "verify you are human",
  "cdn-cgi/challenge-platform",
  "cf-chl-",
  "__cf_chl",
  "ddos-guard",
  "browser verification",
];

const results = [];
const issues = [];
const warnings = [];

function reportIssue(message) {
  issues.push(message);
  console.error(`ERROR: ${message}`);
}

function reportWarning(message) {
  warnings.push(message);
  console.warn(`WARN: ${message}`);
}

function detectChallenge(body) {
  const normalized = body.toLowerCase();
  return challengeMarkers.find((marker) => normalized.includes(marker)) || null;
}

async function request(path, method, userAgent, agent) {
  const startedAt = Date.now();
  try {
    const response = await fetch(`${origin}${path}`, {
      method,
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        "user-agent": userAgent,
        accept: method === "HEAD" ? "*/*" : "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.7",
        "accept-language": "tr-TR,tr;q=0.9,en;q=0.7",
        "cache-control": "no-cache",
      },
    });
    const body = method === "HEAD" ? "" : await response.text();
    const entry = {
      path,
      method,
      agent,
      status: response.status,
      finalUrl: response.url,
      contentType: response.headers.get("content-type") || "",
      durationMs: Date.now() - startedAt,
      bodyLength: body.length,
      challenge: method === "GET" ? detectChallenge(body) : null,
      error: null,
    };
    results.push(entry);
    return { entry, body };
  } catch (error) {
    const entry = {
      path,
      method,
      agent,
      status: null,
      finalUrl: null,
      contentType: "",
      durationMs: Date.now() - startedAt,
      bodyLength: 0,
      challenge: null,
      error: error instanceof Error ? error.message : String(error),
    };
    results.push(entry);
    return { entry, body: "" };
  }
}

function validate(route, result, severity = "error") {
  const { entry, body } = result;
  const report = severity === "error" ? reportIssue : reportWarning;
  const label = `${entry.agent} ${entry.method} ${route.path}`;

  if (entry.error) {
    report(`${label}: request failed (${entry.error}).`);
    return;
  }
  if (entry.status !== 200) report(`${label}: expected HTTP 200, received ${entry.status}.`);
  if (entry.finalUrl && !entry.finalUrl.startsWith(`${origin}/`) && entry.finalUrl !== origin) {
    report(`${label}: redirected outside canonical origin to ${entry.finalUrl}.`);
  }
  if (entry.method === "GET" && entry.challenge) {
    report(`${label}: bot/security challenge detected (${entry.challenge}).`);
  }
  if (entry.method === "GET" && route.kind === "html") {
    if (!entry.contentType.toLowerCase().includes("text/html")) {
      report(`${label}: expected HTML content type, received ${entry.contentType || "none"}.`);
    }
    if (body.length < 1000) report(`${label}: HTML body is unexpectedly short (${body.length} bytes).`);
  }
}

for (const route of routes) {
  const browserGet = await request(route.path, "GET", userAgents.browser, "browser");
  const browserHead = await request(route.path, "HEAD", userAgents.browser, "browser");
  const neutralHead = await request(route.path, "HEAD", userAgents.neutral, "neutral-probe");

  validate(route, browserGet);
  validate(route, browserHead);
  validate(route, neutralHead);

  if (browserGet.entry.status !== browserHead.entry.status) {
    reportIssue(`browser HEAD/GET mismatch on ${route.path}: GET ${browserGet.entry.status}, HEAD ${browserHead.entry.status}.`);
  }
  if (browserGet.entry.status !== neutralHead.entry.status) {
    reportIssue(`neutral HEAD/GET mismatch on ${route.path}: GET ${browserGet.entry.status}, HEAD ${neutralHead.entry.status}.`);
  }
  for (const marker of route.required) {
    if (!browserGet.body.includes(marker)) {
      reportIssue(`browser GET ${route.path}: required transparency marker is missing: ${marker}`);
    }
  }
}

for (const path of syntheticGoogleRoutes) {
  const route = routes.find((item) => item.path === path);
  if (!route) continue;

  for (const [agent, userAgent] of [
    ["adsbot-desktop", userAgents.adsDesktop],
    ["adsbot-mobile", userAgents.adsMobile],
    ["googlebot", userAgents.googlebot],
  ]) {
    const getResult = await request(path, "GET", userAgent, agent);
    const headResult = await request(path, "HEAD", userAgent, agent);
    const severity = strictGoogleAgents ? "error" : "warning";
    validate(route, getResult, severity);
    validate(route, headResult, severity);
    if (getResult.entry.status !== headResult.entry.status) {
      const message = `${agent} HEAD/GET mismatch on ${path}: GET ${getResult.entry.status}, HEAD ${headResult.entry.status}.`;
      if (strictGoogleAgents) reportIssue(message);
      else reportWarning(message);
    }
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  origin,
  strictGoogleAgents,
  passed: issues.length === 0,
  issueCount: issues.length,
  warningCount: warnings.length,
  issues,
  warnings,
  results,
  limitations: [
    "Synthetic AdsBot and Googlebot user-agent checks do not originate from Google IP ranges.",
    "Verified crawler access must also be confirmed in hosting or CDN logs against Google's published crawler IP ranges.",
    "A clean result confirms destination availability and transparency checks, not malware-free status of files outside the deployed build.",
  ],
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(`Google Ads destination audit: ${issues.length} error(s), ${warnings.length} warning(s).`);
console.log(`Report: ${outputPath}`);
if (issues.length > 0) process.exitCode = 1;
