// ============================================================
// src/screens/onboarding/WelcomeScreen.tsx
// Écran 1/4 — Splash d'accueil avec identité LifeDrop
// ============================================================

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Animated, SafeAreaView, StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";
import { GradientButton } from "../../components/ui/GradientButton";
import type { WelcomeScreenProps } from "../../navigation/types";

const LOGO_SIZE = 120;

export function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(40)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        delay: 150,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Décor en fond */}
      <View style={styles.bgDecor}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />
      </View>

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Logo SVG */}
        <View style={styles.logoWrap}>
          <Svg width={LOGO_SIZE} height={LOGO_SIZE} viewBox="0 0 120 120">
            <Defs>
              <LinearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#f87171" />
                <Stop offset="1" stopColor="#fb923c" />
              </LinearGradient>
            </Defs>
            {/* Anneau décoratif */}
            <Circle
              cx="60"
              cy="60"
              r="54"
              stroke="#f87171"
              strokeWidth="1.5"
              strokeDasharray="8 5"
              fill="none"
              opacity={0.4}
            />
            {/* Goutte de sang */}
            <Path
              d="M60 22 C60 22 34 52 34 68 C34 82 46 93 60 93 C74 93 86 82 86 68 C86 52 60 22 60 22Z"
              fill="url(#lg)"
            />
          </Svg>
        </View>

        {/* Texte */}
        <Text style={styles.appName}>lifedrop</Text>
        <Text style={styles.tagline}>
          Chaque don compte.{"\n"}Chaque vie aussi.
        </Text>

        {/* Statistique d'impact */}
        <View style={styles.impactCard}>
          <Text style={styles.impactNumber}>3</Text>
          <Text style={styles.impactLabel}>
            vies potentiellement sauvées{"\n"}par chaque don de sang
          </Text>
        </View>
      </Animated.View>

      {/* CTA */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <GradientButton
          label="Commencer l'aventure"
          onPress={() => navigation.navigate("BloodType")}
          size="lg"
          icon={
            <MaterialCommunityIcons name="needle" size={18} color="#ffffff" />
          }
        />
        <Text style={styles.free}>100% gratuit · Sans publicité</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  bgDecor: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
  },
  bgCircle1: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.12)",
  },
  bgCircle2: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.08)",
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },

  logoWrap: {
    marginBottom: 8,
    shadowColor: "#f87171",
    shadowOpacity: 0.4,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },

  appName: {
    fontSize: 42,
    fontWeight: "800",
    color: "#f5f5f5",
    letterSpacing: -1,
  },

  tagline: {
    fontSize: 17,
    color: "#888888",
    textAlign: "center",
    lineHeight: 26,
  },

  impactCard: {
    marginTop: 20,
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    paddingHorizontal: 32,
    paddingVertical: 20,
    alignItems: "center",
    gap: 6,
  },
  impactNumber: {
    fontSize: 56,
    fontWeight: "800",
    color: "#f87171",
  },
  impactLabel: {
    fontSize: 14,
    color: "#888888",
    textAlign: "center",
    lineHeight: 20,
  },

  footer: {
    gap: 12,
    alignItems: "center",
  },
  free: {
    fontSize: 12,
    color: "#444444",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
