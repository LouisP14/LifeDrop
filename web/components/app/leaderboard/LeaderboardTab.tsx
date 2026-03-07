"use client";

import { useState, useEffect } from "react";
import { Trophy, Heart, Droplets, Medal, Crown, Award } from "lucide-react";
import { useAppStore } from "@web/lib/store";

interface LeaderboardEntry {
  id: string;
  name: string;
  donations: number;
  lives: number;
}

const PODIUM_COLORS = [
  { bg: "rgba(255,215,0,0.12)", border: "rgba(255,215,0,0.3)", text: "#FFD700", icon: <Crown className="h-5 w-5" /> },
  { bg: "rgba(192,192,192,0.12)", border: "rgba(192,192,192,0.3)", text: "#C0C0C0", icon: <Medal className="h-5 w-5" /> },
  { bg: "rgba(205,127,50,0.12)", border: "rgba(205,127,50,0.3)", text: "#CD7F32", icon: <Award className="h-5 w-5" /> },
];

export function LeaderboardTab() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const profile = useAppStore((s) => s.profile);
  const supabaseUserId = useAppStore((s) => s.supabaseUserId);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.leaderboard ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const myRank = entries.findIndex((e) => e.id === supabaseUserId);

  return (
    <div className="px-4 pt-6 md:px-8 md:pt-8 animate-[fadeInUp_400ms_ease-out]">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-primary)/10">
          <Trophy className="h-7 w-7 text-(--color-primary)" />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold">Classement</h2>
        <p className="mt-1 text-sm text-(--color-text-muted)">
          Les donneurs qui sauvent le plus de vies
        </p>
      </div>

      {/* My rank card */}
      {myRank >= 0 && (
        <div className="mb-5 rounded-2xl border border-(--color-primary)/30 bg-(--color-primary)/5 p-4 text-center">
          <p className="text-sm text-(--color-text-muted)">Ta position</p>
          <p className="text-3xl font-extrabold text-(--color-primary)">#{myRank + 1}</p>
          <p className="text-xs text-(--color-text-muted)">
            {entries[myRank].lives} vies sauvees &middot; {entries[myRank].donations} dons
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Droplets className="h-8 w-8 animate-pulse text-(--color-primary)" />
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-12 text-center">
          <Trophy className="mx-auto mb-3 h-8 w-8 text-(--color-text-muted)/30" />
          <p className="text-sm text-(--color-text-muted)">
            Aucun donneur pour le moment. Sois le premier !
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {entries.map((entry, i) => {
            const podium = i < 3 ? PODIUM_COLORS[i] : null;
            const isMe = entry.id === supabaseUserId;
            const initials = entry.name.slice(0, 2).toUpperCase();

            return (
              <div
                key={entry.id}
                className="flex items-center gap-3 rounded-2xl border p-3.5 transition-all"
                style={{
                  borderColor: isMe ? "var(--color-primary)" : podium?.border ?? "var(--color-border)",
                  backgroundColor: isMe ? "rgba(248,113,113,0.08)" : podium?.bg ?? "var(--color-surface)",
                }}
              >
                {/* Rank */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold"
                  style={{
                    backgroundColor: podium ? `${podium.text}20` : "var(--color-surface)",
                    color: podium?.text ?? "var(--color-text-muted)",
                  }}
                >
                  {podium ? podium.icon : `#${i + 1}`}
                </div>

                {/* Avatar + name */}
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: isMe ? "rgba(248,113,113,0.15)" : "var(--color-surface)",
                    color: isMe ? "var(--color-primary)" : "var(--color-text-muted)",
                  }}
                >
                  {initials}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">
                    {entry.name}
                    {isMe && <span className="ml-1.5 text-xs text-(--color-primary)">(toi)</span>}
                  </p>
                  <p className="text-xs text-(--color-text-muted)">
                    {entry.donations} don{entry.donations !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Lives */}
                <div className="flex items-center gap-1.5 text-right">
                  <Heart className="h-4 w-4 text-(--color-primary)" />
                  <span className="text-base font-extrabold">{entry.lives}</span>
                  <span className="text-[10px] text-(--color-text-muted)">vies</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
