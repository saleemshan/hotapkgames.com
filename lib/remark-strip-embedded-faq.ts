import type { Plugin } from "unified";

import {
  headingText,
  isBoldLabelParagraph,
  isGameOrAppMdxPath,
  isLastUpdatedParagraph,
  type MdastNode,
  type MdastRoot,
} from "./remark-mdast-utils";

function isFaqHeading(node: MdastNode): boolean {
  if (node.type === "heading") {
    const text = headingText(node);
    return (
      /^(faqs?|frequently\s+asked\s+questions)/i.test(text) ||
      /\bfaqs?\b/i.test(text) ||
      /\bfrequently\s+asked\s+questions\b/i.test(text)
    );
  }
  return (
    isBoldLabelParagraph(node, /^(faqs?|frequently\s+asked\s+questions)/i) ||
    isBoldLabelParagraph(node, /\bfaqs?\b/i)
  );
}

/**
 * Removes embedded FAQ blocks from game/app MDX so FAQSection + FAQ JSON-LD
 * (frontmatter `faqs`) are not duplicated in the article body.
 */
export const remarkStripEmbeddedFaq: Plugin<[], MdastRoot> = () => (tree, file) => {
  const fp = String(
    (file as { path?: string }).path ??
      (file as { history?: string[] }).history?.[0] ??
      "",
  );
  if (fp && !isGameOrAppMdxPath(fp)) return;

  const ch = tree.children;
  const out: MdastNode[] = [];
  let i = 0;
  while (i < ch.length) {
    const node = ch[i];
    if (isFaqHeading(node)) {
      i += 1;
      while (i < ch.length) {
        i += 1;
      }
      continue;
    }
    if (isLastUpdatedParagraph(node)) {
      i += 1;
      continue;
    }
    out.push(node);
    i += 1;
  }
  tree.children = out;
};
