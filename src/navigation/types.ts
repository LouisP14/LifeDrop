// ============================================================
// src/navigation/types.ts
// Déclaration des types de navigation (param lists)
// ============================================================

import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { DonationType } from "../types";

// ─── Stack Onboarding ─────────────────────────────────────────
export type OnboardingStackParamList = {
  Welcome: undefined;
  BloodType: undefined;
  LastDonation: undefined;
  NotificationsSetup: undefined;
};

// ─── Stack principal (tabs imbriqués) ─────────────────────────
export type MainTabParamList = {
  Dashboard: undefined;
  Profile: undefined;
  Education: undefined;
};

// ─── Stack modal (par-dessus les tabs) ────────────────────────
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  RegisterDonation: undefined;
  DonationSuccess: {
    donationId: string;
    livesSaved: number;
    newBadges: string[]; // IDs des nouveaux badges débloqués
    donationType: DonationType;
  };
  BadgeDetail: {
    badgeId: string;
  };
  ShareProfile: undefined;
  ShareImpact: {
    donationType: DonationType;
    livesSaved: number; // total cumulé
  };
  TeamJoin: undefined;
  TeamDashboard: { teamCode: string };
};

// ─── Types de props prêts à l'emploi par écran ───────────────

export type WelcomeScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  "Welcome"
>;
export type BloodTypeScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  "BloodType"
>;
export type LastDonationScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  "LastDonation"
>;
export type NotificationsSetupScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  "NotificationsSetup"
>;
export type DashboardScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Dashboard">,
  NativeStackScreenProps<RootStackParamList>
>;
export type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Profile">,
  NativeStackScreenProps<RootStackParamList>
>;
export type EducationScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Education">,
  NativeStackScreenProps<RootStackParamList>
>;
export type RegisterDonationScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "RegisterDonation"
>;
export type DonationSuccessScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "DonationSuccess"
>;
export type ShareImpactScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ShareImpact"
>;
export type TeamDashboardScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "TeamDashboard"
>;
export type TeamJoinScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "TeamJoin"
>;
