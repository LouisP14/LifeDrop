"use client";

import { useState } from "react";
import { Heart, User, BookOpen, Trophy, Building2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@web/lib/store";
import { useAuth } from "@web/hooks/useAuth";
import { Logo } from "@web/components/ui/Logo";
import { BottomTabBar } from "./BottomTabBar";
import { OnboardingWizard } from "./onboarding/OnboardingWizard";
import { DashboardTab } from "./dashboard/DashboardTab";
import { ProfileTab } from "./profile/ProfileTab";
import { EducationTab } from "./education/EducationTab";
import { LeaderboardTab } from "./leaderboard/LeaderboardTab";
import { CentersTab } from "./centers/CentersTab";
import { RegisterDonationModal } from "./donation/RegisterDonationModal";
import { DonationSuccessModal } from "./donation/DonationSuccessModal";
import { PWAInstallBanner } from "./PWAInstallBanner";
import type { DonationType } from "@shared/types";

type AppTab = "dashboard" | "profile" | "education" | "leaderboard" | "centers";

interface SuccessData {
  livesSaved: number;
  newBadgeIds: string[];
  donationType: DonationType;
}

const SIDEBAR_TABS: { key: AppTab; icon: React.ReactNode; label: string }[] = [
  { key: "dashboard", icon: <Heart className="h-5 w-5" />, label: "Accueil" },
  { key: "leaderboard", icon: <Trophy className="h-5 w-5" />, label: "Classement" },
  { key: "profile", icon: <User className="h-5 w-5" />, label: "Profil" },
  { key: "centers", icon: <Building2 className="h-5 w-5" />, label: "Centres" },
  { key: "education", icon: <BookOpen className="h-5 w-5" />, label: "Infos" },
];

export function AppShell() {
  const isOnboardingCompleted = useAppStore((s) => s.isOnboardingCompleted);
  const profile = useAppStore((s) => s.profile);
  const resetApp = useAppStore((s) => s.resetApp);
  const { signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AppTab>("dashboard");
  const [modal, setModal] = useState<null | "registerDonation" | "donationSuccess">(null);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  if (!isOnboardingCompleted) {
    return <OnboardingWizard />;
  }

  const openRegisterDonation = () => setModal("registerDonation");

  const onDonationSuccess = (data: SuccessData) => {
    setSuccessData(data);
    setModal("donationSuccess");
  };

  const closeModal = () => {
    setModal(null);
    setSuccessData(null);
  };

  const handleSignOut = async () => {
    resetApp();
    await signOut();
    router.push("/");
  };

  const initials = profile?.name
    ? profile.name.slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="md:flex md:min-h-[calc(100vh-64px)]">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex md:w-60 md:shrink-0 md:flex-col md:border-r md:border-(--color-border) md:bg-(--color-surface)/50">
        {/* User card — click to go to profile */}
        <button
          onClick={() => setActiveTab("profile")}
          className="border-b border-(--color-border) p-5 text-left transition-colors hover:bg-(--color-surface)"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
              style={{ backgroundColor: "rgba(248,113,113,0.15)", color: "var(--color-primary)" }}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{profile?.name ?? "Donneur"}</p>
              <p className="text-xs text-(--color-text-muted)">
                {profile?.bloodType !== "unknown" ? profile?.bloodType : "Groupe inconnu"}
              </p>
            </div>
          </div>
        </button>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 p-3 pt-4">
          {SIDEBAR_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:bg-(--color-surface)"
              style={{
                backgroundColor: activeTab === t.key ? "rgba(248,113,113,0.1)" : undefined,
                color: activeTab === t.key ? "var(--color-primary)" : "var(--color-text-muted)",
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>

        {/* Sign out at bottom */}
        <div className="border-t border-(--color-border) p-3">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-(--color-text-muted) transition-colors hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            Se deconnecter
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 pb-20 md:pb-8 md:overflow-y-auto">
        <div className="mx-auto max-w-lg md:max-w-4xl">
          {activeTab === "dashboard" && (
            <DashboardTab
              onRegisterDonation={openRegisterDonation}
              onTabChange={setActiveTab}
            />
          )}
          {activeTab === "leaderboard" && <LeaderboardTab />}
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "centers" && <CentersTab />}
          {activeTab === "education" && <EducationTab />}
        </div>
      </div>

      {/* Bottom tab bar — mobile only */}
      <div className="md:hidden">
        <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* PWA install banner — mobile only */}
      <PWAInstallBanner />

      {modal === "registerDonation" && (
        <RegisterDonationModal
          onClose={closeModal}
          onSuccess={onDonationSuccess}
        />
      )}
      {modal === "donationSuccess" && successData && (
        <DonationSuccessModal
          data={successData}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
