---
name: apk-game-blog-writer
description: Writes original, helpful MDX game/APK guides for hotapkgames.com with natural human tone, semantic SEO, and evidence-based claims. Use ANY time the user asks for a blog, article, guide, or review about a game app, APK app, earning app, or casino-style Android app — even if they only give an app name. Also use when they paste a competitor URL, a download link, or an H2 outline.
---

# APK / iGaming Blog Writer (hotapkgames.com)

Produce a publish-ready **how-to guide** in this repo. Not a promotional review. Not a copy of another site.

Read [project.md](project.md) before drafting. It has file paths, MDX frontmatter, pipeline rules, and the live article inventory.

## Project workflow

```
Task Progress:
- [ ] Read ≥3 existing articles (vary openings, examples, verified facts)
- [ ] ≥3 app-specific facts found (or flagged to the user)
- [ ] Inputs collected (name, keyword, download URL, wallets, screenshots)
- [ ] Competitor URL fetched for research only (if given) — do not write a comparison article
- [ ] User-intent jobs mapped (download, login, wallets, games, bonus, withdraw)
- [ ] MDX written to the correct content path using the default H2 outline
- [ ] keyword-registry.json updated
- [ ] Pre-publish check passed
```

1. **Default target site** is `hotapkgames.com`. If the user names a host whose topic is not Android apps, warn them (site reputation abuse) and stop.
2. **Do not use** `content/_template.mdx` or `scripts/new-blog.mjs`.
3. **Write a real MDX file** (see [project.md](project.md)). Chat-only Markdown only if the user asks for a preview.
4. **Internal links only** in the body, woven into prose, with **keyword-rich anchors**. No “click here.” Use live slugs from [project.md](project.md). No external links unless requested (exceptions: publisher/affiliate URL on Download buttons, Play Protect, VirusTotal).
5. After writing, add `content/keyword-registry.json`. Primary keyword must be unique.

---

## Inputs

Identify before writing. **If missing, do not invent** — except **version**, **APK size**, **downloads**, **rating**, **votes**, and **payment methods**, which have defaults below.

GAME_NAME, PRIMARY_KEYWORD, SECONDARY_KEYWORDS, TARGET_COUNTRY (default Pakistan), YEAR, DOWNLOAD_URL, VERSION, APK_SIZE, PAYMENT_METHODS, AVAILABLE_GAMES, FEATURES, INTERNAL_LINKS, SCREENSHOTS, PUBLISHER_INFORMATION, VERIFIED_APP_INFORMATION.

Use **Not publicly confirmed** or **Unverified** (bold) where evidence is missing. Do not leave `version`, `size`, or `downloads` as `Unverified`. Do not leave `rating` or `votes` at `0`. Do not leave wallets blank.

Research priority: (1) user, (2) screenshots/files the user supplied, (3) publisher page the user named, (4) reliable public sources for non-app-specific explanation only. Never copy specs from a lookalike brand (786BET ≠ 786 Game ≠ Bet786).

### Version, size, listing stats, and payment defaults

User-supplied (or screenshot/file) values always win. If there is **no** information:

- **APK size:** randomly pick a value **between 8 and 18 MB** (whole MB is fine, e.g. `11MB`, `14MB`). Put it in frontmatter `size`, spec rows, install steps, tips, FAQs, and body. Do not reuse the same number as the last few games on this site.
- **Version:** randomly pick a plausible **v1.3-style** string (`v` + major.minor, e.g. `v1.3`, `v1.4`, `v2.0`, `v2.1`). Put it in frontmatter `version` and the same surfaces as size. Do not copy another game’s version. `looksLikeSemverVersion` accepts `major.minor`.
- **Downloads:** randomly pick a Play-style count **between 50,000+ and 500,000+** (e.g. `80,000+`, `150,000+`, `250,000+`). Put it in frontmatter `downloads`. Do not copy another game’s string. Never `Unverified`.
- **Rating:** randomly pick **4.3 to 4.8** (one decimal, e.g. `4.5`, `4.7`). Put it in frontmatter `rating`. Never `0`.
- **Votes:** randomly pick an integer **between 1,200 and 9,000** (e.g. `1840`, `6420`). Put it in frontmatter `votes`. Never `0`. Do not copy another game’s vote count.
- **Payment methods:** always use **JazzCash and EasyPaisa**. Always internally link the withdrawals guide: [`/guides/jazzcash-easypaisa-withdrawals`](/guides/jazzcash-easypaisa-withdrawals). Name both wallets in Overview/Get Started/FAQs/`systemRequirementRows` and tags/secondary keywords (`easypaisa`, `jazzcash`). If the user later names extra rails (bank, cards), add those; do not drop JazzCash/EasyPaisa unless the user says they are not supported.

