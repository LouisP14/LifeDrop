import type { Metadata } from "next";
import Link from "next/link";
import {
  Droplets,
  Heart,
  Users,
  HeartPulse,
  ShieldCheck,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Download,
} from "lucide-react";
import { NATIONAL_STATS } from "@shared/content/stats";
import { JsonLd } from "@web/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "LifeDrop - Application gratuite de suivi du don du sang en France",
  description:
    "Suivez vos dons de sang, verifiez votre eligibilite, decouvrez la compatibilite de votre groupe sanguin. Application gratuite pour les donneurs de sang en France.",
  alternates: { canonical: "/" },
};

const STAT_ICONS: Record<string, React.ReactNode> = {
  droplets: <Droplets className="h-6 w-6" />,
  users: <Users className="h-6 w-6" />,
  "heart-pulse": <HeartPulse className="h-6 w-6" />,
};

const FEATURES = [
  {
    icon: <CheckCircle className="h-6 w-6 text-[var(--color-green)]" />,
    title: "Verifiez votre eligibilite",
    description: "Calculez en temps reel quand vous pouvez donner a nouveau selon le type de don.",
    href: "/eligibilite",
  },
  {
    icon: <Droplets className="h-6 w-6 text-[var(--color-primary)]" />,
    title: "Compatibilite des groupes",
    description: "Decouvrez a qui vous pouvez donner et de qui vous pouvez recevoir.",
    href: "/groupes-sanguins",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-[var(--color-blue)]" />,
    title: "Mythes et realites",
    description: "Demystifiez les idees recues sur le don du sang avec des faits verifies.",
    href: "/mythes-et-realites",
  },
  {
    icon: <BookOpen className="h-6 w-6 text-[var(--color-purple)]" />,
    title: "Guide complet",
    description: "Tout ce qu'il faut savoir avant, pendant et apres un don de sang.",
    href: "/guide-don-du-sang",
  },
];

export default function HomePage() {
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "LifeDrop",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    description:
      "Application gratuite de suivi du don du sang en France. Suivez vos dons, verifiez votre eligibilite et mesurez votre impact.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    inLanguage: "fr",
  };

  return (
    <>
      <JsonLd data={webAppSchema} />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-20 md:pb-24 md:pt-32">
        {/* Gradient bg */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(248,113,113,0.06)] to-transparent" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5 text-sm text-[var(--color-text-muted)]">
            <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
            100% gratuit &middot; Sans publicite
          </div>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Chaque don compte.
            <br />
            <span className="text-[var(--color-primary)]">
              Chaque vie aussi.
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--color-text-muted)] md:text-xl">
            Suivez vos dons de sang, verifiez votre eligibilite et mesurez
            votre impact. L&apos;application gratuite pour les donneurs de sang
            en France.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-8 py-3.5 text-base font-bold text-white transition-opacity hover:opacity-90"
            >
              <Heart className="h-5 w-5" />
              Commencer a suivre mes dons
            </Link>
            <Link
              href="/guide-don-du-sang"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-8 py-3.5 text-base font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
            >
              En savoir plus
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 pb-16">
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
          {NATIONAL_STATS.map((stat) => (
            <div
              key={stat.value}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center"
            >
              <div
                className="mb-2 inline-flex rounded-xl p-2.5"
                style={{ backgroundColor: stat.color + "15", color: stat.color }}
              >
                {STAT_ICONS[stat.icon] ?? <Droplets className="h-6 w-6" />}
              </div>
              <div className="text-3xl font-extrabold" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-[var(--color-text-muted)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-extrabold md:text-3xl">
            Tout savoir sur le don du sang
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors hover:border-[var(--color-primary)]/30"
              >
                <div className="mb-3">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {feature.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] opacity-0 transition-opacity group-hover:opacity-100">
                  Decouvrir <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[var(--color-primary)]/20 bg-gradient-to-br from-[rgba(248,113,113,0.08)] to-transparent p-8 text-center md:p-12">
          <h2 className="mb-3 text-2xl font-extrabold">
            Pret a sauver des vies ?
          </h2>
          <p className="mb-6 text-[var(--color-text-muted)]">
            Rejoignez les donneurs qui suivent leur impact avec LifeDrop.
            Gratuit, sans inscription, sans pub.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-8 py-3.5 text-base font-bold text-white transition-opacity hover:opacity-90"
          >
            <Download className="h-5 w-5" />
            Installer LifeDrop
          </Link>
        </div>
      </section>
    </>
  );
}
