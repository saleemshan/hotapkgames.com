import type { Plugin } from "unified";

type MdastNode = {
  type: string;
  depth?: number;
  children?: MdastNode[];
  value?: string;
};

type MdastRoot = { type: "root"; children: MdastNode[] };

function headingText(node: MdastNode): string {
  if (!node.children) return "";
  return node.children
    .map((c) => {
      if (c.type === "text" && typeof c.value === "string") return c.value;
      if (c.type === "inlineCode" && typeof c.value === "string") return c.value;
      return "";
    })
    .join("")
    .trim();
}

function isGameAppGuideMdxPath(filePath: string): boolean {
  return /[/\\](games|apps|guides)[/\\].+\.mdx$/i.test(filePath);
}

/** Drops `## Table of contents` and nodes until the next # / ## (layout outline / sidebar already navigates). */
export const remarkStripManualToc: Plugin<[], MdastRoot> = () => (tree, file) => {
  const fp = String(
    (file as { path?: string }).path ??
      (file as { history?: string[] }).history?.[0] ??
      "",
  );
  if (!isGameAppGuideMdxPath(fp)) return;

  const children = tree.children;
  const next: MdastNode[] = [];
  let i = 0;
  while (i < children.length) {
    const node = children[i];
    if (
      node.type === "heading" &&
      node.depth === 2 &&
      /^table of contents$/i.test(headingText(node))
    ) {
      i += 1;
      while (
        i < children.length &&
        !(
          children[i].type === "heading" &&
          typeof children[i].depth === "number" &&
          children[i].depth! <= 2
        )
      ) {
        i += 1;
      }
      continue;
    }
    next.push(node);
    i += 1;
  }
  tree.children = next;
};
