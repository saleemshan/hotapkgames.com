import { NextResponse } from "next/server";

import { getGameBySlug } from "@/lib/content";
import { appendPendingReviewLine } from "@/lib/review-pending-append";
import { reviewRateLimitOk } from "@/lib/review-rate-limit";
import { parseReviewSubmissionBody } from "@/lib/review-submission";

function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  return headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parseReviewSubmissionBody(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const body = parsed.data;
  if (body.website && body.website.length > 0) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const gameSlug = body.gameSlug.toLowerCase();
  const game = getGameBySlug(gameSlug);
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const ip = clientIp(req.headers);
  if (!reviewRateLimitOk(ip)) {
    return NextResponse.json(
      { error: "Too many submissions; try again later." },
      { status: 429 },
    );
  }

  const line = {
    at: new Date().toISOString(),
    gameSlug,
    name: body.name,
    city: body.city || undefined,
    rating: body.rating,
    comment: body.comment,
  };

  let persisted = false;
  try {
    appendPendingReviewLine(line);
    persisted = true;
  } catch {
    // Typical on Vercel: read-only FS. Moderators still see thanks; promote from logs / self-host / manual.
  }

  return NextResponse.json(
    {
      ok: true,
      persisted,
      message: persisted
        ? "Received — we will publish after a quick check."
        : "Thanks — we received your note. If on serverless hosting, copy your review to approved JSON manually or run locally to append pending inbox.",
    },
    { status: 201 },
  );
}
