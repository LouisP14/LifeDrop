// ============================================================
// src/screens/onboarding/BloodTypeScreen.tsx
// Écran 2/4 — Sélection groupe sanguin + sexe biologique
// ============================================================

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GradientButton } from "../../components/ui/GradientButton";
import type { BloodTypeScreenProps } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";
import type { BiologicalSex, BloodType } from "../../types";

const BLOOD_TYPES: BloodType[] = [
  "O-",
  "O+",
  "A-",
  "A+",
  "B-",
  "B+",
  "AB-",
  "AB+",
];

export function BloodTypeScreen({ navigation }: BloodTypeScreenProps) {
  const updateProfile = useAppStore((s) => s.updateProfile);

  const [name, setName] = useState("");
  const [selectedType, setSelectedType] = useState<BloodType | null>(null);
  const [selectedSex, setSelectedSex] = useState<BiologicalSex | null>(null);

  const canContinue = name.trim().length >= 2 && selectedType !== null && selectedSex !== null;

  const handleSelect = async (type: BloodType) => {
    await Haptics.selectionAsync();
    setSelectedType(type);
  };

  const handleSexSelect = async (sex: BiologicalSex) => {
    await Haptics.selectionAsync();
    setSelectedSex(sex);
  };

  const handleContinue = () => {
    if (!selectedType || !selectedSex || name.trim().length < 2) return;
    updateProfile({ bloodType: selectedType, sex: selectedSex, name: name.trim() });
    navigation.navigate("LastDonation");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Progress indicator */}
      <View style={styles.progressRow}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Titre */}
        <View style={styles.header}>
          <Text style={styles.step}>Étape 1 sur 3</Text>
          <Text style={styles.title}>Ton profil{"\n"}sanguin</Text>
          <Text style={styles.subtitle}>
            Ces informations permettent de personnaliser tes rappels et
            conseils.
          </Text>
        </View>

        {/* Prénom / pseudo */}
        <Text style={styles.sectionLabel}>Ton prénom</Text>
        <TextInput
          style={styles.nameInput}
          placeholder="Ex : Pauline, Mehdi…"
          placeholderTextColor="#555555"
          value={name}
          onChangeText={setName}
          maxLength={30}
          returnKeyType="next"
          autoCapitalize="words"
          accessibilityLabel="Saisir ton prénom"
        />

        {/* Groupe sanguin */}
        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Groupe sanguin</Text>
        <View style={styles.bloodGrid}>
          {BLOOD_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.bloodBtn,
                selectedType === type && styles.bloodBtnActive,
              ]}
              onPress={() => handleSelect(type)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.bloodBtnText,
                  selectedType === type && styles.bloodBtnTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[
              styles.bloodBtn,
              styles.bloodBtnUnknown,
              selectedType === "unknown" && styles.bloodBtnActive,
            ]}
            onPress={() => handleSelect("unknown")}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.bloodBtnText,
                styles.bloodBtnTextUnknown,
                selectedType === "unknown" && styles.bloodBtnTextActive,
              ]}
            >
              Je ne sais pas
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sexe biologique */}
        <Text style={[styles.sectionLabel, { marginTop: 28 }]}>
          Sexe biologique
        </Text>
        <Text style={styles.sexHint}>
          Pour personnaliser ton profil et tes statistiques de don.
        </Text>
        <View style={styles.sexRow}>
          {(["male", "female"] as BiologicalSex[]).map((sex) => (
            <TouchableOpacity
              key={sex}
              style={[
                styles.sexBtn,
                selectedSex === sex && styles.sexBtnActive,
              ]}
              onPress={() => handleSexSelect(sex)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={sex === "male" ? "male" : "female"}
                size={24}
                color={selectedSex === sex ? "#f87171" : "#888888"}
              />
              <Text
                style={[
                  styles.sexLabel,
                  selectedSex === sex && styles.sexLabelActive,
                ]}
              >
                {sex === "male" ? "Homme" : "Femme"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <GradientButton
          label="Continuer"
          onPress={handleContinue}
          size="lg"
          disabled={!canContinue}
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

  progressRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 16,
    marginBottom: 8,
  },
  dot: {
    flex: 1,
    height: 3,
    borderRadius: 9999,
    backgroundColor: "#2a2a2a",
  },
  dotActive: { backgroundColor: "#f87171" },

  scroll: { paddingBottom: 40 },

  header: { gap: 8, marginTop: 24, marginBottom: 32 },
  step: {
    fontSize: 12,
    color: "#888888",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  title: { fontSize: 30, fontWeight: "800", color: "#f5f5f5", lineHeight: 38 },
  subtitle: { fontSize: 14, color: "#888888", lineHeight: 22 },

  sectionLabel: {
    fontSize: 12,
    color: "#888888",
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 14,
  },

  bloodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  bloodBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    backgroundColor: "#1a1a1a",
    minWidth: 72,
    alignItems: "center",
  },
  bloodBtnUnknown: { paddingHorizontal: 20 },
  bloodBtnActive: {
    borderColor: "#f87171",
    backgroundColor: "rgba(248,113,113,0.14)",
  },
  bloodBtnText: { fontSize: 15, fontWeight: "700", color: "#888888" },
  bloodBtnTextUnknown: { fontSize: 13, fontWeight: "600", color: "#888888" },
  bloodBtnTextActive: { color: "#f87171" },

  sexHint: { fontSize: 12, color: "#555555", marginBottom: 14, lineHeight: 18 },

  sexRow: { flexDirection: "row", gap: 12 },
  sexBtn: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    gap: 8,
  },
  sexBtnActive: {
    borderColor: "#f87171",
    backgroundColor: "rgba(248,113,113,0.12)",
  },
  sexLabel: { fontSize: 15, fontWeight: "700", color: "#888888" },
  sexLabelActive: { color: "#f87171" },

  nameInput: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 15,
    fontSize: 16,
    fontWeight: "600",
    color: "#f5f5f5",
    marginBottom: 8,
  },

  footer: { marginTop: 16 },
});
