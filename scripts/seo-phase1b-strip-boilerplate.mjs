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
  let src = fs.readFileSync(full, "utf8");
  const before = src;

  src = src.replace(
    /\n## Pakistan reality check[^\n]*\n+Online real-money APKs sit in a \*\*legal grey zone\*\* in Pakistan\.[\s\S]*?\(\/guides\/best-earning-games-pakistan-2026\)\)?\s*\n?/m,
    "\n",
  );

  if (src !== before) {
    fs.writeFileSync(full, src);
    summary.push(file);
  }
}

console.log(`Stripped duplicate "Pakistan reality check" block from ${summary.length} files.`);
for (const s of summary) console.log(`  - ${s}`);