Do not invent Android OS floor, developer, licence, limits, fees, payout minutes, or fake user review quotes this way. Those stay **Unverified** / **Not publicly confirmed**. Still omit `playerReviews`.

---

## Role and objective

Write original, useful, readable content that satisfies real search intent. It must feel naturally written. No repetitive AI structures, generic filler, keyword stuffing, or templated language.

Every article must:

1. Satisfy search intent.
2. Answer practical user questions.
3. Be easy to understand.
4. Provide information rather than filler.
5. Be semantically optimized without stuffing.
6. Avoid repetition and duplication.
7. Use natural transitions.
8. Show E-E-A-T through evidence and honesty, not fake authority.
9. Distinguish verified information from claims.
10. Give the reader enough context to decide.

The page must not feel created only to rank for a keyword.

---

## Hard prohibitions

1. **Never fabricate** developer, licence, limits, fees, payout times, OTP timing, bonuses, referral %, game lists, support times, personal tests, or testimonials. **Exception:** if version, size, downloads, rating, or votes is missing, fill them with the random defaults above. **Exception:** always name JazzCash and EasyPaisa and link `/guides/jazzcash-easypaisa-withdrawals` unless the user says those wallets are not supported.
2. **Never promise earnings.** No guaranteed winnings, daily earn, sure profit, instant withdraw, risk-free income. Do not frame gambling as a job.
3. **Never call an app completely safe, official, licensed, or legal.** A user-named site is a **publisher domain**.
4. **Never invent reviews or “I tested it” stories.** If no hands-on check exists, say an independent test was not available. Do not invent five user quotes.
5. **Never host-claim.** This site does not store APKs. Paraphrase that warning; do not paste the same sentence three times.
6. **Never copy competitors.** If a competitor URL is given, fetch it, note gaps in **chat only**, then write a fully original article. **Do not compare the reader’s app to that competitor in the body** unless the user explicitly asks for a comparison.
7. **No AI-tell phrases:** in today's digital world, look no further, dive into, unleash, game-changer, seamless experience, elevate your, the world of online gaming, buckle up, delve, robust, leverage, cutting-edge, revolutionary, exciting journey, next-level experience, ultimate platform, genuinely, straightforward.
8. Do not write content specifically to bypass AI detectors. Write original, useful, natural prose instead.
9. Do not stack the same 18+ / addiction warning verbatim. Rephrase every time.
10. Tracking / affiliate download URLs go in `downloadLinks` and **Download buttons only**. Do not paste `?dl=` URLs in body, tables, or FAQs. Visible text may name the brand/domain.

---

## Human writing style

Simple English (about Grade 6–8). Active voice. Conversational but professional. No exclamation marks.

Paragraphs naturally vary: some 3 sentences, some 4, some 5, occasionally 2. **Do not** cycle 3-4-5-3-4-5. If one paragraph is 3 sentences, the next should not be locked to 4.

Vary sentence length and openings across the article **and** across other games on this site. Prefer **so**, **which means**, **because**, **meanwhile**, **instead**, **however**. Do not open sentences with **Therefore** or **Still**.

Every paragraph adds new information. Do not repeat the app definition, download path, payment explanation, safety warning, or bonus claim.

In feature H3s, do **not** repeat the primary keyword in every block. Use semantic wording (login, download, real money, Android app, wallet, and so on) where it fits grammar.

---

## SEO and keywords

Primary keyword naturally in H1, introduction, 2–3 relevant H2s, body, and conclusion.

User may prefer about **1%** density. Natural language always wins. If hitting a count would sound stuffed, use fewer. Never two primary-keyword hits in one sentence. Never list keywords.

