"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Droplet, Microscope, GlassWater, MapPin, Trash2,
} from "lucide-react";
import { useAppStore } from "@web/lib/store";
import { DONATION_TYPE_LABELS, DONATION_TYPE_COLORS, DONATION_COOLDOWN_DAYS } from "@shared/constants";
import { Modal } from "../Modal";
import type { Donation, DonationType } from "@shared/types";

const TYPE_ICONS: Record<DonationType, React.ReactNode> = {
  whole_blood: <Droplet className="h-5 w-5" />,
  platelets: <Microscope className="h-5 w-5" />,
  plasma: <GlassWater className="h-5 w-5" />,
};

const TYPES: DonationType[] = ["whole_blood", "platelets", "plasma"];

export function EditDonationModal({
  donation,
  onClose,
}: {
  donation: Donation;
  onClose: () => void;
}) {
  const updateDonation = useAppStore((s) => s.updateDonation);
  const deleteDonation = useAppStore((s) => s.deleteDonation);

  const [selectedType, setSelectedType] = useState<DonationType>(donation.type);
  const [donationDate, setDonationDate] = useState(
    format(new Date(donation.date), "yyyy-MM-dd"),
  );
  const [dateError, setDateError] = useState("");
  const [location, setLocation] = useState(donation.location ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const validateDate = (dateStr: string): string | null => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (date > today) return "La date ne peut pas etre dans le futur.";
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (date < oneYearAgo) return "La date ne peut pas depasser 1 an.";
    return null;
  };

  const handleSave = () => {
    const error = validateDate(donationDate);
    if (error) {
      setDateError(error);
      return;
    }
    updateDonation({
      ...donation,
      type: selectedType,
      date: new Date(donationDate).toISOString(),
      location: location.trim() || undefined,
    });
    onClose();
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteDonation(donation.id);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="px-6 pb-4 pt-2">
        <h3 className="mb-4 text-lg font-extrabold">Modifier le don</h3>

        {/* Date picker */}
        <div className="mb-4">
          <label className="mb-1 flex items-center gap-1 text-xs text-(--color-text-muted)">
            Date du don
          </label>
          <input
            type="date"
            value={donationDate}
            max={format(new Date(), "yyyy-MM-dd")}
            onChange={(e) => { setDonationDate(e.target.value); setDateError(""); }}
            className="w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-sm text-(--color-text) outline-none focus:border-(--color-primary)"
          />
          {dateError && (
            <p className="mt-1 text-xs text-red-400">{dateError}</p>
          )}
        </div>

        {/* Type selector */}
        <div className="mb-4 space-y-2">
          {TYPES.map((type) => {
            const colors = DONATION_TYPE_COLORS[type];
            const isActive = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className="flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all active:scale-[0.98]"
                style={{
                  borderColor: isActive ? colors.main : "var(--color-border)",
                  backgroundColor: isActive ? colors.bg : "var(--color-surface)",
                }}
              >
                <span style={{ color: colors.main }}>{TYPE_ICONS[type]}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold">{DONATION_TYPE_LABELS[type].label}</p>
                  <p className="text-xs text-(--color-text-muted)">
                    Delai : {DONATION_COOLDOWN_DAYS[type]} jours
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Location */}
        <div className="mb-6">
          <label className="mb-1 flex items-center gap-1 text-xs text-(--color-text-muted)">
            <MapPin className="h-3 w-3" /> Lieu (optionnel)
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex: EFS Paris"
            className="w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-sm text-(--color-text) placeholder:text-(--color-text-muted)/50 outline-none focus:border-(--color-primary)"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-3.5 text-sm font-bold text-red-400 transition-all hover:bg-red-500/10 active:scale-95"
          >
            <Trash2 className="h-4 w-4" />
            {confirmDelete ? "Confirmer" : "Supprimer"}
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-xl bg-(--color-primary) py-3.5 text-base font-bold text-white transition-all hover:opacity-90 active:scale-95"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </Modal>
  );
}
