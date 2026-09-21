import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

/** Tipografia da marca GWDC (Módulo 1 — Guia de Identidade Visual). */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://gwdigital.company"),
  title: {
    default: "GW Digital Company — Transformação Digital da Guiné-Bissau",
    template: "%s | GW Digital Company",
  },
  description:
    "Plataforma digital completa da GW Digital Company: Governo Digital, Educação, Banco Digital, ERP, Transporte, Clima e IA para a Guiné-Bissau e a África Ocidental.",
  keywords: [
    "GW Digital Company",
    "Guiné-Bissau",
    "Governo Digital",
    "Banco Digital",
    "Educação Digital",
    "Transformação Digital",
    "África Ocidental",
    "GovTech",
  ],
  authors: [{ name: "GW Digital Company", url: "https://gwdigital.company" }],
  creator: "GW Digital Company",
  openGraph: {
    type: "website",
    locale: "pt_GW",
    siteName: "GW Digital Company",
    title: "GW Digital Company — Transformação Digital da Guiné-Bissau",
    description:
      "Tecnologia que transforma a Guiné-Bissau e conecta o futuro da África Ocidental.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GW Digital Company",
    description: "Tecnologia que transforma a Guiné-Bissau e conecta o futuro da África Ocidental.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1526" },
  ],
  width: "device-width",
  initialScale: 1,
};

/** Rota raiz: layout global com tipografia, tema e idioma português. */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt" suppressHydrationWarning className={`${inter.variable} ${sora.variable}`}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
