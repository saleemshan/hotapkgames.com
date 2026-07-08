#!/usr/bin/env node
/**
 * Drops duplicated blocks from game MDX source:
 * - Overview section (hero + intro cover the same ground)
 * - Boilerplate second Introduction paragraph
 * - Embedded FAQs + Last updated (FAQSection renders from frontmatter)
 * - Self-link sentence in Conclusion
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const gamesDir = path.join(root, "content/games");

const introBoilerplate =
  /^What makes this platform particularly relevant for Pakistani users[\s\S]*?not blind trust\.\s*\n/m;

const overviewBlock =
  /\n\*\*Overview\*\*\n\n[\s\S]*?(?=\n\*\*Introduction\*\*\n)/m;

const faqTail = /\n\*\*FAQs\*\*[\s\S]*$/m;

const selfLinkSentence =
  /\s*Compare peers on our \[[^\]]+\]\([^)]+\) hub section alongside audited titles when mirrors change\./g;

for (const file of fs.readdirSync(gamesDir).filter((f) => f.endsWith(".mdx"))) {
  const fp = path.join(gamesDir, file);
  let src = fs.readFileSync(fp, "utf8");
  const before = src;

  src = src.replace(overviewBlock, "\n");
  src = src.replace(introBoilerplate, "\n");
  src = src.replace(faqTail, "\n");
  src = src.replace(selfLinkSentence, "");

  if (src !== before) {
    fs.writeFileSync(fp, src);
    console.log("cleaned", file);
  }
}
