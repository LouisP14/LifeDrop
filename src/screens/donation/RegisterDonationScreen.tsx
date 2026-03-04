// ============================================================
// src/screens/donation/RegisterDonationScreen.tsx
//
// Modal d'enregistrement d'un don :
// - sélection type (sang total / plaquettes / plasma)
// - date du don (aujourd'hui ou date passée)
// - lieu (optionnel)
// - validation des délais légaux (impossible de logguer avant la fin du délai)
// - message d'impact "jusqu'à 3 vies"
// ============================================================

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  DONATION_COOLDOWN_DAYS,
  DONATION_TYPE_COLORS,
  DONATION_TYPE_LABELS,
  LIVES_PER_DONATION_TYPE,
} from "../../constants";
import { usePerTypeEligibility } from "../../hooks/useEligibility";
import type { RegisterDonationScreenProps } from "../../navigation/types";
import { notificationService } from "../../services/NotificationService";
import { useAppStore } from "../../store/useAppStore";
import type { DonationType } from "../../types";
import { generateId } from "../../utils/dates";
import { computeLivesSaved } from "../../utils/donations";
import {
  computeEarnedBadgeIds,
  getNewlyUnlockedBadgeIds,
  mergeBadges,
} from "../../utils/levels";

const DONATION_TYPES: {
  value: DonationType;
  label: string;
  desc: string;
  icon: string; // MaterialCommunityIcons name
  delay: number;
}[] = [
  {
    value: "whole_blood",
    label: "Sang total",
    desc: "Le don le plus courant",
    icon: "water",
    delay: 56,
  },
  {
    value: "platelets",
    label: "Plaquettes",
    desc: "Conservées seulement 5 jours",
    icon: "microscope",
    delay: 28,
  },
  {
    value: "plasma",
    label: "Plasma",
    desc: "Conservé jusqu'à 1 an",
    icon: "water-outline",
    delay: 14,
  },
];

