// ============================================================
// src/components/ui/GradientButton.tsx
// Bouton principal avec dégradé corail → orange
// ============================================================

import * as Haptics from "expo-haptics";
import { ReactNode } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function GradientButton({
  label,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: GradientButtonProps) {
  const handlePress = async () => {
    if (disabled || loading) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const containerStyle: ViewStyle[] = [
    styles.base,
    styles[`size_${size}`],
    styles[`variant_${variant}`],
    fullWidth ? styles.fullWidth : {},
    disabled || loading ? styles.disabled : {},
    style ?? {},
  ];

  const textStyle: TextStyle[] = [
    styles.label,
    styles[`label_${size}`],
    styles[`label_${variant}`],
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled || loading}
      style={containerStyle}
      accessibilityLabel={loading ? "Chargement en cours" : label}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#ffffff" : "#f87171"}
          size="small"
        />
      ) : (
        <View style={styles.row}>
          {!!icon && icon}
          <Text style={textStyle}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.45,
  },

  // ── Tailles ─────────────────────────────────────────────
  size_sm: { paddingHorizontal: 18, paddingVertical: 8 },
  size_md: { paddingHorizontal: 28, paddingVertical: 13 },
  size_lg: {
    paddingHorizontal: 0,
    paddingVertical: 17,
    borderRadius: 20,
    width: "100%",
  },

  // ── Variantes ───────────────────────────────────────────
  variant_primary: {
    // dégradé simulé par une teinte proche (LinearGradient nécessite expo-linear-gradient)
    backgroundColor: "#f87171",
    shadowColor: "#f87171",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  variant_secondary: {
    backgroundColor: "#222222",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  variant_ghost: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#f87171",
  },
  variant_danger: {
    backgroundColor: "rgba(248,113,113,0.15)",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.3)",
  },

  // ── Textes ──────────────────────────────────────────────
  label: {
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  label_sm: { fontSize: 12 },
  label_md: { fontSize: 14 },
  label_lg: { fontSize: 15, fontWeight: "800", letterSpacing: 0.4 },

  label_primary: { color: "#ffffff" },
  label_secondary: { color: "#f5f5f5" },
  label_ghost: { color: "#f87171" },
  label_danger: { color: "#f87171" },

});
