// ============================================================
// src/components/ui/LevelBadge.tsx
// Badge de niveau gamification (Bronze → Platine)
// ============================================================

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import type { DonationLevel } from "../../types";
import { getLevelConfig } from "../../utils/levels";

interface LevelBadgeProps {
  level: DonationLevel;
  showLabel?: boolean;
  size?: "sm" | "md";
  style?: ViewStyle;
}

const LEVEL_STYLES: Record<
  DonationLevel,
  { bg: string; border: string; text: string }
> = {
  bronze: {
    bg: "rgba(180,120,60,0.18)",
    border: "rgba(180,120,60,0.35)",
    text: "#cd7f32",
  },
  silver: {
    bg: "rgba(180,180,180,0.14)",
    border: "rgba(180,180,180,0.28)",
    text: "#c0c0c0",
  },
  gold: {
    bg: "rgba(251,191,36,0.14)",
    border: "rgba(251,191,36,0.28)",
    text: "#fbbf24",
  },
  platinum: {
    bg: "rgba(248,113,113,0.14)",
    border: "rgba(248,113,113,0.28)",
    text: "#f87171",
  },
};

export function LevelBadge({
  level,
  showLabel = true,
  size = "md",
  style,
}: LevelBadgeProps) {
  const theme = LEVEL_STYLES[level];
  const config = {
    ...getLevelConfig(
      level === "bronze"
        ? 1
        : level === "silver"
          ? 4
          : level === "gold"
            ? 10
            : 20,
    ),
  };

  const containerStyle = [
    styles.base,
    size === "sm" ? styles.sm : styles.md,
    {
      backgroundColor: theme.bg,
      borderColor: theme.border,
    },
    style,
  ];

  const iconSize = size === "sm" ? 12 : 14;

  return (
    <View style={containerStyle}>
      <MaterialCommunityIcons
        name={config.icon as any}
        size={iconSize}
        color={theme.text}
      />
      {showLabel && (
        <Text
          style={[
            styles.label,
            { color: theme.text },
            size === "sm" ? styles.labelSm : styles.labelMd,
          ]}
        >
          {config.label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 9999,
    gap: 5,
  },
  sm: { paddingHorizontal: 10, paddingVertical: 4 },
  md: { paddingHorizontal: 14, paddingVertical: 5 },

  label: { fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" },
  labelSm: { fontSize: 10 },
  labelMd: { fontSize: 11 },
});
