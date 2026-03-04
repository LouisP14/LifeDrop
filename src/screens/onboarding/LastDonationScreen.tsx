// ============================================================
// src/screens/onboarding/LastDonationScreen.tsx
// Écran 3/4 — Date du dernier don (optionnel)
// ============================================================

import { format, subDays, subMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GradientButton } from "../../components/ui/GradientButton";
import type { LastDonationScreenProps } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";
import type { DonationType } from "../../types";
import { generateId } from "../../utils/dates";

const today = new Date();

/** Raccourcis de date proposés */
const DATE_SHORTCUTS = [
  {
    label: "Il y a moins de 28 jours",
    date: subDays(today, 14),
    blocked: true,
  },
  { label: "Il y a 1–2 mois", date: subDays(today, 45), blocked: false },
  { label: "Il y a 3–6 mois", date: subMonths(today, 4), blocked: false },
  { label: "Il y a plus de 6 mois", date: subMonths(today, 8), blocked: false },
  { label: "Je n'ai jamais donné", date: null, blocked: false },
];

const DONATION_TYPES: { value: DonationType; label: string; delay: string }[] =
  [
    { value: "whole_blood", label: "Sang total", delay: "56 jours" },
    { value: "platelets", label: "Plaquettes", delay: "28 jours" },
    { value: "plasma", label: "Plasma", delay: "14 jours" },
  ];

export function LastDonationScreen({ navigation }: LastDonationScreenProps) {
  const addDonation = useAppStore((s) => s.addDonation);

  const [selectedShortcut, setSelectedShortcut] = useState<number | null>(null);
  const [donationType, setDonationType] = useState<DonationType>("whole_blood");
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const handleShortcutSelect = (idx: number) => {
    setSelectedShortcut(idx);
    // On affiche le sélecteur de type seulement si ce n'est pas "jamais donné"
    const shortcut = DATE_SHORTCUTS[idx];
    setShowTypeSelector(shortcut.date !== null);
  };

  const handleContinue = () => {
    const shortcut =
      selectedShortcut !== null ? DATE_SHORTCUTS[selectedShortcut] : null;

    // Si l'utilisateur a déjà donné, on enregistre le don précédent
    if (shortcut && shortcut.date) {
      addDonation({
        id: generateId(),
        date: shortcut.date.toISOString(),
        type: donationType,
        notes: "Don enregistré à l'onboarding",
      });
    }

    navigation.navigate("NotificationsSetup");
  };

  const canContinue = selectedShortcut !== null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Progress */}
      <View style={styles.progressRow}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
      </View>

      <View style={styles.header}>
        <Text style={styles.step}>Étape 2 sur 3</Text>
        <Text style={styles.title}>Dernier don</Text>
        <Text style={styles.subtitle}>
          On calcule automatiquement quand tu pourras donner à nouveau.
        </Text>
      </View>

      {/* Raccourcis */}
      <View style={styles.listGap}>
        {DATE_SHORTCUTS.map((s, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.shortcutBtn,
              selectedShortcut === idx && styles.shortcutBtnActive,
              s.blocked && styles.shortcutBtnBlocked,
            ]}
            onPress={() => handleShortcutSelect(idx)}
            activeOpacity={0.75}
          >
            <View style={styles.shortcutContent}>
              <Text
                style={[
                  styles.shortcutLabel,
                  selectedShortcut === idx && styles.shortcutLabelActive,
                  s.blocked && styles.shortcutLabelBlocked,
                ]}
              >
                {s.label}
              </Text>
              {s.date && (
                <Text style={styles.shortcutDate}>
                  {format(s.date, "dd MMM yyyy", { locale: fr })}
                </Text>
              )}
            </View>
            {selectedShortcut === idx && (
              <Text style={styles.checkMark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Sélecteur de type si don récent */}
      {showTypeSelector && (
        <View style={styles.typeSection}>
          <Text style={styles.typeLabel}>Type de don</Text>
          <View style={styles.typeRow}>
            {DONATION_TYPES.map((t) => (
              <TouchableOpacity
                key={t.value}
                style={[
                  styles.typeBtn,
                  donationType === t.value && styles.typeBtnActive,
                ]}
                onPress={() => setDonationType(t.value)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.typeName,
                    donationType === t.value && styles.typeNameActive,
                  ]}
                >
                  {t.label}
                </Text>
                <Text style={styles.typeDelay}>{t.delay}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <GradientButton
          label="Continuer"
          onPress={handleContinue}
          size="lg"
          disabled={!canContinue}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("NotificationsSetup")}
        >
          <Text style={styles.skip}>Passer cette étape</Text>
        </TouchableOpacity>
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

  header: { gap: 8, marginTop: 24, marginBottom: 28 },
  step: {
    fontSize: 12,
    color: "#888888",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  title: { fontSize: 30, fontWeight: "800", color: "#f5f5f5" },
  subtitle: { fontSize: 14, color: "#888888", lineHeight: 22 },

  listGap: { gap: 10 },

  shortcutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    backgroundColor: "#1a1a1a",
  },
  shortcutBtnActive: {
    borderColor: "#f87171",
    backgroundColor: "rgba(248,113,113,0.1)",
  },
  shortcutBtnBlocked: { opacity: 0.5 },

  shortcutContent: { gap: 2 },
  shortcutLabel: { fontSize: 14, fontWeight: "600", color: "#aaaaaa" },
  shortcutLabelActive: { color: "#f5f5f5" },
  shortcutLabelBlocked: { color: "#555555" },
  shortcutDate: { fontSize: 11, color: "#555555" },
  checkMark: { color: "#f87171", fontWeight: "800", fontSize: 16 },

  typeSection: { marginTop: 24 },
  typeLabel: {
    fontSize: 12,
    color: "#888888",
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  typeRow: { flexDirection: "row", gap: 10 },
  typeBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    gap: 3,
  },
  typeBtnActive: {
    borderColor: "#f87171",
    backgroundColor: "rgba(248,113,113,0.12)",
  },
  typeName: { fontSize: 12, fontWeight: "700", color: "#888888" },
  typeNameActive: { color: "#f87171" },
  typeDelay: { fontSize: 10, color: "#555555" },

  footer: { marginTop: "auto", gap: 12 },
  skip: {
    textAlign: "center",
    color: "#555555",
    fontSize: 13,
    fontWeight: "600",
  },
});
