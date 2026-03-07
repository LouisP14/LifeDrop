import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { Breadcrumbs } from "@web/components/seo/Breadcrumbs";
import { JsonLd } from "@web/components/seo/JsonLd";
import { BLOOD_TYPE_PAGES } from "@shared/content/blood-types";
import { BLOOD_TYPE_INFO } from "@shared/constants";
import type { BloodType } from "@shared/types";

export const metadata: Metadata = {
  title: "Compatibilité des groupes sanguins - Tableau complet",
  description:
    "Tableau de compatibilité des groupes sanguins : qui peut donner à qui ? O-, O+, A-, A+, B-, B+, AB-, AB+. Guide interactif et complet.",
  alternates: { canonical: "/groupes-sanguins" },
  openGraph: {
    title: "Compatibilité des groupes sanguins - Tableau complet",
    description: "Qui peut donner à qui ? Tableau interactif de compatibilité des 8 groupes sanguins.",
  },
};

const ALL_TYPES: BloodType[] = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

export default function GroupesSanguinsPage() {
  const medicalSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: "Compatibilité des groupes sanguins",
    description: "Tableau de compatibilité des groupes sanguins pour le don du sang en France.",
    inLanguage: "fr",
    audience: { "@type": "PeopleAudience", suggestedMinAge: 18 },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <JsonLd data={medicalSchema} />
      <Breadcrumbs items={[{ label: "Groupes sanguins" }]} />

      <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">
        Compatibilité des groupes sanguins
      </h1>
      <p className="mb-10 text-lg text-(--color-text-muted)">
        Découvrez qui peut donner à qui. Le tableau ci-dessous montre la
        compatibilité entre les 8 groupes sanguins pour la transfusion.
      </p>

      {/* Compatibility matrix table (crawlable HTML table for SEO) */}
      <section className="mb-12 overflow-x-auto">
        <h2 className="mb-4 text-xl font-bold">
          Matrice de compatibilité donneur → receveur
        </h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-(--color-border) bg-(--color-surface) p-3 text-left text-xs font-bold uppercase text-(--color-text-muted)">
                Donneur ↓ / Receveur →
              </th>
              {ALL_TYPES.map((type) => (
                <th
                  key={type}
                  className="border border-(--color-border) bg-(--color-surface) p-3 text-center font-bold"
                >
                  {type}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_TYPES.map((donor) => (
              <tr key={donor}>
                <td className="border border-(--color-border) bg-(--color-surface) p-3 font-bold text-(--color-primary)">
                  {donor}
                </td>
                {ALL_TYPES.map((receiver) => {
                  const info = BLOOD_TYPE_INFO[donor];
                  const canDonate = info.canDonateTo.includes(receiver);
                  return (
                    <td
                      key={receiver}
                      className="border border-(--color-border) p-3 text-center"
                    >
                      {canDonate ? (
                        <CheckCircle className="mx-auto h-4 w-4 text-(--color-green)" />
                      ) : (
                        <XCircle className="mx-auto h-4 w-4 text-(--color-text-muted)/30" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-(--color-text-muted)">
          &#10003; = compatible &nbsp;&nbsp; &#10007; = incompatible
        </p>
      </section>

      {/* Individual blood type cards */}
      <section>
        <h2 className="mb-6 text-xl font-bold">Les 8 groupes sanguins</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {BLOOD_TYPE_PAGES.map((bt) => (
            <Link
              key={bt.slug}
              href={`/groupes-sanguins/${bt.slug}`}
              className="group rounded-2xl border border-(--color-border) bg-(--color-surface) p-6 transition-colors hover:border-(--color-primary)/30"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-3xl font-extrabold text-(--color-primary)">
                  {bt.label}
                </span>
                <ArrowRight className="h-5 w-5 text-(--color-text-muted) opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <p className="mb-3 text-sm text-(--color-text-muted)">
                {bt.description}
              </p>
              <div className="flex gap-2 text-xs text-(--color-text-muted)">
                <span>Donne à : <strong className="text-(--color-text)">{bt.canDonateTo.length}</strong> groupes</span>
                <span>&middot;</span>
                <span>Reçoit de : <strong className="text-(--color-text)">{bt.canReceiveFrom.length}</strong> groupes</span>
              </div>
              <p className="mt-2 text-xs text-(--color-text-muted)">
                {bt.frequency}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
