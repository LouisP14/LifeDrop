import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@web/components/seo/Breadcrumbs";
import { JsonLd } from "@web/components/seo/JsonLd";
import { TIPS_BEFORE, TIPS_AFTER } from "@shared/content/donation-tips";

export const metadata: Metadata = {
  title: "Conseils avant et apres un don du sang",
  description:
    "Les 10 conseils essentiels pour bien preparer son don de sang et recuperer apres. Hydratation, alimentation, repos : tout ce qu'il faut savoir.",
  alternates: { canonical: "/conseils" },
  openGraph: {
    title: "10 conseils pour reussir son don du sang",
    description: "Bien se preparer et bien recuperer : les conseils indispensables pour les donneurs de sang.",
  },
};

export default function ConseilsPage() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Comment bien se preparer pour un don du sang",
    description: "Les etapes essentielles pour un don du sang reussi.",
    step: TIPS_BEFORE.map((tip, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: tip.title,
      text: tip.detail,
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={howToSchema} />
      <Breadcrumbs items={[{ label: "Conseils" }]} />

      <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">
        Conseils avant et apres un don du sang
      </h1>
      <p className="mb-10 text-lg text-[var(--color-text-muted)]">
        Les 10 conseils essentiels pour bien preparer votre don et recuperer
        rapidement. Suivez ces recommandations pour une experience optimale.
      </p>

      {/* Before */}
      <section className="mb-12">
        <h2 className="mb-2 text-2xl font-bold">Avant le don</h2>
        <p className="mb-6 text-[var(--color-text-muted)]">
          Une bonne preparation garantit un don en toute serenite.
        </p>
        <div className="space-y-4">
          {TIPS_BEFORE.map((tip, i) => (
            <article
              key={tip.id}
              className="flex gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-sm font-bold text-[var(--color-primary)]">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold">{tip.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {tip.summary}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {tip.detail}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* After */}
      <section className="mb-12">
        <h2 className="mb-2 text-2xl font-bold">Apres le don</h2>
        <p className="mb-6 text-[var(--color-text-muted)]">
          Ces gestes simples favorisent une recuperation rapide et confortable.
        </p>
        <div className="space-y-4">
          {TIPS_AFTER.map((tip, i) => (
            <article
              key={tip.id}
              className="flex gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-blue)]/10 text-sm font-bold text-[var(--color-blue)]">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold">{tip.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {tip.summary}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {tip.detail}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Internal links */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-4 text-lg font-bold">Pour aller plus loin</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/guide-don-du-sang"
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-surface-2)]"
          >
            Guide complet <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/eligibilite"
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-surface-2)]"
          >
            Verifier mon eligibilite <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/mythes-et-realites"
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-surface-2)]"
          >
            Mythes et realites <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
