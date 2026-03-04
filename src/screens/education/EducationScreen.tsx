// ============================================================
// src/screens/education/EducationScreen.tsx
// Informations enrichies : stats, saviez-vous, mythes, groupe
// ============================================================

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BLOOD_TYPE_INFO } from "../../constants";
import type { EducationScreenProps } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 80;

// ─── Statistiques nationales ──────────────────────────────────
const STATS = [
  { value: "10 000", label: "dons nécessaires\nchaque jour", icon: "water", color: "#f87171" },
  { value: "4 %", label: "de la population\ndonne son sang", icon: "account-group", color: "#fb923c" },
  { value: "3 vies", label: "sauvées par\nun seul don", icon: "heart-pulse", color: "#60a5fa" },
] as const;

// ─── Cartes "Le saviez-vous ?" avec icônes ───────────────────
const KNOW_CARDS = [
  {
    id: "1",
    icon: "water" as const,
    category: "Don de sang",
    color: "#f87171",
    content: "Chaque don de sang peut sauver jusqu'à 3 personnes grâce à la séparation en composants : globules rouges, plaquettes et plasma.",
  },
  {
    id: "2",
    icon: "account-group" as const,
    category: "En France",
    color: "#fb923c",
    content: "Seulement 4 % de la population donne son sang chaque année, alors que 10 000 dons sont nécessaires chaque jour.",
  },
  {
    id: "3",
    icon: "flask" as const,
    category: "Biologie",
    color: "#a78bfa",
    content: "Le sang se compose à 55 % de plasma et à 45 % de cellules. Il ne peut pas être fabriqué artificiellement.",
  },
  {
    id: "4",
    icon: "clock-fast" as const,
    category: "Récupération",
    color: "#34d399",
    content: "Après un don de sang total, ton organisme reconstitue les globules rouges en 4 à 8 semaines.",
  },
  {
    id: "5",
    icon: "alert-circle-outline" as const,
    category: "Urgence",
    color: "#f87171",
    content: "Le groupe O- est donné en priorité en urgence car compatible avec tous. Les stocks sont souvent tendus.",
  },
  {
    id: "6",
    icon: "timer-sand" as const,
    category: "Conservation",
    color: "#fb923c",
    content: "Les plaquettes ne se conservent que 5 jours – les besoins sont donc constants et réguliers.",
  },
  {
    id: "7",
    icon: "snowflake" as const,
    category: "Plasma",
    color: "#60a5fa",
    content: "Le plasma peut être conservé jusqu'à 1 an congelé et sert notamment pour les grands brûlés.",
  },
  {
    id: "8",
    icon: "shield-check" as const,
    category: "Sécurité",
    color: "#34d399",
    content: "Donner son sang ne présente aucun risque de maladie : tout le matériel est stérile et à usage unique.",
  },
  {
    id: "9",
    icon: "cup-water" as const,
    category: "Conseil",
    color: "#60a5fa",
    content: "Boire 500 ml d'eau avant le don réduit les risques de malaise et facilite le prélèvement.",
  },
  {
    id: "10",
    icon: "account-check" as const,
    category: "Conditions",
    color: "#a78bfa",
    content: "Il faut être âgé de 18 à 70 ans et peser au moins 50 kg pour donner son sang en France.",
  },
];

