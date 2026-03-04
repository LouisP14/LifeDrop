// ============================================================
// src/screens/profile/TeamDashboardScreen.tsx
// Dashboard de l'équipe : classement, score collectif, partage du code
// ============================================================

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DONATION_LEVELS } from "../../constants";
import type { TeamDashboardScreenProps } from "../../navigation/types";
import {
  selectCurrentTeam,
  useAppStore,
} from "../../store/useAppStore";
import type { DonationLevel, TeamMember } from "../../types";

const LEVEL_COLORS: Record<DonationLevel, string> = {
  bronze: "#CD7F32",
  silver: "#C0C0C0",
  gold: "#FFD700",
  platinum: "#E5E4E2",
};

function RankBadge({ rank }: { rank: number }) {
  const colors = ["#FFD700", "#C0C0C0", "#CD7F32"];
  const color = rank <= 3 ? colors[rank - 1] : "#444444";
  return (
    <View style={[styles.rankBadge, { backgroundColor: color + "22", borderColor: color + "55" }]}>
      <Text style={[styles.rankText, { color }]}>#{rank}</Text>
    </View>
  );
}

function MemberRow({
  member,
  rank,
  isMe,
}: {
  member: TeamMember;
  rank: number;
  isMe: boolean;
}) {
  const levelConf = DONATION_LEVELS.find((l) => l.level === member.level) ?? DONATION_LEVELS[0];
  return (
    <View style={[styles.memberRow, isMe && styles.memberRowMe]}>
      <RankBadge rank={rank} />
      <View style={styles.memberAvatarWrap}>
        <Text style={styles.memberAvatarText}>
          {(member.name ?? "?").slice(0, 2).toUpperCase()}
        </Text>
      </View>
      <View style={styles.memberInfo}>
        <Text style={[styles.memberName, isMe && styles.memberNameMe]}>
          {member.name ?? "Anonyme"}{isMe ? " (toi)" : ""}
        </Text>
        <View style={styles.memberMeta}>
          <MaterialCommunityIcons
            name={levelConf.icon as any}
            size={12}
            color={LEVEL_COLORS[member.level]}
          />
          <Text style={[styles.memberLevel, { color: LEVEL_COLORS[member.level] }]}>
            {levelConf.label}
          </Text>
        </View>
      </View>
      <View style={styles.memberStats}>
        <Text style={[styles.memberDonations, isMe && styles.memberDonationsMe]}>
          {member.donationCount}
        </Text>
        <Text style={styles.memberDonationsLabel}>dons</Text>
      </View>
    </View>
  );
}

