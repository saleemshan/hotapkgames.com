#!/usr/bin/env node
/**
 * Trim duplicate images and boilerplate text from content/games/*.mdx
 * Run: node scripts/trim-game-mdx-bloat.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const gamesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "content/games");

const BOILERPLATE_SECTIONS = [
  // Generic trust/review fluff
  /\n\*\*Trusted[^*]*\*\*\n\n[\s\S]*?(?=\n\*\*)/g,
  /\n\*\*Positive Reviews in Pakistan\*\*\n\n[\s\S]*?(?=\n\*\*)/g,
  /\n\*\*Fair Gaming Standards\*\*\n\n[\s\S]*?(?=\n\*\*)/g,
  /\n\*\*24\/7 Customer Support\*\*\n\n[\s\S]*?(?=\n\*\*)/g,
  /\n\*\*Urdu and English Interface\*\*\n\n[\s\S]*?(?=\n\*\*)/g,
  /\n\*\*High Earning Potential\*\*\n\n[\s\S]*?(?=\n\*\*)/g,
  /\n\*\*VIP Rewards\*\*\n\n[\s\S]*?(?=\n\*\*)/g,
  /\n\*\*Lightweight APK\*\*\n\n[\s\S]*?(?=\n\*\*)/g,
  /\n\*\*Fast JazzCash Payouts\*\*\n\n[\s\S]*?(?=\n\*\*)/g,
  // Repeats conclusion / wallet pitch
  /\n\*\*Why Choose[^*]*\*\*\n\n[\s\S]*?(?=\n\*\*(?:Earn More With Referral|Is [^*]+ Safe))/g,
  // Long duplicate game-category walkthrough
  /\n\*\*Popular Games to Play[^*]*\*\*\n\n[\s\S]*?(?=\n\*\*Guide to Download)/g,
  // 20-item bullet dump
  /\n\*\*Additional Features\*\*\n\nBeyond[^\n]*\n\n(?:- [^\n]+\n)+/g,
];

const BOILERPLATE_PARAS = [
  /^What truly differentiates the experience[\s\S]*?\n\n/m,
  /^What keeps the platform competitive[\s\S]*?\n\n/m,
  /^Getting started on the [^\n]+ takes only a few minutes[\s\S]*?Follow the guides below[^\n]*\.\n\n/m,
];

function parseFrontmatter(raw) {
  if (!raw.startsWith("---")) return null;
  const end = raw.indexOf("\n---", 4);
  if (end < 0) return null;
  return { fm: raw.slice(0, end + 4), body: raw.slice(end + 4) };
}

function dedupeFrontmatterKeywords(fm) {
  const tagsMatch = fm.match(/^tags:\n((?:  - [^\n]+\n)+)/m);
  if (!tagsMatch) return fm;
  const tags = [...tagsMatch[1].matchAll(/  - "([^"]+)"/g)].map((m) => m[1].toLowerCase());
  const tagSet = new Set(tags);

  const secStart = fm.indexOf("secondaryKeywords:");
  if (secStart < 0) return fm;

  const afterSec = fm.slice(secStart);
  const secEnd = afterSec.search(/\n[a-zA-Z][^\n]*:/);
  const secBlock = secEnd > 0 ? afterSec.slice(0, secEnd) : afterSec;
  const rest = secEnd > 0 ? afterSec.slice(secEnd) : "";

  const kept = [...secBlock.matchAll(/  - "([^"]+)"/g)]
    .map((m) => m[1])
    .filter((kw) => !tagSet.has(kw.toLowerCase()));

  if (kept.length === 0) {
    return fm.replace(/\nsecondaryKeywords:\n(?:  - [^\n]+\n)+/m, "\n");
  }

  const rebuilt =
    "secondaryKeywords:\n" + kept.map((k) => `  - "${k}"`).join("\n") + "\n";
  return fm.slice(0, secStart) + rebuilt + rest;
}

function dedupeImages(body) {
  const seen = new Set();
  return body
    .split("\n")
    .filter((line) => {
      const m = line.match(/^!\[[^\]]*\]\(([^)]+)\)/);
      if (!m) return true;
      const url = m[1];
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    })
    .join("\n");
}

function stripCoverImage(fm, body) {
  const cover =
    fm.match(/^coverImage:\s*"([^"]+)"/m)?.[1] ??
    fm.match(/^ogImage:\s*"([^"]+)"/m)?.[1];
  if (!cover) return body;
  const escaped = cover.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return body.replace(new RegExp(`\\n!\\[[^\\]]*\\]\\(${escaped}\\)\\n`, "g"), "\n");
}

function trimBody(body) {
  let out = body;
  for (const re of BOILERPLATE_PARAS) out = out.replace(re, "");
  for (const re of BOILERPLATE_SECTIONS) out = out.replace(re, "");
  out = dedupeImages(out);
  out = out.replace(/\n{3,}/g, "\n\n");
  return out;
}

function simplifyInstallSteps(fm) {
  const count = (fm.match(/^installSteps:/m) && fm.match(/^\s+- title:/gm)?.length) || 0;
  if (count <= 3) return fm;
  const slug = fm.match(/^slug:\s*"([^"]+)"/m)?.[1] ?? "game";
  const short = slug.replace(/-game$/, "");
  const block = `installSteps:
  - title: "Download the APK"
    description: "Use the official mirror linked on this page; verify file size before opening."
  - title: "Install and register"
    description: "Allow one-time unknown-source install, then sign up with your mobile number and OTP."
  - title: "Test wallet flows"
    description: "If you deposit, start small; confirm JazzCash or EasyPaisa labels before scaling."
`;
  return fm.replace(/installSteps:\n(?:  - title:[^\n]+\n    description:[^\n]+\n)+/m, block);
}

let changed = 0;
for (const file of fs.readdirSync(gamesDir).filter((f) => f.endsWith(".mdx"))) {
  const fp = path.join(gamesDir, file);
  const raw = fs.readFileSync(fp, "utf8");
  const parsed = parseFrontmatter(raw);
  if (!parsed) continue;

  let fm = dedupeFrontmatterKeywords(parsed.fm);
  fm = simplifyInstallSteps(fm);
  let body = trimBody(parsed.body);
  body = stripCoverImage(fm, body);
  const next = fm + body;

  if (next !== raw) {
    fs.writeFileSync(fp, next);
    changed++;
    console.log("trimmed", file);
  }
}

console.log(`Done. ${changed} files updated.`);
