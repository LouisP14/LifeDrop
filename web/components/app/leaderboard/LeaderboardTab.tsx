"use client";

import { useState, useEffect, useMemo } from "react";
import { Trophy, Heart, Droplets, Medal, Crown, Award, Search, Filter, ChevronDown } from "lucide-react";
import { useAppStore } from "@web/lib/store";
import { BLOOD_TYPES } from "@shared/constants";

interface LeaderboardEntry {
  id: string;
  name: string;
  bloodType: string;
  donations: number;
  lives: number;
}

type SortBy = "lives" | "donations";

const PODIUM_COLORS = [
  { bg: "rgba(255,215,0,0.12)", border: "rgba(255,215,0,0.3)", text: "#FFD700", icon: <Crown className="h-5 w-5" /> },
  { bg: "rgba(192,192,192,0.12)", border: "rgba(192,192,192,0.3)", text: "#C0C0C0", icon: <Medal className="h-5 w-5" /> },
  { bg: "rgba(205,127,50,0.12)", border: "rgba(205,127,50,0.3)", text: "#CD7F32", icon: <Award className="h-5 w-5" /> },
];

const BLOOD_TYPE_OPTIONS = ["all", ...BLOOD_TYPES] as const;

export function LeaderboardTab() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>("lives");
  const [bloodFilter, setBloodFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
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

  const filtered = useMemo(() => {
    let result = [...entries];

    // Filter by blood type
    if (bloodFilter !== "all") {
      result = result.filter((e) => e.bloodType === bloodFilter);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((e) => e.name.toLowerCase().includes(q));
    }

    // Sort
    result.sort((a, b) =>
      sortBy === "lives"
        ? b.lives - a.lives || b.donations - a.donations
        : b.donations - a.donations || b.lives - a.lives,
    );

    return result;
  }, [entries, sortBy, bloodFilter, search]);

  const myRank = filtered.findIndex((e) => e.id === supabaseUserId);

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

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-(--color-text-muted)" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un donneur..."
          className="w-full rounded-xl border border-(--color-border) bg-(--color-surface) pl-11 pr-4 py-3 text-sm text-(--color-text) placeholder:text-(--color-text-muted)/50 outline-none focus:border-(--color-primary)"
        />
      </div>

      {/* Filter toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="mb-3 flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-2.5 text-xs font-bold text-(--color-text-muted) transition-all hover:border-(--color-primary)/30"
      >
        <Filter className="h-3.5 w-3.5" />
        Filtres
        <ChevronDown
          className="h-3.5 w-3.5 transition-transform"
          style={{ transform: showFilters ? "rotate(180deg)" : "rotate(0)" }}
        />
        {(bloodFilter !== "all" || sortBy !== "lives") && (
          <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-(--color-primary) text-[9px] text-white">
            {(bloodFilter !== "all" ? 1 : 0) + (sortBy !== "lives" ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Filters panel */}
      {showFilters && (
        <div className="mb-4 space-y-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 animate-[fadeInUp_200ms_ease-out]">
          {/* Sort by */}
          <div>
            <p className="mb-2 text-xs font-bold text-(--color-text-muted)">Trier par</p>
            <div className="flex gap-2">
              {([
                { key: "lives" as SortBy, label: "Vies sauvees", icon: <Heart className="h-3.5 w-3.5" /> },
                { key: "donations" as SortBy, label: "Nombre de dons", icon: <Droplets className="h-3.5 w-3.5" /> },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(opt.key)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all"
                  style={{
                    backgroundColor: sortBy === opt.key ? "var(--color-primary)" : "transparent",
                    color: sortBy === opt.key ? "white" : "var(--color-text-muted)",
                    border: sortBy === opt.key ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
                  }}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Blood type filter */}
          <div>
            <p className="mb-2 text-xs font-bold text-(--color-text-muted)">Groupe sanguin</p>
            <div className="flex flex-wrap gap-1.5">
              {BLOOD_TYPE_OPTIONS.map((bt) => (
                <button
                  key={bt}
                  onClick={() => setBloodFilter(bt)}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all"
                  style={{
                    backgroundColor: bloodFilter === bt ? "var(--color-primary)" : "transparent",
                    color: bloodFilter === bt ? "white" : "var(--color-text-muted)",
                    border: bloodFilter === bt ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
                  }}
                >
                  {bt === "all" ? "Tous" : bt}
                </button>
              ))}
            </div>
          </div>

          {/* Reset */}
          {(bloodFilter !== "all" || sortBy !== "lives") && (
            <button
              onClick={() => { setSortBy("lives"); setBloodFilter("all"); }}
              className="text-xs font-bold text-(--color-primary) hover:underline"
            >
              Reinitialiser les filtres
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      {!loading && entries.length > 0 && (
        <p className="mb-3 text-xs text-(--color-text-muted)">
          {filtered.length} donneur{filtered.length !== 1 ? "s" : ""}
          {bloodFilter !== "all" && ` · ${bloodFilter}`}
          {search.trim() && ` · "${search}"`}
          {` · par ${sortBy === "lives" ? "vies sauvees" : "nombre de dons"}`}
        </p>
      )}

      {/* My rank card */}
      {myRank >= 0 && (
        <div className="mb-5 rounded-2xl border border-(--color-primary)/30 bg-(--color-primary)/5 p-4 text-center">
          <p className="text-sm text-(--color-text-muted)">Ta position</p>
          <p className="text-3xl font-extrabold text-(--color-primary)">#{myRank + 1}</p>
          <p className="text-xs text-(--color-text-muted)">
            {filtered[myRank].lives} vies sauvees &middot; {filtered[myRank].donations} dons
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Droplets className="h-8 w-8 animate-pulse text-(--color-primary)" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-12 text-center">
          <Trophy className="mx-auto mb-3 h-8 w-8 text-(--color-text-muted)/30" />
          <p className="text-sm text-(--color-text-muted)">
            {entries.length === 0
              ? "Aucun donneur pour le moment. Sois le premier !"
              : "Aucun resultat pour ces filtres"}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((entry, i) => {
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
                    {entry.bloodType && entry.bloodType !== "unknown" && (
                      <span className="ml-1.5 inline-flex items-center rounded bg-(--color-primary)/10 px-1.5 py-0.5 text-[10px] font-bold text-(--color-primary)">
                        {entry.bloodType}
                      </span>
                    )}
                  </p>
                </div>

                {/* Lives / Donations stat */}
                <div className="flex items-center gap-1.5 text-right">
                  {sortBy === "lives" ? (
                    <>
                      <Heart className="h-4 w-4 text-(--color-primary)" />
                      <span className="text-base font-extrabold">{entry.lives}</span>
                      <span className="text-[10px] text-(--color-text-muted)">vies</span>
                    </>
                  ) : (
                    <>
                      <Droplets className="h-4 w-4 text-(--color-primary)" />
                      <span className="text-base font-extrabold">{entry.donations}</span>
                      <span className="text-[10px] text-(--color-text-muted)">dons</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
