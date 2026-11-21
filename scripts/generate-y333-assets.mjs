import { existsSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "public", "content-images");
const RAW_ICON = process.env.Y333_RAW_ICON || "";

async function svgToWebp(svg, outPath, w, h) {
  await sharp(Buffer.from(svg))
    .resize(w, h)
    .webp({ quality: 90 })
    .toFile(outPath);
  console.log(`saved ${path.basename(outPath)} (${w}x${h})`);
}

// 1. Bespoke SVG Logo (royal emerald + obsidian + metallic gold)
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="y333-bg" cx="50%" cy="38%" r="72%">
      <stop offset="0%" stop-color="#0d4a38"/>
      <stop offset="55%" stop-color="#06281f"/>
      <stop offset="100%" stop-color="#03120e"/>
    </radialGradient>
    <linearGradient id="y333-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff0a6"/>
      <stop offset="45%" stop-color="#f5b82e"/>
      <stop offset="100%" stop-color="#b9770e"/>
    </linearGradient>
    <linearGradient id="y333-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <filter id="y333-glow">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#f5b82e" flood-opacity="0.45"/>
    </filter>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#y333-bg)"/>
  <rect x="14" y="14" width="484" height="484" rx="84" fill="none" stroke="url(#y333-gold)" stroke-width="6"/>
  <circle cx="256" cy="256" r="204" fill="none" stroke="#34d399" stroke-width="1.5" opacity="0.32"/>
  <polygon points="256,30 266,54 256,48 246,54" fill="#f5b82e" opacity="0.9"/>
  <polygon points="256,482 266,458 256,464 246,458" fill="#f5b82e" opacity="0.9"/>
  <polygon points="30,256 54,246 48,256 54,266" fill="#f5b82e" opacity="0.9"/>
  <polygon points="482,256 458,246 464,256 458,266" fill="#f5b82e" opacity="0.9"/>
  <text x="256" y="180" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" fill="#6ee7b7" letter-spacing="6">PAKISTAN APK</text>
  <text x="256" y="294" font-family="Arial Black, Arial, sans-serif" font-size="124" font-weight="900" text-anchor="middle" fill="url(#y333-gold)" filter="url(#y333-glow)" letter-spacing="-3">Y333</text>
  <line x1="150" y1="322" x2="362" y2="322" stroke="url(#y333-gold)" stroke-width="2" opacity="0.5"/>
  <text x="256" y="362" font-family="Arial, sans-serif" font-size="22" font-weight="700" text-anchor="middle" fill="url(#y333-emerald)" letter-spacing="5">GAME LOBBY</text>
