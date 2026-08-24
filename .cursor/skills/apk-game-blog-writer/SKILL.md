---
name: apk-game-blog-writer
description: Writes SEO-friendly, spam-update-resistant MDX guide articles about Android APK gaming / iGaming apps for hotapkgames.com (e.g. WU777, Jeeto999, QZR888, 786BET, LAAM777). Use ANY time the user asks for a blog, article, guide, or review about a game app, APK app, earning app, or casino-style Android app — even if they only give an app name. Also use when the user says "outrank this competitor" and pastes a URL to a similar app page.
---

# APK / iGaming Blog Writer (hotapkgames.com)

Produce a publish-ready **how-to guide** for this repo. Not a promotional review.

Read [project.md](project.md) before drafting. It has file paths, MDX frontmatter, pipeline rules, and the live article inventory.

## Project workflow

Copy this checklist and track it:

```
Task Progress:
- [ ] Step 0 differentiation gate (read ≥3 existing articles)
- [ ] Unused angle chosen
- [ ] ≥3 app-specific facts found (or flagged to the user)
- [ ] Competitor URL fetched (if given)
- [ ] User-intent jobs mapped (download, login, wallets, games, bonus, withdraw)
- [ ] MDX written to the correct content path
- [ ] keyword-registry.json updated
- [ ] Pre-publish check passed
```

1. **Default target site** is `hotapkgames.com`. If the user names a host whose topic is not Android apps, warn them (site reputation abuse) and stop.
2. **Do not use** `content/_template.mdx` or `scripts/new-blog.mjs` as the outline. Both are promotional templates and would fingerprint the site.
3. **Write a real MDX file** in this repo (see [project.md](project.md) for path + frontmatter). Chat-only Markdown is allowed only if the user asks for a preview.
4. **Internal links only** in the body, woven into prose, with **keyword-rich anchors** (e.g. “5555 Bet colour prediction review”, not “compare a page such as 5555 Bet”). Use live slugs from [project.md](project.md). No external links unless the user explicitly requests them. Exceptions the user may request: publisher site, affiliate/tracking download URL, Google Play Protect, VirusTotal. Verified publisher or affiliate URLs the user supplies go in game frontmatter `downloadLinks` **and** in get-the-APK / Download CTA hrefs. Visible text may still name the brand; do not call that URL official, licensed, or legal.
5. After the file is written, add the entry to `content/keyword-registry.json`. Primary keyword must be unique.

Then follow every rule below.

---

# APK / iGaming Blog Writer

Produce a publish-ready Markdown article about an Android APK gaming app. The article is a **practical how-to guide**, not a promotional review.

This niche is one of the highest-risk categories Google targets. Spam updates in March, June, and August 2026 all hit it, and the site reputation abuse policy has been enforced since November 2024. **Ranking here is won by not getting caught in a scaled-content sweep, not by keyword density.** Every rule below exists for that reason.

---

## STEP 0 — Differentiation gate (run before writing anything)

Scaled content abuse is the single biggest reason APK sites get deindexed. Publishing twenty pages that differ only by app name is the exact pattern SpamBrain detects. So before drafting:

1. **Read the site's existing articles.** If prior articles for this site are in the workspace, open at least three. If they aren't, ask the user to paste one or tell you which apps are already covered.
2. **Pick an unused angle** from the rotation table below. Never reuse the angle of the most recent two articles.
3. **Find at least three app-specific facts** that are actually different — a distinct game mix, a named payment method, an unusual permission, a specific version quirk, a different regional availability. If the user provides none and you can find none, say so plainly:

   > "I can write this, but nothing distinguishes it from the [X] article beyond the name. Publishing both risks a scaled-content flag. Options: (a) give me app-specific details, (b) publish this and consolidate two older thin pages, or (c) skip it."

   Do not quietly produce a near-duplicate. Flagging is the correct behaviour.

### Angle rotation

| Angle | Framing device | Lead section after intro |
|---|---|---|
| A. User manual | Step-by-step operation, screen by screen | How to install |
| B. Checker's guide | Verified vs unverified up front | Quick answers (user questions) |
| C. Beginner walkthrough | "First 30 minutes with the app" | What is it |
| D. Troubleshooter | Built around what breaks | Login and error fixes |
| E. Money-flow guide | Deposits and payouts as the spine | Payments |
| F. Decision guide | Who it suits and who should skip | Who the app suits |

