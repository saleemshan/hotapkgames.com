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

// 1. Generate 512x512 Logo SVG
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2d0a16"/>
      <stop offset="70%" stop-color="#140409"/>
      <stop offset="100%" stop-color="#080104"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff099"/>
      <stop offset="30%" stop-color="#f5a623"/>
      <stop offset="70%" stop-color="#e08a00"/>
      <stop offset="100%" stop-color="#ffdf59"/>
    </linearGradient>
    <linearGradient id="ruby" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff3366"/>
      <stop offset="50%" stop-color="#d90429"/>
      <stop offset="100%" stop-color="#7a0016"/>
    </linearGradient>
    <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffdf59"/>
      <stop offset="50%" stop-color="#f5a623"/>
      <stop offset="100%" stop-color="#995c00"/>
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
  <circle cx="256" cy="256" r="185" fill="#1b060d" stroke="url(#gold)" stroke-width="3" filter="url(#shadow)"/>
  <circle cx="256" cy="256" r="170" fill="url(#bg)"/>

  <!-- Top Crown / Star -->
  <g transform="translate(256, 130)">
    <polygon points="0,-18 5,-5 18,-5 8,4 12,17 0,9 -12,17 -8,4 -18,-5 -5,-5" fill="url(#gold)"/>
    <circle cx="-35" cy="0" r="4" fill="url(#gold)"/>
    <circle cx="35" cy="0" r="4" fill="url(#gold)"/>
  </g>

  <!-- Subtitle TOP -->
  <text x="256" y="180" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" text-anchor="middle" fill="#ffb703" letter-spacing="4">OFFICIAL APK</text>

  <!-- Main 3RR Text -->
  <text x="256" y="290" font-family="'Impact', system-ui, sans-serif" font-size="125" font-weight="900" text-anchor="middle" fill="url(#gold)" filter="url(#shadow)" letter-spacing="2">3RR</text>

  <!-- Subtitle Bottom -->
  <rect x="156" y="315" width="200" height="28" rx="14" fill="url(#ruby)" filter="url(#shadow)"/>
  <text x="256" y="334" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" text-anchor="middle" fill="#ffffff" letter-spacing="2">GAME PAKISTAN</text>

  <!-- Bottom Details -->
  <text x="256" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" text-anchor="middle" fill="#a0808a" letter-spacing="2">SLOTS • TEEN PATTI • WINGO</text>
  <text x="256" y="405" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" text-anchor="middle" fill="#2ec4b6" letter-spacing="1">⚡ INSTANT JAZZCASH &amp; EASYPAISA</text>
</svg>`;

// 2. Generate 1200x630 OG Banner SVG
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="ogBg" cx="30%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#2a0814"/>
      <stop offset="60%" stop-color="#120308"/>
      <stop offset="100%" stop-color="#050103"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff099"/>
      <stop offset="30%" stop-color="#f5a623"/>
      <stop offset="70%" stop-color="#e08a00"/>
      <stop offset="100%" stop-color="#ffdf59"/>
    </linearGradient>
    <linearGradient id="ruby" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff3366"/>
      <stop offset="50%" stop-color="#d90429"/>
      <stop offset="100%" stop-color="#7a0016"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1f0710"/>
      <stop offset="100%" stop-color="#100308"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#ogBg)"/>

  <!-- Left Content -->
  <g transform="translate(100, 140)">
    <rect width="210" height="36" rx="18" fill="url(#ruby)"/>
    <text x="105" y="24" font-family="system-ui, sans-serif" font-size="14" font-weight="800" text-anchor="middle" fill="#ffffff" letter-spacing="2">2026 OFFICIAL APK</text>

    <text x="0" y="110" font-family="'Impact', system-ui, sans-serif" font-size="78" font-weight="900" fill="url(#gold)" filter="url(#shadow)" letter-spacing="1">3RR GAME PAKISTAN</text>

    <text x="0" y="165" font-family="system-ui, sans-serif" font-size="24" font-weight="600" fill="#e8d5db">Real Money Casino &amp; Color Prediction App</text>

    <!-- Badge Pills -->
    <g transform="translate(0, 210)">
      <rect width="170" height="42" rx="10" fill="#1f0710" stroke="#f5a623" stroke-width="1.5"/>
      <text x="85" y="26" font-family="system-ui, sans-serif" font-size="15" font-weight="700" text-anchor="middle" fill="#f5a623">⚡ Fast JazzCash</text>

      <rect x="185" width="170" height="42" rx="10" fill="#1f0710" stroke="#2ec4b6" stroke-width="1.5"/>
      <text x="270" y="26" font-family="system-ui, sans-serif" font-size="15" font-weight="700" text-anchor="middle" fill="#2ec4b6">💳 EasyPaisa Ready</text>

      <rect x="370" width="180" height="42" rx="10" fill="#1f0710" stroke="#ff3366" stroke-width="1.5"/>
      <text x="460" y="26" font-family="system-ui, sans-serif" font-size="15" font-weight="700" text-anchor="middle" fill="#ff3366">🎁 Rs 1000 Bonus</text>
    </g>

    <text x="0" y="310" font-family="system-ui, sans-serif" font-size="16" font-weight="500" fill="#8f737c">Download Latest v1.0.0 APK • Min Withdrawal PKR 500 • HotAPK Games</text>
  </g>

  <!-- Right Logo Badge -->
  <g transform="translate(860, 315)">
    <circle cx="0" cy="0" r="180" fill="url(#cardGrad)" stroke="url(#gold)" stroke-width="4" filter="url(#shadow)"/>
    <circle cx="0" cy="0" r="160" fill="#15040a" stroke="#f5a623" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.6"/>

    <text x="0" y="-30" font-family="system-ui, sans-serif" font-size="14" font-weight="800" text-anchor="middle" fill="#f5a623" letter-spacing="3">HOTAPK VERIFIED</text>
    <text x="0" y="45" font-family="'Impact', system-ui, sans-serif" font-size="95" font-weight="900" text-anchor="middle" fill="url(#gold)" letter-spacing="2">3RR</text>
    <text x="0" y="85" font-family="system-ui, sans-serif" font-size="16" font-weight="700" text-anchor="middle" fill="#ff3366" letter-spacing="3">EARNING APP</text>
  </g>
</svg>`;

async function build() {
  fs.writeFileSync(path.join(OUT_DIR, "3rr-game-logo.svg"), logoSvg);
  console.log("Saved 3rr-game-logo.svg");

  // Rasterize logo to 512x512 webp
  await sharp(Buffer.from(logoSvg))
    .resize(512, 512)
    .webp({ quality: 90 })
    .toFile(path.join(OUT_DIR, "3rr-game.webp"));
  console.log("Saved 3rr-game.webp");

  // Rasterize OG image to 1200x630 webp
  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .webp({ quality: 90 })
    .toFile(path.join(OUT_DIR, "3rr-game-og.webp"));
  console.log("Saved 3rr-game-og.webp");
}

build().catch(console.error);
