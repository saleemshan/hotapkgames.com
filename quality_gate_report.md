# SEO Quality Gate Report

**Total Blogs Analyzed:** 90

## 1. Unique Primary Keyword: ✅ PASS

## 2. All Frontmatter Populated: ✅ PASS

## 3. Word Count >= 1400: ❌ FAIL
- 30 blogs are under 1400 words. **Action Required**: Run `scripts/rewrite-blogs.mjs` to expand these using LLM.

## 4. FAQs >= 6: ❌ FAIL
- 64 blogs have fewer than 6 FAQs. The LLM rewrite script will generate these automatically.

## 5. Internal Links (4-8 per post): ❌ FAIL
- 77 blogs do not meet the 4-8 link requirement. (Note: Running `npm run build` executes auto-linker, but requires sufficient content length first).

## 6. Content Similarity < 30%: ❌ FAIL
- Found 5 pairs exceeding 30% trigram similarity. These need unique rewriting angles.

## 7. Schema Validation & 8. Lighthouse
> **Manual Verification Required:** Please run the Next.js dev server and use Google's Rich Results Test tool to validate the schemas, and Chrome DevTools to run Lighthouse for the 95+ SEO score.
