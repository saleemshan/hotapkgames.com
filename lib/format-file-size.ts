/**
 * Normalizes human-entered APK/file size strings (frontmatter) so we don't show
 * duplicate units like "12mb MB" or "46 MB mb" in the hero and cards.
 */
export function formatFileSizeDisplay(raw: string): string {
  const t = raw.trim();
  if (!t) return t;

  const approx = t.match(/^([~≈]\s*)([\s\S]*)$/);
  const prefix = approx?.[1] ?? "";
  const body = (approx?.[2] ?? t).trim();

  const numMatch = body.match(/^([\d.]+\s*(?:[–-]\s*[\d.]+\s*)?)/);
  if (!numMatch) return t;

  const nums = numMatch[1].trim().replace(/\s*([–-])\s*/g, "–");
  const tail = body.slice(numMatch[0].length).trim();

  const haystack = `${tail} ${body}`;
  const u = haystack.match(/\b(kb|mb|gb)\b/i);
  const unit = u ? u[1].toUpperCase() : "";

  if (!unit) {
    return prefix ? `${prefix}${nums}` : nums;
  }
  return `${prefix}${nums} ${unit}`.replace(/\s+/g, " ").trim();
}
