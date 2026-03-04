// ============================================================
// src/utils/levels.ts
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

/**
 * Retourne la config du niveau correspondant au nombre de dons.
 */
export function getLevelConfig(donationCount: number): LevelConfig {
  // On itère en sens inverse pour trouver le niveau le plus élevé atteint
  const found = [...DONATION_LEVELS]
    .reverse()
    .find((l) => donationCount >= l.minDonations);
  return found ?? DONATION_LEVELS[0];
}

/**
 * Pourcentage de progression vers le prochain niveau (0-100).
 */
export function getLevelProgress(donationCount: number): number {
  const current = getLevelConfig(donationCount);
  if (current.maxDonations === null) return 100; // Platine = maximal

  const range = current.maxDonations - current.minDonations + 1;
  const progress = donationCount - current.minDonations + 1;
  return Math.min(Math.round((progress / range) * 100), 100);
}

/**
 * Retourne la config du prochain niveau (null si déjà Platine).
 */
export function getNextLevelConfig(donationCount: number): LevelConfig | null {
  const currentLevel = getLevelConfig(donationCount);
  const idx = DONATION_LEVELS.findIndex((l) => l.level === currentLevel.level);
  return DONATION_LEVELS[idx + 1] ?? null;
}

/**
 * Calcule les badges qui devraient être débloqués pour un utilisateur
 * selon son historique de dons.
 * Retourne la liste des IDs de badges maintenant disponibles.
 */
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
  if (count >= 4) earned.push("silver"); // passage Argent à 4
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

/**
 * Fusionne le catalogue de base avec les badges débloqués de l'utilisateur.
 */
export function mergeBadges(
  earnedIds: string[],
  existingBadges: Badge[],
): Badge[] {
  const existingMap = new Map(existingBadges.map((b) => [b.id, b]));

  return BADGES_CATALOG.map((template) => {
    const existing = existingMap.get(template.id);
    const isEarned = earnedIds.includes(template.id);

    if (isEarned && existing?.isUnlocked) {
      // Déjà débloqué → on garde la date
      return existing;
    }
    if (isEarned && !existing?.isUnlocked) {
      // Nouveau déblocage
      return {
        ...template,
        isUnlocked: true,
        unlockedAt: new Date().toISOString(),
      };
    }
    return existing ?? template;
  });
}

/**
 * Retourne les IDs de badges nouvellement débloqués (pour afficher une notif).
 */
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
