"use client";

import { Award, Trophy, Diamond } from "lucide-react";
import type { LevelConfig } from "@shared/constants";

const LEVEL_ICONS: Record<string, React.ReactNode> = {
  medal: <Award className="h-5 w-5" />,
  trophy: <Trophy className="h-5 w-5" />,
  "diamond-stone": <Diamond className="h-5 w-5" />,
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
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${levelConfig.color}20`, color: levelConfig.color }}
          >
            {LEVEL_ICONS[levelConfig.icon] ?? <Award className="h-5 w-5" />}
          </div>
          <div>
            <span className="text-sm md:text-base font-bold">{levelConfig.label}</span>
            {nextLevel && (
              <p className="text-[11px] text-(--color-text-muted)">
                Prochain : {nextLevel.label} ({nextLevel.minDonations} dons)
              </p>
            )}
          </div>
        </div>
        <span
          className="text-sm font-bold"
          style={{ color: levelConfig.color }}
        >
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-(--color-border)">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, backgroundColor: levelConfig.color }}
        />
      </div>
    </div>
  );
}
