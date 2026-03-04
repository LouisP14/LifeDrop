// ============================================================
// src/utils/donations.ts
// Logique métier : éligibilité, vies sauvées, plafonds annuels
// ============================================================

import {
  addDays,
  differenceInDays,
  isAfter,
  parseISO,
  startOfYear,
} from "date-fns";
import {
  DONATION_COOLDOWN_DAYS,
  LIVES_PER_DONATION_TYPE,
} from "../constants";
import type {
  Donation,
  DonationType,
  EligibilityResult,
  PerTypeEligibility,
} from "../types";

/**
 * Calcule le nombre de vies potentiellement sauvées.
 * Sang total = 3, plaquettes = 1, plasma = 1.
 */
export function computeLivesSaved(donations: Donation[]): number {
  return donations.reduce(
    (sum, d) => sum + (LIVES_PER_DONATION_TYPE[d.type] ?? 1),
    0,
  );
}

/**
 * Retourne les dons effectués durant l'année civile en cours.
 */
export function getDonationsThisYear(donations: Donation[]): Donation[] {
  const yearStart = startOfYear(new Date());
  return donations.filter((d) => isAfter(parseISO(d.date), yearStart));
}

/**
 * Retourne le dernier don toutes catégories confondues, trié par date décroissante.
 */
export function getLastDonation(donations: Donation[]): Donation | null {
  if (donations.length === 0) return null;
  return [...donations].sort(
    (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime(),
  )[0];
}

/**
 * Calcule l'éligibilité globale.
 * canDonate = true si AU MOINS un type de don est disponible.
 * daysRemaining = délai du prochain type disponible (le plus proche).
 */
export function computeEligibility(donations: Donation[]): EligibilityResult {
  const perType = computeEligibilityPerType(donations);
  const types: DonationType[] = ["whole_blood", "plasma", "platelets"];

  // Si au moins un type est dispo → canDonate = true
  const anyAvailable = types.some((t) => perType[t].canDonate);
  if (anyAvailable) {
    return { canDonate: true };
  }

  // Tous bloqués → on retourne le délai le plus court
  const sorted = types
    .map((t) => perType[t])
    .filter((r) => r.reason === "cooldown" && r.daysRemaining !== undefined)
    .sort((a, b) => (a.daysRemaining ?? 999) - (b.daysRemaining ?? 999));

  const soonest = sorted[0];
  return {
    canDonate: false,
    reason: "cooldown",
    eligibleFrom: soonest?.eligibleFrom,
    daysRemaining: soonest?.daysRemaining,
  };
}

/**
 * Calcule l'éligibilité indépendamment pour chaque type de don.
 * Chaque type a son propre délai depuis le dernier don DE CE TYPE.
 */
export function computeEligibilityPerType(
  donations: Donation[],
): PerTypeEligibility {
  const today = new Date();
  const types: DonationType[] = ["whole_blood", "plasma", "platelets"];
  const result = {} as PerTypeEligibility;

  for (const type of types) {
    // Dernier don de CE type spécifiquement
    const lastOfType = [...donations]
      .filter((d) => d.type === type)
      .sort(
        (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime(),
      )[0];

    if (!lastOfType) {
      result[type] = { canDonate: true };
      continue;
    }

    const cooldown = DONATION_COOLDOWN_DAYS[type];
    const lastDate = parseISO(lastOfType.date);
    const eligibleFrom = addDays(lastDate, cooldown);

    if (
      isAfter(today, eligibleFrom) ||
      differenceInDays(today, eligibleFrom) === 0
    ) {
      result[type] = { canDonate: true, eligibleFrom };
    } else {
      result[type] = {
        canDonate: false,
        reason: "cooldown",
        eligibleFrom,
        daysRemaining: differenceInDays(eligibleFrom, today),
      };
    }
  }

  return result;
}

/**
 * Vérifie si l'utilisateur a donné les 3 types différents (badge Polyvalent).
 */
export function hasAllDonationTypes(donations: Donation[]): boolean {
  const types = new Set(donations.map((d) => d.type));
  return (
    types.has("whole_blood") && types.has("platelets") && types.has("plasma")
  );
}

/**
 * Calcule le streak : nombre de dons consécutifs respectant le délai légal.
 * Un don en dehors du délai (ou manqué) remet le streak à 0.
 */
export function computeStreak(donations: Donation[]): number {
  if (donations.length === 0) return 0;

  const sorted = [...donations].sort(
    (a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime(),
  );

  let streak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const cooldown = DONATION_COOLDOWN_DAYS[prev.type];
    const minNext = addDays(parseISO(prev.date), cooldown);
    // Tolérance de 7 jours après le délai légal (pas trop en retard)
    const maxNext = addDays(parseISO(prev.date), cooldown + 7 * 4); // ~4 semaines maxi de retard

    if (
      isAfter(parseISO(curr.date), minNext) &&
      isAfter(maxNext, parseISO(curr.date))
    ) {
      streak++;
    } else if (isAfter(parseISO(curr.date), minNext)) {
      // Don fait mais hors fenêtre idéale → reset
      streak = 1;
    }
  }

  return streak;
}
