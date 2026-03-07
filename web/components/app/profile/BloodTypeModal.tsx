"use client";

import { useAppStore } from "@web/lib/store";
import { Modal } from "../Modal";
import type { BloodType } from "@shared/types";

const BLOOD_TYPES: BloodType[] = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

export function BloodTypeModal({ onClose }: { onClose: () => void }) {
  const updateProfile = useAppStore((s) => s.updateProfile);
  const currentType = useAppStore((s) => s.profile?.bloodType);

  const handleSelect = (bt: BloodType) => {
    updateProfile({ bloodType: bt });
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="px-6 pb-4 pt-2">
        <h3 className="mb-4 text-lg font-extrabold">Groupe sanguin</h3>
        <div className="grid grid-cols-4 gap-2">
          {BLOOD_TYPES.map((bt) => (
            <button
              key={bt}
              onClick={() => handleSelect(bt)}
              className="rounded-xl border py-3 text-sm font-bold transition-all active:scale-95"
              style={{
                borderColor: currentType === bt ? "var(--color-primary)" : "var(--color-border)",
                backgroundColor: currentType === bt ? "rgba(248,113,113,0.1)" : "var(--color-surface)",
                color: currentType === bt ? "var(--color-primary)" : "var(--color-text)",
              }}
            >
              {bt}
            </button>
          ))}
        </div>
        <button
          onClick={() => handleSelect("unknown")}
          className="mt-2 w-full rounded-xl border border-(--color-border) bg-(--color-surface) py-3 text-sm text-(--color-text-muted)"
        >
          Je ne sais pas
        </button>
      </div>
    </Modal>
  );
}