// ─── Mythes & Réalités ────────────────────────────────────────
const MYTHS = [
  {
    id: "m1",
    myth: "Donner du sang fait mal.",
    reality: "Seule la piqûre de l'aiguille peut être légèrement ressentie. Le prélèvement lui-même est indolore. La plupart des donneurs décrivent l'expérience comme tout à fait confortable.",
    verdict: false,
  },
  {
    id: "m2",
    myth: "On peut attraper une maladie en donnant.",
    reality: "Impossible. Tout le matériel est stérile et à usage unique. Chaque don utilise une nouvelle aiguille ouverte devant vous.",
    verdict: false,
  },
  {
    id: "m3",
    myth: "Le corps met longtemps à récupérer.",
    reality: "Le volume sanguin prélevé (450 ml) est compensé en quelques heures. Les globules rouges se régénèrent en 4 à 8 semaines, ce qui reste bien en dessous du délai légal de 56 jours.",
    verdict: false,
  },
  {
    id: "m4",
    myth: "Les personnes tatouées ne peuvent pas donner.",
    reality: "Un tatouage récent (moins de 4 mois) impose un délai, mais au-delà, il n'y a aucune contre-indication. Des millions de donneurs tatoués donnent régulièrement.",
    verdict: false,
  },
  {
    id: "m5",
    myth: "Donner affaiblit durablement le système immunitaire.",
    reality: "Faux. Les globules blancs et le système immunitaire ne sont pas affectés par un don de sang total. Seuls les globules rouges et le plasma sont prélevés.",
    verdict: false,
  },
  {
    id: "m6",
    myth: "Les groupes A+ et O+ sont les plus utiles.",
    reality: "Vrai et faux. O+ est très demandé car fréquent, mais O- est encore plus précieux en urgence. Les groupes rares comme B- ou AB- sont souvent en tension.",
    verdict: true,
  },
  {
    id: "m7",
    myth: "Un seul don peut sauver jusqu'à 3 vies.",
    reality: "Vrai ! Chaque don de sang total est séparé en 3 composants : globules rouges, plasma et plaquettes — chacun pouvant traiter un patient différent.",
    verdict: true,
  },
];

type Tab = "know" | "myths" | "blood";