</svg>`;

// 2. OG Card (1200x630)
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="og-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#03120e"/>
      <stop offset="55%" stop-color="#072b21"/>
      <stop offset="100%" stop-color="#0d4a38"/>
    </linearGradient>
    <linearGradient id="og-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff0a6"/>
      <stop offset="50%" stop-color="#f5b82e"/>
      <stop offset="100%" stop-color="#b9770e"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#og-bg)"/>
  <g stroke="#34d399" stroke-width="1" opacity="0.07">
    <line x1="0" y1="157" x2="1200" y2="157"/><line x1="0" y1="315" x2="1200" y2="315"/><line x1="0" y1="472" x2="1200" y2="472"/>
    <line x1="300" y1="0" x2="300" y2="630"/><line x1="600" y1="0" x2="600" y2="630"/><line x1="900" y1="0" x2="900" y2="630"/>
  </g>
  <rect x="0" y="0" width="1200" height="8" fill="url(#og-gold)"/>
  <rect x="0" y="622" width="1200" height="8" fill="url(#og-gold)"/>
  <rect x="92" y="135" width="360" height="360" rx="64" fill="#041913" stroke="url(#og-gold)" stroke-width="5"/>
  <text x="272" y="346" font-family="Arial Black, Arial, sans-serif" font-size="112" font-weight="900" text-anchor="middle" fill="url(#og-gold)" letter-spacing="-3">Y333</text>
  <text x="272" y="400" font-family="Arial, sans-serif" font-size="22" font-weight="700" text-anchor="middle" fill="#6ee7b7" letter-spacing="5">GAME APK</text>

  <text x="515" y="188" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#6ee7b7" letter-spacing="4">HOTAPK GAMES · PAKISTAN 2026</text>
  <text x="515" y="264" font-family="Arial Black, Arial, sans-serif" font-size="66" font-weight="900" fill="#f8fafc" letter-spacing="-1">Y333 Game APK</text>
  <line x1="515" y1="288" x2="1120" y2="288" stroke="url(#og-gold)" stroke-width="3"/>
  <text x="515" y="338" font-family="Arial, sans-serif" font-size="27" fill="#cbd5e1">Download, Login &amp; Cashier Guide (v1.4 · 12MB)</text>
  <text x="515" y="378" font-family="Arial, sans-serif" font-size="23" fill="#94a3b8">Mini Games · Slots · Cards · Fishing · Sideload Checks</text>

  <rect x="515" y="418" width="178" height="46" rx="23" fill="#dc2626" fill-opacity="0.16" stroke="#f87171" stroke-width="1.5"/>
  <text x="604" y="447" font-family="Arial, sans-serif" font-size="19" font-weight="700" text-anchor="middle" fill="#fca5a5">JazzCash ✓</text>
  <rect x="710" y="418" width="194" height="46" rx="23" fill="#10b981" fill-opacity="0.16" stroke="#34d399" stroke-width="1.5"/>
  <text x="807" y="447" font-family="Arial, sans-serif" font-size="19" font-weight="700" text-anchor="middle" fill="#6ee7b7">EasyPaisa ✓</text>
  <rect x="920" y="418" width="195" height="46" rx="23" fill="#f5b82e" fill-opacity="0.14" stroke="#f5b82e" stroke-width="1.5"/>
  <text x="1017" y="447" font-family="Arial, sans-serif" font-size="19" font-weight="700" text-anchor="middle" fill="#fde68a">Android APK</text>

  <rect x="515" y="492" width="460" height="58" rx="12" fill="url(#og-gold)"/>
  <text x="745" y="529" font-family="Arial Black, Arial, sans-serif" font-size="22" font-weight="900" text-anchor="middle" fill="#03120e">Download &amp; Verify Y333 APK</text>
</svg>`;