export function TeamDashboardScreen({ navigation, route }: TeamDashboardScreenProps) {
  const { teamCode } = route.params;
  const team = useAppStore(selectCurrentTeam);
  const profile = useAppStore((s) => s.profile);
  const leaveTeam = useAppStore((s) => s.leaveTeam);

  // Trier le classement par nombre de dons décroissant
  const sortedMembers = [...(team?.members ?? [])].sort(
    (a, b) => b.donationCount - a.donationCount,
  );

  // Score collectif : total dons + total vies (approximation)
  const totalDonations = sortedMembers.reduce((s, m) => s + m.donationCount, 0);
  const totalLives = totalDonations * 2; // moyenne (sang=3, plasma/platelets=1) ≈ 2

  const handleShareCode = async () => {
    try {
      await Share.share({
        message: `Rejoins mon équipe sur LifeDrop avec le code : ${teamCode} 💉`,
        title: "Code équipe LifeDrop",
      });
    } catch (e) {
      Alert.alert("Partage annulé");
    }
  };

  const handleLeave = () => {
    Alert.alert(
      "Quitter l'équipe ?",
      `Tu ne seras plus dans l'équipe ${team?.name ?? teamCode}.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Quitter",
          style: "destructive",
          onPress: () => {
            leaveTeam();
            navigation.popToTop();
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color="#888888" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon équipe</Text>
        <TouchableOpacity onPress={handleLeave} style={styles.leaveBtn}>
          <Text style={styles.leaveBtnText}>Quitter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Nom de l'équipe + code */}
        <View style={styles.teamCard}>
          <View style={styles.teamDecor} />
          <MaterialCommunityIcons name="account-group" size={32} color="#f87171" />
          <Text style={styles.teamName}>{team?.name ?? teamCode}</Text>
          <TouchableOpacity style={styles.codeChip} onPress={handleShareCode} activeOpacity={0.7}>
            <Text style={styles.codeChipText}>{teamCode}</Text>
            <Ionicons name="copy-outline" size={13} color="#f87171" />
          </TouchableOpacity>
          <Text style={styles.teamHint}>Appuie sur le code pour le partager</Text>
        </View>

        {/* Score collectif */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreVal}>{totalDonations}</Text>
            <Text style={styles.scoreLab}>Dons collectifs</Text>
          </View>
          <View style={styles.scoreDivider} />
          <View style={styles.scoreItem}>
            <Text style={styles.scoreVal}>{sortedMembers.length}</Text>
            <Text style={styles.scoreLab}>Membres</Text>
          </View>
          <View style={styles.scoreDivider} />
          <View style={styles.scoreItem}>
            <Text style={styles.scoreVal}>~{totalLives}</Text>
            <Text style={styles.scoreLab}>Vies sauvées</Text>
          </View>
        </View>

        {/* Classement */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialCommunityIcons name="trophy-outline" size={18} color="#f87171" />
            <Text style={styles.sectionTitle}>Classement</Text>
          </View>

          {sortedMembers.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="account-plus-outline" size={40} color="#333333" />
              <Text style={styles.emptyTitle}>Tu es le premier !</Text>
              <Text style={styles.emptyText}>
                Partage le code <Text style={styles.emptyCode}>{teamCode}</Text> avec tes amis pour qu'ils rejoignent l'équipe.
              </Text>
            </View>
          ) : (
            <View style={styles.leaderboard}>
              {sortedMembers.map((member, index) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  rank={index + 1}
                  isMe={member.id === profile?.id}
                />
              ))}
            </View>
          )}
        </View>

        {/* Partager le code */}
        <TouchableOpacity
          style={styles.shareCodeBtn}
          onPress={handleShareCode}
          activeOpacity={0.85}
        >
          <View style={styles.shareCodeBtnInner}>
            <Ionicons name="share-outline" size={18} color="#ffffff" />
            <Text style={styles.shareCodeBtnText}>Partager le code d'équipe</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
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
  leaveBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.35)",
  },
  leaveBtnText: { fontSize: 13, color: "#f87171", fontWeight: "600" },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },

  teamCard: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 10,
    overflow: "hidden",
    position: "relative",
  },
  teamDecor: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1.5,
    borderColor: "rgba(248,113,113,0.12)",
  },
  teamName: { fontSize: 22, fontWeight: "800", color: "#f5f5f5", textAlign: "center" },
  codeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: "rgba(248,113,113,0.1)",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.35)",
  },
  codeChipText: { fontSize: 16, fontWeight: "800", color: "#f87171", letterSpacing: 2 },
  teamHint: { fontSize: 11, color: "#555555" },

  scoreCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 20,
    padding: 18,
  },
  scoreItem: { flex: 1, alignItems: "center", gap: 4 },
  scoreVal: { fontSize: 24, fontWeight: "800", color: "#f5f5f5" },
  scoreLab: { fontSize: 11, color: "#888888", textAlign: "center" },
  scoreDivider: { width: 1, height: 36, backgroundColor: "#2a2a2a" },

  section: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 20,
    padding: 18,
    gap: 14,
  },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#f5f5f5" },

  leaderboard: { gap: 10 },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#222222",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  memberRowMe: {
    borderColor: "rgba(248,113,113,0.4)",
    backgroundColor: "rgba(248,113,113,0.06)",
  },
  rankBadge: {
    width: 34,
    height: 34,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  rankText: { fontSize: 13, fontWeight: "800" },
  memberAvatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#f87171",
    alignItems: "center",
    justifyContent: "center",
  },
  memberAvatarText: { fontSize: 14, fontWeight: "800", color: "#ffffff" },
  memberInfo: { flex: 1, gap: 3 },
  memberName: { fontSize: 14, fontWeight: "700", color: "#f5f5f5" },
  memberNameMe: { color: "#f87171" },
  memberMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  memberLevel: { fontSize: 11, fontWeight: "600" },
  memberStats: { alignItems: "center", gap: 2 },
  memberDonations: { fontSize: 20, fontWeight: "800", color: "#f5f5f5" },
  memberDonationsMe: { color: "#f87171" },
  memberDonationsLabel: { fontSize: 10, color: "#888888" },

  emptyState: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 20,
  },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#f5f5f5" },
  emptyText: { fontSize: 13, color: "#888888", textAlign: "center", lineHeight: 20 },
  emptyCode: { color: "#f87171", fontWeight: "800" },

  shareCodeBtn: {
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: "#f87171",
    alignItems: "center",
    shadowColor: "#f87171",
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
  },
  shareCodeBtnInner: { flexDirection: "row", alignItems: "center", gap: 8 },
  shareCodeBtnText: { fontSize: 15, fontWeight: "800", color: "#ffffff" },
});
