import path from "node:path";

export const USER_REVIEWS_ROOT = path.join(process.cwd(), "data", "user-reviews");

export function approvedReviewPath(slug: string): string {
  return path.join(USER_REVIEWS_ROOT, "approved", `${slug}.json`);
}

export function pendingInboxPath(): string {
  return path.join(USER_REVIEWS_ROOT, "pending", "inbox.jsonl");
}
