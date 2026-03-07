// ============================================================
// shared/types/index.ts
// Types partagés entre l'app mobile (Expo) et le site web (Next.js)
// ============================================================

/** Groupes sanguins reconnus */
export type BloodType =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-"
  | "unknown";

/** Sexe biologique */
export type BiologicalSex = "male" | "female";

/** Types de dons avec leurs délais légaux (en jours) */
export type DonationType = "whole_blood" | "platelets" | "plasma";

/** Niveaux de gamification */
export type DonationLevel = "bronze" | "silver" | "gold" | "platinum";

/** Statut d'un badge */
export interface Badge {
  id: string;
  label: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

/** Un don enregistré */
export interface Donation {
  id: string;
  date: string;
  type: DonationType;
  location?: string;
  notes?: string;
}

/** Profil d'un membre d'une équipe entreprise */
export interface TeamMember {
  id: string;
  name: string;
  donationCount: number;
  level: DonationLevel;
}

/** Équipe entreprise */
export interface Team {
  id: string;
  code: string;
  name: string;
  members: TeamMember[];
}

/** Profil utilisateur complet */
export interface UserProfile {
  id: string;
  bloodType: BloodType;
  sex: BiologicalSex;
  name?: string;
  onboardingCompleted: boolean;
  notificationsEnabled: boolean;
  referralCode?: string;
  teamCode?: string;
  createdAt: string;
}

/** État global de l'application */
export interface AppState {
  profile: UserProfile | null;
  donations: Donation[];
  badges: Badge[];
  teams: Team[];
  isOnboardingCompleted: boolean;

  setProfile: (profile: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  addDonation: (donation: Donation) => void;
  updateDonation: (donation: Donation) => void;
  deleteDonation: (donationId: string) => void;
  unlockBadge: (badgeId: string) => void;
  completeOnboarding: () => void;
  resetApp: () => void;
  joinTeam: (code: string) => Team;
  leaveTeam: () => void;
}

/** État des notifications push */
export interface NotificationState {
  token: string | null;
  scheduledIds: string[];
}

/** Résultat du calcul d'éligibilité au prochain don */
export interface EligibilityResult {
  canDonate: boolean;
  reason?: "cooldown";
  eligibleFrom?: Date;
  daysRemaining?: number;
}

/** Éligibilité indépendante par type de don */
export type PerTypeEligibility = Record<DonationType, EligibilityResult>;

/** Données pour la carte de partage du profil */
export interface ShareCardData {
  name?: string;
  bloodType: BloodType;
  donationCount: number;
  livesSaved: number;
  level: DonationLevel;
  levelLabel: string;
  badges: Badge[];
}
