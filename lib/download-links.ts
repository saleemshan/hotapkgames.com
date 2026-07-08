/** First usable HTTP(S) mirror from listing front matter (hero CTA). */
export function getPrimaryDownloadUrl(links: string[] | undefined): string | null {
  if (!links?.length) return null;
  for (const raw of links) {
    const u = raw.trim();
    if (/^https?:\/\//i.test(u)) return u;
  }
  return null;
}
