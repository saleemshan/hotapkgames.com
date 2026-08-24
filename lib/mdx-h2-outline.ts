import Slugger from "github-slugger";

export type OutlineItem = { href: string; label: string };

function shortenOutlineLabel(text: string): string {
  const cut = text.split(/\s+[—–-]\s+/)[0]?.split(" (")[0]?.trim() ?? text;
  if (cut.length <= 42) return cut;
  return `${cut.slice(0, 39).trimEnd()}…`;
}

/**
 * H2 anchors from game/app MDX body (no frontmatter). Slugs match `rehype-slug`.
 */
export function extractMdxH2Outline(raw: string): OutlineItem[] {
  const slugger = new Slugger();
  const items: OutlineItem[] = [];
  for (const line of raw.split("\n")) {
    const m = line.match(/^##\s+(.+)/);
    if (!m?.[1]) continue;
    const text = m[1].replace(/\s+#+\s*$/, "").trim();
    if (!text) continue;
    if (/^(faq|frequently asked questions)\b/i.test(text)) continue;
    if (/pros\s*(and|&|\/)\s*cons/i.test(text)) continue;
    items.push({
      href: `#${slugger.slug(text)}`,
      label: shortenOutlineLabel(text),
    });
  }
  return items;
}
