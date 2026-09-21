import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/** Cabeçalho de seção institucional. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={cn("mb-10 max-w-3xl", align === "center" ? "mx-auto text-center" : "", className)}>
      {eyebrow && (
        <p className="mb-3 text-xs font-bold tracking-[0.2em] text-brand-600 uppercase dark:text-brand-300">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-ink-muted">{description}</p>}
    </div>
  );
}

/** Faixa de estatísticas institucionais. */
export function StatBand({
  stats,
  className,
  tone = "surface",
}: {
  stats: { value: string; label: string }[];
  className?: string;
  tone?: "surface" | "navy";
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border lg:grid-cols-4",
        tone === "navy" && "border-white/10",
        className,
      )}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            "flex flex-col items-center gap-1 bg-surface px-6 py-8 text-center",
            tone === "navy" && "bg-navy-900",
          )}
        >
          <span className={cn("font-display text-3xl font-bold sm:text-4xl", tone === "navy" ? "text-brand-300" : "text-ink")}>
            {stat.value}
          </span>
          <span className={cn("text-xs text-ink-muted sm:text-sm", tone === "navy" && "text-navy-200")}>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

/** Hero de páginas internas. */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <section className={cn("border-b border-border bg-gradient-to-b from-brand-50/60 to-surface py-16 dark:from-brand-950/40 sm:py-20", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {breadcrumb && (
          <nav aria-label="Trilha de navegação" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">
            {breadcrumb.map((item, i) => (
              <span key={item.label} className="flex items-center gap-1.5">
                {item.href ? (
                  <Link href={item.href} className="hover:text-brand-600">
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-medium text-ink">
                    {item.label}
                  </span>
                )}
                {i < breadcrumb.length - 1 && <span aria-hidden="true">/</span>}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <p className="mb-3 text-xs font-bold tracking-[0.2em] text-brand-600 uppercase dark:text-brand-300">{eyebrow}</p>
        )}
        <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">{description}</p>}
      </div>
    </section>
  );
}

/** Bloco de chamada para ação (CTA) — usado em todas as páginas. */
export function CTABand({
  title = "Pronto para transformar a Guiné-Bissau?",
  description = "Conheça os MVPs navegáveis da GWDC ou fale com nossa equipe para uma demonstração.",
  primaryLabel = "Ver demonstrações (MVPs)",
  primaryHref = "/mvps",
  secondaryLabel = "Falar com a equipe",
  secondaryHref = "/contato",
  className,
}: {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto max-w-7xl px-4 py-16 sm:px-6", className)}>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-navy-900 to-brand-900 px-6 py-14 text-center sm:px-14">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(600px_300px_at_50%_-50%,#5FD4BC,transparent)]" />
        <h2 className="relative font-display text-3xl font-bold text-white sm:text-4xl">{title}</h2>
        <p className="relative mx-auto mt-4 max-w-2xl text-navy-100">{description}</p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Link href={primaryHref}>
            <Button size="lg">
              {primaryLabel} <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href={secondaryHref}>
            <Button size="lg" variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white">
              {secondaryLabel}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Card de problema ou solução com checklist. */
export function CheckListCard({
  title,
  items,
  tone = "danger",
  className,
}: {
  title: string;
  items: string[];
  tone?: "danger" | "success";
  className?: string;
}) {
  return (
    <Card className={cn("h-full p-6", className)}>
      <h3 className="mb-4 font-display text-lg font-semibold text-ink">{title}</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-muted">
            <CheckCircle2
              className={cn("mt-0.5 size-4 shrink-0", tone === "danger" ? "text-danger" : "text-success")}
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** Marca de produto em loop (marquee) para seção de parceiros. */
export function Marquee({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden mask-fade-b">
      <div className="flex w-max animate-marquee gap-4 py-4">
        {children}
        {children}
      </div>
    </div>
  );
}