// 3. Editorial Infographic 1: Overview & Lobby Snapshot (1280x720)
const overviewBannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="ov-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#041510"/>
      <stop offset="100%" stop-color="#0b2e24"/>
    </linearGradient>
    <linearGradient id="ov-gold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fde68a"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#ov-bg)"/>
  <rect x="0" y="0" width="1280" height="6" fill="url(#ov-gold)"/>

  <!-- Header -->
  <text x="64" y="68" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#34d399" letter-spacing="4">Y333 GAME · PAKISTAN OVERVIEW</text>
  <text x="64" y="116" font-family="Arial Black, Arial, sans-serif" font-size="42" font-weight="900" fill="#f8fafc">APK Snapshot &amp; Publisher-Listed Categories</text>
  <line x1="64" y1="138" x2="1216" y2="138" stroke="#1e4d3e" stroke-width="2"/>

  <!-- Left Spec Card -->
  <rect x="64" y="168" width="430" height="458" rx="20" fill="#062019" stroke="#1f5c49" stroke-width="2"/>
  <text x="96" y="216" font-family="Arial Black, Arial, sans-serif" font-size="24" fill="#fde68a">Quick App Snapshot</text>
  <line x1="96" y1="234" x2="462" y2="234" stroke="#1f5c49" stroke-width="1.5"/>

  <text x="96" y="278" font-family="Arial, sans-serif" font-size="16" fill="#94a3b8">REFERENCE VERSION &amp; SIZE</text>
  <text x="96" y="306" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#f8fafc">v1.4 · 12MB (compare saved APK)</text>

  <text x="96" y="354" font-family="Arial, sans-serif" font-size="16" fill="#94a3b8">PUBLISHER LOBBY DOMAIN</text>
  <text x="96" y="382" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#6ee7b7">y333.cool (web preview + APK)</text>

  <text x="96" y="430" font-family="Arial, sans-serif" font-size="16" fill="#94a3b8">NAMED LOCAL WALLETS</text>
  <text x="96" y="458" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#f8fafc">JazzCash &amp; EasyPaisa (PKR)</text>

  <text x="96" y="506" font-family="Arial, sans-serif" font-size="16" fill="#94a3b8">DISTRIBUTION &amp; LICENCE</text>
  <text x="96" y="534" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#fca5a5">Android Sideload · Licence Unverified</text>

  <rect x="96" y="560" width="366" height="44" rx="10" fill="#f59e0b" fill-opacity="0.14" stroke="#f59e0b" stroke-width="1.2"/>
  <text x="279" y="588" font-family="Arial, sans-serif" font-size="16" font-weight="700" text-anchor="middle" fill="#fde68a">18+ Adults Only · Paid Entertainment</text>

  <!-- Right 6 Category Tiles -->
  <text x="532" y="204" font-family="Arial Black, Arial, sans-serif" font-size="24" fill="#f8fafc">Categories Named on Publisher Pages</text>
  <text x="532" y="232" font-family="Arial, sans-serif" font-size="17" fill="#94a3b8">Live game tiles vary by build — confirm inside the app after login</text>

  <!-- Tile 1 -->
  <rect x="532" y="256" width="328" height="108" rx="16" fill="#092920" stroke="#2d6e58" stroke-width="1.5"/>
  <rect x="552" y="276" width="44" height="44" rx="10" fill="#f59e0b" fill-opacity="0.2"/>
  <text x="574" y="305" font-family="Arial Black, Arial, sans-serif" font-size="20" text-anchor="middle" fill="#fde68a">01</text>
  <text x="612" y="298" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#f8fafc">Mini &amp; Crash Games</text>
  <text x="612" y="328" font-family="Arial, sans-serif" font-size="16" fill="#94a3b8">Aviator-style, Chicken Road</text>

  <!-- Tile 2 -->
  <rect x="888" y="256" width="328" height="108" rx="16" fill="#092920" stroke="#2d6e58" stroke-width="1.5"/>
  <rect x="908" y="276" width="44" height="44" rx="10" fill="#34d399" fill-opacity="0.2"/>
  <text x="930" y="305" font-family="Arial Black, Arial, sans-serif" font-size="20" text-anchor="middle" fill="#6ee7b7">02</text>
  <text x="968" y="298" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#f8fafc">Slot Machines</text>
  <text x="968" y="328" font-family="Arial, sans-serif" font-size="16" fill="#94a3b8">Themed reels &amp; bonus spins</text>

  <!-- Tile 3 -->
  <rect x="532" y="384" width="328" height="108" rx="16" fill="#092920" stroke="#2d6e58" stroke-width="1.5"/>
  <rect x="552" y="404" width="44" height="44" rx="10" fill="#34d399" fill-opacity="0.2"/>
  <text x="574" y="433" font-family="Arial Black, Arial, sans-serif" font-size="20" text-anchor="middle" fill="#6ee7b7">03</text>
  <text x="612" y="426" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#f8fafc">Card &amp; Table Rooms</text>
  <text x="612" y="456" font-family="Arial, sans-serif" font-size="16" fill="#94a3b8">Teen Patti &amp; classic tables</text>

  <!-- Tile 4 -->
  <rect x="888" y="384" width="328" height="108" rx="16" fill="#092920" stroke="#2d6e58" stroke-width="1.5"/>
  <rect x="908" y="404" width="44" height="44" rx="10" fill="#f59e0b" fill-opacity="0.2"/>
  <text x="930" y="433" font-family="Arial Black, Arial, sans-serif" font-size="20" text-anchor="middle" fill="#fde68a">04</text>
  <text x="968" y="426" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#f8fafc">Fishing Arcade</text>
  <text x="968" y="456" font-family="Arial, sans-serif" font-size="16" fill="#94a3b8">Multiplier shooter rooms</text>

  <!-- Tile 5 -->
  <rect x="532" y="512" width="328" height="108" rx="16" fill="#092920" stroke="#2d6e58" stroke-width="1.5"/>
  <rect x="552" y="532" width="44" height="44" rx="10" fill="#f59e0b" fill-opacity="0.2"/>
  <text x="574" y="561" font-family="Arial Black, Arial, sans-serif" font-size="20" text-anchor="middle" fill="#fde68a">05</text>
  <text x="612" y="554" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#f8fafc">Live &amp; Sports Tabs</text>
  <text x="612" y="584" font-family="Arial, sans-serif" font-size="16" fill="#94a3b8">Live dealer &amp; cricket events</text>

  <!-- Tile 6 -->
  <rect x="888" y="512" width="328" height="108" rx="16" fill="#092920" stroke="#2d6e58" stroke-width="1.5"/>
  <rect x="908" y="532" width="44" height="44" rx="10" fill="#34d399" fill-opacity="0.2"/>
  <text x="930" y="561" font-family="Arial Black, Arial, sans-serif" font-size="20" text-anchor="middle" fill="#6ee7b7">06</text>
  <text x="968" y="554" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#f8fafc">Quick Draws</text>
  <text x="968" y="584" font-family="Arial, sans-serif" font-size="16" fill="#94a3b8">Colour &amp; lottery (verify in-app)</text>

  <!-- Footer -->
  <text x="64" y="678" font-family="Arial, sans-serif" font-size="16" fill="#64748b">HotAPK Games Editorial · Independent Pakistan APK Verification Guide · hotapkgames.com/y333-game</text>
