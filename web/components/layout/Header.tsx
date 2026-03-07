"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogIn, User } from "lucide-react";
import { Logo } from "@web/components/ui/Logo";
import { useAuth } from "@web/hooks/useAuth";

const NAV_LINKS = [
  { href: "/guide-don-du-sang", label: "Guide" },
  { href: "/groupes-sanguins", label: "Groupes sanguins" },
  { href: "/mythes-et-realites", label: "Mythes" },
  { href: "/eligibilite", label: "Éligibilité" },
  { href: "/conseils", label: "Conseils" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-(--color-border) bg-(--color-bg)/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-(--color-primary)">
          <Logo size={28} />
          <span className="text-xl font-extrabold tracking-tight">
            <span className="text-(--color-text)">life</span>drop
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-(--color-text-muted) transition-colors hover:bg-(--color-surface) hover:text-(--color-text)"
            >
              {link.label}
            </Link>
          ))}
          {!loading && (
            <Link
              href={isAuthenticated ? "/app" : "/connexion"}
              className="ml-2 inline-flex items-center gap-2 rounded-lg bg-(--color-primary) px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              {isAuthenticated ? (
                <>
                  <User className="h-4 w-4" />
                  Mon espace
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Connexion
                </>
              )}
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-(--color-text-muted) md:hidden"
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <nav className="border-t border-(--color-border) px-4 pb-4 pt-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-(--color-text-muted) transition-colors hover:bg-(--color-surface) hover:text-(--color-text)"
            >
              {link.label}
            </Link>
          ))}
          {!loading && (
            <Link
              href={isAuthenticated ? "/app" : "/connexion"}
              onClick={() => setIsOpen(false)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-(--color-primary) px-4 py-2.5 text-sm font-bold text-white"
            >
              {isAuthenticated ? (
                <>
                  <User className="h-4 w-4" />
                  Mon espace
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Connexion
                </>
              )}
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
