import sharp from 'sharp';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// SVG logo for XX555 Game — dark luxury style, gold accent
const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <!-- Background gradient: deep navy to dark purple -->
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1a1f4e"/>
      <stop offset="100%" stop-color="#0a0d24"/>
    </radialGradient>
    <!-- Gold shimmer gradient for text -->
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe066"/>
      <stop offset="40%" stop-color="#f5a623"/>
      <stop offset="80%" stop-color="#c47f0d"/>
      <stop offset="100%" stop-color="#ffe066"/>
    </linearGradient>
    <!-- Outer ring gradient -->
    <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe066"/>
      <stop offset="50%" stop-color="#f5a623"/>
      <stop offset="100%" stop-color="#c47f0d"/>
    </linearGradient>
    <!-- Inner glow filter -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <!-- Drop shadow for text -->
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#f5a623" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Circular background -->
  <circle cx="256" cy="256" r="256" fill="url(#bg)"/>

  <!-- Outer gold ring -->
  <circle cx="256" cy="256" r="240" fill="none" stroke="url(#ring)" stroke-width="8"/>

  <!-- Inner secondary ring -->
  <circle cx="256" cy="256" r="220" fill="none" stroke="#f5a623" stroke-width="1.5" stroke-opacity="0.35"/>

  <!-- Decorative corner stars -->
  <!-- Top -->
  <polygon points="256,28 262,48 256,44 250,48" fill="#f5a623" opacity="0.9"/>
  <!-- Bottom -->
  <polygon points="256,484 262,464 256,468 250,464" fill="#f5a623" opacity="0.9"/>
  <!-- Left -->
  <polygon points="28,256 48,250 44,256 48,262" fill="#f5a623" opacity="0.9"/>
  <!-- Right -->
  <polygon points="484,256 464,250 468,256 464,262" fill="#f5a623" opacity="0.9"/>

  <!-- 4-point decorative diamonds at 45° -->
  <g fill="#f5a623" opacity="0.5">
    <polygon points="80,80 87,93 80,86 73,93"/>
    <polygon points="432,80 439,93 432,86 425,93"/>
    <polygon points="80,432 87,419 80,426 73,419"/>
    <polygon points="432,432 439,419 432,426 425,419"/>
  </g>

  <!-- Subtle grid/hex pattern overlay (decorative lines) -->
  <g stroke="#3d72f5" stroke-width="0.6" opacity="0.12">
    <line x1="0" y1="128" x2="512" y2="128"/>
    <line x1="0" y1="256" x2="512" y2="256"/>
    <line x1="0" y1="384" x2="512" y2="384"/>
    <line x1="128" y1="0" x2="128" y2="512"/>
    <line x1="256" y1="0" x2="256" y2="512"/>
    <line x1="384" y1="0" x2="384" y2="512"/>
  </g>

  <!-- Glowing center badge -->
  <circle cx="256" cy="256" r="170" fill="#111830" fill-opacity="0.8"/>

  <!-- XX555 main text -->
  <text
    x="256"
    y="285"
    font-family="'Arial Black', 'Arial', sans-serif"
    font-size="110"
    font-weight="900"
    text-anchor="middle"
    fill="url(#gold)"
    filter="url(#shadow)"
    letter-spacing="-4"
  >XX555</text>

  <!-- Tagline text -->
  <text
    x="256"
    y="330"
    font-family="'Arial', sans-serif"
    font-size="22"
    font-weight="600"
    text-anchor="middle"
    fill="#8a90a4"
    letter-spacing="6"
  >EARN &amp; WIN</text>

  <!-- Top label -->
  <text
    x="256"
    y="195"
    font-family="'Arial', sans-serif"
    font-size="18"
    font-weight="500"
    text-anchor="middle"
    fill="#f5a623"
    fill-opacity="0.75"
    letter-spacing="4"
  >OFFICIAL</text>

  <!-- Small decorative line under tagline -->
  <line x1="186" y1="342" x2="326" y2="342" stroke="#f5a623" stroke-width="1.5" stroke-opacity="0.5"/>

