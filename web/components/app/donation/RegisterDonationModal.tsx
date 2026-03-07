"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Heart, Droplet, Microscope, GlassWater, CheckCircle, AlertTriangle, MapPin,
} from "lucide-react";
import { useAppStore } from "@web/lib/store";
import { usePerTypeEligibility } from "@web/hooks/useEligibility";
import { computeLivesSaved } from "@shared/utils/donations";
import { computeEarnedBadgeIds, mergeBadges, getNewlyUnlockedBadgeIds } from "@shared/utils/levels";
import { DONATION_TYPE_LABELS, DONATION_TYPE_COLORS, DONATION_COOLDOWN_DAYS, LIVES_PER_DONATION_TYPE } from "@shared/constants";
import { Modal } from "../Modal";
import type { DonationType } from "@shared/types";

const TYPE_ICONS: Record<DonationType, React.ReactNode> = {
  whole_blood: <Droplet className="h-5 w-5" />,
  platelets: <Microscope className="h-5 w-5" />,
  plasma: <GlassWater className="h-5 w-5" />,
};

const TYPES: DonationType[] = ["whole_blood", "platelets", "plasma"];

export function RegisterDonationModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (data: { livesSaved: number; newBadgeIds: string[]; donationType: DonationType }) => void;
}) {
  const addDonation = useAppStore((s) => s.addDonation);
  const donations = useAppStore((s) => s.donations);
  const badges = useAppStore((s) => s.badges);
  const profile = useAppStore((s) => s.profile);
  const perType = usePerTypeEligibility();

  const [selectedType, setSelectedType] = useState<DonationType>("whole_blood");
  const [location, setLocation] = useState("");

  const eligibility = perType[selectedType];
  const isBlocked = !eligibility.canDonate;
  const livesCount = LIVES_PER_DONATION_TYPE[selectedType];

  const handleSubmit = () => {
    if (isBlocked) return;

    const prevBadges = [...badges];
    const newDonation = {
      id: crypto.randomUUID?.() ?? Math.random().toString(36),
      date: new Date().toISOString(),
      type: selectedType,
      location: location.trim() || undefined,
    };

    addDonation(newDonation);

    const updatedDonations = [...donations, newDonation];
    const earnedIds = profile ? computeEarnedBadgeIds(updatedDonations, profile) : [];
    const updatedBadges = mergeBadges(earnedIds, prevBadges);
    const newBadgeIds = getNewlyUnlockedBadgeIds(prevBadges, updatedBadges);

    onSuccess({
      livesSaved: computeLivesSaved(updatedDonations),
      newBadgeIds,
      donationType: selectedType,
    });
  };

  return (
    <Modal onClose={onClose}>
      <div className="px-6 pb-4 pt-2">
        <h3 className="mb-4 text-lg font-extrabold">Enregistrer un don</h3>

        {/* Impact banner */}
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-[var(--color-primary)]/10 px-4 py-3">
          <Heart className="h-5 w-5 text-[var(--color-primary)]" />
          <span className="text-sm">
            Ton don peut sauver jusqu&apos;a{" "}
            <strong className="text-[var(--color-primary)]">{livesCount} vie{livesCount > 1 ? "s" : ""}</strong>
          </span>
        </div>

        {/* Blocked warning */}
        {isBlocked && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 px-4 py-3">
            <AlertTriangle className="h-4 w-4 text-[var(--color-accent)]" />
            <span className="text-xs text-[var(--color-accent)]">
              {eligibility.daysRemaining}j restants avant de pouvoir donner ce type
            </span>
          </div>
        )}

        {/* Date */}
        <p className="mb-4 text-xs text-[var(--color-text-muted)]">
          {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
        </p>

        {/* Type selector */}
        <div className="mb-4 space-y-2">
          {TYPES.map((type) => {
            const e = perType[type];
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
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Delai : {DONATION_COOLDOWN_DAYS[type]} jours
                  </p>
                </div>
                {e.canDonate ? (
                  <CheckCircle className="h-4 w-4" style={{ color: "var(--color-green)" }} />
                ) : (
                  <span className="text-xs font-bold" style={{ color: colors.main }}>
                    {e.daysRemaining}j
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="mb-1 flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
            <MapPin className="h-3 w-3" /> Lieu (optionnel)
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex: EFS Paris"
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 outline-none focus:border-[var(--color-primary)]"
          />
        </div>

        {/* Legal note */}
        <p className="mb-6 text-[10px] text-[var(--color-text-muted)]">
          Les delais legaux entre deux dons sont fixes par l&apos;EFS. LifeDrop ne se substitue pas a un avis medical.
        </p>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isBlocked}
          className="w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-base font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
        >
          Valider ce don
        </button>
      </div>
    </Modal>
  );
}
