// ============================================================
// src/screens/onboarding/NotificationsSetupScreen.tsx
// Écran 4/4 — Activation des notifications push
// ============================================================

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaView, StyleSheet, Switch, Text, View } from "react-native";
import { GradientButton } from "../../components/ui/GradientButton";
import type { NotificationsSetupScreenProps } from "../../navigation/types";
import { notificationService } from "../../services/NotificationService";
import { useAppStore } from "../../store/useAppStore";

export function NotificationsSetupScreen({
  navigation: _navigation,
}: NotificationsSetupScreenProps) {
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const updateProfile = useAppStore((s) => s.updateProfile);

  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    setLoading(true);

    if (enabled) {
      const granted = await notificationService.requestPermission();
      updateProfile({ notificationsEnabled: granted });
    } else {
      updateProfile({ notificationsEnabled: false });
    }

    completeOnboarding();
    setLoading(false);
    // La navigation est automatique via le store (isOnboardingCompleted → Main)
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Progress */}
      <View style={styles.progressRow}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.dot, styles.dotActive]} />
        ))}
      </View>

      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.illustrationWrap}>
          <Ionicons name="notifications-outline" size={72} color="#f87171" />
        </View>

        {/* Texte */}
        <View style={styles.textBlock}>
          <Text style={styles.step}>Étape 3 sur 3</Text>
          <Text style={styles.title}>Rappels{"\n"}intelligents</Text>
          <Text style={styles.subtitle}>
            LifeDrop calcule exactement quand tu peux redonner et t'avertit au
            bon moment. Zéro spam — une seule notif par délai respecté.
          </Text>
        </View>

        {/* Toggle */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleLeft}>
            <Text style={styles.toggleTitle}>Activer les rappels</Text>
            <Text style={styles.toggleSub}>
              Notification unique à la fin du délai légal
            </Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: "#2a2a2a", true: "rgba(248,113,113,0.5)" }}
            thumbColor={enabled ? "#f87171" : "#555555"}
            ios_backgroundColor="#2a2a2a"
          />
        </View>

        {/* Exemple de notification */}
        {enabled && (
          <View style={styles.notifPreview}>
            <View style={styles.notifIcon}>
              <MaterialCommunityIcons
                name="needle"
                size={18}
                color="#f87171"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.notifTitle}>Tu peux à nouveau donner !</Text>
              <Text style={styles.notifBody}>
                Les stocks ont besoin de toi. Prends RDV dès maintenant.
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <GradientButton
          label="Commencer LifeDrop"
          onPress={handleFinish}
          size="lg"
          icon={<Ionicons name="rocket-outline" size={18} color="#ffffff" />}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  progressRow: { flexDirection: "row", gap: 6, marginTop: 16, marginBottom: 8 },
  dot: { flex: 1, height: 3, borderRadius: 9999, backgroundColor: "#2a2a2a" },
  dotActive: { backgroundColor: "#f87171" },

  content: { flex: 1, justifyContent: "center", gap: 28 },

  illustrationWrap: { alignItems: "center" },

  textBlock: { gap: 8 },
  step: {
    fontSize: 12,
    color: "#888888",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  title: { fontSize: 30, fontWeight: "800", color: "#f5f5f5", lineHeight: 38 },
  subtitle: { fontSize: 14, color: "#888888", lineHeight: 22 },

  toggleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  toggleLeft: { flex: 1, gap: 3 },
  toggleTitle: { fontSize: 15, fontWeight: "700", color: "#f5f5f5" },
  toggleSub: { fontSize: 12, color: "#888888" },

  notifPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderLeftWidth: 3,
    borderLeftColor: "#f87171",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  notifIcon: {
    width: 42,
    height: 42,
    borderRadius: 9999,
    backgroundColor: "rgba(248,113,113,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  notifTitle: { fontSize: 13, fontWeight: "700", color: "#f5f5f5" },
  notifBody: { fontSize: 11, color: "#888888", marginTop: 3, lineHeight: 16 },

  footer: { marginTop: "auto" },
});
