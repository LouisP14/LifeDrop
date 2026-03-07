"use client";

import { useMemo } from "react";
import { useAppStore } from "@web/lib/store";
import {
  computeLivesSaved,
  computeStreak,
  getDonationsThisYear,
  getLastDonation,
} from "@shared/utils/donations";
import {
  getLevelConfig,
  getLevelProgress,
  getNextLevelConfig,
} from "@shared/utils/levels";

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
      progress,
      streak,
      lastDonation,
      donationsThisYear,
      unlockedBadges,
    };
  }, [donations, badges]);
}
