// ============================================================
// src/services/NotificationService.ts
// Gestion des notifications push Expo
// ─ Demande de permission
// ─ 3 rappels par don : J-7 · J-3 · J (le jour J)
// ─ Annulation ciblée par type de don
// ============================================================

import { addDays, parseISO } from "date-fns";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { DONATION_COOLDOWN_DAYS } from "../constants";
import type { Donation, DonationType } from "../types";

// ─── Configuration globale du handler ────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/** Labels lisibles pour les messages de notif */
const TYPE_LABELS: Record<DonationType, string> = {
  whole_blood: "sang total",
  platelets: "plaquettes",
  plasma: "plasma",
};

class NotificationService {
  /** IDs des notifs planifiées, indexés par type de don */
  private scheduledByType: Partial<Record<DonationType, string[]>> = {};

  // ── Permission ─────────────────────────────────────────
  async requestPermission(): Promise<boolean> {
    if (!Device.isDevice) {
      console.warn("[Notif] Notifications indisponibles sur émulateur");
      return false;
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === "granted") return true;

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return false;

    // Android 12+ : canal de notification
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "LifeDrop Rappels",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#f87171",
      });
    }

    return true;
  }

  // ── Planifie 3 rappels après un don ────────────────────
  // J-7 · J-3 · J (10h00 chaque fois)
  async scheduleNextDonationReminder(donation: Donation): Promise<void> {
    // Annule uniquement les anciens rappels de CE type
    await this.cancelRemindersForType(donation.type);

    const cooldown = DONATION_COOLDOWN_DAYS[donation.type];
    const donationDate = parseISO(donation.date);
    const eligibleDate = addDays(donationDate, cooldown);
    const typeLabel = TYPE_LABELS[donation.type];

    const reminders: { offsetDays: number; title: string; body: string }[] = [
      {
        offsetDays: -7,
        title: "⏳ Plus que 7 jours !",
        body: `Dans 7 jours tu pourras à nouveau donner ton ${typeLabel}. Pense à prendre RDV.`,
      },
      {
        offsetDays: -3,
        title: "⏰ Plus que 3 jours !",
        body: `Ton prochain don de ${typeLabel} est dans 3 jours. Les stocks t'attendent !`,
      },
      {
        offsetDays: 0,
        title: "💉 Tu peux à nouveau donner !",
        body: `Le délai est écoulé — tu peux donner ton ${typeLabel} aujourd'hui. Merci pour ton engagement ❤️`,
      },
    ];

    const scheduledIds: string[] = [];

    for (const { offsetDays, title, body } of reminders) {
      const triggerDate = addDays(eligibleDate, offsetDays);
      triggerDate.setHours(10, 0, 0, 0);

      // On ignore les dates passées
      if (triggerDate.getTime() <= Date.now()) continue;

      try {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data: { type: "donation_reminder", donationType: donation.type },
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate,
          },
        });
        scheduledIds.push(id);
      } catch (e) {
        console.warn(`[Notif] Échec planification (offset ${offsetDays}j)`, e);
      }
    }

    this.scheduledByType[donation.type] = scheduledIds;
  }

  // ── Annule les rappels d'un type précis ───────────────
  async cancelRemindersForType(type: DonationType): Promise<void> {
    const ids = this.scheduledByType[type] ?? [];
    for (const id of ids) {
      try {
        await Notifications.cancelScheduledNotificationAsync(id);
      } catch {
        // ignoré si l'ID n'existe plus
      }
    }
    this.scheduledByType[type] = [];
  }

  // ── Annule tous les rappels (tous types) ──────────────
  async cancelAllReminders(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    this.scheduledByType = {};
  }

  // ── IDs planifiés pour un type ────────────────────────
  getScheduledIdsForType(type: DonationType): string[] {
    return [...(this.scheduledByType[type] ?? [])];
  }
}

// Export singleton
export const notificationService = new NotificationService();