export function EducationScreen(_props: EducationScreenProps) {
  const profile = useAppStore((s) => s.profile);
  const [activeCard, setActiveCard] = useState(0);
  const [tab, setTab] = useState<Tab>("know");
  const [expandedMyth, setExpandedMyth] = useState<string | null>(null);

  const bloodInfo =
    profile?.bloodType && profile.bloodType !== "unknown"
      ? BLOOD_TYPE_INFO[profile.bloodType]
      : null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.title}>Informations</Text>
          <Text style={styles.subtitle}>
            Mieux connaître le don pour mieux s'y engager.
          </Text>
        </View>

        {/* ── Stats nationales ────────────────────────────── */}
        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.value} style={[styles.statCard, { borderColor: s.color + "35" }]}>
              <MaterialCommunityIcons name={s.icon as any} size={20} color={s.color} />
              <Text style={[styles.statVal, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Onglets ─────────────────────────────────────── */}
        <View style={styles.tabs}>
          {([
            { key: "know" as Tab, label: "Saviez-vous ?", icon: "bulb-outline" },
            { key: "myths" as Tab, label: "Mythes", icon: "help-circle-outline" },
            { key: "blood" as Tab, label: "Mon groupe", icon: "water" },
          ] as const).map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, tab === t.key && styles.tabActive]}
              onPress={() => setTab(t.key)}
              activeOpacity={0.75}
            >
              <Ionicons
                name={t.icon as any}
                size={13}
                color={tab === t.key ? "#f87171" : "#888888"}
              />
              <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Onglet "Le saviez-vous ?" ─────────────────── */}
        {tab === "know" && (
          <>
            <FlatList
              data={KNOW_CARDS}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + 16}
              decelerationRate="fast"
              contentContainerStyle={styles.cardList}
              style={{ height: 220 }}
              onMomentumScrollEnd={(e) => {
                const idx = Math.round(
                  e.nativeEvent.contentOffset.x / (CARD_WIDTH + 16),
                );
                setActiveCard(idx);
              }}
              renderItem={({ item }) => (
                <View style={[styles.knowCard, { width: CARD_WIDTH, borderColor: item.color + "30" }]}>
                  {/* Catégorie + icône */}
                  <View style={styles.knowCardHeader}>
                    <View style={[styles.knowIconWrap, { backgroundColor: item.color + "30" }]}>
                      <MaterialCommunityIcons name={item.icon as any} size={18} color={item.color} />
                    </View>
                    <Text style={[styles.knowCategory, { color: item.color }]}>{item.category}</Text>
                    <Text style={styles.knowNumber}>{item.id.padStart(2, "0")}/{KNOW_CARDS.length}</Text>
                  </View>
                  <Text style={styles.knowText}>{item.content}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled
              nestedScrollEnabled
            />
            {/* Dots */}
            <View style={styles.dotsRow}>
              {KNOW_CARDS.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dotInd,
                    activeCard === i && [styles.dotIndActive, { backgroundColor: KNOW_CARDS[i].color }],
                  ]}
                />
              ))}
            </View>
          </>
        )}

        {/* ── Onglet Mythes & Réalités ─────────────────── */}
        {tab === "myths" && (
          <View style={styles.mythsSection}>
            <Text style={styles.mythsIntro}>
              Appuie sur un mythe pour découvrir la réalité.
            </Text>
            {MYTHS.map((m) => {
              const isOpen = expandedMyth === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.mythCard, isOpen && styles.mythCardOpen]}
                  onPress={() => setExpandedMyth(isOpen ? null : m.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.mythHeader}>
                    <View style={[
                      styles.verdictBadge,
                      { backgroundColor: m.verdict ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)" },
                    ]}>
                      <MaterialCommunityIcons
                        name={m.verdict ? "check-circle-outline" : "close-circle-outline"}
                        size={14}
                        color={m.verdict ? "#34d399" : "#f87171"}
                      />
                      <Text style={[styles.verdictText, { color: m.verdict ? "#34d399" : "#f87171" }]}>
                        {m.verdict ? "Vrai" : "Faux"}
                      </Text>
                    </View>
                    <Text style={styles.mythText} numberOfLines={isOpen ? undefined : 2}>
                      {m.myth}
                    </Text>
                    <Ionicons
                      name={isOpen ? "chevron-up" : "chevron-down"}
                      size={16}
                      color="#555555"
                    />
                  </View>
                  {isOpen && (
                    <View style={styles.mythReality}>
                      <View style={styles.mythRealityDivider} />
                      <Text style={styles.mythRealityText}>{m.reality}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ── Onglet Mon groupe ───────────────────────────── */}
        {tab === "blood" && (
          <View style={styles.bloodSection}>
            {bloodInfo && profile?.bloodType ? (
              <>
                <View style={styles.bloodHero}>
                  <View style={styles.bloodHeroDecor} />
                  <Text style={styles.bloodHeroType}>{profile.bloodType}</Text>
                  <Text style={styles.bloodHeroDesc}>{bloodInfo.description}</Text>
                </View>

                {/* Compatibilités */}
                <View style={styles.bloodCompatCard}>
                  <View style={styles.bloodCompatHeader}>
                    <Ionicons name="arrow-down-circle-outline" size={16} color="#888888" />
                    <Text style={styles.bloodCompatTitle}>Tu peux recevoir de</Text>
                  </View>
                  <View style={styles.bloodChipRow}>
                    {bloodInfo.canReceiveFrom.map((t) => (
                      <View key={t} style={styles.bloodChip}>
                        <Text style={styles.bloodChipText}>{t}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.bloodCompatCard}>
                  <View style={styles.bloodCompatHeader}>
                    <Ionicons name="arrow-up-circle-outline" size={16} color="#f87171" />
                    <Text style={[styles.bloodCompatTitle, { color: "#f5f5f5" }]}>Tu peux donner à</Text>
                  </View>
                  <View style={styles.bloodChipRow}>
                    {bloodInfo.canDonateTo.map((t) => (
                      <View key={t} style={[styles.bloodChip, styles.bloodChipActive]}>
                        <Text style={[styles.bloodChipText, styles.bloodChipTextActive]}>{t}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Mini conseil lié au groupe */}
                <View style={styles.bloodTipCard}>
                  <MaterialCommunityIcons name="information-outline" size={16} color="#60a5fa" />
                  <Text style={styles.bloodTipText}>
                    {bloodInfo.canDonateTo.length >= 6
                      ? "Ton groupe est universel — il est particulièrement précieux pour les urgences."
                      : bloodInfo.canReceiveFrom.length <= 2
                      ? "Ton groupe est rare — chaque don que tu fais compte énormément."
                      : "Donne régulièrement pour maintenir les stocks de ton groupe."}
                  </Text>
                </View>
              </>
            ) : (
              <View style={styles.noBlood}>
                <MaterialCommunityIcons name="water-outline" size={40} color="#333333" />
                <Text style={styles.noBloodTitle}>Groupe non renseigné</Text>
                <Text style={styles.noBloodText}>
                  Renseigne ton groupe sanguin dans ton profil pour accéder à ton guide personnalisé.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 20,
  },

  header: { gap: 6 },
  title: { fontSize: 28, fontWeight: "800", color: "#f5f5f5" },
  subtitle: { fontSize: 14, color: "#888888" },

  // ── Stats ──────────────────────────────────────────────────
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    gap: 4,
  },
  statVal: { fontSize: 18, fontWeight: "800" },
  statLabel: { fontSize: 10, color: "#888888", textAlign: "center", lineHeight: 14 },

  // ── Tabs ───────────────────────────────────────────────────
  tabs: { flexDirection: "row", gap: 8 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  tabActive: {
    borderColor: "#f87171",
    backgroundColor: "rgba(248,113,113,0.1)",
  },
  tabText: { fontSize: 11, fontWeight: "700", color: "#888888" },
  tabTextActive: { color: "#f87171" },

  // ── Know cards ─────────────────────────────────────────────
  cardList: { paddingHorizontal: 4, gap: 16 },
  knowCard: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderRadius: 20,
    padding: 22,
    gap: 14,
  },
  knowCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  knowIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  knowCategory: { fontSize: 12, fontWeight: "700", flex: 1 },
  knowNumber: { fontSize: 11, color: "#444444", fontWeight: "700" },
  knowText: { fontSize: 15, color: "#f5f5f5", lineHeight: 24 },

  dotsRow: { flexDirection: "row", justifyContent: "center", gap: 6 },
  dotInd: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#2a2a2a" },
  dotIndActive: { width: 16 },

  // ── Myths ──────────────────────────────────────────────────
  mythsSection: { gap: 10 },
  mythsIntro: { fontSize: 13, color: "#888888", textAlign: "center" },
  mythCard: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 16,
    padding: 16,
  },
  mythCardOpen: {
    borderColor: "#3a3a3a",
  },
  mythHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  verdictBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    minWidth: 56,
    justifyContent: "center",
    marginTop: 1,
  },
  verdictText: { fontSize: 11, fontWeight: "800" },
  mythText: { flex: 1, fontSize: 14, color: "#f5f5f5", fontWeight: "600", lineHeight: 20 },
  mythReality: { gap: 10, marginTop: 12 },
  mythRealityDivider: { height: 1, backgroundColor: "#2a2a2a" },
  mythRealityText: { fontSize: 13, color: "#aaaaaa", lineHeight: 20 },

  // ── Blood group ────────────────────────────────────────────
  bloodSection: { gap: 14 },
  bloodHero: {
    backgroundColor: "rgba(248,113,113,0.08)",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.25)",
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    gap: 10,
    overflow: "hidden",
    position: "relative",
  },
  bloodHeroDecor: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(248,113,113,0.08)",
  },
  bloodHeroType: { fontSize: 56, fontWeight: "800", color: "#f87171" },
  bloodHeroDesc: { fontSize: 14, color: "#aaaaaa", textAlign: "center", lineHeight: 22 },

  bloodCompatCard: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  bloodCompatHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  bloodCompatTitle: {
    fontSize: 13,
    color: "#888888",
    fontWeight: "700",
  },
  bloodChipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  bloodChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: "#222222",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  bloodChipActive: {
    backgroundColor: "rgba(248,113,113,0.12)",
    borderColor: "rgba(248,113,113,0.3)",
  },
  bloodChipText: { fontSize: 13, fontWeight: "700", color: "#888888" },
  bloodChipTextActive: { color: "#f87171" },

  bloodTipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(96,165,250,0.08)",
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.2)",
    borderRadius: 14,
    padding: 14,
  },
  bloodTipText: { flex: 1, fontSize: 13, color: "#aaaaaa", lineHeight: 20 },

  noBlood: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    gap: 12,
  },
  noBloodTitle: { fontSize: 16, fontWeight: "700", color: "#f5f5f5" },
  noBloodText: { fontSize: 14, color: "#888888", textAlign: "center", lineHeight: 22 },
});
