"use client";

import { useEffect, useState } from "react";
import { Syringe, Award, Heart, Share2, Loader2 } from "lucide-react";
import { useAppStore } from "@web/lib/store";
import { BADGES_CATALOG, DONATION_TYPE_LABELS, LIVES_PER_DONATION_TYPE } from "@shared/constants";
import { generateShareCard } from "@web/lib/generateShareCard";
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
  const profile = useAppStore((s) => s.profile);
  const newBadges = BADGES_CATALOG.filter((b) => data.newBadgeIds.includes(b.id));
  const typeLabel = DONATION_TYPE_LABELS[data.donationType].label;
  const livesThisDon = LIVES_PER_DONATION_TYPE[data.donationType];
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    setSharing(true);
    try {
      const blob = await generateShareCard({
        donationType: data.donationType,
        typeLabel: typeLabel.toLowerCase(),
        livesThisDon,
        totalLives: data.livesSaved,
        donorName: profile?.name ?? "Donneur",
        badgeLabel: newBadges.length > 0 ? newBadges[0].label : undefined,
      });

      const file = new File([blob], "lifedrop-impact.png", { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Mon impact LifeDrop",
          text: `Je viens de faire un don et j'ai potentiellement sauve ${data.livesSaved} vies avec LifeDrop !`,
          files: [file],
        });
      } else {
        // Fallback: download the image
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "lifedrop-impact.png";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // User cancelled share or error
    } finally {
      setSharing(false);
    }
  };

  useEffect(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate(200);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-(--color-bg)">
      <div className="w-full max-w-lg px-6 text-center">
        {/* Animated icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-(--color-primary)/15 animate-[scaleIn_500ms_ease-out]">
          <Syringe className="h-12 w-12 text-(--color-primary)" />
        </div>

        {/* Title */}
        <h2 className="mb-2 text-3xl font-extrabold animate-[fadeInUp_600ms_ease-out]">
          Don enregistre !
        </h2>

        {/* Lives counter */}
        <div className="mb-2 animate-[fadeInUp_700ms_ease-out]">
          <span className="text-5xl font-extrabold text-(--color-primary)">
            {data.livesSaved}
          </span>
        </div>
        <p className="mb-8 text-sm text-(--color-text-muted) animate-[fadeInUp_800ms_ease-out]">
          vies potentiellement sauvees au total
        </p>

        {/* New badges */}
        {newBadges.length > 0 && (
          <div className="mb-8 animate-[fadeInUp_900ms_ease-out]">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-(--color-accent)">
              Nouveau{newBadges.length > 1 ? "x" : ""} badge{newBadges.length > 1 ? "s" : ""} !
            </p>
            <div className="flex justify-center gap-3">
              {newBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center gap-1 rounded-xl border border-(--color-accent)/30 bg-(--color-accent)/5 p-3"
                >
                  <Award className="h-6 w-6 text-(--color-accent)" />
                  <span className="text-xs font-bold">{badge.label}</span>
                  <span className="text-[10px] text-(--color-text-muted)">
                    {badge.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reminder */}
        <div className="mb-8 flex items-center justify-center gap-2 text-xs text-(--color-text-muted) animate-[fadeInUp_1000ms_ease-out]">
          <Heart className="h-3.5 w-3.5 text-(--color-primary)" />
          Nous te rappellerons quand tu pourras donner a nouveau.
        </div>

        {/* Share */}
        <button
          onClick={handleShare}
          disabled={sharing}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-(--color-primary)/30 py-3.5 text-base font-bold text-(--color-primary) transition-all hover:bg-(--color-primary)/10 active:scale-95 disabled:opacity-60 animate-[fadeInUp_1100ms_ease-out]"
        >
          {sharing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Share2 className="h-5 w-5" />
          )}
          {sharing ? "Generation..." : "Partager mon impact"}
        </button>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full rounded-xl bg-(--color-primary) py-3.5 text-base font-bold text-white transition-all hover:opacity-90 active:scale-95 animate-[fadeInUp_1200ms_ease-out]"
        >
          Retour a l&apos;accueil
        </button>
      </div>
    </div>
  );
}
