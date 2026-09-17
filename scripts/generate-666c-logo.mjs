import sharp from 'sharp';
import { writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentImagesDir = path.join(__dirname, '..', 'public', 'content-images');

// ─── HELPER: svg → webp ───────────────────────────────────────────────────────
async function toWebp(svgStr, outPath, w, h) {
  await sharp(Buffer.from(svgStr)).resize(w, h).webp({ quality: 90 }).toFile(outPath);
  console.log(`✅ ${path.basename(outPath)} (${w}×${h})`);
}

// ══════════════════════════════════════════════════════════════════════════════
// 666C — Generate Logo + OG Image
// Color scheme: deep crimson/maroon + gold (distinct from other logos)
// ══════════════════════════════════════════════════════════════════════════════
console.log('\n── 666C Game ─────────────────────────────────');

const svg666cLogo = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1a0505"/>
      <stop offset="100%" stop-color="#0a0202"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe066"/>
      <stop offset="50%" stop-color="#f5a623"/>
      <stop offset="100%" stop-color="#c47f0d"/>
    </linearGradient>
    <linearGradient id="crimson" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff4444"/>
      <stop offset="50%" stop-color="#cc1100"/>
      <stop offset="100%" stop-color="#8b0000"/>
    </linearGradient>
    <linearGradient id="crimsonLight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6b6b"/>
      <stop offset="100%" stop-color="#cc2200"/>
    </linearGradient>
    <filter id="glow">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#f5a623" flood-opacity="0.6"/>
    </filter>
    <filter id="glowRed">
      <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#cc1100" flood-opacity="0.45"/>
    </filter>
  </defs>
  <!-- Background circle -->
  <circle cx="256" cy="256" r="256" fill="url(#bg)"/>
  <!-- Outer gold ring -->
  <circle cx="256" cy="256" r="240" fill="none" stroke="url(#gold)" stroke-width="8"/>
  <!-- Inner accent ring -->
  <circle cx="256" cy="256" r="220" fill="none" stroke="#cc1100" stroke-width="1.5" stroke-opacity="0.35"/>
  <!-- Cardinal point diamonds -->
  <polygon points="256,26 264,52 256,46 248,52" fill="#f5a623" opacity="0.9"/>
  <polygon points="256,486 264,460 256,466 248,460" fill="#f5a623" opacity="0.9"/>
  <polygon points="26,256 52,248 46,256 52,264" fill="#f5a623" opacity="0.9"/>
  <polygon points="486,256 460,248 466,256 460,264" fill="#f5a623" opacity="0.9"/>
  <!-- Corner diamonds -->
  <g fill="#f5a623" opacity="0.4">
    <polygon points="82,82 90,96 82,90 74,96"/>
    <polygon points="430,82 438,96 430,90 422,96"/>
    <polygon points="82,430 90,416 82,422 74,416"/>
    <polygon points="430,430 438,416 430,422 422,416"/>
  </g>
  <!-- Grid lines -->
  <g stroke="#8b0000" stroke-width="0.8" opacity="0.1">
    <line x1="0" y1="128" x2="512" y2="128"/>
    <line x1="0" y1="256" x2="512" y2="256"/>
    <line x1="0" y1="384" x2="512" y2="384"/>
    <line x1="128" y1="0" x2="128" y2="512"/>
    <line x1="256" y1="0" x2="256" y2="512"/>
    <line x1="384" y1="0" x2="384" y2="512"/>
  </g>
  <!-- Inner dark circle -->
  <circle cx="256" cy="256" r="170" fill="#120404" fill-opacity="0.88"/>
  <!-- OFFICIAL label -->
  <text x="256" y="194" font-family="Arial,sans-serif" font-size="17" font-weight="500" text-anchor="middle" fill="#f5a623" fill-opacity="0.7" letter-spacing="5">OFFICIAL</text>
  <!-- Main brand text -->
  <text x="256" y="272" font-family="'Arial Black',Arial,sans-serif" font-size="116" font-weight="900" text-anchor="middle" fill="url(#gold)" filter="url(#glow)" letter-spacing="-4">666C</text>
  <!-- Subtitle -->
  <text x="256" y="314" font-family="Arial,sans-serif" font-size="20" font-weight="600" text-anchor="middle" fill="url(#crimsonLight)" filter="url(#glowRed)" letter-spacing="4">SLOTS · CASINO</text>
  <!-- Divider line -->
  <line x1="176" y1="328" x2="336" y2="328" stroke="#f5a623" stroke-width="1.5" stroke-opacity="0.4"/>
  <!-- Footer text -->
  <text x="256" y="354" font-family="Arial,sans-serif" font-size="16" text-anchor="middle" fill="#8a90a4" letter-spacing="4">EARN &amp; WIN</text>
</svg>`;

const og666c = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="ogbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0202"/>
      <stop offset="100%" stop-color="#1a0505"/>
    </linearGradient>
    <linearGradient id="goldOg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe066"/>
      <stop offset="50%" stop-color="#f5a623"/>
      <stop offset="100%" stop-color="#c47f0d"/>
    </linearGradient>
    <linearGradient id="crimsonOg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff6b6b"/>
      <stop offset="100%" stop-color="#8b0000"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#ogbg)"/>
  <!-- Grid lines -->
  <g stroke="#8b0000" stroke-width="1" opacity="0.08">
    <line x1="0" y1="210" x2="1200" y2="210"/><line x1="0" y1="420" x2="1200" y2="420"/>
    <line x1="300" y1="0" x2="300" y2="630"/><line x1="600" y1="0" x2="600" y2="630"/><line x1="900" y1="0" x2="900" y2="630"/>
  </g>
  <!-- Gold borders -->
  <rect x="0" y="0" width="8" height="630" fill="url(#goldOg)"/>
  <rect x="1192" y="0" width="8" height="630" fill="url(#goldOg)"/>
  <rect x="0" y="0" width="1200" height="5" fill="url(#goldOg)"/>
  <rect x="0" y="625" width="1200" height="5" fill="url(#goldOg)"/>
  <!-- Logo circle -->
  <circle cx="300" cy="315" r="218" fill="#120404" stroke="url(#goldOg)" stroke-width="5"/>
  <!-- Brand text in circle -->
  <text x="300" y="350" font-family="'Arial Black',Arial,sans-serif" font-size="120" font-weight="900" text-anchor="middle" fill="url(#goldOg)" letter-spacing="-4">666C</text>
  <text x="300" y="396" font-family="Arial,sans-serif" font-size="22" font-weight="600" text-anchor="middle" fill="url(#crimsonOg)" letter-spacing="4">SLOTS · CASINO</text>
  <!-- Right panel -->
  <text x="680" y="228" font-family="'Arial Black',Arial,sans-serif" font-size="68" font-weight="900" fill="#e8eaf0" letter-spacing="-2">666C Game</text>
  <line x1="680" y1="252" x2="1140" y2="252" stroke="url(#goldOg)" stroke-width="3"/>
  <text x="680" y="306" font-family="Arial,sans-serif" font-size="27" fill="#8a90a4">Slots, Casino &amp; Earning Lobby</text>
  <text x="680" y="350" font-family="Arial,sans-serif" font-size="27" fill="#8a90a4">Earn Real Money — Pakistan</text>
  <!-- Game type badges -->
  <rect x="680" y="388" width="136" height="44" rx="22" fill="#cc1100" fill-opacity="0.15" stroke="#ff4444" stroke-width="1.5"/>
  <text x="748" y="416" font-family="Arial,sans-serif" font-size="18" text-anchor="middle" fill="#ff6b6b">Slots</text>
  <rect x="832" y="388" width="148" height="44" rx="22" fill="#f5a623" fill-opacity="0.15" stroke="#f5a623" stroke-width="1.5"/>
  <text x="906" y="416" font-family="Arial,sans-serif" font-size="18" text-anchor="middle" fill="#f5a623">Casino</text>
  <rect x="996" y="388" width="148" height="44" rx="22" fill="#f5a623" fill-opacity="0.15" stroke="#f5a623" stroke-width="1.5"/>
  <text x="1070" y="416" font-family="Arial,sans-serif" font-size="18" text-anchor="middle" fill="#f5a623">Aviator</text>
  <!-- Payment badges -->
  <rect x="680" y="452" width="200" height="44" rx="22" fill="#3d72f5" fill-opacity="0.15" stroke="#3d72f5" stroke-width="1.5"/>
  <text x="780" y="480" font-family="Arial,sans-serif" font-size="17" text-anchor="middle" fill="#3d72f5">JazzCash ✓</text>
  <rect x="896" y="452" width="220" height="44" rx="22" fill="#22c55e" fill-opacity="0.12" stroke="#22c55e" stroke-width="1.5"/>
  <text x="1006" y="480" font-family="Arial,sans-serif" font-size="17" text-anchor="middle" fill="#22c55e">EasyPaisa ✓</text>
  <!-- Download CTA -->
  <rect x="680" y="526" width="460" height="58" rx="12" fill="url(#goldOg)"/>
  <text x="910" y="562" font-family="'Arial Black',Arial,sans-serif" font-size="22" font-weight="900" text-anchor="middle" fill="#0a0202">Download APK – 666C Game</text>
</svg>`;

writeFileSync(path.join(contentImagesDir, '666c-game-logo.svg'), svg666cLogo);
await toWebp(svg666cLogo, path.join(contentImagesDir, '666c-game.webp'), 512, 512);
await toWebp(og666c, path.join(contentImagesDir, '666c-game-og.webp'), 1200, 630);

console.log('\n✅ 666C Game — all images generated!');