</svg>`;

// 4. Editorial Infographic 2: Android Sideload & Safety Flowchart (1280x720)
const installBannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="in-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#07111e"/>
      <stop offset="100%" stop-color="#0b2620"/>
    </linearGradient>
    <linearGradient id="in-gold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#f5b82e"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#in-bg)"/>
  <rect x="0" y="0" width="1280" height="6" fill="url(#in-gold)"/>

  <text x="64" y="68" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#34d399" letter-spacing="4">ANDROID SIDELOAD CHECKLIST</text>
  <text x="64" y="116" font-family="Arial Black, Arial, sans-serif" font-size="40" font-weight="900" fill="#f8fafc">How to Download &amp; Install Y333 Game APK Safely</text>
  <line x1="64" y1="138" x2="1216" y2="138" stroke="#1e3a44" stroke-width="2"/>

  <!-- 5 Step Cards -->
  <!-- Step 1 -->
  <rect x="64" y="180" width="212" height="360" rx="18" fill="#0b1f29" stroke="#225566" stroke-width="1.8"/>
  <circle cx="170" cy="238" r="30" fill="#f5b82e"/>
  <text x="170" y="247" font-family="Arial Black, Arial, sans-serif" font-size="24" text-anchor="middle" fill="#07111e">1</text>
  <text x="170" y="302" font-family="Arial, sans-serif" font-size="21" font-weight="700" text-anchor="middle" fill="#f8fafc">Open Lobby</text>
  <text x="170" y="328" font-family="Arial, sans-serif" font-size="21" font-weight="700" text-anchor="middle" fill="#f8fafc">Download</text>
  <text x="170" y="376" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#94a3b8">Open y333.cool</text>
  <text x="170" y="400" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#94a3b8">via the page</text>
  <text x="170" y="424" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#94a3b8">Download CTA.</text>
  <text x="170" y="468" font-family="Arial, sans-serif" font-size="15" font-weight="700" text-anchor="middle" fill="#fca5a5">Skip chat files</text>

  <!-- Step 2 -->
  <rect x="298" y="180" width="212" height="360" rx="18" fill="#0b1f29" stroke="#225566" stroke-width="1.8"/>
  <circle cx="404" cy="238" r="30" fill="#34d399"/>
  <text x="404" y="247" font-family="Arial Black, Arial, sans-serif" font-size="24" text-anchor="middle" fill="#07111e">2</text>
  <text x="404" y="302" font-family="Arial, sans-serif" font-size="21" font-weight="700" text-anchor="middle" fill="#f8fafc">Check Size</text>
  <text x="404" y="328" font-family="Arial, sans-serif" font-size="21" font-weight="700" text-anchor="middle" fill="#f8fafc">&amp; Scan</text>
  <text x="404" y="376" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#94a3b8">Compare to</text>
  <text x="404" y="400" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#94a3b8">v1.4 / 12MB ref.</text>
  <text x="404" y="424" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#94a3b8">Scan with Play</text>
  <text x="404" y="448" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#94a3b8">Protect or VT.</text>

  <!-- Step 3 -->
  <rect x="532" y="180" width="212" height="360" rx="18" fill="#0b1f29" stroke="#225566" stroke-width="1.8"/>
  <circle cx="638" cy="238" r="30" fill="#f5b82e"/>
  <text x="638" y="247" font-family="Arial Black, Arial, sans-serif" font-size="24" text-anchor="middle" fill="#07111e">3</text>
  <text x="638" y="302" font-family="Arial, sans-serif" font-size="21" font-weight="700" text-anchor="middle" fill="#f8fafc">Allow One</text>
  <text x="638" y="328" font-family="Arial, sans-serif" font-size="21" font-weight="700" text-anchor="middle" fill="#f8fafc">Installer</text>
  <text x="638" y="376" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#94a3b8">Settings → Apps</text>
  <text x="638" y="400" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#94a3b8">→ Special access</text>
  <text x="638" y="424" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#94a3b8">→ Install unknown</text>
  <text x="638" y="448" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#94a3b8">apps (1 browser).</text>

  <!-- Step 4 -->
  <rect x="766" y="180" width="212" height="360" rx="18" fill="#0b1f29" stroke="#225566" stroke-width="1.8"/>
  <circle cx="872" cy="238" r="30" fill="#34d399"/>
  <text x="872" y="247" font-family="Arial Black, Arial, sans-serif" font-size="24" text-anchor="middle" fill="#07111e">4</text>
  <text x="872" y="302" font-family="Arial, sans-serif" font-size="21" font-weight="700" text-anchor="middle" fill="#f8fafc">Install &amp;</text>
  <text x="872" y="328" font-family="Arial, sans-serif" font-size="21" font-weight="700" text-anchor="middle" fill="#f8fafc">Check Perms</text>
  <text x="872" y="376" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#94a3b8">Tap APK to install.</text>
  <text x="872" y="400" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#fca5a5">Refuse Contacts,</text>
  <text x="872" y="424" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#fca5a5">Accessibility &amp;</text>
  <text x="872" y="448" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#fca5a5">Device Admin.</text>

  <!-- Step 5 -->
  <rect x="1000" y="180" width="216" height="360" rx="18" fill="#0b1f29" stroke="#34d399" stroke-width="2"/>
  <circle cx="1108" cy="238" r="30" fill="#f5b82e"/>
  <text x="1108" y="247" font-family="Arial Black, Arial, sans-serif" font-size="24" text-anchor="middle" fill="#07111e">5</text>
  <text x="1108" y="302" font-family="Arial, sans-serif" font-size="21" font-weight="700" text-anchor="middle" fill="#f8fafc">Toggle Off</text>
  <text x="1108" y="328" font-family="Arial, sans-serif" font-size="21" font-weight="700" text-anchor="middle" fill="#f8fafc">&amp; Register</text>
  <text x="1108" y="376" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#94a3b8">Turn unknown-apps</text>
  <text x="1108" y="400" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#6ee7b7">OFF immediately.</text>
  <text x="1108" y="424" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#94a3b8">Use unique login</text>
  <text x="1108" y="448" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#94a3b8">password + OTP.</text>

  <!-- Warning Strip -->
  <rect x="64" y="576" width="1152" height="66" rx="14" fill="#dc2626" fill-opacity="0.14" stroke="#f87171" stroke-width="1.5"/>
  <text x="640" y="616" font-family="Arial, sans-serif" font-size="19" font-weight="700" text-anchor="middle" fill="#fecaca">Security Rule: Never install a "login-fix" APK or read an SMS OTP aloud to anyone claiming to be support.</text>

  <text x="64" y="682" font-family="Arial, sans-serif" font-size="16" fill="#64748b">HotAPK Games Editorial · Android Sideload Safety Guide · hotapkgames.com/y333-game</text>
</svg>`;

