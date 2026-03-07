"use client";

import { useState } from "react";
import { subDays, subMonths } from "date-fns";
import { useAppStore } from "@web/lib/store";
import { ProgressDots } from "../ProgressDots";
import { DONATION_TYPE_LABELS, DONATION_TYPE_COLORS } from "@shared/constants";
import type { DonationType } from "@shared/types";

const SHORTCUTS = [
  { label: "Il y a moins de 28 jours", getDays: () => 14, blocked: true },
  { label: "Il y a 1-2 mois", getDays: () => 45 },
  { label: "Il y a 3-6 mois", getDays: () => 120 },
  { label: "Il y a plus de 6 mois", getDays: () => 200 },
  { label: "Je n'ai jamais donne", getDays: () => null },
];

const DONATION_TYPES: DonationType[] = ["whole_blood", "platelets", "plasma"];

export function LastDonationStep({ onNext }: { onNext: () => void }) {
  const addDonation = useAppStore((s) => s.addDonation);
  const [selected, setSelected] = useState<number | null>(null);
  const [donationType, setDonationType] = useState<DonationType>("whole_blood");
  const showTypeSelector = selected !== null && selected !== 4;

  const handleContinue = () => {
    if (selected !== null && selected !== 4) {
      const days = SHORTCUTS[selected].getDays();
      if (days !== null) {
        addDonation({
          id: crypto.randomUUID?.() ?? Math.random().toString(36),
          date: subDays(new Date(), days).toISOString(),
          type: donationType,
        });
      }
    }
    onNext();
  };

  return (
    <div className="flex min-h-screen flex-col px-4 py-8 animate-[fadeInUp_400ms_ease-out]">
      <ProgressDots total={4} current={2} />

      <h2 className="mb-1 mt-8 text-2xl font-extrabold">Ton dernier don</h2>
      <p className="mb-6 text-sm text-[var(--color-text-muted)]">
        Quand as-tu donne pour la derniere fois ?
      </p>

      <div className="mb-6 space-y-2">
        {SHORTCUTS.map((s, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className="w-full rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all active:scale-[0.98]"
            style={{
              borderColor: selected === i ? "var(--color-primary)" : "var(--color-border)",
              backgroundColor: selected === i ? "rgba(248,113,113,0.1)" : "var(--color-surface)",
              color: selected === i ? "var(--color-primary)" : "var(--color-text)",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {showTypeSelector && (
        <div className="mb-6 animate-[fadeInUp_300ms_ease-out]">
          <label className="mb-2 text-sm font-medium text-[var(--color-text-muted)]">
            Type de don
          </label>
          <div className="grid grid-cols-3 gap-2">
            {DONATION_TYPES.map((type) => {
              const colors = DONATION_TYPE_COLORS[type];
              const isActive = donationType === type;
              return (
                <button
                  key={type}
                  onClick={() => setDonationType(type)}
                  className="rounded-xl border px-2 py-3 text-center text-xs font-bold transition-all active:scale-95"
                  style={{
                    borderColor: isActive ? colors.main : "var(--color-border)",
                    backgroundColor: isActive ? colors.bg : "var(--color-surface)",
                    color: isActive ? colors.main : "var(--color-text-muted)",
                  }}
                >
                  {DONATION_TYPE_LABELS[type].label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-auto space-y-3">
        <button
          onClick={handleContinue}
          disabled={selected === null}
          className="w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-base font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
        >
          Continuer
        </button>
        <button
          onClick={onNext}
          className="w-full py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        >
          Passer cette etape
        </button>
      </div>
    </div>
  );
}
