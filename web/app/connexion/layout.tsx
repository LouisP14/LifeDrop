import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous ou créez votre compte LifeDrop pour suivre vos dons de sang et mesurer votre impact.",
  alternates: { canonical: "/connexion" },
};

export default function ConnexionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
