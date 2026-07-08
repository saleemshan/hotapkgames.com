/** Tiny OG query parsing — keep `app/api/og` free of zod so the route bundle stays small. */

const MAX_TITLE = 120;
const MAX_RATING = 10;
const MAX_SUB = 80;

export function parseOgSearchParams(searchParams: URLSearchParams): {
  title: string | undefined;
  rating: string | undefined;
  subtitle: string | undefined;
} {
  const t = searchParams.get("title");
  const r = searchParams.get("rating");
  const s = searchParams.get("subtitle");
  return {
    title: t ? t.slice(0, MAX_TITLE) : undefined,
    rating: r ? r.slice(0, MAX_RATING) : undefined,
    subtitle: s ? s.slice(0, MAX_SUB) : undefined,
  };
}
