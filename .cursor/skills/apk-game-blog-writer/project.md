# hotapkgames.com publishing map

Use this file whenever this skill writes or updates a blog on this repo.

## Where files go

| Kind | Path | Live URL |
|---|---|---|
| Game / APK app page | `content/games/{slug}.mdx` | `https://hotapkgames.com/{slug}` |
| Editorial guide | `content/guides/{slug}.mdx` | `https://hotapkgames.com/guides/{slug}` |
| Utility APK (rare) | `content/apps/{slug}.mdx` | `https://hotapkgames.com/apps/{slug}` |

Default new casino / earning / color-prediction APK pages to **games**. Use **guides** only for how-to or comparison pieces that are not a single app.

Slug pattern for games: `{appname}-game` in lowercase, digits kept (example: `786bet-game`).

Do not create `content/_template.mdx` clones. Do not run `scripts/new-blog.mjs`.

## Existing articles (read ≥3 before drafting)

Newest `updated` dates first. Infer each page's angle from section order and opening — most current game pages share a similar review outline, so treat them as **template-fingerprint risk**. Do not copy their H2 sequence, title formula, or sentence openings.

**Games** (newest `updated` first — treat older pages as template-fingerprint risk)

- `content/games/zor77-game.mdx` → `/zor77-game`
- `content/games/xk777-game.mdx` → `/xk777-game`
- `content/games/786bet-game.mdx` → `/786bet-game`
- `content/games/okpkr-game.mdx` → `/okpkr-game`
- `content/games/5555bet-game.mdx` → `/5555bet-game`
- `content/games/done999-game.mdx` → `/done999-game`
- `content/games/3rr-game.mdx` → `/3rr-game`
- `content/games/xx555-game.mdx` → `/xx555-game`
- `content/games/p999-game.mdx` → `/p999-game`
- `content/games/bro444-game.mdx` → `/bro444-game`
- `content/games/9999win-game.mdx` → `/9999win-game`

**Guides** (prefer these as internal links for safety / wallet topics)

- `content/guides/safe-apk-download-pakistan.mdx` → `/guides/safe-apk-download-pakistan`
- `content/guides/jazzcash-easypaisa-withdrawals.mdx` → `/guides/jazzcash-easypaisa-withdrawals`
- `content/guides/fake-casino-apps-pakistan.mdx` → `/guides/fake-casino-apps-pakistan`
- `content/guides/best-earning-games-pakistan-2026.mdx` → `/guides/best-earning-games-pakistan-2026`
- `content/guides/color-prediction-apps-pakistan.mdx` → `/guides/color-prediction-apps-pakistan`
- `content/guides/earning-games-without-investment-pakistan.mdx` → `/guides/earning-games-without-investment-pakistan`

Pick 3–6 of these that are actually related. Weave them into body sentences with **keyword-rich anchors** (e.g. `[5555 Bet colour prediction review](/5555bet-game)`). Never dump them as a list. If the article already links OkPkr / P999 / 5555 Bet, add a comparison table and label their payout times as **their** listings.

Also check `content/keyword-registry.json` so the primary keyword is unique, then add the new entry after writing. Keep registry `secondaryKeywords` / `semanticKeywords` in sync with the MDX.

## MDX frontmatter (games)

Required by Contentlayer. Author is always `HotAPK Games Editorial`. Canonical is `https://hotapkgames.com/{slug}` (games are not under `/games/`).

```yaml
title: "…"                 # SERP title, ≤60 chars. Do NOT paste “APK Download Pakistan 2026” twice.
heading: "…"               # Visible H1. Must differ from title (e.g. download + login + wallets).
slug: "app-game"
description: "…"           # meta description, 70–160 chars; used as-is by buildGameMetaDescription
shortDescription: "…"      # one-sentence honest summary for cards
date: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
publishedAt: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"    # GameHero shows “Last checked” from this. Do not write Last updated in the body.
author: "HotAPK Games Editorial"
category: casino-games | color-prediction | sports-betting | card-games
primaryKeyword: "…"
secondaryKeywords: […]
semanticKeywords: […]
tags: […]
faqSchema: true
howToSchema: true
canonical: "https://hotapkgames.com/{slug}"
ogImage: "/content-images/{slug}-og.webp"
coverImage: "/content-images/{slug}.webp"
screenshots:               # optional; enables gallery + outline Screenshots
  - "/content-images/{slug}-screenshot.webp"
version: "Unverified"      # real semver only if the user supplied it (v2.3 is OK)
size: "Unverified"         # real size only if the user supplied it
requirements: "Unverified" # or a user-supplied Android version
downloads: "Unverified"
rating: 0                  # never invent stars
votes: 0                   # never invent vote counts
views: 0
isNew: true
featured: false
downloadLinks: []          # publisher URL and/or affiliate URL the user verified
faqs: []                   # 10–12 items; conversational; not a copy of the intro
installSteps: []           # 3–5 real steps
prosAndCons: []            # paired rows; see pipeline note
```

Do **not** invent `playerReviews`. Leave that field out. The site hides star aggregates until 10 genuine notes exist (`lib/review-display.ts`). Do not work around that with fake YAML reviews.

If `coverImage` / `ogImage` files do not exist yet, still use the path convention and tell the user the assets are missing. Do not hotlink random images.

### Title, H1, and meta description

- `title` = SERP title. `lib/seo.ts` `buildGameMetaTitle` appends `APK Download Pakistan {year} — Review & Install Guide` **unless** the title already contains APK download + Pakistan + year. Do not rely on the suffix to fix a bloated title — write a clean title.
- `heading` = GameHero `<h1>`. Required for intent pages (download / login / EasyPaisa). If omitted, the H1 falls back to `title` and duplicates the SERP string.
- `description` between 70 and 160 characters is used as the meta description as-is.

