"use client";

import {
  Droplet,
  Flame,
  Plus,
  CheckCircle,
  Microscope,
  FlaskConical,
  Lightbulb,
  Heart,
  Droplets,
  TrendingUp,
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
  whole_blood: <Droplet className="h-6 w-6" />,
  platelets: <Microscope className="h-6 w-6" />,
  plasma: <FlaskConical className="h-6 w-6" />,
};

const TYPE_ICONS_LG: Record<DonationType, React.ReactNode> = {
  whole_blood: <Droplet className="h-8 w-8" />,
  platelets: <Microscope className="h-8 w-8" />,
  plasma: <FlaskConical className="h-8 w-8" />,
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
      <div className="mb-5 flex items-center justify-between md:hidden">
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

      {/* Hero — Impact + CTA */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-(--color-primary)/20 bg-linear-to-br from-[rgba(248,113,113,0.06)] via-transparent to-[rgba(248,113,113,0.03)] p-6 md:p-8">
        <div className="md:flex md:items-center md:justify-between md:gap-8">
          {/* Left: Impact */}
          <div className="text-center md:text-left">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-(--color-text-muted)">
              Ton impact total
            </p>
            <div className="flex items-baseline justify-center gap-2 md:justify-start">
              <span className="text-6xl md:text-7xl font-extrabold text-(--color-primary) leading-none">
                {livesSaved}
              </span>
              <span className="text-lg font-bold text-(--color-text-muted)">
                {livesSaved === 1 ? "vie" : "vies"}
              </span>
            </div>
            <p className="mt-2 text-sm text-(--color-text-muted)">
              potentiellement sauvees
            </p>
          </div>

          {/* Right: Stats row + CTA */}
          <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end gap-5">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <Droplets className="h-5 w-5 text-(--color-primary)" />
                  <span className="text-3xl font-extrabold">{count}</span>
                </div>
                <p className="mt-0.5 text-xs font-medium text-(--color-text-muted)">
                  don{count !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="h-8 w-px bg-(--color-border)" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <Flame className="h-5 w-5 text-(--color-accent)" />
                  <span className="text-3xl font-extrabold">{streak}</span>
                </div>
                <p className="mt-0.5 text-xs font-medium text-(--color-text-muted)">streak</p>
              </div>
            </div>
            <button
              onClick={onRegisterDonation}
              disabled={!canDonate}
              className="flex w-full md:w-auto items-center justify-center gap-2.5 rounded-xl bg-(--color-primary) px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-(--color-primary)/20 transition-all hover:opacity-90 hover:shadow-xl hover:shadow-(--color-primary)/30 active:scale-[0.97] disabled:opacity-40 disabled:shadow-none"
            >
              <Plus className="h-5 w-5" />
              Enregistrer un don
            </button>
          </div>
        </div>
      </div>

      {/* Eligibility per type — bigger cards with icons */}
      <div className="mb-5 grid grid-cols-3 gap-3 md:gap-5">
        {(["whole_blood", "platelets", "plasma"] as DonationType[]).map((type) => {
          const e = perType[type];
          const colors = DONATION_TYPE_COLORS[type];
          const cooldown = DONATION_COOLDOWN_DAYS[type];
          const daysElapsed = e.daysRemaining !== undefined ? cooldown - e.daysRemaining : cooldown;
          const ringProgress = e.canDonate ? 1 : daysElapsed / cooldown;

          return (
            <div
              key={type}
              className="relative overflow-hidden rounded-2xl border p-4 md:p-5 transition-all hover:shadow-md"
              style={{ borderColor: colors.border, backgroundColor: colors.bg }}
            >
              {/* Icon */}
              <div
                className="mb-3 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${colors.main}15`, color: colors.main }}
              >
                <span className="hidden md:block">{TYPE_ICONS_LG[type]}</span>
                <span className="md:hidden">{TYPE_ICONS[type]}</span>
              </div>

              {/* Label */}
              <p className="text-sm md:text-base font-bold mb-2">
                {DONATION_TYPE_LABELS[type].label}
              </p>

              {/* Status */}
              <div className="flex items-center gap-2">
                <CountdownRing progress={ringProgress} color={colors.main} size={32} strokeWidth={2.5}>
                  {e.canDonate ? (
                    <CheckCircle className="h-3.5 w-3.5" style={{ color: colors.main }} />
                  ) : (
                    <span className="text-[9px] font-bold" style={{ color: colors.main }}>
                      {e.daysRemaining}j
                    </span>
                  )}
                </CountdownRing>
                <span
                  className="text-xs md:text-sm font-semibold"
                  style={{ color: e.canDonate ? colors.main : "var(--color-text-muted)" }}
                >
                  {e.canDonate ? "Eligible" : `${e.daysRemaining}j restants`}
                </span>
              </div>

              {/* Delay info — desktop */}
              <p className="hidden md:block mt-2 text-xs text-(--color-text-muted)">
                Delai : {DONATION_TYPE_LABELS[type].delay}
              </p>
            </div>
          );
        })}
      </div>

      {/* Level progress */}
      <div className="mb-5">
        <DonationProgressBar levelConfig={levelConfig} progress={progress} nextLevel={nextLevel} />
      </div>

      {/* Education teaser */}
      <button
        onClick={() => onTabChange("education")}
        className="mb-4 flex w-full items-center gap-4 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 md:p-5 text-left transition-all hover:border-(--color-accent)/40 hover:shadow-sm"
      >
        <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl bg-(--color-accent)/10">
          <Lightbulb className="h-5 w-5 md:h-6 md:w-6 text-(--color-accent)" />
        </div>
        <div>
          <p className="text-sm md:text-base font-bold">Le saviez-vous ?</p>
          <p className="text-xs md:text-sm text-(--color-text-muted)">
            Decouvre des faits sur le don du sang
          </p>
        </div>
        <TrendingUp className="ml-auto h-4 w-4 shrink-0 text-(--color-text-muted)" />
      </button>
    </div>
  );
}
