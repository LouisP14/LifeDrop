"use client";

import { Bell, BellOff, Loader2 } from "lucide-react";
import { usePushNotifications } from "@web/hooks/usePushNotifications";

export function NotificationToggle() {
  const { isSupported, isSubscribed, loading, permission, subscribe, unsubscribe } =
    usePushNotifications();

  if (!isSupported) return null;

  const handleToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  const isDenied = permission === "denied";

  return (
    <button
      onClick={handleToggle}
      disabled={loading || isDenied}
      role="switch"
      aria-checked={isSubscribed}
      aria-label={isSubscribed ? "Desactiver les notifications" : "Activer les notifications"}
      className="flex w-full items-center gap-3 rounded-2xl border border-(--color-border) bg-(--color-surface) p-4 transition-all hover:border-(--color-primary)/30 disabled:opacity-50"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{
          backgroundColor: isSubscribed ? "rgba(248,113,113,0.1)" : "rgba(255,255,255,0.05)",
          color: isSubscribed ? "var(--color-primary)" : "var(--color-text-muted)",
        }}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isSubscribed ? (
          <Bell className="h-5 w-5" />
        ) : (
          <BellOff className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-bold">
          {isSubscribed ? "Notifications activees" : "Activer les notifications"}
        </p>
        <p className="text-xs text-(--color-text-muted)">
          {isDenied
            ? "Notifications bloquees par le navigateur"
            : isSubscribed
              ? "Tu seras prevenu quand tu pourras redonner"
              : "Rappels a J-7 et le jour ou tu es eligible"}
        </p>
      </div>
      <div
        className="h-6 w-11 rounded-full p-0.5 transition-colors"
        style={{
          backgroundColor: isSubscribed ? "var(--color-primary)" : "var(--color-border)",
        }}
      >
        <div
          className="h-5 w-5 rounded-full bg-white shadow transition-transform"
          style={{ transform: isSubscribed ? "translateX(20px)" : "translateX(0)" }}
        />
      </div>
    </button>
  );
}
