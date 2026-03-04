"use client";

import { useState } from "react";
import { addDays, differenceInDays, isAfter, parseISO } from "date-fns";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle, Clock, Droplets, FlaskConical } from "lucide-react";
import { DONATION_COOLDOWN_DAYS, DONATION_TYPE_LABELS } from "@shared/constants";
import type { DonationType } from "@shared/types";

const TYPES: { key: DonationType; icon: React.ReactNode; color: string }[] = [
  { key: "whole_blood", icon: <Droplets className="h-4 w-4" />, color: "#f87171" },
  { key: "platelets", icon: <Clock className="h-4 w-4" />, color: "#fb923c" },
  { key: "plasma", icon: <FlaskConical className="h-4 w-4" />, color: "#60a5fa" },
];

export function EligibilityChecker() {
  const [lastDonationDate, setLastDonationDate] = useState("");
  const [lastDonationType, setLastDonationType] = useState<DonationType>("whole_blood");

  const results = lastDonationDate
    ? TYPES.map(({ key, icon, color }) => {
        const cooldown = DONATION_COOLDOWN_DAYS[key];
        const lastDate = parseISO(lastDonationDate);
        const eligibleFrom = addDays(lastDate, cooldown);
        const today = new Date();
        const canDonate = isAfter(today, eligibleFrom) || differenceInDays(today, eligibleFrom) === 0;
        const daysRemaining = canDonate ? 0 : differenceInDays(eligibleFrom, today);

        return { key, icon, color, canDonate, daysRemaining, eligibleFrom };
      })
    : null;

  return (
    <div className="rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-surface)] p-6">
      <h2 className="mb-4 text-lg font-bold">Calculer mon eligibilite</h2>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {/* Date input */}
        <div>
          <label
            htmlFor="lastDonation"
            className="mb-1.5 block text-sm font-medium text-[var(--color-text-muted)]"
          >
            Date de votre dernier don
          </label>
          <input
            id="lastDonation"
            type="date"
            value={lastDonationDate}
            onChange={(e) => setLastDonationDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
          />
        </div>

        {/* Type select */}
        <div>
          <label
            htmlFor="donationType"
            className="mb-1.5 block text-sm font-medium text-[var(--color-text-muted)]"
          >
            Type de don effectue
          </label>
          <select
            id="donationType"
            value={lastDonationType}
            onChange={(e) => setLastDonationType(e.target.value as DonationType)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
          >
            {TYPES.map(({ key }) => (
              <option key={key} value={key}>
                {DONATION_TYPE_LABELS[key].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Votre eligibilite par type de don
          </h3>
          {results.map((r) => (
            <div
              key={r.key}
              className="flex items-center justify-between rounded-xl border p-4"
              style={{
                borderColor: r.canDonate ? "rgba(52,211,153,0.3)" : r.color + "30",
                backgroundColor: r.canDonate ? "rgba(52,211,153,0.05)" : r.color + "05",
              }}
            >
              <div className="flex items-center gap-3">
                <span style={{ color: r.color }}>{r.icon}</span>
                <span className="font-medium">
                  {DONATION_TYPE_LABELS[r.key].label}
                </span>
              </div>
              {r.canDonate ? (
                <span className="flex items-center gap-1.5 text-sm font-bold text-[var(--color-green)]">
                  <CheckCircle className="h-4 w-4" />
                  Eligible
                </span>
              ) : (
                <span className="text-right text-sm text-[var(--color-text-muted)]">
                  <strong style={{ color: r.color }}>{r.daysRemaining}j</strong>{" "}
                  restants &middot;{" "}
                  {format(r.eligibleFrom, "d MMM yyyy", { locale: fr })}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {!results && (
        <p className="text-center text-sm text-[var(--color-text-muted)]">
          Renseignez la date de votre dernier don pour voir votre eligibilite.
        </p>
      )}
    </div>
  );
}
