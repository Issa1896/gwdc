import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock, MonitorPlay, ShieldCheck, Smartphone } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { SOLUTIONS } from "@/data/solutions";
import { PageHero, SectionHeading, CTABand } from "@/components/marketing/sections";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Demonstrações (MVPs)",
  description: "MVPs navegáveis de todos os produtos GWDC: login, dashboards, gráficos e tabelas com dados fictícios realistas.",
};

const FEATURES = [
  { icon: MonitorPlay, title: "MVPs navegáveis", text: "Login, menu lateral, dashboards, gráficos e tabelas funcionais." },
  { icon: Smartphone, title: "Totalmente responsivo", text: "Desktop, tablet e mobile — testado em todas as resoluções." },
  { icon: ShieldCheck, title: "Dados fictícios realistas", text: "Conjuntos de dados fictícios que simulam operação real." },
  { icon: Lock, title: "Tema claro e escuro", text: "Experiência acessível e confortável em qualquer ambiente." },
];

/** Produtos com sistemas operacionais completos (substituem o MVP genérico). */
const FULL_PRODUCTS = ["gw-education", "gw-pay", "gw-bank", "gw-campus", "gw-health"];

/** Página MVPs — índice das demonstrações navegáveis (Módulo 5). */
export default function MvpsPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Início", href: "/" }, { label: "MVPs" }]}
        eyebrow="Demonstrações"
        title="Experimente o futuro, hoje"
        description="Protótipos funcionais de cada produto GWDC com dados fictícios realistas. Acesse, navegue e imagine a Guiné-Bissau digital."
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <Card key={title} className="p-6 text-center">
                <Icon className="mx-auto size-6 text-brand-500" aria-hidden="true" />
                <h3 className="mt-3 font-display font-semibold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm text-ink-muted">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface-alt py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="MVPs por setor"
            title="Demonstrações agrupadas por setor"
            description="Escolha um setor e explore o MVP de cada produto relacionado."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {SOLUTIONS.map((solution) => (
              <Card key={solution.slug} id={solution.slug} className="p-7 scroll-mt-24">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg text-white" style={{ background: solution.color }}>
                    <solution.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h2 className="font-display text-lg font-semibold text-ink">{solution.title}</h2>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {solution.products.map((slug) => {
                    const product = PRODUCTS.find((p) => p.slug === slug);
                    if (!product) return null;
                    return (
                      <Link key={slug} href={`/app/${slug}`}>
                        <Badge tone="brand" className="cursor-pointer px-3 py-1.5 transition-colors hover:bg-brand-200 dark:hover:bg-brand-900">
                          {product.name} <ArrowRight className="size-3" />
                        </Badge>
                      </Link>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Todos os produtos"
            title="Escolha um produto para explorar"
            description="18 MVPs navegáveis — cada um com tela de login, dashboard e dados de demonstração."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((product) => {
              const full = FULL_PRODUCTS.includes(product.slug);
              return (
                <Link key={product.slug} href={`/app/${product.slug}`} className="group">
                  <Card className="flex h-full items-center gap-4 p-5 transition-all group-hover:-translate-y-0.5 group-hover:border-brand-400">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg text-white" style={{ background: product.color }}>
                      <product.icon className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-display font-semibold text-ink">{product.name}</p>
                        {full && <Badge tone="success" dot>Sistema completo</Badge>}
                      </div>
                      <p className="truncate text-xs text-ink-muted">{product.tagline}</p>
                    </div>
                    <Button variant={full ? "primary" : "outline"} size="sm" className="group-hover:border-brand-400">
                      {full ? "Abrir sistema" : "Abrir MVP"}
                    </Button>
                  </Card>
                </Link>
              );
            })}
          </div>
          <p className="mt-8 text-center text-sm text-ink-faint">
            Login de demonstração: <code className="rounded bg-surface-strong px-2 py-0.5 font-mono text-xs">demo@gwdc.gw</code> · senha <code className="rounded bg-surface-strong px-2 py-0.5 font-mono text-xs">demo1234</code>
          </p>
        </div>
      </section>

      <CTABand
        title="Quer uma demonstração guiada?"
        description="Nossa equipe apresenta os MVPs em sessão ao vivo, adaptada à sua audiência: governo, banco central, investidores ou parceiros."
        primaryLabel="Solicitar demonstração"
        primaryHref="/contato"
      />
    </>
  );
}
