"use client";

import {
  Droplet,
  Flame,
  Plus,
  CheckCircle,
  Microscope,
  GlassWater,
  Lightbulb,
  Heart,
} from "lucide-react";
import { useAppStore } from "@web/lib/store";
import { useDonationStats } from "@web/hooks/useDonationStats";
import { useEligibility, usePerTypeEligibility } from "@web/hooks/useEligibility";
import { DONATION_TYPE_LABELS, DONATION_TYPE_COLORS, DONATION_COOLDOWN_DAYS } from "@shared/constants";
import { Logo } from "@web/components/ui/Logo";
import { CountdownRing } from "./CountdownRing";
import { DonationProgressBar } from "./DonationProgressBar";
import type { DonationType } from "@shared/types";

const TYPE_ICONS: Record<DonationType, React.ReactNode> = {
  whole_blood: <Droplet className="h-4 w-4" />,
  platelets: <Microscope className="h-4 w-4" />,
  plasma: <GlassWater className="h-4 w-4" />,
};

export function DashboardTab({
  onRegisterDonation,
  onTabChange,
}: {
  onRegisterDonation: () => void;
  onTabChange: (tab: "education") => void;
}) {
  const profile = useAppStore((s) => s.profile);
  const { count, livesSaved, levelConfig, nextLevel, progress, streak } = useDonationStats();
  const { canDonate } = useEligibility();
  const perType = usePerTypeEligibility();

  const initials = profile?.name
    ? profile.name.slice(0, 2).toUpperCase()
    : profile?.bloodType !== "unknown"
      ? profile?.bloodType
      : "?";

  return (
    <div className="px-4 pt-4 md:px-8 md:pt-8 animate-[fadeInUp_400ms_ease-out]">
      {/* Header — mobile only */}
      <div className="mb-6 flex items-center justify-between md:hidden">
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-(--color-text)">life</span>
            <span className="text-(--color-primary)">drop</span>
          </span>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold"
          style={{ backgroundColor: "rgba(248,113,113,0.15)", color: "var(--color-primary)" }}
        >
          {initials}
        </div>
      </div>

      {/* Desktop welcome */}
      <div className="mb-8 hidden md:block">
        <h1 className="text-2xl font-extrabold">
          Bonjour{profile?.name ? `, ${profile.name}` : ""} !
        </h1>
        <p className="mt-1 text-sm text-(--color-text-muted)">Voici ton tableau de bord</p>
      </div>

      {/* Top row: Hero impact + CTA + Stats — desktop 3-col */}
      <div className="md:grid md:grid-cols-3 md:gap-5">
        {/* Hero impact */}
        <div className="mb-6 md:mb-0 overflow-hidden rounded-2xl border border-(--color-primary)/20 bg-linear-to-br from-[rgba(248,113,113,0.08)] to-transparent p-6 text-center flex flex-col justify-center">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-(--color-text-muted)">
            Ton impact total
          </p>
          <div className="text-5xl font-extrabold text-(--color-primary)">
            {livesSaved}
          </div>
          <p className="mt-1 text-sm text-(--color-text-muted)">
            vies potentiellement sauvees
          </p>
        </div>

        {/* Stats + CTA column */}
        <div className="mb-6 md:mb-0 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 flex-1">
            <div className="rounded-xl border border-(--color-border) bg-(--color-surface) p-4 text-center flex flex-col justify-center">
              <div className="flex items-center justify-center gap-1.5">
                <Heart className="h-4 w-4 text-(--color-primary)" />
                <span className="text-2xl font-extrabold">{count}</span>
              </div>
              <div className="text-xs text-(--color-text-muted) mt-1">don{count !== 1 ? "s" : ""}</div>
            </div>
            <div className="rounded-xl border border-(--color-border) bg-(--color-surface) p-4 text-center flex flex-col justify-center">
              <div className="flex items-center justify-center gap-1.5">
                <Flame className="h-4 w-4 text-(--color-accent)" />
                <span className="text-2xl font-extrabold">{streak}</span>
              </div>
              <div className="text-xs text-(--color-text-muted) mt-1">streak</div>
            </div>
          </div>
          {/* CTA */}
          <button
            onClick={onRegisterDonation}
            disabled={!canDonate}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--color-primary) py-3.5 text-base font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
          >
            <Plus className="h-5 w-5" />
            Enregistrer un don
          </button>
        </div>

        {/* Level progress */}
        <div className="mb-6 md:mb-0 flex flex-col justify-center">
          <DonationProgressBar levelConfig={levelConfig} progress={progress} nextLevel={nextLevel} />
        </div>
      </div>

      {/* Eligibility per type */}
      <div className="mt-6 grid grid-cols-3 gap-3 md:gap-5">
        {(["whole_blood", "platelets", "plasma"] as DonationType[]).map((type) => {
          const e = perType[type];
          const colors = DONATION_TYPE_COLORS[type];
          const cooldown = DONATION_COOLDOWN_DAYS[type];
          const daysElapsed = e.daysRemaining !== undefined ? cooldown - e.daysRemaining : cooldown;
          const ringProgress = e.canDonate ? 1 : daysElapsed / cooldown;

          return (
            <div
              key={type}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border p-4 md:flex-row md:justify-start md:gap-4"
              style={{ borderColor: colors.border, backgroundColor: colors.bg }}
            >
              <CountdownRing progress={ringProgress} color={colors.main} size={44} strokeWidth={3}>
                {e.canDonate ? (
                  <CheckCircle className="h-4 w-4" style={{ color: colors.main }} />
                ) : (
                  <span className="text-[10px]" style={{ color: colors.main }}>
                    {e.daysRemaining}j
                  </span>
                )}
              </CountdownRing>
              <div className="text-center md:text-left">
                <span className="text-[11px] font-medium text-(--color-text-muted) block">
                  {DONATION_TYPE_LABELS[type].label}
                </span>
                <span className="hidden md:block text-xs font-bold mt-0.5" style={{ color: colors.main }}>
                  {e.canDonate ? "Eligible" : `${e.daysRemaining}j restants`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Education teaser */}
      <button
        onClick={() => onTabChange("education")}
        className="mb-4 mt-6 flex w-full items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-surface) p-4 text-left transition-colors hover:bg-(--color-surface-2)"
      >
        <Lightbulb className="h-5 w-5 shrink-0 text-(--color-accent)" />
        <div>
          <p className="text-sm font-bold">Le saviez-vous ?</p>
          <p className="text-xs text-(--color-text-muted)">
            Decouvre des faits sur le don du sang
          </p>
        </div>
      </button>
    </div>
  );
}
