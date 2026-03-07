import type { Metadata, Viewport } from "next";
import { SEO_CONFIG } from "@shared/content/seo";
import { Header } from "@web/components/layout/Header";
import { Footer } from "@web/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.siteUrl),
  title: {
    default: SEO_CONFIG.defaultTitle,
    template: `%s | ${SEO_CONFIG.siteName}`,
  },
  description: SEO_CONFIG.defaultDescription,
  keywords: SEO_CONFIG.keywords,
  authors: [{ name: "LifeDrop" }],
  creator: "LifeDrop",
  robots: { index: true, follow: true },
  alternates: {
    canonical: SEO_CONFIG.siteUrl,
    languages: { "fr-FR": SEO_CONFIG.siteUrl },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SEO_CONFIG.siteUrl,
    siteName: SEO_CONFIG.siteName,
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
  },
  // manifest added manually in <head> to avoid crossOrigin="undefined" bug
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: SEO_CONFIG.themeColor,
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LifeDrop",
    url: SEO_CONFIG.siteUrl,
    description: SEO_CONFIG.defaultDescription,
  };

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" hrefLang="fr" href={SEO_CONFIG.siteUrl} />
        <link rel="alternate" hrefLang="x-default" href={SEO_CONFIG.siteUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__pwaPrompt=e})`,
          }}
        />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
