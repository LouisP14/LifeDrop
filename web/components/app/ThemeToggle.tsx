"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@web/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <div className="flex items-center justify-between rounded-2xl border border-(--color-border) bg-(--color-surface) px-4 py-3.5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-accent)/10">
          {theme === "dark" ? (
            <Moon className="h-4.5 w-4.5 text-(--color-accent)" />
          ) : (
            <Sun className="h-4.5 w-4.5 text-(--color-accent)" />
          )}
        </div>
        <div>
          <p className="text-sm font-bold">
            {theme === "dark" ? "Mode sombre" : "Mode clair"}
          </p>
          <p className="text-xs text-(--color-text-muted)">
            {theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
          </p>
        </div>
      </div>
      <button
        onClick={toggle}
        role="switch"
        aria-checked={theme === "light"}
        aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
        className="relative h-7 w-12 shrink-0 rounded-full transition-colors focus:outline-2 focus:outline-(--color-primary)"
        style={{
          backgroundColor: theme === "light" ? "var(--color-primary)" : "var(--color-border)",
        }}
      >
        <span
          className="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-all duration-200"
          style={{
            transform: theme === "light" ? "translateX(20px)" : "translateX(0)",
          }}
        />
      </button>
    </div>
  );
}
