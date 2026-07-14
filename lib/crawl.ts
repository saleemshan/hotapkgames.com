/** Paths disallowed in `app/robots.ts` — keep middleware / headers aligned.
 *  NOTE: `/search` is intentionally NOT listed here — it must remain crawlable
 *  so Google can index the JSON-LD `SearchAction` (Sitelinks Search Box).
 *  It is excluded from search-engine index via `X-Robots-Tag: noindex` in next.config.ts.
 */
export const ROBOTS_TXT_DISALLOW = [
  "/api/",
  "/admin/",
  /** Pages Router legacy JSON data (App Router uses RSC flight instead). */
  "/_next/data/",
] as const;

export const CRAWL_NOINDEX_VALUE = "noindex, nofollow";

export function isRscFlightRequest(request: {
  headers: { get(name: string): string | null };
  nextUrl: { searchParams: URLSearchParams };
}): boolean {
  return (
    request.headers.get("RSC") === "1" ||
    request.nextUrl.searchParams.has("_rsc")
  );
}
