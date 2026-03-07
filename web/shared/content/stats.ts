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
    label: "dons necessaires chaque jour",
    description:
      "En France, 10 000 dons de sang sont necessaires chaque jour pour repondre aux besoins des hopitaux et des patients. Les reserves doivent etre constamment renouvelees car les produits sanguins ont une duree de vie limitee.",
    icon: "droplets",
    color: "#f87171",
  },
  {
    value: "4 %",
    label: "de la population donne son sang",
    description:
      "Seulement 4 % de la population francaise donne son sang regulierement. Pourtant, 1 personne sur 3 aura besoin d'une transfusion au cours de sa vie. Chaque nouveau donneur compte.",
    icon: "users",
    color: "#fb923c",
  },
  {
    value: "3",
    label: "vies sauvees par un seul don",
    description:
      "Un seul don de sang total est separe en 3 composants (globules rouges, plaquettes, plasma), chacun pouvant traiter un patient different. Un geste simple aux consequences immenses.",
    icon: "heart-pulse",
    color: "#60a5fa",
  },
];
