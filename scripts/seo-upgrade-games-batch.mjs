/**
 * Batch-clean Game MDX SEO frontmatter: human-readable primaryKeyword / tags /
 * secondaryKeywords (drops typo-spam patterns). Does not touch MDX body.
 *
 * Usage: node scripts/seo-upgrade-games-batch.mjs --skip=0 --take=10
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ROOT = process.cwd();
const GAMES_DIR = path.join(ROOT, "content", "games");

function parseArgs() {
  const skip = Number(
    process.argv.find((a) => a.startsWith("--skip="))?.split("=")[1] ?? "0",
  );
  const take = Number(
    process.argv.find((a) => a.startsWith("--take="))?.split("=")[1] ?? "10",
  );
  return { skip: Math.max(0, skip), take: Math.max(1, take) };
}

function stemBrand(slug) {
  return slug.replace(/-game$/, "").trim() || slug;
}

function prettyBrand(stem) {
  return stem.replace(/-/g, " ").trim();
}

function buildKeywords(stem) {
  const b = stem.toLowerCase();
  const spaced = prettyBrand(stem);
  const out = [
    `${b} game pakistan`,
    `${b} game apk`,
    `${b} apk download pakistan`,
    `${b} game login`,
    `${b} game register`,
    `${b} win`,
    `${b} app pakistan`,
    `${b} jazzcash withdrawal`,
    `${b} easypaisa withdrawal`,
    `${b} online earning pakistan`,
    `${b} official apk`,
    `${b} latest version apk`,
    `${spaced} game pakistan`,
  ];
  return [...new Set(out.map((s) => s.replace(/\s+/g, " ").trim()))];
}

function clipDescription(s) {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= 158) return t;
  const cut = t.slice(0, 155);
  const lastSpace = cut.lastIndexOf(" ");
  const safe = lastSpace > 120 ? cut.slice(0, lastSpace) : cut;
  return `${safe.trim()}…`;
}

function semanticForCategory(category) {
  const base = [
    "jazzcash withdrawal",
    "easypaisa withdrawal",
    "apk mirror pakistan",
    "kyc cnic",
    "wagering bonus",
    "house edge",
  ];
  if (category === "color-prediction") {
    return [...base, "color prediction", "red green violet", "short session betting"];
  }
  if (category === "sports-betting") {
    return [...base, "sports odds pakistan", "live betting apk"];
  }
  if (category === "card-games") {
    return [...base, "teen patti apk", "card casino pakistan"];
  }
  return [...base, "casino slots pakistan", "real money game apk"];
}

function main() {
  const { skip, take } = parseArgs();
  const files = fs
    .readdirSync(GAMES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .sort((a, b) => a.localeCompare(b, "en"));
  const slice = files.slice(skip, skip + take);
  const iso = new Date().toISOString();
  const dateOnly = iso.slice(0, 10);

  for (const file of slice) {
    const slug = file.replace(/\.mdx$/i, "");
    const fp = path.join(GAMES_DIR, file);
    const raw = fs.readFileSync(fp, "utf8");
    const parsed = matter(raw);
    const data = { ...parsed.data };
    const stem = stemBrand(slug);
    const pb = prettyBrand(stem);
    const primaryKeyword = `${stem} game pakistan`;
    const secondaryKeywords = buildKeywords(stem);
    const tags = secondaryKeywords.slice(0, 7);

    const title = `${pb.replace(/\b\w/g, (c) => c.toUpperCase())} Game APK Pakistan (2026) — Download & Wallet Guide`;

    const description = clipDescription(
      `${pb} game APK for Pakistan (2026): mirrors, login, JazzCash and EasyPaisa withdrawals, install steps, and FAQs. Always verify bonuses and limits in-app.`,
    );

    Object.assign(data, {
      title,
      slug,
      description,
      shortDescription: description,
      updated: iso,
      updatedAt: dateOnly,
      tags,
      primaryKeyword,
      secondaryKeywords,
      semanticKeywords: semanticForCategory(data.category ?? "casino-games"),
      faqSchema: data.faqSchema ?? true,
      howToSchema: data.howToSchema ?? false,
    });

    const out = matter.stringify(parsed.content, data);
    fs.writeFileSync(fp, out, "utf8");
    console.log(`OK ${file}`);
  }

  console.log(`Done batch skip=${skip} take=${take} (${slice.length} files)`);
}

main();
