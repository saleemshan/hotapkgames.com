import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public/content-images");

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// 1. Generate 512x512 Logo SVG for Bro444 Game
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0f2b46"/>
      <stop offset="70%" stop-color="#071524"/>
      <stop offset="100%" stop-color="#02080f"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff275"/>
      <stop offset="30%" stop-color="#f5a623"/>
      <stop offset="70%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#ffea75"/>
    </linearGradient>
    <linearGradient id="cyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f2fe"/>
      <stop offset="100%" stop-color="#4facfe"/>
    </linearGradient>
    <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4facfe"/>
      <stop offset="50%" stop-color="#f5a623"/>
      <stop offset="100%" stop-color="#00f2fe"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="100" fill="url(#bg)"/>
  <rect width="500" height="500" x="6" y="6" rx="94" fill="none" stroke="url(#ring)" stroke-width="4" opacity="0.8"/>
  <circle cx="256" cy="256" r="215" fill="none" stroke="url(#ring)" stroke-width="2" stroke-dasharray="8 6" opacity="0.4"/>

  <!-- Center Badge -->
  <circle cx="256" cy="256" r="185" fill="#08182b" stroke="url(#gold)" stroke-width="3" filter="url(#shadow)"/>
  <circle cx="256" cy="256" r="170" fill="url(#bg)"/>

  <!-- Top Crown / Star -->
  <g transform="translate(256, 125)">
    <polygon points="0,-18 5,-5 18,-5 8,4 12,17 0,9 -12,17 -8,4 -18,-5 -5,-5" fill="url(#gold)"/>
    <circle cx="-35" cy="0" r="4" fill="url(#cyan)"/>
    <circle cx="35" cy="0" r="4" fill="url(#cyan)"/>
  </g>

  <!-- Subtitle TOP -->
  <text x="256" y="175" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="800" text-anchor="middle" fill="#00f2fe" letter-spacing="4">OFFICIAL EARNING APP</text>

  <!-- Main BRO444 Text -->
  <text x="256" y="275" font-family="'Impact', system-ui, sans-serif" font-size="88" font-weight="900" text-anchor="middle" fill="url(#gold)" filter="url(#shadow)" letter-spacing="2">BRO444</text>

  <!-- Subtitle Bottom Pill -->
  <rect x="146" y="305" width="220" height="30" rx="15" fill="url(#cyan)" filter="url(#shadow)"/>
  <text x="256" y="325" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" text-anchor="middle" fill="#041527" letter-spacing="2">GAME PAKISTAN</text>

  <!-- Bottom Details -->
  <text x="256" y="375" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" text-anchor="middle" fill="#94a3b8" letter-spacing="2">SLOTS • TEEN PATTI • COLOR GAME</text>
  <text x="256" y="405" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" text-anchor="middle" fill="#22c55e" letter-spacing="1">⚡ FAST JAZZCASH &amp; EASYPAISA</text>
</svg>`;

// 2. Generate 1200x630 OG Banner SVG for Bro444
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="ogBg" cx="30%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#0f2b46"/>
      <stop offset="60%" stop-color="#071524"/>
      <stop offset="100%" stop-color="#02080f"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff275"/>
      <stop offset="30%" stop-color="#f5a623"/>
      <stop offset="70%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#ffea75"/>
    </linearGradient>
    <linearGradient id="cyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f2fe"/>
      <stop offset="100%" stop-color="#4facfe"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b2238"/>
      <stop offset="100%" stop-color="#05121e"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#ogBg)"/>

  <!-- Left Content -->
  <g transform="translate(100, 140)">
    <rect width="220" height="36" rx="18" fill="url(#cyan)"/>
    <text x="110" y="24" font-family="system-ui, sans-serif" font-size="14" font-weight="800" text-anchor="middle" fill="#041527" letter-spacing="2">2026 OFFICIAL APK</text>

    <text x="0" y="110" font-family="'Impact', system-ui, sans-serif" font-size="78" font-weight="900" fill="url(#gold)" filter="url(#shadow)" letter-spacing="1">BRO444 GAME PAKISTAN</text>

    <text x="0" y="165" font-family="system-ui, sans-serif" font-size="24" font-weight="600" fill="#e2e8f0">Real Money Earning App • Slots &amp; Teen Patti</text>

    <!-- Badge Pills -->
    <g transform="translate(0, 210)">
      <rect width="170" height="42" rx="10" fill="#0b2238" stroke="#f5a623" stroke-width="1.5"/>
      <text x="85" y="26" font-family="system-ui, sans-serif" font-size="15" font-weight="700" text-anchor="middle" fill="#f5a623">⚡ Fast JazzCash</text>

      <rect x="185" width="170" height="42" rx="10" fill="#0b2238" stroke="#00f2fe" stroke-width="1.5"/>
      <text x="270" y="26" font-family="system-ui, sans-serif" font-size="15" font-weight="700" text-anchor="middle" fill="#00f2fe">💳 EasyPaisa Ready</text>

      <rect x="370" width="180" height="42" rx="10" fill="#0b2238" stroke="#22c55e" stroke-width="1.5"/>
      <text x="460" y="26" font-family="system-ui, sans-serif" font-size="15" font-weight="700" text-anchor="middle" fill="#22c55e">🎁 Free Welcome Bonus</text>
    </g>

    <text x="0" y="310" font-family="system-ui, sans-serif" font-size="16" font-weight="500" fill="#94a3b8">Download Latest v1.0.0 APK • Min Withdrawal PKR 500 • HotAPK Games</text>
  </g>

  <!-- Right Logo Badge -->
  <g transform="translate(860, 315)">
    <circle cx="0" cy="0" r="180" fill="url(#cardGrad)" stroke="url(#gold)" stroke-width="4" filter="url(#shadow)"/>
    <circle cx="0" cy="0" r="160" fill="#05121e" stroke="#00f2fe" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.6"/>

    <text x="0" y="-30" font-family="system-ui, sans-serif" font-size="14" font-weight="800" text-anchor="middle" fill="#00f2fe" letter-spacing="3">HOTAPK VERIFIED</text>
    <text x="0" y="40" font-family="'Impact', system-ui, sans-serif" font-size="75" font-weight="900" text-anchor="middle" fill="url(#gold)" letter-spacing="2">BRO444</text>
    <text x="0" y="85" font-family="system-ui, sans-serif" font-size="15" font-weight="700" text-anchor="middle" fill="#22c55e" letter-spacing="3">EARNING APP</text>
  </g>
</svg>`;

async function build() {
  fs.writeFileSync(path.join(OUT_DIR, "bro444-game-logo.svg"), logoSvg);
  console.log("Saved bro444-game-logo.svg");

  // Rasterize logo to 512x512 webp
  await sharp(Buffer.from(logoSvg))
    .resize(512, 512)
    .webp({ quality: 90 })
    .toFile(path.join(OUT_DIR, "bro444-game.webp"));
  console.log("Saved bro444-game.webp");

  // Rasterize OG image to 1200x630 webp
  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .webp({ quality: 90 })
    .toFile(path.join(OUT_DIR, "bro444-game-og.webp"));
  console.log("Saved bro444-game-og.webp");
}

build().catch(console.error);
