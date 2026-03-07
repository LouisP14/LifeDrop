"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Droplets,
  Heart,
  Flame,
  Award,
  Trophy,
  Diamond,
  Star,
  Globe,
  Shuffle,
  Zap,
  Clock,
  FlaskConical,
  MapPin,
  Pencil,
  CheckCircle,
  XCircle,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@web/lib/store";
import { useAuth } from "@web/hooks/useAuth";
import { useDonationStats } from "@web/hooks/useDonationStats";
import { DonationProgressBar } from "../dashboard/DonationProgressBar";
import { BloodTypeModal } from "./BloodTypeModal";
import { EditProfileModal } from "./EditProfileModal";
import { NotificationToggle } from "../NotificationToggle";
import { BLOOD_TYPE_INFO, BADGES_CATALOG, DONATION_TYPE_LABELS, DONATION_TYPE_COLORS, LIVES_PER_DONATION_TYPE } from "@shared/constants";
import type { DonationType } from "@shared/types";

const BADGE_ICONS: Record<string, React.ReactNode> = {
  water: <Droplets className="h-5 w-5" />,
  medal: <Award className="h-5 w-5" />,
  trophy: <Trophy className="h-5 w-5" />,
  "diamond-stone": <Diamond className="h-5 w-5" />,
  "shuffle-variant": <Shuffle className="h-5 w-5" />,
  fire: <Flame className="h-5 w-5" />,
  "lightning-bolt": <Zap className="h-5 w-5" />,
  heart: <Heart className="h-5 w-5" />,
  "cards-heart": <Heart className="h-5 w-5" />,
  star: <Star className="h-5 w-5" />,
  earth: <Globe className="h-5 w-5" />,
};

const TYPE_ICONS: Record<DonationType, React.ReactNode> = {
  whole_blood: <Droplets className="h-4 w-4" />,
  platelets: <Clock className="h-4 w-4" />,
  plasma: <FlaskConical className="h-4 w-4" />,
};

