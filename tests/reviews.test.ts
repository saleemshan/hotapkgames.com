import { describe, expect, it } from "vitest";

import type { UserReview } from "@/components/game/UserReviews";
import { averageReviewRating } from "@/lib/review-average";
import { approvedFileSchema } from "@/lib/review-file-types";
import { parseReviewSubmissionBody } from "@/lib/review-submission";

const sample: UserReview[] = [
  {
    name: "A",
    city: "Lahore",
    rating: 4,
    date: "2026-01-01",
    comment: "Good",
    helpful: 1,
  },
  {
    name: "B",
    city: "Karachi",
    rating: 2,
    date: "2026-01-02",
    comment: "Ok",
    helpful: 2,
  },
];

describe("averageReviewRating", () => {
  it("returns 0 for empty list", () => {
    expect(averageReviewRating([])).toBe(0);
  });

  it("averages ratings", () => {
    expect(averageReviewRating(sample)).toBe(3);
  });
});

describe("parseReviewSubmissionBody", () => {
  it("rejects comment shorter than 20 chars", () => {
    const r = parseReviewSubmissionBody({
      gameSlug: "pk8-game",
      name: "Test",
      rating: 5,
      comment: "too short",
    });
    expect(r.success).toBe(false);
  });

  it("accepts valid payload", () => {
    const r = parseReviewSubmissionBody({
      gameSlug: "pk8-game",
      name: "Test U.",
      city: "Lahore",
      rating: 4,
      comment: "Twenty characters minimum.",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.comment).toBe("Twenty characters minimum.");
    }
  });
});

describe("approvedFileSchema", () => {
  it("parses approved JSON shape", () => {
    const rows = approvedFileSchema.parse([
      {
        name: "X",
        rating: 5,
        date: "2026-03-01",
        comment: "Works for me in testing.",
        helpful: 3,
      },
    ]);
    expect(rows).toHaveLength(1);
    expect(rows[0].rating).toBe(5);
  });
});
