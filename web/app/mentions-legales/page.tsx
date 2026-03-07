import type { Metadata } from "next";
import { Breadcrumbs } from "@web/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Mentions legales",
  description: "Mentions legales du site LifeDrop — informations sur l'editeur, l'hebergement et les droits d'auteur.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Mentions legales" }]} />
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <h1 className="mb-8 text-3xl font-extrabold md:text-4xl">Mentions legales</h1>

        <div className="space-y-8 text-sm leading-relaxed text-(--color-text-muted)">
          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">Editeur du site</h2>
            <p>
              LifeDrop est un projet etudiant a but non lucratif.<br />
              Responsable de la publication : Louis P.<br />
              Contact : <a href="mailto:contact@lifedrop.fr" className="text-(--color-primary) underline">contact@lifedrop.fr</a>
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">Hebergement</h2>
            <p>
              Le site est heberge par Vercel Inc.<br />
              440 N Barranca Ave #4133, Covina, CA 91723, Etats-Unis.<br />
              Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-(--color-primary) underline">vercel.com</a>
            </p>
            <p className="mt-2">
              La base de donnees est hebergee par Supabase Inc.<br />
              970 Toa Payoh North #07-04, Singapore 318992.<br />
              Site web : <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-(--color-primary) underline">supabase.com</a>
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">Propriete intellectuelle</h2>
            <p>
              L&apos;ensemble du contenu du site LifeDrop (textes, images, logos, code source)
              est protege par le droit d&apos;auteur. Toute reproduction, meme partielle, est
              soumise a autorisation prealable.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">Donnees personnelles</h2>
            <p>
              Les informations collectees (nom, groupe sanguin, historique de dons) sont
              stockees de maniere securisee et ne sont jamais partagees avec des tiers.
              Pour plus d&apos;informations, consultez notre{" "}
              <a href="/confidentialite" className="text-(--color-primary) underline">
                politique de confidentialite
              </a>.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">Limitation de responsabilite</h2>
            <p>
              LifeDrop est un outil de suivi personnel et ne se substitue en aucun cas
              a un avis medical. Les delais legaux entre deux dons sont fixes par
              l&apos;Etablissement Francais du Sang (EFS). Consultez un professionnel de
              sante avant chaque don.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">Credits</h2>
            <p>
              Icones : <a href="https://lucide.dev" target="_blank" rel="noopener noreferrer" className="text-(--color-primary) underline">Lucide Icons</a> (licence MIT).<br />
              Polices : Inter via le systeme de polices Next.js.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
