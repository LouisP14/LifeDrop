// ============================================================
// src/screens/donation/ShareImpactScreen.tsx
// Story-format : "J'ai sauvé X vies aujourd'hui"
// Capture ViewShot + partage via expo-sharing
// ============================================================

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
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

import {
  DONATION_TYPE_COLORS,
  DONATION_TYPE_LABELS,
  LIVES_PER_DONATION_TYPE,
} from "../../constants";
import type { ShareImpactScreenProps } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";

export function ShareImpactScreen({ navigation, route }: ShareImpactScreenProps) {
  const { donationType, livesSaved } = route.params;
  const profile = useAppStore((s) => s.profile);

  const livesThisDonation = LIVES_PER_DONATION_TYPE[donationType];
  const typeLabel = DONATION_TYPE_LABELS[donationType].label;
  const accentColor = DONATION_TYPE_COLORS[donationType].main;

  const viewShotRef = useRef<ViewShot>(null);
  const [loading, setLoading] = useState(false);

  const today = format(new Date(), "d MMMM yyyy", { locale: fr });

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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color="#888888" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Partager mon impact</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.hint}>Partage ce moment avec tes proches</Text>

        {/* ── Carte story exportable ──────────────────────── */}
        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1 }}>
          <View style={[styles.storyCard, { borderColor: accentColor + "30" }]}>
            {/* Décors de fond */}
            <View style={[styles.decor1, { borderColor: accentColor + "20" }]} />
            <View style={[styles.decor2, { borderColor: accentColor + "12" }]} />

            {/* Header carte */}
            <View style={styles.cardHeader}>
              <View style={styles.cardLogoRow}>
                <MaterialCommunityIcons name="water" size={14} color={accentColor} />
                <Text style={styles.cardLogo}>lifedrop</Text>
              </View>
              {profile?.name && (
                <Text style={styles.cardName}>{profile.name}</Text>
              )}
            </View>

            {/* Séparateur */}
            <View style={[styles.cardDivider, { backgroundColor: accentColor + "30" }]} />

            {/* Hero : vies sauvées aujourd'hui */}
            <Text style={styles.cardTagline}>J'ai sauvé</Text>
            <Text style={[styles.cardLives, { color: accentColor }]}>
              {livesThisDonation}
            </Text>
            <Text style={styles.cardLivesLabel}>
              {livesThisDonation > 1 ? "vies" : "vie"} aujourd'hui
            </Text>

            {/* Type de don + date */}
            <View style={[styles.donationChip, { backgroundColor: accentColor + "18", borderColor: accentColor + "40" }]}>
              <MaterialCommunityIcons
                name={DONATION_TYPE_LABELS[donationType].icon as any}
                size={13}
                color={accentColor}
              />
              <Text style={[styles.donationChipText, { color: accentColor }]}>
                {typeLabel} · {today}
              </Text>
            </View>

            {/* Séparateur */}
            <View style={[styles.cardDivider, { backgroundColor: accentColor + "20" }]} />

            {/* Total cumulé */}
            <Text style={styles.cardTotalLabel}>au total</Text>
            <Text style={styles.cardTotal}>
              {livesSaved} vie{livesSaved !== 1 ? "s" : ""} potentiellement sauvée{livesSaved !== 1 ? "s" : ""}
            </Text>

            {/* Footer */}
            <Text style={styles.cardFooter}>lifedrop.app · Rejoins le mouvement</Text>
          </View>
        </ViewShot>

        {/* Bouton partager */}
        <TouchableOpacity
          style={[styles.shareBtn, { backgroundColor: accentColor }]}
          onPress={handleCapture}
          disabled={loading}
          activeOpacity={0.85}
        >
          <View style={styles.shareBtnInner}>
            {loading ? (
              <MaterialCommunityIcons name="timer-sand" size={18} color="#ffffff" />
            ) : (
              <Ionicons name="share-outline" size={18} color="#ffffff" />
            )}
            <Text style={styles.shareBtnText}>
              {loading ? "Préparation…" : "Exporter & Partager"}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.navigate("Main")}
          activeOpacity={0.8}
        >
          <Text style={styles.backBtnText}>Retour à l'accueil</Text>
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
    gap: 16,
    alignItems: "center",
    paddingTop: 8,
  },
  hint: { fontSize: 13, color: "#888888" },

  storyCard: {
    width: 320,
    backgroundColor: "#1a1a1a",
    borderRadius: 28,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
    gap: 10,
    overflow: "hidden",
    position: "relative",
  },
  decor1: {
    position: "absolute",
    top: -70,
    right: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1.5,
  },
  decor2: {
    position: "absolute",
    top: -35,
    right: -35,
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
  },

  cardHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLogoRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  cardLogo: { fontSize: 14, fontWeight: "800", color: "#f5f5f5" },
  cardName: { fontSize: 12, color: "#888888", fontWeight: "600" },

  cardDivider: { width: "100%", height: 1 },

  cardTagline: { fontSize: 16, color: "#888888", fontWeight: "600" },
  cardLives: {
    fontSize: 88,
    fontWeight: "800",
    lineHeight: 96,
  },
  cardLivesLabel: { fontSize: 18, color: "#f5f5f5", fontWeight: "700" },

  donationChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 9999,
    borderWidth: 1,
  },
  donationChipText: { fontSize: 12, fontWeight: "700" },

  cardTotalLabel: { fontSize: 11, color: "#555555", textTransform: "uppercase", letterSpacing: 0.5 },
  cardTotal: { fontSize: 14, color: "#888888", textAlign: "center" },
  cardFooter: { fontSize: 10, color: "#444444", letterSpacing: 0.5, marginTop: 4 },

  shareBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
  },
  shareBtnInner: { flexDirection: "row", alignItems: "center", gap: 8 },
  shareBtnText: { fontSize: 15, fontWeight: "800", color: "#ffffff" },

  backBtn: {
    paddingVertical: 14,
    borderRadius: 18,
    width: "100%",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    alignItems: "center",
  },
  backBtnText: { fontSize: 14, fontWeight: "700", color: "#f5f5f5" },
});
