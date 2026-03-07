// ============================================================
// shared/constants/index.ts
// Constantes métier partagées entre mobile et web
// ============================================================

import type { Badge, BloodType, DonationLevel, DonationType, Team } from "../types";

// --- Liste des groupes sanguins ---
export const BLOOD_TYPES: BloodType[] = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
];

// --- Délais légaux entre deux dons (en jours) ---
export const DONATION_COOLDOWN_DAYS: Record<DonationType, number> = {
  whole_blood: 56,
  platelets: 28,
  plasma: 14,
};

// --- Labels lisibles par type ---
export const DONATION_TYPE_LABELS: Record<
  DonationType,
  { label: string; icon: string; delay: string }
> = {
  whole_blood: { label: "Sang total", icon: "water", delay: "56 jours" },
  platelets: { label: "Plaquettes", icon: "microscope", delay: "28 jours" },
  plasma: { label: "Plasma", icon: "water-outline", delay: "14 jours" },
};

// --- Vies sauvées par type de don ---
export const LIVES_PER_DONATION = 3;
export const LIVES_PER_DONATION_TYPE: Record<DonationType, number> = {
  whole_blood: 3,
  platelets: 1,
  plasma: 1,
};

// --- Niveaux de gamification ---
export interface LevelConfig {
  level: DonationLevel;
  label: string;
  minDonations: number;
  maxDonations: number | null;
  color: string;
  icon: string;
}

export const DONATION_LEVELS: LevelConfig[] = [
  { level: "bronze", label: "Bronze", minDonations: 1, maxDonations: 3, color: "#CD7F32", icon: "medal" },
  { level: "silver", label: "Argent", minDonations: 4, maxDonations: 9, color: "#C0C0C0", icon: "medal" },
  { level: "gold", label: "Or", minDonations: 10, maxDonations: 19, color: "#FFD700", icon: "trophy" },
  { level: "platinum", label: "Platine", minDonations: 20, maxDonations: null, color: "#E5E4E2", icon: "diamond-stone" },
];

// --- Catalogue de badges ---
export const BADGES_CATALOG: Badge[] = [
  { id: "first_drop", label: "Premiere Goutte", description: "Ton premier don enregistre -- bienvenue dans l'aventure !", icon: "water", isUnlocked: false },
  { id: "bronze", label: "Rang Bronze", description: "Tu as effectue 3 dons. Le voyage commence.", icon: "medal", isUnlocked: false },
  { id: "silver", label: "Rang Argent", description: "4 dons -- tu es un donneur regulier.", icon: "medal", isUnlocked: false },
  { id: "gold", label: "Rang Or", description: "10 dons -- tu fais partie des heros du quotidien.", icon: "trophy", isUnlocked: false },
  { id: "platinum", label: "Rang Platine", description: "20 dons -- un engagement exceptionnel.", icon: "diamond-stone", isUnlocked: false },
  { id: "diversifier", label: "Polyvalent", description: "Tu as donne les 3 types de sang differents.", icon: "shuffle-variant", isUnlocked: false },
  { id: "streak_3", label: "Regularite x3", description: "3 dons consecutifs respectant le delai legal.", icon: "fire", isUnlocked: false },
  { id: "streak_6", label: "Regularite x6", description: "6 dons consecutifs reguliers.", icon: "lightning-bolt", isUnlocked: false },
  { id: "lives_10", label: "10 Vies", description: "Tu as potentiellement sauve 10 vies.", icon: "heart", isUnlocked: false },
  { id: "lives_30", label: "30 Vies", description: "Tu as potentiellement sauve 30 vies.", icon: "cards-heart", isUnlocked: false },
  { id: "lives_60", label: "60 Vies", description: "60 vies potentiellement sauvees -- legende.", icon: "star", isUnlocked: false },
  { id: "universal_donor", label: "Donneur Universel", description: "Tu es O- : ton sang aide tout le monde.", icon: "earth", isUnlocked: false },
];

// --- Informations par groupe sanguin ---
export const BLOOD_TYPE_INFO: Record<
  BloodType,
  { description: string; canReceiveFrom: string[]; canDonateTo: string[] }
