// ============================================================
// shared/content/blood-types.ts
// Pages individuelles par groupe sanguin (SEO + generateStaticParams)
// ============================================================

import type { BloodType } from "../types";

export interface BloodTypePage {
  type: BloodType;
  slug: string;
  label: string;
  title: string;
  metaDescription: string;
  description: string;
  canReceiveFrom: string[];
  canDonateTo: string[];
  tip: string;
  frequency: string;
}

export const BLOOD_TYPE_PAGES: BloodTypePage[] = [
  {
    type: "O-",
    slug: "o-negatif",
    label: "O-",
    title: "Groupe sanguin O- (O négatif) - Donneur universel",
    metaDescription:
      "Tout savoir sur le groupe sanguin O négatif : compatibilité, don du sang, qui peut recevoir du sang O-. Guide complet du donneur universel.",
    description:
      "Donneur universel -- ton sang peut etre transfuse a n'importe qui en urgence. Le groupe O- est le plus précieux pour les services d'urgence car il est compatible avec tous les groupes sanguins.",
    canReceiveFrom: ["O-"],
    canDonateTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    tip: "Ton groupe est universel -- il est particulièrement précieux pour les urgences. Les stocks de O- sont souvent en tension, chaque don compte énormément.",
    frequency: "Environ 6 % de la population française est O-.",
  },
  {
    type: "O+",
    slug: "o-positif",
    label: "O+",
    title: "Groupe sanguin O+ (O positif) - Le plus répandu",
    metaDescription:
      "Guide complet du groupe sanguin O positif : compatibilité, don du sang, receveurs compatibles. O+ est le groupe le plus répandu en France.",
    description:
      "L'un des groupes les plus demandés et les plus répandus. Compatible avec la majorite des receveurs Rh positif.",
    canReceiveFrom: ["O-", "O+"],
    canDonateTo: ["O+", "A+", "B+", "AB+"],
    tip: "O+ est le groupe le plus courant en France. Tes dons sont extrêmement utiles car la demandé est constante.",
    frequency: "Environ 36 % de la population française est O+.",
  },
  {
    type: "A-",
    slug: "a-negatif",
    label: "A-",
    title: "Groupe sanguin A- (A négatif)",
    metaDescription:
      "Tout savoir sur le groupe sanguin A négatif : compatibilité, don du sang, receveurs et donneurs compatibles. Guide complet.",
    description:
      "Ton plasma est précieux et compatible avec beaucoup de patients. Le groupe A- est relativement rare et donc tres recherché.",
    canReceiveFrom: ["A-", "O-"],
    canDonateTo: ["A-", "A+", "AB-", "AB+"],
    tip: "Ton plasma est particulièrement précieux. Pense aussi au don de plasma en plus du sang total.",
    frequency: "Environ 7 % de la population française est A-.",
  },
  {
    type: "A+",
    slug: "a-positif",
    label: "A+",
    title: "Groupe sanguin A+ (A positif)",
    metaDescription:
      "Guide du groupe sanguin A positif : compatibilité, don du sang, plaquettes. A+ est le deuxieme groupe le plus répandu en France.",
    description:
      "Groupe tres répandu -- les dons de plaquettes sont particulièrement utiles. A+ est le deuxieme groupe sanguin le plus courant en France.",
    canReceiveFrom: ["A-", "A+", "O-", "O+"],
    canDonateTo: ["A+", "AB+"],
    tip: "Tes plaquettes sont tres demandées. Si tu es éligible, le don de plaquettes est un excellent moyen d'aider.",
    frequency: "Environ 33 % de la population française est A+.",
  },
  {
    type: "B-",
    slug: "b-negatif",
    label: "B-",
    title: "Groupe sanguin B- (B négatif) - Groupe rare",
    metaDescription:
      "Tout savoir sur le groupe sanguin B négatif, un des groupes les plus rares en France. Compatibilité, don du sang, importance de chaque don.",
    description:
      "Groupe rare -- chaque don compte énormément pour les stocks. B- fait partie des groupes les plus rares en France.",
    canReceiveFrom: ["B-", "O-"],
    canDonateTo: ["B-", "B+", "AB-", "AB+"],
    tip: "Ton groupe est rare -- chaque don que tu fais compte énormément. Les stocks de B- sont régulièrement en tension.",
    frequency: "Environ 1 % de la population française est B-.",
  },
  {
    type: "B+",
    slug: "b-positif",
    label: "B+",
    title: "Groupe sanguin B+ (B positif)",
    metaDescription:
      "Guide du groupe sanguin B positif : compatibilité, don du sang, receveurs compatibles. Tout ce qu'il faut savoir sur le groupe B+.",
    description:
      "Ton sang est compatible avec AB+ et B+, groupes souvent en tension dans les réserves hospitalieres.",
    canReceiveFrom: ["B-", "B+", "O-", "O+"],
    canDonateTo: ["B+", "AB+"],
    tip: "Donne régulièrement pour maintenir les stocks de ton groupe. Les réserves de B+ sont souvent justes.",
    frequency: "Environ 7 % de la population française est B+.",
  },
  {
    type: "AB-",
    slug: "ab-negatif",
    label: "AB-",
    title: "Groupe sanguin AB- (AB négatif) - Donneur universel de plasma",
    metaDescription:
      "Tout savoir sur le groupe sanguin AB négatif : donneur universel de plasma, compatibilité, don du sang. Le groupe le plus rare en France.",
    description:
      "Donneur universel de plasma -- précieux pour les soins intensifs. AB- est le groupe sanguin le plus rare en France.",
    canReceiveFrom: ["A-", "B-", "O-", "AB-"],
    canDonateTo: ["AB-", "AB+"],
    tip: "Ton plasma est universel et extrêmement précieux. Le don de plasma est particulièrement recommandé pour ton groupe.",
    frequency: "Environ 1 % de la population française est AB-.",
  },
  {
    type: "AB+",
    slug: "ab-positif",
    label: "AB+",
    title: "Groupe sanguin AB+ (AB positif) - Receveur universel",
    metaDescription:
      "Guide du groupe sanguin AB positif : receveur universel, compatibilité plaquettes, don du sang. Tout savoir sur le groupe AB+.",
    description:
      "Receveur universel -- et tes plaquettes sont compatibles avec tous les patients. Un atout majeur pour les dons de plaquettes.",
    canReceiveFrom: ["A-", "A+", "B-", "B+", "O-", "O+", "AB-", "AB+"],
    canDonateTo: ["AB+"],
    tip: "Tes plaquettes sont compatibles avec tous -- le don de plaquettes est le moyen le plus efficace pour toi d'aider.",
    frequency: "Environ 3 % de la population française est AB+.",
  },
];
