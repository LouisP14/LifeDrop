"use client";

import { useState, useEffect } from "react";
import { Droplets } from "lucide-react";
import { AppShell } from "@web/components/app/AppShell";
import { useAuth } from "@web/hooks/useAuth";
import { useAppStore } from "@web/lib/store";

export default function AppPage() {
  const [mounted, setMounted] = useState(false);
  const [synced, setSynced] = useState(false);
  const { user, loading } = useAuth();
  const syncWithSupabase = useAppStore((s) => s.syncWithSupabase);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (user && !synced) {
      syncWithSupabase(user.id).then(() => setSynced(true));
    }
  }, [user, synced, syncWithSupabase]);

  if (!mounted || loading || (user && !synced)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Droplets className="h-8 w-8 animate-pulse text-(--color-primary)" />
      </div>
    );
  }

  return <AppShell />;
}
