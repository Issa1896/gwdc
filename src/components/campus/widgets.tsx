"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Course, ResearchStatus, WelfareKind, WelfareStatus } from "@/data/campus/types";
import { cn } from "@/lib/utils";

export function BackLink({ href = "/app/gw-campus", label = "Voltar à visão geral" }: { href?: string; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-brand-600"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      {label}
    </Link>
  );
}

const btnVariants: Record<string, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-strong shadow-sm",
  outline: "border border-border-strong bg-surface text-ink hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300",
  ghost: "text-ink-muted hover:bg-surface-strong hover:text-ink",
};

const btnSizes: Record<string, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 select-none",
        btnVariants[variant],
        btnSizes[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function CourseStatusBadge({ status }: { status: Course["status"] }) {
  const map: Record<Course["status"], { label: string; tone: "success" | "warning" | "info" }> = {
    active: { label: "Em funcionamento", tone: "success" },
    new: { label: "Nova oferta", tone: "info" },
    evaluating: { label: "Em avaliação", tone: "warning" },
  };
  const m = map[status];
  return <Badge tone={m.tone} dot>{m.label}</Badge>;
}

export function ResearchStatusBadge({ status }: { status: ResearchStatus }) {
  const map: Record<ResearchStatus, { label: string; tone: "success" | "info" | "neutral" }> = {
    active: { label: "Em curso", tone: "success" },
    pipeline: { label: "Pipeline", tone: "info" },
    concluded: { label: "Concluído", tone: "neutral" },
  };
  const m = map[status];
  return <Badge tone={m.tone} dot>{m.label}</Badge>;
}

export function WelfareKindBadge({ kind }: { kind: WelfareKind }) {
  const map: Record<WelfareKind, { label: string; tone: "gold" | "navy" | "brand" }> = {
    bolsa: { label: "Bolsa", tone: "gold" },
    residencia: { label: "Residência", tone: "navy" },
    apoio: { label: "Apoio", tone: "brand" },
  };
  const m = map[kind];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}

export function WelfareStatusBadge({ status }: { status: WelfareStatus }) {
  const map: Record<WelfareStatus, { label: string; tone: "success" | "warning" | "info" }> = {
    ativa: { label: "Ativa", tone: "success" },
    suspensa: { label: "Suspensa", tone: "warning" },
    candidatura: { label: "Candidatura", tone: "info" },
  };
  const m = map[status];
  return <Badge tone={m.tone} dot>{m.label}</Badge>;
}