export function RegisterDonationScreen({
  navigation,
}: RegisterDonationScreenProps) {
  const donations = useAppStore((s) => s.donations);
  const profile = useAppStore((s) => s.profile);
  const badges = useAppStore((s) => s.badges);
  const addDonation = useAppStore((s) => s.addDonation);
  const perType = usePerTypeEligibility();

  const [selectedType, setSelectedType] = useState<DonationType>("whole_blood");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  // Date du don : aujourd'hui
  const donationDate = new Date();

  // Bloquer uniquement si le type SÉLECTIONNÉ est en délai
  const selectedElig = perType?.[selectedType];
  const isBlocked = selectedElig ? !selectedElig.canDonate : false;

  const handleSubmit = useCallback(async () => {
    if (isBlocked) {
      Alert.alert(
        "Don non possible",
        `Le délai légal de ${DONATION_COOLDOWN_DAYS[selectedType]} jours pour le ${DONATION_TYPE_LABELS[selectedType].label} n'est pas encore écoulé. Encore ${selectedElig?.daysRemaining} jour(s).`,
        [{ text: "Compris", style: "cancel" }],
      );
      return;
    }

    setLoading(true);

    const prevBadges = [...badges];

    const newDonation = {
      id: generateId(),
      date: donationDate.toISOString(),
      type: selectedType,
      location: location.trim() || undefined,
    };

    addDonation(newDonation);

    // Récupérer les nouveaux badges débloqués
    const updatedDonations = [...donations, newDonation];
    const earnedIds = profile
      ? computeEarnedBadgeIds(updatedDonations, profile)
      : [];
    const updatedBadges = mergeBadges(earnedIds, prevBadges);
    const newBadgeIds = getNewlyUnlockedBadgeIds(prevBadges, updatedBadges);

    // Planifier la notif de rappel
    try {
      await notificationService.scheduleNextDonationReminder(newDonation);
    } catch (e) {
      console.warn("[Notif] Échec planification", e);
    }

    setLoading(false);

    navigation.replace("DonationSuccess", {
      donationId: newDonation.id,
      livesSaved: computeLivesSaved(updatedDonations),
      newBadges: newBadgeIds,
      donationType: selectedType,
    });
  }, [selectedType, location, isBlocked, donations, profile, badges]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header de la modal */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={20} color="#888888" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enregistrer un don</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Message d'impact */}
        <View style={styles.impactBanner}>
          <Ionicons name="heart" size={22} color="#f87171" />
          <Text style={styles.impactText}>
            Aujourd'hui ton don peut potentiellement sauver{" "}
            <Text style={styles.impactHighlight}>
              jusqu'à {LIVES_PER_DONATION_TYPE[selectedType]} vie
              {LIVES_PER_DONATION_TYPE[selectedType] > 1 ? "s" : ""}
            </Text>
          </Text>
        </View>

        {/* Alerte si délai pas écoulé pour le type sélectionné */}
        {isBlocked && (
          <View style={styles.blockBanner}>
            <MaterialCommunityIcons
              name="timer-sand"
              size={20}
              color="#fbbf24"
            />
            <View>
              <Text style={styles.blockTitle}>Type non disponible</Text>
              <Text style={styles.blockSub}>
                {`Encore ${selectedElig?.daysRemaining} jour(s) pour le ${DONATION_TYPE_LABELS[selectedType].label}`}
              </Text>
            </View>
          </View>
        )}

        {/* Date du don */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Date du don</Text>
          <View style={styles.dateChip}>
            <Ionicons name="calendar-outline" size={18} color="#888888" />
            <Text style={styles.dateText}>
              {format(donationDate, "EEEE d MMMM yyyy", { locale: fr })}
            </Text>
          </View>
        </View>

        {/* Type de don */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Type de don</Text>
          <View style={styles.typeList}>
            {DONATION_TYPES.map((t) => {
              const typeElig = perType?.[t.value];
              const typeOk = typeElig ? typeElig.canDonate : true;
              const typeDays = typeElig?.daysRemaining;
              return (
                <TouchableOpacity
                  key={t.value}
                  style={[
                    styles.typeCard,
                    selectedType === t.value && {
                      borderColor: DONATION_TYPE_COLORS[t.value].border,
                      backgroundColor: DONATION_TYPE_COLORS[t.value].bg,
                    },
                    !typeOk && styles.typeCardLocked,
                  ]}
                  onPress={() => setSelectedType(t.value)}
                  activeOpacity={0.75}
                >
                  <View style={styles.typeCardLeft}>
                    <MaterialCommunityIcons
                      name={t.icon as any}
                      size={24}
                      color={
                        !typeOk
                          ? "#444444"
                          : selectedType === t.value
                            ? DONATION_TYPE_COLORS[t.value].main
                            : DONATION_TYPE_COLORS[t.value].main + "88"
                      }
                    />
                    <View>
                      <Text
                        style={[
                          styles.typeLabel,
                          selectedType === t.value && styles.typeLabelActive,
                          !typeOk && styles.typeLabelLocked,
                        ]}
                      >
                        {t.label}
                      </Text>
                      <Text style={styles.typeDesc}>
                        {typeOk ? t.desc : `Disponible dans ${typeDays}j`}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.typeRight}>
                    {typeOk ? (
                      <Text
                        style={[
                          styles.typeDelay,
                          { color: DONATION_TYPE_COLORS[t.value].main },
                        ]}
                      >
                        Dispo
                      </Text>
                    ) : (
                      <Text style={styles.typeDelay}>{typeDays}j</Text>
                    )}
                    {selectedType === t.value && (
                      <View
                        style={[
                          styles.typeCheck,
                          { backgroundColor: DONATION_TYPE_COLORS[t.value].main },
                        ]}
                      >
                        <Ionicons name="checkmark" size={14} color="#ffffff" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Lieu (optionnel) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Lieu <Text style={styles.optional}>(optionnel)</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex : EFS Paris, Hôpital Lariboisière…"
            placeholderTextColor="#555555"
            value={location}
            onChangeText={setLocation}
            returnKeyType="done"
          />
        </View>

        {/* Délai légal informatif */}
        <View style={styles.legalNote}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#555555"
          />
          <Text style={styles.legalText}>
            LifeDrop applique les délais légaux :{" "}
            {DONATION_COOLDOWN_DAYS[selectedType]} jours pour{" "}
            {DONATION_TYPES.find(
              (t) => t.value === selectedType,
            )?.label.toLowerCase()}
            .
          </Text>
        </View>
      </ScrollView>

      {/* Bouton de validation */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, isBlocked && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          activeOpacity={isBlocked ? 1 : 0.85}
          disabled={loading}
        >
          <MaterialCommunityIcons
            name={loading ? "timer-sand" : "needle"}
            size={20}
            color="#ffffff"
          />
          <Text style={styles.submitText}>
            {loading
              ? "Enregistrement…"
              : isBlocked
                ? "Don non disponible"
                : "Valider ce don"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },

  // Header modal
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

  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 24 },

  // Impact banner
  impactBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(248,113,113,0.1)",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.25)",
    borderRadius: 16,
    padding: 16,
  },
  impactText: { flex: 1, fontSize: 14, color: "#f5f5f5", lineHeight: 22 },
  impactHighlight: { color: "#f87171", fontWeight: "800" },

  // Block banner
  blockBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(251,191,36,0.1)",
    borderWidth: 1,
    borderColor: "rgba(251,191,36,0.3)",
    borderRadius: 14,
    padding: 14,
  },
  blockTitle: { fontSize: 14, fontWeight: "700", color: "#fbbf24" },
  blockSub: { fontSize: 12, color: "#888888", marginTop: 2 },

  // Section
  section: { gap: 12 },
  sectionLabel: {
    fontSize: 12,
    color: "#888888",
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  optional: {
    color: "#555555",
    fontWeight: "400",
    letterSpacing: 0,
    textTransform: "none",
  },

  // Date chip
  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateText: { fontSize: 15, fontWeight: "600", color: "#f5f5f5" },

  // Type de don
  typeList: { gap: 10 },
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 14,
    padding: 16,
  },
  typeCardActive: {
    borderColor: "#f87171",
    backgroundColor: "rgba(248,113,113,0.1)",
  },
  typeCardLocked: {
    opacity: 0.65,
    borderColor: "#1f1f1f",
  },
  typeCardLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  typeLabel: { fontSize: 15, fontWeight: "700", color: "#888888" },
  typeLabelActive: { color: "#f5f5f5" },
  typeLabelLocked: { color: "#555555" },
  typeDesc: { fontSize: 12, color: "#555555", marginTop: 2 },
  typeRight: { alignItems: "flex-end", gap: 4 },
  typeDelay: { fontSize: 12, color: "#fb923c", fontWeight: "700" },
  typeDelayOk: { color: "#34d399" },
  typeCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#f87171",
    alignItems: "center",
    justifyContent: "center",
  },

  // Input lieu
  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: "#f5f5f5",
  },

  // Note légale
  legalNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 14,
  },
  legalText: { flex: 1, fontSize: 12, color: "#888888", lineHeight: 18 },

  // Bouton submit
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
    backgroundColor: "#0f0f0f",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 17,
    borderRadius: 20,
    backgroundColor: "#f87171",
    shadowColor: "#f87171",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  submitBtnDisabled: { backgroundColor: "#2a2a2a", shadowOpacity: 0 },
  submitText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.2,
  },
});
