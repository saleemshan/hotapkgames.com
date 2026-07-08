import path from "node:path";

import Slugger from "github-slugger";
import type { Heading, PhrasingContent, Root } from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { VFile } from "vfile";
import { visit } from "unist-util-visit";

import { remarkStripGuideBoilerplate } from "@/lib/remark-strip-guide-boilerplate";
import { remarkStripManualToc } from "@/lib/remark-strip-manual-toc";

export type TocEntry = { id: string; text: string; level: 2 | 3 | 4 };

/** Plain text from a heading node — matches rehype-slug + hast-util-to-string behavior for mdast. */
function headingToPlainText(node: Heading): string {
  return phrasingToPlain(node.children as PhrasingContent[]);
}

function phrasingToPlain(nodes: PhrasingContent[]): string {
  let out = "";
  for (const n of nodes) {
    out += phrasingPlainOne(n);
  }
  return out.replace(/\s+/g, " ");
}

function phrasingPlainOne(n: PhrasingContent): string {
  switch (n.type) {
    case "text":
      return n.value;
    case "inlineCode":
      return n.value;
    case "break":
      return " ";
    case "strong":
    case "emphasis":
    case "delete":
      return "children" in n ? phrasingToPlain(n.children as PhrasingContent[]) : "";
    case "link":
    case "linkReference":
      return "children" in n ? phrasingToPlain(n.children as PhrasingContent[]) : "";
    case "footnoteReference":
      return "";
    case "image":
    case "imageReference":
      return n.alt || "";
    case "html":
      return "";
    default: {
      const any = n as PhrasingContent & { children?: PhrasingContent[] };
      if ("children" in any && Array.isArray(any.children)) {
        return phrasingToPlain(any.children);
      }
      return "";
    }
  }
}

function extractFromTree(out: TocEntry[], tree: Root): void {
  const slugger = new Slugger();
  visit(tree, "heading", (node: Heading) => {
    if (node.depth < 2 || node.depth > 4) return;
    const text = headingToPlainText(node).trim();
    if (!text) return;
    out.push({
      id: slugger.slug(text),
      text,
      level: node.depth as 2 | 3 | 4,
    });
  });
}

/** Line-order fallback when pipeline fails */
function extractTocLineFallback(raw: string): TocEntry[] {
  const lines = raw.split("\n");
  const slugger = new Slugger();
  const out: TocEntry[] = [];
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)/);
    if (h2?.[1]) {
      const text = h2[1].replace(/\s+#+\s*$/, "").trim();
      out.push({ id: slugger.slug(text), text, level: 2 });
      continue;
    }
    const h3 = line.match(/^###\s+(.+)/);
    if (h3?.[1]) {
      const text = h3[1].replace(/\s+#+\s*$/, "").trim();
      out.push({ id: slugger.slug(text), text, level: 3 });
      continue;
    }
    const h4 = line.match(/^####\s+(.+)/);
    if (h4?.[1]) {
      const text = h4[1].replace(/\s+#+\s*$/, "").trim();
      out.push({ id: slugger.slug(text), text, level: 4 });
    }
  }
  return out;
}

/**
 * Headings in **document order**, after the same remark transforms as Contentlayer
 * (`remarkStripManualToc`, `remarkStripGuideBoilerplate`) so anchors match rendered MDX.
 * Virtual path must look like `…/content/guides/{slug}.mdx` so path-gated plugins run.
 */
export function extractTocFromMarkdown(raw: string, guideSlug: string): TocEntry[] {
  const virtualPath = path.join(
    process.cwd(),
    "content",
    "guides",
    `${guideSlug}.mdx`,
  );

  try {
    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkStripManualToc)
      .use(remarkStripGuideBoilerplate);

    const file = new VFile({ path: virtualPath, value: raw });
    const tree = processor.parse(file) as Root;
    const transformed = processor.runSync(tree, file) as Root;
    const out: TocEntry[] = [];
    extractFromTree(out, transformed);
    return out;
  } catch {
    return extractTocLineFallback(raw);
  }
}
