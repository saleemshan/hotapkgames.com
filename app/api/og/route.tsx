import { ImageResponse } from "next/og";

import { parseOgSearchParams } from "@/lib/og-params";

/** Node runtime — Edge is capped at ~1 MB on many hosts; `@vercel/og` + deps exceed that. */
export const runtime = "nodejs";

const DEFAULT_TITLE = "HotAPK Games";
const DEFAULT_SUB = "Pakistan APK & games";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { title, rating, subtitle } = parseOgSearchParams(searchParams);

  const displayTitle = title?.trim() || DEFAULT_TITLE;
  const displaySub = subtitle?.trim() || DEFAULT_SUB;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 48,
          background: "linear-gradient(135deg, #0a0f1e 0%, #0f172a 50%, #022c22 100%)",
          color: "#e2e8f0",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#00ff88", fontSize: 28, fontWeight: 700 }}>
            {DEFAULT_TITLE}
          </span>
          {rating ? (
            <span style={{ color: "#ffd700", fontSize: 24 }}>★ {rating}</span>
          ) : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1 }}>{displayTitle}</div>
          <div style={{ fontSize: 28, color: "#94a3b8" }}>{displaySub}</div>
        </div>
        <div style={{ fontSize: 20, color: "#64748b" }}>HotAPK Games editorial</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
