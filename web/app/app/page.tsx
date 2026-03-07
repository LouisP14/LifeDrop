"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Droplets } from "lucide-react";
import { AppShell } from "@web/components/app/AppShell";
import { useAuth } from "@web/hooks/useAuth";
import { useAppStore } from "@web/lib/store";

export default function AppPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [synced, setSynced] = useState(false);
  const { user, loading } = useAuth();
  const syncWithSupabase = useAppStore((s) => s.syncWithSupabase);

  useEffect(() => setMounted(true), []);

  // Redirect to /connexion if not authenticated
  useEffect(() => {
    if (mounted && !loading && !user) {
      router.replace("/connexion");
    }
  }, [mounted, loading, user, router]);

  // Sync with Supabase when authenticated
  useEffect(() => {
    if (user && !synced) {
      syncWithSupabase(user.id)
        .then(() => setSynced(true))
        .catch(() => setSynced(true)); // Continue even if sync fails
    }
  }, [user, synced, syncWithSupabase]);

  if (!mounted || loading || !user || !synced) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Droplets className="h-8 w-8 animate-pulse text-(--color-primary)" />
      </div>
    );
  }

  return <AppShell />;
}
