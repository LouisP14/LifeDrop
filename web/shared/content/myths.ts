// ============================================================
// shared/content/myths.ts
// Mythes et réalités sur le don du sang (FAQPage schema ready)
// ============================================================

export interface MythFact {
  id: string;
  slug: string;
  myth: string;
  reality: string;
  verdict: boolean;
  keywords: string[];
}

export const MYTHS_AND_FACTS: MythFact[] = [
  {
    id: "m1",
    slug: "donner-du-sang-fait-mal",
    myth: "Donner du sang fait mal.",
    reality:
      "Seule la piqûre de l'aiguille peut etre légèrement ressentie. Le prélèvement lui-meme est indolore. La plupart des donneurs décrivent l'expérience comme tout a fait confortable.",
    verdict: false,
    keywords: ["douleur don de sang", "peur aiguille don"],
  },
  {
    id: "m2",
    slug: "attraper-maladie-en-donnant",
    myth: "On peut attraper une maladie en donnant.",
    reality:
      "Impossible. Tout le matériel est stérile et à usage unique. Chaque don utilise une nouvelle aiguille ouverte devant vous.",
    verdict: false,
    keywords: ["risque maladie don de sang", "sécurité don du sang"],
  },
  {
    id: "m3",
    slug: "recuperation-longue-apres-don",
    myth: "Le corps met longtemps a récupérer.",
    reality:
      "Le volume sanguin prélevé (450 ml) est compense en quelques heures. Les globules rouges se régénèrent en 4 a 8 semaines, ce qui reste bien en dessous du délai legal de 56 jours.",
    verdict: false,
    keywords: ["récupération don de sang", "temps récupération après don"],
  },
  {
    id: "m4",
    slug: "tatouage-et-don-du-sang",
    myth: "Les personnes tatouées ne peuvent pas donner.",
    reality:
      "Un tatouage recent (moins de 4 mois) impose un délai, mais au-dela, il n'y a aucune contre-indication. Des millions de donneurs tatoués donnent régulièrement.",
    verdict: false,
    keywords: ["tatouage don du sang", "piercing don du sang"],
  },
  {
    id: "m5",
    slug: "don-affaiblit-systeme-immunitaire",
    myth: "Donner affaiblit durablement le système immunitaire.",
    reality:
      "Faux. Les globules blancs et le système immunitaire ne sont pas affectés par un don de sang total. Seuls les globules rouges et le plasma sont prélevés.",
    verdict: false,
    keywords: ["système immunitaire don du sang", "fatigue don de sang"],
  },
  {
    id: "m6",
    slug: "groupes-les-plus-utiles",
    myth: "Les groupes A+ et O+ sont les plus utiles.",
    reality:
      "Vrai et faux. O+ est tres demandé car frequent, mais O- est encore plus précieux en urgence. Les groupes rares comme B- ou AB- sont souvent en tension.",
    verdict: true,
    keywords: ["groupe sanguin le plus utile", "groupe sanguin rare"],
  },
  {
    id: "m7",
    slug: "un-don-sauve-3-vies",
    myth: "Un seul don peut sauver jusqu'a 3 vies.",
    reality:
      "Vrai ! Chaque don de sang total est séparé en 3 composants : globules rouges, plasma et plaquettes -- chacun pouvant traiter un patient different.",
    verdict: true,
    keywords: ["combien de vies don de sang", "composants du sang"],
  },
];
