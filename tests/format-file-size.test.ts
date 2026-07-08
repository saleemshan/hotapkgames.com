import { describe, expect, it } from "vitest";

import { formatFileSizeDisplay } from "@/lib/format-file-size";

describe("formatFileSizeDisplay", () => {
  it("dedupes duplicate mb tokens", () => {
    expect(formatFileSizeDisplay("12mb MB")).toBe("12 MB");
    expect(formatFileSizeDisplay("12 MB mb")).toBe("12 MB");
  });

  it("preserves approximate prefix", () => {
    expect(formatFileSizeDisplay("~46 MB")).toBe("~46 MB");
    expect(formatFileSizeDisplay("~46mb MB")).toBe("~46 MB");
  });

  it("normalizes glued unit", () => {
    expect(formatFileSizeDisplay("12MB")).toBe("12 MB");
  });
});
