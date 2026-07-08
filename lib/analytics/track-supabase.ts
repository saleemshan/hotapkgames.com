"use client";

function normalizeProps(properties?: Record<string, unknown>): Record<string, unknown> {
  if (!properties || typeof properties !== "object") return {};
  try {
    const s = JSON.stringify(properties);
    if (s.length > 12_000) return { _truncated: true };
    return JSON.parse(s) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function sendSupabaseEvent(eventName: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  let extra: Record<string, unknown> = {};
  
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const clickKey = `clicks_${eventName}`;
    const currentCount = parseInt(localStorage.getItem(clickKey) || "0", 10);
    const newCount = currentCount + 1;
    localStorage.setItem(clickKey, newCount.toString());
    
    const ua = navigator.userAgent;
    const deviceType = /Mobile|Android|iP(ad|hone|od)/i.test(ua) ? "Mobile" : "Desktop";
    
    let browser = "Other";
    if (ua.includes("Firefox/")) browser = "Firefox";
    else if (ua.includes("Edg/")) browser = "Edge";
    else if (ua.includes("OPR/") || ua.includes("Opera/")) browser = "Opera";
    else if (ua.includes("Chrome/")) browser = "Chrome";
    else if (ua.includes("Safari/")) browser = "Safari";
    else if (ua.includes("MSIE ") || ua.includes("Trident/")) browser = "IE";
    
    extra = {
      region: timeZone,
      clickCount: newCount,
      isDuplicate: newCount > 1 ? "Yes" : "No",
      deviceType,
      browser,
      language: navigator.language,
      referrer: document.referrer || "direct"
    };
  } catch {
    // Ignore storage/navigator errors
  }

  const enrichedProps = { ...properties, ...extra };

  const body = JSON.stringify({
    event_name: eventName,
    properties: normalizeProps(enrichedProps),
    path: window.location?.pathname ?? "",
  });

  const headers: HeadersInit = { "Content-Type": "application/json" };
  const token = process.env.NEXT_PUBLIC_ANALYTICS_INGEST_SECRET;
  if (token) headers.Authorization = `Bearer ${token}`;

  void fetch("/api/analytics/track", {
    method: "POST",
    headers,
    body,
    keepalive: true,
  }).catch(() => {});
}
