import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Landmark,
  PlayCircle,
  Quote,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { branding } from "@/lib/branding";
import { PRODUCTS } from "@/data/products";
import { SOLUTIONS } from "@/data/solutions";
import { BLOG_POSTS, PARTNERS, TESTIMONIALS } from "@/data/content";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading, StatBand, CTABand } from "@/components/marketing/sections";

const HERO_STATS = [
  { value: "18", label: "produtos integrados" },
  { value: "9", label: "setores transformados" },
  { value: "78 mil", label: "identidades emitidas" },
  { value: "99,9%", label: "disponibilidade" },
];

const PROBLEMS = [
  "Documentos em papel, filas de dias e serviços públicos que não chegam ao interior",
  "Mais de 60% dos adultos sem conta bancária e sem identidade digital confiável",
  "Escolas, hospitais e tribunais sem dados confiáveis para tomar decisões",
  "Chuvas imprevisíveis destruindo colheitas sem nenhum alerta prévio",
];

const TRANSFORMATION = [
  "Um único login digital para todos os serviços do Estado, dos bancos e das escolas",
  "Pagamentos instantâneos via QR Code — o PIX da Guiné-Bissau",
  "Educação, saúde e justiça conectadas por dados — do interior à capital",
  "IA antecipando chuvas, surtos, fraudes e gargalos antes que aconteçam",
];

