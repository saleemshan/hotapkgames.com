/**
 * Spam / risk cleanup pass on content/games/*.mdx.
 *
 * Conservative — only acts on patterns we've verified across the corpus:
 *   1. Replace "operates legally" / "regulatory framework" lies with honest
 *      grey-zone disclaimer.
 *   2. Strip "Common Issues & Mirror Sites" sections that promote typo domains.
 *   3. Rewrite outbound https://gameistan.com.pk/<slug>/ links to internal /slug.
 *   4. Fix the known 10win template leak ("What really makes **k55** ...").
 *   5. Drop the marketing "stand out in a sea of gaming sites" boilerplate
 *      paragraph wherever it appears.
 *   6. Replace "Looking for more variety?" outbound block with internal-only.
 *
 * Run: node scripts/seo-game-body-cleanup.mjs
 *      node scripts/seo-game-body-cleanup.mjs --dry
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const GAMES_DIR = path.join(ROOT, "content", "games");
const DRY = process.argv.includes("--dry");

const HONEST_LEGAL = `Online real-money gaming sits in a **legal grey zone** in Pakistan; provincial laws and PTA blocks change frequently. Verify your local rules and treat any APK that claims to be "fully licensed for PK" as a marketing claim, not a fact.`;

function stripCommonIssuesSection(body) {
  // Match "## Common Issues & Mirror Sites" or "## Common Issues and Mirror Sites"
  // up to the next "## " or end of file.
  return body.replace(
    /\n##+ +Common Issues (?:&|and) +Mirror Sites[\s\S]*?(?=\n##+ +|\n---\s*$|$)/gi,
    "\n",
  );
}

function stripMirrorTypoParagraphs(body) {
  return body.replace(
    /\n[^\n]*(?:typos? like|encounter mirror sites|backup mirror sites|come across versioned domains|main server experiences|simply backup mirror)[^\n]*\n/gi,
    "\n",
  );
}

function fixLegalLies(body) {
  // Replace common "operates legally" sentences/clauses.
  body = body.replace(
    /([A-Z][^.\n]{0,40}operates legally[^.\n]*\.\s*)/g,
    "",
  );
  body = body.replace(
    /Yes,? the [A-Z0-9 ]+ Game operates legally within Pakistan'?s current regulatory framework[^.]*\.\s*The application employs[^.]*\.\s*Thousands of Pakistani users have safely participated[^.]*\.\s*/gi,
    `Real-money gaming APKs sit in a **legal grey zone** in Pakistan. We do not claim the publisher is "fully licensed". Treat security and payout claims as marketing until you verify them yourself, and use the safety guides linked at the bottom. `,
  );
  body = body.replace(
    /\bregulatory framework for digital entertainment platforms\b/gi,
    "Pakistan's grey-zone gambling environment",
  );
  body = body.replace(
    /\bregulatory compliance ensures operations align with local laws[^.]*\.\s*/gi,
    "",
  );
  body = body.replace(
    /\*\*Player Risk Assessment\*\*:\s*Very Low for personal use; platform operates legally[^\n]*\n/gi,
    "**Player Risk Assessment**: Real-money loss + Pakistan grey-zone regulatory risk. Treat as entertainment spending, not income.\n",
  );
  body = body.replace(
    /\bIn regions where it operates legally,?\s*/gi,
    "",
  );
  return body;
}

function fixOutboundGameistan(body) {
  // [Label](https://gameistan.com.pk/<slug>/) -> [Label](/<slug>)
  body = body.replace(
    /\[([^\]]+)\]\(https?:\/\/(?:www\.)?gameistan\.com\.pk\/([^)\s]+?)\/?\)/g,
    (_m, label, slug) => `[${label}](/${slug.replace(/\/$/, "")})`,
  );
  // Bare homepage links → /games index.
  body = body.replace(
    /\[([^\]]+)\]\(https?:\/\/(?:www\.)?gameistan\.com\.pk\/?\)/g,
    "[$1](/games)",
  );
  // Plain (non-link) URL mentions → strip
  body = body.replace(
    /\bhttps?:\/\/(?:www\.)?gameistan\.com\.pk\/?[^\s)]*/g,
    "/games",
  );
  // Strip "Same link as [Gameistan <slug>](...)" boilerplate phrases
  body = body.replace(
    /\bSame link as \[Gameistan[^\]]*?\]\([^)]*\):?\s*/gi,
    "",
  );
  // FAQ multi-line variants where "Gameistan <slug>](..." spans 2 lines
  body = body.replace(
    /\n[^\n]*\bSame link as \[Gameistan[^\n]*\n[^\n]*gameistan\.com\.pk[^\n]*\n/gi,
    "\n",
  );
  // "This guide mirrors [gameistan.com.pk/<slug>/](/<slug>)" - clean visible label
  body = body.replace(
    /\[gameistan\.com\.pk\/[^\]]+\]\(\/([^)]+)\)/g,
    "[$1 review](/$1)",
  );
  body = body.replace(
    /\[gameistan\.com\.pk\]\(\/games\)/g,
    "[our reviews](/games)",
  );
  return body;
}

