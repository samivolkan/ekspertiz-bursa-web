function roundedScore(category) {
  return typeof category?.score === "number" ? Math.round(category.score * 100) : null;
}

export async function measurePageSpeed(target) {
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", target);
  endpoint.searchParams.set("strategy", "mobile");
  for (const category of ["performance", "seo", "accessibility", "best-practices"]) endpoint.searchParams.append("category", category);
  if (process.env.PAGESPEED_API_KEY) endpoint.searchParams.set("key", process.env.PAGESPEED_API_KEY);

  try {
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(120_000) });
    if (!response.ok) {
      return {
        performance: null, seo: null, accessibility: null, bestPractices: null,
        lcp: null, cls: null, totalBlockingTime: null,
        note: `PageSpeed/Lighthouse ölçümü HTTP ${response.status} nedeniyle alınamadı; skor uydurulmadı.`,
      };
    }
    const payload = await response.json();
    const result = payload.lighthouseResult;
    return {
      performance: roundedScore(result?.categories?.performance),
      seo: roundedScore(result?.categories?.seo),
      accessibility: roundedScore(result?.categories?.accessibility),
      bestPractices: roundedScore(result?.categories?.["best-practices"]),
      lcp: result?.audits?.["largest-contentful-paint"]?.numericValue ?? null,
      cls: result?.audits?.["cumulative-layout-shift"]?.numericValue ?? null,
      totalBlockingTime: result?.audits?.["total-blocking-time"]?.numericValue ?? null,
      fetchedAt: result?.fetchTime ?? new Date().toISOString(),
      note: "Google PageSpeed Insights mobil Lighthouse ölçümü.",
    };
  } catch (error) {
    return {
      performance: null, seo: null, accessibility: null, bestPractices: null,
      lcp: null, cls: null, totalBlockingTime: null,
      note: `PageSpeed/Lighthouse ölçümü alınamadı; skor uydurulmadı (${error instanceof Error ? error.message : String(error)}).`,
    };
  }
}
