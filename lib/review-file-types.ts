import { z } from "zod";

/** One row in `data/user-reviews/approved/{slug}.json` */
export const fileReviewRowSchema = z.object({
  name: z.string().min(1).max(80),
  city: z.string().min(1).max(80).optional(),
  rating: z.number().int().min(1).max(5),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  comment: z.string().min(1).max(4000),
  helpful: z.number().int().min(0).optional(),
});

export type FileReviewRow = z.infer<typeof fileReviewRowSchema>;

export const approvedFileSchema = z.array(fileReviewRowSchema);
