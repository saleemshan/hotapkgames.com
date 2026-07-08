/**
 * Build transparent nav logos (light + dark) and favicons from source PNGs.
 * Strips checkerboard / flat gray-white backgrounds baked into exports.
 */
import sharp from "sharp";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const brandDir = resolve(root, "public/images/brand");

const VARIANTS = [
  {
    name: "dark",
    src: resolve(brandDir, "hotapk-games-logo-dark-source.png"),
    out: resolve(brandDir, "hotapk-games-logo-dark.png"),
  },
  {
    name: "light",
    src: resolve(brandDir, "hotapk-games-logo-light-source.png"),
    out: resolve(brandDir, "hotapk-games-logo-light.png"),
  },
];

const iconOut = resolve(root, "app/icon.png");
const appleOut = resolve(root, "app/apple-icon.png");
const legacyOut = resolve(brandDir, "hotapk-games-logo.png");

/** Nav PNG height — circular mark reads well in header. */
const NAV_H = 160;

function rgbDist(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function sampleRgb(data, width, x, y) {
  const i = (y * width + x) * 4;
  return [data[i], data[i + 1], data[i + 2]];
}

function averageEdgeBackground(data, width, height) {
  const pts = [];
  const step = Math.max(1, Math.floor(Math.min(width, height) / 40));
  for (let x = 0; x < width; x += step) {
    pts.push(sampleRgb(data, width, x, 0));
    pts.push(sampleRgb(data, width, x, height - 1));
  }
  for (let y = 0; y < height; y += step) {
    pts.push(sampleRgb(data, width, 0, y));
    pts.push(sampleRgb(data, width, width - 1, y));
  }
  return pts[0].map((_, ci) =>
    Math.round(pts.reduce((sum, p) => sum + p[ci], 0) / pts.length),
  );
}

/** Checkerboard + flat export backgrounds (common in screenshot exports). */
function isBackgroundPixel(r, g, b, x, y, edgeBg) {
  const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
  const l = (r + g + b) / 3;

  if (maxDiff <= 18 && l >= 115 && l <= 252) return true;
  if (rgbDist([r, g, b], edgeBg) < 42) return true;

  const tile = 8;
  const checkerLight = (Math.floor(x / tile) + Math.floor(y / tile)) % 2 === 0;
  if (maxDiff <= 12) {
    if (checkerLight && l >= 200) return true;
    if (!checkerLight && l >= 155 && l <= 210) return true;
  }
  return false;
}

function removeBackground(data, width, height) {
  const edgeBg = averageEdgeBackground(data, width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (isBackgroundPixel(r, g, b, x, y, edgeBg)) data[i + 3] = 0;
    }
  }
}

async function processSource(src, out) {
  if (!existsSync(src)) {
    console.error("Missing:", src);
    process.exit(1);
  }

  const { data, info } = await sharp(src)
    .ensureAlpha()
    .rotate()
    .raw()
    .toBuffer({ resolveWithObject: true });

  if (info.channels !== 4) {
    console.error("Expected RGBA:", src);
    process.exit(1);
  }

  removeBackground(data, info.width, info.height);

  const trimmed = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .trim({ threshold: 10 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  await sharp(trimmed)
    .resize({ height: NAV_H, fit: "inside" })
    .png({ compressionLevel: 9 })
    .toFile(out);

  const meta = await sharp(out).metadata();
  console.log("nav", out, `${meta.width}x${meta.height}`);
  return trimmed;
}

let darkTrimmed = null;
for (const v of VARIANTS) {
  const trimmed = await processSource(v.src, v.out);
  if (v.name === "dark") darkTrimmed = trimmed;
}

if (darkTrimmed) {
  await sharp(darkTrimmed).png().toFile(legacyOut);
  await sharp(darkTrimmed)
    .resize(512, 512, {
      fit: "contain",
      position: "centre",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(iconOut);
  await sharp(darkTrimmed)
    .resize(180, 180, {
      fit: "contain",
      position: "centre",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(appleOut);
  console.log("icon", iconOut);
  console.log("apple", appleOut);
  console.log("legacy", legacyOut);
}
