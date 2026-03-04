import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  BADGES_CATALOG,
  PREDEFINED_TEAMS,
  LIVES_PER_DONATION_TYPE,
} from "@shared/constants";
import type {
  AppState,
  Badge,
  Donation,
  Team,
  UserProfile,
} from "@shared/types";
import { computeEarnedBadgeIds, getLevelConfig, mergeBadges } from "@shared/utils/levels";

const defaultProfile: UserProfile = {
  id: typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36),
  bloodType: "unknown",
  sex: "male",
  onboardingCompleted: false,
  notificationsEnabled: false,
  createdAt: new Date().toISOString(),
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: null,
      donations: [],
      badges: [...BADGES_CATALOG],
      teams: [...PREDEFINED_TEAMS],
      isOnboardingCompleted: false,

      setProfile: (profile: UserProfile) =>
        set({ profile }),

      updateProfile: (partial: Partial<UserProfile>) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, ...partial }
            : null,
        })),

      addDonation: (donation: Donation) =>
        set((state) => {
          const newDonations = [...state.donations, donation];
          const profile = state.profile;
          if (!profile) return { donations: newDonations };

          const earnedIds = computeEarnedBadgeIds(newDonations, profile);
          const newBadges = mergeBadges(earnedIds, state.badges);

          return { donations: newDonations, badges: newBadges };
        }),

      unlockBadge: (badgeId: string) =>
        set((state) => ({
          badges: state.badges.map((b) =>
            b.id === badgeId && !b.isUnlocked
              ? { ...b, isUnlocked: true, unlockedAt: new Date().toISOString() }
              : b,
          ),
        })),

      completeOnboarding: () =>
        set({
          isOnboardingCompleted: true,
        }),

      resetApp: () =>
        set({
          profile: null,
          donations: [],
          badges: [...BADGES_CATALOG],
          isOnboardingCompleted: false,
        }),

      joinTeam: (code: string) => {
        const team = get().teams.find(
          (t) => t.code.toUpperCase() === code.toUpperCase(),
        );
        if (!team) throw new Error("Code equipe invalide");

        set((state) => ({
          profile: state.profile
            ? { ...state.profile, teamCode: code.toUpperCase() }
            : null,
        }));

        return team;
      },

      leaveTeam: () =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, teamCode: undefined }
            : null,
        })),
    }),
    {
      name: "lifedrop-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// Selectors
export const selectDonationCount = (state: AppState) => state.donations.length;
export const selectLivesSaved = (state: AppState) =>
  state.donations.reduce(
    (sum, d) => sum + (LIVES_PER_DONATION_TYPE[d.type] ?? 1),
    0,
  );
export const selectUnlockedBadges = (state: AppState) =>
  state.badges.filter((b) => b.isUnlocked);
export const selectCurrentTeam = (state: AppState) =>
  state.profile?.teamCode
    ? state.teams.find(
        (t) => t.code === state.profile?.teamCode,
      ) ?? null
    : null;
