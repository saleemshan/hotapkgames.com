import { z } from "zod";

/** POST /api/reviews body (honeypot `website` must be empty). */
export const reviewSubmissionSchema = z.object({
  gameSlug: z.string().min(1).max(160).regex(/^[a-z0-9-]+$/i),
  name: z.string().min(1).max(80).trim(),
  city: z.string().max(80).trim().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(20).max(4000),
  /** Honeypot — must be absent or empty string */
  website: z.string().max(500).optional(),
});

export type ReviewSubmissionInput = z.infer<typeof reviewSubmissionSchema>;

export function parseReviewSubmissionBody(json: unknown) {
  const raw = json as Record<string, unknown>;
  return reviewSubmissionSchema.safeParse({
    gameSlug: raw.gameSlug,
    name: raw.name,
    city: raw.city === "" ? undefined : raw.city,
    rating:
      typeof raw.rating === "string"
        ? Number.parseInt(raw.rating, 10)
        : raw.rating,
    comment: raw.comment,
    website: raw.website,
  });
}
