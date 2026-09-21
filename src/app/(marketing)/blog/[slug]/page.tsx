import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { BLOG_POSTS } from "@/data/content";
import { Badge } from "@/components/ui/badge";
import { CTABand } from "@/components/marketing/sections";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Artigo não encontrado" };
  return { title: post.title, description: post.excerpt };
}

/** Página de artigo do blog. */
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-brand-600">
          <ArrowLeft className="size-4" /> Voltar ao blog
        </Link>
        <header>
          <Badge tone="brand" className="mb-4">{post.category}</Badge>
          <h1 className="font-display text-3xl leading-tight font-bold text-ink sm:text-4xl">{post.title}</h1>
          <p className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink-faint">
            <span className="font-semibold text-ink">{post.author}</span>
            <span className="text-ink-muted">{post.authorRole}</span>
            <span className="flex items-center gap-1"><CalendarDays className="size-3.5" /> {formatDate(post.date)}</span>
            <span className="flex items-center gap-1"><Clock3 className="size-3.5" /> {post.readTime} de leitura</span>
          </p>
        </header>
        <div className="mt-8 space-y-10 border-t border-border pt-8">
          {post.content.map((section) => (
            <section key={section.heading}>
              <h2 className="mb-3 font-display text-xl font-bold text-ink">{section.heading}</h2>
              {section.paragraphs.map((paragraph, i) => (
                <p key={i} className="mb-4 text-base leading-relaxed text-ink-muted">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
      <CTABand
        title="Quer saber mais?"
        description="Explore os produtos e demonstrações da GW Digital Company."
        primaryLabel="Ver produtos"
        primaryHref="/produtos"
        secondaryLabel="Ver MVPs"
        secondaryHref="/mvps"
      />
    </>
  );
}
