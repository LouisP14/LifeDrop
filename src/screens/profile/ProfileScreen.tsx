// ============================================================
// src/screens/profile/ProfileScreen.tsx
// Profil utilisateur : badges, historique, stats, partage, édition groupe sanguin
// ============================================================

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { DonationProgressBar } from "../../components/ui/DonationProgressBar";
import { LevelBadge } from "../../components/ui/LevelBadge";
import { BADGES_CATALOG, BLOOD_TYPE_INFO, LIVES_PER_DONATION_TYPE } from "../../constants";
import { useDonationStats } from "../../hooks/useDonationStats";
import type { ProfileScreenProps } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";
import type { BloodType } from "../../types";
import { getDonationTypeLabel } from "../../utils/dates";

const BLOOD_TYPES: BloodType[] = [
  "O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+",
];

export function ProfileScreen({ navigation }: ProfileScreenProps) {
  const profile = useAppStore((s) => s.profile);
  const donations = useAppStore((s) => s.donations);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const stats = useDonationStats();

  const [showBloodTypeModal, setShowBloodTypeModal] = useState(false);

  const initials = profile?.name
    ? profile.name.slice(0, 2).toUpperCase()
    : profile?.bloodType !== "unknown"
      ? (profile?.bloodType ?? "?")
      : "?";

  const bloodInfo =
    profile?.bloodType && profile.bloodType !== "unknown"
      ? BLOOD_TYPE_INFO[profile.bloodType]
      : null;

  const sortedDonations = [...donations].sort(
    (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime(),
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ── Header profil ─────────────────────────────── */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {profile?.name ?? "Mon profil"}
            </Text>
            <View style={styles.profileRow}>
              {/* Chip groupe sanguin tappable */}
              <TouchableOpacity
                style={styles.bloodChip}
                onPress={() => setShowBloodTypeModal(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.bloodChipText}>
                  {profile?.bloodType && profile.bloodType !== "unknown"
                    ? profile.bloodType
                    : "Groupe ?"}
                </Text>
                <Ionicons name="pencil" size={10} color="#f87171" />
              </TouchableOpacity>
              <LevelBadge level={stats.levelConfig.level} size="sm" />
            </View>
          </View>
        </View>

        {/* ── Progression de niveau ─────────────────────── */}
        <View style={styles.card}>
          <DonationProgressBar donationCount={stats.count} />
        </View>

        {/* ── Stats clés ────────────────────────────────── */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{stats.livesSaved}</Text>
            <Text style={styles.statLab}>Vies sauvées</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{stats.count}</Text>
            <Text style={styles.statLab}>Dons totaux</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <View style={styles.streakRow}>
              {stats.streak > 0 && (
                <MaterialCommunityIcons name="fire" size={22} color="#fb923c" />
              )}
              <Text style={styles.statVal}>
                {stats.streak > 0 ? stats.streak : "—"}
              </Text>
            </View>
            <Text style={styles.statLab}>Streak</Text>
          </View>
        </View>

        {/* ── Groupe sanguin ────────────────────────────── */}
        {bloodInfo && (
          <View style={styles.cardSection}>
            <View style={styles.sectionTitleRow}>
              <MaterialCommunityIcons name="water" size={18} color="#f87171" />
              <Text style={styles.sectionTitle}>Ton groupe sanguin</Text>
            </View>
            <Text style={styles.bloodDesc}>{bloodInfo.description}</Text>
            <View style={styles.compatRow}>
              <View style={styles.compatItem}>
                <Text style={styles.compatLabel}>Tu reçois de</Text>
                <Text style={styles.compatValue}>
                  {bloodInfo.canReceiveFrom.join(" · ")}
                </Text>
              </View>
              <View style={styles.compatItem}>
                <Text style={styles.compatLabel}>Tu donnes à</Text>
                <Text style={styles.compatValue}>
                  {bloodInfo.canDonateTo.join(" · ")}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ── Badges ────────────────────────────────────── */}
        <View style={styles.cardSection}>
          <View style={styles.sectionTitleRow}>
            <MaterialCommunityIcons
              name="medal-outline"
              size={18}
              color="#f87171"
            />
            <Text style={styles.sectionTitle}>Mes badges</Text>
          </View>
          <View style={styles.badgesGrid}>
            {stats.unlockedBadges.map((b) => {
              const icon = BADGES_CATALOG.find((c) => c.id === b.id)?.icon ?? b.icon;
              return (
                <View key={b.id} style={styles.badgeItem}>
                  <MaterialCommunityIcons
                    name={icon as any}
                    size={24}
                    color="#f87171"
                  />
                  <Text style={styles.badgeName}>{b.label}</Text>
                </View>
              );
            })}
            {stats.unlockedBadges.length === 0 && (
              <Text style={styles.emptyBadge}>
                Enregistre ton premier don pour débloquer des badges !
              </Text>
            )}
          </View>
        </View>

        {/* ── Historique des dons ───────────────────────── */}
        {sortedDonations.length > 0 && (
          <View style={styles.cardSection}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="time-outline" size={18} color="#f87171" />
              <Text style={styles.sectionTitle}>Historique</Text>
            </View>
            <View style={styles.historyList}>
              {sortedDonations.slice(0, 5).map((d) => (
                <View key={d.id} style={styles.historyItem}>
                  <View style={styles.historyIcon}>
                    <MaterialCommunityIcons
                      name="water"
                      size={18}
                      color="#f87171"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyType}>
                      {getDonationTypeLabel(d.type)}
                    </Text>
                    <Text style={styles.historyDate}>
                      {format(parseISO(d.date), "dd MMMM yyyy", { locale: fr })}
                    </Text>
                    {d.location && (
                      <View style={styles.historyLocRow}>
                        <Ionicons
                          name="location-outline"
                          size={11}
                          color="#555555"
                        />
                        <Text style={styles.historyLoc}>{d.location}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.historyLives}>
                    +{LIVES_PER_DONATION_TYPE[d.type]} vie
                    {LIVES_PER_DONATION_TYPE[d.type] > 1 ? "s" : ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Actions ───────────────────────────────────── */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate("ShareProfile")}
            activeOpacity={0.8}
            accessibilityLabel="Partager mon profil"
            accessibilityRole="button"
          >
            <Ionicons name="share-outline" size={20} color="#f87171" />
            <Text style={styles.actionLabel}>Partager mon profil</Text>
            <Ionicons name="chevron-forward" size={20} color="#555555" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate("TeamJoin")}
            activeOpacity={0.8}
            accessibilityLabel="Rejoindre ou voir mon équipe"
          >
            <Ionicons name="people-outline" size={20} color="#f87171" />
            <Text style={styles.actionLabel}>Mon équipe</Text>
            <Ionicons name="chevron-forward" size={20} color="#555555" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── Overlay sélection groupe sanguin (sans Modal) ── */}
      {showBloodTypeModal && (
        <View style={[StyleSheet.absoluteFill, styles.modalOverlay]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowBloodTypeModal(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            <View style={styles.modalTitleRow}>
              <MaterialCommunityIcons name="water" size={18} color="#f87171" />
              <Text style={styles.modalTitle}>Groupe sanguin</Text>
            </View>

            <View style={styles.bloodGrid}>
              {BLOOD_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.bloodBtn,
                    profile?.bloodType === type && styles.bloodBtnActive,
                  ]}
                  onPress={() => {
                    updateProfile({ bloodType: type });
                    setShowBloodTypeModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.bloodBtnText,
                      profile?.bloodType === type && styles.bloodBtnTextActive,
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
                  (profile?.bloodType === "unknown" || !profile?.bloodType) &&
                    styles.bloodBtnActive,
                ]}
                onPress={() => {
                  updateProfile({ bloodType: "unknown" });
                  setShowBloodTypeModal(false);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.bloodBtnText,
                    (profile?.bloodType === "unknown" ||
                      !profile?.bloodType) &&
                      styles.bloodBtnTextActive,
                  ]}
                >
                  Je ne sais pas
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 16,
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 4,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#f87171",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#f87171",
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 6,
  },
  avatarText: { fontSize: 22, fontWeight: "800", color: "#ffffff" },
  profileInfo: { flex: 1, gap: 8 },
  profileName: { fontSize: 22, fontWeight: "800", color: "#f5f5f5" },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 8 },

  bloodChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    backgroundColor: "rgba(248,113,113,0.14)",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.4)",
  },
  bloodChipText: { fontSize: 13, fontWeight: "800", color: "#f87171" },

  card: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 20,
    padding: 18,
  },

  statsGrid: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 20,
    padding: 18,
  },
  statItem: { flex: 1, alignItems: "center", gap: 4 },
  statVal: { fontSize: 26, fontWeight: "800", color: "#f5f5f5" },
  statLab: { fontSize: 11, color: "#888888", textAlign: "center" },
  divider: { width: 1, height: 40, backgroundColor: "#2a2a2a" },
  streakRow: { flexDirection: "row", alignItems: "center", gap: 2 },

  cardSection: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 20,
    padding: 18,
    gap: 14,
  },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#f5f5f5" },

  bloodDesc: { fontSize: 13, color: "#888888", lineHeight: 20 },
  compatRow: { flexDirection: "row", gap: 12 },
  compatItem: { flex: 1, gap: 4 },
  compatLabel: {
    fontSize: 11,
    color: "#555555",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  compatValue: { fontSize: 13, color: "#f5f5f5", fontWeight: "600" },

  badgesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  badgeItem: {
    alignItems: "center",
    gap: 4,
    backgroundColor: "#222222",
    borderRadius: 12,
    padding: 12,
    minWidth: 72,
  },
  badgeName: {
    fontSize: 10,
    color: "#888888",
    fontWeight: "700",
    textAlign: "center",
  },
  emptyBadge: { fontSize: 13, color: "#555555", lineHeight: 20 },

  historyList: { gap: 10 },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#222222",
    borderRadius: 12,
    padding: 12,
  },
  historyIcon: {
    width: 38,
    height: 38,
    borderRadius: 9999,
    backgroundColor: "rgba(248,113,113,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  historyType: { fontSize: 14, fontWeight: "700", color: "#f5f5f5" },
  historyDate: { fontSize: 12, color: "#888888", marginTop: 2 },
  historyLocRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  historyLoc: { fontSize: 11, color: "#555555" },
  historyLives: { fontSize: 12, fontWeight: "700", color: "#f87171" },

  actionsSection: { gap: 10 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 14,
    padding: 16,
  },
  actionLabel: { flex: 1, fontSize: 14, fontWeight: "600", color: "#f5f5f5" },
  actionBtnDisabled: { opacity: 0.45 },

  // ── Modal groupe sanguin ──────────────────────────────────────
  modalOverlay: {
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
    zIndex: 999,
  },
  modalSheet: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    paddingHorizontal: 24,
    paddingBottom: 44,
    paddingTop: 12,
    gap: 20,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#3a3a3a",
    alignSelf: "center",
    marginBottom: 4,
  },
  modalTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#f5f5f5" },

  bloodGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  bloodBtn: {
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3a3a3a",
    backgroundColor: "#2a2a2a",
    minWidth: 72,
    alignItems: "center",
  },
  bloodBtnUnknown: { paddingHorizontal: 20 },
  bloodBtnActive: {
    borderColor: "#f87171",
    backgroundColor: "rgba(248,113,113,0.18)",
  },
  bloodBtnText: { fontSize: 15, fontWeight: "700", color: "#aaaaaa" },
  bloodBtnTextActive: { color: "#f87171" },
});
