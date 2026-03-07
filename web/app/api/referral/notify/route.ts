import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isRateLimited } from "@web/lib/rate-limit";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// POST — called after a user registers their first donation
// Checks if they were referred and awards the "referrer" badge to the referrer
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(`referral-notify:${ip}`, { maxRequests: 10, windowMs: 60_000 })) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const supabase = getSupabase();

  // Check if this user was referred
  const { data: referral } = await supabase
    .from("referrals")
    .select("id, referrer_id, referred_first_donation")
    .eq("referred_id", body.userId)
    .single();

  if (!referral || referral.referred_first_donation) {
    return NextResponse.json({ triggered: false });
  }

  // Mark as first donation done
  await supabase
    .from("referrals")
    .update({ referred_first_donation: true })
    .eq("id", referral.id);

  // Award "referrer" badge to the referrer
  await supabase.from("user_badges").upsert(
    {
      user_id: referral.referrer_id,
      badge_id: "referrer",
      unlocked_at: new Date().toISOString(),
    },
    { onConflict: "user_id,badge_id" },
  );

  return NextResponse.json({ triggered: true });
}
