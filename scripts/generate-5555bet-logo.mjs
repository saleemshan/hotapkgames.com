import sharp from 'sharp';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentImagesDir = path.join(__dirname, '..', 'public', 'content-images');
const ogDir            = path.join(__dirname, '..', 'public', 'og');

// ─── HELPER: delete if exists ─────────────────────────────────────────────────
function remove(fp) {
  if (existsSync(fp)) { unlinkSync(fp); console.log(`🗑️  Deleted: ${path.basename(fp)}`); }
  else                 { console.log(`⚠️  Not found (skip): ${path.basename(fp)}`); }
}

// ─── HELPER: svg → webp ───────────────────────────────────────────────────────
async function toWebp(svgStr, outPath, w, h) {
  await sharp(Buffer.from(svgStr)).resize(w, h).webp({ quality: 90 }).toFile(outPath);
  console.log(`✅ ${path.basename(outPath)} (${w}×${h})`);
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. 5555BET — delete old PNG, generate new WebP
// ══════════════════════════════════════════════════════════════════════════════
console.log('\n── 5555Bet ─────────────────────────────────');
remove(path.join(contentImagesDir, 'b49bf264f01e6949.png'));

const svg5555Logo = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e0a0a"/>
      <stop offset="100%" stop-color="#0d0505"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe066"/>
      <stop offset="50%" stop-color="#f5a623"/>
      <stop offset="100%" stop-color="#c47f0d"/>
    </linearGradient>
    <linearGradient id="red" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6b6b"/>
      <stop offset="100%" stop-color="#8b0000"/>
    </linearGradient>
    <filter id="glow">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#f5a623" flood-opacity="0.55"/>
    </filter>
  </defs>
  <circle cx="256" cy="256" r="256" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="240" fill="none" stroke="url(#gold)" stroke-width="8"/>
  <circle cx="256" cy="256" r="220" fill="none" stroke="#f5a623" stroke-width="1.5" stroke-opacity="0.3"/>
  <polygon points="256,26 264,52 256,46 248,52" fill="#f5a623" opacity="0.9"/>
  <polygon points="256,486 264,460 256,466 248,460" fill="#f5a623" opacity="0.9"/>
  <polygon points="26,256 52,248 46,256 52,264" fill="#f5a623" opacity="0.9"/>
  <polygon points="486,256 460,248 466,256 460,264" fill="#f5a623" opacity="0.9"/>
  <g fill="#f5a623" opacity="0.4">
    <polygon points="82,82 90,96 82,90 74,96"/>
    <polygon points="430,82 438,96 430,90 422,96"/>
    <polygon points="82,430 90,416 82,422 74,416"/>
    <polygon points="430,430 438,416 430,422 422,416"/>
  </g>
  <g stroke="#8b0000" stroke-width="0.8" opacity="0.1">
    <line x1="0" y1="128" x2="512" y2="128"/>
    <line x1="0" y1="256" x2="512" y2="256"/>
    <line x1="0" y1="384" x2="512" y2="384"/>
    <line x1="128" y1="0" x2="128" y2="512"/>
    <line x1="256" y1="0" x2="256" y2="512"/>
    <line x1="384" y1="0" x2="384" y2="512"/>
  </g>
  <circle cx="256" cy="256" r="170" fill="#180808" fill-opacity="0.85"/>
  <text x="256" y="198" font-family="Arial,sans-serif" font-size="17" font-weight="500" text-anchor="middle" fill="#f5a623" fill-opacity="0.7" letter-spacing="5">OFFICIAL</text>
  <text x="256" y="268" font-family="'Arial Black',Arial,sans-serif" font-size="120" font-weight="900" text-anchor="middle" fill="url(#gold)" filter="url(#glow)" letter-spacing="-6">5555</text>
  <text x="256" y="314" font-family="Arial,sans-serif" font-size="28" font-weight="700" text-anchor="middle" fill="url(#red)" letter-spacing="12">BET</text>
  <line x1="186" y1="326" x2="326" y2="326" stroke="#f5a623" stroke-width="1.5" stroke-opacity="0.4"/>
  <text x="256" y="352" font-family="Arial,sans-serif" font-size="16" text-anchor="middle" fill="#8a90a4" letter-spacing="4">EARN &amp; WIN</text>
</svg>`;

const og5555 = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="ogbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d0505"/>
      <stop offset="100%" stop-color="#180808"/>
    </linearGradient>
    <linearGradient id="goldOg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe066"/>
      <stop offset="50%" stop-color="#f5a623"/>
      <stop offset="100%" stop-color="#c47f0d"/>
    </linearGradient>
    <linearGradient id="redOg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6b6b"/>
      <stop offset="100%" stop-color="#8b0000"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#ogbg)"/>
  <g stroke="#8b0000" stroke-width="1" opacity="0.08">
    <line x1="0" y1="210" x2="1200" y2="210"/><line x1="0" y1="420" x2="1200" y2="420"/>
    <line x1="300" y1="0" x2="300" y2="630"/><line x1="600" y1="0" x2="600" y2="630"/><line x1="900" y1="0" x2="900" y2="630"/>
  </g>
  <rect x="0" y="0" width="8" height="630" fill="url(#goldOg)"/>
  <rect x="1192" y="0" width="8" height="630" fill="url(#goldOg)"/>
  <rect x="0" y="0" width="1200" height="5" fill="url(#goldOg)"/>
  <rect x="0" y="625" width="1200" height="5" fill="url(#goldOg)"/>
  <circle cx="300" cy="315" r="218" fill="#180808" stroke="url(#goldOg)" stroke-width="5"/>
  <text x="300" y="350" font-family="'Arial Black',Arial,sans-serif" font-size="120" font-weight="900" text-anchor="middle" fill="url(#goldOg)" letter-spacing="-6">5555</text>
  <text x="300" y="396" font-family="Arial,sans-serif" font-size="28" font-weight="700" text-anchor="middle" fill="url(#redOg)" letter-spacing="12">BET</text>
  <text x="680" y="228" font-family="'Arial Black',Arial,sans-serif" font-size="68" font-weight="900" fill="#e8eaf0" letter-spacing="-2">5555 Bet Game</text>
  <line x1="680" y1="252" x2="1140" y2="252" stroke="url(#goldOg)" stroke-width="3"/>
  <text x="680" y="306" font-family="Arial,sans-serif" font-size="27" fill="#8a90a4">Color Prediction &amp; Slots</text>
  <text x="680" y="350" font-family="Arial,sans-serif" font-size="27" fill="#8a90a4">Earn Real Money — Pakistan</text>
  <rect x="680" y="388" width="156" height="44" rx="22" fill="#e02020" fill-opacity="0.15" stroke="#e02020" stroke-width="1.5"/>
  <text x="758" y="416" font-family="Arial,sans-serif" font-size="18" text-anchor="middle" fill="#ff6b6b">Wingo</text>
  <rect x="852" y="388" width="136" height="44" rx="22" fill="#f5a623" fill-opacity="0.15" stroke="#f5a623" stroke-width="1.5"/>
  <text x="920" y="416" font-family="Arial,sans-serif" font-size="18" text-anchor="middle" fill="#f5a623">Slots</text>
  <rect x="1004" y="388" width="136" height="44" rx="22" fill="#f5a623" fill-opacity="0.15" stroke="#f5a623" stroke-width="1.5"/>
  <text x="1072" y="416" font-family="Arial,sans-serif" font-size="18" text-anchor="middle" fill="#f5a623">Casino</text>
  <rect x="680" y="452" width="200" height="44" rx="22" fill="#3d72f5" fill-opacity="0.15" stroke="#3d72f5" stroke-width="1.5"/>
  <text x="780" y="480" font-family="Arial,sans-serif" font-size="17" text-anchor="middle" fill="#3d72f5">JazzCash ✓</text>
  <rect x="896" y="452" width="220" height="44" rx="22" fill="#22c55e" fill-opacity="0.12" stroke="#22c55e" stroke-width="1.5"/>
  <text x="1006" y="480" font-family="Arial,sans-serif" font-size="17" text-anchor="middle" fill="#22c55e">EasyPaisa ✓</text>
  <rect x="680" y="526" width="460" height="58" rx="12" fill="url(#goldOg)"/>
  <text x="910" y="562" font-family="'Arial Black',Arial,sans-serif" font-size="22" font-weight="900" text-anchor="middle" fill="#0d0505">Download APK – 5555pk1.com</text>
</svg>`;

writeFileSync(path.join(contentImagesDir, '5555bet-game-logo.svg'), svg5555Logo);
await toWebp(svg5555Logo, path.join(contentImagesDir, '5555bet-game.webp'), 512, 512);
await toWebp(og5555, path.join(contentImagesDir, '5555bet-game-og.webp'), 1200, 630);

// ══════════════════════════════════════════════════════════════════════════════
// 2. OKPKR — delete old PNG from /og/, generate new WebP
// ══════════════════════════════════════════════════════════════════════════════
console.log('\n── OkPkr ───────────────────────────────────');
remove(path.join(ogDir, 'okpkr-game.png'));

// OkPkr color scheme: deep teal/green + gold — fresh, confident, modern
const svgOkpkrLogo = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bgO" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#051e1a"/>
      <stop offset="100%" stop-color="#020e0c"/>
    </radialGradient>
    <linearGradient id="teal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00e5cc"/>
      <stop offset="50%" stop-color="#00b59e"/>
      <stop offset="100%" stop-color="#007a6e"/>
    </linearGradient>
    <linearGradient id="goldO" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe066"/>
      <stop offset="50%" stop-color="#f5a623"/>
      <stop offset="100%" stop-color="#c47f0d"/>
    </linearGradient>
    <filter id="glowO">
      <feDropShadow dx="0" dy="0" stdDeviation="7" flood-color="#00e5cc" flood-opacity="0.5"/>
    </filter>
    <filter id="glowGoldO">
      <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#f5a623" flood-opacity="0.45"/>
    </filter>
  </defs>
  <circle cx="256" cy="256" r="256" fill="url(#bgO)"/>
  <circle cx="256" cy="256" r="240" fill="none" stroke="url(#goldO)" stroke-width="8"/>
  <circle cx="256" cy="256" r="220" fill="none" stroke="#00b59e" stroke-width="1.5" stroke-opacity="0.35"/>
  <polygon points="256,26 264,52 256,46 248,52" fill="#f5a623" opacity="0.9"/>
  <polygon points="256,486 264,460 256,466 248,460" fill="#f5a623" opacity="0.9"/>
  <polygon points="26,256 52,248 46,256 52,264" fill="#f5a623" opacity="0.9"/>
  <polygon points="486,256 460,248 466,256 460,264" fill="#f5a623" opacity="0.9"/>
  <g fill="#f5a623" opacity="0.4">
    <polygon points="82,82 90,96 82,90 74,96"/>
    <polygon points="430,82 438,96 430,90 422,96"/>
    <polygon points="82,430 90,416 82,422 74,416"/>
    <polygon points="430,430 438,416 430,422 422,416"/>
  </g>
  <g stroke="#00b59e" stroke-width="0.8" opacity="0.1">
    <line x1="0" y1="128" x2="512" y2="128"/>
    <line x1="0" y1="256" x2="512" y2="256"/>
    <line x1="0" y1="384" x2="512" y2="384"/>
    <line x1="128" y1="0" x2="128" y2="512"/>
    <line x1="256" y1="0" x2="256" y2="512"/>
    <line x1="384" y1="0" x2="384" y2="512"/>
  </g>
  <circle cx="256" cy="256" r="170" fill="#030f0d" fill-opacity="0.88"/>
  <text x="256" y="198" font-family="Arial,sans-serif" font-size="17" font-weight="500" text-anchor="middle" fill="#f5a623" fill-opacity="0.7" letter-spacing="5">OFFICIAL</text>
  <text x="256" y="274" font-family="'Arial Black',Arial,sans-serif" font-size="104" font-weight="900" text-anchor="middle" fill="url(#teal)" filter="url(#glowO)" letter-spacing="-3">OkPkr</text>
  <text x="256" y="316" font-family="Arial,sans-serif" font-size="20" font-weight="600" text-anchor="middle" fill="url(#goldO)" filter="url(#glowGoldO)" letter-spacing="4">WINGO · SLOTS</text>
  <line x1="176" y1="330" x2="336" y2="330" stroke="#00b59e" stroke-width="1.5" stroke-opacity="0.5"/>
  <text x="256" y="356" font-family="Arial,sans-serif" font-size="16" text-anchor="middle" fill="#8a90a4" letter-spacing="4">EARN &amp; WIN</text>
</svg>`;

const ogOkpkr = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="ogbgO" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020e0c"/>
      <stop offset="100%" stop-color="#051e1a"/>
    </linearGradient>
    <linearGradient id="goldOgO" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe066"/>
      <stop offset="50%" stop-color="#f5a623"/>
      <stop offset="100%" stop-color="#c47f0d"/>
    </linearGradient>
    <linearGradient id="tealOg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00e5cc"/>
      <stop offset="100%" stop-color="#007a6e"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#ogbgO)"/>
  <g stroke="#00b59e" stroke-width="1" opacity="0.07">
    <line x1="0" y1="210" x2="1200" y2="210"/><line x1="0" y1="420" x2="1200" y2="420"/>
    <line x1="300" y1="0" x2="300" y2="630"/><line x1="600" y1="0" x2="600" y2="630"/><line x1="900" y1="0" x2="900" y2="630"/>
  </g>
  <rect x="0" y="0" width="8" height="630" fill="url(#goldOgO)"/>
  <rect x="1192" y="0" width="8" height="630" fill="url(#goldOgO)"/>
  <rect x="0" y="0" width="1200" height="5" fill="url(#goldOgO)"/>
  <rect x="0" y="625" width="1200" height="5" fill="url(#goldOgO)"/>
  <circle cx="300" cy="315" r="218" fill="#030f0d" stroke="url(#goldOgO)" stroke-width="5"/>
  <text x="300" y="348" font-family="'Arial Black',Arial,sans-serif" font-size="100" font-weight="900" text-anchor="middle" fill="url(#tealOg)" letter-spacing="-3">OkPkr</text>
  <text x="300" y="392" font-family="Arial,sans-serif" font-size="22" font-weight="600" text-anchor="middle" fill="url(#goldOgO)" letter-spacing="4">WINGO · SLOTS</text>
  <text x="680" y="228" font-family="'Arial Black',Arial,sans-serif" font-size="68" font-weight="900" fill="#e8eaf0" letter-spacing="-2">OkPkr Game</text>
  <line x1="680" y1="252" x2="1140" y2="252" stroke="url(#goldOgO)" stroke-width="3"/>
  <text x="680" y="306" font-family="Arial,sans-serif" font-size="27" fill="#8a90a4">Wingo Color Prediction</text>
  <text x="680" y="350" font-family="Arial,sans-serif" font-size="27" fill="#8a90a4">Earn Real Money — Pakistan</text>
  <rect x="680" y="388" width="156" height="44" rx="22" fill="#00b59e" fill-opacity="0.15" stroke="#00e5cc" stroke-width="1.5"/>
  <text x="758" y="416" font-family="Arial,sans-serif" font-size="18" text-anchor="middle" fill="#00e5cc">Wingo</text>
  <rect x="852" y="388" width="180" height="44" rx="22" fill="#f5a623" fill-opacity="0.15" stroke="#f5a623" stroke-width="1.5"/>
  <text x="942" y="416" font-family="Arial,sans-serif" font-size="18" text-anchor="middle" fill="#f5a623">Teen Patti</text>
  <rect x="1048" y="388" width="100" height="44" rx="22" fill="#f5a623" fill-opacity="0.15" stroke="#f5a623" stroke-width="1.5"/>
  <text x="1098" y="416" font-family="Arial,sans-serif" font-size="18" text-anchor="middle" fill="#f5a623">Slots</text>
  <rect x="680" y="452" width="200" height="44" rx="22" fill="#3d72f5" fill-opacity="0.15" stroke="#3d72f5" stroke-width="1.5"/>
  <text x="780" y="480" font-family="Arial,sans-serif" font-size="17" text-anchor="middle" fill="#3d72f5">JazzCash ✓</text>
  <rect x="896" y="452" width="220" height="44" rx="22" fill="#22c55e" fill-opacity="0.12" stroke="#22c55e" stroke-width="1.5"/>
  <text x="1006" y="480" font-family="Arial,sans-serif" font-size="17" text-anchor="middle" fill="#22c55e">EasyPaisa ✓</text>
  <rect x="680" y="526" width="460" height="58" rx="12" fill="url(#goldOgO)"/>
  <text x="910" y="562" font-family="'Arial Black',Arial,sans-serif" font-size="22" font-weight="900" text-anchor="middle" fill="#020e0c">Download APK – okpkr1.com</text>
</svg>`;

writeFileSync(path.join(contentImagesDir, 'okpkr-game-logo.svg'), svgOkpkrLogo);
await toWebp(svgOkpkrLogo, path.join(contentImagesDir, 'okpkr-game.webp'), 512, 512);
await toWebp(ogOkpkr, path.join(contentImagesDir, 'okpkr-game-og.webp'), 1200, 630);

console.log('\n✅ All images generated and old files deleted!');
