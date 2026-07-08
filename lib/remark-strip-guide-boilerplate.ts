import type { Plugin } from "unified";

type MdastNode = {
  type: string;
  depth?: number;
  children?: MdastNode[];
  value?: string;
};

type MdastRoot = { type: "root"; children: MdastNode[] };

function plainText(node: MdastNode | undefined): string {
  if (!node) return "";
  if (node.type === "text" && typeof node.value === "string") return node.value;
  if (!node.children?.length) return "";
  return node.children.map((c) => plainText(c)).join("");
}

/** Must stay aligned with `scripts/strip-mirror-boilerplate.mjs` (whole-line drops). */
function isBoilerplateParagraphText(t: string): boolean {
  const s = t.trim();
  if (!s) return false;
  const bare = s.replace(/^\*\s+/, "").replace(/^\*\*|\*\*$/g, "").trim();
  if (/^this (guide|page) mirrors\b/i.test(bare)) return true;
  if (/^this guide matches\b/i.test(bare)) return true;
  if (/primary (link|download) \(unchanged from legacy source\)/i.test(s)) return true;
  if (/^\*\*source \(same canonical url as\b/i.test(s)) return true;
  if (/official download \(same\b/i.test(s)) return true;
  if (/^(\*\*)?official apk \(same\b/i.test(bare)) return true;
  if (/^(\*\*)?official [^\n]+ \(same\b/i.test(bare)) return true;
  return false;
}

function isGameAppGuidePath(filePath: string): boolean {
  return /[/\\](games|apps|guides)[/\\].+\.mdx$/i.test(filePath);
}

function stripMatchingParagraph(node: MdastNode): boolean {
  if (node.type !== "paragraph") return false;
  return isBoilerplateParagraphText(plainText(node));
}

function listItemOnlyBoilerplate(li: MdastNode): boolean {
  if (li.type !== "listItem" || !li.children?.length) return false;
  return li.children.length === 1 && stripMatchingParagraph(li.children[0]);
}

/**
 * Drops mirror / legacy attribution paragraphs from game, app, and guide MDX.
 * Bulk cleanup lives in `scripts/strip-mirror-boilerplate.mjs`; this catches new uploads.
 */
export const remarkStripGuideBoilerplate: Plugin<[], MdastRoot> = () => (tree, file) => {
  const fp = String(
    (file as { path?: string }).path ??
      (file as { history?: string[] }).history?.[0] ??
      "",
  );
  if (!isGameAppGuidePath(fp)) return;

  const next: MdastNode[] = [];
  for (const node of tree.children) {
    if (stripMatchingParagraph(node)) continue;

    if (node.type === "blockquote") {
      const inner = plainText(node).trim();
      if (isBoilerplateParagraphText(inner)) continue;
    }

    if (node.type === "list" && node.children?.length) {
      const kept = node.children.filter((li) => !listItemOnlyBoilerplate(li));
      if (kept.length === 0) continue;
      node.children = kept;
    }

    next.push(node);
  }
  tree.children = next;
};