export function ProfileTab() {
  const profile = useAppStore((s) => s.profile);
  const donations = useAppStore((s) => s.donations);
  const badges = useAppStore((s) => s.badges);
  const resetApp = useAppStore((s) => s.resetApp);
  const { count, livesSaved, streak, levelConfig, nextLevel, progress } = useDonationStats();
  const [showBloodTypeModal, setShowBloodTypeModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    resetApp();
    await signOut();
    router.push("/");
  };

  const initials = profile?.name
    ? profile.name.slice(0, 2).toUpperCase()
    : "?";

  const bloodInfo = profile?.bloodType ? BLOOD_TYPE_INFO[profile.bloodType] : null;
  const unlockedBadges = badges.filter((b) => b.isUnlocked);
  const sortedDonations = [...donations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="px-4 pt-6 md:px-8 md:pt-8 animate-[fadeInUp_400ms_ease-out]">
      {/* Profile header card */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) p-5 md:p-7">
        <div className="flex flex-col items-center text-center md:flex-row md:items-center md:gap-6 md:text-left">
          <button
            onClick={() => setShowEditProfile(true)}
            className="mb-3 md:mb-0 flex h-18 w-18 md:h-22 md:w-22 items-center justify-center rounded-full text-2xl md:text-3xl font-extrabold shrink-0 transition-all hover:opacity-80 hover:shadow-lg"
            style={{ backgroundColor: "rgba(248,113,113,0.15)", color: "var(--color-primary)" }}
          >
            {initials}
          </button>
          <div className="flex-1 min-w-0">
            <button
              onClick={() => setShowEditProfile(true)}
              className="text-xl md:text-2xl font-extrabold hover:text-(--color-primary) transition-colors inline-flex items-center gap-2"
            >
              {profile?.name ?? "Donneur"}
              <Pencil className="h-4 w-4 text-(--color-text-muted)" />
            </button>
            <div className="mt-2 flex items-center justify-center md:justify-start gap-2">
              <button
                onClick={() => setShowBloodTypeModal(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-(--color-border) px-3.5 py-1.5 text-sm font-medium text-(--color-text-muted) hover:border-(--color-primary) hover:text-(--color-primary) transition-colors"
              >
                {profile?.bloodType !== "unknown" ? profile?.bloodType : "Groupe ?"}
                <Pencil className="h-3 w-3" />
              </button>
            </div>
          </div>
          {/* Stats — desktop inline */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { value: livesSaved, label: "vies", icon: <Heart className="h-5 w-5 text-(--color-primary)" /> },
              { value: count, label: `don${count !== 1 ? "s" : ""}`, icon: <Droplets className="h-5 w-5 text-(--color-primary)" /> },
              { value: streak, label: "streak", icon: <Flame className="h-5 w-5 text-(--color-accent)" /> },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  {stat.icon}
                  <span className="text-2xl font-extrabold">{stat.value}</span>
                </div>
                <div className="text-xs text-(--color-text-muted) mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats — mobile only */}
      <div className="mb-5 grid grid-cols-3 gap-2.5 md:hidden">
        {[
          { value: livesSaved, label: "vies sauvees", icon: <Heart className="h-5 w-5 text-(--color-primary)" /> },
          { value: count, label: `don${count !== 1 ? "s" : ""}`, icon: <Droplets className="h-5 w-5 text-(--color-primary)" /> },
          { value: streak, label: "streak", icon: <Flame className="h-5 w-5 text-(--color-accent)" /> },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-3.5 text-center">
            <div className="mx-auto mb-1.5">{stat.icon}</div>
            <div className="text-2xl font-extrabold">{stat.value}</div>
            <div className="text-[11px] text-(--color-text-muted)">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Level + Blood type — 2 cols on desktop */}
      <div className="md:grid md:grid-cols-2 md:gap-5 mb-5">
        <div className="mb-5 md:mb-0">
          <DonationProgressBar levelConfig={levelConfig} progress={progress} nextLevel={nextLevel} />
        </div>

        {/* Blood type info */}
        {bloodInfo && profile?.bloodType !== "unknown" ? (
          <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 md:p-5">
            <h3 className="mb-2.5 text-base font-bold">Groupe {profile?.bloodType}</h3>
            <p className="mb-3 text-sm text-(--color-text-muted)">{bloodInfo.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-(--color-green)">
                  <CheckCircle className="h-3.5 w-3.5" /> Peut recevoir de
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {bloodInfo.canReceiveFrom.map((bt) => (
                    <span key={bt} className="rounded-lg bg-(--color-green)/10 px-2 py-1 text-xs font-bold text-(--color-green)">
                      {bt}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-(--color-primary)">
                  <XCircle className="h-3.5 w-3.5" /> Peut donner a
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {bloodInfo.canDonateTo.map((bt) => (
                    <span key={bt} className="rounded-lg bg-(--color-primary)/10 px-2 py-1 text-xs font-bold text-(--color-primary)">
                      {bt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:block" />
        )}
      </div>

      {/* Badges + History — 2 cols on desktop */}
      <div className="md:grid md:grid-cols-2 md:gap-5">
        {/* Badges */}
        <div className="mb-5 md:mb-0">
          <h3 className="mb-3 text-base font-bold flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--color-primary)/10">
              <Award className="h-4 w-4 text-(--color-primary)" />
            </div>
            Badges
            <span className="text-sm font-normal text-(--color-text-muted)">
              {unlockedBadges.length}/{BADGES_CATALOG.length}
            </span>
          </h3>
          {unlockedBadges.length > 0 ? (
            <div className="grid grid-cols-4 gap-2.5">
              {unlockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-(--color-border) bg-(--color-surface) p-3 text-center transition-all hover:border-(--color-primary)/30 hover:shadow-sm"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "rgba(248,113,113,0.1)", color: "var(--color-primary)" }}
                  >
                    {BADGE_ICONS[badge.icon] ?? <Award className="h-5 w-5" />}
                  </div>
                  <span className="text-[10px] font-semibold leading-tight text-(--color-text-muted)">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-text-muted)/5">
                <Award className="h-7 w-7 text-(--color-text-muted)/30" />
              </div>
              <p className="text-sm text-(--color-text-muted)">
                Tes badges apparaitront ici apres ton premier don.
              </p>
            </div>
          )}
        </div>

        {/* Donation history */}
        <div className="mb-5 md:mb-0">
          <h3 className="mb-3 text-base font-bold flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--color-primary)/10">
              <Droplets className="h-4 w-4 text-(--color-primary)" />
            </div>
            Derniers dons
          </h3>
          {sortedDonations.length > 0 ? (
            <div className="space-y-2.5">
              {sortedDonations.map((d) => {
                const colors = DONATION_TYPE_COLORS[d.type];
                return (
                  <div
                    key={d.id}
                    className="flex items-center gap-3 rounded-2xl border p-3.5 transition-all hover:shadow-sm"
                    style={{ borderColor: colors.border, backgroundColor: colors.bg }}
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${colors.main}15`, color: colors.main }}
                    >
                      {TYPE_ICONS[d.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold">{DONATION_TYPE_LABELS[d.type].label}</p>
                      <p className="text-xs text-(--color-text-muted)">
                        {format(new Date(d.date), "d MMM yyyy", { locale: fr })}
                        {d.location && (
                          <span className="ml-1.5">
                            <MapPin className="inline h-3 w-3" /> {d.location}
                          </span>
                        )}
                      </p>
                    </div>
                    <span className="text-sm font-bold" style={{ color: colors.main }}>
                      {LIVES_PER_DONATION_TYPE[d.type]} {LIVES_PER_DONATION_TYPE[d.type] === 1 ? "vie" : "vies"}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-text-muted)/5">
                <Droplets className="h-7 w-7 text-(--color-text-muted)/30" />
              </div>
              <p className="text-sm text-(--color-text-muted)">
                Tes dons apparaitront ici.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="mt-5 mb-5">
        <NotificationToggle />
      </div>

      {/* Sign out — mobile only */}
      <button
        onClick={handleSignOut}
        className="mb-6 flex w-full items-center justify-center gap-2.5 rounded-2xl border border-(--color-border) py-3.5 text-sm font-medium text-(--color-text-muted) transition-all hover:border-red-500/50 hover:text-red-400 md:hidden"
      >
        <LogOut className="h-4 w-4" />
        Se deconnecter
      </button>

      {showBloodTypeModal && (
        <BloodTypeModal onClose={() => setShowBloodTypeModal(false)} />
      )}
      {showEditProfile && (
        <EditProfileModal onClose={() => setShowEditProfile(false)} />
      )}
    </div>
  );
}
