import Link from "next/link";
import { ArrowRight, MonitorPlay } from "lucide-react";
import { SOLUTIONS } from "@/data/solutions";
import { PageHero, SectionHeading, CTABand } from "@/components/marketing/sections";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/** Página Soluções — visão geral das oito verticais GWDC. */
export default function SolucoesPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Início", href: "/" }, { label: "Soluções" }]}
        eyebrow="Soluções"
        title="Um ecossistema completo de transformação digital"
        description="Oito verticais integradas, desenhadas para os desafios reais da Guiné-Bissau e escaláveis para toda a África Ocidental."
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-5 md:grid-cols-2">
            {SOLUTIONS.map((solution) => (
              <Link key={solution.slug} href={`/${solution.slug}`} className="group">
                <Card className="flex h-full flex-col p-7 transition-all group-hover:-translate-y-1 group-hover:border-brand-400">
                  <div className="flex items-start justify-between">
                    <span className="grid size-12 place-items-center rounded-xl text-white" style={{ background: solution.color }}>
                      <solution.icon className="size-6" aria-hidden="true" />
                    </span>
                    <Badge tone="neutral" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Ver solução
                    </Badge>
                  </div>
                  <h2 className="mt-5 font-display text-xl font-bold text-ink">{solution.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{solution.headline}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {solution.products.map((slug) => (
                      <Badge key={slug} tone="brand">{slug.replace("gw-", "GW ")}</Badge>
                    ))}
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 group-hover:gap-2.5 dark:text-brand-300">
                    Explorar <ArrowRight className="size-4 transition-all" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Demonstrações */}
      <section className="border-t border-border bg-surface-alt py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Experimente"
                title="Cada solução tem um MVP navegável"
                description="Dashboards com login, gráficos, tabelas e dados fictícios realistas — prontos para apresentar a investidores, ministérios e parceiros."
              />
              <Link href="/mvps">
                <Button size="lg">
                  <MonitorPlay className="size-4" /> Ver todos os MVPs
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {SOLUTIONS.slice(0, 4).map((solution) => (
                <Link key={solution.slug} href={`/mvps#${solution.slug}`}>
                  <Card className="p-5 text-center transition-all hover:-translate-y-0.5 hover:border-brand-400">
                    <solution.icon className="mx-auto size-6" style={{ color: solution.color }} aria-hidden="true" />
                    <p className="mt-2 text-sm font-semibold text-ink">{solution.title}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