// 5. Editorial Infographic 3: JazzCash & EasyPaisa Wallet Safety Card (1280x720)
const walletBannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="wa-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#05130f"/>
      <stop offset="100%" stop-color="#10212e"/>
    </linearGradient>
    <linearGradient id="wa-accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f87171"/>
      <stop offset="50%" stop-color="#f5b82e"/>
      <stop offset="100%" stop-color="#34d399"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#wa-bg)"/>
  <rect x="0" y="0" width="1280" height="6" fill="url(#wa-accent)"/>

  <text x="64" y="68" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#fde68a" letter-spacing="4">PAKISTAN CASHIER VERIFICATION</text>
  <text x="64" y="116" font-family="Arial Black, Arial, sans-serif" font-size="40" font-weight="900" fill="#f8fafc">Y333 JazzCash &amp; EasyPaisa Safety Checklist</text>
  <line x1="64" y1="138" x2="1216" y2="138" stroke="#1e3a44" stroke-width="2"/>

  <!-- Top Two Wallet Cards -->
  <rect x="64" y="168" width="556" height="120" rx="18" fill="#1a0d12" stroke="#f87171" stroke-width="2"/>
  <text x="100" y="216" font-family="Arial Black, Arial, sans-serif" font-size="30" fill="#fca5a5">JazzCash</text>
  <text x="100" y="252" font-family="Arial, sans-serif" font-size="18" fill="#e2e8f0">Match the JazzCash logo inside the Y333 Deposit tab</text>
  <text x="100" y="274" font-family="Arial, sans-serif" font-size="15" fill="#94a3b8">Use your own 03xx wallet number · Limits stay Not publicly confirmed</text>

  <rect x="660" y="168" width="556" height="120" rx="18" fill="#072219" stroke="#34d399" stroke-width="2"/>
  <text x="696" y="216" font-family="Arial Black, Arial, sans-serif" font-size="30" fill="#6ee7b7">EasyPaisa</text>
  <text x="696" y="252" font-family="Arial, sans-serif" font-size="18" fill="#e2e8f0">Confirm EasyPaisa appears on the live in-app cashier</text>
  <text x="696" y="274" font-family="Arial, sans-serif" font-size="15" fill="#94a3b8">Never reuse your wallet MPIN as your Y333 login password</text>

  <!-- 4 Verification Steps -->
  <rect x="64" y="318" width="556" height="148" rx="16" fill="#0b1f29" stroke="#244859" stroke-width="1.5"/>
  <text x="96" y="362" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#fde68a">1. Start With a Small Test Deposit</text>
  <text x="96" y="398" font-family="Arial, sans-serif" font-size="17" fill="#cbd5e1">Send only an amount you can comfortably lose.</text>
  <text x="96" y="426" font-family="Arial, sans-serif" font-size="17" fill="#94a3b8">Screenshot the reference ID; never double-pay on lag.</text>

  <rect x="660" y="318" width="556" height="148" rx="16" fill="#0b1f29" stroke="#244859" stroke-width="1.5"/>
  <text x="692" y="362" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#6ee7b7">2. Test a Small Early Withdrawal</text>
  <text x="692" y="398" font-family="Arial, sans-serif" font-size="17" fill="#cbd5e1">Bind your own 03xx wallet and request a small cash-out.</text>
  <text x="692" y="426" font-family="Arial, sans-serif" font-size="17" fill="#94a3b8">Save the order ID until SMS confirmation reaches your phone.</text>

  <rect x="64" y="488" width="556" height="148" rx="16" fill="#0b1f29" stroke="#244859" stroke-width="1.5"/>
  <text x="96" y="532" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#fde68a">3. Check Bonus Rollover Terms First</text>
  <text x="96" y="568" font-family="Arial, sans-serif" font-size="17" fill="#cbd5e1">Promo banners often carry wagering conditions.</text>
  <text x="96" y="596" font-family="Arial, sans-serif" font-size="17" fill="#94a3b8">Unmet turnover can pause withdrawals until cleared.</text>

  <rect x="660" y="488" width="556" height="148" rx="16" fill="#220c10" stroke="#f87171" stroke-width="1.8"/>
  <text x="692" y="532" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#fca5a5">4. Stop on Any Scam Red Flag</text>
  <text x="692" y="568" font-family="Arial, sans-serif" font-size="17" fill="#fecaca">Walk away if anyone asks for GST, tax, or unlock fees</text>
  <text x="692" y="596" font-family="Arial, sans-serif" font-size="17" fill="#fecaca">to a personal number, or requests your SMS OTP.</text>

  <text x="64" y="682" font-family="Arial, sans-serif" font-size="16" fill="#64748b">HotAPK Games Editorial · Payout times &amp; minimums stay Not publicly confirmed · 18+ Only</text>
