// ============================================================
// shared/content/donation-tips.ts
// Conseils avant et après le don (enrichis pour le SEO)
// ============================================================

export interface DonationTip {
  id: string;
  title: string;
  summary: string;
  detail: string;
  icon: string;
}

export const TIPS_BEFORE: DonationTip[] = [
  {
    id: "before-1",
    title: "Bien dormir",
    summary: "Dormir suffisamment la nuit précèdente.",
    detail:
      "Un bon sommeil (7 à 8 heures) aide ton corps a être en pleine forme pour le don. La fatigue augmente le risque de malaise.",
    icon: "moon",
  },
  {
    id: "before-2",
    title: "Manger leger",
    summary: "Manger un repas léger dans les 3 heures avant le don.",
    detail:
      "Évite de donner à jeun. Un repas léger et équilibré 2 à 3 heures avant le don aide a maintenir ta glycémie stable.",
    icon: "utensils",
  },
  {
    id: "before-3",
    title: "Bien s'hydrater",
    summary: "Boire au moins 500 ml d'eau avant d'aller donner.",
    detail:
      "L'hydratation est clé. Bois au moins un demi-litre d'eau dans l'heure qui précède le don pour faciliter le prélèvement et réduire les risques de malaise.",
    icon: "glass-water",
  },
  {
    id: "before-4",
    title: "Éviter l'alcool",
    summary: "Éviter l'alcool dans les 24h précèdentes.",
    detail:
      "L'alcool déshydrate l'organisme et peut altérer la qualité du sang. Abstiens-toi au moins 24 heures avant ton don.",
    icon: "ban",
  },
  {
    id: "before-5",
    title: "Pièce d'identité",
    summary: "Apporter une pièce d'identité.",
    detail:
      "Une pièce d'identité avec photo est obligatoire pour chaque don. Carte d'identité, passeport ou permis de conduire sont acceptés.",
    icon: "id-card",
  },
];

export const TIPS_AFTER: DonationTip[] = [
  {
    id: "after-1",
    title: "Se reposer",
    summary: "Rester assis 10-15 minutes et prendre une collation.",
    detail:
      "Après le prélèvement, reste au moins 10 à 15 minutes en position assise. Profite de la collation proposée (boisson sucrée, biscuits) pour remonter ta glycémie.",
    icon: "armchair",
  },
  {
    id: "after-2",
    title: "Éviter les efforts",
    summary: "Éviter les efforts physiques intenses pendant 24h.",
    detail:
      "Ton corps a besoin de temps pour compenser le volume prélevé. Évite le sport intense, le port de charges lourdes et les activités à risque pendant 24 heures.",
    icon: "dumbbell",
  },
  {
    id: "after-3",
    title: "S'hydrater beaucoup",
    summary: "Bien s'hydrater dans les heures suivantes.",
    detail:
      "Bois plus que d'habitude dans les 24 heures suivant le don. L'eau, les jus de fruits et les bouillons sont excellents pour reconstituer le volume sanguin.",
    icon: "droplets",
  },
  {
    id: "after-4",
    title: "Ne pas fumer",
    summary: "Éviter de fumer pendant 1h après le don.",
    detail:
      "La nicotine provoque une vasoconstriction qui peut favoriser les malaises. Attends au moins 1 heure avant de fumer.",
    icon: "cigarette-off",
  },
  {
    id: "after-5",
    title: "Écouter son corps",
    summary: "Si tu te sens étourdi, allonge-toi et préviens le personnel.",
    detail:
      "Un léger étourdissement peut survenir, c'est normal. Allonge-toi avec les jambes surélevées et préviens le personnel médical. Ca passe généralement en quelques minutes.",
    icon: "heart-pulse",
  },
];
