"use client";

import { useMemo } from "react";
import { useAppStore } from "@web/lib/store";
import type { EligibilityResult, PerTypeEligibility } from "@shared/types";
import {
  computeEligibility,
  computeEligibilityPerType,
} from "@shared/utils/donations";

export function useEligibility(): EligibilityResult {
  const donations = useAppStore((s) => s.donations);
  return useMemo(() => computeEligibility(donations), [donations]);
}

export function usePerTypeEligibility(): PerTypeEligibility {
  const donations = useAppStore((s) => s.donations);
  return useMemo(() => computeEligibilityPerType(donations), [donations]);
}
