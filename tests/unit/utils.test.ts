import { describe, expect, it } from "vitest";

import { searchQuerySchema } from "@/lib/schema";
import { slugifyTag } from "@/lib/utils";

describe("slugifyTag", () => {
  it("slugifies basic tags", () => {
    expect(slugifyTag("P999 Game")).toBe("p999-game");
  });
});

describe("searchQuerySchema", () => {
  it("accepts short queries", () => {
    expect(searchQuerySchema.safeParse({ q: "p999" }).success).toBe(true);
  });
});
