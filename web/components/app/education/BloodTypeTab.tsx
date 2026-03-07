"use client";

import { CheckCircle, XCircle, Dna } from "lucide-react";
import { useAppStore } from "@web/lib/store";
import { BLOOD_TYPE_INFO } from "@shared/constants";

export function BloodTypeTab() {
  const bloodType = useAppStore((s) => s.profile?.bloodType);
  const info = bloodType ? BLOOD_TYPE_INFO[bloodType] : null;

  if (!bloodType || bloodType === "unknown" || !info) {
    return (
      <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-text-muted)/5">
          <Dna className="h-7 w-7 text-(--color-text-muted)/30" />
        </div>
        <p className="text-3xl font-extrabold text-(--color-text-muted)">?</p>
        <p className="mt-3 text-sm text-(--color-text-muted)">
          Groupe non renseigne. Mets-le a jour dans ton profil.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <div className="mb-5 rounded-2xl border border-(--color-primary)/20 bg-linear-to-br from-[rgba(248,113,113,0.08)] to-transparent p-6 md:p-8 text-center">
        <p className="text-6xl md:text-7xl font-extrabold text-(--color-primary) leading-none">{bloodType}</p>
        <p className="mt-3 text-sm md:text-base text-(--color-text-muted)">{info.description}</p>
      </div>

      {/* Compatibility */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 md:p-5">
          <p className="mb-2.5 flex items-center gap-1.5 text-sm font-bold text-(--color-green)">
            <CheckCircle className="h-4 w-4" /> Peut recevoir de
          </p>
          <div className="flex flex-wrap gap-2">
            {info.canReceiveFrom.map((bt) => (
              <span key={bt} className="rounded-lg bg-(--color-green)/10 px-2.5 py-1 text-sm font-bold text-(--color-green)">
                {bt}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 md:p-5">
          <p className="mb-2.5 flex items-center gap-1.5 text-sm font-bold text-(--color-primary)">
            <XCircle className="h-4 w-4" /> Peut donner a
          </p>
          <div className="flex flex-wrap gap-2">
            {info.canDonateTo.map((bt) => (
              <span key={bt} className="rounded-lg bg-(--color-primary)/10 px-2.5 py-1 text-sm font-bold text-(--color-primary)">
                {bt}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
