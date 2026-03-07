"use client";

import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { Logo } from "@web/components/ui/Logo";
import { useInstallPrompt } from "@web/lib/pwa";

const DISMISSED_KEY = "pwa-banner-dismissed";

export function PWAInstallBanner() {
  const { isInstallable, isInstalled, install } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(true); // start hidden
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed recently (24h cooldown)
    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - Number(dismissedAt);
      if (elapsed < 24 * 60 * 60 * 1000) return;
    }
    setDismissed(false);
    // Small delay so it animates in
    const t = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(t);
  }, []);

  if (isInstalled || dismissed || !isInstallable) return null;

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setTimeout(() => setDismissed(true), 300);
  };

  const handleInstall = async () => {
    await install();
    setVisible(false);
    setTimeout(() => setDismissed(true), 300);
  };

  return (
    <div
      className="fixed bottom-20 left-3 right-3 z-40 md:hidden transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <div className="overflow-hidden rounded-2xl border border-(--color-primary)/20 bg-(--color-bg) shadow-2xl shadow-black/40">
        {/* Gradient accent line */}
        <div className="h-1 bg-linear-to-r from-[#f87171] to-[#fb923c]" />

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Logo + icon */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--color-primary)/10">
              <Logo size={28} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-sm font-extrabold">
                  <span className="text-(--color-text)">life</span>
                  <span className="text-(--color-primary)">drop</span>
                </span>
                <Smartphone className="h-3.5 w-3.5 text-(--color-text-muted)" />
              </div>
              <p className="text-xs text-(--color-text-muted) leading-relaxed">
                Installe l&apos;appli pour un acces rapide et des notifications de rappel.
              </p>
            </div>

            {/* Close */}
            <button
              onClick={handleDismiss}
              className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-(--color-surface) text-(--color-text-muted) hover:text-(--color-text)"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Install button */}
          <button
            onClick={handleInstall}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-(--color-primary) py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.97]"
          >
            <Download className="h-4 w-4" />
            Installer LifeDrop
          </button>
        </div>
      </div>
    </div>
  );
}
