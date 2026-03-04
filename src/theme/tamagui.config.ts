// ============================================================
// src/theme/tamagui.config.ts  — LifeDrop Design System
// Palette sombre : rouge corail #f87171 → orange #fb923c
// Background #0f0f0f, surfaces #1a1a1a / #222222
// ============================================================

import { config as defaultConfig } from "@tamagui/config";
import { createInterFont } from "@tamagui/font-inter";
import { createTamagui, createTokens } from "tamagui";

const interFont = createInterFont();

// ─── Tokens de design ────────────────────────────────────────
const tokens = createTokens({
  ...defaultConfig.tokens,
  color: {
    ...defaultConfig.tokens.color,
    primary: "#f87171",
    primaryLight: "#fca5a5",
    primaryDark: "#ef4444",
    accent: "#fb923c",
    accentLight: "#fdba74",
    bg: "#0f0f0f",
    surface: "#1a1a1a",
    surface2: "#222222",
    border: "#2a2a2a",
    textPrimary: "#f5f5f5",
    textMuted: "#888888",
    textFaint: "#444444",
    success: "#34d399",
    warning: "#fbbf24",
    info: "#60a5fa",
    bronze: "#cd7f32",
    silver: "#c0c0c0",
    gold: "#fbbf24",
    platinum: "#f87171",
    white: "#ffffff",
    black: "#000000",
  },
  space: {
    ...defaultConfig.tokens.space,
    0: 0,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    true: 16,
  },
  radius: {
    ...defaultConfig.tokens.radius,
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    full: 9999,
    true: 16,
  },
});

// ─── Thème sombre (thème par défaut de LifeDrop) ─────────────
const darkTheme = {
  background: "#0f0f0f",
  backgroundStrong: "#000000",
  backgroundSoft: "#1a1a1a",
  backgroundHover: "#222222",
  backgroundPress: "#2a2a2a",
  backgroundFocus: "#2a2a2a",
  borderColor: "#2a2a2a",
  borderColorHover: "#3a3a3a",
  color: "#f5f5f5",
  colorSubtle: "#aaaaaa",
  colorMuted: "#888888",
  colorFaint: "#444444",
  placeholderColor: "#555555",
  outlineColor: "#f87171",
  // Marque
  primary: "#f87171",
  primaryLight: "#fca5a5",
  primaryDark: "#ef4444",
  accent: "#fb923c",
  accentLight: "#fdba74",
  // Surface
  surface: "#1a1a1a",
  surface2: "#222222",
  border: "#2a2a2a",
  // Statuts
  success: "#34d399",
  successBg: "rgba(52,211,153,0.12)",
  warning: "#fbbf24",
  warningBg: "rgba(251,191,36,0.12)",
  error: "#f87171",
  errorBg: "rgba(248,113,113,0.12)",
  shadowColor: "rgba(0,0,0,0.5)",
  shadowGlow: "rgba(248,113,113,0.25)",
};

// ─── Thème clair (fallback) ───────────────────────────────────
const lightTheme = {
  ...darkTheme,
  background: "#ffffff",
  backgroundStrong: "#f5f5f5",
  backgroundSoft: "#fef2f2",
  backgroundHover: "#fee2e2",
  backgroundPress: "#fecaca",
  backgroundFocus: "#fecaca",
  borderColor: "#e5e7eb",
  borderColorHover: "#d1d5db",
  color: "#111111",
  colorSubtle: "#374151",
  colorMuted: "#6b7280",
  colorFaint: "#9ca3af",
  placeholderColor: "#9ca3af",
  surface: "#ffffff",
  surface2: "#f9fafb",
  border: "#e5e7eb",
  shadowColor: "rgba(0,0,0,0.08)",
  shadowGlow: "rgba(239,68,68,0.20)",
};

// ─── Export config ────────────────────────────────────────────
const config = createTamagui({
  ...defaultConfig,
  fonts: { heading: interFont, body: interFont, mono: interFont },
  tokens,
  themes: { light: lightTheme, dark: darkTheme },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animations: defaultConfig.animations as any,
  media: defaultConfig.media,
  shorthands: defaultConfig.shorthands,
  settings: {
    defaultFont: "body",
    shouldAddPrefersColorThemes: true,
    themeClassNameOnRoot: true,
  },
});

export type AppConfig = typeof config;
declare module "tamagui" {
  // @ts-ignore — pattern officiel Tamagui, référence circulaire attendue
  interface TamaguiCustomConfig extends AppConfig {}
}
export default config;
