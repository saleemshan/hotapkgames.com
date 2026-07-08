export type MdastNode = {
  type: string;
  depth?: number;
  children?: MdastNode[];
  value?: string;
};

export type MdastRoot = { type: "root"; children: MdastNode[] };

export function plainText(node: MdastNode | undefined): string {
  if (!node) return "";
  if (node.type === "text" && typeof node.value === "string") return node.value;
  if (!node.children?.length) return "";
  return node.children.map((c) => plainText(c)).join("");
}

export function headingText(node: MdastNode): string {
  return plainText(node).trim();
}

export function isGameOrAppMdxPath(filePath: string): boolean {
  return /[/\\](games|apps)[/\\].+\.mdx$/i.test(filePath);
}

export function isGameMdxPath(filePath: string): boolean {
  return /[/\\]games[/\\].+\.mdx$/i.test(filePath);
}

/** Paragraph whose visible text is only a bold label, e.g. `**FAQs**`. */
export function isBoldLabelParagraph(node: MdastNode, label: RegExp): boolean {
  if (node.type !== "paragraph") return false;
  return label.test(plainText(node).trim());
}

export function isLastUpdatedParagraph(node: MdastNode): boolean {
  if (node.type !== "paragraph") return false;
  return /^last updated:/i.test(plainText(node).trim());
}
