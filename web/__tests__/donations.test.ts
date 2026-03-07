import { describe, it, expect } from "vitest";
import {
  computeLivesSaved,
  computeEligibility,
  computeEligibilityPerType,
  computeStreak,
  hasAllDonationTypes,
  getLastDonation,
  getDonationsThisYear,
} from "@shared/utils/donations";
import type { Donation } from "@shared/types";

function makeDonation(overrides: Partial<Donation> = {}): Donation {
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    type: "whole_blood",
    ...overrides,
  };
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

// ── computeLivesSaved ────────────────────────────────────────

describe("computeLivesSaved", () => {
  it("returns 0 for no donations", () => {
    expect(computeLivesSaved([])).toBe(0);
  });

  it("counts 3 lives for whole_blood", () => {
    expect(computeLivesSaved([makeDonation({ type: "whole_blood" })])).toBe(3);
  });

  it("counts 1 life for platelets", () => {
    expect(computeLivesSaved([makeDonation({ type: "platelets" })])).toBe(1);
  });

  it("counts 1 life for plasma", () => {
    expect(computeLivesSaved([makeDonation({ type: "plasma" })])).toBe(1);
  });

  it("sums multiple donations correctly", () => {
    const donations = [
      makeDonation({ type: "whole_blood" }),
      makeDonation({ type: "platelets" }),
      makeDonation({ type: "plasma" }),
      makeDonation({ type: "whole_blood" }),
    ];
    expect(computeLivesSaved(donations)).toBe(8); // 3 + 1 + 1 + 3
  });
});

// ── computeEligibilityPerType ────────────────────────────────

describe("computeEligibilityPerType", () => {
  it("all types eligible with no donations", () => {
    const result = computeEligibilityPerType([]);
    expect(result.whole_blood.canDonate).toBe(true);
    expect(result.platelets.canDonate).toBe(true);
    expect(result.plasma.canDonate).toBe(true);
  });

  it("blocks whole_blood within 56-day cooldown", () => {
    const donations = [makeDonation({ type: "whole_blood", date: daysAgo(10) })];
    const result = computeEligibilityPerType(donations);
    expect(result.whole_blood.canDonate).toBe(false);
    expect(result.whole_blood.daysRemaining).toBeGreaterThan(0);
  });

  it("allows whole_blood after 56 days", () => {
    const donations = [makeDonation({ type: "whole_blood", date: daysAgo(57) })];
    const result = computeEligibilityPerType(donations);
    expect(result.whole_blood.canDonate).toBe(true);
  });

  it("blocks platelets within 28-day cooldown", () => {
    const donations = [makeDonation({ type: "platelets", date: daysAgo(5) })];
    const result = computeEligibilityPerType(donations);
    expect(result.platelets.canDonate).toBe(false);
  });

  it("allows plasma after 14 days", () => {
    const donations = [makeDonation({ type: "plasma", date: daysAgo(15) })];
    const result = computeEligibilityPerType(donations);
    expect(result.plasma.canDonate).toBe(true);
  });

  it("only blocks the donated type, not others", () => {
    const donations = [makeDonation({ type: "whole_blood", date: daysAgo(5) })];
    const result = computeEligibilityPerType(donations);
    expect(result.whole_blood.canDonate).toBe(false);
    expect(result.platelets.canDonate).toBe(true);
    expect(result.plasma.canDonate).toBe(true);
  });
});

// ── computeEligibility (global) ──────────────────────────────

describe("computeEligibility", () => {
  it("can donate when no donations exist", () => {
    expect(computeEligibility([]).canDonate).toBe(true);
  });

  it("can donate when at least one type is available", () => {
    const donations = [makeDonation({ type: "whole_blood", date: daysAgo(5) })];
    expect(computeEligibility(donations).canDonate).toBe(true);
  });

  it("cannot donate when all types are blocked", () => {
    const donations = [
      makeDonation({ type: "whole_blood", date: daysAgo(2) }),
      makeDonation({ type: "platelets", date: daysAgo(2) }),
      makeDonation({ type: "plasma", date: daysAgo(2) }),
    ];
    const result = computeEligibility(donations);
    expect(result.canDonate).toBe(false);
    expect(result.daysRemaining).toBeGreaterThan(0);
  });
});

// ── computeStreak ────────────────────────────────────────────

describe("computeStreak", () => {
  it("returns 0 for no donations", () => {
    expect(computeStreak([])).toBe(0);
  });

  it("returns 1 for a single donation", () => {
    expect(computeStreak([makeDonation()])).toBe(1);
  });

  it("counts consecutive donations within the window", () => {
    const donations = [
      makeDonation({ type: "plasma", date: daysAgo(60) }),
      makeDonation({ type: "plasma", date: daysAgo(40) }),
      makeDonation({ type: "plasma", date: daysAgo(20) }),
    ];
    expect(computeStreak(donations)).toBe(3);
  });
});

// ── hasAllDonationTypes ──────────────────────────────────────

describe("hasAllDonationTypes", () => {
  it("returns false with empty array", () => {
    expect(hasAllDonationTypes([])).toBe(false);
  });

  it("returns false with only one type", () => {
    expect(hasAllDonationTypes([makeDonation({ type: "whole_blood" })])).toBe(false);
  });

  it("returns true with all three types", () => {
    const donations = [
      makeDonation({ type: "whole_blood" }),
      makeDonation({ type: "platelets" }),
      makeDonation({ type: "plasma" }),
    ];
    expect(hasAllDonationTypes(donations)).toBe(true);
  });
});

// ── getLastDonation ──────────────────────────────────────────

describe("getLastDonation", () => {
  it("returns null for empty array", () => {
    expect(getLastDonation([])).toBeNull();
  });

  it("returns the most recent donation", () => {
    const old = makeDonation({ id: "old", date: daysAgo(30) });
    const recent = makeDonation({ id: "recent", date: daysAgo(1) });
    expect(getLastDonation([old, recent])?.id).toBe("recent");
  });
});

// ── getDonationsThisYear ─────────────────────────────────────

describe("getDonationsThisYear", () => {
  it("filters out donations from previous years", () => {
    const thisYear = makeDonation({ id: "this", date: daysAgo(5) });
    const lastYear = makeDonation({ id: "last", date: "2024-01-01T00:00:00.000Z" });
    const result = getDonationsThisYear([thisYear, lastYear]);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("this");
  });
});
