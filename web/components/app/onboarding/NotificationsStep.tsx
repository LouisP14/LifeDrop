"use client";

import { useState } from "react";
import { Bell, Rocket } from "lucide-react";
import { useAppStore } from "@web/lib/store";
import { ProgressDots } from "../ProgressDots";

export function NotificationsStep() {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const [enabled, setEnabled] = useState(false);

  const handleFinish = async () => {
    if (enabled && "Notification" in window) {
      const permission = await Notification.requestPermission();
      updateProfile({ notificationsEnabled: permission === "granted" });
    }
    completeOnboarding();
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-8 animate-[fadeInUp_400ms_ease-out]">
      <ProgressDots total={4} current={3} />

      <div className="mt-12 flex h-20 w-20 items-center justify-center rounded-full bg-(--color-primary)/10">
        <Bell className="h-10 w-10 text-(--color-primary)" />
      </div>

      <h2 className="mb-2 mt-6 text-2xl font-extrabold text-center">
        Rester informe
      </h2>
      <p className="mb-8 text-center text-sm text-(--color-text-muted)">
        Recois un rappel quand tu es a nouveau eligible pour donner.
      </p>

      {/* Toggle */}
      <button
        onClick={() => setEnabled(!enabled)}
        className="mb-4 flex w-full items-center justify-between rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-4"
      >
        <span className="text-sm font-medium">Activer les rappels</span>
        <div
          className="relative h-7 w-12 rounded-full transition-colors duration-200"
          style={{ backgroundColor: enabled ? "var(--color-primary)" : "var(--color-border)" }}
        >
          <div
            className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200"
            style={{ transform: enabled ? "translateX(22px)" : "translateX(2px)" }}
          />
        </div>
      </button>

      {enabled && (
        <div className="mb-4 w-full animate-[fadeInUp_200ms_ease-out] rounded-xl border border-(--color-border) bg-(--color-surface) p-4">
          <p className="text-xs text-(--color-text-muted)">
            <strong className="text-(--color-text)">Apercu :</strong>{" "}
            &quot;Tu es a nouveau eligible pour donner du sang ! Chaque don peut sauver 3 vies.&quot;
          </p>
        </div>
      )}

      <div className="mt-auto w-full">
        <button
          onClick={handleFinish}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--color-primary) py-3.5 text-base font-bold text-white transition-all hover:opacity-90 active:scale-95"
        >
          <Rocket className="h-5 w-5" />
          Commencer LifeDrop
        </button>
      </div>
    </div>
  );
}
