# SEO maintenance (Gameistan Pro)

This project uses the **Next.js App Router** metadata API, **dynamic** `app/sitemap.ts` and `app/robots.ts`, and **JSON-LD** via [`components/seo/JsonLd.tsx`](components/seo/JsonLd.tsx).

## Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for the live site (no trailing slash). **Set in production** so sitemaps, `metadataBase`, and JSON-LD URLs are correct. On Vercel, `VERCEL_URL` is used as a fallback when this is unset. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown in the footer, privacy policy, disclaimer, and terms (DMCA line). Falls back to `contact@gameistanpro.com.pk`. |
| `NEXT_PUBLIC_ORG_SAME_AS` | Comma-separated profile URLs for Organization `sameAs` in root JSON-LD (e.g. social profiles). |

## Global SEO entry points

- **[`app/layout.tsx`](app/layout.tsx)** — `metadataBase`, default title template, default Open Graph / Twitter images (`/api/og?...`), `viewport`, preconnect to `gameistan.com.pk`, sitewide **Organization** + **WebSite** (with **SearchAction**) JSON-LD. **No default `canonical`** here; each route sets its own.
- **[`lib/seo.ts`](lib/seo.ts)** — `getSiteUrl()`, `absoluteUrl()`, `buildListingSearchPath()` (listing canonicals), `getDefaultOgImagePath()`, `getContactEmail()`, `getOrgSameAs()`, `siteConfig`.

## Adding a new MDX app, game, or guide

1. Add the file under `content/apps/`, `content/games/`, or `content/guides/` per [contentlayer.config.ts](contentlayer.config.ts).
2. Fill **frontmatter** (`title`, `shortDescription` / `description`, `slug`, dates, `coverImage`, etc.). Use **HTTPS** URLs in body links when the target supports it.
3. **No per-file metadata** is required for detail URLs: [`app/(site)/games/[slug]/page.tsx`](app/(site)/games/[slug]/page.tsx), [`app/(site)/apps/[slug]/page.tsx`](app/(site)/apps/[slug]/page.tsx), and [`app/(site)/guides/[slug]/page.tsx`](app/(site)/guides/[slug]/page.tsx) call `generateMetadata` from Contentlayer data.
4. Run the Contentlayer build so types and `sitemap.ts` pick up the new document.

## Schema types by route

| Route pattern | JSON-LD types |
|---------------|----------------|
| All pages (root layout) | **Organization**, **WebSite** (+ SearchAction) |
| `/games`, `/apps` | **CollectionPage** + **ItemList** (current page slice; canonical matches facet + pagination) |
| `/games/[slug]`, `/apps/[slug]` (games live at `/[slug]`) | **BreadcrumbList**, **SoftwareApplication** (+ **VideoGame** on games), aggregateRating only if votes ≥ 5, **FAQPage** (if FAQs exist) |
| `/guides/[slug]` | **BreadcrumbList**, **Article** |
| Listing pages | Rely on page-level `metadata` / `generateMetadata` (no extra schema required) |

## Listing & faceted URLs

- [`app/(site)/games/page.tsx`](app/(site)/games/page.tsx) and [`app/(site)/apps/page.tsx`](app/(site)/apps/page.tsx) use **self-referencing canonicals** built with `buildListingSearchPath()` (category, sort, page). Pages with `page > 1` use `noindex, follow`.
- [`app/(site)/guides/page.tsx`](app/(site)/guides/page.tsx) uses `generateMetadata` for `?category=` with matching canonicals.
- [`app/(site)/categories/[category]/page.tsx`](app/(site)/categories/[category]/page.tsx) includes pagination in metadata; `page > 1` is `noindex, follow`.

## Sitemap

- **[`app/sitemap.ts`](app/sitemap.ts)** includes static routes, all apps/games/guides, categories, and **tag** URLs only when `isTagPageIndexable()` is true (same rule as [`app/(site)/tags/[tag]/page.tsx`](app/(site)/tags/[tag]/page.tsx): at least three tagged items).

## Testing

- [Google Rich Results Test](https://search.google.com/test/rich-results) — paste a live URL to validate JSON-LD.
- [PageSpeed Insights](https://pagespeed.web.dev/) — Core Web Vitals and mobile checks.

## Middleware

- **[`middleware.ts`](middleware.ts)** — 301-redirects stale `/?page=N` URLs to `/`. The homepage no longer uses pagination (the old `HomeFeaturedGamesSection` component is unused), but Google still crawls cached `/?page=*` URLs. Without the redirect these appeared as "Alternate page with proper canonical tag" in Google Search Console.

## Robots

- **[`app/robots.ts`](app/robots.ts)** — `Allow: /`, `Disallow: /api/`, `/search`; sitemap URL derived from `getSiteUrl()`.
