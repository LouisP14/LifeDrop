"use client";

import { useState } from "react";
import { useAppStore } from "@web/lib/store";
import { Modal } from "../Modal";
import type { BloodType, BiologicalSex } from "@shared/types";

const BLOOD_TYPES: BloodType[] = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

export function EditProfileModal({ onClose }: { onClose: () => void }) {
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);
  const updateProfile = useAppStore((s) => s.updateProfile);

  const [name, setName] = useState(profile?.name ?? "");
  const [bloodType, setBloodType] = useState<BloodType>(profile?.bloodType ?? "unknown");
  const [sex, setSex] = useState<BiologicalSex>(profile?.sex ?? "male");

  const handleSave = () => {
    if (!profile) {
      setProfile({
        id: crypto.randomUUID?.() ?? Math.random().toString(36),
        bloodType,
        sex,
        name: name.trim() || "Donneur",
        onboardingCompleted: true,
        notificationsEnabled: false,
        createdAt: new Date().toISOString(),
      });
    } else {
      updateProfile({
        name: name.trim() || "Donneur",
        bloodType,
        sex,
      });
    }
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="px-6 pb-4 pt-2">
        <h3 className="mb-5 text-lg font-extrabold">Modifier mon profil</h3>

        {/* Name */}
        <label className="mb-1.5 block text-sm font-medium text-(--color-text-muted)">Prenom</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Pauline, Mehdi..."
          className="mb-5 w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-sm text-(--color-text) placeholder:text-(--color-text-muted)/50 outline-none focus:border-(--color-primary)"
        />

        {/* Blood type */}
        <label className="mb-1.5 block text-sm font-medium text-(--color-text-muted)">Groupe sanguin</label>
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
          className="mb-5 w-full rounded-xl border py-3 text-sm font-medium transition-all"
          style={{
            borderColor: bloodType === "unknown" ? "var(--color-primary)" : "var(--color-border)",
            backgroundColor: bloodType === "unknown" ? "rgba(248,113,113,0.1)" : "var(--color-surface)",
            color: bloodType === "unknown" ? "var(--color-primary)" : "var(--color-text-muted)",
          }}
        >
          Je ne sais pas
        </button>

        {/* Sex */}
        <label className="mb-1.5 block text-sm font-medium text-(--color-text-muted)">Sexe biologique</label>
        <div className="mb-6 grid grid-cols-2 gap-3">
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

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full rounded-xl bg-(--color-primary) py-3.5 text-base font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
        >
          Enregistrer
        </button>
      </div>
    </Modal>
  );
}
