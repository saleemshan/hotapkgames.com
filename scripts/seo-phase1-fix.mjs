#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const GAMES_DIR = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "..",
  "content",
  "games",
);

const files = fs.readdirSync(GAMES_DIR).filter((f) => f.endsWith(".mdx"));
const summary = [];

for (const file of files) {
  const full = path.join(GAMES_DIR, file);
  const slug = file.replace(/\.mdx$/, "");
  let src = fs.readFileSync(full, "utf8");
  const before = src;

  src = src.replace(
    /^canonical:\s*['"]?https:\/\/www\.gameistanpro\.com\.pk\/games\/([a-z0-9-]+)['"]?\s*$/m,
    (_m, s) => `canonical: 'https://www.gameistanpro.com.pk/${s}'`,
  );

  src = src.replace(
    /^canonical:\s*['"]?https:\/\/www\.gameistanpro\.com\.pk\/(?!games\/)([a-z0-9-]+)['"]?\s*$/m,
    (_m, s) => `canonical: 'https://www.gameistanpro.com.pk/${s}'`,
  );

  const fmMatch = src.match(/^---\n([\s\S]*?)\n---/);
  if (fmMatch) {
    const fm = fmMatch[1];
    const descMatch = fm.match(/^description:\s*>-?\s*\n((?:\s{2,}.*\n)+)/m);
    const shortDescMatch = fm.match(
      /^shortDescription:\s*>-?\s*\n((?:\s{2,}.*\n)+)/m,
    );

    const norm = (s) =>
      (s || "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .join(" ")
        .trim();

    const descNorm = norm(descMatch?.[1]);
    const shortNorm = norm(shortDescMatch?.[1]);

    if (
      descMatch &&
      shortDescMatch &&
      descNorm.length > 0 &&
      descNorm === shortNorm
    ) {
      const brand = slug
        .replace(/-game$/, "")
        .replace(/(^|\d)([a-z])/g, (_, a, b) => a + b.toUpperCase());
      const newDesc = `Editorial review of ${brand} APK for Pakistani players in 2026 — verified install steps, JazzCash and EasyPaisa cash-out reality, bonus wagering math, and risk signals our 12-point rubric flags before you deposit.`;
      src = src.replace(
        /^description:\s*>-?\s*\n(?:\s{2,}.*\n)+/m,
        `description: >-\n  ${newDesc}\n`,
      );
    }
  }

  if (src !== before) {
    fs.writeFileSync(full, src);
    summary.push(slug);
  }
}

console.log(`Phase 1 done: ${summary.length}/${files.length} files updated.`);
for (const s of summary) console.log(`  - ${s}`);
