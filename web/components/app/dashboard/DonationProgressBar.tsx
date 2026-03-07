"use client";

import { Award, Trophy, Diamond } from "lucide-react";
import type { LevelConfig } from "@shared/constants";

const LEVEL_ICONS: Record<string, React.ReactNode> = {
  medal: <Award className="h-4 w-4" />,
  trophy: <Trophy className="h-4 w-4" />,
  "diamond-stone": <Diamond className="h-4 w-4" />,
};

export function DonationProgressBar({
  levelConfig,
  progress,
  nextLevel,
}: {
  levelConfig: LevelConfig;
  progress: number;
  nextLevel: LevelConfig | null;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ color: levelConfig.color }}>
            {LEVEL_ICONS[levelConfig.icon] ?? <Award className="h-4 w-4" />}
          </span>
          <span className="text-sm font-bold">{levelConfig.label}</span>
        </div>
        <span className="text-xs text-[var(--color-text-muted)]">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, backgroundColor: levelConfig.color }}
        />
      </div>
      {nextLevel && (
        <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
          Prochain : {nextLevel.label} ({nextLevel.minDonations} dons)
        </p>
      )}
    </div>
  );
}
