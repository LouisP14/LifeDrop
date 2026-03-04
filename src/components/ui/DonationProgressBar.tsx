// ============================================================
// src/components/ui/DonationProgressBar.tsx
// Barre de progression vers le prochain niveau
// ============================================================

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import {
  getLevelConfig,
  getLevelProgress,
  getNextLevelConfig,
} from "../../utils/levels";

interface DonationProgressBarProps {
  donationCount: number;
}

export function DonationProgressBar({
  donationCount,
}: DonationProgressBarProps) {
  const current = getLevelConfig(donationCount);
  const next = getNextLevelConfig(donationCount);
  const progress = getLevelProgress(donationCount);

  const width = useSharedValue(0);

  React.useEffect(() => {
    width.value = withDelay(
      300,
      withTiming(progress, { duration: 900, easing: Easing.out(Easing.cubic) }),
    );
  }, [progress]);

  const animStyle = useAnimatedStyle(() => ({
    width: `${width.value}%` as `${number}%`,
  }));

  return (
    <View style={styles.container}>
      {/* Labels */}
      <View style={styles.row}>
        <Text style={styles.currentLabel}>
          Niveau {current.label} · {donationCount} don
          {donationCount > 1 ? "s" : ""}
        </Text>
        {next ? (
          <Text style={styles.nextLabel}>
            → {next.label} à {next.minDonations}
          </Text>
        ) : (
          <Text style={styles.nextLabel}>Niveau max 💎</Text>
        )}
      </View>

      {/* Piste */}
      <View style={styles.track}>
        <Animated.View style={[styles.fill, animStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 7 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  currentLabel: { fontSize: 11, color: "#aaaaaa", fontWeight: "600" },
  nextLabel: { fontSize: 11, color: "#888888" },
  track: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 9999,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    // dégradé simulé avec une couleur proche
    backgroundColor: "#f87171",
    borderRadius: 9999,
  },
});
