import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const repoSrc = path.join(root, "scripts/sources/jami-777-raw.md");
const cursorSrc = path.join(
  process.env.HOME,
  ".cursor/projects/Users-macbookpro-Desktop-projects-gameistanpro/uploads/jami-777-game-0.md",
);
const src = process.env.JAMI_SOURCE_MD?.trim() || (fs.existsSync(repoSrc) ? repoSrc : cursorSrc);
const out = path.join(root, "content/games/jami-777-game-pakistan.mdx");

const OFFICIAL = "https://jami777vip3.com/?dl=55fcst";
const IMG = {
  cover: "https://gameistan.com.pk/wp-content/uploads/2025/12/Gemini_Generated_Image_3motk83motk83mot.png",
  s1: "https://gameistan.com.pk/wp-content/uploads/2025/11/download-32.jpeg",
  s2: "https://gameistan.com.pk/wp-content/uploads/2025/11/download-16.jpeg",
  s3: "https://gameistan.com.pk/wp-content/uploads/2025/11/download-6.jpeg",
};

if (!fs.existsSync(src)) {
  console.error("Missing source:", src);
  process.exit(1);
}

let raw = fs.readFileSync(src, "utf8");
const start = raw.indexOf("## Introduction to Jami 777");
const end = raw.indexOf("## Download links");
if (start === -1 || end === -1) throw new Error("Bad source bounds");
let body = raw.slice(start, end).trim();

body = body.replace(/\n---\n/g, "\n\n***\n\n");
body = body.replace(
  /The popularity of continues to surge/g,
  "The popularity of Jami 777 continues to surge",
);
body = body.replace(
  /Understanding the fundamentals of is your first step/g,
  "Understanding the fundamentals of Jami 777 is your first step",
);
body = body.replace(/^jami 777 game$/gim, `![Jami 777 game](${IMG.s1})`);

