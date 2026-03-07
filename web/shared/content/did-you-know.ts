// ============================================================
// shared/content/did-you-know.ts
// Cartes "Le saviez-vous ?" enrichies pour le SEO
// ============================================================

export interface DidYouKnowCard {
  id: string;
  slug: string;
  category: string;
  title: string;
  content: string;
  icon: string;
  color: string;
}

export const DID_YOU_KNOW: DidYouKnowCard[] = [
  {
    id: "1",
    slug: "don-de-sang-sauve-3-vies",
    category: "Don de sang",
    title: "Un don peut sauver 3 vies",
    content:
      "Chaque don de sang peut sauver jusqu'a 3 personnes grace a la separation en composants : globules rouges, plaquettes et plasma.",
    icon: "droplets",
    color: "#f87171",
  },
  {
    id: "2",
    slug: "4-pourcent-population-donne",
    category: "En France",
    title: "4 % de la population donne son sang",
    content:
      "Seulement 4 % de la population donne son sang chaque annee, alors que 10 000 dons sont necessaires chaque jour.",
    icon: "users",
    color: "#fb923c",
  },
  {
    id: "3",
    slug: "composition-du-sang",
    category: "Biologie",
    title: "Le sang ne peut pas etre fabrique",
    content:
      "Le sang se compose a 55 % de plasma et a 45 % de cellules. Il ne peut pas etre fabrique artificiellement.",
    icon: "flask-conical",
    color: "#a78bfa",
  },
  {
    id: "4",
    slug: "recuperation-apres-don",
    category: "Recuperation",
    title: "4 a 8 semaines pour regenerer les globules rouges",
    content:
      "Apres un don de sang total, ton organisme reconstitue les globules rouges en 4 a 8 semaines.",
    icon: "timer",
    color: "#34d399",
  },
  {
    id: "5",
    slug: "groupe-o-negatif-universel",
    category: "Urgence",
    title: "O- : le groupe universel en urgence",
    content:
      "Le groupe O- est donne en priorite en urgence car compatible avec tous. Les stocks sont souvent tendus.",
    icon: "alert-triangle",
    color: "#f87171",
  },
  {
    id: "6",
    slug: "plaquettes-5-jours-conservation",
    category: "Conservation",
    title: "Les plaquettes ne se conservent que 5 jours",
    content:
      "Les plaquettes ne se conservent que 5 jours -- les besoins sont donc constants et reguliers.",
    icon: "hourglass",
    color: "#fb923c",
  },
  {
    id: "7",
    slug: "plasma-conservation-1-an",
    category: "Plasma",
    title: "Le plasma se conserve jusqu'a 1 an",
    content:
      "Le plasma peut etre conserve jusqu'a 1 an congele et sert notamment pour les grands brules.",
    icon: "snowflake",
    color: "#60a5fa",
  },
  {
    id: "8",
    slug: "don-sang-zero-risque",
    category: "Securite",
    title: "Zero risque de maladie en donnant",
    content:
      "Donner son sang ne presente aucun risque de maladie : tout le materiel est sterile et a usage unique.",
    icon: "shield-check",
    color: "#34d399",
  },
  {
    id: "9",
    slug: "boire-eau-avant-don",
    category: "Conseil",
    title: "500 ml d'eau avant le don",
    content:
      "Boire 500 ml d'eau avant le don reduit les risques de malaise et facilite le prelevement.",
    icon: "glass-water",
    color: "#60a5fa",
  },
  {
    id: "10",
    slug: "conditions-age-poids",
    category: "Conditions",
    title: "18-70 ans et 50 kg minimum",
    content:
      "Il faut etre age de 18 a 70 ans et peser au moins 50 kg pour donner son sang en France.",
    icon: "user-check",
    color: "#a78bfa",
  },
];
