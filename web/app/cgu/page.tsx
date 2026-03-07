import type { Metadata } from "next";
import { Breadcrumbs } from "@web/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Conditions generales d'utilisation",
  description: "CGU de LifeDrop — conditions d'utilisation de l'application de suivi du don du sang.",
  alternates: { canonical: "/cgu" },
};

export default function CGUPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "CGU" }]} />
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">Conditions generales d&apos;utilisation</h1>
        <p className="mb-8 text-sm text-(--color-text-muted)">Derniere mise a jour : 7 mars 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-(--color-text-muted)">
          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">1. Objet</h2>
            <p>
              Les presentes Conditions Generales d&apos;Utilisation (CGU) regissent l&apos;utilisation
              de l&apos;application web LifeDrop, accessible a l&apos;adresse lifedrop.fr.
              En utilisant LifeDrop, vous acceptez les presentes conditions dans leur integralite.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">2. Description du service</h2>
            <p>
              LifeDrop est une application gratuite permettant aux donneurs de sang de :
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Enregistrer et suivre leurs dons de sang</li>
              <li>Verifier leur eligibilite selon les delais legaux</li>
              <li>Consulter des informations educatives sur le don du sang</li>
              <li>Suivre leur progression via un systeme de niveaux et badges</li>
              <li>Trouver des centres de don a proximite</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">3. Inscription et compte</h2>
            <p>
              L&apos;utilisation de l&apos;application necessite la creation d&apos;un compte via une
              adresse e-mail. L&apos;utilisateur s&apos;engage a fournir des informations exactes
              et a maintenir la confidentialite de ses identifiants de connexion.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">4. Utilisation acceptable</h2>
            <p>L&apos;utilisateur s&apos;engage a :</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Utiliser l&apos;application de maniere loyale et conforme a sa finalite</li>
              <li>Ne pas enregistrer de faux dons ou manipuler les donnees</li>
              <li>Ne pas tenter d&apos;acceder aux donnees d&apos;autres utilisateurs</li>
              <li>Ne pas perturber le fonctionnement du service</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">5. Limitation de responsabilite</h2>
            <p>
              LifeDrop est un outil de suivi personnel et ne constitue pas un dispositif
              medical. Les informations affichees (delais, eligibilite) sont fournies a
              titre indicatif et ne remplacent pas l&apos;avis d&apos;un professionnel de sante
              ou les recommandations de l&apos;EFS.
            </p>
            <p className="mt-2">
              LifeDrop ne saurait etre tenu responsable en cas de dommage resultant de
              l&apos;utilisation ou de l&apos;impossibilite d&apos;utiliser le service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">6. Propriete intellectuelle</h2>
            <p>
              L&apos;ensemble des elements constituant LifeDrop (code, design, textes, logos)
              sont proteges par le droit de la propriete intellectuelle. Toute reproduction
              non autorisee est interdite.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">7. Donnees personnelles</h2>
            <p>
              Le traitement des donnees personnelles est decrit dans notre{" "}
              <a href="/confidentialite" className="text-(--color-primary) underline">
                politique de confidentialite
              </a>.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">8. Modification des CGU</h2>
            <p>
              LifeDrop se reserve le droit de modifier les presentes CGU a tout moment.
              Les utilisateurs seront informes de toute modification substantielle.
              La poursuite de l&apos;utilisation du service vaut acceptation des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">9. Droit applicable</h2>
            <p>
              Les presentes CGU sont soumises au droit francais. Tout litige sera de la
              competence exclusive des tribunaux francais.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">10. Contact</h2>
            <p>
              Pour toute question relative aux presentes CGU, contactez-nous a l&apos;adresse :{" "}
              <a href="mailto:contact@lifedrop.fr" className="text-(--color-primary) underline">
                contact@lifedrop.fr
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
