"use client";

import { useState } from "react";
import { Heart, User, BookOpen } from "lucide-react";
import { useAppStore } from "@web/lib/store";
import { BottomTabBar } from "./BottomTabBar";
import { OnboardingWizard } from "./onboarding/OnboardingWizard";
import { DashboardTab } from "./dashboard/DashboardTab";
import { ProfileTab } from "./profile/ProfileTab";
import { EducationTab } from "./education/EducationTab";
import { RegisterDonationModal } from "./donation/RegisterDonationModal";
import { DonationSuccessModal } from "./donation/DonationSuccessModal";
import type { DonationType } from "@shared/types";

type AppTab = "dashboard" | "profile" | "education";

interface SuccessData {
  livesSaved: number;
  newBadgeIds: string[];
  donationType: DonationType;
}

const SIDEBAR_TABS: { key: AppTab; icon: React.ReactNode; label: string }[] = [
  { key: "dashboard", icon: <Heart className="h-5 w-5" />, label: "Accueil" },
  { key: "profile", icon: <User className="h-5 w-5" />, label: "Profil" },
  { key: "education", icon: <BookOpen className="h-5 w-5" />, label: "Infos" },
];

export function AppShell() {
  const isOnboardingCompleted = useAppStore((s) => s.isOnboardingCompleted);
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

  return (
    <div className="md:flex md:min-h-[calc(100vh-64px)]">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex md:w-56 md:shrink-0 md:flex-col md:border-r md:border-(--color-border) md:bg-(--color-surface)">
        <nav className="flex flex-col gap-1 p-3 pt-6">
          {SIDEBAR_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all"
              style={{
                backgroundColor: activeTab === t.key ? "rgba(248,113,113,0.1)" : "transparent",
                color: activeTab === t.key ? "var(--color-primary)" : "var(--color-text-muted)",
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 pb-20 md:pb-6">
        <div className="mx-auto max-w-lg md:max-w-3xl">
          {activeTab === "dashboard" && (
            <DashboardTab
              onRegisterDonation={openRegisterDonation}
              onTabChange={setActiveTab}
            />
          )}
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "education" && <EducationTab />}
        </div>
      </div>

      {/* Bottom tab bar — mobile only */}
      <div className="md:hidden">
        <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

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
