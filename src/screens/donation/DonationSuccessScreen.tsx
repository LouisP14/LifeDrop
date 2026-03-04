// ============================================================
// src/screens/donation/DonationSuccessScreen.tsx
// Écran plein écran de confirmation de don
// Animation d'impact + affichage des nouveaux badges
// ============================================================

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BADGES_CATALOG } from "../../constants";
import type { DonationSuccessScreenProps } from "../../navigation/types";

export function DonationSuccessScreen({
  navigation,
  route,
}: DonationSuccessScreenProps) {
  const { livesSaved, newBadges, donationType } = route.params;

  // Animations
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    // Vibration de succès
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const newlyUnlocked = BADGES_CATALOG.filter((b) => newBadges.includes(b.id));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Décors de fond */}
      <View style={styles.bgDecor1} />
      <View style={styles.bgDecor2} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Icône animée */}
        <Animated.View
          style={[
            styles.iconWrap,
            { transform: [{ scale: scaleAnim }], opacity: opacAnim },
          ]}
        >
          <MaterialCommunityIcons name="needle" size={52} color="#f87171" />
        </Animated.View>

        {/* Message principal */}
        <Animated.View
          style={[
            styles.textBlock,
            { opacity: opacAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.title}>Don enregistré !</Text>
          <Text style={styles.impact}>
            Aujourd'hui ton don peut potentiellement sauver
          </Text>
          <Text style={styles.lives}>{livesSaved}</Text>
          <Text style={styles.livesLabel}>vies au total</Text>
          <Text style={styles.sub}>
            Merci. Ton engagement compte vraiment.
          </Text>
        </Animated.View>

        {/* Nouveaux badges débloqués */}
        {newlyUnlocked.length > 0 && (
          <Animated.View style={[styles.badgeSection, { opacity: opacAnim }]}>
            <View style={styles.badgeSectionTitleRow}>
              <MaterialCommunityIcons
                name="medal-outline"
                size={18}
                color="#fbbf24"
              />
              <Text style={styles.badgeSectionTitle}>
                Nouveau{newlyUnlocked.length > 1 ? "x" : ""} badge
                {newlyUnlocked.length > 1 ? "s" : ""} débloqué
                {newlyUnlocked.length > 1 ? "s" : ""} !
              </Text>
            </View>
            {newlyUnlocked.map((b) => (
              <View key={b.id} style={styles.badgeCard}>
                <MaterialCommunityIcons
                  name={b.icon as any}
                  size={28}
                  color="#f87171"
                />
                <View>
                  <Text style={styles.badgeName}>{b.label}</Text>
                  <Text style={styles.badgeDesc}>{b.description}</Text>
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Prochain rappel */}
        <View style={styles.reminderCard}>
          <Ionicons
            name="notifications-outline"
            size={20}
            color="#888888"
          />
          <Text style={styles.reminderText}>
            Nous te rappellerons quand tu pourras donner à nouveau.
          </Text>
        </View>

        {/* CTAs */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate("Main")}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Retour à l'accueil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() =>
              navigation.navigate("ShareImpact", {
                donationType,
                livesSaved,
              })
            }
            activeOpacity={0.8}
          >
            <View style={styles.btnSecondaryInner}>
              <Ionicons name="share-outline" size={16} color="#f5f5f5" />
              <Text style={styles.btnSecondaryText}>Partager mon impact</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },

  bgDecor1: {
    position: "absolute",
    top: -100,
    left: -100,
    width: 350,
    height: 350,
    borderRadius: 175,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.1)",
  },
  bgDecor2: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.08)",
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
    gap: 28,
  },

  iconWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(248,113,113,0.15)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#f87171",
    shadowOpacity: 0.4,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
  },

  textBlock: { alignItems: "center", gap: 8 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#f5f5f5",
    textAlign: "center",
  },
  impact: { fontSize: 15, color: "#888888", textAlign: "center" },
  lives: { fontSize: 80, fontWeight: "800", color: "#f87171", lineHeight: 88 },
  livesLabel: { fontSize: 18, color: "#888888" },
  sub: { fontSize: 14, color: "#888888", textAlign: "center", marginTop: 4 },

  badgeSection: { width: "100%", gap: 12 },
  badgeSectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  badgeSectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#f5f5f5",
    textAlign: "center",
  },
  badgeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.3)",
    borderRadius: 14,
    padding: 14,
  },
  badgeName: { fontSize: 15, fontWeight: "700", color: "#f5f5f5" },
  badgeDesc: { fontSize: 12, color: "#888888", lineHeight: 18, marginTop: 2 },

  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 14,
    padding: 14,
    width: "100%",
  },
  reminderText: { flex: 1, fontSize: 13, color: "#888888", lineHeight: 20 },

  actions: { width: "100%", gap: 12 },
  btnPrimary: {
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: "#f87171",
    alignItems: "center",
    shadowColor: "#f87171",
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
  },
  btnPrimaryText: { fontSize: 15, fontWeight: "800", color: "#ffffff" },
  btnSecondary: {
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    alignItems: "center",
  },
  btnSecondaryInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  btnSecondaryText: { fontSize: 14, fontWeight: "700", color: "#f5f5f5" },
});
