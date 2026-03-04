// ============================================================
// src/hooks/useDonationStats.ts
// Hook — statistiques agrégées pour le dashboard
// ============================================================

import { useMemo } from "react";
import { useAppStore } from "../store/useAppStore";
import {
  computeLivesSaved,
  computeStreak,
  getDonationsThisYear,
  getLastDonation,
} from "../utils/donations";
import {
  getLevelConfig,
  getLevelProgress,
  getNextLevelConfig,
} from "../utils/levels";

export function useDonationStats() {
  const donations = useAppStore((s) => s.donations);
  const badges = useAppStore((s) => s.badges);

  return useMemo(() => {
    const count = donations.length;
    const livesSaved = computeLivesSaved(donations);
    const levelConfig = getLevelConfig(count);
    const nextLevel = getNextLevelConfig(count);
    const progress = getLevelProgress(count);
    const streak = computeStreak(donations);
    const lastDonation = getLastDonation(donations);
    const donationsThisYear = getDonationsThisYear(donations).length;
    const unlockedBadges = badges.filter((b) => b.isUnlocked);

    return {
      count,
      livesSaved,
      levelConfig,
      nextLevel,
      progress, // 0-100
      streak,
      lastDonation,
      donationsThisYear,
      unlockedBadges,
    };
  }, [donations, badges]);
}