Each angle changes the **section order**, the **opening three paragraphs**, and the **examples used** — not just adjectives. Two articles with the same angle are duplicates regardless of wording.

---

## Inputs to collect

| Input | Example | Required? |
|---|---|---|
| App name | 786BET, WU777 | Yes |
| Target site | gamesapks.com.pk | Yes |
| Internal link URLs | 3–6 related app pages | Yes |
| App-specific facts | game mix, payment methods, version | Yes — see Step 0 |
| Primary keyword + count | "786bet game", 18–22 uses | If given |
| Secondary keywords | apk, login, com, casino variants | If given |
| Competitor URL | pasted link | Optional |
| Publisher / “official” site | 786.bet | If given — publisher domain, not a licence |
| Affiliate / tracking download URL | `https://example.money/?dl=…` | If given — use for all download CTAs |
| APK size / version from a real file | 8.4MB, v2.3 | If given — do not overwrite with blog spec boxes |
| Screenshot / lobby notes | HOT grid, 0.00 balance | If given — describe what is on the image |

If a competitor URL is given, **fetch it first**, then output a short gap table (their weakness → our advantage) before the article.

---

## Hard prohibitions

These are not style preferences. Breaking any one of them is a spam-policy violation.

1. **Never fabricate.** No invented limits, fees, payout times, licences, developer names, download counts, star ratings, version numbers, app sizes, user counts, OTP wait times, device models, or “I tested withdrawal in X minutes” stories. Unknown = **"Not publicly confirmed"** or **"Unverified"** in bold. First-person is allowed only for checks that actually happened (file size on a dated installer, what a screenshot shows). If you did not time an OTP or cash-out, say so — do not invent 20 seconds.
2. **Never promise earnings.** No "guaranteed winnings", "earn daily", "sure profit", "withdraw instantly".
3. **Never call any app completely safe, official, licensed, or legal.** A user-named “official site” is a **publisher domain**. Risk is reduced, never eliminated. Do not treat SPA leftover copy (KYC/PAGCOR/admin `siteName` strings, other-brand slogans) as proof of a licence.
4. **Never invent trust signals.** No fake testimonials, no "thousands of satisfied users", no made-up review quotes, no placeholder 4.0/2-review blocks.
5. **Never present the page as an official source or download mirror.** Don't imply the site hosts the app. Paraphrase the “we do not host the APK” warning each time it appears — never paste the same sentence three times.
6. **Never publish on an unrelated authority domain.** This is site reputation abuse. If the user names a host site whose topic isn't Android apps, warn them.
7. **No external links** unless explicitly requested (or the safety-scan exception in the workflow). Internal links only, woven into body prose — never listed.
8. **No AI-tell phrasing.** Banned: "in today's digital world", "look no further", "dive into", "unleash", "game-changer", "seamless experience", "elevate your", "the world of online gaming", "buckle up". Also avoid "genuinely", "straightforward", "delve", "robust", "leverage".
9. **Do not copy specs from lookalike brands.** A “786 Game” or “Bet786” page is not 786BET. Do not fill minimums, versions, or sizes from a competitor that titles a different product.
10. **Do not stack identical warnings.** The 18+ / addiction / “money you can afford to lose” line must be rephrased every time it appears (hero banner, intro, safety, finale).

---

## Heading structure

```
# App Name Guide: ...          ← ONE H1 only, contains app name
## Section                     ← main sections
### Subsection                 ← sub-points, FAQ questions, steps
```

The intro is unlabelled prose directly under the H1. Never open with an "Overview" heading.

**Title tag and H1 must differ.** Meta `title` is the SERP string (often “{App} Game APK Download Pakistan {year}”). H1 is a shorter, intent-led line (download + login + wallets, or “review”), not a clone of the title. Google prefers variation; duplicated “APK Download Pakistan 2026” in the title tag is a fail.

Do not append “APK Download Pakistan {year} — Review & Install Guide” if the title already contains that phrase.

---

## User intent (searcher jobs)

Write for what people actually type, not for an editor’s ledger. After the intro, answer these jobs **before** competitor-clash tables:

1. Where do I download the APK? (publisher/affiliate URL, size, version, not Play Store)
2. How do I login / register? (number, password, OTP defined)
3. EasyPaisa / JazzCash — yes/no, then cashier-match
4. What can I play? (lobby grid + Aviator/sports if named on the publisher site)
5. Can I use the website without the APK?
6. Welcome bonus — what the banner shows vs **Unverified** terms
7. How to deposit / withdraw
8. What breaks (OTP, install, pending cash-out)

