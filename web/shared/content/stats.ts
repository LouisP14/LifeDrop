// ============================================================
// shared/content/stats.ts
// Statistiques nationales sur le don du sang en France
// ============================================================

export interface NationalStat {
  value: string;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export const NATIONAL_STATS: NationalStat[] = [
  {
    value: "10 000",
    label: "dons nécessaires chaque jour",
    description:
      "En France, 10 000 dons de sang sont nécessaires chaque jour pour répondre aux besoins des hôpitaux et des patients. Les réserves doivent être constamment renouvelées car les produits sanguins ont une durée de vie limitée.",
    icon: "droplets",
    color: "#f87171",
  },
  {
    value: "4 %",
    label: "de la population donne son sang",
    description:
      "Seulement 4 % de la population française donne son sang régulièrement. Pourtant, 1 personne sur 3 aura besoin d'une transfusion au cours de sa vie. Chaque nouveau donneur compte.",
    icon: "users",
    color: "#fb923c",
  },
  {
    value: "3",
    label: "vies sauvées par un seul don",
    description:
      "Un seul don de sang total est séparé en 3 composants (globules rouges, plaquettes, plasma), chacun pouvant traiter un patient différent. Un geste simple aux conséquences immenses.",
    icon: "heart-pulse",
    color: "#60a5fa",
  },
];
