// ============================================================
// src/screens/dashboard/DashboardScreen.tsx
//
// ÉCRAN PRINCIPAL — Fidèle au mockup UI LifeDrop :
// ┌─ Header logo + avatar
// ├─ Hero card   : compteur de vies + barre de progression niveau
// ├─ Countdown   : anneau circulaire + info prochain don
// ├─ CTA         : bouton "Enregistrer un don"
// ├─ Stats row   : dons totaux + streak
// ├─ Badge row   : Bronze → Platine mini-cartes
// └─ Bottom tabs (natifs)
// ============================================================

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  Path,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";

import { CountdownRing } from "../../components/ui/CountdownRing";
import { DonationProgressBar } from "../../components/ui/DonationProgressBar";
import {
  DONATION_COOLDOWN_DAYS,
  DONATION_LEVELS,
  DONATION_TYPE_COLORS,
  DONATION_TYPE_LABELS,
} from "../../constants";
import { useDonationStats } from "../../hooks/useDonationStats";
import {
  useEligibility,
  usePerTypeEligibility,
} from "../../hooks/useEligibility";
import type { DashboardScreenProps } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";
import type { DonationType } from "../../types";

const LOGO_SIZE = 32;

// ─── Composant Logo SVG inline ────────────────────────────────
function LifeDropLogo() {
  return (
    <Svg width={LOGO_SIZE} height={LOGO_SIZE} viewBox="0 0 32 32">
      <Defs>
        <SvgLinearGradient
          id="lg"
          x1="16"
          y1="4"
          x2="16"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#f87171" />
          <Stop offset="1" stopColor="#fb923c" />
        </SvgLinearGradient>
      </Defs>
      <Circle
        cx="16"
        cy="16"
        r="14"
        stroke="#f87171"
        strokeWidth="1.2"
        strokeDasharray="5 3"
        fill="none"
        opacity={0.5}
      />
      <Circle cx="16" cy="16" r="9" fill="#1a1a1a" />
      <Path
        d="M16 5 C16 5 10 13 10 17 C10 20.5 12.7 23 16 23 C19.3 23 22 20.5 22 17 C22 13 16 5 16 5Z"
        fill="url(#lg)"
      />
    </Svg>
  );
}

// ─── Mini badge pour la row ───────────────────────────────────
function MiniBadgeCard({
  iconName,
  color,
  name,
  active,
}: {
  iconName: string;
  color: string;
  name: string;
  active: boolean;
}) {
  return (
    <View
      style={[
        styles.miniBadge,
        active && {
          borderColor: color + "55",
          backgroundColor: color + "18",
        },
      ]}
    >
      <MaterialCommunityIcons
        name={iconName as any}
        size={22}
        color={active ? color : "#444444"}
      />
      <Text style={[styles.miniBadgeName, active && { color }]}>
        {name}
      </Text>
    </View>
  );
}

