// ============================================================
// shared/utils/donations.ts
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

export function computeLivesSaved(donations: Donation[]): number {
  return donations.reduce(
    (sum, d) => sum + (LIVES_PER_DONATION_TYPE[d.type] ?? 1),
    0,
  );
}

export function getDonationsThisYear(donations: Donation[]): Donation[] {
  const yearStart = startOfYear(new Date());
  return donations.filter((d) => isAfter(parseISO(d.date), yearStart));
}

export function getLastDonation(donations: Donation[]): Donation | null {
  if (donations.length === 0) return null;
  return [...donations].sort(
    (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime(),
  )[0];
}

export function computeEligibility(donations: Donation[]): EligibilityResult {
  const perType = computeEligibilityPerType(donations);
  const types: DonationType[] = ["whole_blood", "plasma", "platelets"];

  const anyAvailable = types.some((t) => perType[t].canDonate);
  if (anyAvailable) {
    return { canDonate: true };
  }

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

export function computeEligibilityPerType(
  donations: Donation[],
): PerTypeEligibility {
  const today = new Date();
  const types: DonationType[] = ["whole_blood", "plasma", "platelets"];
  const result = {} as PerTypeEligibility;

  for (const type of types) {
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

export function hasAllDonationTypes(donations: Donation[]): boolean {
  const types = new Set(donations.map((d) => d.type));
  return (
    types.has("whole_blood") && types.has("platelets") && types.has("plasma")
  );
}

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
    const maxNext = addDays(parseISO(prev.date), cooldown + 7 * 4);

    if (
      isAfter(parseISO(curr.date), minNext) &&
      isAfter(maxNext, parseISO(curr.date))
    ) {
      streak++;
    } else if (isAfter(parseISO(curr.date), minNext)) {
      streak = 1;
    }
  }

  return streak;
}