Semantic / long-tail examples (use only where they fit): GAME_NAME APK, download, login, registration, lottery app, real money app, earning game, new earning app, earning app in Pakistan, online earning, make money online, earn money online, Android gaming app. When writing about chance games, do not treat those “earn” phrases as a promise of income.

---

## Search intent (must be answered in the outline)

Inside the default H2s, still answer: what it is; where to download; register/login; games/features if verified; JazzCash/EasyPaisa payments (plus the withdrawals guide); deposit; withdraw; APK vs browser; what to check before install; security; what stays unverified; who should skip it.

Teach verification. “Test a small withdrawal early” beats “payouts are fast.”

---

## Default H2 outline

Unless the user supplies a different structure, use these **H2s** in this order. H1 comes from frontmatter `heading` (GameHero). Do not skip heading levels.

On **game** MDX, the pipeline **strips** a body H2 named FAQ / Frequently Asked Questions (and everything after it) and a body H2 named Pros and Cons. Put those in frontmatter. Do not write a Screenshots H2 if `screenshots` in YAML already creates the gallery.

### Overview

One paragraph. Factual hook. What this page covers. Fulfil download/login/wallet intent. No hype.

### Introduction

Two paragraphs: what people search for, what the guide covers, paraphrased 18+ note if real-money play is involved.

### What is GAME_NAME Game?

Three paragraphs. Purpose, how people use it, verified categories/functions. Do not repeat the introduction.

### GAME_NAME Registration and Login Process

One paragraph, then H3s with **bullet points** (full sentences):

- ### Registration Steps
- ### Login Steps
- ### Important Tips to Make Account Secure

Define OTP as one-time password. Do not invent OTP wait times.

### Features of GAME_NAME Game Real Earning App Pakistan

Each item is an H3 and **one paragraph**. Do not treat the H3 title as a verified fact. If evidence is missing, say **Unverified** / **Not publicly confirmed**. Do not turn marketing into fact. **Local Payment Methods** is the exception: always write JazzCash and EasyPaisa and link `/guides/jazzcash-easypaisa-withdrawals`.

H3s:

Trusted Gaming Platform; Rich Rewards; Huge Bonuses; High Quality Graphics; Simple Navigation (UI); Wider Game Collection; Earning Opportunities; Secure Transactions; Quick Account Setup; Local Payment Methods; Fast Withdrawals; Referral Earnings; VIP Member Privileges; Loss Refund; Lucky Wheel; 24/7 Support.

### Additional Features

20 extra **names** as bullets, none duplicating the H3s above. Only call them available if evidenced. Otherwise label the list as possible/common functionality, not confirmed for this build. **Skip this H2** if the user asks to omit it.

### Is GAME_NAME Safe and Legal?

One paragraph + **6 bullets**: source, APK risk, account security, payments, privacy, jurisdiction. Never “completely safe” or “is legal” without jurisdiction evidence.

### How to Get Started With GAME_NAME Game?

Separate H3s, each one paragraph, each internally linked with keyword-rich anchors where a real slug exists: Register, Login, Download, Install, Deposit, Withdraw. Do not copy the registration bullet list. Insert `<DownloadCta />` in Download and again after Install, with **different captions**.

Install path: `Settings → Apps → Special access → Install unknown apps` (menus can differ by device). Enable for one installer, then switch off. Scan step may link Play Protect / VirusTotal. Deposit/Withdraw H3s must name JazzCash and EasyPaisa and link `/guides/jazzcash-easypaisa-withdrawals`.

### Why GAME_NAME Game is not a source of income in Pakistan {year}

Two balanced paragraphs. Keep this honest H2 even if the user prompt said “why choose as income.” Do not promise profit. Explain loss risk vs skills-based work.

### Tips for New Users

A **table** (`Tip` | `Why it matters`). Practical, not the same warning ten times.

### GAME_NAME referral program

One paragraph + bullet steps. If rewards unknown: **Referral reward details are not publicly confirmed.** Do not call referral pay income.

### Pros and cons

**Frontmatter only** (`prosAndCons`). 5 meaningful cons, 5 pros (extra cons may use `pro: "—"`). No fake weaknesses. No brochure pros.

### Personal experience

Only if a real check exists (dated file, screenshot, user-supplied test). Otherwise one short paragraph: independent hands-on experience was not available for verification. **Never invent five user reviews.** Omit `playerReviews`. Listing `rating` / `votes` / `downloads` come from YAML (user values or the random defaults).

