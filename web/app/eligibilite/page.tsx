import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@web/components/seo/Breadcrumbs";
import { JsonLd } from "@web/components/seo/JsonLd";
import { EligibilityChecker } from "@web/components/ui/EligibilityChecker";
import { DONATION_COOLDOWN_DAYS, DONATION_TYPE_LABELS } from "@shared/constants";

export const metadata: Metadata = {
  title: "Eligibilite au don du sang - Verifiez si vous pouvez donner",
  description:
    "Verifiez en quelques secondes si vous etes eligible au don de sang, de plaquettes ou de plasma. Outil gratuit base sur les criteres officiels.",
  alternates: { canonical: "/eligibilite" },
  openGraph: {
    title: "Suis-je eligible au don du sang ?",
    description: "Outil gratuit pour verifier votre eligibilite au don du sang en France.",
  },
};

const TYPES = ["whole_blood", "platelets", "plasma"] as const;

export default function EligibilitePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Quelles sont les conditions pour donner son sang en France ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Il faut avoir entre 18 et 70 ans, peser au moins 50 kg, etre en bonne sante generale et respecter le delai legal depuis le dernier don (56 jours pour le sang total, 28 jours pour les plaquettes, 14 jours pour le plasma).",
        },
      },
      {
        "@type": "Question",
        name: "Combien de temps entre deux dons de sang ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Le delai legal est de 56 jours (8 semaines) entre deux dons de sang total, 28 jours pour les plaquettes et 14 jours pour le plasma.",
        },
      },
      {
        "@type": "Question",
        name: "Peut-on donner son sang apres un tatouage ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Oui, mais il faut attendre 4 mois apres un tatouage ou un piercing avant de pouvoir donner son sang.",
        },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={faqSchema} />
      <Breadcrumbs items={[{ label: "Eligibilite" }]} />

      <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">
        Suis-je eligible au don du sang ?
      </h1>
      <p className="mb-10 text-lg text-[var(--color-text-muted)]">
        Verifiez en quelques secondes si vous pouvez donner du sang, des
        plaquettes ou du plasma. Basé sur les criteres officiels en France.
      </p>

      {/* Interactive checker (client component) */}
      <EligibilityChecker />

      {/* Static SEO content: general conditions */}
      <section className="mt-12 mb-12">
        <h2 className="mb-6 text-2xl font-bold">
          Conditions generales du don du sang en France
        </h2>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <ul className="space-y-3 text-[var(--color-text-muted)]">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-[var(--color-green)]">&#10003;</span>
              <span>
                <strong className="text-[var(--color-text)]">Age</strong> : entre
                18 et 70 ans
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-[var(--color-green)]">&#10003;</span>
              <span>
                <strong className="text-[var(--color-text)]">Poids</strong> :
                minimum 50 kg
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-[var(--color-green)]">&#10003;</span>
              <span>
                <strong className="text-[var(--color-text)]">Sante</strong> :
                bonne sante generale, pas de maladie infectieuse en cours
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-[var(--color-green)]">&#10003;</span>
              <span>
                <strong className="text-[var(--color-text)]">Tatouage/Piercing</strong> :
                delai de 4 mois apres un tatouage ou piercing
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Cooldown table */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">
          Delais entre deux dons par type
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-left font-bold">
                  Type de don
                </th>
                <th className="border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-center font-bold">
                  Delai minimum
                </th>
              </tr>
            </thead>
            <tbody>
              {TYPES.map((type) => (
                <tr key={type}>
                  <td className="border border-[var(--color-border)] p-3 font-medium">
                    {DONATION_TYPE_LABELS[type].label}
                  </td>
                  <td className="border border-[var(--color-border)] p-3 text-center font-bold text-[var(--color-primary)]">
                    {DONATION_COOLDOWN_DAYS[type]} jours
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Internal links */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-4 text-lg font-bold">En savoir plus</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/guide-don-du-sang"
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-surface-2)]"
          >
            Guide complet <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/mythes-et-realites"
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-surface-2)]"
          >
            Mythes et realites <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/conseils"
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-surface-2)]"
          >
            Conseils avant/apres <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