</svg>`;

const outputDir = path.join(__dirname, '..', 'public', 'content-images');

// Write SVG first (for reference)
writeFileSync(path.join(outputDir, 'xx555-game-logo.svg'), svgLogo);
console.log('✅ SVG saved');

// Convert SVG → WebP (logo square)
await sharp(Buffer.from(svgLogo))
  .resize(512, 512)
  .webp({ quality: 90 })
  .toFile(path.join(outputDir, 'xx555-game.webp'));
console.log('✅ xx555-game.webp saved (512×512 logo)');

// Also generate OG image (1200×630) — landscape banner version
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="ogbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0d24"/>
      <stop offset="50%" stop-color="#111830"/>
      <stop offset="100%" stop-color="#0d1117"/>
    </linearGradient>
    <linearGradient id="goldOg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe066"/>
      <stop offset="50%" stop-color="#f5a623"/>
      <stop offset="100%" stop-color="#c47f0d"/>
    </linearGradient>
    <filter id="glowOg">
      <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#ogbg)"/>

  <!-- Decorative grid lines -->
  <g stroke="#3d72f5" stroke-width="1" opacity="0.08">
    <line x1="0" y1="210" x2="1200" y2="210"/>
    <line x1="0" y1="420" x2="1200" y2="420"/>
    <line x1="300" y1="0" x2="300" y2="630"/>
    <line x1="600" y1="0" x2="600" y2="630"/>
    <line x1="900" y1="0" x2="900" y2="630"/>
  </g>

  <!-- Gold accent bar left -->
  <rect x="0" y="0" width="8" height="630" fill="url(#goldOg)"/>
  <!-- Gold accent bar right -->
  <rect x="1192" y="0" width="8" height="630" fill="url(#goldOg)"/>
  <!-- Gold accent bar top -->
  <rect x="0" y="0" width="1200" height="5" fill="url(#goldOg)"/>
  <!-- Gold accent bar bottom -->
  <rect x="0" y="625" width="1200" height="5" fill="url(#goldOg)"/>

  <!-- Main logo circle on left -->
  <circle cx="300" cy="315" r="220" fill="#111830" stroke="#f5a623" stroke-width="5"/>
  <circle cx="300" cy="315" r="200" fill="none" stroke="#f5a623" stroke-width="1" stroke-opacity="0.3"/>
  <text x="300" y="345" font-family="'Arial Black','Arial',sans-serif" font-size="110" font-weight="900" text-anchor="middle" fill="url(#goldOg)" letter-spacing="-4">XX555</text>
  <text x="300" y="390" font-family="'Arial',sans-serif" font-size="20" font-weight="600" text-anchor="middle" fill="#8a90a4" letter-spacing="5">EARN &amp; WIN</text>

  <!-- Right side text content -->
  <text x="680" y="230" font-family="'Arial Black','Arial',sans-serif" font-size="72" font-weight="900" fill="#e8eaf0" letter-spacing="-2">XX555 Game</text>
  <line x1="680" y1="255" x2="1140" y2="255" stroke="#f5a623" stroke-width="3"/>
  <text x="680" y="310" font-family="'Arial',sans-serif" font-size="28" fill="#8a90a4">Real Money Earning App</text>
  <text x="680" y="355" font-family="'Arial',sans-serif" font-size="28" fill="#8a90a4">Pakistan 2026</text>

  <!-- Feature pills -->
  <rect x="680" y="390" width="140" height="44" rx="22" fill="#f5a623" fill-opacity="0.15" stroke="#f5a623" stroke-width="1.5"/>
  <text x="750" y="418" font-family="'Arial',sans-serif" font-size="18" text-anchor="middle" fill="#f5a623">Slots</text>

  <rect x="836" y="390" width="140" height="44" rx="22" fill="#f5a623" fill-opacity="0.15" stroke="#f5a623" stroke-width="1.5"/>
  <text x="906" y="418" font-family="'Arial',sans-serif" font-size="18" text-anchor="middle" fill="#f5a623">Lottery</text>

  <rect x="992" y="390" width="148" height="44" rx="22" fill="#f5a623" fill-opacity="0.15" stroke="#f5a623" stroke-width="1.5"/>
  <text x="1066" y="418" font-family="'Arial',sans-serif" font-size="18" text-anchor="middle" fill="#f5a623">Casino</text>

  <!-- JazzCash / EasyPaisa badges -->
  <rect x="680" y="455" width="200" height="44" rx="22" fill="#3d72f5" fill-opacity="0.15" stroke="#3d72f5" stroke-width="1.5"/>
  <text x="780" y="483" font-family="'Arial',sans-serif" font-size="17" text-anchor="middle" fill="#3d72f5">JazzCash ✓</text>

  <rect x="896" y="455" width="220" height="44" rx="22" fill="#22c55e" fill-opacity="0.12" stroke="#22c55e" stroke-width="1.5"/>
  <text x="1006" y="483" font-family="'Arial',sans-serif" font-size="17" text-anchor="middle" fill="#22c55e">EasyPaisa ✓</text>

  <!-- Download CTA -->
  <rect x="680" y="530" width="460" height="60" rx="12" fill="url(#goldOg)"/>
  <text x="910" y="568" font-family="'Arial Black','Arial',sans-serif" font-size="24" font-weight="900" text-anchor="middle" fill="#0a0d24">Download APK – xx5553.com</text>
</svg>`;

await sharp(Buffer.from(ogSvg))
  .resize(1200, 630)
  .webp({ quality: 90 })
  .toFile(path.join(outputDir, 'xx555-game-og.webp'));
console.log('✅ xx555-game-og.webp saved (1200×630 OG image)');

console.log('\n✅ All XX555 images generated successfully in WebP format!');