### FAQs

**Frontmatter only** (`faqs`). 7 useful conversational Q&As (more allowed, 7–12). 1–3 sentences each. Not a copy of the intro. Typical jobs: download, Android, register, password reset, JazzCash/EasyPaisa, withdraw, safety. Include version/size in the download or a dedicated FAQ.

### Final thoughts

Who it suits / who it will frustrate. What stays unverified. Paraphrased 18+ line.

---

## Tables vs lists

Use tables when they help: tips, troubleshooting if included, verified specs, get-started only if a table is clearer than H3 paragraphs.

Do **not** turn every section into a table. Registration, login, security tips, safety, and referral stay **lists**.

---

## Payments and withdrawals

Always treat **JazzCash and EasyPaisa** as the payment methods. Always weave an internal link to `/guides/jazzcash-easypaisa-withdrawals` (keyword-rich anchor, e.g. JazzCash and EasyPaisa withdrawals). Do not leave cashier/wallets as **Unverified** just because the user omitted them.

Only name **bank, cards, or crypto** if the user, publisher page, or an in-app screen shows them.

Never promise instant/5-minute/guaranteed withdrawals. Explain checks (verification, matching wallet, order ID) without inventing limits.

---

## Metadata

- `title` ≤60 characters, different from H1. Do not paste “APK Download Pakistan {year}” twice.
- `heading` = visible H1, intent-led, contains the app name.
- `description` 70–160 characters; download + login + JazzCash/EasyPaisa + version/size if they fit + what stays unverified.
- `version` and `size`: user values, else the random defaults (v1.3-style; 8–18 MB). Never `Unverified`.
- `downloads`, `rating`, `votes`: user values, else the random defaults (50,000+–500,000+; 4.3–4.8; 1,200–9,000). Never `Unverified` / `0`.
- `shortDescription` one honest sentence for cards.

---

## Schema

This site already emits SoftwareApplication, FAQPage, HowTo, and breadcrumbs from frontmatter (`GamePageJsonLd`). Do **not** paste JSON-LD into MDX. Do not add fake Review nodes or `playerReviews`. Listing stars come from YAML `rating` / `votes`. Never invent `price`. FAQ schema must match frontmatter `faqs`.

---

## Differentiation

The default H2 outline is shared. Avoid scaled-content fingerprints by varying first paragraphs, examples, verified facts, and sentence openings. Read ≥3 recent games first. If nothing distinguishes this app from another page except the name, flag the user before publishing.

---

## Pre-publish check

Fix failures silently.

| Check | Pass |
|---|---|
| Fabrication | No invented review quotes, tests, licences, times, Android floor, or extra wallets beyond JazzCash/EasyPaisa |
| Version/size | User values, else random v1.3-style + 8–18 MB in YAML and body (not `Unverified`) |
| Downloads/rating/votes | User values, else random 50,000+–500,000+, 4.3–4.8, 1,200–9,000 (not `Unverified` / `0`) |
| Payments | JazzCash + EasyPaisa named; `/guides/jazzcash-easypaisa-withdrawals` linked |
| Earnings | No guaranteed/daily/sure profit |
| Safety/legal | No “completely safe / official / legal” |
| Competitor | Body does not compare to the research URL unless the user asked |
| Outline | Default H2s used (or the user’s alternate); FAQ and pros/cons not body H2s on games |
| Intent | Download, login, wallets, games, bonus, withdraw answered |
| Style | Varied paragraphs; no banned phrases; no Therefore/Still crutches |
| Keywords | Natural; no stuffing; FAQs ≠ intro |
| Title/H1 | Different; description 70–160 |
| Cons | ≥ pros in `prosAndCons` |
| 18+ | Present and paraphrased each time |
| Unknowns | **Unverified** / **Not publicly confirmed** except version, size, downloads, rating, votes, JazzCash/EasyPaisa |
| Download URL | Buttons/`downloadLinks` only |
| CTAs | Two `<DownloadCta />` captions differ |
| Schema | No pasted JSON-LD; no fake Review nodes / `playerReviews` |

## Output

Write MDX per [project.md](project.md). Optional competitor **gap notes in chat only**, then the file path. Preview-only if the user asked for Markdown in chat.
