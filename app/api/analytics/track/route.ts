import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { CRAWL_NOINDEX_VALUE } from "@/lib/crawl";
import { createServiceSupabase } from "@/lib/supabase/server";

const bodySchema = z.object({
  event_name: z.string().trim().min(1).max(128),
  properties: z.record(z.string(), z.unknown()).optional(),
  path: z.string().max(2048).optional(),
});

function bearerMatches(header: string | null, secret: string): boolean {
  const prefix = "Bearer ";
  if (!header?.startsWith(prefix)) return false;
  const token = header.slice(prefix.length);
  if (token.length !== secret.length) return false;
  try {
    return timingSafeEqual(Buffer.from(token, "utf8"), Buffer.from(secret, "utf8"));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const ingestSecret = process.env.ANALYTICS_INGEST_SECRET;
  if (ingestSecret && !bearerMatches(request.headers.get("authorization"), ingestSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { event_name, properties, path } = parsed.data;

  let props: Record<string, unknown> = {};
  try {
    const raw = JSON.stringify(properties ?? {});
    if (raw.length > 12_000) props = { _truncated: true };
    else props = (properties ?? {}) as Record<string, unknown>;
  } catch {
    props = {};
  }

  const vCountry = request.headers.get("x-vercel-ip-country");
  const vCity = request.headers.get("x-vercel-ip-city");
  
  const geoProps: Record<string, unknown> = {};
  if (vCountry || vCity) {
    const locArr = [];
    if (vCity) {
      // Vercel city headers might be uri encoded
      try {
        locArr.push(decodeURIComponent(vCity));
      } catch {
        locArr.push(vCity);
      }
    }
    if (vCountry) locArr.push(vCountry);
    // Override the client-side timezone region with the exact Vercel IP location
    geoProps.region = locArr.join(", ");
  }

  const mergedProps = {
    ...props,
    ...geoProps,
    ...(path && path.length > 0 ? { path } : {})
  };

  try {
    const supabase = createServiceSupabase();
    const { error } = await supabase.from("analytics_events").insert({
      event_name,
      properties: mergedProps,
    });
    if (error) {
      console.error("[analytics/track]", error.message);
    }
  } catch (e) {
    console.error("[analytics/track]", e);
  }

  return new NextResponse(null, {
    status: 204,
    headers: { "X-Robots-Tag": CRAWL_NOINDEX_VALUE },
  });
}
