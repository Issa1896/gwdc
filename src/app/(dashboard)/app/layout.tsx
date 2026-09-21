import type { Metadata } from "next";

/** Layout do ambiente de demonstração (MVPs). */
export const metadata: Metadata = {
  title: {
    default: "Demonstração GWDC",
    template: "%s | Demonstração GWDC",
  },
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