### downloadLinks and affiliate URLs

- Only URLs the user verified. Publisher domain (e.g. `https://786.bet/`) **or** an affiliate/tracking URL (e.g. `https://786.money/?dl=81ebi3`).
- When the user pastes an affiliate link, put it in `downloadLinks` and use that href for every get-the-APK markdown link. Visible anchor text may still say the brand (`786.bet`).
- Hero, sticky, and `<DownloadCta />` buttons all read `downloadLinks` via `getPrimaryDownloadUrl`.
- Do not call the affiliate URL official.

### In-article download CTAs

Insert `<DownloadCta />` after Quick answers and after install. Optional `caption` so the two boxes are not identical:

```mdx
<DownloadCta caption="If you want the package, this is the download path. We do not store the binary." />
```

Implemented in `components/game/InArticleDownloadCta.tsx` (wired from `app/(site)/[slug]/page.tsx`). Button label colour is forced **white** so MDX `[&_a]:text-primary` does not tint “Download APK”.

### Page chrome you do not duplicate in MDX

| UI | Source |
|---|---|
| 18+ risk banner | `GameRiskNotice` under the hero — paraphrase in intro/finale; do not copy the banner sentence |
| Last checked | `updatedAt` in GameHero |
| On this page | H2s from the body (`extractMdxH2Outline`) + FAQ + Download |
| Star ratings | Hidden until 10 genuine reviews; JSON-LD has no fake `aggregateRating` |
| SoftwareApplication + FAQPage + HowTo | `GamePageJsonLd` from frontmatter; keep `faqs` / `installSteps` honest |

Do **not** write “Last updated” paragraphs in game MDX; they are stripped / redundant with the hero.

### Unknown numeric / spec fields

Never fill `version`, `size`, `downloads`, `rating`, `votes`, or payout figures from guesses. Use `Unverified` / `0` as above. `looksLikeSemverVersion` accepts `major.minor` (e.g. `v2.3`).

Site-level warning to raise once: `lib/game-detail-extras.ts` may hash-derive a fake display version when `version` is not semver. That is a UI issue. Do not work around it by inventing a version in the MDX.

Publisher-site research: fetch if the user names the URL. Use lobby categories, language, named wallets. **Do not** publish leaked admin/template strings from SPA JSON (`siteName` leftovers, other-brand slogans, PAGCOR copy with switches off). Popup PKR figures are **not** confirmed minimum deposits.

### Pipeline rules (games / apps) — do not ignore

The MDX pipeline **strips** some body sections on game pages:

1. An H2 whose text matches "pros and cons" / "pros / cons" is deleted, including everything until the next H2. Put trade-offs in frontmatter `prosAndCons` (`pro` + `con` per row). Need more cons than pros? Extra rows may use `pro: "—"` and a real `con`.
2. A heading matching FAQ / Frequently Asked Questions **deletes the rest of the file** after that heading. Put Q&A in frontmatter `faqs` (`question` + `answer`). Do **not** add a FAQ H2 in the game body.
3. Do not write "Last updated" paragraphs; they are stripped.

Guides are not FAQ-stripped the same way. For a **guide**, FAQ H3s may live in the body **and** in `faqs` frontmatter for JSON-LD. Prefer frontmatter `faqs` as the source of truth so schema stays in sync.

Body of a **game** page: intro with no heading (H1 comes from `heading` / GameHero), then H2/H3 sections from the skill inventory **except** FAQ and except a "Pros and cons" H2. Final thoughts stays in the body. Insert `<DownloadCta />` in the MDX body; do not fake a Download H2 for the hero button.

## Frontmatter (guides)

```yaml
title: "…"
slug: "…"
excerpt: "…"
description: "…"
category: general | how-to | reviews | news
author: HotAPK Games Editorial
publishedAt: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"
coverImage: "/content-images/{slug}.webp"
tags: […]
featured: false
canonical: "https://hotapkgames.com/guides/{slug}"
primaryKeyword: "…"
secondaryKeywords: […]
semanticKeywords: […]
faqSchema: true
faqs: []
```

## Keyword registry entry

After creating `content/games/{slug}.mdx`:

```json
"games/{slug}": {
  "primaryKeyword": "…",
  "secondaryKeywords": [],
  "semanticKeywords": [],
  "filePath": "content/games/{slug}.mdx"
}
```

Same shape for `guides/{slug}`.

## Inputs that this site already supplies

| Skill input | This project |
|---|---|
| Target site | `hotapkgames.com` |
| Internal link URLs | slugs listed above |
| Author | HotAPK Games Editorial |
| Contact / legal pages | `/contact`, `/disclaimer`, `/privacy`, `/terms` exist — do not raise those as missing unless you verify they are gone |
| Pakistan wallets | JazzCash / EasyPaisa may be mentioned as **common rails in this niche**, not as a confirmed method for this app unless the user, the publisher page, or a cited in-app screen confirms it |
| Safety scan links | [Play Protect](https://support.google.com/googleplay/answer/2812854) and [VirusTotal](https://www.virustotal.com/gui/home/upload) are allowed in the sideload/scan step when the user asked for them or the article is teaching a scan |
| Affiliate download | User-pasted tracking URLs belong in `downloadLinks` + Download CTA hrefs |

## YMYL on this domain

This site is an Android APK directory, so topic match is fine. Still raise: publishing many new game pages in one burst; thin near-duplicates already in `content/games/`.

Do not copy min-deposit, version, or size from a similarly named product (786 Game vs 786BET). Spec boxes on aggregator blogs that disagree with a file you opened stay in “why blogs disagree,” not in `version` / `size`.