</svg>`;

writeFileSync(path.join(OUT, "y333-game-logo.svg"), logoSvg);
console.log("saved y333-game-logo.svg");

// Cover icon: prefer generated 3D icon if provided and valid, else crisp SVG logo
if (RAW_ICON && existsSync(RAW_ICON)) {
  const roundedMask = Buffer.from(
    `<svg width="512" height="512"><rect x="0" y="0" width="512" height="512" rx="96" ry="96" fill="#fff"/></svg>`
  );
  await sharp(RAW_ICON)
    .resize(512, 512, { fit: "cover" })
    .composite([{ input: roundedMask, blend: "dest-in" }])
    .webp({ quality: 92 })
    .toFile(path.join(OUT, "y333-game.webp"));
  console.log("saved y333-game.webp (512x512 from 3D icon)");

  // Composite the 3D icon cleanly into the OG card!
  const ogIconBuf = await sharp(RAW_ICON)
    .resize(350, 350, { fit: "cover" })
    .composite([
      {
        input: Buffer.from(
          `<svg width="350" height="350"><rect x="0" y="0" width="350" height="350" rx="58" ry="58" fill="#fff"/></svg>`
        ),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();

  const ogBase = await sharp(Buffer.from(ogSvg)).resize(1200, 630).png().toBuffer();
  await sharp(ogBase)
    .composite([{ input: ogIconBuf, left: 97, top: 140 }])
    .webp({ quality: 90 })
    .toFile(path.join(OUT, "y333-game-og.webp"));
  console.log("saved y333-game-og.webp (1200x630 with 3D icon)");
} else {
  await svgToWebp(logoSvg, path.join(OUT, "y333-game.webp"), 512, 512);
  await svgToWebp(ogSvg, path.join(OUT, "y333-game-og.webp"), 1200, 630);
}

await svgToWebp(
  overviewBannerSvg,
  path.join(OUT, "y333-game-overview-banner.webp"),
  1280,
  720
);
await svgToWebp(
  installBannerSvg,
  path.join(OUT, "y333-game-install-banner.webp"),
  1280,
  720
);
await svgToWebp(
  walletBannerSvg,
  path.join(OUT, "y333-game-wallet-banner.webp"),
  1280,
  720
);

console.log("All Y333 Game assets generated successfully.");
