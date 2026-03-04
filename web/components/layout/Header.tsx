"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Download } from "lucide-react";
import { Logo } from "@web/components/ui/Logo";

const NAV_LINKS = [
  { href: "/guide-don-du-sang", label: "Guide" },
  { href: "/groupes-sanguins", label: "Groupes sanguins" },
  { href: "/mythes-et-realites", label: "Mythes" },
  { href: "/eligibilite", label: "Eligibilite" },
  { href: "/conseils", label: "Conseils" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-[var(--color-primary)]">
          <Logo size={28} />
          <span className="text-xl font-extrabold tracking-tight">
            life<span className="text-[var(--color-text)]">drop</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/app"
            className="ml-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            <Download className="h-4 w-4" />
            Installer l&apos;app
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-[var(--color-text-muted)] md:hidden"
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <nav className="border-t border-[var(--color-border)] px-4 pb-4 pt-2 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/app"
            onClick={() => setIsOpen(false)}
            className="mt-2 block rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-center text-sm font-bold text-white"
          >
            <Download className="h-4 w-4" />
            Installer l&apos;app
          </Link>
        </nav>
      )}
    </header>
  );
}
