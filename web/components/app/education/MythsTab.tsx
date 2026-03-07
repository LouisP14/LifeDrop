"use client";

import { useState } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import { MYTHS_AND_FACTS } from "@shared/content/myths";

export function MythsTab() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-2.5">
      {MYTHS_AND_FACTS.map((m) => {
        const isOpen = expanded === m.id;
        return (
          <div
            key={m.id}
            className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface) transition-all hover:shadow-sm"
          >
            <button
              onClick={() => setExpanded(isOpen ? null : m.id)}
              className="flex w-full items-center gap-3 p-4 md:p-5 text-left"
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: m.verdict ? "var(--color-green)" : "var(--color-primary)" }}
              >
                {m.verdict ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </div>
              <span className="flex-1 text-sm md:text-base font-medium">{m.myth}</span>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-(--color-text-muted) transition-transform duration-200"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
              />
            </button>
            {isOpen && (
              <div className="border-t border-(--color-border) px-4 md:px-5 pb-4 md:pb-5 pt-3 animate-[fadeInUp_200ms_ease-out]">
                <span
                  className="mb-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
                  style={{ backgroundColor: m.verdict ? "var(--color-green)" : "var(--color-primary)" }}
                >
                  {m.verdict ? "VRAI" : "FAUX"}
                </span>
                <p className="text-sm leading-relaxed text-(--color-text-muted)">
                  {m.reality}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
