"use client";

import { useState } from "react";
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
    <div className="mx-auto max-w-lg pb-20">
      {activeTab === "dashboard" && (
        <DashboardTab
          onRegisterDonation={openRegisterDonation}
          onTabChange={setActiveTab}
        />
      )}
      {activeTab === "profile" && <ProfileTab />}
      {activeTab === "education" && <EducationTab />}

      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />

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
