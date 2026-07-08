/**
 * Per-slug SEO uniqueness engine for content/games/*.mdx.
 *
 * Deterministically (slug-hash-keyed) varies:
 *   - title
 *   - meta description / shortDescription
 *   - first paragraph "Editor's snapshot" inserted right after frontmatter
 *   - 5 unique FAQs replacing the boilerplate frontmatter `faqs`
 *   - tail "Pakistan reality check" block (replaces our prior generic disclaimer)
 *
 * Idempotent: marker `<!-- uniqueness-v1 -->` skips reprocess unless `--force`.
 *
 * Usage: node scripts/seo-game-uniqueness.mjs [--force]
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import matter from "gray-matter";

const ROOT = process.cwd();
const GAMES_DIR = path.join(ROOT, "content", "games");
const FORCE = process.argv.includes("--force");
const MARKER = "{/* uniqueness-v1 */}";
const MARKER_END = "{/* /uniqueness-v1 */}";

// ---------- helpers ----------
function h(slug, salt = 0) {
  const hex = crypto
    .createHash("sha256")
    .update(`${slug}::${salt}`)
    .digest("hex");
  return parseInt(hex.slice(0, 8), 16);
}
function pick(arr, slug, salt) {
  return arr[h(slug, salt) % arr.length];
}
function pickN(arr, n, slug, salt) {
  const idx = arr.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const seed = h(slug, salt + i);
    const j = seed % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, n).map((i) => arr[i]);
}
function pretty(stem) {
  return stem.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function stem(slug) {
  return slug.replace(/-game$/, "");
}

// ---------- variant banks ----------
const TITLE_TEMPLATES = [
  (b) => `${b} Game APK Download Pakistan 2026 — Honest Review & Mirrors`,
  (b) => `${b} Game Pakistan: APK, JazzCash Withdrawal & Risk Audit (2026)`,
  (b) => `${b} APK Pakistan 2026: Login, EasyPaisa Cash-Out & Real-User Notes`,
  (b) => `Is ${b} Game Safe in Pakistan? 2026 APK Audit + Withdrawal Reality`,
  (b) => `${b} Game Review Pakistan 2026 — Bonuses, Wagering & Wallet Rails`,
];

const DESC_TEMPLATES = [
  (b) =>
    `${b} game APK for Pakistan 2026 — independent audit of mirrors, JazzCash & EasyPaisa cash-out, KYC, bonus wagering, and risk signals before you deposit.`,
  (b) =>
    `Honest 2026 review of ${b} game APK in Pakistan: download mirrors, login flow, real withdrawal expectations, scam signals, and house-edge reality.`,
  (b) =>
    `${b} APK Pakistan: 2026 review covering EasyPaisa & JazzCash payouts, bonus rollover math, fake-mirror checks, and cross-links to safe APK guides.`,
  (b) =>
    `Should you install ${b} game in Pakistan? 2026 audit of payout times, KYC, wagering, install steps, and grey-zone legal status — no hype.`,
  (b) =>
    `${b} game 2026 APK guide for Pakistani players — wallet realism, bonus traps, install hygiene, and editorial scoring against our 12-point rubric.`,
];

const INTRO_HOOKS_CASINO = [
  (b) =>
    `**Editor's snapshot.** ${b} sits in the dense **casino-style PK APK** segment alongside slots and card hybrids. Treat the headline numbers below as publisher-stated, not independently audited — and read the wallet section before depositing.`,
  (b) =>
    `**What you're looking at.** ${b} is a real-money casino-style Android app marketed at Pakistani players. The actual edge sits with the publisher; this page maps the install + wallet flow without the "fixed income" hype that fills the rest of the SERP.`,
  (b) =>
    `**Why this page exists.** Most ${b}-style listicles are recycled affiliate pages with invented Rs. figures. We document only what we can verify against the listing metadata, plus an honest house-edge reminder before bonuses pull you in.`,
  (b) =>
    `**Quick frame.** ${b} is one of dozens of casino-shell APKs targeting JazzCash / EasyPaisa users. Distribution is sideloaded, KYC is publisher-side, and PTA blocks rotate — so any "official partner" claim deserves scrutiny.`,
  (b) =>
    `**Direct answer first:** ${b} is a real-money casino-style APK with the same risk profile as every offshore PK shell — variance against you, slow first withdrawal, and an opaque legal posture. Read on for the mirror, wallet, and scam-signal breakdown.`,
  (b) =>
    `**On this page:** what ${b} actually is (vs marketing copy), how its install + JazzCash / EasyPaisa flow tends to behave for Pakistani users, and the editorial "should you?" verdict at the end.`,
];

const INTRO_HOOKS_COLOR = [
  (b) =>
    `**Editor's snapshot.** ${b} is a **colour-prediction** style app. Rounds are short, payouts look fair, and the **house edge is hidden in the Violet split** — see our payout-math note further down before you fund anything.`,
  (b) =>
    `**What you're looking at.** ${b} sits in the colour-prediction bucket — Red/Green/Violet rounds, server-decided outcomes, and the same ~3–5% mathematical edge that bleeds bankrolls over time. Wallet rails and KYC are publisher-side.`,
  (b) =>
    `**Why this page exists.** Colour-prediction APKs in PK get ranked for "double your money" promises. ${b} is no different in mechanics; the differentiator is **how the publisher handles withdrawals**, which is where you should focus your due diligence.`,
  (b) =>
    `**Quick frame.** Among PK colour-prediction APKs, ${b} markets the same 30s–3min round structure plus referral commissions. The math doesn't care what brand it wears — read the rollover section before claiming any "free" credits.`,
  (b) =>
    `**Direct answer first:** ${b} is a **colour-prediction APK** with referral + bonus mechanics typical of the segment. Withdrawals via JazzCash / EasyPaisa are publisher-dependent — most users see 24–72h on first cashout.`,
  (b) =>
    `**On this page:** what ${b}'s colour rounds actually pay (after the Violet split), how its JazzCash / EasyPaisa withdrawals tend to behave, and the safety + wagering notes before you deposit a rupee.`,
];

const INTRO_HOOKS_SPORTS = [
  (b) =>
    `**Editor's snapshot.** ${b} markets sports + crash hybrids to PK players. Sports books carry their own vig (typically 5–8%); the crash side is volatility-only. Wallet and KYC sit publisher-side and PTA-block risk is real.`,
  (b) =>
    `**What you're looking at.** ${b} is a **sports-betting / crash hybrid** APK aimed at Pakistani users. Marketing screenshots cluster around Aviator and live cricket — actual lines and limits are publisher-controlled and offshore-licensed at best.`,
  (b) =>
    `**Why this page exists.** Sports-betting APKs in Pakistan operate openly grey. ${b}'s product page won't tell you the implied house margin baked into odds — we will, plus how its withdrawal behaviour compares to other JazzCash-era PK apps.`,
];

const INTRO_HOOKS_CARDS = [
  (b) =>
    `**Editor's snapshot.** ${b} is a **Teen Patti / card-style APK** — skill component exists, but rake + bonuses still tilt the long-run EV negative. Withdrawal flow is the variable that actually matters; that's what this page focuses on.`,
  (b) =>
    `**What you're looking at.** ${b} sits in the card-room cluster (Teen Patti, Andar Bahar, Poker hybrids) with PK-targeted JazzCash + EasyPaisa rails. Skill marketing oversells; rake is real.`,
  (b) =>
    `**Why this page exists.** ${b} attracts users who think "skill = profit". Skill helps; the **rake on every pot** plus bonus rollover math still mean most players net negative. Read the wagering note below.`,
];

const FAQ_BANK_GENERIC = [
  (b) => ({
    question: `Is ${b} game legal in Pakistan?`,
    answer: `Real-money gaming sits in a grey zone in Pakistan. ${b} is offshore at best and not licensed for PK. Provincial laws and PTA blocks change frequently — verify your local rules and use only at your own risk.`,
  }),
  (b) => ({
    question: `What is the minimum withdrawal on ${b}?`,
    answer: `Publisher-stated minimums for casino / colour-prediction APKs in Pakistan are typically PKR 100–500. ${b}'s in-app policy is the only authoritative number — confirm before you deposit.`,
  }),
  (b) => ({
    question: `How long does first withdrawal take on ${b}?`,
    answer: `First cashout commonly takes 24–72 hours while KYC clears (CNIC + phone OTP). Repeat withdrawals are faster — minutes to a few hours on JazzCash, up to 24 hours on EasyPaisa during peak load.`,
  }),
  (b) => ({
    question: `Can I really earn from ${b} without depositing?`,
    answer: `Signup bonuses look generous but unlock under wagering rollover (often 20–50×). Realistic non-deposit earnings are PKR 0–200 plus occasional referral commissions — well below minimum-wage rate per hour spent.`,
  }),
  (b) => ({
    question: `Does ${b} support JazzCash and EasyPaisa?`,
    answer: `Most PK-targeted real-money APKs claim both rails. Verify by opening the in-app withdrawal screen, not just by trusting the landing page or marketing copy. See our [wallet guide](/guides/jazzcash-easypaisa-withdrawals).`,
  }),
  (b) => ({
    question: `Is the ${b} APK safe to install?`,
    answer: `Sideloaded APKs carry real risk: swapped builds, dangerous permissions, and OTP phishing vectors. Compare file size against this listing and follow the [safe APK guide](/guides/safe-apk-download-pakistan).`,
  }),
  (b) => ({
    question: `What happens if my ${b} withdrawal is stuck?`,
    answer: `Capture the in-app reference ID and timestamp, open a ticket inside the app (not via random WhatsApp), and never share OTPs to "speed up" payouts. Stuck withdrawals frequently mean incomplete KYC or wagering rollover.`,
  }),
  (b) => ({
    question: `Are ${b}'s referral bonuses worth promoting?`,
    answer: `Referral funnels reward you only when invitees deposit and clear wagering. Pure click-share earnings are negligible. Avoid pressuring friends and never share screenshots of OTP-related flows.`,
  }),
  (b) => ({
    question: `Can I play ${b} on iOS?`,
    answer: `Most PK earning APKs are Android-only. iOS support, when claimed, often points to web wrappers rather than App Store listings. Confirm inside the publisher domain rather than relying on third-party reviews.`,
  }),
  (b) => ({
    question: `What's the realistic monthly outcome from ${b}?`,
    answer: `For most players the long-run expected value is negative because of the house edge. A small minority report short-term wins; treat any deposit as entertainment money, not income, and set a hard PKR cap.`,
  }),
  (b) => ({
    question: `How does ${b} compare with other PK earning apps?`,
    answer: `Differences are mostly cosmetic: round duration, bonus packaging, referral percentages. The structural risk (offshore licensing, sideload distribution, JazzCash/EasyPaisa-only rails) is identical across the segment.`,
  }),
  (b) => ({
    question: `Is ${b} a scam?`,
    answer: `"Scam" is a high bar. ${b} is high-risk by category — offshore, unregulated for PK, and dependent on publisher solvency. That doesn't equal scam, but it does mean every Rs. you deposit is recovery-uninsured.`,
  }),
];

const TAIL_TEMPLATES = [
  (b) => `## Pakistan reality check (${b})

Online real-money APKs sit in a **legal grey zone** in Pakistan. ${b} is not an investment vehicle and we don't claim it is licensed for PK. Verify your local rules, treat any deposit as entertainment spending, and use the resources below before binding wallets.

- [JazzCash & EasyPaisa gaming withdrawals](/guides/jazzcash-easypaisa-withdrawals)
- [Fake casino apps in Pakistan](/guides/fake-casino-apps-pakistan)
- [Safe APK download in Pakistan](/guides/safe-apk-download-pakistan)
- [Best earning games methodology hub (2026)](/guides/best-earning-games-pakistan-2026)`,

  (b) => `## Quick "should I install ${b}?" checklist

Run these before depositing PKR:

1. APK size + version match this listing after download.
2. JazzCash / EasyPaisa withdrawal screen visible **before** you fund the account.
3. Bonus terms disclose wagering rollover (e.g. 30×) up-front.
4. Permissions don't include SMS / Accessibility / Device admin.
5. KYC happens **inside** the app — never via WhatsApp agent.

If 2+ items fail, close the app. More: [12-point earning-game rubric](/guides/best-earning-games-pakistan-2026).`,

  (b) => `## Honest math note

${b}, like every casino-style or colour-prediction APK, runs on a **house edge** of roughly 3–8%. Bonuses and "PKR 5,000 welcome" credits unlock under wagering rollover that mathematically eats the bonus before withdrawal. Read [Earning games without investment in Pakistan](/guides/earning-games-without-investment-pakistan) for the math worked out and what's actually cashable.`,

  (b) => `## What we don't claim about ${b}

We do **not** verify:

- The publisher is licensed for Pakistan (no PK licence regime exists for offshore casino APKs).
- Withdrawal speed beyond what users self-report.
- That bonus terms won't change between your deposit and your cashout.
- That mirror links are stable across PTA enforcement cycles.

Cross-check against [Fake casino apps in Pakistan](/guides/fake-casino-apps-pakistan) before depositing, and treat any deposit as entertainment spending you accept losing.`,
];

// ---------- per-slug processor ----------
function processFile(fp) {
  const slug = path.basename(fp, ".mdx");
  const raw = fs.readFileSync(fp, "utf8");
  if (!FORCE && raw.includes("{/* uniqueness-v1 */}")) return { slug, skipped: true };

  const parsed = matter(raw);
  const data = { ...parsed.data };
  const body = parsed.content;
  const stemSlug = stem(slug);
  const brand = pretty(stemSlug);

  // Title + meta
  data.title = pick(TITLE_TEMPLATES, slug, 1)(brand);
  const desc = pick(DESC_TEMPLATES, slug, 2)(brand);
  data.description = desc;
  data.shortDescription = desc;

  // Intro hook by category
  const cat = data.category || "casino-games";
  const hookBank =
    cat === "color-prediction"
      ? INTRO_HOOKS_COLOR
      : cat === "sports-betting"
        ? INTRO_HOOKS_SPORTS
        : cat === "card-games"
          ? INTRO_HOOKS_CARDS
          : INTRO_HOOKS_CASINO;
  const intro = pick(hookBank, slug, 3)(brand);

  // 5 unique FAQs
  const faqs = pickN(FAQ_BANK_GENERIC, 5, slug, 4).map((fn) => fn(brand));
  data.faqs = faqs;

  // Tail block
  const tail = pick(TAIL_TEMPLATES, slug, 5)(brand);

  // Strip our previously-injected generic disclaimer block (idempotent re-runs)
  let newBody = body.replace(
    /\n##+ +Pakistan legal & wallet reality\n[\s\S]*?(?=\n##+ +|\n---\s*$|$)/g,
    "\n",
  );
  // Also strip prior tail (uniqueness-v1) so --force re-runs cleanly
  newBody = newBody.replace(
    /\n##+ +Pakistan reality check[\s\S]*?(?=\n---\s*\n_Disclaimer:|$)/,
    "\n",
  );
  newBody = newBody.replace(
    /\n##+ +Quick "should I install [\s\S]*?(?=\n---\s*\n_Disclaimer:|$)/,
    "\n",
  );
  newBody = newBody.replace(
    /\n##+ +Honest math note[\s\S]*?(?=\n---\s*\n_Disclaimer:|$)/,
    "\n",
  );
  newBody = newBody.replace(
    /\n##+ +What we don't claim about [\s\S]*?(?=\n---\s*\n_Disclaimer:|$)/,
    "\n",
  );

  // Strip any prior intro snapshot (between marker comments) — handle both
  // legacy HTML comments (would have broken MDX) and current MDX comments.
  newBody = newBody.replace(
    /\{\/\* uniqueness-v1 \*\/\}[\s\S]*?\{\/\* \/uniqueness-v1 \*\/\}\n+/g,
    "",
  );
  newBody = newBody.replace(
    /<!-- uniqueness-v1 -->[\s\S]*?<!-- \/uniqueness-v1 -->\n+/g,
    "",
  );

  const introBlock = `\n${MARKER}\n\n${intro}\n\n${MARKER_END}\n\n`;
  newBody = introBlock + newBody.trimStart();

  // Inject tail before trailing _Disclaimer_ rule, or at end
  if (/\n---\s*\n_Disclaimer:/i.test(newBody)) {
    newBody = newBody.replace(
      /(\n---\s*\n_Disclaimer:)/,
      `\n\n${tail}\n$1`,
    );
  } else {
    newBody = `${newBody.trimEnd()}\n\n${tail}\n`;
  }

  // Tidy blanks
  newBody = newBody.replace(/\n{3,}/g, "\n\n");

  fs.writeFileSync(fp, matter.stringify(newBody, data), "utf8");
  return { slug, skipped: false };
}

function main() {
  const files = fs
    .readdirSync(GAMES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .sort();
  let updated = 0;
  let skipped = 0;
  for (const f of files) {
    const r = processFile(path.join(GAMES_DIR, f));
    if (r.skipped) skipped++;
    else {
      updated++;
      console.log(`OK ${r.slug}`);
    }
  }
  console.log(
    `\nDone. updated=${updated}, skipped=${skipped}/${files.length}${
      FORCE ? " (force)" : ""
    }`,
  );
}

main();
