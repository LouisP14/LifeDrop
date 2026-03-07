import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isRateLimited } from "@web/lib/rate-limit";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "LD-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// GET — get or create user's referral code + stats
export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(`referral:${ip}`, { maxRequests: 30, windowMs: 60_000 })) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  ).auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get or create referral code
  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("id", user.id)
    .single();

  let referralCode = profile?.referral_code;

  if (!referralCode) {
    referralCode = generateCode();
    await supabase
      .from("profiles")
      .update({ referral_code: referralCode })
      .eq("id", user.id);
  }

  // Get referral stats
  const { data: referrals } = await supabase
    .from("referrals")
    .select("referred_id, referred_first_donation")
    .eq("referrer_id", user.id);

  const totalReferred = referrals?.length ?? 0;
  const activeReferred = referrals?.filter((r) => r.referred_first_donation).length ?? 0;

  return NextResponse.json({
    referralCode,
    totalReferred,
    activeReferred,
  });
}

// POST — apply a referral code (called by the referred user)
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(`referral-apply:${ip}`, { maxRequests: 10, windowMs: 60_000 })) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.code || !body?.userId) {
    return NextResponse.json({ error: "Missing code or userId" }, { status: 400 });
  }

  const { code, userId } = body;
  const supabase = getSupabase();

  // Find the referrer by code
  const { data: referrer } = await supabase
    .from("profiles")
    .select("id")
    .eq("referral_code", code.toUpperCase())
    .single();

  if (!referrer) {
    return NextResponse.json({ error: "Code invalide" }, { status: 404 });
  }

  if (referrer.id === userId) {
    return NextResponse.json({ error: "Tu ne peux pas utiliser ton propre code" }, { status: 400 });
  }

  // Check if user already has a referral
  const { data: existing } = await supabase
    .from("referrals")
    .select("id")
    .eq("referred_id", userId)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Tu as deja utilise un code de parrainage" }, { status: 409 });
  }

  // Create referral
  const { error } = await supabase.from("referrals").insert({
    referrer_id: referrer.id,
    referred_id: userId,
    referral_code: code.toUpperCase(),
  });

  if (error) {
    return NextResponse.json({ error: "Erreur lors de l'application du code" }, { status: 500 });
  }

  return NextResponse.json({ success: true, referrerName: "Parrain" });
}
