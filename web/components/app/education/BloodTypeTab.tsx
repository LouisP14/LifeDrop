"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { useAppStore } from "@web/lib/store";
import { BLOOD_TYPE_INFO } from "@shared/constants";

export function BloodTypeTab() {
  const bloodType = useAppStore((s) => s.profile?.bloodType);
  const info = bloodType ? BLOOD_TYPE_INFO[bloodType] : null;

  if (!bloodType || bloodType === "unknown" || !info) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
        <p className="text-5xl font-extrabold text-[var(--color-text-muted)]">?</p>
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">
          Groupe non renseigne. Mets-le a jour dans ton profil.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <div className="mb-5 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-6 text-center">
        <p className="text-5xl font-extrabold text-[var(--color-primary)]">{bloodType}</p>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">{info.description}</p>
      </div>

      {/* Compatibility */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="mb-2 flex items-center gap-1 text-xs font-bold text-[var(--color-green)]">
            <CheckCircle className="h-3.5 w-3.5" /> Peut recevoir de
          </p>
          <div className="flex flex-wrap gap-1.5">
            {info.canReceiveFrom.map((bt) => (
              <span key={bt} className="rounded-lg bg-[var(--color-green)]/10 px-2 py-1 text-xs font-bold text-[var(--color-green)]">
                {bt}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="mb-2 flex items-center gap-1 text-xs font-bold text-[var(--color-primary)]">
            <XCircle className="h-3.5 w-3.5" /> Peut donner a
          </p>
          <div className="flex flex-wrap gap-1.5">
            {info.canDonateTo.map((bt) => (
              <span key={bt} className="rounded-lg bg-[var(--color-primary)]/10 px-2 py-1 text-xs font-bold text-[var(--color-primary)]">
                {bt}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
