// ============================================================
// shared/utils/levels.ts
// Logique de niveaux et de badges
// ============================================================

import {
  BADGES_CATALOG,
  DONATION_LEVELS,
  type LevelConfig,
} from "../constants";
import type { Badge, Donation, UserProfile } from "../types";
import {
  computeLivesSaved,
  computeStreak,
  hasAllDonationTypes,
} from "./donations";

export function getLevelConfig(donationCount: number): LevelConfig {
  const found = [...DONATION_LEVELS]
    .reverse()
    .find((l) => donationCount >= l.minDonations);
  return found ?? DONATION_LEVELS[0];
}

export function getLevelProgress(donationCount: number): number {
  const current = getLevelConfig(donationCount);
  if (current.maxDonations === null) return 100;

  const range = current.maxDonations - current.minDonations + 1;
  const progress = donationCount - current.minDonations + 1;
  return Math.min(Math.round((progress / range) * 100), 100);
}

export function getNextLevelConfig(donationCount: number): LevelConfig | null {
  const currentLevel = getLevelConfig(donationCount);
  const idx = DONATION_LEVELS.findIndex((l) => l.level === currentLevel.level);
  return DONATION_LEVELS[idx + 1] ?? null;
}

export function computeEarnedBadgeIds(
  donations: Donation[],
  profile: UserProfile,
): string[] {
  const earned: string[] = [];
  const count = donations.length;
  const livesSaved = computeLivesSaved(donations);
  const streak = computeStreak(donations);

  if (count >= 1) earned.push("first_drop");
  if (count >= 3) earned.push("bronze");
  if (count >= 4) earned.push("silver");
  if (count >= 10) earned.push("gold");
  if (count >= 20) earned.push("platinum");
  if (hasAllDonationTypes(donations)) earned.push("diversifier");
  if (streak >= 3) earned.push("streak_3");
  if (streak >= 6) earned.push("streak_6");
  if (livesSaved >= 10) earned.push("lives_10");
  if (livesSaved >= 30) earned.push("lives_30");
  if (livesSaved >= 60) earned.push("lives_60");
  if (profile.bloodType === "O-") earned.push("universal_donor");

  return earned;
}

export function mergeBadges(
  earnedIds: string[],
  existingBadges: Badge[],
): Badge[] {
  const existingMap = new Map(existingBadges.map((b) => [b.id, b]));

  return BADGES_CATALOG.map((template) => {
    const existing = existingMap.get(template.id);
    const isEarned = earnedIds.includes(template.id);

    if (isEarned && existing?.isUnlocked) {
      return existing;
    }
    if (isEarned && !existing?.isUnlocked) {
      return {
        ...template,
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      };
    }
    return existing ?? template;
  });
}

export function getNewlyUnlockedBadgeIds(
  prevBadges: Badge[],
  newBadges: Badge[],
): string[] {
  const prevUnlocked = new Set(
    prevBadges.filter((b) => b.isUnlocked).map((b) => b.id),
  );
  return newBadges
    .filter((b) => b.isUnlocked && !prevUnlocked.has(b.id))
    .map((b) => b.id);
}