function fixTemplateLeak10win(body, slug) {
  if (slug !== "10win-game") return body;
  return body.replace(
    /What really makes \*\*k55\*\* stand out in a sea of gaming sites[^\n]*\n/g,
    "",
  );
}

function stripVarietyOutboundBlock(body) {
  // "### Looking for more variety?" block where every link points to gameistan.com.pk.
  // After fixOutboundGameistan they become internal, so this is mostly a tidy-up:
  // delete the block if it exists since it adds no unique value.
  return body.replace(
    /\n###+ +Looking for more variety\?\n[\s\S]*?(?=\n##+ +|\n---\s*$|$)/g,
    "\n",
  );
}

function stripMarketingBoilerplate(body) {
  body = body.replace(
    /\n[^\n]*stand out in a sea of gaming sites[^\n]*\n/gi,
    "\n",
  );
  body = body.replace(
    /\n[^\n]*Whether you'?re just placing your first bet[^\n]*\n/gi,
    "\n",
  );
  body = body.replace(
    /\n[^\n]*move the needle on your results[^\n]*\n/gi,
    "\n",
  );
  return body;
}

function ensureGreyZoneDisclaimer(body) {
  // Update older disclaimer wording → current wording (idempotent).
  body = body.replace(
    /treat any APK that claims "fully licensed" or "operates legally in Pakistan" as a marketing claim, not a fact\./g,
    `treat any APK that claims to be "fully licensed for PK" as a marketing claim, not a fact.`,
  );
  if (/legal grey zone/i.test(body)) return body;
  // Append once before the trailing disclaimer divider, or at end.
  if (/\n---\s*\n_Disclaimer:/i.test(body)) {
    return body.replace(
      /(\n---\s*\n_Disclaimer:)/,
      `\n\n## Pakistan legal & wallet reality\n\n${HONEST_LEGAL} See [JazzCash & EasyPaisa withdrawals](/guides/jazzcash-easypaisa-withdrawals) and [Fake casino apps](/guides/fake-casino-apps-pakistan).\n$1`,
    );
  }
  return `${body}\n\n## Pakistan legal & wallet reality\n\n${HONEST_LEGAL} See [JazzCash & EasyPaisa withdrawals](/guides/jazzcash-easypaisa-withdrawals) and [Fake casino apps](/guides/fake-casino-apps-pakistan).\n`;
}

function tidyBlanks(body) {
  return body.replace(/\n{3,}/g, "\n\n");
}

function processFile(fp) {
  const slug = path.basename(fp, ".mdx");
  const raw = fs.readFileSync(fp, "utf8");
  const fmEnd = raw.indexOf("\n---", 4);
  if (!raw.startsWith("---") || fmEnd < 0) return { slug, changed: false };
  const fm = raw.slice(0, fmEnd + 4);
  let body = raw.slice(fm.length);
  const before = body;

  body = fixOutboundGameistan(body);
  body = stripCommonIssuesSection(body);
  body = stripMirrorTypoParagraphs(body);
  body = fixLegalLies(body);
  body = fixTemplateLeak10win(body, slug);
  body = stripVarietyOutboundBlock(body);
  body = stripMarketingBoilerplate(body);
  body = ensureGreyZoneDisclaimer(body);
  body = tidyBlanks(body);

  const changed = body !== before;
  if (changed && !DRY) fs.writeFileSync(fp, fm + body, "utf8");
  return { slug, changed };
}

function main() {
  const files = fs
    .readdirSync(GAMES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .sort();
  let changed = 0;
  for (const f of files) {
    const fp = path.join(GAMES_DIR, f);
    const r = processFile(fp);
    if (r.changed) {
      changed++;
      console.log(`UPDATED ${r.slug}`);
    }
  }
  console.log(
    `\nDone. ${changed}/${files.length} files updated${DRY ? " (dry run)" : ""}.`,
  );
}

main();
