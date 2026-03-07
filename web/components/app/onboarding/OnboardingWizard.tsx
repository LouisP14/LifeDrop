"use client";

import { useState } from "react";
import { WelcomeStep } from "./WelcomeStep";
import { BloodTypeStep } from "./BloodTypeStep";
import { LastDonationStep } from "./LastDonationStep";
import { NotificationsStep } from "./NotificationsStep";

export function OnboardingWizard() {
  const [step, setStep] = useState(0);

  const next = () => setStep((s) => Math.min(s + 1, 3));

  return (
    <div className="mx-auto min-h-screen max-w-lg">
      {step === 0 && <WelcomeStep onNext={next} />}
      {step === 1 && <BloodTypeStep onNext={next} />}
      {step === 2 && <LastDonationStep onNext={next} />}
      {step === 3 && <NotificationsStep />}
    </div>
  );
}
