import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "LifeDrop - Mon tableau de bord",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
