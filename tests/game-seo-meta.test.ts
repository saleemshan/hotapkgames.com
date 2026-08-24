import { describe, expect, it } from "vitest";

import { extractMdxH2Outline } from "@/lib/mdx-h2-outline";
import { buildGameMetaDescription, buildGameMetaTitle } from "@/lib/seo";

const sample = {
  title: "786BET Game APK Download Pakistan 2026",
  shortDescription: "Checker for 786BET Game.",
  description:
    "786BET Game APK from 786.bet: EasyPaisa, JazzCash, Aviator. Checked 8.4MB at v2.3. Fees and payout times stay unverified.",
  category: "casino-games",
  version: "v2.3",
  size: "8.4MB",
  requirements: "Android 5+",
};

describe("buildGameMetaTitle", () => {
  it("does not duplicate APK Download Pakistan YEAR", () => {
    const title = buildGameMetaTitle(sample, new Date("2026-08-24"));
    expect(title).toBe("786BET Game APK Download Pakistan 2026");
    expect(title.match(/APK Download Pakistan 2026/g)?.length).toBe(1);
  });

  it("appends the suffix when the listing title is a short brand name", () => {
    const title = buildGameMetaTitle(
      { ...sample, title: "WU777 Game" },
      new Date("2026-08-24"),
    );
    expect(title).toBe(
      "WU777 Game APK Download Pakistan 2026 — Review & Install Guide",
    );
  });
});

describe("buildGameMetaDescription", () => {
  it("uses the editorial description when it is a valid meta length", () => {
    expect(buildGameMetaDescription(sample)).toBe(sample.description);
    expect(buildGameMetaDescription(sample).length).toBeLessThanOrEqual(160);
  });
});

describe("extractMdxH2Outline", () => {
  it("slugs H2s and skips FAQ / pros-cons headings", () => {
    const items = extractMdxH2Outline(
      "## Withdrawals on 786BET Game\n\n## FAQ\n\n## Troubleshooting\n",
    );
    expect(items.map((i) => i.href)).toEqual([
      "#withdrawals-on-786bet-game",
      "#troubleshooting",
    ]);
  });
});
