"use client";

import { useEffect } from "react";
import { Syringe, Award, Heart, Share2 } from "lucide-react";
import { BADGES_CATALOG, DONATION_TYPE_LABELS, LIVES_PER_DONATION_TYPE } from "@shared/constants";
import type { DonationType } from "@shared/types";

interface SuccessData {
  livesSaved: number;
  newBadgeIds: string[];
  donationType: DonationType;
}

export function DonationSuccessModal({
  data,
  onClose,
}: {
  data: SuccessData;
  onClose: () => void;
}) {
  const newBadges = BADGES_CATALOG.filter((b) => data.newBadgeIds.includes(b.id));
  const typeLabel = DONATION_TYPE_LABELS[data.donationType].label;
  const livesThisDon = LIVES_PER_DONATION_TYPE[data.donationType];

  const handleShare = async () => {
    const text = `Je viens de faire un don de ${typeLabel.toLowerCase()} et j'ai potentiellement sauvé ${livesThisDon} vie${livesThisDon > 1 ? "s" : ""} ! Au total, mes dons représentent ${data.livesSaved} vies sauvées. Rejoins le mouvement sur LifeDrop !`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Mon impact LifeDrop", text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  useEffect(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate(200);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg)]">
      <div className="w-full max-w-lg px-6 text-center">
        {/* Animated icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-primary)]/15 animate-[scaleIn_500ms_ease-out]">
          <Syringe className="h-12 w-12 text-[var(--color-primary)]" />
        </div>

        {/* Title */}
        <h2 className="mb-2 text-3xl font-extrabold animate-[fadeInUp_600ms_ease-out]">
          Don enregistre !
        </h2>

        {/* Lives counter */}
        <div className="mb-2 animate-[fadeInUp_700ms_ease-out]">
          <span className="text-5xl font-extrabold text-[var(--color-primary)]">
            {data.livesSaved}
          </span>
        </div>
        <p className="mb-8 text-sm text-[var(--color-text-muted)] animate-[fadeInUp_800ms_ease-out]">
          vies potentiellement sauvees au total
        </p>

        {/* New badges */}
        {newBadges.length > 0 && (
          <div className="mb-8 animate-[fadeInUp_900ms_ease-out]">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
              Nouveau{newBadges.length > 1 ? "x" : ""} badge{newBadges.length > 1 ? "s" : ""} !
            </p>
            <div className="flex justify-center gap-3">
              {newBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center gap-1 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 p-3"
                >
                  <Award className="h-6 w-6 text-[var(--color-accent)]" />
                  <span className="text-xs font-bold">{badge.label}</span>
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    {badge.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reminder */}
        <div className="mb-8 flex items-center justify-center gap-2 text-xs text-[var(--color-text-muted)] animate-[fadeInUp_1000ms_ease-out]">
          <Heart className="h-3.5 w-3.5 text-[var(--color-primary)]" />
          Nous te rappellerons quand tu pourras donner a nouveau.
        </div>

        {/* Share */}
        <button
          onClick={handleShare}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-primary)]/30 py-3.5 text-base font-bold text-[var(--color-primary)] transition-all hover:bg-[var(--color-primary)]/10 active:scale-95 animate-[fadeInUp_1100ms_ease-out]"
        >
          <Share2 className="h-5 w-5" />
          Partager mon impact
        </button>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-base font-bold text-white transition-all hover:opacity-90 active:scale-95 animate-[fadeInUp_1200ms_ease-out]"
        >
          Retour a l&apos;accueil
        </button>
      </div>
    </div>
  );
}
