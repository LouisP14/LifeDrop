"use client";

import { useState } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import { MYTHS_AND_FACTS } from "@shared/content/myths";

export function MythsTab() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {MYTHS_AND_FACTS.map((m) => {
        const isOpen = expanded === m.id;
        return (
          <div
            key={m.id}
            className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
          >
            <button
              onClick={() => setExpanded(isOpen ? null : m.id)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: m.verdict ? "var(--color-green)" : "var(--color-primary)" }}
              >
                {m.verdict ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
              </span>
              <span className="flex-1 text-sm font-medium">{m.myth}</span>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
              />
            </button>
            {isOpen && (
              <div className="border-t border-[var(--color-border)] px-4 pb-4 pt-3 animate-[fadeInUp_200ms_ease-out]">
                <span
                  className="mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                  style={{ backgroundColor: m.verdict ? "var(--color-green)" : "var(--color-primary)" }}
                >
                  {m.verdict ? "VRAI" : "FAUX"}
                </span>
                <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
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
