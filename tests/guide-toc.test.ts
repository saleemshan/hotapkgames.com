import { describe, expect, it } from "vitest";

import { extractTocFromMarkdown } from "@/lib/guide-toc";

const slug = "test-guide";

describe("extractTocFromMarkdown", () => {
  it("preserves document order for ## then ###", () => {
    const md = `## First\n\nText\n\n### Nested\n\n## Second\n`;
    const t = extractTocFromMarkdown(md, slug);
    expect(t.map((x) => x.text)).toEqual(["First", "Nested", "Second"]);
    expect(t.map((x) => x.level)).toEqual([2, 3, 2]);
  });

  it("strips emphasis for slug text", () => {
    const md = `## Hello **world**\n`;
    const t = extractTocFromMarkdown(md, slug);
    expect(t[0].text).toBe("Hello world");
    expect(t[0].id).toBe("hello-world");
  });

  it("drops manual Table of contents block (same pipeline as page build)", () => {
    const md = `## Table of contents\n\n- one\n- two\n\n## Real section\n`;
    const t = extractTocFromMarkdown(md, slug);
    expect(t.map((x) => x.text)).toEqual(["Real section"]);
  });

  it("includes #### headings", () => {
    const md = `## A\n\n#### Deep\n\n## B\n`;
    const t = extractTocFromMarkdown(md, slug);
    expect(t.map((x) => ({ text: x.text, level: x.level }))).toEqual([
      { text: "A", level: 2 },
      { text: "Deep", level: 4 },
      { text: "B", level: 2 },
    ]);
  });
});
