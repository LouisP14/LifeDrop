import { supabase } from "./supabase";
import type { UserProfile, Donation, Badge, BloodType, BiologicalSex, DonationType } from "@shared/types";

// ─── Profile ────────────────────────────────────────────

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name ?? undefined,
    bloodType: data.blood_type as BloodType,
    sex: data.sex as BiologicalSex,
    onboardingCompleted: data.onboarding_completed,
    notificationsEnabled: data.notifications_enabled,
    referralCode: data.referral_code ?? undefined,
    teamCode: data.team_code ?? undefined,
    createdAt: data.created_at,
  };
}

export async function upsertProfile(
  userId: string,
  profile: Partial<UserProfile>,
) {
  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    name: profile.name,
    blood_type: profile.bloodType,
    sex: profile.sex,
    onboarding_completed: profile.onboardingCompleted,
    notifications_enabled: profile.notificationsEnabled,
    team_code: profile.teamCode,
  });

  if (error) throw error;
}

// ─── Donations ──────────────────────────────────────────

export async function fetchDonations(userId: string): Promise<Donation[]> {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((d) => ({
    id: d.id,
    date: d.date,
    type: d.type as DonationType,
    location: d.location ?? undefined,
    notes: d.notes ?? undefined,
  }));
}

export async function insertDonation(userId: string, donation: Donation) {
  const { error } = await supabase.from("donations").insert({
    id: donation.id,
    user_id: userId,
    date: donation.date,
    type: donation.type,
    location: donation.location,
    notes: donation.notes,
  });

  if (error) throw error;
}

export async function updateDonation(userId: string, donation: Donation) {
  const { error } = await supabase
    .from("donations")
    .update({
      date: donation.date,
      type: donation.type,
      location: donation.location,
      notes: donation.notes,
    })
    .eq("id", donation.id)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function deleteDonation(userId: string, donationId: string) {
  const { error } = await supabase
    .from("donations")
    .delete()
    .eq("id", donationId)
    .eq("user_id", userId);

  if (error) throw error;
}

// ─── Badges ─────────────────────────────────────────────

export async function fetchUserBadges(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId);

  if (error) throw error;

  return (data ?? []).map((b) => b.badge_id);
}

export async function upsertUserBadges(userId: string, badgeIds: string[]) {
  // Remove badges that are no longer earned
  const { data: existing } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId);

  const existingIds = (existing ?? []).map((b) => b.badge_id);
  const toRemove = existingIds.filter((id) => !badgeIds.includes(id));

  if (toRemove.length > 0) {
    await supabase
      .from("user_badges")
      .delete()
      .eq("user_id", userId)
      .in("badge_id", toRemove);
  }

  // Upsert current badges
  if (badgeIds.length === 0) return;

  const rows = badgeIds.map((badgeId) => ({
    user_id: userId,
    badge_id: badgeId,
    unlocked_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("user_badges")
    .upsert(rows, { onConflict: "user_id,badge_id" });

  if (error) throw error;
}
