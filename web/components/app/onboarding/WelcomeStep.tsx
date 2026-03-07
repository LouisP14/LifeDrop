"use client";

import { Heart } from "lucide-react";
import { Logo } from "@web/components/ui/Logo";

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center animate-[fadeInUp_600ms_ease-out]">
      <Logo size={100} />

      <p className="mb-6 mt-6 text-lg text-(--color-text-muted)">
        Chaque don compte. Chaque vie aussi.
      </p>

      <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-(--color-primary)/20 bg-(--color-primary)/5 px-5 py-2.5 text-sm">
        <Heart className="h-4 w-4 text-(--color-primary)" />
        <span className="text-(--color-text-muted)">
          <strong className="text-(--color-primary)">3 vies</strong>{" "}
          potentiellement sauvees par don
        </span>
      </div>

      <button
        onClick={onNext}
        className="rounded-xl bg-(--color-primary) px-10 py-4 text-base font-bold text-white transition-all hover:opacity-90 active:scale-95"
      >
        Commencer l&apos;aventure
      </button>

      <p className="mt-6 text-xs text-(--color-text-muted)">
        100% gratuit &middot; Sans publicite &middot; Fonctionne hors-ligne
      </p>
    </div>
  );
}
