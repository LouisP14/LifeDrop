import Link from "next/link";
import { Droplets } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Droplets className="mb-4 h-12 w-12 text-(--color-text-muted)" />
      <h1 className="mb-2 text-2xl font-extrabold">Page introuvable</h1>
      <p className="mb-6 text-(--color-text-muted)">
        Cette page n&apos;existe pas ou a ete deplacee.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-(--color-primary) px-6 py-2.5 font-bold text-white transition-opacity hover:opacity-90"
      >
        Retour a l&apos;accueil
      </Link>
    </div>
  );
}
