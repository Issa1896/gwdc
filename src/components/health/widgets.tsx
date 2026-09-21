"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ConsultaStatus, ConsultaTipo, SurtoStatus } from "@/data/health/types";
import { cn } from "@/lib/utils";

export function BackLink({ href = "/app/gw-health", label = "Voltar à visão geral" }: { href?: string; label?: string }) {
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

export function ConsultaTipoBadge({ tipo }: { tipo: ConsultaTipo }) {
  return <Badge tone={tipo === "teleconsulta" ? "info" : "neutral"}>{tipo === "teleconsulta" ? "Teleconsulta" : "Presencial"}</Badge>;
}

export function ConsultaStatusBadge({ status }: { status: ConsultaStatus }) {
  const map: Record<ConsultaStatus, { label: string; tone: "success" | "warning" | "danger" }> = {
    realizada: { label: "Realizada", tone: "success" },
    agendada: { label: "Agendada", tone: "warning" },
    cancelada: { label: "Cancelada", tone: "danger" },
  };
  const m = map[status];
  return <Badge tone={m.tone} dot>{m.label}</Badge>;
}

export function TriagemBadge({ triagem }: { triagem?: "normal" | "alerta" | "critica" }) {
  if (!triagem) return <span className="text-xs text-ink-faint">—</span>;
  const map = {
    normal: { label: "Normal", tone: "success" as const },
    alerta: { label: "Alerta", tone: "warning" as const },
    critica: { label: "Crítica", tone: "danger" as const },
  };
  const m = map[triagem];
  return <Badge tone={m.tone} dot>{m.label}</Badge>;
}

export function SurtoStatusBadge({ situacao }: { situacao: SurtoStatus }) {
  const map: Record<SurtoStatus, { label: string; tone: "success" | "warning" | "danger" }> = {
    ativo: { label: "Ativo", tone: "danger" },
    monitorado: { label: "Monitorado", tone: "warning" },
    controlado: { label: "Controlado", tone: "success" },
  };
  const m = map[situacao];
  return <Badge tone={m.tone} dot>{m.label}</Badge>;
}

export function TendenciaBadge({ tendencia }: { tendencia: "subida" | "estavel" | "descida" }) {
  const map = {
    subida: { label: "Em subida", tone: "danger" as const },
    estavel: { label: "Estável", tone: "neutral" as const },
    descida: { label: "Em descida", tone: "success" as const },
  };
  const m = map[tendencia];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}