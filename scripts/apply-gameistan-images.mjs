/**
 * Fetches hero/screenshot URLs from Gameistan post HTML and patches game MDX frontmatter
 * when cover is placehold.co or screenshots are empty / placeholder-only.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const GAMES_DIR = path.join(ROOT, "content/games");

/** When no "same as Gameistan" line exists, use these slugs */
const SLUG_BY_FILE = {
  "777-poker-game-apk-pakistan.mdx": "777taz-game",
  "cd22-game-pakistan.mdx": "777-pkr-game",
  "588win-game-download-apk-pakistan.mdx": "zh88-game",
  "j188-game-apk-pakistan.mdx": "j188-game",
  "dk777-pakistan-review.mdx": "dk-777-game",
  "p999-game-download-apk-pakistan.mdx":
    "p999-game-download-apk-real-earning-app-in-pakistan",
  "877bet-game-apk-pakistan.mdx": "877bet-game",
};

const FALLBACK_SS = [
  "https://gameistan.com.pk/wp-content/uploads/2026/04/download-3.jpeg",
  "https://gameistan.com.pk/wp-content/uploads/2026/04/download-2.jpeg",
  "https://gameistan.com.pk/wp-content/uploads/2026/04/image.png",
  "https://gameistan.com.pk/wp-content/uploads/2026/04/6f4626d22b9259a9b84db1976e12a7bf.webp",
  "https://gameistan.com.pk/wp-content/uploads/2025/09/images-7.jpeg",
];

function extractOfficialSlug(content, basename) {
  if (SLUG_BY_FILE[basename]) return SLUG_BY_FILE[basename];
  const patterns = [
    /same as \[[^\]]+\]\(https:\/\/gameistan\.com\.pk\/([^/]+)\/\)/i,
    /Official[^\n]*\(https:\/\/gameistan\.com\.pk\/([^/]+)\/\)/i,
  ];
  for (const re of patterns) {
    const m = content.match(re);
    if (m) return m[1];
  }
  return null;
}

function isTinyThumb(url) {
  return /-\d+x\d+\.(jpeg|jpg|png|webp)$/i.test(url) &&
    /-(75x75|150x150|128x128|32x32|192x192|180x180)\./i.test(url);
}

async function fetchImageUrls(slug) {
  const url = `https://gameistan.com.pk/${slug}/`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) return null;
  const html = await res.text();
  const start = html.indexOf("entry-content");
  const slice =
    start === -1 ? html : html.slice(start, start + 500000);
  const re =
    /src="(https:\/\/gameistan\.com\.pk\/wp-content\/uploads\/[^"]+)"/g;
  const seen = new Set();
  const urls = [];
  let m;
  while ((m = re.exec(slice)) !== null) {
    let u = m[1].replace(/&amp;/g, "&");
    if (isTinyThumb(u)) continue;
    if (seen.has(u)) continue;
    seen.add(u);
    urls.push(u);
  }
  return urls.length ? urls : null;
}

function needsUpdate(content) {
  const cover = content.match(/coverImage:\s*"([^"]*)"/)?.[1] ?? "";
  if (cover.includes("placehold.co")) return true;
  if (/screenshots:\s*\[\s*\]/s.test(content)) return true;
  if (/placehold\.co.*screenshots:/s.test(content)) return true;
  const ssBlock = content.match(/screenshots:\s*\n((?:  - "[^"]*"\n)+)/);
  if (ssBlock) {
    if (ssBlock[1].includes("placehold.co")) return true;
  }
  return false;
}

function patchFrontmatter(content, cover, screenshots) {
  let t = content.replace(/coverImage:\s*"[^"]*"/, `coverImage: "${cover}"`);
  const ssYaml = screenshots.map((s) => `  - "${s}"`).join("\n");
  if (/screenshots:\s*\[\s*\]/s.test(t)) {
    t = t.replace(/screenshots:\s*\[\s*\]/, `screenshots:\n${ssYaml}`);
  } else if (/screenshots:\s*\n(?:  - "[^"]*"\n)+/s.test(t)) {
    t = t.replace(
      /screenshots:\s*\n(?:  - "[^"]*"\n)+/,
      `screenshots:\n${ssYaml}\n`,
    );
  } else {
    t = t.replace(
      /(coverImage:\s*"[^"]*"\n)/,
      `$1screenshots:\n${ssYaml}\n`,
    );
  }
  return t;
}

async function main() {
  const files = fs
    .readdirSync(GAMES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  for (const basename of files) {
    const fp = path.join(GAMES_DIR, basename);
    let content = fs.readFileSync(fp, "utf8");
    if (!needsUpdate(content)) {
      console.log("skip (already has CDN images):", basename);
      continue;
    }
    const slug = extractOfficialSlug(content, basename);
    if (!slug) {
      console.warn("no slug for", basename);
      continue;
    }
    let urls = await fetchImageUrls(slug);
    await new Promise((r) => setTimeout(r, 400));
    if (!urls || !urls.length) {
      console.warn("fetch failed", slug, basename);
      urls = [...FALLBACK_SS];
    }
    const cover = urls[0];
    const shots = [];
    for (const u of urls.slice(1)) {
      if (u !== cover && !shots.includes(u)) shots.push(u);
      if (shots.length >= 5) break;
    }
    while (shots.length < 4) {
      const f = FALLBACK_SS.find((x) => x !== cover && !shots.includes(x));
      if (!f) break;
      shots.push(f);
    }
    const newContent = patchFrontmatter(content, cover, shots);
    fs.writeFileSync(fp, newContent);
    console.log("updated", basename, "←", slug, "cover+", shots.length);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