const sections = new Map();
for (const chunk of body.split(/(?=^## .+$)/m)) {
  if (!chunk.trim()) continue;
  const title = chunk.split("\n")[0].replace(/^## /, "").trim();
  sections.set(title, chunk.trim() + "\n");
}

const downloadBlock = `## Official Jami 777 download (APK)

**Same download URL as the Gameistan listing:** [${OFFICIAL}](${OFFICIAL})

On Android, open that link, download the **Jami 777** APK, enable **one-time** install from unknown sources for your browser if asked, then install from **Downloads** and open the app. Re-verify the file name and app icon match what you expected before logging in or depositing.

![Jami 777 — in-app (Gameistan)](${IMG.s2})

`;

const order = [
  "Introduction to Jami 777 Game",
  "_DOWNLOAD_",
  "What Exactly is Jami 777 Game?",
  "How Jami 777 Game Works: Detailed Mechanics",
  "Complete Rules of Jami 777 Game",
  "Jami 777 Game Paytable and Payouts",
  "Advanced Strategies for Jami 777 Game Success",
  "Tips and Tricks for Playing Jami 777 Game",
  "Common Mistakes Players Make with Jami 777 Game",
  "Jami 777 Game Features You Should Know",
  "Jami 777 Game vs. Competitors",
  "Frequently Asked Questions About Jami 777 Game",
  "Similar Games to Try",
  "Conclusion: Mastering Jami 777 Game",
];

let reordered = "";
for (const t of order) {
  if (t === "_DOWNLOAD_") reordered += downloadBlock;
  else reordered += sections.get(t) || (() => { throw new Error("Missing: " + t) })();
}

reordered = reordered.replace(
  "## Similar Games to Try\n\nIf you enjoy ZT777 Game, you might also like:",
  "## Similar Games to Try\n\nIf you enjoy Jami 777, you might also like:",
);
reordered = reordered.replace(
  /\* 666P Game – Similar casino-style platform\n\* Prpwin game – Offers card games and slots\n\* \*\*ZC777 Game\*\* – Popular earning app\n\* \*\*WinRupees Game\*\* – Real money gaming/,
  `* [666P Game](/666p-game) – Similar casino-style platform
* [Prpwin game](/prpwin-game) – Card games and slots
* [ZC777 Game](https://gameistan.com.pk/zc777-game/) – Popular earning app
* [WinRupees Game](https://gameistan.com.pk/winrupees-game/) – Real money gaming`,
);

reordered = reordered.replace(
  "### Bankroll Management Strategy for Jami 777 Game",
  `![Jami 777 — gameplay (Gameistan)](${IMG.s3})

### Bankroll Management Strategy for Jami 777 Game`,
);

const fm = `---
title: "Jami 777 Game – Complete Guide, Strategies & How to Win 2025"
slug: "jami-777-game"
shortDescription: "Master Jami 777: winning strategies, rules, tips, and gameplay. Official APK link, paylines, paytable, bankroll control, and competitive comparison."
description: "Full Jami 777 guide: what it is, how spins and symbols work, rules, paytable, advanced strategies, mistakes to avoid, FAQ, and the official download mirror used on Gameistan."
version: "v0.1.0"
size: "48mb"
requirements: "Android 5+"
downloads: "—"
rating: 0
votes: 0
category: "casino-games"
tags:
  - "Jami 777"
  - "777"
  - "slot game"
  - "casino"
  - "Pakistan"
  - "APK"
coverImage: "${IMG.cover}"
screenshots:
  - "${IMG.s1}"
  - "${IMG.s2}"
  - "${IMG.s3}"
  - "https://gameistan.com.pk/wp-content/uploads/2025/11/download-1.png"
downloadLinks:
  - "${OFFICIAL}"
isNew: true
featured: false
publishedAt: "2025-12-01"
updatedAt: "2026-04-22"
views: 0
faqs:
  - question: "What is Jami 777 Game?"
    answer: "An online 777/slots-style platform with paylines, paytable, and RNG-based spins; always verify the operator in-app."
  - question: "Is Jami 777 safe and legal?"
    answer: "Varies by region—Pakistan is a grey area for real-money play. Check local rules and only risk disposable funds."
  - question: "Can I win real money on Jami 777?"
    answer: "Marketed as real money on some builds; outcomes are random and the house has an edge."
  - question: "How do I get the APK?"
    answer: "Use the official Gameistan mirror: ${OFFICIAL}"
installSteps:
  - title: "Open official mirror"
    description: "Use ${OFFICIAL} — the same as Gameistan’s Download APK."
  - title: "Install on Android"
    description: "Allow unknown sources for your browser if needed, install the APK, then turn that off again."
  - title: "Create account and play"
    description: "Register with a strong password; read paytable and set strict loss limits before betting."
---

**Official download (same as Gameistan):** [Jami 777 APK](${OFFICIAL})

## Table of contents

- [At a glance](#at-a-glance)
- [Introduction to Jami 777 Game](#introduction-to-jami-777-game)
- [Official Jami 777 download (APK)](#official-jami-777-download-apk)
- [What Exactly is Jami 777 Game?](#what-exactly-is-jami-777-game)
- [How Jami 777 Game Works: Detailed Mechanics](#how-jami-777-game-works-detailed-mechanics)
- [Complete Rules of Jami 777 Game](#complete-rules-of-jami-777-game)
- [Jami 777 Game Paytable and Payouts](#jami-777-game-paytable-and-payouts)
- [Advanced Strategies for Jami 777 Game Success](#advanced-strategies-for-jami-777-game-success)
- [Tips and Tricks for Playing Jami 777 Game](#tips-and-tricks-for-playing-jami-777-game)
- [Common Mistakes Players Make with Jami 777 Game](#common-mistakes-players-make-with-jami-777-game)
- [Jami 777 Game Features You Should Know](#jami-777-game-features-you-should-know)
- [Jami 777 Game vs. Competitors](#jami-777-game-vs-competitors)
- [Frequently Asked Questions About Jami 777 Game](#frequently-asked-questions-about-jami-777-game)
- [Similar Games to Try](#similar-games-to-try)
- [Conclusion: Mastering Jami 777 Game](#conclusion-mastering-jami-777-game)
- [Download](#download)
- [Related guides](#related-guides)

## At a glance

| Field | Value |
| --- | --- |
| Product | Jami 777 — online slot / 777-style game (guide) |
| **APK (Gameistan link)** | [${OFFICIAL}](${OFFICIAL}) |
| Version (listing) | v0.1.0 |
| Size | 48mb |
| OS | Android 5+ |
| Votes (listing) | 0/5 (0) |

![Jami 777 cover art (Gameistan)](${IMG.cover})

`;

const installHow = `**How to install the Jami 777 APK?**

1. Tap the downloaded Jami 777 Game APK file.
2. Touch **install**.
3. Follow the on-screen steps.

**Official link again:** [Download APK](${OFFICIAL})
`;

const related = `

## Download

- [Download APK (official, same as Gameistan)](${OFFICIAL})
- [Mirror (same URL)](${OFFICIAL})

${installHow}

## Related guides

- [Fake casino apps in Pakistan](/guides/fake-casino-apps-pakistan)
- [Best earning games hub (2026)](/guides/best-earning-games-pakistan-2026)
- [JazzCash & EasyPaisa gaming withdrawals](/guides/jazzcash-easypaisa-withdrawals)
- [Safe APK download Pakistan](/guides/safe-apk-download-pakistan)
`;

const final = `${fm}${reordered}
${related}`;

fs.writeFileSync(out, final, "utf8");
const copyDest = path.join(root, "scripts/sources/jami-777-raw.md");
if (src === cursorSrc && !fs.existsSync(copyDest)) {
  fs.mkdirSync(path.dirname(copyDest), { recursive: true });
  fs.copyFileSync(src, copyDest);
  console.log("Cached source to", copyDest);
}
console.log("Wrote", out, final.length, "bytes");