Lead with a **Quick answers** table (user question → what you can name). Checker angle still uses verified vs unverified — phrase the rows as questions, not “Claim | Status” brochure language.

Browser vs APK: if the publisher site is a web lobby, say so. Menus can differ; the cashier on the path they use is the authority.

---

## Section inventory

These are the building blocks. **The chosen angle decides the order** — do not always run them top to bottom in this sequence, or every article on the site shares an identical outline, which is itself a duplication signal.

| Section | Must contain |
|---|---|
| Intro (no heading) | What it is, where to get it, wallets/games named, 18+ note paraphrased (not copied from the site banner). 3 short paragraphs. First-person only if a real check exists (dated file size, screenshot). |
| Quick answers / known vs unknown | User-question rows. **Unverified** / **Not publicly confirmed** where needed. |
| How to download | 3-row step table + Download CTA. Affiliate/publisher href if the user supplied one. |
| How to install | Exact path `Settings → Apps → Special access → Install unknown apps`, permission **bullets** (not a fifth stacked table), "switch setting back off", manual-update note. Second Download CTA with a **different caption**. |
| Registration / login | Number + password + OTP (define OTP). Full sentences, not clipped fragments. |
| What you can play | Hub grid from screenshot + publisher lobby categories. 5–7 H3s, each = what it does + caveat. Sensory detail from the image (colours, 0.00 balance, button placement). |
| Deposits | 5-step table + four rules in prose, not identical one-line orders. |
| Withdrawals | 5-step table, what to check first, test-early advice, fee-to-release warning. |
| Login issues and fixes | Quick-fix table + forgot password / lost SIM / compromised account |
| Troubleshooting | 8-row problem / cause / fix table |
| Who the app suits | Two-column "may suit you / skip it if" table |
| How it compares | Table vs 2–4 internally linked apps. Their payout minutes are **their** claims, not re-tested here. |
| Why blogs disagree | Version/size clashes, wrong-brand slugs. Do not invent a winner. |
| Is it safe | Habit bullets + trust-signal reality check + legal status varies. Play Protect / VirusTotal links only if the user requested them or this is the sideload-scan step. |
| Tips for new players | Mix prose + bullets. Do not ship ten identical “Do X. Do Y.” fragments. |
| FAQ | Frontmatter only on games (see project.md). Conversational Q&A — **not** a copy of the intro. |
| Final thoughts | A verdict with personality (who it suits / who it will frustrate), what stays unverified, paraphrased 18+ line. |

Minimum: intro, quick answers, install, login, withdrawals, safety, pros/cons (frontmatter), FAQ (frontmatter), final thoughts. Download CTAs after quick answers **and** after install. Comparison table if the body already links other apps. The rest flex by angle.

Do **not** lead with a long competitor-clash ledger or “who it suits” before download/login/wallets. Those can sit later.

**Tables vs mobile:** keep deposit, withdraw, troubleshooting, and quick-answers as tables. Convert simpler blocks (permissions, tips, who-it-suits if it is getting long) to bullets or short prose so the page is not nine stacked tables.

**Internal anchors:** “5555 Bet colour prediction review”, “P999 Game APK review”, “OkPkr Game APK review” — not “compare a page such as 5555 Bet” or “P999 is a separate product” as the only link text.

---

## Helpful-content requirements

Core updates since September 2023 demote pages that exist for search engines rather than readers. So:

- **Every section must answer a question a real user typed.** If a section holds only a keyword, delete it.
- **Depth beats length.** Troubleshooting tables, login fixes, and withdrawal walkthroughs are the reason the page deserves to rank. Never trim them to hit a word target.
- **Stating what you can't confirm is a helpfulness signal.** Competitors guess; the "Not publicly confirmed" markers are the differentiator.
- **Teach verification, don't assert conclusions.** "Test a small withdrawal early" beats "payouts are fast".
- **Write for someone deciding**, not someone already committed.

---

## Reviews-update requirements

- Show evidence of hands-on evaluation: describe what appears on each screen, in what order, and what breaks. Use the screenshot: colours, control placement, 0.00 balance, banner text.
- Cover trade-offs with real weight. A cons table of three soft items reads as promotional.
- Explain how a reader can check claims themselves rather than trusting the page.
- **FAQs must not cannibalize the intro.** Same facts, different register (a person answering a question), 1–2 sentences.

