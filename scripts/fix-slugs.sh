#!/usr/bin/env node
/**
 * Fix game slugs to two-word format: name-game
 * Updates frontmatter slugs and renames MDX files.
 */

const fs = require("fs");
const path = require("path");

const GAMES_DIR = path.join(__dirname, "..", "content", "games");

// Map of old_slug -> new_slug
const SLUG_MAP = {
  // Files with long slugs (more than 2 words)
  "dk999-game-pakistan-2025": "dk999-game",
  "done-55-game": "done55-game",
  "done-999-game-apk-pakistan": "done999-game",
  "jami-777-game": "jami777-game",
  "no777-game-app": "no777-game",
  "noob-win-game": "noobwin-game",
  "pk8-game-apk-pakistan": "pk8-game",
  "rs786-game-apk-download": "rs786-game",
  "td777-game-pakistan-2025": "td777-game",
  // Files with "double game" slugs (xxxgame-game)
  "3rr777game-game": "3rr777-game",
  "588wingame-game": "588win-game",
  "666wgame-game": "666w-game",
  "88efgame-game": "88ef-game",
  "8batgame-game": "8bat-game",
  "bet877game-game": "bet877-game",
  "ct777game-game": "ct777-game",
  "hahapkrgame-game": "hahapkr-game",
};

const files = fs.readdirSync(GAMES_DIR).filter((f) => f.endsWith(".mdx"));
const redirects = [];

for (const file of files) {
  const filePath = path.join(GAMES_DIR, file);
  let content = fs.readFileSync(filePath, "utf-8");

  // Extract current slug from frontmatter
  const slugMatch = content.match(/^slug:\s*"?([^"\n]+)"?\s*$/m);
  if (!slugMatch) {
    console.log(`⚠️  No slug found in ${file}`);
    continue;
  }

  const currentSlug = slugMatch[1].trim();
  const newSlug = SLUG_MAP[currentSlug];

  if (!newSlug) continue; // Already correct format

  console.log(`✅ ${currentSlug} -> ${newSlug} (${file})`);

  // Update slug in frontmatter
  content = content.replace(
    /^slug:\s*"?[^"\n]+"?\s*$/m,
    `slug: "${newSlug}"`
  );
  fs.writeFileSync(filePath, content, "utf-8");

  // Rename file
  const newFileName = `${newSlug}.mdx`;
  if (file !== newFileName) {
    const newPath = path.join(GAMES_DIR, newFileName);
    fs.renameSync(filePath, newPath);
    console.log(`   📁 Renamed: ${file} -> ${newFileName}`);
  }

  redirects.push({ old: currentSlug, new: newSlug });
}

console.log("\n=== Redirect entries needed for next.config.ts ===\n");
for (const r of redirects) {
  console.log(`{ source: "/${r.old}", destination: "/${r.new}", permanent: true },`);
}
