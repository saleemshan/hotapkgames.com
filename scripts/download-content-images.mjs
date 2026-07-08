/**
 * Pulls gameistan.com.pk wp-content/uploads images referenced in MDX under
 * content/ into public/content-images/ (hashed filenames) and rewrites MDX to
 * /content-images/... so Next/Image serves same-origin assets.
 *
 * Usage: pnpm sync:content-images
 *        pnpm exec node scripts/download-content-images.mjs --dry-run
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const OUT_DIR = path.join(ROOT, "public/content-images");

const DRY = process.argv.includes("--dry-run");

/** Match Gameistan media URLs in MDX/YAML (stops before quote, paren, etc.). */
const URL_IN_TEXT =
  /https:\/\/gameistan\.com\.pk\/wp-content\/uploads\/[A-Za-z0-9/_.,%-]+/gi;

function canonicalUrl(raw) {
  try {
    const u = new URL(raw.trim());
    u.hash = "";
    return u.href;
  } catch {
    return null;
  }
}

function extFromUrl(href) {
  try {
    const base = path.basename(new URL(href).pathname);
    const m = base.match(/(\.[a-z0-9]{2,5})$/i);
    return m ? m[1].toLowerCase() : ".bin";
  } catch {
    return ".bin";
  }
}

function fileNameFor(href) {
  const h = crypto.createHash("sha256").update(href).digest("hex").slice(0, 16);
  return `${h}${extFromUrl(href)}`;
}

function walkMdx(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walkMdx(p, out);
    else if (name.endsWith(".mdx")) out.push(p);
  }
  return out;
}

function collectUrls(mdxFiles) {
  /** @type {Map<string, Set<string>>} canonical -> raw variants in source */
  const byCanonical = new Map();
  for (const file of mdxFiles) {
    const text = fs.readFileSync(file, "utf8");
    let m;
    const re = new RegExp(URL_IN_TEXT.source, URL_IN_TEXT.flags);
    while ((m = re.exec(text)) !== null) {
      const raw = m[0];
      const c = canonicalUrl(raw);
      if (!c) continue;
      if (!byCanonical.has(c)) byCanonical.set(c, new Set());
      byCanonical.get(c).add(raw);
    }
  }
  return byCanonical;
}

async function downloadOne(canonicalHref, destPath) {
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 256) return "skip";

  const res = await fetch(canonicalHref, {
    redirect: "follow",
    headers: {
      "User-Agent": "HotAPK Games/1.0 (content sync; contact: site ops)",
      Accept: "image/*,*/*;q=0.8",
    },
  });
  if (!res.ok) {
    console.warn(`[warn] ${res.status} ${canonicalHref}`);
    return "fail";
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 256) {
    console.warn(`[warn] too small (${buf.length}) ${canonicalHref}`);
    return "fail";
  }
  fs.writeFileSync(destPath, buf);
  return "ok";
}

function rewriteMdxSources(mdxFiles, canonicalToPublic) {
  let filesChanged = 0;
  const re = new RegExp(URL_IN_TEXT.source, URL_IN_TEXT.flags);
  for (const file of mdxFiles) {
    const text = fs.readFileSync(file, "utf8");
    const next = text.replace(re, (raw) => {
      const c = canonicalUrl(raw);
      if (!c) return raw;
      return canonicalToPublic.get(c) ?? raw;
    });
    if (next !== text) {
      fs.writeFileSync(file, next);
      filesChanged++;
    }
  }
  return filesChanged;
}

async function main() {
  const mdxFiles = walkMdx(CONTENT_DIR);
  const byCanonical = collectUrls(mdxFiles);
  const entries = [...byCanonical.entries()];

  console.log(`MDX files: ${mdxFiles.length}, unique image URLs: ${entries.length}`);

  if (DRY) {
    for (const [c] of entries) console.log(`  ${c}`);
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  /** canonical -> /content-images/filename.ext (only when file on disk is usable) */
  const canonicalToPublic = new Map();

  for (let i = 0; i < entries.length; i++) {
    const [canonicalHref] = entries[i];
    const fname = fileNameFor(canonicalHref);
    const dest = path.join(OUT_DIR, fname);
    const publicPath = `/content-images/${fname}`;

    const status = await downloadOne(canonicalHref, dest);
    if (status === "ok") console.log(`[${i + 1}/${entries.length}] ok ${fname}`);
    else if (status === "skip")
      console.log(`[${i + 1}/${entries.length}] skip ${fname}`);
    if (status === "ok" || status === "skip") canonicalToPublic.set(canonicalHref, publicPath);
    if (i % 5 === 0) await new Promise((r) => setTimeout(r, 40));
  }

  const filesChanged = rewriteMdxSources(mdxFiles, canonicalToPublic);
  console.log(`Rewrote ${filesChanged} MDX files → /content-images/*`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
