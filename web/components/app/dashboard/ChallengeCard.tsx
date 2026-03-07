"use client";

import { useState, useEffect } from "react";
import { Target, HeartHandshake, Flame, Sun, Users, Trophy } from "lucide-react";
import type { Challenge } from "@shared/data/challenges";

const CHALLENGE_ICONS: Record<string, React.ReactNode> = {
  target: <Target className="h-6 w-6" />,
  "heart-handshake": <HeartHandshake className="h-6 w-6" />,
  flame: <Flame className="h-6 w-6" />,
  sun: <Sun className="h-6 w-6" />,
};

interface ChallengeData {
  challenge: Challenge | null;
  progress: number;
  contributors: number;
}

export function ChallengeCard() {
  const [data, setData] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/challenges")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data?.challenge) return null;

  const { challenge, progress, contributors } = data;
  const percentage = Math.min(Math.round((progress / challenge.goal) * 100), 100);
  const isCompleted = progress >= challenge.goal;

  return (
    <div className="rounded-2xl border border-(--color-accent)/20 bg-(--color-accent)/5 p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--color-accent)/15 text-(--color-accent)">
          {CHALLENGE_ICONS[challenge.icon] ?? <Target className="h-6 w-6" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold">{challenge.title}</h3>
            {isCompleted && (
              <span className="flex items-center gap-1 rounded-full bg-(--color-green)/15 px-2 py-0.5 text-[10px] font-bold text-(--color-green)">
                <Trophy className="h-3 w-3" /> Reussi !
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-(--color-text-muted)">{challenge.description}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-bold">
            {progress} <span className="text-xs font-normal text-(--color-text-muted)">/ {challenge.goal} {challenge.unit}</span>
          </span>
          <span className="text-sm font-bold text-(--color-accent)">{percentage}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-(--color-border)">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              background: isCompleted
                ? "var(--color-green)"
                : "linear-gradient(90deg, var(--color-accent), var(--color-primary))",
            }}
          />
        </div>
      </div>

      {/* Contributors */}
      <div className="flex items-center gap-1.5 text-xs text-(--color-text-muted)">
        <Users className="h-3.5 w-3.5" />
        {contributors} participant{contributors !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
