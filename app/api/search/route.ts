import { NextResponse } from "next/server";

import { CRAWL_NOINDEX_VALUE } from "@/lib/crawl";
import { searchQuerySchema } from "@/lib/schema";
import { searchItems } from "@/lib/search";

const noindexHeaders = { "X-Robots-Tag": CRAWL_NOINDEX_VALUE };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = searchQuerySchema.safeParse({
    q: searchParams.get("q") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query" },
      { status: 400, headers: noindexHeaders },
    );
  }
  const q = parsed.data.q ?? "";
  const results = searchItems(q, 30);
  return NextResponse.json({ results }, { headers: noindexHeaders });
}
