import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "./JsonLd";
import { SEO_CONFIG } from "@shared/content/seo";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [{ label: "Accueil", href: "/" }, ...items];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${SEO_CONFIG.siteUrl}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Fil d'Ariane" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-[var(--color-text-muted)]">
          {allItems.map((item, index) => (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5" />}
              {item.href ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-[var(--color-text)]"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-[var(--color-text)]">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
