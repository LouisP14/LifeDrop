// ============================================================
// shared/utils/dates.ts
// Formatage et helpers de dates (platform-agnostic)
// ============================================================

import {
  differenceInDays,
  format,
  formatDistanceToNow,
  isValid,
  parseISO,
} from "date-fns";
import { fr } from "date-fns/locale";

/** Formate une date ISO en "12 mars 2025" */
export function formatDate(isoString: string): string {
  const date = parseISO(isoString);
  if (!isValid(date)) return "Date invalide";
  return format(date, "dd MMMM yyyy", { locale: fr });
}

/** "Aujourd'hui", "Dans 3 jours", "Il y a 2 mois", etc. */
export function formatRelative(isoString: string): string {
  const date = parseISO(isoString);
  if (!isValid(date)) return "";
  return formatDistanceToNow(date, { addSuffix: true, locale: fr });
}

/** Nombre de jours entre maintenant et une date future */
export function daysUntil(futureDate: Date): number {
  return Math.max(0, differenceInDays(futureDate, new Date()));
}

/** Génère un UUID v4 cryptographiquement sûr */
export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback pour environnements sans crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Retourne le label lisible d'un type de don */
export function getDonationTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    whole_blood: "Sang total",
    platelets: "Plaquettes",
    plasma: "Plasma",
  };
  return labels[type] ?? type;
}
