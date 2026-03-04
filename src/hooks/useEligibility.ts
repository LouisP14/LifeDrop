// ============================================================
// src/hooks/useEligibility.ts
// Hook — recalcule l'éligibilité au don en temps réel
// ============================================================

import { useMemo } from "react";
import { useAppStore } from "../store/useAppStore";
import type { EligibilityResult, PerTypeEligibility } from "../types";
import {
  computeEligibility,
  computeEligibilityPerType,
} from "../utils/donations";

/** Éligibilité globale : canDonate = vrai si AU MOINS un type est disponible */
export function useEligibility(): EligibilityResult {
  const donations = useAppStore((s) => s.donations);

  return useMemo(() => {
    return computeEligibility(donations);
  }, [donations]);
}

/** Éligibilité indépendante par type de don */
export function usePerTypeEligibility(): PerTypeEligibility {
  const donations = useAppStore((s) => s.donations);

  return useMemo(() => {
    return computeEligibilityPerType(donations);
  }, [donations]);
}
