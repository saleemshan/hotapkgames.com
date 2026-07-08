import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const repoSrc = path.join(root, "scripts/sources/kk33-gameistan-raw.md");
const cursorSrc = path.join(
  process.env.HOME,
  ".cursor/projects/Users-macbookpro-Desktop-projects-gameistanpro/uploads/kk33-game-apk-download-pakistan-earn-real-money-0.md",
);
const src = process.env.KK33_SOURCE_MD?.trim() || (fs.existsSync(repoSrc) ? repoSrc : cursorSrc);
const out = path.join(root, "content/games/kk33-game-apk-pakistan.mdx");

const OFFICIAL = "http://www.kk33com.org/?r=vog1094";
const IMG = {
  cover: "https://gameistan.com.pk/wp-content/uploads/2025/10/download-26.jpeg",
  s1: "https://gameistan.com.pk/wp-content/uploads/2025/11/download-32.jpeg",
  s2: "https://gameistan.com.pk/wp-content/uploads/2025/11/download-16.jpeg",
  s3: "https://gameistan.com.pk/wp-content/uploads/2025/11/download-6.jpeg",
  gemini: "https://gameistan.com.pk/wp-content/uploads/2025/12/Gemini_Generated_Image_cdgw0wcdgw0wcdgw.png",
};

if (!fs.existsSync(src)) {
  console.error("Missing source file:", src);
  process.exit(1);
}
const raw = fs.readFileSync(src, "utf8");
let body = raw
  .slice(raw.indexOf("## Description"), raw.indexOf("## Download links"))
  .trim();
