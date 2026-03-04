"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Droplets,
  Heart,
  User,
  BookOpen,
  Plus,
  Award,
  Flame,
  Clock,
  FlaskConical,
  CheckCircle,
  Download,
  Smartphone,
  Share,
  MoreVertical,
} from "lucide-react";
import { useAppStore } from "@web/lib/store";
import { computeLivesSaved, computeStreak, computeEligibilityPerType } from "@shared/utils/donations";
import { getLevelConfig, getLevelProgress } from "@shared/utils/levels";
import { DONATION_TYPE_LABELS, DONATION_TYPE_COLORS } from "@shared/constants";
import { useInstallPrompt } from "@web/lib/pwa";
import { Logo } from "@web/components/ui/Logo";
import type { DonationType } from "@shared/types";

type AppTab = "dashboard" | "profile" | "education";

const TYPE_ICONS: Record<DonationType, React.ReactNode> = {
  whole_blood: <Droplets className="h-4 w-4" />,
  platelets: <Clock className="h-4 w-4" />,
  plasma: <FlaskConical className="h-4 w-4" />,
};

export default function AppPage() {
  const [mounted, setMounted] = useState(false);
  const { isInstalled, isInstallable, install } = useInstallPrompt();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Droplets className="h-8 w-8 animate-pulse text-[var(--color-primary)]" />
      </div>
    );
  }

  // If running as installed PWA → show the full app
  if (isInstalled) {
    return <InstalledAppView />;
  }

  // If in browser → show install page
  return <InstallView isInstallable={isInstallable} install={install} />;
}

/* ─────────────────────────────────────────────
   Install page — shown when accessing /app from browser
   ───────────────────────────────────────────── */
