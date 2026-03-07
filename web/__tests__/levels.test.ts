import { describe, it, expect } from "vitest";
import {
  getLevelConfig,
  getLevelProgress,
  getNextLevelConfig,
  computeEarnedBadgeIds,
  mergeBadges,
  getNewlyUnlockedBadgeIds,
} from "@shared/utils/levels";
import { BADGES_CATALOG } from "@shared/constants";
import type { Donation, UserProfile, Badge } from "@shared/types";

function makeDonation(type: Donation["type"] = "whole_blood", date?: string): Donation {
  return {
    id: crypto.randomUUID(),
    date: date ?? new Date().toISOString(),
    type,
  };
}

const baseProfile: UserProfile = {
  id: "test-user",
  bloodType: "A+",
  sex: "male",
  onboardingCompleted: true,
  notificationsEnabled: false,
  createdAt: new Date().toISOString(),
};

// ── getLevelConfig ────────────────────────────────────────────

describe("getLevelConfig", () => {
  it("returns bronze for 0 donations", () => {
    expect(getLevelConfig(0).level).toBe("bronze");
  });

  it("returns bronze for 3 donations", () => {
    expect(getLevelConfig(3).level).toBe("bronze");
  });

  it("returns silver for 4 donations", () => {
    expect(getLevelConfig(4).level).toBe("silver");
  });

  it("returns gold for 10 donations", () => {
    expect(getLevelConfig(10).level).toBe("gold");
  });

  it("returns platinum for 20+ donations", () => {
    expect(getLevelConfig(20).level).toBe("platinum");
    expect(getLevelConfig(100).level).toBe("platinum");
  });
});

// ── getLevelProgress ─────────────────────────────────────────

describe("getLevelProgress", () => {
  it("returns > 0 for 1 donation", () => {
    expect(getLevelProgress(1)).toBeGreaterThan(0);
  });

  it("returns 100 for platinum (no cap)", () => {
    expect(getLevelProgress(25)).toBe(100);
  });
});

// ── getNextLevelConfig ───────────────────────────────────────

describe("getNextLevelConfig", () => {
  it("returns silver after bronze", () => {
    expect(getNextLevelConfig(1)?.level).toBe("silver");
  });

  it("returns null for platinum", () => {
    expect(getNextLevelConfig(20)).toBeNull();
  });
});

// ── computeEarnedBadgeIds ────────────────────────────────────

describe("computeEarnedBadgeIds", () => {
  it("returns empty for 0 donations", () => {
    expect(computeEarnedBadgeIds([], baseProfile)).toEqual([]);
  });

  it("returns first_drop for 1 donation", () => {
    const badges = computeEarnedBadgeIds([makeDonation()], baseProfile);
    expect(badges).toContain("first_drop");
  });

  it("returns bronze for 3 donations", () => {
    const donations = Array.from({ length: 3 }, () => makeDonation());
    const badges = computeEarnedBadgeIds(donations, baseProfile);
    expect(badges).toContain("bronze");
  });

  it("returns diversifier when all types are donated", () => {
    const donations = [
      makeDonation("whole_blood"),
      makeDonation("platelets"),
      makeDonation("plasma"),
    ];
    const badges = computeEarnedBadgeIds(donations, baseProfile);
    expect(badges).toContain("diversifier");
  });

  it("returns universal_donor for O-", () => {
    const profile = { ...baseProfile, bloodType: "O-" as const };
    const badges = computeEarnedBadgeIds([makeDonation()], profile);
    expect(badges).toContain("universal_donor");
  });

  it("does NOT return universal_donor for A+", () => {
    const badges = computeEarnedBadgeIds([makeDonation()], baseProfile);
    expect(badges).not.toContain("universal_donor");
  });
});

// ── mergeBadges ──────────────────────────────────────────────

describe("mergeBadges", () => {
  it("unlocks a new badge", () => {
    const result = mergeBadges(["first_drop"], BADGES_CATALOG);
    const firstDrop = result.find((b) => b.id === "first_drop");
    expect(firstDrop?.isUnlocked).toBe(true);
    expect(firstDrop?.unlockedAt).toBeDefined();
  });

  it("keeps already unlocked badges", () => {
    const prev: Badge[] = BADGES_CATALOG.map((b) =>
      b.id === "first_drop" ? { ...b, isUnlocked: true, unlockedAt: "2025-01-01" } : b,
    );
    const result = mergeBadges(["first_drop"], prev);
    const firstDrop = result.find((b) => b.id === "first_drop");
    expect(firstDrop?.unlockedAt).toBe("2025-01-01");
  });
});

// ── getNewlyUnlockedBadgeIds ─────────────────────────────────

describe("getNewlyUnlockedBadgeIds", () => {
  it("detects newly unlocked badges", () => {
    const prev = BADGES_CATALOG; // all locked
    const next = BADGES_CATALOG.map((b) =>
      b.id === "first_drop" ? { ...b, isUnlocked: true } : b,
    );
    expect(getNewlyUnlockedBadgeIds(prev, next)).toEqual(["first_drop"]);
  });

  it("returns empty when nothing changed", () => {
    expect(getNewlyUnlockedBadgeIds(BADGES_CATALOG, BADGES_CATALOG)).toEqual([]);
  });
});
