import type { Metadata } from "next";
import Link from "next/link";
import { Droplets, Clock, FlaskConical, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@web/components/seo/Breadcrumbs";
import { JsonLd } from "@web/components/seo/JsonLd";
import { DID_YOU_KNOW } from "@shared/content/did-you-know";
import { TIPS_BEFORE, TIPS_AFTER } from "@shared/content/donation-tips";
import { DONATION_COOLDOWN_DAYS, DONATION_TYPE_LABELS, LIVES_PER_DONATION_TYPE } from "@shared/constants";

export const metadata: Metadata = {
  title: "Guide complet du don du sang en France",
  description:
    "Tout ce qu'il faut savoir pour donner son sang en France : conditions, types de dons, déroulement, conseils avant et après. Guide complet et gratuit.",
  alternates: { canonical: "/guide-don-du-sang" },
  openGraph: {
    title: "Guide complet du don du sang en France",
    description: "Tout savoir pour donner son sang : types de dons, conditions, conseils. Guide gratuit.",
  },
};

const DONATION_TYPES = [
  { key: "whole_blood" as const, icon: <Droplets className="h-5 w-5" />, color: "#f87171" },
  { key: "platelets" as const, icon: <Clock className="h-5 w-5" />, color: "#fb923c" },
  { key: "plasma" as const, icon: <FlaskConical className="h-5 w-5" />, color: "#60a5fa" },
];

export default function GuideDonDuSangPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Guide complet du don du sang en France",
    description: "Tout ce qu'il faut savoir pour donner son sang en France.",
    author: { "@type": "Organization", name: "LifeDrop" },
    publisher: { "@type": "Organization", name: "LifeDrop" },
    inLanguage: "fr",
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://lifedrop.fr/guide-don-du-sang" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Quels sont les types de dons de sang possibles ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Il existe 3 types de dons : le don de sang total (le plus courant, délai de 56 jours), le don de plaquettes (délai de 28 jours) et le don de plasma (délai de 14 jours). Chaque type répond à des besoins médicaux différents.",
        },
      },
      {
        "@type": "Question",
        name: "Quelles sont les conditions pour donner son sang ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Il faut avoir entre 18 et 70 ans, peser au minimum 50 kg, être en bonne santé générale, respecter le délai légal depuis le dernier don et présenter une pièce d'identité valide.",
        },
      },
      {
        "@type": "Question",
        name: "Comment se préparer avant un don de sang ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Dormez suffisamment la veille, mangez un repas léger 2-3h avant, buvez au moins 500 ml d'eau, évitez l'alcool dans les 24h précédentes et apportez une pièce d'identité.",
        },
      },
      {
        "@type": "Question",
        name: "Que faire après un don de sang ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Restez assis 10-15 minutes, prenez une collation, hydratez-vous bien, évitez les efforts physiques intenses pendant 24h et ne fumez pas pendant au moins 1 heure.",
        },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={articleSchema} />
      <JsonLd data={faqSchema} />
      <Breadcrumbs items={[{ label: "Guide du don du sang" }]} />

      <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">
        Guide complet du don du sang en France
      </h1>
      <p className="mb-10 text-lg text-(--color-text-muted)">
        Tout ce qu&apos;il faut savoir pour donner son sang : types de dons,
        conditions d&apos;éligibilité, déroulement et conseils pratiques.
      </p>

      {/* Types de dons */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Les types de dons</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {DONATION_TYPES.map(({ key, icon, color }) => {
            const label = DONATION_TYPE_LABELS[key];
            const cooldown = DONATION_COOLDOWN_DAYS[key];
            const lives = LIVES_PER_DONATION_TYPE[key];
            return (
              <div
                key={key}
                className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6"
              >
                <div
                  className="mb-3 inline-flex rounded-xl p-2.5"
                  style={{ backgroundColor: color + "15", color }}
                >
                  {icon}
                </div>
                <h3 className="mb-1 text-lg font-bold">{label.label}</h3>
                <p className="text-sm text-(--color-text-muted)">
                  Délai entre deux dons : <strong>{cooldown} jours</strong>
                </p>
                <p className="text-sm text-(--color-text-muted)">
                  Vies sauvées : <strong style={{ color }}>{lives}</strong> par don
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Conditions */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">
          Conditions d&apos;éligibilité
        </h2>
        <div className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6">
          <ul className="space-y-3 text-(--color-text-muted)">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-(--color-green)">&#10003;</span>
              Avoir entre <strong className="text-(--color-text)">18 et 70 ans</strong>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-(--color-green)">&#10003;</span>
              Peser au minimum <strong className="text-(--color-text)">50 kg</strong>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-(--color-green)">&#10003;</span>
              Etre en <strong className="text-(--color-text)">bonne santé générale</strong>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-(--color-green)">&#10003;</span>
              Respecter le <strong className="text-(--color-text)">délai legal</strong> depuis le dernier don
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-(--color-green)">&#10003;</span>
              Présenter une <strong className="text-(--color-text)">piece d&apos;identité</strong> valide
            </li>
          </ul>
          <div className="mt-4">
            <Link
              href="/eligibilite"
              className="inline-flex items-center gap-1 text-sm font-medium text-(--color-primary)"
            >
              Vérifier mon éligibilité <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Avant le don */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Avant le don</h2>
        <div className="space-y-3">
          {TIPS_BEFORE.map((tip, i) => (
            <div
              key={tip.id}
              className="flex gap-4 rounded-xl border border-(--color-border) bg-(--color-surface) p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--color-primary)/10 text-sm font-bold text-(--color-primary)">
                {i + 1}
              </span>
              <div>
                <h3 className="font-bold">{tip.title}</h3>
                <p className="mt-1 text-sm text-(--color-text-muted)">
                  {tip.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Après le don */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Après le don</h2>
        <div className="space-y-3">
          {TIPS_AFTER.map((tip, i) => (
            <div
              key={tip.id}
              className="flex gap-4 rounded-xl border border-(--color-border) bg-(--color-surface) p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--color-blue)/10 text-sm font-bold text-(--color-blue)">
                {i + 1}
              </span>
              <div>
                <h3 className="font-bold">{tip.title}</h3>
                <p className="mt-1 text-sm text-(--color-text-muted)">
                  {tip.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Le saviez-vous */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Le saviez-vous ?</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {DID_YOU_KNOW.map((card) => (
            <div
              key={card.id}
              className="rounded-xl border bg-(--color-surface) p-5"
              style={{ borderColor: card.color + "30" }}
            >
              <span
                className="mb-2 inline-block rounded-full px-3 py-0.5 text-xs font-bold"
                style={{ backgroundColor: card.color + "15", color: card.color }}
              >
                {card.category}
              </span>
              <h3 className="mb-2 font-bold">{card.title}</h3>
              <p className="text-sm leading-relaxed text-(--color-text-muted)">
                {card.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Links */}
      <section className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6">
        <h2 className="mb-4 text-lg font-bold">Pour aller plus loin</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/groupes-sanguins"
            className="rounded-lg border border-(--color-border) px-4 py-2 text-sm font-medium transition-colors hover:bg-(--color-surface-2)"
          >
            Compatibilité des groupes sanguins
          </Link>
          <Link
            href="/mythes-et-realites"
            className="rounded-lg border border-(--color-border) px-4 py-2 text-sm font-medium transition-colors hover:bg-(--color-surface-2)"
          >
            Mythes et réalités
          </Link>
          <Link
            href="/conseils"
            className="rounded-lg border border-(--color-border) px-4 py-2 text-sm font-medium transition-colors hover:bg-(--color-surface-2)"
          >
            Conseils détaillés
          </Link>
        </div>
      </section>
    </div>
  );
}