---

## Style rules

- Simple English. Paragraphs of 2–4 sentences. Passive voice under 10%.
- **Vary sentence length.** Let some lines breathe into two clauses. Do not write the whole login/deposit/tips section as clipped fragments (“Password is unique. Do not reuse the PIN.”) dozens of times — that reads as robotic.
- Prefer conversational connectors: **so**, **which means**, **because**, **meanwhile**, **instead**, **however**. Do **not** lean on **Therefore** or **Still** as sentence openers; they are a stiff AI tell.
- Conversational, never chatty. No exclamation marks.
- Every paragraph adds new information. Never restate the heading.
- **Vary sentence openings across the article and across the site.** If three articles all open sections with "The wallet tab shows…", that's a template fingerprint.
- **First-person tester voice** when you have a real check: date, file size, version on the installer, what you saw on the lobby image. Never invent a device model, OTP wait, or withdrawal minute to sound experienced.
- **Verdict personality** in Final thoughts: who will find it usable vs frustrating (patient sideload vs wanting instant payouts / Play Store / a licence). Balanced is not the same as flat.

---

## Keyword handling

- Primary keyword in H1, first 100 words, 2–3 H2s, and the conclusion.
- Hit the requested count naturally, spread evenly. Never two in one sentence.
- Weave secondary keywords where they fit the meaning — domain variants belong in a sentence about mirror sites; "casino game" belongs in the spin/reel feature section.
- Never list keywords or force them into tables.
- If the requested count can't be hit without stuffing, use fewer and say so.

---

## Metadata

On this repo, put these in YAML (`title`, `description`, optional `heading`). Chat preview may still show:

```
**Meta title:** …   (≤60 chars, one instance of “APK Download Pakistan {year}”, no duplicate suffix)
**Meta description:** …   (70–160 chars; lead with download + login + wallets + what stays unverified)
```

H1 (`heading` on games) is **not** a paste of the meta title. Vary the formula between articles. If the last three all read "X Game Guide 2026: APK Install, Login, Deposits", change it.

---

## Site-level warnings to raise

Flag these to the user once, briefly, if relevant. They matter more than anything in the article:

- Missing author identity, disclaimer, privacy policy, or contact page — a YMYL demotion risk.
- Publishing many app pages in a short burst — spread them out.
- Existing thin pages on the same site — consolidating two weak pages beats adding a third.
- The target domain's topic not matching the content — site reputation abuse.

---

## Pre-publish check

Verify every row before returning. Fix failures silently rather than reporting them.

| Check | Pass condition |
|---|---|
| Fabricated data | Zero invented limits, fees, times, ratings, versions, or counts |
| Earnings language | No "guaranteed", "earn daily", "sure profit" |
| Safety absolutism | Never states any app is completely safe, official, or legal |
| Duplicate risk | Angle, section order, opening, and examples differ from prior site articles |
| Template fingerprint | Sentence openings and title formula vary from recent articles |
| Thin sections | Every H2 delivers something actionable |
| User intent | Download, login, wallets, games, bonus, withdraw answered before competitor-clash |
| Title / H1 | Meta title not duplicated; H1 varies; description 70–160 |
| Cons balance | Cons table ≥ pros table in rows |
| YMYL disclosures | 18+ near the top (banner + paraphrased intro), responsible-gaming, jurisdiction warning; each warning unique |
| Unknowns marked | Every unverifiable claim carries **Not publicly confirmed** / **Unverified** |
| Boilerplate | “Does not host the APK” / 18+ lines paraphrased; Download CTA captions differ |
| FAQs | Not a restatement of the intro |
| Therefore / Still | Not used as crutches |
| External links | None unless requested (publisher, affiliate, Play Protect, VirusTotal) |
| AI-tell phrases | None from the banned list |
| Heading structure | Exactly one H1, no skipped levels |
| Fabricated experience | No invented OTP times, devices, or payout minutes |

---

## Output format

On this repo: write the MDX file (frontmatter + body) per [project.md](project.md). Put the meta title in YAML `title`, the visible H1 in `heading`, and the meta description in `description` (`shortDescription` for cards). Optional competitor gap table goes in the chat before confirming the file path.

If the user asked for a preview only: Markdown in chat. Metadata block, optional competitor gap table, then the article. No commentary, no explanation of choices, no word count note.
