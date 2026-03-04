// ============================================================
// src/screens/profile/ShareProfileScreen.tsx
// Carte de partage visuelle (exportable en image)
// ============================================================

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";
import { useDonationStats } from "../../hooks/useDonationStats";
import { useAppStore } from "../../store/useAppStore";

export function ShareProfileScreen({ navigation }: any) {
  const profile = useAppStore((s) => s.profile);
  const stats = useDonationStats();
  const viewShotRef = useRef<ViewShot>(null);
  const [loading, setLoading] = useState(false);

  const handleCapture = async () => {
    setLoading(true);
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) {
        Alert.alert("Erreur", "Impossible de capturer l'image.");
        return;
      }

      // S'assurer que l'URI a le préfixe file://
      const fileUri = uri.startsWith("file://") ? uri : `file://${uri}`;

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "image/png",
          dialogTitle: "Partager mon impact LifeDrop",
        });
      } else {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
          await MediaLibrary.saveToLibraryAsync(fileUri);
          Alert.alert("Succès", "Image sauvegardée dans ta galerie !");
        }
      }
    } catch (e: any) {
      console.error("Partage échoué", e);
      Alert.alert("Partage échoué", e?.message ?? "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={20} color="#888888" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Partager mon impact</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.hint}>Voici ta carte de partage</Text>

        {/* ── Carte exportable ──────────────────────────── */}
        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
          <View style={styles.shareCard}>
            {/* Fond + décors */}
            <View style={styles.cardDecor1} />
            <View style={styles.cardDecor2} />

            {/* Logo + nom */}
            <View style={styles.cardHeader}>
              <View style={styles.cardLogoRow}>
                <MaterialCommunityIcons
                  name="water"
                  size={15}
                  color="#f87171"
                />
                <Text style={styles.cardLogo}>lifedrop</Text>
              </View>
              {profile?.name && (
                <Text style={styles.cardName}>{profile.name}</Text>
              )}
            </View>

            {/* Vies sauvées */}
            <Text style={styles.cardLives}>{stats.livesSaved}</Text>
            <Text style={styles.cardLivesLabel}>
              vie{stats.livesSaved !== 1 ? "s" : ""} potentiellement sauvée
              {stats.livesSaved !== 1 ? "s" : ""}
            </Text>

            {/* Mini stats */}
            <View style={styles.cardStats}>
              <View style={styles.cardStat}>
                <Text style={styles.cardStatVal}>{stats.count}</Text>
                <Text style={styles.cardStatLab}>dons</Text>
              </View>
              <View style={styles.cardStatDivider} />
              <View style={styles.cardStat}>
                <MaterialCommunityIcons
                  name={stats.levelConfig.icon as any}
                  size={20}
                  color="#f5f5f5"
                />
                <Text style={styles.cardStatLab}>
                  {stats.levelConfig.label}
                </Text>
              </View>
              {profile?.bloodType && profile.bloodType !== "unknown" && (
                <>
                  <View style={styles.cardStatDivider} />
                  <View style={styles.cardStat}>
                    <Text style={styles.cardStatVal}>{profile.bloodType}</Text>
                    <Text style={styles.cardStatLab}>groupe</Text>
                  </View>
                </>
              )}
            </View>

            {/* Badges */}
            {stats.unlockedBadges.length > 0 && (
              <View style={styles.cardBadges}>
                {stats.unlockedBadges.slice(0, 5).map((b) => (
                  <MaterialCommunityIcons
                    key={b.id}
                    name={b.icon as any}
                    size={22}
                    color="#f87171"
                  />
                ))}
              </View>
            )}

            {/* Footer */}
            <Text style={styles.cardFooter}>lifedrop.app · Don du sang</Text>
          </View>
        </ViewShot>

        {/* Actions */}
        <TouchableOpacity
          style={styles.shareBtn}
          onPress={handleCapture}
          disabled={loading}
          activeOpacity={0.85}
        >
          <View style={styles.shareBtnInner}>
            {loading ? (
              <MaterialCommunityIcons
                name="timer-sand"
                size={18}
                color="#ffffff"
              />
            ) : (
              <Ionicons name="share-outline" size={18} color="#ffffff" />
            )}
            <Text style={styles.shareBtnText}>
              {loading ? "Préparation…" : "Exporter & Partager"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 17, fontWeight: "800", color: "#f5f5f5" },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 20,
    alignItems: "center",
    paddingTop: 16,
  },
  hint: { fontSize: 13, color: "#888888" },

  shareCard: {
    width: 320,
    backgroundColor: "#1a1a1a",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    padding: 28,
    alignItems: "center",
    gap: 10,
    overflow: "hidden",
    position: "relative",
  },
  cardDecor1: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: "rgba(248,113,113,0.15)",
  },
  cardDecor2: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.1)",
  },
  cardHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLogoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardLogo: { fontSize: 15, fontWeight: "800", color: "#f5f5f5" },
  cardName: { fontSize: 13, color: "#888888", fontWeight: "600" },

  cardLives: {
    fontSize: 72,
    fontWeight: "800",
    color: "#f87171",
    lineHeight: 80,
  },
  cardLivesLabel: { fontSize: 14, color: "#888888", textAlign: "center" },

  cardStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
    marginTop: 6,
  },
  cardStat: { flex: 1, alignItems: "center", gap: 2 },
  cardStatVal: { fontSize: 20, fontWeight: "800", color: "#f5f5f5" },
  cardStatLab: {
    fontSize: 10,
    color: "#888888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardStatDivider: { width: 1, height: 32, backgroundColor: "#2a2a2a" },

  cardBadges: { flexDirection: "row", gap: 8, marginTop: 4 },

  cardFooter: {
    fontSize: 10,
    color: "#444444",
    letterSpacing: 0.5,
    marginTop: 4,
  },

  shareBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: "#f87171",
    alignItems: "center",
    shadowColor: "#f87171",
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
  },
  shareBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  shareBtnText: { fontSize: 15, fontWeight: "800", color: "#ffffff" },
});