> = {
  "O-": {
    description: "Donneur universel -- ton sang peut etre transfuse a n'importe qui en urgence.",
    canReceiveFrom: ["O-"],
    canDonateTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  },
  "O+": {
    description: "L'un des groupes les plus demandes. Compatible avec la majorite des receveurs.",
    canReceiveFrom: ["O-", "O+"],
    canDonateTo: ["O+", "A+", "B+", "AB+"],
  },
  "A-": {
    description: "Ton plasma est precieux et compatible avec beaucoup de patients.",
    canReceiveFrom: ["A-", "O-"],
    canDonateTo: ["A-", "A+", "AB-", "AB+"],
  },
  "A+": {
    description: "Groupe tres repandu -- les dons de plaquettes sont particulierement utiles.",
    canReceiveFrom: ["A-", "A+", "O-", "O+"],
    canDonateTo: ["A+", "AB+"],
  },
  "B-": {
    description: "Groupe rare -- chaque don compte enormement pour les stocks.",
    canReceiveFrom: ["B-", "O-"],
    canDonateTo: ["B-", "B+", "AB-", "AB+"],
  },
  "B+": {
    description: "Ton sang est compatible avec AB+ et B+, groupes souvent en tension.",
    canReceiveFrom: ["B-", "B+", "O-", "O+"],
    canDonateTo: ["B+", "AB+"],
  },
  "AB-": {
    description: "Donneur universel de plasma -- precieux pour les soins intensifs.",
    canReceiveFrom: ["A-", "B-", "O-", "AB-"],
    canDonateTo: ["AB-", "AB+"],
  },
  "AB+": {
    description: "Receveur universel -- et tes plaquettes sont compatibles avec tous.",
    canReceiveFrom: ["A-", "A+", "B-", "B+", "O-", "O+", "AB-", "AB+"],
    canDonateTo: ["AB+"],
  },
  unknown: {
    description: "Groupe sanguin non renseigne. Mets-le a jour dans ton profil.",
    canReceiveFrom: [],
    canDonateTo: [],
  },
};

// --- Équipes prédéfinies ---
export const PREDEFINED_TEAMS: Team[] = [
  { id: "team-lifedrop2026", code: "LIFEDROP2026", name: "Equipe LifeDrop", members: [] },
  { id: "team-croixrouge", code: "CROIXROUGE", name: "Croix-Rouge Francaise", members: [] },
  { id: "team-efs", code: "EFS2026", name: "EFS Ile-de-France", members: [] },
  { id: "team-pompiers", code: "POMPIERS", name: "Les Pompiers Donneurs", members: [] },
];

// --- Cartes "Le saviez-vous ?" ---
export const DID_YOU_KNOW_CARDS = [
  { id: "1", content: "Chaque don de sang peut sauver jusqu'a 3 personnes grace a la separation en composants : globules rouges, plaquettes et plasma." },
  { id: "2", content: "En France, seulement 4 % de la population donne son sang chaque annee, alors que 10 000 dons sont necessaires chaque jour." },
  { id: "3", content: "Le sang se compose a 55 % de plasma et a 45 % de cellules. Il ne peut pas etre fabrique artificiellement." },
  { id: "4", content: "Apres un don de sang total, ton organisme reconstitue les globules rouges en 4 a 8 semaines." },
  { id: "5", content: "Le groupe O- est donne en priorite en urgence car compatible avec tous. Les stocks sont souvent tendus." },
  { id: "6", content: "Les plaquettes ne se conservent que 5 jours -- les besoins sont donc constants et reguliers." },
  { id: "7", content: "Le plasma peut etre conserve jusqu'a 1 an congele et sert notamment pour les grands brules." },
  { id: "8", content: "Donner son sang ne presente aucun risque de maladie : tout le materiel est sterile et a usage unique." },
  { id: "9", content: "Boire 500 ml d'eau avant le don reduit les risques de malaise et facilite le prelevement." },
  { id: "10", content: "Il faut etre age de 18 a 70 ans et peser au moins 50 kg pour donner son sang en France." },
];

// --- Couleurs par type de don ---
export const DONATION_TYPE_COLORS: Record<
  DonationType,
  { main: string; bg: string; border: string }
> = {
  whole_blood: { main: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.35)" },
  platelets: { main: "#fb923c", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.35)" },
  plasma: { main: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.35)" },
};

// --- Conseils avant/après le don ---
export const DONATION_TIPS = {
  before: [
    "Dormir suffisamment la nuit precedente.",
    "Manger un repas leger dans les 3 heures avant le don.",
    "Boire au moins 500 ml d'eau avant d'aller donner.",
    "Eviter l'alcool dans les 24h precedentes.",
    "Apporter une piece d'identite.",
  ],
  after: [
    "Rester assis 10-15 minutes et boire une boisson sucree proposee sur place.",
    "Eviter les efforts physiques intenses pendant 24h.",
    "Bien s'hydrater dans les heures suivantes.",
    "Eviter de fumer pendant 1h apres le don.",
    "Si tu te sens etourdi, allonge-toi et previens le personnel.",
  ],
};
