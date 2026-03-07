import type { Metadata } from "next";
import { Breadcrumbs } from "@web/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de LifeDrop — comment vos données personnelles sont collectees, utilisees et protégées.",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Politique de confidentialité" }]} />
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">Politique de confidentialité</h1>
        <p className="mb-8 text-sm text-(--color-text-muted)">Dernière mise à jour : 7 mars 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-(--color-text-muted)">
          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données est LifeDrop, projet étudiant
              à but non lucratif. Contact :{" "}
              <a href="mailto:contact@lifedrop.fr" className="text-(--color-primary) underline">
                contact@lifedrop.fr
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">2. Données collectees</h2>
            <p>Nous collectons les données suivantes :</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong className="text-(--color-text)">Données de compte</strong> : adresse e-mail, nom/prenom (facultatif)</li>
              <li><strong className="text-(--color-text)">Données de profil</strong> : groupe sanguin, sexe biologique</li>
              <li><strong className="text-(--color-text)">Données de dons</strong> : date, type de don, lieu (facultatif)</li>
              <li><strong className="text-(--color-text)">Données techniques</strong> : adresse IP (pour le rate limiting), données de navigation</li>
              <li><strong className="text-(--color-text)">Notifications push</strong> : token d&apos;abonnement (si active par l&apos;utilisateur)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">3. Finalites du traitement</h2>
            <p>Vos données sont utilisees pour :</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Gerer votre compte et authentification</li>
              <li>Afficher votre historique de dons et calculer votre éligibilité</li>
              <li>Alimenter le classement communautaire (nom et statistiques uniquement)</li>
              <li>Envoyer des rappels de don (notifications push, si activées)</li>
              <li>Proteger le service contre les abus (rate limiting)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">4. Base légale</h2>
            <p>
              Le traitement repose sur votre <strong className="text-(--color-text)">consentement</strong> (création
              de compte, activation des notifications) et notre <strong className="text-(--color-text)">interet legitime</strong> (sécurité
              du service, prevention des abus).
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">5. Partage des données</h2>
            <p>
              Vos données ne sont <strong className="text-(--color-text)">jamais vendues ni partagees</strong> avec des tiers
              a des fins commerciales. Elles sont accessibles uniquement :
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong className="text-(--color-text)">Supabase</strong> : hébergément de la base de données (chiffrement au repos et en transit)</li>
              <li><strong className="text-(--color-text)">Vercel</strong> : hébergément de l&apos;application web</li>
            </ul>
            <p className="mt-2">
              Le classement public affiche uniquement votre nom et vos statistiques de dons.
              Votre adresse e-mail, groupe sanguin et autres données personnelles ne sont
              jamais exposés publiquement.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">6. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité adaptees :
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Authentification sécurisée via Supabase Auth</li>
              <li>Row Level Security (RLS) : chaque utilisateur n&apos;accede qu&apos;a ses propres données</li>
              <li>Chiffrement HTTPS sur toutes les communications</li>
              <li>Rate limiting sur les API sensibles</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">7. Conservation des données</h2>
            <p>
              Vos données sont conservees tant que votre compte est actif. En cas de
              suppression de compte, toutes vos données personnelles sont effacées
              définitivement dans un délai de 30 jours.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">8. Vos droits (RGPD)</h2>
            <p>Conformement au Règlement Général sur la Protection des Données, vous disposez des droits suivants :</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong className="text-(--color-text)">Droit d&apos;acces</strong> : obtenir une copie de vos données</li>
              <li><strong className="text-(--color-text)">Droit de rectification</strong> : corriger vos données inexactes</li>
              <li><strong className="text-(--color-text)">Droit a l&apos;effacement</strong> : demander la suppression de vos données</li>
              <li><strong className="text-(--color-text)">Droit a la portabilite</strong> : recevoir vos données dans un format lisible</li>
              <li><strong className="text-(--color-text)">Droit d&apos;opposition</strong> : vous opposer au traitement de vos données</li>
              <li><strong className="text-(--color-text)">Droit de retrait du consentement</strong> : retirer votre consentement à tout moment</li>
            </ul>
            <p className="mt-2">
              Pour exercer ces droits, contactez-nous a{" "}
              <a href="mailto:contact@lifedrop.fr" className="text-(--color-primary) underline">
                contact@lifedrop.fr
              </a>.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">9. Cookies</h2>
            <p>
              LifeDrop utilise uniquement le <strong className="text-(--color-text)">stockage local</strong> (localStorage)
              pour sauvegarder vos préférences (theme, données en cache). Aucun cookie
              tiers ni traceur publicitaire n&apos;est utilise.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-(--color-text)">10. Contact et réclamation</h2>
            <p>
              Pour toute question sur cette politique, contactez{" "}
              <a href="mailto:contact@lifedrop.fr" className="text-(--color-primary) underline">
                contact@lifedrop.fr
              </a>.
            </p>
            <p className="mt-2">
              Si vous estimez que vos droits ne sont pas respectes, vous pouvez adresser
              une réclamation a la CNIL :{" "}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-(--color-primary) underline">
                www.cnil.fr
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
