import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isRateLimited } from "@web/lib/rate-limit";
import { getCurrentChallenge } from "@shared/data/challenges";

const LIVES_MAP: Record<string, number> = {
  whole_blood: 3,
  platelets: 1,
  plasma: 1,
};

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(`challenges:${ip}`, { maxRequests: 30, windowMs: 60_000 })) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const challenge = getCurrentChallenge();
  if (!challenge) {
    return NextResponse.json({ challenge: null, progress: 0, contributors: 0 });
  }

  const supabase = getSupabase();

  // Get donations for the current month
  const startOfMonth = new Date(challenge.year, challenge.month - 1, 1).toISOString();
  const endOfMonth = new Date(challenge.year, challenge.month, 0, 23, 59, 59).toISOString();

  const { data: donations } = await supabase
    .from("donations")
    .select("user_id, type")
    .gte("date", startOfMonth)
    .lte("date", endOfMonth);

  const donationsList = donations ?? [];

  let progress: number;
  if (challenge.unit === "vies") {
    progress = donationsList.reduce((sum, d) => sum + (LIVES_MAP[d.type] ?? 1), 0);
  } else {
    progress = donationsList.length;
  }

  // Count unique contributors
  const contributors = new Set(donationsList.map((d) => d.user_id)).size;

  return NextResponse.json({
    challenge,
    progress,
    contributors,
  });
}
