"use client";

import { useState } from "react";
import { useAppStore } from "@web/lib/store";
import { ProgressDots } from "../ProgressDots";
import type { BiologicalSex, BloodType } from "@shared/types";

const BLOOD_TYPES: BloodType[] = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

export function BloodTypeStep({ onNext }: { onNext: () => void }) {
  const setProfile = useAppStore((s) => s.setProfile);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const profile = useAppStore((s) => s.profile);

  const [name, setName] = useState(profile?.name ?? "");
  const [bloodType, setBloodType] = useState<BloodType | null>(profile?.bloodType ?? null);
  const [sex, setSex] = useState<BiologicalSex | null>(profile?.sex ?? null);

  const canContinue = name.trim().length >= 2 && bloodType && sex;

  const handleContinue = () => {
    if (!canContinue) return;
    if (!profile) {
      setProfile({
        id: crypto.randomUUID?.() ?? Math.random().toString(36),
        bloodType: bloodType!,
        sex: sex!,
        name: name.trim(),
        onboardingCompleted: false,
        notificationsEnabled: false,
        createdAt: new Date().toISOString(),
      });
    } else {
      updateProfile({ bloodType: bloodType!, sex: sex!, name: name.trim() });
    }
    onNext();
  };

  return (
    <div className="flex min-h-screen flex-col px-4 py-8 animate-[fadeInUp_400ms_ease-out]">
      <ProgressDots total={4} current={1} />

      <h2 className="mb-1 mt-8 text-2xl font-extrabold">Parle-nous de toi</h2>
      <p className="mb-6 text-sm text-[var(--color-text-muted)]">
        Ces informations nous aident a personnaliser ton experience.
      </p>

      {/* Name */}
      <label className="mb-1 text-sm font-medium text-[var(--color-text-muted)]">Prenom</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ex: Pauline, Mehdi..."
        className="mb-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 outline-none focus:border-[var(--color-primary)]"
      />

      {/* Blood Type */}
      <label className="mb-2 text-sm font-medium text-[var(--color-text-muted)]">Groupe sanguin</label>
      <div className="mb-2 grid grid-cols-4 gap-2">
        {BLOOD_TYPES.map((bt) => (
          <button
            key={bt}
            onClick={() => setBloodType(bt)}
            className="rounded-xl border py-3 text-sm font-bold transition-all active:scale-95"
            style={{
              borderColor: bloodType === bt ? "var(--color-primary)" : "var(--color-border)",
              backgroundColor: bloodType === bt ? "rgba(248,113,113,0.1)" : "var(--color-surface)",
              color: bloodType === bt ? "var(--color-primary)" : "var(--color-text)",
            }}
          >
            {bt}
          </button>
        ))}
      </div>
      <button
        onClick={() => setBloodType("unknown")}
        className="mb-6 rounded-xl border py-3 text-sm font-medium transition-all"
        style={{
          borderColor: bloodType === "unknown" ? "var(--color-primary)" : "var(--color-border)",
          backgroundColor: bloodType === "unknown" ? "rgba(248,113,113,0.1)" : "var(--color-surface)",
          color: bloodType === "unknown" ? "var(--color-primary)" : "var(--color-text-muted)",
        }}
      >
        Je ne sais pas
      </button>

      {/* Sex */}
      <label className="mb-2 text-sm font-medium text-[var(--color-text-muted)]">Sexe biologique</label>
      <div className="mb-8 grid grid-cols-2 gap-3">
        {([
          { value: "male" as BiologicalSex, label: "Homme" },
          { value: "female" as BiologicalSex, label: "Femme" },
        ]).map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSex(opt.value)}
            className="rounded-xl border py-3 text-sm font-bold transition-all active:scale-95"
            style={{
              borderColor: sex === opt.value ? "var(--color-primary)" : "var(--color-border)",
              backgroundColor: sex === opt.value ? "rgba(248,113,113,0.1)" : "var(--color-surface)",
              color: sex === opt.value ? "var(--color-primary)" : "var(--color-text)",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!canContinue}
        className="mt-auto rounded-xl bg-[var(--color-primary)] py-3.5 text-base font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
      >
        Continuer
      </button>
    </div>
  );
}
