"use client";

import { useState } from "react";
import { Droplets, Users, Heart } from "lucide-react";
import { DidYouKnowTab } from "./DidYouKnowTab";
import { MythsTab } from "./MythsTab";
import { BloodTypeTab } from "./BloodTypeTab";

type SubTab = "facts" | "myths" | "bloodtype";

const SUB_TABS: { key: SubTab; label: string }[] = [
  { key: "facts", label: "Saviez-vous ?" },
  { key: "myths", label: "Mythes" },
  { key: "bloodtype", label: "Mon groupe" },
];

const STATS = [
  { value: "10 000", label: "dons/jour necessaires", icon: <Droplets className="h-4 w-4 text-[var(--color-primary)]" /> },
  { value: "4%", label: "de la population donne", icon: <Users className="h-4 w-4 text-[var(--color-accent)]" /> },
  { value: "3", label: "vies par don", icon: <Heart className="h-4 w-4 text-[var(--color-primary)]" /> },
];

export function EducationTab() {
  const [subTab, setSubTab] = useState<SubTab>("facts");

  return (
    <div className="px-4 pt-6 md:px-8 md:pt-8 animate-[fadeInUp_400ms_ease-out]">
      <h2 className="mb-1 text-2xl font-extrabold">Informations</h2>
      <p className="mb-5 text-sm text-[var(--color-text-muted)]">
        Tout savoir sur le don du sang
      </p>

      {/* National stats */}
      <div className="mb-6 grid grid-cols-3 gap-2">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-center">
            <div className="mx-auto mb-1">{s.icon}</div>
            <div className="text-lg font-extrabold">{s.value}</div>
            <div className="text-[10px] text-[var(--color-text-muted)]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div className="mb-5 flex gap-1 rounded-xl bg-[var(--color-surface)] p-1 md:max-w-md">
        {SUB_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setSubTab(t.key)}
            className="flex-1 rounded-lg py-2 text-xs font-bold transition-all"
            style={{
              backgroundColor: subTab === t.key ? "var(--color-primary)" : "transparent",
              color: subTab === t.key ? "white" : "var(--color-text-muted)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === "facts" && <DidYouKnowTab />}
      {subTab === "myths" && <MythsTab />}
      {subTab === "bloodtype" && <BloodTypeTab />}
    </div>
  );
}
