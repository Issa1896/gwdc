import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Clock3 } from "lucide-react";
import { BLOG_POSTS } from "@/data/content";
import { PageHero, CTABand } from "@/components/marketing/sections";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Ideias e análises da GW Digital Company sobre transformação digital, GovTech, FinTech, educação, clima e o futuro da Guiné-Bissau.",
};

/** Página Blog — índice de artigos. */
export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Início", href: "/" }, { label: "Blog" }]}
        eyebrow="Blog"
        title="Ideias que constroem o futuro"
        description="Análises, estratégias e bastidores da transformação digital da Guiné-Bissau e da África Ocidental."
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Destaque */}
          {featured && (
            <Link href={`/blog/${featured.slug}`} className="group mb-12 block">
              <Card className="overflow-hidden transition-all group-hover:-translate-y-1 group-hover:border-brand-400">
                <div className="grid lg:grid-cols-2">
                  <div className="flex flex-col justify-center p-8 sm:p-12">
                    <Badge tone="brand" className="mb-4 self-start">{featured.category}</Badge>
                    <h2 className="font-display text-2xl leading-snug font-bold text-ink group-hover:text-brand-600 sm:text-3xl dark:group-hover:text-brand-300">
                      {featured.title}
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">{featured.excerpt}</p>
                    <p className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ink-faint">
                      <span className="font-medium text-ink">{featured.author}</span>
                      <span className="flex items-center gap-1"><CalendarDays className="size-3.5" /> {formatDate(featured.date)}</span>
                      <span className="flex items-center gap-1"><Clock3 className="size-3.5" /> {featured.readTime}</span>
                    </p>
                  </div>
                  <div className="hidden min-h-64 bg-gradient-to-br from-brand-500/20 via-navy-900 to-brand-800 lg:block" aria-hidden="true">
                    <div className="flex h-full items-center justify-center">
                      <span className="font-display text-7xl font-bold text-white/20">{featured.category.slice(0, 2).toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          )}

          {/* Demais artigos */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card className="flex h-full flex-col p-6 transition-all group-hover:-translate-y-1 group-hover:border-brand-400">
                  <Badge tone="navy" className="mb-3 self-start">{post.category}</Badge>
                  <h3 className="font-display text-lg leading-snug font-semibold text-ink group-hover:text-brand-600 dark:group-hover:text-brand-300">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>
                  <p className="mt-4 flex items-center justify-between text-xs text-ink-faint">
                    <span>{post.author}</span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="size-3.5" /> {formatDate(post.date)}
                    </span>
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title="Receba nossas análises"
        description="Assine a newsletter da GWDC e receba ideias sobre o futuro digital da Guiné-Bissau."
        primaryLabel="Falar com a equipe"
        primaryHref="/contato"
        secondaryLabel="Ver os MVPs"
        secondaryHref="/mvps"
      />
    </>
  );
}
