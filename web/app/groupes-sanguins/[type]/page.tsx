import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowDownCircle, ArrowUpCircle, Info, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@web/components/seo/Breadcrumbs";
import { JsonLd } from "@web/components/seo/JsonLd";
import { BLOOD_TYPE_PAGES } from "@shared/content/blood-types";

export function generateStaticParams() {
  return BLOOD_TYPE_PAGES.map((bt) => ({ type: bt.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const bt = BLOOD_TYPE_PAGES.find((b) => b.slug === type);
  if (!bt) return {};

  return {
    title: bt.title,
    description: bt.metaDescription,
    alternates: { canonical: `/groupes-sanguins/${bt.slug}` },
    openGraph: {
      title: bt.title,
      description: bt.metaDescription,
    },
  };
}

export default async function BloodTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const bt = BLOOD_TYPE_PAGES.find((b) => b.slug === type);
  if (!bt) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: bt.title,
    description: bt.metaDescription,
    inLanguage: "fr",
    audience: { "@type": "PeopleAudience", suggestedMinAge: 18 },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={schema} />
      <Breadcrumbs
        items={[
          { label: "Groupes sanguins", href: "/groupes-sanguins" },
          { label: `Groupe ${bt.label}` },
        ]}
      />

      {/* Hero */}
      <div className="mb-10 rounded-2xl border border-[var(--color-primary)]/20 bg-gradient-to-br from-[rgba(248,113,113,0.08)] to-transparent p-8 text-center">
        <div className="mb-4 text-7xl font-extrabold text-[var(--color-primary)]">
          {bt.label}
        </div>
        <h1 className="mb-3 text-2xl font-extrabold md:text-3xl">{bt.title}</h1>
        <p className="mx-auto max-w-xl text-[var(--color-text-muted)]">
          {bt.description}
        </p>
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">
          {bt.frequency}
        </p>
      </div>

      {/* Compatibility */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {/* Can receive from */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="mb-4 flex items-center gap-2 text-[var(--color-text-muted)]">
            <ArrowDownCircle className="h-5 w-5" />
            <h2 className="font-bold">Peut recevoir de</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {bt.canReceiveFrom.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-1.5 text-sm font-bold text-[var(--color-text-muted)]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Can donate to */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="mb-4 flex items-center gap-2 text-[var(--color-text)]">
            <ArrowUpCircle className="h-5 w-5 text-[var(--color-primary)]" />
            <h2 className="font-bold">Peut donner a</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {bt.canDonateTo.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-4 py-1.5 text-sm font-bold text-[var(--color-primary)]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tip */}
      <div className="mb-10 flex gap-3 rounded-xl border border-[var(--color-blue)]/20 bg-[var(--color-blue)]/5 p-5">
        <Info className="h-5 w-5 shrink-0 text-[var(--color-blue)]" />
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          {bt.tip}
        </p>
      </div>

      {/* Other blood types */}
      <section>
        <h2 className="mb-4 text-lg font-bold">Autres groupes sanguins</h2>
        <div className="flex flex-wrap gap-2">
          {BLOOD_TYPE_PAGES.filter((b) => b.slug !== bt.slug).map((b) => (
            <Link
              key={b.slug}
              href={`/groupes-sanguins/${b.slug}`}
              className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-bold transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)]"
            >
              {b.label}
            </Link>
          ))}
          <Link
            href="/groupes-sanguins"
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)]"
          >
            Voir le tableau complet <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
