"use client";

import { useState } from "react";
import { Droplets, Users, Heart, BookOpen, HelpCircle, Dna } from "lucide-react";
import { DidYouKnowTab } from "./DidYouKnowTab";
import { MythsTab } from "./MythsTab";
import { BloodTypeTab } from "./BloodTypeTab";

type SubTab = "facts" | "myths" | "bloodtype";

const SUB_TABS: { key: SubTab; label: string; icon: React.ReactNode }[] = [
  { key: "facts", label: "Saviez-vous ?", icon: <BookOpen className="h-4 w-4" /> },
  { key: "myths", label: "Mythes", icon: <HelpCircle className="h-4 w-4" /> },
  { key: "bloodtype", label: "Mon groupe", icon: <Dna className="h-4 w-4" /> },
];

const STATS = [
  { value: "10 000", label: "dons/jour necessaires", icon: <Droplets className="h-5 w-5 text-(--color-primary)" /> },
  { value: "4%", label: "de la population donne", icon: <Users className="h-5 w-5 text-(--color-accent)" /> },
  { value: "3", label: "vies par don", icon: <Heart className="h-5 w-5 text-(--color-primary)" /> },
];

export function EducationTab() {
  const [subTab, setSubTab] = useState<SubTab>("facts");

  return (
    <div className="px-4 pt-6 md:px-8 md:pt-8 animate-[fadeInUp_400ms_ease-out]">
      <h2 className="mb-1 text-2xl font-extrabold">Informations</h2>
      <p className="mb-5 text-sm text-(--color-text-muted)">
        Tout savoir sur le don du sang
      </p>

      {/* National stats */}
      <div className="mb-6 grid grid-cols-3 gap-2.5">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 text-center">
            <div className="mx-auto mb-2">{s.icon}</div>
            <div className="text-2xl font-extrabold">{s.value}</div>
            <div className="text-[11px] text-(--color-text-muted) mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div className="mb-5 flex gap-1 rounded-2xl bg-(--color-surface) p-1.5 md:max-w-lg">
        {SUB_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold transition-all"
            style={{
              backgroundColor: subTab === t.key ? "var(--color-primary)" : "transparent",
              color: subTab === t.key ? "white" : "var(--color-text-muted)",
            }}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden text-xs">{t.label}</span>
          </button>
        ))}
      </div>

      {subTab === "facts" && <DidYouKnowTab />}
      {subTab === "myths" && <MythsTab />}
      {subTab === "bloodtype" && <BloodTypeTab />}
    </div>
  );
}
