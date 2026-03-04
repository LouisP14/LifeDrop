// ============================================================
// src/constants/index.ts
// Constantes métier et de configuration de LifeDrop
// ============================================================

import type { Badge, BloodType, DonationLevel, DonationType, Team } from "../types";

// ─── Délais légaux entre deux dons (en jours) ────────────────
export const DONATION_COOLDOWN_DAYS: Record<DonationType, number> = {
  whole_blood: 56, // 8 semaines
  platelets: 28, // 4 semaines
  plasma: 14, // 2 semaines
};

// ─── Labels lisibles par type ─────────────────────────────────
export const DONATION_TYPE_LABELS: Record<
  DonationType,
  { label: string; icon: string; delay: string }
> = {
  whole_blood: { label: "Sang total", icon: "water", delay: "56 jours" },
  platelets: { label: "Plaquettes", icon: "microscope", delay: "28 jours" },
  plasma: { label: "Plasma", icon: "water-outline", delay: "14 jours" },
};

// ─── Vies sauvées par type de don ───────────────────────────
export const LIVES_PER_DONATION = 3; // valeur par défaut (sang total)
export const LIVES_PER_DONATION_TYPE: Record<DonationType, number> = {
  whole_blood: 3, // séparé en 3 composants (GR, plasma, plaquettes)
  platelets: 1, // traite généralement 1 patient (oncologie)
  plasma: 1, // fractionné en médicaments, valeur conventionnelle
};

// ─── Niveaux de gamification ─────────────────────────────────
export interface LevelConfig {
  level: DonationLevel;
  label: string;
  minDonations: number;
  maxDonations: number | null;
  color: string;
  icon: string; // nom MaterialCommunityIcons
}

export const DONATION_LEVELS: LevelConfig[] = [
  {
    level: "bronze",
    label: "Bronze",
    minDonations: 1,
    maxDonations: 3,
    color: "#CD7F32",
    icon: "medal",
  },
  {
    level: "silver",
    label: "Argent",
    minDonations: 4,
    maxDonations: 9,
    color: "#C0C0C0",
    icon: "medal",
  },
  {
    level: "gold",
    label: "Or",
    minDonations: 10,
    maxDonations: 19,
    color: "#FFD700",
    icon: "trophy",
  },
  {
    level: "platinum",
    label: "Platine",
    minDonations: 20,
    maxDonations: null,
    color: "#E5E4E2",
    icon: "diamond-stone",
  },
];

// ─── Catalogue de badges ──────────────────────────────────────
export const BADGES_CATALOG: Badge[] = [
  {
    id: "first_drop",
    label: "Première Goutte",
    description: "Ton premier don enregistré – bienvenue dans l'aventure !",
    icon: "water",
    isUnlocked: false,
  },
  {
    id: "bronze",
    label: "Rang Bronze",
    description: "Tu as effectué 3 dons. Le voyage commence.",
    icon: "medal",
    isUnlocked: false,
  },
  {
    id: "silver",
    label: "Rang Argent",
    description: "4 dons – tu es un donneur régulier.",
    icon: "medal",
    isUnlocked: false,
  },
  {
    id: "gold",
    label: "Rang Or",
    description: "10 dons – tu fais partie des héros du quotidien.",
    icon: "trophy",
    isUnlocked: false,
  },
  {
    id: "platinum",
    label: "Rang Platine",
    description: "20 dons – un engagement exceptionnel.",
    icon: "diamond-stone",
    isUnlocked: false,
  },
  {
    id: "diversifier",
    label: "Polyvalent",
    description: "Tu as donné les 3 types de sang différents.",
    icon: "shuffle-variant",
    isUnlocked: false,
  },
  {
    id: "streak_3",
    label: "Régularité x3",
    description: "3 dons consécutifs respectant le délai légal.",
    icon: "fire",
    isUnlocked: false,
  },
  {
    id: "streak_6",
    label: "Régularité x6",
    description: "6 dons consécutifs réguliers.",
    icon: "lightning-bolt",
    isUnlocked: false,
  },
  {
    id: "lives_10",
    label: "10 Vies",
    description: "Tu as potentiellement sauvé 10 vies.",
    icon: "heart",
    isUnlocked: false,
  },
  {
    id: "lives_30",
    label: "30 Vies",
    description: "Tu as potentiellement sauvé 30 vies.",
    icon: "cards-heart",
    isUnlocked: false,
  },
  {
    id: "lives_60",
    label: "60 Vies",
    description: "60 vies potentiellement sauvées – légende.",
    icon: "star",
    isUnlocked: false,
  },
  {
    id: "universal_donor",
    label: "Donneur Universel",
    description: "Tu es O- : ton sang aide tout le monde.",
    icon: "earth",
    isUnlocked: false,
  },
];

// ─── Informations par groupe sanguin ─────────────────────────
export const BLOOD_TYPE_INFO: Record<
  BloodType,
  { description: string; canReceiveFrom: string[]; canDonateTo: string[] }
