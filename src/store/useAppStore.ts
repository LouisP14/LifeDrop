// ============================================================
// src/store/useAppStore.ts
// Store global Zustand — persistance via AsyncStorage
// ============================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { BADGES_CATALOG, LIVES_PER_DONATION_TYPE, PREDEFINED_TEAMS } from "../constants";
import type { AppState, Badge, Donation, Team, TeamMember, UserProfile } from "../types";
import { computeEarnedBadgeIds, getLevelConfig, mergeBadges } from "../utils/levels";

// ─── Profil par défaut ────────────────────────────────────────
const defaultProfile: UserProfile = {
  id: Crypto.randomUUID(),
  bloodType: "unknown",
  sex: "male",
  onboardingCompleted: false,
  notificationsEnabled: false,
  createdAt: new Date().toISOString(),
};

// ─── Store Zustand ────────────────────────────────────────────
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      donations: [],
      badges: BADGES_CATALOG, // badge catalogue initialisé non-débloqué
      teams: [],
      isOnboardingCompleted: false,

      // ── Profil ─────────────────────────────────────────────
      setProfile: (profile: UserProfile) => {
        set({ profile });
      },

      updateProfile: (partial: Partial<UserProfile>) => {
        const current = get().profile;
        if (!current) return;
        set({ profile: { ...current, ...partial } });
      },

      // ── Dons ───────────────────────────────────────────────
      addDonation: (donation: Donation) => {
        const state = get();
        const newDonations = [...state.donations, donation];

        // Recalcul des badges après chaque don
        const profile = state.profile;
        if (!profile) {
          set({ donations: newDonations });
          return;
        }

        const earnedIds = computeEarnedBadgeIds(newDonations, profile);
        const updatedBadges = mergeBadges(earnedIds, state.badges);

        // Sync membre de l'équipe courante
        let updatedTeams = state.teams;
        if (profile.teamCode) {
          const member: TeamMember = {
            id: profile.id,
            name: profile.name ?? "Moi",
            donationCount: newDonations.length,
            level: getLevelConfig(newDonations.length).level,
          };
          updatedTeams = state.teams.map((team) => {
            if (team.code !== profile.teamCode) return team;
            const idx = team.members.findIndex((m) => m.id === profile.id);
            const members = idx >= 0
              ? team.members.map((m, i) => (i === idx ? member : m))
              : [...team.members, member];
            return { ...team, members };
          });
        }

        set({ donations: newDonations, badges: updatedBadges, teams: updatedTeams });
      },

      // ── Badges ─────────────────────────────────────────────
      unlockBadge: (badgeId: string) => {
        const badges = get().badges.map((b: Badge) =>
          b.id === badgeId
            ? { ...b, isUnlocked: true, unlockedAt: new Date().toISOString() }
            : b,
        );
        set({ badges });
      },

      // ── Onboarding ─────────────────────────────────────────
      completeOnboarding: () => {
        const current = get().profile;
        set({
          isOnboardingCompleted: true,
          profile: current
            ? { ...current, onboardingCompleted: true }
            : current,
        });
      },

      // ── Équipes ────────────────────────────────────────────
      joinTeam: (code: string): Team => {
        const trimmed = code.toUpperCase();
        const { teams, profile, donations } = get();

        // Chercher dans les prédéfinis puis dans le store
        const predefined = PREDEFINED_TEAMS.find((t) => t.code === trimmed);
        const existing = teams.find((t) => t.code === trimmed);

        let team: Team = existing ?? predefined ?? {
          id: `team-${trimmed.toLowerCase()}`,
          code: trimmed,
          name: trimmed,
          members: [],
        };

        // Ajouter le profil courant comme membre
        const member: TeamMember = {
          id: profile?.id ?? "unknown",
          name: profile?.name ?? "Moi",
          donationCount: donations.length,
          level: getLevelConfig(donations.length).level,
        };
        const memberIdx = team.members.findIndex((m) => m.id === member.id);
        const members = memberIdx >= 0
          ? team.members.map((m, i) => (i === memberIdx ? member : m))
          : [...team.members, member];
        team = { ...team, members };

        const updatedTeams = existing
          ? teams.map((t) => (t.code === trimmed ? team : t))
          : [...teams, team];

        set({ teams: updatedTeams });
        get().updateProfile({ teamCode: trimmed });
        return team;
      },

      leaveTeam: () => {
        const { profile, teams } = get();
        if (!profile?.teamCode) return;
        const updatedTeams = teams.map((team) => {
          if (team.code !== profile.teamCode) return team;
          return { ...team, members: team.members.filter((m) => m.id !== profile.id) };
        });
        set({ teams: updatedTeams });
        get().updateProfile({ teamCode: undefined });
      },

      // ── Reset (dev / debug) ─────────────────────────────────
      resetApp: () => {
        set({
          profile: { ...defaultProfile, id: Crypto.randomUUID() },
          donations: [],
          badges: BADGES_CATALOG,
          teams: [],
          isOnboardingCompleted: false,
        });
      },
    }),
    {
      name: "lifedrop-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

// ─── Sélecteurs dérivés ───────────────────────────────────────

/** Nombre total de dons */
export const selectDonationCount = (s: AppState) => s.donations.length;

/** Vies potentiellement sauvées (sang=3, plaquettes=1, plasma=1) */
export const selectLivesSaved = (s: AppState) =>
  s.donations.reduce(
    (sum, d) => sum + (LIVES_PER_DONATION_TYPE[d.type] ?? 1),
    0,
  );

/** Badges débloqués uniquement */
export const selectUnlockedBadges = (s: AppState) =>
  s.badges.filter((b) => b.isUnlocked);

/** Équipe actuellement rejointe */
export const selectCurrentTeam = (s: AppState): Team | undefined =>
  s.profile?.teamCode
    ? s.teams.find((t) => t.code === s.profile!.teamCode)
    : undefined;
