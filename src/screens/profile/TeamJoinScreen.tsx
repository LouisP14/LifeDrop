// ============================================================
// src/screens/profile/TeamJoinScreen.tsx
// Rejoindre / créer une équipe via code
// ============================================================

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { TeamJoinScreenProps } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";

export function TeamJoinScreen({ navigation }: TeamJoinScreenProps) {
  const joinTeam = useAppStore((s) => s.joinTeam);
  const leaveTeam = useAppStore((s) => s.leaveTeam);
  const profile = useAppStore((s) => s.profile);

  const [code, setCode] = useState("");

  const handleJoin = () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 4) {
      Alert.alert(
        "Code invalide",
        "Le code équipe doit comporter au moins 4 caractères.",
      );
      return;
    }
    joinTeam(trimmed);
    navigation.replace("TeamDashboard", { teamCode: trimmed });
  };

  const handleLeave = () => {
    Alert.alert(
      "Quitter l'équipe ?",
      "Tu ne seras plus sur le classement de ton équipe.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Quitter",
          style: "destructive",
          onPress: () => {
            leaveTeam();
            navigation.goBack();
          },
        },
      ],
    );
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
        <Text style={styles.headerTitle}>Équipe</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.content}
      >
        {/* Illustration */}
        <MaterialCommunityIcons name="account-group" size={72} color="#f87171" />

        <View style={styles.textBlock}>
          <Text style={styles.title}>Rejoins ton équipe</Text>
          <Text style={styles.subtitle}>
            Compare tes dons avec tes amis ou collègues grâce à un code partagé.
          </Text>
        </View>

        {/* Équipe actuelle */}
        {profile?.teamCode ? (
          <View style={styles.currentTeam}>
            <Text style={styles.currentTeamLabel}>Équipe actuelle</Text>
            <Text style={styles.currentTeamCode}>{profile.teamCode}</Text>
            <TouchableOpacity
              style={styles.viewBtn}
              onPress={() =>
                navigation.navigate("TeamDashboard", {
                  teamCode: profile.teamCode!,
                })
              }
              activeOpacity={0.85}
            >
              <Text style={styles.viewBtnText}>Voir le classement</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLeave} style={styles.leaveBtn}>
              <Text style={styles.leaveBtnText}>Quitter cette équipe</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Input code */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Code équipe</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex : LIFEDROP2026"
                placeholderTextColor="#555555"
                value={code}
                onChangeText={(t) => setCode(t.toUpperCase())}
                autoCapitalize="characters"
                maxLength={12}
                returnKeyType="join"
                onSubmitEditing={handleJoin}
              />
              <Text style={styles.inputHint}>
                Demande ce code à ton responsable ou à l'organisateur.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.joinBtn, !code.trim() && styles.joinBtnDisabled]}
              onPress={handleJoin}
              activeOpacity={0.85}
              disabled={!code.trim()}
            >
              <Text style={styles.joinBtnText}>Rejoindre l'équipe</Text>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAvoidingView>
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
    paddingTop: 24,
    gap: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  textBlock: { gap: 8, alignItems: "center" },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#f5f5f5",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#888888",
    textAlign: "center",
    lineHeight: 22,
  },

  inputSection: { width: "100%", gap: 10 },
  inputLabel: {
    fontSize: 12,
    color: "#888888",
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 15,
    fontSize: 18,
    fontWeight: "800",
    color: "#f87171",
    letterSpacing: 2,
    textAlign: "center",
  },
  inputHint: { fontSize: 11, color: "#555555", textAlign: "center" },

  joinBtn: {
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
  joinBtnDisabled: { backgroundColor: "#2a2a2a", shadowOpacity: 0 },
  joinBtnText: { fontSize: 15, fontWeight: "800", color: "#ffffff" },

  currentTeam: {
    width: "100%",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    gap: 12,
  },
  currentTeamLabel: {
    fontSize: 11,
    color: "#888888",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  currentTeamCode: {
    fontSize: 32,
    fontWeight: "800",
    color: "#f87171",
    letterSpacing: 3,
  },
  viewBtn: {
    width: "100%",
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: "#f87171",
    alignItems: "center",
  },
  viewBtnText: { fontSize: 14, fontWeight: "800", color: "#ffffff" },
  leaveBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.3)",
  },
  leaveBtnText: { fontSize: 13, color: "#f87171", fontWeight: "600" },
});
