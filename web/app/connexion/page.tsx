"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Droplets, Mail, Lock, Eye, EyeOff, ArrowRight, UserPlus, LogIn } from "lucide-react";
import { Logo } from "@web/components/ui/Logo";
import { useAuth } from "@web/hooks/useAuth";

type Mode = "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, isAuthenticated } = useAuth();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/app";
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Droplets className="h-8 w-8 animate-pulse text-(--color-primary)" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email.trim() || !password.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
        window.location.href = "/app";
      } else {
        await signUp(email, password);
        setSuccessMessage(
          "Compte cree ! Verifiez votre email pour confirmer votre inscription.",
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Une erreur est survenue.";
      if (message.includes("Invalid login")) {
        setError("Email ou mot de passe incorrect.");
      } else if (message.includes("already registered")) {
        setError("Cet email est deja utilise.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Logo size={56} />
          </div>
          <h1 className="mb-1 text-2xl font-extrabold">
            <span className="text-[var(--color-text)]">life</span>
            <span className="text-[var(--color-primary)]">drop</span>
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            {mode === "login"
              ? "Connecte-toi pour acceder a ton espace"
              : "Cree ton compte pour commencer"}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
          <button
            onClick={() => { setMode("login"); setError(""); setSuccessMessage(""); }}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all"
            style={{
              backgroundColor: mode === "login" ? "var(--color-primary)" : "transparent",
              color: mode === "login" ? "white" : "var(--color-text-muted)",
            }}
          >
            <LogIn className="h-4 w-4" />
            Connexion
          </button>
          <button
            onClick={() => { setMode("signup"); setError(""); setSuccessMessage(""); }}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all"
            style={{
              backgroundColor: mode === "signup" ? "var(--color-primary)" : "transparent",
              color: mode === "signup" ? "white" : "var(--color-text-muted)",
            }}
          >
            <UserPlus className="h-4 w-4" />
            Inscription
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="mb-1 flex items-center gap-1 text-sm font-medium text-[var(--color-text-muted)]">
              <Mail className="h-3.5 w-3.5" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              autoComplete="email"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 flex items-center gap-1 text-sm font-medium text-[var(--color-text-muted)]">
              <Lock className="h-3.5 w-3.5" /> Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 caracteres"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 pr-12 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 outline-none focus:border-[var(--color-primary)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm password (signup only) */}
          {mode === "signup" && (
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium text-[var(--color-text-muted)]">
                <Lock className="h-3.5 w-3.5" /> Confirmer le mot de passe
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Retape ton mot de passe"
                autoComplete="new-password"
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]/50 outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Success */}
          {successMessage && (
            <div className="rounded-xl border border-[var(--color-green)]/30 bg-[var(--color-green)]/10 px-4 py-3 text-sm text-[var(--color-green)]">
              {successMessage}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3.5 text-base font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
          >
            {loading ? (
              <Droplets className="h-5 w-5 animate-pulse" />
            ) : (
              <>
                <ArrowRight className="h-5 w-5" />
                {mode === "login" ? "Se connecter" : "Creer mon compte"}
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[var(--color-text-muted)]">
          100% gratuit &middot; Tes donnees restent privees
        </p>
      </div>
    </div>
  );
}
