/**
 * Regenerate `public/images/hero/hero-gameistan-pro.webp` from a JPEG/PNG source.
 * Place the file at: public/images/hero/hero-gameistan-pro-source.jpg
 */
import sharp from "sharp";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const src = resolve(root, "public/images/hero/hero-gameistan-pro-source.jpg");
const out = resolve(root, "public/images/hero/hero-gameistan-pro.webp");

if (!existsSync(src)) {
  console.error("Missing:", src);
  process.exit(1);
}

await sharp(src)
  .rotate()
  .webp({ quality: 84, effort: 6, smartSubsample: true })
  .toFile(out);

console.log("Wrote", out);
