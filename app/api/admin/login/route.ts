import { NextResponse } from "next/server";

import { constantTimeEqual } from "@/lib/crypto-safe";

export async function POST(request: Request) {
  const secret = process.env.ADMIN_ANALYTICS_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const nextRaw = String(form.get("next") ?? "/admin/analytics");
  const nextPath = nextRaw.startsWith("/admin") ? nextRaw : "/admin/analytics";

  if (!constantTimeEqual(password, secret)) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url));
  }

  const res = NextResponse.redirect(new URL(nextPath, request.url));
  res.cookies.set({
    name: "admin_analytics_auth",
    value: secret,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
