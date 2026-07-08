import type { Plugin } from "unified";

import {
  headingText,
  isGameMdxPath,
  type MdastNode,
  type MdastRoot,
} from "./remark-mdast-utils";

/** Embedded pros/cons prose + GFM tables duplicate GameProsConsTable (YAML or derived rows). */
function isEmbeddedProsConsHeading(text: string): boolean {
  const t = text.trim();
  if (/^pros\s+and\s+considerations\b/i.test(t)) return true;
  if (/^pros\b/i.test(t) && /\bcons\b/i.test(t)) return true;
  return /^pros\s*\/\s*cons\b/i.test(t);
}

export const remarkStripEmbeddedProsCons: Plugin<[], MdastRoot> = () => (tree, file) => {
  const fp = String(
    (file as { path?: string }).path ??
      (file as { history?: string[] }).history?.[0] ??
      "",
  );
  if (!isGameMdxPath(fp)) return;

  const ch = tree.children;
  const out: MdastNode[] = [];
  let i = 0;
  while (i < ch.length) {
    const node = ch[i];
    if (
      node.type === "heading" &&
      node.depth === 2 &&
      isEmbeddedProsConsHeading(headingText(node))
    ) {
      i += 1;
      while (i < ch.length && !(ch[i].type === "heading" && ch[i].depth === 2)) {
        i += 1;
      }
      continue;
    }
    out.push(node);
    i += 1;
  }
  tree.children = out;
};