/** Página inicial — narrativa GWDC (problema → transformação → soluções → demonstrações → ação). */
export default function HomePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
        <div
          aria-hidden="true"
          className="absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-brand-500/15 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge tone="brand" className="mx-auto mb-6 px-4 py-1.5 text-xs">
              <Sparkles className="size-3.5" />
              Plataforma Nacional de Transformação Digital
            </Badge>
            <h1 className="font-display text-4xl leading-[1.08] font-bold tracking-tight text-ink sm:text-6xl">
              Tecnologia que transforma a <span className="text-gradient">Guiné-Bissau</span> e conecta o
              futuro da África Ocidental.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              A GW Digital Company constrói o governo digital, o banco digital, a educação digital e a
              infraestrutura de dados do país — com padrões enterprise globais e soberania local.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/mvps">
                <Button size="lg">
                  Explorar demonstrações <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/sobre">
                <Button size="lg" variant="outline">
                  <PlayCircle className="size-4" /> Conhecer a GWDC
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="bg-surface px-6 py-5 text-center">
                <p className="font-display text-2xl font-bold text-brand-600 dark:text-brand-300 sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-ink-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEMAS ATUAIS ─────────────────────────────────── */}
      <section className="border-t border-border bg-surface-alt py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                align="left"
                eyebrow="O diagnóstico"
                title="A Guiné-Bissau não pode esperar mais um século pelo papel"
                description="O país tem um potencial extraordinário — e desafios estruturais que a tecnologia resolve em anos, não em gerações."
              />
              <ul className="space-y-4">
                {PROBLEMS.map((problem) => (
                  <li key={problem} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-red-100 text-danger dark:bg-red-950">
                      <X className="size-3.5" aria-hidden="true" />
                    </span>
                    <p className="text-sm leading-relaxed text-ink-muted">{problem}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-border bg-gradient-to-br from-navy-950 to-navy-900 p-8 text-white shadow-2xl sm:p-10">
              <p className="text-xs font-bold tracking-[0.2em] text-brand-300 uppercase">A transformação digital</p>
              <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">O futuro que estamos construindo</h3>
              <ul className="mt-6 space-y-4">
                {TRANSFORMATION.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-400" aria-hidden="true" />
                    <p className="text-sm leading-relaxed text-navy-100 sm:text-base">{item}</p>
                  </li>
                ))}
              </ul>
              <Link href="/solucoes" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-brand-200">
                Ver todas as soluções <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOLUÇÕES POR SETOR ───────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Soluções por setor"
            title="Nove setores. Um único ecossistema."
            description="Do Estado ao cidadão, do banco à escola, do transporte ao clima — todas as soluções compartilham identidade, dados e segurança."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SOLUTIONS.map((solution) => (
              <Link key={solution.slug} href={`/${solution.slug}`} className="group">
                <Card className="flex h-full flex-col p-6 transition-all group-hover:-translate-y-1">
                  <span
                    className="mb-4 grid size-11 place-items-center rounded-xl text-white"
                    style={{ background: solution.color }}
                  >
                    <solution.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-lg font-semibold text-ink">{solution.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{solution.headline}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 group-hover:gap-2.5 dark:text-brand-300">
                    Explorar <ArrowRight className="size-4 transition-all" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUTOS ─────────────────────────────────────────── */}
      <section className="border-t border-border bg-surface-alt py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Ecossistema de produtos"
            title="A família GW: 18 produtos, uma identidade"
            description="Cada produto resolve um problema real do país — e todos conversam entre si através de uma arquitetura única."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.slice(0, 9).map((product) => (
              <Link key={product.slug} href={`/produtos/${product.slug}`} className="group">
                <Card className="flex h-full items-center gap-4 p-5 transition-all group-hover:-translate-y-0.5 group-hover:border-brand-400">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl text-white" style={{ background: product.color }}>
                    <product.icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-ink">{product.name}</p>
                    <p className="truncate text-xs text-ink-muted">{product.tagline}</p>
                  </div>
                  <ArrowRight className="ml-auto size-4 shrink-0 text-ink-faint transition-all group-hover:translate-x-0.5 group-hover:text-brand-500" />
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/produtos">
              <Button variant="outline" size="lg">
                Ver os 18 produtos <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── ESTATÍSTICAS INSTITUCIONAIS ──────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Impacto"
            title="Resultados que falam por si"
            description="Números dos pilotos em andamento — e das metas nacionais que a GWDC persegue."
          />
          <StatBand stats={branding.stats.map((s) => ({ value: String(s.value), label: s.label }))} />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, title: "1,9 mi", text: "cidadãos com identidade e serviços digitais até 2028" },
              { icon: Landmark, title: "14 órgãos", text: "integrados no barramento de governo digital" },
              { icon: TrendingUp, title: "-78%", text: "de tempo médio de atendimento público" },
              { icon: ShieldCheck, title: "100%", text: "de soberania de dados no país" },
            ].map(({ icon: Icon, title, text }) => (
              <Card key={title} className="p-6 text-center">
                <Icon className="mx-auto size-6 text-brand-500" aria-hidden="true" />
                <p className="mt-3 font-display text-xl font-bold text-ink">{title}</p>
                <p className="mt-1 text-sm text-ink-muted">{text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ──────────────────────────────────────── */}
      <section className="border-t border-border bg-surface-alt py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Quem confia"
            title="Parceiros da transformação"
            description="Instituições públicas e privadas que já caminham conosco nesta jornada."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <Card key={testimonial.name} className="flex flex-col p-6">
                <Quote className="size-6 text-brand-400" aria-hidden="true" />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-muted">“{testimonial.quote}”</blockquote>
                <footer className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-semibold text-ink">{testimonial.name}</p>
                  <p className="text-xs text-ink-faint">{testimonial.role}</p>
                </footer>
              </Card>
            ))}
          </div>
          <div className="mt-12 overflow-hidden">
            <p className="mb-2 text-center text-xs font-semibold tracking-widest text-ink-faint uppercase">Parceiros institucionais</p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {PARTNERS.slice(0, 8).map((partner) => (
                <span key={partner.name} className="flex items-center gap-2 text-sm font-medium text-ink-muted/80">
                  <partner.icon className="size-4 text-ink-faint" aria-hidden="true" />
                  {partner.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BLOG ─────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="Blog"
              title="Ideias que constroem o futuro"
              className="mb-0"
            />
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-300">
              Todos os artigos <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {BLOG_POSTS.slice(0, 3).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card className="flex h-full flex-col p-6 transition-all group-hover:-translate-y-1">
                  <Badge tone="brand" className="mb-3 self-start">{post.category}</Badge>
                  <h3 className="font-display text-lg leading-snug font-semibold text-ink group-hover:text-brand-600 dark:group-hover:text-brand-300">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>
                  <p className="mt-4 text-xs text-ink-faint">
                    {post.author} · {post.readTime} de leitura
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <CTABand />

      {/* JSON-LD para SEO estruturado */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "GW Digital Company",
            slogan: branding.slogan,
            description: branding.mission,
            foundingDate: String(branding.founded),
            address: { "@type": "PostalAddress", addressLocality: "Bissau", addressCountry: "GW" },
          }),
        }}
      />
    </>
  );
}

/** Ícone X usado na seção de problemas. */
function X({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className} aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}
