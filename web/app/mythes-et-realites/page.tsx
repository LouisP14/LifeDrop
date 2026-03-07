import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@web/components/seo/Breadcrumbs";
import { JsonLd } from "@web/components/seo/JsonLd";
import { MYTHS_AND_FACTS } from "@shared/content/myths";

export const metadata: Metadata = {
  title: "Mythes et réalités sur le don du sang - 7 idées reçues",
  description:
    "Donner du sang fait mal ? On peut attraper une maladie ? Découvrez la vérité sur les 7 mythes les plus répandus sur le don du sang.",
  alternates: { canonical: "/mythes-et-realites" },
  openGraph: {
    title: "7 mythes sur le don du sang - Vrai ou Faux ?",
    description: "Découvrez la vérité sur les idées reçues les plus répandues sur le don du sang en France.",
  },
};

export default function MythesPage() {
  // FAQPage schema for Google Featured Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: MYTHS_AND_FACTS.map((m) => ({
      "@type": "Question",
      name: m.myth,
      acceptedAnswer: {
        "@type": "Answer",
        text: m.reality,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={faqSchema} />
      <Breadcrumbs items={[{ label: "Mythes et réalités" }]} />

      <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">
        Mythes et réalités sur le don du sang
      </h1>
      <p className="mb-10 text-lg text-(--color-text-muted)">
        Séparons le vrai du faux. Voici les 7 idées reçues les plus répandues
        sur le don du sang, avec les faits pour chacune.
      </p>

      {/* Myth cards - all content visible for SEO (not hidden behind JS) */}
      <div className="space-y-4">
        {MYTHS_AND_FACTS.map((m) => (
          <article
            key={m.id}
            className="rounded-2xl border border-(--color-border) bg-(--color-surface) p-6"
          >
            {/* Verdict badge */}
            <div className="mb-3 flex items-center gap-3">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                style={{
                  backgroundColor: m.verdict
                    ? "rgba(52,211,153,0.12)"
                    : "rgba(248,113,113,0.12)",
                  color: m.verdict ? "#34d399" : "#f87171",
                }}
              >
                {m.verdict ? (
                  <CheckCircle className="h-3.5 w-3.5" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}
                {m.verdict ? "Vrai" : "Faux"}
              </span>
            </div>

            {/* Myth */}
            <h2 className="mb-3 text-lg font-bold">{m.myth}</h2>

            {/* Reality - always visible for crawlers */}
            <div className="border-t border-(--color-border) pt-3">
              <p className="leading-relaxed text-(--color-text-muted)">
                {m.reality}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Internal links */}
      <div className="mt-10 rounded-2xl border border-(--color-border) bg-(--color-surface) p-6">
        <h2 className="mb-4 text-lg font-bold">Articles liés</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/guide-don-du-sang"
            className="inline-flex items-center gap-1 rounded-lg border border-(--color-border) px-4 py-2 text-sm font-medium transition-colors hover:bg-(--color-surface-2)"
          >
            Guide du don du sang <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/eligibilite"
            className="inline-flex items-center gap-1 rounded-lg border border-(--color-border) px-4 py-2 text-sm font-medium transition-colors hover:bg-(--color-surface-2)"
          >
            Vérifier mon éligibilité <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/groupes-sanguins"
            className="inline-flex items-center gap-1 rounded-lg border border-(--color-border) px-4 py-2 text-sm font-medium transition-colors hover:bg-(--color-surface-2)"
          >
            Groupes sanguins <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