// ─── Écran principal ─────────────────────────────────────────
export function DashboardScreen({ navigation }: DashboardScreenProps) {
  const profile = useAppStore((s) => s.profile);
  const eligibility = useEligibility();
  const perType = usePerTypeEligibility();
  const stats = useDonationStats();

  const handleRegister = useCallback(() => {
    navigation.navigate("RegisterDonation");
  }, [navigation]);

  // Initiales pour l'avatar
  const initials = profile?.name
    ? profile.name.slice(0, 1).toUpperCase()
    : profile?.bloodType && profile.bloodType !== "unknown"
      ? profile.bloodType.replace(/[+-]/, "")
      : "M";

  // CTA activé si au moins un type est disponible
  const canDonate = eligibility?.canDonate ?? true;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <LifeDropLogo />
            <Text style={styles.appName}>lifedrop</Text>
          </View>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => navigation.navigate("Profile")}
            activeOpacity={0.8}
            accessibilityLabel="Voir mon profil"
            accessibilityRole="button"
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Hero Card — vies sauvées + niveau ──────────── */}
        <View
          style={styles.heroCard}
          accessibilityLabel={`Ton impact total : ${stats.livesSaved} vies potentiellement sauvées`}
          accessibilityRole="summary"
        >
          {/* Décors circulaires en fond */}
          <View style={styles.heroDecor1} />
          <View style={styles.heroDecor2} />

          <Text style={styles.heroGreeting}>TON IMPACT TOTAL</Text>

          {/* Nombre de vies — grand nombre gradient */}
          <Text style={styles.heroLives}>{stats.livesSaved}</Text>
          <Text style={styles.heroSub}>
            vie{stats.livesSaved !== 1 ? "s" : ""} potentiellement sauvée
            {stats.livesSaved !== 1 ? "s" : ""}
          </Text>

          {/* Barre de niveau */}
          <DonationProgressBar donationCount={stats.count} />
        </View>

        {/* ── Disponibilité par type ─────────────────────── */}
        <View style={styles.typeCardSection}>
          <Text style={styles.typeSectionTitle}>Disponibilité par type</Text>
          <View style={styles.typeCardsRow}>
            {(["whole_blood", "plasma", "platelets"] as DonationType[]).map(
              (type) => {
                const info = DONATION_TYPE_LABELS[type];
                const elig = perType?.[type];
                const ok = elig?.canDonate ?? true;
                const days = elig?.daysRemaining ?? 0;
                const nextStr = elig?.eligibleFrom
                  ? format(elig.eligibleFrom, "d MMM", { locale: fr })
                  : "";
                const cooldown = DONATION_COOLDOWN_DAYS[type];
                return (
                  <View
                    key={type}
                    style={[
                      styles.typeCard,
                      ok && {
                        borderColor: DONATION_TYPE_COLORS[type].border,
                        backgroundColor: DONATION_TYPE_COLORS[type].bg,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={info.icon as any}
                      size={20}
                      color={ok ? DONATION_TYPE_COLORS[type].main : "#555555"}
                    />
                    <Text style={styles.typeCardLabel} numberOfLines={1}>
                      {info.label}
                    </Text>
                    {ok ? (
                      <View style={styles.typeCardBadgeReady}>
                        <Ionicons name="checkmark" size={16} color="#34d399" />
                      </View>
                    ) : (
                      <>
                        <CountdownRing
                          daysRemaining={days}
                          totalDays={cooldown}
                          size={44}
                        />
                        <Text style={styles.typeCardDays}>{days}j</Text>
                        {nextStr ? (
                          <Text style={styles.typeCardDate}>{nextStr}</Text>
                        ) : null}
                      </>
                    )}
                  </View>
                );
              },
            )}
          </View>
        </View>

        {/* ── CTA principal ──────────────────────────────── */}
        <TouchableOpacity
          style={[styles.ctaBtn, !canDonate && styles.ctaBtnDisabled]}
          onPress={canDonate ? handleRegister : undefined}
          activeOpacity={canDonate ? 0.85 : 1}
          accessibilityLabel={canDonate ? "Enregistrer un don" : "Don non disponible actuellement"}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canDonate }}
        >
          <MaterialCommunityIcons name="needle" size={20} color="#ffffff" />
          <Text style={styles.ctaText}>
            {canDonate
              ? "Enregistrer un don aujourd'hui"
              : "Don non disponible actuellement"}
          </Text>
        </TouchableOpacity>

        {/* ── Stats row ──────────────────────────────────── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>DONS TOTAUX</Text>
            <Text style={styles.statValue}>{stats.count}</Text>
            <Text style={styles.statSub}>
              {stats.donationsThisYear} cette année
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>STREAK</Text>
            <View style={styles.streakRow}>
              {stats.streak > 0 && (
                <MaterialCommunityIcons name="fire" size={22} color="#fb923c" />
              )}
              <Text style={styles.statValue}>
                {stats.streak > 0 ? stats.streak : "—"}
              </Text>
            </View>
            <Text style={styles.statSub}>
              {stats.streak > 0 ? "dons consécutifs" : "Donne régulièrement !"}
            </Text>
          </View>
        </View>

        {/* ── Badge row ──────────────────────────────────── */}
        <View style={styles.badgeRow}>
          {DONATION_LEVELS.map((lvl) => {
            const isUnlocked = stats.count >= lvl.minDonations;
            return (
              <MiniBadgeCard
                key={lvl.level}
                iconName={lvl.icon}
                color={lvl.color}
                name={lvl.label}
                active={isUnlocked}
              />
            );
          })}
        </View>

        {/* ── Section "Le saviez-vous ?" ─────────────────── */}
        <TouchableOpacity
          style={styles.educCard}
          onPress={() => navigation.navigate("Education")}
          activeOpacity={0.8}
        >
          <Ionicons name="bulb-outline" size={22} color="#f87171" />
          <View style={{ flex: 1 }}>
            <Text style={styles.educTitle}>Le saviez-vous ?</Text>
            <Text style={styles.educBody} numberOfLines={2}>
              Chaque don peut sauver jusqu'à 3 personnes grâce à la séparation
              en composants.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#555555" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },

  // ── Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  appName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#f5f5f5",
    letterSpacing: -0.5,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 9999,
    backgroundColor: "#f87171",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 14, fontWeight: "800", color: "#ffffff" },

  // ── Hero Card
  heroCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    padding: 24,
    overflow: "hidden",
    gap: 6,
  },
  heroDecor1: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1.5,
    borderColor: "rgba(248,113,113,0.18)",
  },
  heroDecor2: {
    position: "absolute",
    top: -25,
    right: -25,
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.1)",
  },
  heroGreeting: {
    fontSize: 11,
    color: "#888888",
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heroLives: {
    fontSize: 60,
    fontWeight: "800",
    color: "#f87171",
    lineHeight: 68,
  },
  heroSub: { fontSize: 14, color: "#888888", marginBottom: 12 },

  // ── Countdown
  countdownCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 20,
    padding: 18,
  },
  countdownRingWrap: {},
  readyRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(52,211,153,0.12)",
    borderWidth: 2,
    borderColor: "#34d399",
    alignItems: "center",
    justifyContent: "center",
  },
  countdownInfo: { flex: 1, gap: 2 },
  countdownTitle: { fontSize: 13, fontWeight: "700", color: "#f5f5f5" },
  countdownDays: { fontSize: 22, fontWeight: "800", color: "#fb923c" },
  countdownSub: { fontSize: 11, color: "#888888" },

  // ── Type cards (disponibilité par type)
  typeCardSection: { gap: 10 },
  typeSectionTitle: {
    fontSize: 11,
    color: "#888888",
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  typeCardsRow: { flexDirection: "row", gap: 8 },
  typeCard: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 4,
  },
  typeCardReady: {
    borderColor: "rgba(52,211,153,0.4)",
    backgroundColor: "rgba(52,211,153,0.07)",
  },
  typeCardLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#888888",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  typeCardBadgeReady: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(52,211,153,0.15)",
    borderWidth: 2,
    borderColor: "#34d399",
    alignItems: "center",
    justifyContent: "center",
  },
  typeCardDays: { fontSize: 13, fontWeight: "800", color: "#fb923c" },
  typeCardDate: { fontSize: 9, color: "#555555" },

  // ── CTA principal
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 17,
    borderRadius: 20,
    backgroundColor: "#f87171",
    shadowColor: "#f87171",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  ctaBtnDisabled: { backgroundColor: "#2a2a2a", shadowOpacity: 0 },
  ctaText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.2,
  },

  // ── Stats
  statsRow: { flexDirection: "row", gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 16,
    padding: 16,
    gap: 3,
  },
  statLabel: {
    fontSize: 10,
    color: "#888888",
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  statValue: { fontSize: 26, fontWeight: "800", color: "#f5f5f5" },
  statSub: { fontSize: 10, color: "#555555" },
  streakRow: { flexDirection: "row", alignItems: "center", gap: 4 },

  // ── Mini badges
  badgeRow: { flexDirection: "row", gap: 8 },
  miniBadge: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    gap: 5,
  },
  miniBadgeActive: {
    borderColor: "rgba(248,113,113,0.4)",
    backgroundColor: "rgba(248,113,113,0.08)",
  },
  miniBadgeName: {
    fontSize: 9,
    color: "#555555",
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  miniBadgeNameActive: { color: "#fca5a5" },

  // ── Education card
  educCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 16,
    padding: 16,
  },
  educTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f5f5f5",
    marginBottom: 2,
  },
  educBody: { fontSize: 12, color: "#888888", lineHeight: 18 },
});
