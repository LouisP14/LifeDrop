import Link from "next/link";
import { Logo } from "@web/components/ui/Logo";

const CONTENT_LINKS = [
  { href: "/guide-don-du-sang", label: "Guide du don du sang" },
  { href: "/groupes-sanguins", label: "Groupes sanguins" },
  { href: "/mythes-et-realites", label: "Mythes et realites" },
  { href: "/eligibilite", label: "Eligibilite" },
  { href: "/conseils", label: "Conseils avant/apres" },
];

const BLOOD_TYPE_LINKS = [
  { href: "/groupes-sanguins/o-negatif", label: "Groupe O-" },
  { href: "/groupes-sanguins/o-positif", label: "Groupe O+" },
  { href: "/groupes-sanguins/a-negatif", label: "Groupe A-" },
  { href: "/groupes-sanguins/a-positif", label: "Groupe A+" },
  { href: "/groupes-sanguins/b-negatif", label: "Groupe B-" },
  { href: "/groupes-sanguins/b-positif", label: "Groupe B+" },
  { href: "/groupes-sanguins/ab-negatif", label: "Groupe AB-" },
  { href: "/groupes-sanguins/ab-positif", label: "Groupe AB+" },
];

export function Footer() {
  return (
    <footer className="border-t border-(--color-border) bg-(--color-surface)">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2 text-(--color-primary)">
              <Logo size={24} />
              <span className="text-lg font-extrabold">
                <span className="text-(--color-text)">life</span>drop
              </span>
            </div>
            <p className="text-sm leading-relaxed text-(--color-text-muted)">
              Application gratuite de suivi du don du sang en France. Chaque don
              compte, chaque vie aussi.
            </p>
          </div>

          {/* Content links */}
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-(--color-text-muted)">
              Informations
            </h3>
            <ul className="space-y-2">
              {CONTENT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-(--color-text-muted) transition-colors hover:text-(--color-text)"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blood types */}
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-(--color-text-muted)">
              Groupes sanguins
            </h3>
            <ul className="space-y-2">
              {BLOOD_TYPE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-(--color-text-muted) transition-colors hover:text-(--color-text)"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-(--color-text-muted)">
              L&apos;application
            </h3>
            <p className="mb-4 text-sm text-(--color-text-muted)">
              Suivez vos dons, verifiez votre eligibilite et mesurez votre
              impact.
            </p>
            <Link
              href="/app"
              className="inline-block rounded-lg bg-(--color-primary) px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Commencer maintenant
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-(--color-border) pt-6 text-center text-xs text-(--color-text-muted)">
          <div className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link href="/mentions-legales" className="hover:text-(--color-text) transition-colors">
              Mentions legales
            </Link>
            <Link href="/cgu" className="hover:text-(--color-text) transition-colors">
              CGU
            </Link>
            <Link href="/confidentialite" className="hover:text-(--color-text) transition-colors">
              Politique de confidentialite
            </Link>
          </div>
          <p>
            LifeDrop est un projet independant. Les informations fournies ne
            remplacent pas un avis medical.
          </p>
          <p className="mt-1">
            Pour donner votre sang, rendez-vous sur{" "}
            <a
              href="https://dondesang.efs.sante.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--color-primary) underline"
            >
              dondesang.efs.sante.fr
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