> = {
  "O-": {
    description:
      "Donneur universel – ton sang peut être transfusé à n'importe qui en urgence.",
    canReceiveFrom: ["O-"],
    canDonateTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  },
  "O+": {
    description:
      "L'un des groupes les plus demandés. Compatible avec la majorité des receveurs.",
    canReceiveFrom: ["O-", "O+"],
    canDonateTo: ["O+", "A+", "B+", "AB+"],
  },
  "A-": {
    description:
      "Ton plasma est précieux et compatible avec beaucoup de patients.",
    canReceiveFrom: ["A-", "O-"],
    canDonateTo: ["A-", "A+", "AB-", "AB+"],
  },
  "A+": {
    description:
      "Groupe très répandu – les dons de plaquettes sont particulièrement utiles.",
    canReceiveFrom: ["A-", "A+", "O-", "O+"],
    canDonateTo: ["A+", "AB+"],
  },
  "B-": {
    description: "Groupe rare – chaque don compte énormément pour les stocks.",
    canReceiveFrom: ["B-", "O-"],
    canDonateTo: ["B-", "B+", "AB-", "AB+"],
  },
  "B+": {
    description:
      "Ton sang est compatible avec AB+ et B+, groupes souvent en tension.",
    canReceiveFrom: ["B-", "B+", "O-", "O+"],
    canDonateTo: ["B+", "AB+"],
  },
  "AB-": {
    description:
      "Donneur universel de plasma – précieux pour les soins intensifs.",
    canReceiveFrom: ["A-", "B-", "O-", "AB-"],
    canDonateTo: ["AB-", "AB+"],
  },
  "AB+": {
    description:
      "Receveur universel – et tes plaquettes sont compatibles avec tous.",
    canReceiveFrom: ["A-", "A+", "B-", "B+", "O-", "O+", "AB-", "AB+"],
    canDonateTo: ["AB+"],
  },
  unknown: {
    description:
      "Groupe sanguin non renseigné. Mets-le à jour dans ton profil.",
    canReceiveFrom: [],
    canDonateTo: [],
  },
};

// ─── Équipes prédéfinies ──────────────────────────────────────
export const PREDEFINED_TEAMS: Team[] = [
  { id: "team-lifedrop2026", code: "LIFEDROP2026", name: "Équipe LifeDrop", members: [] },
  { id: "team-croixrouge", code: "CROIXROUGE", name: "Croix-Rouge Française", members: [] },
  { id: "team-efs", code: "EFS2026", name: "EFS Île-de-France", members: [] },
  { id: "team-pompiers", code: "POMPIERS", name: "Les Pompiers Donneurs", members: [] },
];

// ─── Cartes "Le saviez-vous ?" ────────────────────────────────
export const DID_YOU_KNOW_CARDS = [
  {
    id: "1",
    content:
      "Chaque don de sang peut sauver jusqu'à 3 personnes grâce à la séparation en composants : globules rouges, plaquettes et plasma.",
  },
  {
    id: "2",
    content:
      "En France, seulement 4 % de la population donne son sang chaque année, alors que 10 000 dons sont nécessaires chaque jour.",
  },
  {
    id: "3",
    content:
      "Le sang se compose à 55 % de plasma et à 45 % de cellules. Il ne peut pas être fabriqué artificiellement.",
  },
  {
    id: "4",
    content:
      "Après un don de sang total, ton organisme reconstitue les globules rouges en 4 à 8 semaines.",
  },
  {
    id: "5",
    content:
      "Le groupe O- est donné en priorité en urgence car compatible avec tous. Les stocks sont souvent tendus.",
  },
  {
    id: "6",
    content:
      "Les plaquettes ne se conservent que 5 jours – les besoins sont donc constants et réguliers.",
  },
  {
    id: "7",
    content:
      "Le plasma peut être conservé jusqu'à 1 an congelé et sert notamment pour les grands brûlés.",
  },
  {
    id: "8",
    content:
      "Donner son sang ne présente aucun risque de maladie : tout le matériel est stérile et à usage unique.",
  },
  {
    id: "9",
    content:
      "Boire 500 ml d'eau avant le don réduit les risques de malaise et facilite le prélèvement.",
  },
  {
    id: "10",
    content:
      "Il faut être âgé de 18 à 70 ans et peser au moins 50 kg pour donner son sang en France.",
  },
];

// ─── Couleurs identitaires par type de don ──────────────────
export const DONATION_TYPE_COLORS: Record<
  DonationType,
  { main: string; bg: string; border: string }
> = {
  whole_blood: {
    main: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.35)",
  },
  platelets: {
    main: "#fb923c",
    bg: "rgba(251,146,60,0.08)",
    border: "rgba(251,146,60,0.35)",
  },
  plasma: {
    main: "#60a5fa",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.35)",
  },
};

// ─── Conseils avant/après le don ─────────────────────────────
export const DONATION_TIPS = {
  before: [
    "Dormir suffisamment la nuit précédente.",
    "Manger un repas léger dans les 3 heures avant le don.",
    "Boire au moins 500 ml d'eau avant d'aller donner.",
    "Éviter l'alcool dans les 24h précédentes.",
    "Apporter une pièce d'identité.",
  ],
  after: [
    "Rester assis 10–15 minutes et boire une boisson sucrée proposée sur place.",
    "Éviter les efforts physiques intenses pendant 24h.",
    "Bien s'hydrater dans les heures suivantes.",
    "Éviter de fumer pendant 1h après le don.",
    "Si tu te sens étourdi, allonge-toi et préviens le personnel.",
  ],
};
