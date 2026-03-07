"use client";

import { Heart, User, BookOpen } from "lucide-react";

type AppTab = "dashboard" | "profile" | "education";

const TABS: { key: AppTab; icon: React.ReactNode; label: string }[] = [
  { key: "dashboard", icon: <Heart className="h-5 w-5" />, label: "Accueil" },
  { key: "profile", icon: <User className="h-5 w-5" />, label: "Profil" },
  { key: "education", icon: <BookOpen className="h-5 w-5" />, label: "Infos" },
];

export function BottomTabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className="flex flex-1 flex-col items-center gap-0.5 py-3 text-xs transition-colors"
            style={{
              color: activeTab === t.key ? "var(--color-primary)" : "var(--color-text-muted)",
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
