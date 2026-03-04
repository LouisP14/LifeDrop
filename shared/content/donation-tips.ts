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
    summary: "Dormir suffisamment la nuit precedente.",
    detail:
      "Un bon sommeil (7 a 8 heures) aide ton corps a etre en pleine forme pour le don. La fatigue augmente le risque de malaise.",
    icon: "moon",
  },
  {
    id: "before-2",
    title: "Manger leger",
    summary: "Manger un repas leger dans les 3 heures avant le don.",
    detail:
      "Evite de donner a jeun. Un repas leger et equilibre 2 a 3 heures avant le don aide a maintenir ta glycemie stable.",
    icon: "utensils",
  },
  {
    id: "before-3",
    title: "Bien s'hydrater",
    summary: "Boire au moins 500 ml d'eau avant d'aller donner.",
    detail:
      "L'hydratation est cle. Bois au moins un demi-litre d'eau dans l'heure qui precede le don pour faciliter le prelevement et reduire les risques de malaise.",
    icon: "glass-water",
  },
  {
    id: "before-4",
    title: "Eviter l'alcool",
    summary: "Eviter l'alcool dans les 24h precedentes.",
    detail:
      "L'alcool deshydrate l'organisme et peut alterer la qualite du sang. Abstiens-toi au moins 24 heures avant ton don.",
    icon: "ban",
  },
  {
    id: "before-5",
    title: "Piece d'identite",
    summary: "Apporter une piece d'identite.",
    detail:
      "Une piece d'identite avec photo est obligatoire pour chaque don. Carte d'identite, passeport ou permis de conduire sont acceptes.",
    icon: "id-card",
  },
];

export const TIPS_AFTER: DonationTip[] = [
  {
    id: "after-1",
    title: "Se reposer",
    summary: "Rester assis 10-15 minutes et prendre une collation.",
    detail:
      "Apres le prelevement, reste au moins 10 a 15 minutes en position assise. Profite de la collation proposee (boisson sucree, biscuits) pour remonter ta glycemie.",
    icon: "armchair",
  },
  {
    id: "after-2",
    title: "Eviter les efforts",
    summary: "Eviter les efforts physiques intenses pendant 24h.",
    detail:
      "Ton corps a besoin de temps pour compenser le volume preleve. Evite le sport intense, le port de charges lourdes et les activites a risque pendant 24 heures.",
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
    summary: "Eviter de fumer pendant 1h apres le don.",
    detail:
      "La nicotine provoque une vasoconstriction qui peut favoriser les malaises. Attends au moins 1 heure avant de fumer.",
    icon: "cigarette-off",
  },
  {
    id: "after-5",
    title: "Ecouter son corps",
    summary: "Si tu te sens etourdi, allonge-toi et previens le personnel.",
    detail:
      "Un leger etourdissement peut survenir, c'est normal. Allonge-toi avec les jambes surelevees et previens le personnel medical. Ca passe generalement en quelques minutes.",
    icon: "heart-pulse",
  },
];