body = body.replace(/^## Description/m, "## Introduction");
body = body.replace(/\n---\n/g, "\n\n***\n\n");

/** @type {Map<string, string>} */
const sections = new Map();
const parts = body.split(/(?=^## .+$)/m).filter((p) => p.trim());
for (const p of parts) {
  const first = p.split("\n")[0];
  const title = first.replace(/^## /, "").trim();
  sections.set(title, p.trim() + "\n");
}

const order = [
  "Introduction",
  "The Big Question: Is KK33 Game Real or Fake?",
  "What Exactly is KK33 Game APK? (Breaking It Down Simply)",
  "Why KK33 Game APK is Gaining Attention in Pakistan",
  "Understanding the Risks (What They Don’t Tell You)",
  "How KK33 Game Actually Works (Complete Breakdown)",
  "Detailed Feature Analysis",
  "The Features That Actually Matter",
  "Real User Testimonials (The Good, Bad, and Ugly)",
  "Frequently Asked Questions (Honest Answers)",
  "Safe Usage Guide (If You Decide to Try)",
  "Honest Pros and Cons Summary",
  "Alternatives to Consider (Safer Options)",
  "The Verdict: Should You Download KK33 Game?",
  "My Personal Recommendation",
  "Final Thoughts: The Uncomfortable Truth About Earning Apps",
  "How to Download KK33 (If You’re Determined)",
  "Stay Updated and Stay Safe",
  "Bottom Line: Is KK33 Game Worth It?",
];

let reordered = "";
for (const t of order) {
  const b = sections.get(t);
  if (!b) {
    const keys = [...sections.keys()];
    const found = keys.find((k) => k === t) || keys.find((k) => k.replace(/[''\u2019]/g, "'") === t.replace(/[''\u2019]/g, "'"));
    if (!found) {
      throw new Error(`Missing section "${t}"\nHave: ${keys.join("\n")}`);
    }
    reordered += sections.get(found);
  } else reordered += b;
}

const blKey = "Bottom Line: Is KK33 Game Worth It?";
const bl = sections.get(blKey);
if (bl) {
  const cut =
    bl.split(/\*\*⚠️ Critical Legal Disclaimer:\*\*/)[0].replace(/\n*\*{3,}\s*$/g, "").trim() + "\n";
  reordered = reordered.replace(bl, cut);
}

reordered = reordered.replace(
  /## How to Download KK33 \(If You’re Determined\)\s*\n\nAgainst my better judgment, here’s the safest approach:\n\n\*\*Step 1:\*\* Search .+?\n\n\*\*Step 2:\*\* Look for the most professional-looking website with:\n\n\* HTTPS security\n\* Working contact information\n\* Consistent branding\n\* Recent updates\/news\n\n\*\*Step 3:\*\* Download the APK from that source only\n\n/s,
  `## How to Download KK33 (If You’re Determined)

Against my better judgment, here’s the approach — use the **same official entry point the Gameistan listing uses:** [${OFFICIAL}](${OFFICIAL})

**Step 1:** Open that URL on your phone. Avoid random re-uploads and “mod” APKs.

**Step 2 (optional cross-check):** You can still search “KK33 Game official Pakistan” in Google and compare the result to the same domain.

**Step 3:** Only download the APK from that official flow, then follow the rest of this section.

`,
);

const disStart = raw.indexOf("**⚠️ Critical Legal Disclaimer:**");
const disEnd = raw.indexOf("**Found this review helpful?**");
let disBlock = raw.slice(disStart, disEnd).trim();
disBlock = disBlock.replace(/\n+---\s*$/g, "");

const fm = `---
title: "KK33 Game APK Pakistan 2025: Is It Legit? Real Money Earning Review + Safe Download Guide"
slug: "kk33-game"
shortDescription: "KK33 Game APK Pakistan 2025 review: legit or scam? Safe download, JazzCash withdrawal, earning potential, security risks, and realistic income expectations."
description: "Comprehensive KK33 Game review for Pakistan: real vs fake, JazzCash and EasyPaisa, risks, features, withdrawal reality, FAQ, and the official download link."
version: "V2.3.45"
size: "8.9 MB"
requirements: "Android 5+"
downloads: "1000k"
rating: 4
votes: 5
category: "casino-games"
tags:
  - "KK33"
  - "KK33 Game"
  - "KK33 APK"
  - "Download KK33"
  - "KK33 Real Money Game"
  - "JazzCash"
  - "EasyPaisa"
  - "Android Earning Apps 2025"
  - "Casino Games APK 2025"
  - "Online Earning Games in Pakistan"
coverImage: "${IMG.cover}"
screenshots:
  - "${IMG.s1}"
  - "${IMG.s2}"
  - "${IMG.s3}"
  - "${IMG.gemini}"
downloadLinks:
  - "${OFFICIAL}"
isNew: true
featured: false
publishedAt: "2025-10-31"
updatedAt: "2026-04-22"
views: 0
faqs:
  - question: "Is KK33 Game completely safe to use?"
    answer: "Not completely. Some users cash out, but the platform is unregulated; use minimal amounts and treat withdrawals as uncertain."
  - question: "Can I really earn money from KK33 Game?"
    answer: "Some users earn small amounts short term; most lose long term. The model favors the house."
  - question: "How long do withdrawals take?"
    answer: "Small amounts often 30 minutes–6 hours; medium 6–48 hours; large amounts are often problematic."
  - question: "Is KK33 on iPhone?"
    answer: "No — Android only. iOS versions on random sites are usually fake."
  - question: "Do I need ID to withdraw?"
    answer: "Usually CNIC and selfie; you are giving sensitive data to an unregulated operator."
  - question: "What if I lose money?"
    answer: "No refunds. Losses are final."
installSteps:
  - title: "Get the official APK"
    description: "Open the Gameistan mirror: ${OFFICIAL} — download only from that official flow."
  - title: "Install on Android"
    description: "Allow one-time unknown-source install for your browser, then install the APK and turn the permission off after."
  - title: "Register and link wallet"
    description: "Sign up with OTP, use a strong unique password, then link JazzCash or EasyPaisa only as needed."
playerReviews:
  - name: "Kashif"
    place: "Rawalpindi"
    rating: 4
    text: "Deposited PKR 500, won PKR 1,200, withdrew PKR 1,000 in about 45 minutes to JazzCash. Not depositing more."
  - name: "Sana"
    place: "Lahore"
    rating: 4
    text: "Referral paid about PKR 800; withdrawal took 8 hours. Did not play myself."
  - name: "Ahmed"
    place: "Karachi"
    rating: 2
    text: "Larger win — withdrawal stuck in review; partial payout only after long support ping-pong."
---

**Official APK:** [KK33 — same link as Gameistan Download / Star Playing / Signup](${OFFICIAL})

## Table of contents

- [At a glance](#at-a-glance)
- [Introduction](#introduction)
- [The Big Question: Is KK33 Game Real or Fake?](#the-big-question-is-kk33-game-real-or-fake)
- [What Exactly is KK33 Game APK? (Breaking It Down Simply)](#what-exactly-is-kk33-game-apk-breaking-it-down-simply)
- [Why KK33 Game APK is Gaining Attention in Pakistan](#why-kk33-game-apk-is-gaining-attention-in-pakistan)
- [Understanding the Risks (What They Don’t Tell You)](#understanding-the-risks-what-they-dont-tell-you)
- [How KK33 Game Actually Works (Complete Breakdown)](#how-kk33-game-actually-works-complete-breakdown)
- [Detailed Feature Analysis](#detailed-feature-analysis)
- [The Features That Actually Matter](#the-features-that-actually-matter)
- [Real User Testimonials (The Good, Bad, and Ugly)](#real-user-testimonials-the-good-bad-and-ugly)
- [Frequently Asked Questions (Honest Answers)](#frequently-asked-questions-honest-answers)
- [Safe Usage Guide (If You Decide to Try)](#safe-usage-guide-if-you-decide-to-try)
- [Honest Pros and Cons Summary](#honest-pros-and-cons-summary)
- [Alternatives to Consider (Safer Options)](#alternatives-to-consider-safer-options)
- [The Verdict: Should You Download KK33 Game?](#the-verdict-should-you-download-kk33-game)
- [My Personal Recommendation](#my-personal-recommendation)
- [Final Thoughts: The Uncomfortable Truth About Earning Apps](#final-thoughts-the-uncomfortable-truth-about-earning-apps)
- [How to Download KK33 (If You’re Determined)](#how-to-download-kk33-if-youre-determined)
- [Stay Updated and Stay Safe](#stay-updated-and-stay-safe)
- [Bottom Line: Is KK33 Game Worth It?](#bottom-line-is-kk33-game-worth-it)
- [Critical legal disclaimer](#critical-legal-disclaimer)
- [Download](#download)
- [Related guides](#related-guides)

## At a glance

| Field | Value |
| --- | --- |
| Developer / publisher | KK33 Gaming Studio / KK33 Official (per listing) |
| Official site (stated) | [kk33game.com](https://kk33game.com) |
| **APK (same as Gameistan button)** | [${OFFICIAL}](${OFFICIAL}) |
| Category | Casino / online earning |
| **Version** | V2.3.45 |
| **Size** | 8.9 MB |
| **Downloads (stated)** | 1000k |
| **Rating (listing)** | 4/5 (5 votes) |

![KK33 — cover art (Gameistan)](${IMG.cover})

![KK33 — promotional / UI (Gameistan)](${IMG.gemini})

`;

const afterFeatures = reordered.indexOf("## The Features That Actually Matter");
const firstChunk = reordered.slice(0, afterFeatures);
const restFromFeatures = reordered.slice(afterFeatures);
const withImgAfterFeatures =
  firstChunk + `\n\n![KK33 — Gameistan screenshot 1](${IMG.s1})\n\n` + restFromFeatures;

const withImg2 = withImgAfterFeatures.replace(
  "### Customer Support Experience",
  `![KK33 — Gameistan screenshot 2](${IMG.s2})

### Customer Support Experience`,
);

const moreImg = withImg2.replace(
  "## Honest Pros and Cons Summary",
  `![KK33 — Gameistan screenshot 3](${IMG.s3})

## Honest Pros and Cons Summary`,
);

const related = `

## Critical legal disclaimer

${disBlock}

**Found this review helpful?** Share it with friends asking about KK33. Honest information helps everyone make better decisions.

**Have experience with KK33?** If your site supports comments, add your story — real user feedback helps the community stay informed and safe.

## Download

- [Download / Star Playing / Signup (official, same as Gameistan)](${OFFICIAL})
- [Open official mirror again](${OFFICIAL})

**How to install the KK33 APK?**

1. Tap the downloaded KK33 APK file.
2. Touch **Install**.
3. Follow the on-screen steps.

## Related guides

- [Fake casino apps in Pakistan](/guides/fake-casino-apps-pakistan)
- [Best earning games hub (2026)](/guides/best-earning-games-pakistan-2026)
- [JazzCash & EasyPaisa gaming withdrawals](/guides/jazzcash-easypaisa-withdrawals)
- [Safe APK download Pakistan](/guides/safe-apk-download-pakistan)
`;

const final = `${fm}${moreImg}
${related}`;

fs.writeFileSync(out, final, "utf8");
console.log("Wrote", out, "chars", final.length);
