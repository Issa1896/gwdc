import Link from "next/link";
import { ArrowRight, CheckCircle2, MonitorPlay } from "lucide-react";
import { getProduct, PRODUCTS, PRODUCT_CATEGORIES } from "@/data/products";
import { PageHero, SectionHeading, CTABand } from "@/components/marketing/sections";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { notFound } from "next/navigation";

/** Página dedicada de produto — objetivo, público, funcionalidades, benefícios, fluxo, tecnologia. */
export function ProductPage({ slug }: { slug: string }) {
  const product = getProduct(slug);
  if (!product) notFound();

  const readiness = product.status === "Produção" ? 100 : product.status === "MVP" ? 80 : 40;

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Início", href: "/" }, { label: "Produtos", href: "/produtos" }, { label: product.name }]}
        eyebrow={`${product.category} · Status: ${product.status}`}
        title={product.name}
        description={product.tagline}
      />

      {/* Visão geral + objetivo */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="flex items-center gap-4">
                <span className="grid size-14 place-items-center rounded-2xl text-white shadow-lg" style={{ background: product.color }}>
                  <product.icon className="size-7" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-bold text-ink">Objetivo</h2>
                  <p className="text-sm text-ink-muted">{product.name}</p>
                </div>
              </div>
              <p className="mt-5 text-base leading-relaxed text-ink-muted">{product.summary}</p>
              <div className="mt-5 rounded-xl border border-border bg-surface-alt p-5">
                <p className="text-sm leading-relaxed text-ink-muted">
                  <strong className="text-ink">Missão do produto: </strong>
                  {product.objective}
                </p>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {product.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-border p-4 text-center">
                    <p className="font-display text-lg font-bold text-brand-600 dark:text-brand-300">{metric.value}</p>
                    <p className="mt-0.5 text-[11px] text-ink-faint">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <Card className="p-6">
                <h3 className="mb-4 font-display font-semibold text-ink">Prontidão do produto</h3>
                <Progress value={readiness} tone={readiness >= 80 ? "brand" : "gold"} ariaLabel="Prontidão do produto" />
                <p className="mt-2 text-xs text-ink-muted">
                  {product.status === "MVP" ? "MVP navegável disponível com dados fictícios realistas." : product.status === "Produção" ? "Em produção." : "Em roadmap."}
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="mb-3 font-display font-semibold text-ink">Público-alvo</h3>
                <ul className="space-y-2">
                  {product.audience.map((audience) => (
                    <li key={audience} className="flex items-center gap-2 text-sm text-ink-muted">
                      <CheckCircle2 className="size-4 text-brand-500" aria-hidden="true" />
                      {audience}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="p-6">
                <h3 className="mb-3 font-display font-semibold text-ink">Tecnologias</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tech.map((tech) => (
                    <Badge key={tech} tone="navy">{tech}</Badge>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades e benefícios */}
      <section className="border-y border-border bg-surface-alt py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading align="left" eyebrow="Capacidades" title="Funcionalidades principais" className="mb-6" />
              <ul className="space-y-3">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]">
                    <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-brand-500" aria-hidden="true" />
                    <span className="text-sm text-ink-muted">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionHeading align="left" eyebrow="Resultados" title="Benefícios" className="mb-6" />
              <ul className="space-y-3">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-900 dark:bg-brand-950">
                    <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-brand-600 dark:text-brand-300" aria-hidden="true" />
                    <span className="text-sm text-ink">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Fluxo do sistema */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading eyebrow="Fluxo do sistema" title={`Como o ${product.name} funciona`} />
          <ol className="relative space-y-8 border-l-2 border-brand-300 pl-8">
            {product.flow.map((step, index) => (
              <li key={step.step} className="relative">
                <span className="absolute top-0 -left-[43px] grid size-7 place-items-center rounded-full bg-brand-500 font-display text-xs font-bold text-white">
                  {index + 1}
                </span>
                <p className="font-display font-semibold text-ink">{step.step}</p>
                <p className="mt-1 text-sm text-ink-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface-alt p-10 text-center">
            <MonitorPlay className="size-10 text-brand-500" aria-hidden="true" />
            {["gw-education", "gw-pay", "gw-bank", "gw-campus", "gw-health"].includes(product.slug) ? (
              <>
                <h2 className="font-display text-2xl font-bold text-ink">Sistema completo navegável</h2>
                <p className="max-w-xl text-sm text-ink-muted">
                  Explore o sistema operacional completo de {product.name}: módulos, fluxos e persistência com dados fictícios realistas.
                </p>
                <Link href={`/app/${product.slug}`}>
                  <Button size="lg">
                    Abrir sistema completo <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold text-ink">Demonstração (MVP) navegável</h2>
                <p className="max-w-xl text-sm text-ink-muted">
                  Explore o protótipo funcional de {product.name}: login, dashboard, gráficos, tabelas e fluxos com dados fictícios realistas.
                </p>
                <Link href={`/app/${product.slug}`}>
                  <Button size="lg">
                    Abrir MVP de {product.name} <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <CTABand
        title={`Quer ver o ${product.name} na prática?`}
        description="Agende uma demonstração com nossa equipe ou explore os MVPs de todo o ecossistema."
        primaryLabel="Ver todos os MVPs"
        primaryHref="/mvps"
      />
    </>
  );
}

/** Grade de produtos para a página de índice. */
export function ProductGrid({ activeCategory = "Todos" }: { activeCategory?: string }) {
  const categories = ["Todos", ...PRODUCT_CATEGORIES] as const;
  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge key={category} tone={activeCategory === category ? "brand" : "neutral"} className="px-3 py-1.5">
            {category}
          </Badge>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {getProductsFiltered(activeCategory).map((product) => (
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
              <div className="mt-4 flex items-center justify-between">
                <Badge tone={product.status === "MVP" ? "gold" : product.status === "Produção" ? "success" : "info"}>
                  {product.status}
                </Badge>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:gap-2 dark:text-brand-300">
                  Ver <ArrowRight className="size-3.5 transition-all" />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function getProductsFiltered(category: string) {
  if (category === "Todos") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}
