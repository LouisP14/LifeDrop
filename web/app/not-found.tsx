import Link from "next/link";
import { Droplets, ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6 inline-flex items-center justify-center rounded-2xl bg-(--color-primary)/10 p-5">
          <Droplets className="h-12 w-12 text-(--color-primary)" />
        </div>

        <h1 className="mb-2 text-6xl font-extrabold text-(--color-primary)">404</h1>
        <h2 className="mb-4 text-xl font-bold">Page introuvable</h2>
        <p className="mb-8 max-w-md text-(--color-text-muted)">
          Cette page n&apos;existe pas ou a été déplacée.
          Pas de panique, chaque goutte compte ailleurs !
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-(--color-primary) px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            <Home className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/guide-don-du-sang"
            className="inline-flex items-center gap-2 rounded-xl border border-(--color-border) px-6 py-3 text-sm font-medium text-(--color-text-muted) transition-colors hover:text-(--color-text)"
          >
            Guide du don du sang
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
