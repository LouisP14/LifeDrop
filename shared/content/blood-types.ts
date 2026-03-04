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
    title: "Groupe sanguin O- (O negatif) - Donneur universel",
    metaDescription:
      "Tout savoir sur le groupe sanguin O negatif : compatibilite, don du sang, qui peut recevoir du sang O-. Guide complet du donneur universel.",
    description:
      "Donneur universel -- ton sang peut etre transfuse a n'importe qui en urgence. Le groupe O- est le plus precieux pour les services d'urgence car il est compatible avec tous les groupes sanguins.",
    canReceiveFrom: ["O-"],
    canDonateTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    tip: "Ton groupe est universel -- il est particulierement precieux pour les urgences. Les stocks de O- sont souvent en tension, chaque don compte enormement.",
    frequency: "Environ 6 % de la population francaise est O-.",
  },
  {
    type: "O+",
    slug: "o-positif",
    label: "O+",
    title: "Groupe sanguin O+ (O positif) - Le plus repandu",
    metaDescription:
      "Guide complet du groupe sanguin O positif : compatibilite, don du sang, receveurs compatibles. O+ est le groupe le plus repandu en France.",
    description:
      "L'un des groupes les plus demandes et les plus repandus. Compatible avec la majorite des receveurs Rh positif.",
    canReceiveFrom: ["O-", "O+"],
    canDonateTo: ["O+", "A+", "B+", "AB+"],
    tip: "O+ est le groupe le plus courant en France. Tes dons sont extremement utiles car la demande est constante.",
    frequency: "Environ 36 % de la population francaise est O+.",
  },
  {
    type: "A-",
    slug: "a-negatif",
    label: "A-",
    title: "Groupe sanguin A- (A negatif)",
    metaDescription:
      "Tout savoir sur le groupe sanguin A negatif : compatibilite, don du sang, receveurs et donneurs compatibles. Guide complet.",
    description:
      "Ton plasma est precieux et compatible avec beaucoup de patients. Le groupe A- est relativement rare et donc tres recherche.",
    canReceiveFrom: ["A-", "O-"],
    canDonateTo: ["A-", "A+", "AB-", "AB+"],
    tip: "Ton plasma est particulierement precieux. Pense aussi au don de plasma en plus du sang total.",
    frequency: "Environ 7 % de la population francaise est A-.",
  },
  {
    type: "A+",
    slug: "a-positif",
    label: "A+",
    title: "Groupe sanguin A+ (A positif)",
    metaDescription:
      "Guide du groupe sanguin A positif : compatibilite, don du sang, plaquettes. A+ est le deuxieme groupe le plus repandu en France.",
    description:
      "Groupe tres repandu -- les dons de plaquettes sont particulierement utiles. A+ est le deuxieme groupe sanguin le plus courant en France.",
    canReceiveFrom: ["A-", "A+", "O-", "O+"],
    canDonateTo: ["A+", "AB+"],
    tip: "Tes plaquettes sont tres demandees. Si tu es eligible, le don de plaquettes est un excellent moyen d'aider.",
    frequency: "Environ 33 % de la population francaise est A+.",
  },
  {
    type: "B-",
    slug: "b-negatif",
    label: "B-",
    title: "Groupe sanguin B- (B negatif) - Groupe rare",
    metaDescription:
      "Tout savoir sur le groupe sanguin B negatif, un des groupes les plus rares en France. Compatibilite, don du sang, importance de chaque don.",
    description:
      "Groupe rare -- chaque don compte enormement pour les stocks. B- fait partie des groupes les plus rares en France.",
    canReceiveFrom: ["B-", "O-"],
    canDonateTo: ["B-", "B+", "AB-", "AB+"],
    tip: "Ton groupe est rare -- chaque don que tu fais compte enormement. Les stocks de B- sont regulierement en tension.",
    frequency: "Environ 1 % de la population francaise est B-.",
  },
  {
    type: "B+",
    slug: "b-positif",
    label: "B+",
    title: "Groupe sanguin B+ (B positif)",
    metaDescription:
      "Guide du groupe sanguin B positif : compatibilite, don du sang, receveurs compatibles. Tout ce qu'il faut savoir sur le groupe B+.",
    description:
      "Ton sang est compatible avec AB+ et B+, groupes souvent en tension dans les reserves hospitalieres.",
    canReceiveFrom: ["B-", "B+", "O-", "O+"],
    canDonateTo: ["B+", "AB+"],
    tip: "Donne regulierement pour maintenir les stocks de ton groupe. Les reserves de B+ sont souvent justes.",
    frequency: "Environ 7 % de la population francaise est B+.",
  },
  {
    type: "AB-",
    slug: "ab-negatif",
    label: "AB-",
    title: "Groupe sanguin AB- (AB negatif) - Donneur universel de plasma",
    metaDescription:
      "Tout savoir sur le groupe sanguin AB negatif : donneur universel de plasma, compatibilite, don du sang. Le groupe le plus rare en France.",
    description:
      "Donneur universel de plasma -- precieux pour les soins intensifs. AB- est le groupe sanguin le plus rare en France.",
    canReceiveFrom: ["A-", "B-", "O-", "AB-"],
    canDonateTo: ["AB-", "AB+"],
    tip: "Ton plasma est universel et extremement precieux. Le don de plasma est particulierement recommande pour ton groupe.",
    frequency: "Environ 1 % de la population francaise est AB-.",
  },
  {
    type: "AB+",
    slug: "ab-positif",
    label: "AB+",
    title: "Groupe sanguin AB+ (AB positif) - Receveur universel",
    metaDescription:
      "Guide du groupe sanguin AB positif : receveur universel, compatibilite plaquettes, don du sang. Tout savoir sur le groupe AB+.",
    description:
      "Receveur universel -- et tes plaquettes sont compatibles avec tous les patients. Un atout majeur pour les dons de plaquettes.",
    canReceiveFrom: ["A-", "A+", "B-", "B+", "O-", "O+", "AB-", "AB+"],
    canDonateTo: ["AB+"],
    tip: "Tes plaquettes sont compatibles avec tous -- le don de plaquettes est le moyen le plus efficace pour toi d'aider.",
    frequency: "Environ 3 % de la population francaise est AB+.",
  },
];
