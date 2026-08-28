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

// 1. Generate 512x512 Logo SVG for 188Pkr Game
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bgO" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#05241f"/>
      <stop offset="70%" stop-color="#021411"/>
      <stop offset="100%" stop-color="#010a08"/>
    </radialGradient>
    <linearGradient id="teal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00ffdd"/>
      <stop offset="50%" stop-color="#00c9b1"/>
      <stop offset="100%" stop-color="#008f7d"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff099"/>
      <stop offset="30%" stop-color="#f5a623"/>
      <stop offset="70%" stop-color="#d98200"/>
      <stop offset="100%" stop-color="#ffdf59"/>
    </linearGradient>
    <linearGradient id="ruby" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff3366"/>
      <stop offset="50%" stop-color="#d90429"/>
      <stop offset="100%" stop-color="#7a0016"/>
    </linearGradient>
    <filter id="glowTeal">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#00ffdd" flood-opacity="0.5"/>
    </filter>
    <filter id="glowGold">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#f5a623" flood-opacity="0.5"/>
    </filter>
    <filter id="shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
  </defs>

  <!-- Background -->
  <circle cx="256" cy="256" r="256" fill="url(#bgO)"/>
  <circle cx="256" cy="256" r="240" fill="none" stroke="url(#gold)" stroke-width="6"/>
  <circle cx="256" cy="256" r="220" fill="none" stroke="#00c9b1" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="0.4"/>

  <!-- Star Embellishments -->
  <polygon points="256,24 264,48 256,42 248,48" fill="#f5a623"/>
  <polygon points="256,488 264,464 256,470 248,464" fill="#f5a623"/>
  <polygon points="24,256 48,248 42,256 48,264" fill="#f5a623"/>
  <polygon points="488,256 464,248 470,256 464,264" fill="#f5a623"/>

  <!-- Inner Badge Container -->
  <circle cx="256" cy="256" r="175" fill="#020e0c" stroke="url(#gold)" stroke-width="3" filter="url(#shadow)"/>

  <!-- Top Badge Label -->
  <text x="256" y="175" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" text-anchor="middle" fill="url(#gold)" letter-spacing="4">OFFICIAL 2026</text>

  <!-- Brand Number & Name -->
  <text x="256" y="275" font-family="'Impact', system-ui, Arial, sans-serif" font-size="110" font-weight="900" text-anchor="middle" fill="url(#teal)" filter="url(#glowTeal)" letter-spacing="-1">188Pkr</text>

  <!-- Subtitle Pill -->
  <rect x="146" y="300" width="220" height="28" rx="14" fill="url(#ruby)" filter="url(#shadow)"/>
  <text x="256" y="319" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" text-anchor="middle" fill="#ffffff" letter-spacing="2">GAME PAKISTAN</text>

  <!-- Bottom Details -->
  <text x="256" y="365" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" text-anchor="middle" fill="url(#gold)" letter-spacing="3">WINGO • SLOTS • TEEN PATTI</text>
  <text x="256" y="392" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" text-anchor="middle" fill="#00ffdd" letter-spacing="1">⚡ INSTANT JAZZCASH &amp; EASYPAISA</text>
</svg>`;

// 2. Generate 1200x630 OG Banner SVG for 188Pkr Game
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="ogbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#021411"/>
      <stop offset="50%" stop-color="#04201b"/>
      <stop offset="100%" stop-color="#010a08"/>
    </linearGradient>
    <linearGradient id="goldOg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff099"/>
      <stop offset="30%" stop-color="#f5a623"/>
      <stop offset="70%" stop-color="#d98200"/>
      <stop offset="100%" stop-color="#ffdf59"/>
    </linearGradient>
    <linearGradient id="tealOg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00ffdd"/>
      <stop offset="100%" stop-color="#009e8a"/>
    </linearGradient>
    <linearGradient id="ruby" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff3366"/>
      <stop offset="50%" stop-color="#d90429"/>
      <stop offset="100%" stop-color="#7a0016"/>
    </linearGradient>
    <filter id="glowTealOg">
      <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#00ffdd" flood-opacity="0.4"/>
    </filter>
    <filter id="shadow">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#ogbg)"/>

  <!-- Decorative Borders -->
  <rect x="0" y="0" width="8" height="630" fill="url(#goldOg)"/>
  <rect x="1192" y="0" width="8" height="630" fill="url(#goldOg)"/>
  <rect x="0" y="0" width="1200" height="5" fill="url(#goldOg)"/>
  <rect x="0" y="625" width="1200" height="5" fill="url(#goldOg)"/>

  <!-- Subtle Grid -->
  <g stroke="#00c9b1" stroke-width="1" opacity="0.06">
    <line x1="0" y1="210" x2="1200" y2="210"/>
    <line x1="0" y1="420" x2="1200" y2="420"/>
    <line x1="300" y1="0" x2="300" y2="630"/>
    <line x1="600" y1="0" x2="600" y2="630"/>
    <line x1="900" y1="0" x2="900" y2="630"/>
  </g>

  <!-- Left Side Logo Badge -->
  <g transform="translate(300, 315)">
    <circle cx="0" cy="0" r="218" fill="#020e0c" stroke="url(#goldOg)" stroke-width="5" filter="url(#shadow)"/>
    <circle cx="0" cy="0" r="195" fill="none" stroke="#00c9b1" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="0.4"/>

    <text x="0" y="-85" font-family="system-ui, sans-serif" font-size="16" font-weight="800" text-anchor="middle" fill="url(#goldOg)" letter-spacing="4">HOTAPK VERIFIED</text>
    <text x="0" y="25" font-family="'Impact', system-ui, Arial, sans-serif" font-size="115" font-weight="900" text-anchor="middle" fill="url(#tealOg)" filter="url(#glowTealOg)" letter-spacing="-2">188Pkr</text>
    <text x="0" y="75" font-family="system-ui, sans-serif" font-size="18" font-weight="700" text-anchor="middle" fill="url(#goldOg)" letter-spacing="4">WINGO · SLOTS</text>
    <text x="0" y="115" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle" fill="#8a90a4" letter-spacing="3">EARN REAL MONEY</text>
  </g>

  <!-- Right Content -->
  <g transform="translate(620, 150)">
    <rect width="210" height="34" rx="17" fill="url(#ruby)"/>
    <text x="105" y="22" font-family="system-ui, sans-serif" font-size="13" font-weight="800" text-anchor="middle" fill="#ffffff" letter-spacing="2">2026 OFFICIAL APK</text>

    <text x="0" y="90" font-family="'Impact', system-ui, Arial, sans-serif" font-size="64" font-weight="900" fill="#ffffff" letter-spacing="-1">188Pkr Game APK</text>
    <line x1="0" y1="110" x2="500" y2="110" stroke="url(#goldOg)" stroke-width="3"/>

    <text x="0" y="150" font-family="system-ui, sans-serif" font-size="24" font-weight="600" fill="#00ffdd">Wingo Color Prediction &amp; Teen Patti</text>
    <text x="0" y="185" font-family="system-ui, sans-serif" font-size="18" font-weight="400" fill="#a0aab8">Tested 23-Min Payouts • Min Cash-out PKR 300</text>

    <!-- Pills -->
    <g transform="translate(0, 220)">
      <rect width="150" height="40" rx="10" fill="#031a15" stroke="#f5a623" stroke-width="1.5"/>
      <text x="75" y="25" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle" fill="#f5a623">⚡ JazzCash ✓</text>

      <rect x="165" width="150" height="40" rx="10" fill="#031a15" stroke="#00ffdd" stroke-width="1.5"/>
      <text x="240" y="25" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle" fill="#00ffdd">💳 EasyPaisa ✓</text>

      <rect x="330" width="160" height="40" rx="10" fill="#031a15" stroke="#ff3366" stroke-width="1.5"/>
      <text x="410" y="25" font-family="system-ui, sans-serif" font-size="14" font-weight="700" text-anchor="middle" fill="#ff3366">🎁 Rs 500 Bonus</text>
    </g>

    <!-- Download CTA Button Banner -->
    <g transform="translate(0, 290)">
      <rect width="490" height="54" rx="12" fill="url(#goldOg)" filter="url(#shadow)"/>
      <text x="245" y="34" font-family="'Impact', system-ui, Arial, sans-serif" font-size="21" font-weight="900" text-anchor="middle" fill="#020e0c" letter-spacing="1">DOWNLOAD APK – 188PKR.FUN</text>
    </g>
  </g>
</svg>`;

async function build() {
  console.log("Generating 188Pkr Game brand assets...");

  // Write SVGs
  fs.writeFileSync(path.join(OUT_DIR, "188pkr-game-logo.svg"), logoSvg);
  fs.writeFileSync(path.join(OUT_DIR, "okpkr-game-logo.svg"), logoSvg);
  console.log("Saved SVG logos");

  // Rasterize 512x512 logo
  const logoBuffer = await sharp(Buffer.from(logoSvg))
    .resize(512, 512)
    .webp({ quality: 92 })
    .toBuffer();

  fs.writeFileSync(path.join(OUT_DIR, "188pkr-game.webp"), logoBuffer);
  fs.writeFileSync(path.join(OUT_DIR, "okpkr-game.webp"), logoBuffer);
  console.log("Saved 188pkr-game.webp & updated okpkr-game.webp (512x512)");

  // Rasterize 1200x630 OG banner
  const ogBuffer = await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .webp({ quality: 92 })
    .toBuffer();

  fs.writeFileSync(path.join(OUT_DIR, "188pkr-game-og.webp"), ogBuffer);
  fs.writeFileSync(path.join(OUT_DIR, "okpkr-game-og.webp"), ogBuffer);
  console.log("Saved 188pkr-game-og.webp & updated okpkr-game-og.webp (1200x630)");

  console.log("✅ All 188Pkr Game images successfully generated and updated!");
}

build().catch(console.error);
