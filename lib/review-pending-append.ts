import { appendFileSync, mkdirSync } from "node:fs";

import { pendingInboxPath, USER_REVIEWS_ROOT } from "@/lib/review-fs-paths";

export type PendingLine = {
  at: string;
  gameSlug: string;
  name: string;
  city?: string;
  rating: number;
  comment: string;
};

/**
 * Append one moderation line. Works on dev / Node with a writable project dir.
 * On serverless hosts the filesystem is often read-only — callers should try/catch
 * and treat failure as non-fatal (submission still acknowledged for UX).
 */
export function appendPendingReviewLine(payload: PendingLine): void {
  mkdirSync(USER_REVIEWS_ROOT, { recursive: true });
  mkdirSync(`${USER_REVIEWS_ROOT}/pending`, { recursive: true });
  appendFileSync(pendingInboxPath(), `${JSON.stringify(payload)}\n`, "utf8");
}
