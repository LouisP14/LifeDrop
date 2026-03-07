import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isRateLimited } from "@web/lib/rate-limit";

function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (isRateLimited(`push-sub:${ip}`, { maxRequests: 10, windowMs: 60_000 })) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const { endpoint, keys } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    // Get user from auth header
    const authHeader = req.headers.get("authorization");
    const supabase = getServiceSupabase();

    // Try to get user from cookie/session
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    // Extract token from cookies
    const cookieHeader = req.headers.get("cookie") ?? "";
    const accessToken = extractAccessToken(cookieHeader);

    let userId: string | null = null;

    if (accessToken) {
      const { data } = await anonClient.auth.getUser(accessToken);
      userId = data.user?.id ?? null;
    }

    if (!userId && authHeader?.startsWith("Bearer ")) {
      const { data } = await anonClient.auth.getUser(authHeader.slice(7));
      userId = data.user?.id ?? null;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Upsert subscription
    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        user_id: userId,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
      { onConflict: "user_id,endpoint" },
    );

    if (error) {
      console.error("Push subscription error:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Push subscribe error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (isRateLimited(`push-unsub:${ip}`, { maxRequests: 10, windowMs: 60_000 })) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function extractAccessToken(cookieHeader: string): string | null {
  // Supabase stores tokens in cookies with pattern: sb-<project>-auth-token
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  for (const cookie of cookies) {
    if (cookie.includes("auth-token")) {
      const [, value] = cookie.split("=");
      if (value) {
        try {
          // Could be base64 encoded JSON with access_token
          const decoded = JSON.parse(decodeURIComponent(value));
          if (decoded.access_token) return decoded.access_token;
        } catch {
          // Might be the raw token
          return decodeURIComponent(value);
        }
      }
    }
  }
  return null;
}