function InstallView({
  isInstallable,
  install,
}: {
  isInstallable: boolean;
  install: () => Promise<void>;
}) {
  const [isIOS, setIsIOS] = useState(false);
  const [autoTriggered, setAutoTriggered] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream);
  }, []);

  // Auto-trigger install prompt when available
  useEffect(() => {
    if (isInstallable && !autoTriggered) {
      setAutoTriggered(true);
      install();
    }
  }, [isInstallable, autoTriggered, install]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <Logo size={80} />

      <h1 className="mb-2 mt-6 text-3xl font-extrabold">
        <span className="text-[var(--color-text)]">life</span><span className="text-[var(--color-primary)]">drop</span>
      </h1>

      <p className="mb-2 text-lg text-[var(--color-text-muted)]">
        Chaque don compte. Chaque vie aussi.
      </p>

      <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-4 py-2 text-sm">
        <Heart className="h-4 w-4 text-[var(--color-primary)]" />
        <span className="text-[var(--color-text-muted)]">
          <strong className="text-[var(--color-primary)]">3 vies</strong>{" "}
          potentiellement sauvees par don
        </span>
      </div>

      {/* Features list */}
      <div className="mb-8 w-full space-y-3">
        {[
          { icon: <Droplets className="h-5 w-5 text-[var(--color-primary)]" />, text: "Suivez tous vos dons de sang" },
          { icon: <CheckCircle className="h-5 w-5 text-[var(--color-green)]" />, text: "Verifiez votre eligibilite en temps reel" },
          { icon: <Award className="h-5 w-5 text-[var(--color-accent)]" />, text: "Debloquez des badges et montez en niveau" },
          { icon: <Flame className="h-5 w-5 text-orange-400" />, text: "Gardez votre streak de dons" },
        ].map((feature) => (
          <div
            key={feature.text}
            className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-left"
          >
            {feature.icon}
            <span className="text-sm font-medium">{feature.text}</span>
          </div>
        ))}
      </div>

      {/* Install button */}
      {isInstallable ? (
        <button
          onClick={install}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3.5 text-base font-bold text-white transition-opacity hover:opacity-90"
        >
          <Download className="h-5 w-5" />
          Installer l&apos;application
        </button>
      ) : isIOS ? (
        <div className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="mb-3 text-sm font-bold">Pour installer sur iPhone / iPad :</p>
          <div className="space-y-2 text-left text-sm text-[var(--color-text-muted)]">
            <p className="flex items-center gap-2">
              <Share className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
              1. Appuyez sur le bouton <strong>Partager</strong>
            </p>
            <p className="flex items-center gap-2">
              <Plus className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
              2. Selectionnez <strong>&quot;Sur l&apos;ecran d&apos;accueil&quot;</strong>
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="mb-3 text-sm font-bold">Pour installer l&apos;application :</p>
          <div className="space-y-2 text-left text-sm text-[var(--color-text-muted)]">
            <p className="flex items-center gap-2">
              <MoreVertical className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
              1. Ouvrez le menu de votre navigateur
            </p>
            <p className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
              2. Selectionnez <strong>&quot;Installer l&apos;application&quot;</strong>
            </p>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-[var(--color-text-muted)]">
        100% gratuit &middot; Sans publicite &middot; Fonctionne hors-ligne
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Full app — shown when running as installed PWA
   ───────────────────────────────────────────── */
function InstalledAppView() {
  const [tab, setTab] = useState<AppTab>("dashboard");

  const profile = useAppStore((s) => s.profile);
  const donations = useAppStore((s) => s.donations);
  const isOnboardingCompleted = useAppStore((s) => s.isOnboardingCompleted);

  // Onboarding redirect
  if (!isOnboardingCompleted) {
    return <OnboardingView />;
  }

  const livesSaved = computeLivesSaved(donations);
  const streak = computeStreak(donations);
  const donationCount = donations.length;
  const level = getLevelConfig(donationCount);
  const progress = getLevelProgress(donationCount);
  const eligibility = computeEligibilityPerType(donations);

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      {/* Tab content */}
      {tab === "dashboard" && (
        <>
          {/* Hero stat */}
          <div className="mb-6 rounded-2xl border border-[var(--color-primary)]/20 bg-gradient-to-br from-[rgba(248,113,113,0.08)] to-transparent p-6 text-center">
            <div className="text-5xl font-extrabold text-[var(--color-primary)]">
              {livesSaved}
            </div>
            <div className="mt-1 text-sm text-[var(--color-text-muted)]">
              vies potentiellement sauvees
            </div>
          </div>

          {/* Eligibility per type */}
          <div className="mb-6 space-y-3">
            {(["whole_blood", "platelets", "plasma"] as DonationType[]).map((type) => {
              const e = eligibility[type];
              const colors = DONATION_TYPE_COLORS[type];
              return (
                <div
                  key={type}
                  className="flex items-center justify-between rounded-xl border p-4"
                  style={{ borderColor: colors.border, backgroundColor: colors.bg }}
                >
                  <div className="flex items-center gap-3">
                    <span style={{ color: colors.main }}>{TYPE_ICONS[type]}</span>
                    <span className="text-sm font-medium">
                      {DONATION_TYPE_LABELS[type].label}
                    </span>
                  </div>
                  {e.canDonate ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-[var(--color-green)]">
                      <CheckCircle className="h-3.5 w-3.5" /> Disponible
                    </span>
                  ) : (
                    <span className="text-xs font-bold" style={{ color: colors.main }}>
                      {e.daysRemaining}j restants
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick stats */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center">
              <div className="text-2xl font-extrabold">{donationCount}</div>
              <div className="text-xs text-[var(--color-text-muted)]">dons</div>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-extrabold">
                <Flame className="h-5 w-5 text-[var(--color-accent)]" />
                {streak}
              </div>
              <div className="text-xs text-[var(--color-text-muted)]">streak</div>
            </div>
          </div>

          {/* Level */}
          <div className="mb-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" style={{ color: level.color }} />
                <span className="text-sm font-bold">{level.label}</span>
              </div>
              <span className="text-xs text-[var(--color-text-muted)]">
                {progress}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--color-border)]">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progress}%`,
                  backgroundColor: level.color,
                }}
              />
            </div>
          </div>

          {/* Register donation button */}
          <Link
            href="/app"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3.5 text-base font-bold text-white"
          >
            <Plus className="h-5 w-5" />
            Enregistrer un don
          </Link>
        </>
      )}

      {tab === "profile" && (
        <div className="text-center">
          <div className="mb-4 text-5xl font-extrabold text-[var(--color-primary)]">
            {profile?.bloodType ?? "?"}
          </div>
          <p className="text-[var(--color-text-muted)]">
            {donationCount} don{donationCount !== 1 ? "s" : ""} &middot;{" "}
            {livesSaved} vies sauvees
          </p>
        </div>
      )}

      {tab === "education" && (
        <div className="text-center">
          <p className="text-[var(--color-text-muted)]">
            Retrouvez toutes les informations sur le don du sang dans nos guides :
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/guide-don-du-sang" className="rounded-lg bg-[var(--color-surface)] px-4 py-3 font-medium hover:bg-[var(--color-surface-2)]">
              Guide du don du sang
            </Link>
            <Link href="/groupes-sanguins" className="rounded-lg bg-[var(--color-surface)] px-4 py-3 font-medium hover:bg-[var(--color-surface-2)]">
              Groupes sanguins
            </Link>
            <Link href="/mythes-et-realites" className="rounded-lg bg-[var(--color-surface)] px-4 py-3 font-medium hover:bg-[var(--color-surface-2)]">
              Mythes et realites
            </Link>
          </div>
        </div>
      )}

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg">
          {([
            { key: "dashboard" as AppTab, icon: <Heart className="h-5 w-5" />, label: "Accueil" },
            { key: "profile" as AppTab, icon: <User className="h-5 w-5" />, label: "Profil" },
            { key: "education" as AppTab, icon: <BookOpen className="h-5 w-5" />, label: "Infos" },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex flex-1 flex-col items-center gap-0.5 py-3 text-xs transition-colors"
              style={{
                color: tab === t.key ? "var(--color-primary)" : "var(--color-text-muted)",
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function OnboardingView() {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const setProfile = useAppStore((s) => s.setProfile);

  const handleStart = () => {
    setProfile({
      id: crypto.randomUUID?.() ?? Math.random().toString(36),
      bloodType: "unknown",
      sex: "male",
      onboardingCompleted: true,
      notificationsEnabled: false,
      createdAt: new Date().toISOString(),
    });
    completeOnboarding();
  };

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <Logo size={64} />
      <h1 className="mb-2 mt-6 text-3xl font-extrabold">
        <span className="text-[var(--color-text)]">life</span><span className="text-[var(--color-primary)]">drop</span>
      </h1>
      <p className="mb-2 text-lg text-[var(--color-text-muted)]">
        Chaque don compte. Chaque vie aussi.
      </p>
      <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-4 py-2 text-sm">
        <Heart className="h-4 w-4 text-[var(--color-primary)]" />
        <span className="text-[var(--color-text-muted)]">
          <strong className="text-[var(--color-primary)]">3 vies</strong>{" "}
          potentiellement sauvees par don
        </span>
      </div>
      <button
        onClick={handleStart}
        className="rounded-xl bg-[var(--color-primary)] px-8 py-3.5 text-base font-bold text-white transition-opacity hover:opacity-90"
      >
        Commencer l&apos;aventure
      </button>
      <p className="mt-4 text-xs text-[var(--color-text-muted)]">
        100% gratuit &middot; Sans publicite
      </p>
    </div>
  );
}
