export interface Challenge {
  id: string;
  title: string;
  description: string;
  goal: number;
  unit: string;
  month: number; // 1-12
  year: number;
  icon: string; // lucide icon key
}

// Monthly community challenges
export const CHALLENGES: Challenge[] = [
  {
    id: "2026-03",
    title: "Mars Rouge",
    description: "La communaute LifeDrop se mobilise : atteignons 200 dons collectifs en mars !",
    goal: 200,
    unit: "dons",
    month: 3,
    year: 2026,
    icon: "target",
  },
  {
    id: "2026-04",
    title: "Avril Solidaire",
    description: "Objectif 300 dons pour le mois d'avril. Chaque goutte compte !",
    goal: 300,
    unit: "dons",
    month: 4,
    year: 2026,
    icon: "heart-handshake",
  },
  {
    id: "2026-05",
    title: "Mai en Force",
    description: "500 vies sauvees en mai — un defi a la hauteur de notre communaute !",
    goal: 500,
    unit: "vies",
    month: 5,
    year: 2026,
    icon: "flame",
  },
  {
    id: "2026-06",
    title: "Ete du Sang",
    description: "Les reserves baissent en ete. 250 dons pour sauver des vies !",
    goal: 250,
    unit: "dons",
    month: 6,
    year: 2026,
    icon: "sun",
  },
];

export function getCurrentChallenge(): Challenge | null {
  const now = new Date();
  return CHALLENGES.find(
    (c) => c.month === now.getMonth() + 1 && c.year === now.getFullYear(),
  ) ?? null;
}
