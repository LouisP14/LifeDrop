"use client";

import { useState, useEffect } from "react";
import { Gift, Copy, Check, Users, Share2 } from "lucide-react";
import { useAppStore } from "@web/lib/store";
import { getSupabase } from "@web/lib/supabase";

export function ReferralCard() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalReferred: 0, activeReferred: 0 });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabaseUserId = useAppStore((s) => s.supabaseUserId);

  useEffect(() => {
    if (!supabaseUserId) return;

    const fetchReferral = async () => {
      try {
        const { data: { session } } = await getSupabase().auth.getSession();
        if (!session) return;

        const res = await fetch("/api/referral", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setReferralCode(data.referralCode);
          setStats({ totalReferred: data.totalReferred, activeReferred: data.activeReferred });
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };

    fetchReferral();
  }, [supabaseUserId]);

  const shareUrl = referralCode
    ? `${window.location.origin}/connexion?ref=${referralCode}`
    : "";

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!shareUrl || !navigator.share) {
      handleCopy();
      return;
    }
    try {
      await navigator.share({
        title: "Rejoins LifeDrop !",
        text: `Utilise mon code ${referralCode} pour rejoindre LifeDrop et suivre tes dons du sang !`,
        url: shareUrl,
      });
    } catch {
      // user cancelled
    }
  };

  if (loading) return null;

  return (
    <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--color-accent)/10">
          <Gift className="h-4.5 w-4.5 text-(--color-accent)" />
        </div>
        <div>
          <p className="text-sm font-bold">Parrainage</p>
          <p className="text-xs text-(--color-text-muted)">Invite tes amis a donner</p>
        </div>
      </div>

      {/* Referral code */}
      {referralCode && (
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-(--color-border) bg-(--color-bg) p-3">
          <code className="flex-1 text-center text-sm font-bold tracking-wider text-(--color-primary)">
            {referralCode}
          </code>
          <button
            onClick={handleCopy}
            aria-label="Copier le lien"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--color-primary)/10 text-(--color-primary) transition-all hover:bg-(--color-primary)/20"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      )}

      {/* Stats */}
      {stats.totalReferred > 0 && (
        <div className="mb-3 flex items-center gap-2 text-xs text-(--color-text-muted)">
          <Users className="h-3.5 w-3.5" />
          <span>
            {stats.totalReferred} filleul{stats.totalReferred > 1 ? "s" : ""}
            {stats.activeReferred > 0 && (
              <span className="text-(--color-green)"> · {stats.activeReferred} actif{stats.activeReferred > 1 ? "s" : ""}</span>
            )}
          </span>
        </div>
      )}

      {/* Share button */}
      <button
        onClick={handleShare}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--color-primary) py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
      >
        <Share2 className="h-4 w-4" />
        Partager mon lien
      </button>
    </div>
  );
}
