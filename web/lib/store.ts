import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  BADGES_CATALOG,
  PREDEFINED_TEAMS,
  LIVES_PER_DONATION_TYPE,
} from "@shared/constants";
import type {
  AppState,
  Donation,
  UserProfile,
} from "@shared/types";
import { computeEarnedBadgeIds, mergeBadges } from "@shared/utils/levels";
import {
  fetchProfile,
  upsertProfile,
  fetchDonations,
  insertDonation,
  updateDonation as dbUpdateDonation,
  deleteDonation as dbDeleteDonation,
  fetchUserBadges,
  upsertUserBadges,
} from "./supabase-db";

export interface AppStoreExtra {
  syncWithSupabase: (userId: string) => Promise<void>;
  supabaseUserId: string | null;
}

export const useAppStore = create<AppState & AppStoreExtra>()(
  persist(
    (set, get) => ({
      profile: null,
      donations: [],
      badges: [...BADGES_CATALOG],
      teams: [...PREDEFINED_TEAMS],
      isOnboardingCompleted: false,
      supabaseUserId: null,

      setProfile: (profile: UserProfile) => {
        set({ profile });
        const uid = get().supabaseUserId;
        if (uid) upsertProfile(uid, profile).catch(console.error);
      },

      updateProfile: (partial: Partial<UserProfile>) => {
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, ...partial }
            : null,
        }));
        const uid = get().supabaseUserId;
        const profile = get().profile;
        if (uid && profile) upsertProfile(uid, profile).catch(console.error);
      },

      addDonation: (donation: Donation) => {
        set((state) => {
          const newDonations = [...state.donations, donation];
          const profile = state.profile;
          if (!profile) return { donations: newDonations };

          const earnedIds = computeEarnedBadgeIds(newDonations, profile);
          const newBadges = mergeBadges(earnedIds, state.badges);

          return { donations: newDonations, badges: newBadges };
        });

        const uid = get().supabaseUserId;
        if (uid) {
          insertDonation(uid, donation).catch(console.error);
          const profile = get().profile;
          if (profile) {
            const earned = computeEarnedBadgeIds(get().donations, profile);
            upsertUserBadges(uid, earned).catch(console.error);
          }
        }
      },

      updateDonation: (donation: Donation) => {
        set((state) => {
          const newDonations = state.donations.map((d) =>
            d.id === donation.id ? donation : d,
          );
          const profile = state.profile;
          if (!profile) return { donations: newDonations };
          const earnedIds = computeEarnedBadgeIds(newDonations, profile);
          const newBadges = mergeBadges(earnedIds, state.badges);
          return { donations: newDonations, badges: newBadges };
        });
        const uid = get().supabaseUserId;
        if (uid) {
          dbUpdateDonation(uid, donation).catch(console.error);
          const profile = get().profile;
          if (profile) {
            const earned = computeEarnedBadgeIds(get().donations, profile);
            upsertUserBadges(uid, earned).catch(console.error);
          }
        }
      },

      deleteDonation: (donationId: string) => {
        set((state) => {
          const newDonations = state.donations.filter((d) => d.id !== donationId);
          const profile = state.profile;
          if (!profile) return { donations: newDonations };
          const earnedIds = computeEarnedBadgeIds(newDonations, profile);
          const newBadges = mergeBadges(earnedIds, state.badges);
          return { donations: newDonations, badges: newBadges };
        });
        const uid = get().supabaseUserId;
        if (uid) {
          dbDeleteDonation(uid, donationId).catch(console.error);
          const profile = get().profile;
          if (profile) {
            const earned = computeEarnedBadgeIds(get().donations, profile);
            upsertUserBadges(uid, earned).catch(console.error);
          }
        }
      },

      unlockBadge: (badgeId: string) =>
        set((state) => ({
          badges: state.badges.map((b) =>
            b.id === badgeId && !b.isUnlocked
              ? { ...b, isUnlocked: true, unlockedAt: new Date().toISOString() }
              : b,
          ),
        })),

      completeOnboarding: () => {
        set({ isOnboardingCompleted: true });
        const uid = get().supabaseUserId;
        const profile = get().profile;
        if (uid && profile) {
          upsertProfile(uid, { ...profile, onboardingCompleted: true }).catch(console.error);
        }
      },

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

        const uid = get().supabaseUserId;
        if (uid) {
          upsertProfile(uid, { teamCode: code.toUpperCase() }).catch(console.error);
        }

        return team;
      },

      leaveTeam: () =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, teamCode: undefined }
            : null,
        })),

      syncWithSupabase: async (userId: string) => {
        set({ supabaseUserId: userId });

        try {
          const remoteProfile = await fetchProfile(userId);

          if (remoteProfile) {
            const remoteDonations = await fetchDonations(userId);
            const remoteBadgeIds = await fetchUserBadges(userId);

            const badges = BADGES_CATALOG.map((b) => ({
              ...b,
              isUnlocked: remoteBadgeIds.includes(b.id),
              unlockedAt: remoteBadgeIds.includes(b.id)
                ? new Date().toISOString()
                : undefined,
            }));

            set({
              profile: remoteProfile,
              donations: remoteDonations,
              badges,
              isOnboardingCompleted: remoteProfile.onboardingCompleted,
            });
          } else {
            const { profile, donations, badges } = get();
            if (profile && profile.onboardingCompleted) {
              await upsertProfile(userId, profile);
              for (const d of donations) {
                await insertDonation(userId, d).catch(() => {});
              }
              const earnedIds = badges
                .filter((b) => b.isUnlocked)
                .map((b) => b.id);
              await upsertUserBadges(userId, earnedIds);
            }
          }
        } catch (err) {
          console.error("Sync with Supabase failed:", err);
        }
      },
    }),
    {
      name: "lifedrop-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profile: state.profile,
        donations: state.donations,
        badges: state.badges,
        isOnboardingCompleted: state.isOnboardingCompleted,
      }),
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
