import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "public", "content-images");

async function toWebp(svg, outPath, w, h) {
  await sharp(Buffer.from(svg)).resize(w, h).webp({ quality: 90 }).toFile(outPath);
  console.log("saved", path.basename(outPath), `${w}x${h}`);
}

function logoSvg({
  slug,
  mark,
  markSize,
  sub,
  bg0,
  bg1,
  accent,
  accent2,
  ink,
}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="${slug}-bg" cx="50%" cy="42%" r="70%">
      <stop offset="0%" stop-color="${bg0}"/>
      <stop offset="100%" stop-color="${bg1}"/>
    </radialGradient>
    <linearGradient id="${slug}-acc" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="${accent2}"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#${slug}-bg)"/>
  <rect x="14" y="14" width="484" height="484" rx="84" fill="none" stroke="url(#${slug}-acc)" stroke-width="6"/>
  <circle cx="256" cy="256" r="198" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.28"/>
  <text x="256" y="292" font-family="Arial Black, Arial, sans-serif" font-size="${markSize}" font-weight="900" text-anchor="middle" fill="url(#${slug}-acc)" letter-spacing="-2">${mark}</text>
  <text x="256" y="348" font-family="Arial, sans-serif" font-size="22" font-weight="700" text-anchor="middle" fill="${ink}" letter-spacing="5">${sub}</text>
</svg>`;
}

function ogSvg({
  slug,
  title,
  line,
  mark,
  markSize,
  bg0,
  bg1,
  accent,
  accent2,
}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="${slug}-ogbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg0}"/>
    </linearGradient>
    <linearGradient id="${slug}-ogacc" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="${accent2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#${slug}-ogbg)"/>
  <rect x="0" y="0" width="1200" height="8" fill="url(#${slug}-ogacc)"/>
  <rect x="0" y="622" width="1200" height="8" fill="url(#${slug}-ogacc)"/>
  <circle cx="250" cy="315" r="168" fill="${bg1}" stroke="url(#${slug}-ogacc)" stroke-width="6"/>
  <text x="250" y="340" font-family="Arial Black, Arial, sans-serif" font-size="${markSize}" font-weight="900" text-anchor="middle" fill="url(#${slug}-ogacc)" letter-spacing="-2">${mark}</text>
  <text x="500" y="250" font-family="Arial Black, Arial, sans-serif" font-size="64" font-weight="900" fill="#f4f6fb">${title}</text>
  <line x1="500" y1="278" x2="1120" y2="278" stroke="url(#${slug}-ogacc)" stroke-width="3"/>
  <text x="500" y="340" font-family="Arial, sans-serif" font-size="28" fill="#9aa3b8">${line}</text>
  <text x="500" y="392" font-family="Arial, sans-serif" font-size="22" fill="#7b8499">JazzCash · EasyPaisa · Android APK</text>
  <rect x="500" y="440" width="420" height="56" rx="12" fill="url(#${slug}-ogacc)"/>
  <text x="710" y="476" font-family="Arial Black, Arial, sans-serif" font-size="22" font-weight="900" text-anchor="middle" fill="${bg1}">Download APK</text>
</svg>`;
}

const games = [
  {
    slug: "h555-game",
    title: "H555 Game",
    mark: "H555",
    markSize: 118,
    ogMarkSize: 72,
    sub: "GAME APK",
    line: "Cards, slots, and a rupee cashier",
    bg0: "#123a44",
    bg1: "#06161b",
    accent: "#5eead4",
    accent2: "#14b8a6",
    ink: "#99f6e4",
  },
  {
    slug: "done999-game",
    title: "Done999 Game",
    mark: "D999",
    markSize: 112,
    ogMarkSize: 68,
    sub: "DONE999",
    line: "Slots and cards hub for Pakistan",
    bg0: "#3b1d63",
    bg1: "#140824",
    accent: "#d8b4fe",
    accent2: "#a855f7",
    ink: "#e9d5ff",
  },
  {
    slug: "pk1947-game",
    title: "PK1947 Game",
    mark: "1947",
    markSize: 108,
    ogMarkSize: 64,
    sub: "PK1947",
    line: "Slots, live tables, and local wallets",
    bg0: "#14532d",
    bg1: "#052e16",
    accent: "#86efac",
    accent2: "#22c55e",
    ink: "#bbf7d0",
  },
  {
    slug: "k666-game",
    title: "K666 Game",
    mark: "K666",
    markSize: 118,
    ogMarkSize: 70,
    sub: "GAME APK",
    line: "Sideloaded casino hub — compare the file",
    bg0: "#4a0510",
    bg1: "#1a0206",
    accent: "#fca5a5",
    accent2: "#ef4444",
    ink: "#fecaca",
  },
  {
    slug: "x666-game",
    title: "X666 Game",
    mark: "X666",
    markSize: 118,
    ogMarkSize: 70,
    sub: "GAME APK",
    line: "Hub APK with lookalike download domains",
    bg0: "#1e1b4b",
    bg1: "#0b0a24",
    accent: "#a5b4fc",
    accent2: "#6366f1",
    ink: "#c7d2fe",
  },
  {
    slug: "win786-game",
    title: "Win786 Game",
    mark: "W786",
    markSize: 112,
    ogMarkSize: 68,
    sub: "WIN786",
    line: "Colour rounds, slots, JazzCash cashier",
    bg0: "#422006",
    bg1: "#1c0b02",
    accent: "#fcd34d",
    accent2: "#f59e0b",
    ink: "#fde68a",
  },
  {
    slug: "s1gem-game",
    title: "S1 Gem Game",
    mark: "S1",
    markSize: 140,
    ogMarkSize: 86,
    sub: "S1 GEM",
    line: "S1 Game lobby — slots and cards",
    bg0: "#064e3b",
    bg1: "#022c22",
    accent: "#6ee7b7",
    accent2: "#10b981",
    ink: "#a7f3d0",
  },
];

for (const g of games) {
  const cover = logoSvg(g);
  const og = ogSvg({ ...g, markSize: g.ogMarkSize });
  writeFileSync(path.join(OUT, `${g.slug}-logo.svg`), cover);
  await toWebp(cover, path.join(OUT, `${g.slug}.webp`), 512, 512);
  await toWebp(og, path.join(OUT, `${g.slug}-og.webp`), 1200, 630);
}

console.log("done");
