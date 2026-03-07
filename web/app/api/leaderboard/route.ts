import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isRateLimited } from "@web/lib/rate-limit";

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
  if (isRateLimited(`leaderboard:${ip}`, { maxRequests: 30, windowMs: 60_000 })) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const supabase = getSupabase();

  // Fetch all donations with profile name
  const { data: donations, error } = await supabase
    .from("donations")
    .select("user_id, type");

  if (error) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  // Fetch profiles for names
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name");

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.id, p.name ?? "Donneur anonyme"]),
  );

  // Aggregate per user
  const userStats = new Map<string, { name: string; donations: number; lives: number }>();

  for (const d of donations ?? []) {
    const existing = userStats.get(d.user_id) ?? {
      name: profileMap.get(d.user_id) ?? "Donneur anonyme",
      donations: 0,
      lives: 0,
    };
    existing.donations++;
    existing.lives += LIVES_MAP[d.type] ?? 1;
    userStats.set(d.user_id, existing);
  }

  // Sort by lives saved (descending), then by donation count
  const leaderboard = [...userStats.entries()]
    .map(([id, stats]) => ({
      id,
      name: stats.name,
      donations: stats.donations,
      lives: stats.lives,
    }))
    .sort((a, b) => b.lives - a.lives || b.donations - a.donations)
    .slice(0, 50);

  return NextResponse.json({ leaderboard });
}
