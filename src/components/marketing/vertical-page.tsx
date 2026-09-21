import Link from "next/link";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { getSolution } from "@/data/solutions";
import { getProduct } from "@/data/products";
import { PageHero, SectionHeading, CheckListCard, CTABand, StatBand } from "@/components/marketing/sections";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

/** Página de setor (vertical) — narrativa problema → transformação → soluções → benefícios. */
export function VerticalPage({ slug }: { slug: string }) {
  const solution = getSolution(slug);
  if (!solution) notFound();

  const relatedProducts = solution.products.map(getProduct).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Início", href: "/" }, { label: "Soluções", href: "/solucoes" }, { label: solution.title }]}
        eyebrow="Solução GWDC"
        title={solution.headline}
        description={`O ecossistema ${solution.title} da GW Digital Company: problema real, transformação digital e resultados mensuráveis.`}
      />

      {/* Problemas atuais */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Diagnóstico"
            title="Os problemas de hoje"
            description="Desafios estruturais que afetam milhões de guineenses todos os dias."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {solution.problem.map((problem) => (
              <Card key={problem} className="flex items-start gap-3 p-5">
                <XCircle className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-ink-muted">{problem}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Transformação */}
      <section className="border-y border-border bg-surface-alt py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <SectionHeading
                align="left"
                eyebrow="A resposta GWDC"
                title="A transformação digital"
                description="Soluções completas, integradas ao ecossistema nacional GWDC."
              />
              <StatBand stats={solution.stats} className="lg:grid-cols-3" />
            </div>
            <ul className="space-y-4">
              {solution.transformation.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-ink-muted">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Produtos do setor */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Produtos"
            title={`Produtos para ${solution.title}`}
            description="Cada produto do ecossistema pode ser explorado com um MVP navegável."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((product) => (
              <Link key={product.slug} href={`/produtos/${product.slug}`} className="group">
                <Card className="flex h-full flex-col p-6 transition-all group-hover:-translate-y-1 group-hover:border-brand-400">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-lg text-white" style={{ background: product.color }}>
                      <product.icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display font-semibold text-ink">{product.name}</h3>
                      <p className="text-xs text-ink-faint">{product.category}</p>
                    </div>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{product.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 group-hover:gap-2.5 dark:text-brand-300">
                    Ver produto <ArrowRight className="size-4 transition-all" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="border-t border-border bg-surface-alt py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Resultados"
            title="Benefícios mensuráveis"
            description="O que muda para o cidadão, o Estado e a economia."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {solution.benefits.map((benefit) => (
              <CheckListCard key={benefit} title={benefit} items={[benefit]} tone="success" />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href={`/produtos/${relatedProducts[0]?.slug ?? "gw-citizen"}`}>
              <Button size="lg">
                Ver demonstração interativa <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <CTABand
        title={`Explore o MVP de ${solution.title}`}
        description="Acesse os protótipos navegáveis com dados fictícios realistas e conheça a experiência completa."
        primaryLabel="Abrir demonstração"
        primaryHref={`/app/${relatedProducts[0]?.slug ?? "gw-citizen"}`}
      />
    </>
  );
}
