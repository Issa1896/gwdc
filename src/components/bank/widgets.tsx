"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AlertSeverity, AlertStatus, CardStatus, ConsentStatus, TxStatus } from "@/data/bank/types";
import { cn } from "@/lib/utils";

export function BackLink({ href = "/app/gw-bank", label = "Voltar à visão geral" }: { href?: string; label?: string }) {
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

export function BankMoney({ value }: { value: number }) {
  const negative = value < 0;
  return (
    <span className={cn("font-semibold tabular-nums", negative ? "text-ink" : "text-emerald-600 dark:text-emerald-400")}>
      {negative ? "−" : "+"}
      {Math.abs(value).toLocaleString("pt-PT")} <span className="text-xs font-medium text-ink-faint">FCFA</span>
    </span>
  );
}

export function TxStatusBadge({ status }: { status: TxStatus }) {
  const map: Record<TxStatus, { label: string; tone: "success" | "warning" | "danger" | "neutral" }> = {
    settled: { label: "Liquidada", tone: "success" },
    processing: { label: "Processando", tone: "warning" },
    failed: { label: "Falhou", tone: "danger" },
    refunded: { label: "Reembolsada", tone: "neutral" },
  };
  const m = map[status];
  return <Badge tone={m.tone} dot>{m.label}</Badge>;
}

export function CardStatusBadge({ status }: { status: CardStatus }) {
  const map: Record<CardStatus, { label: string; tone: "success" | "neutral" | "warning" }> = {
    active: { label: "Ativo", tone: "success" },
    blocked: { label: "Bloqueado", tone: "warning" },
    requested: { label: "Solicitado", tone: "neutral" },
  };
  const m = map[status];
  return <Badge tone={m.tone} dot>{m.label}</Badge>;
}

export function ConsentStatusBadge({ status }: { status: ConsentStatus }) {
  const map: Record<ConsentStatus, { label: string; tone: "success" | "neutral" | "warning" }> = {
    active: { label: "Ativo", tone: "success" },
    revoked: { label: "Revogado", tone: "neutral" },
    expired: { label: "Expirado", tone: "warning" },
  };
  const m = map[status];
  return <Badge tone={m.tone} dot>{m.label}</Badge>;
}

export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  const map: Record<AlertSeverity, { label: string; tone: "danger" | "warning" | "info" }> = {
    alta: { label: "Alta", tone: "danger" },
    media: { label: "Média", tone: "warning" },
    baixa: { label: "Baixa", tone: "info" },
  };
  const m = map[severity];
  return <Badge tone={m.tone} dot>{m.label}</Badge>;
}

export function AlertStatusBadge({ status }: { status: AlertStatus }) {
  const map: Record<AlertStatus, { label: string; tone: "warning" | "neutral" | "danger" }> = {
    pending: { label: "Em análise", tone: "warning" },
    reviewed: { label: "Revisto", tone: "neutral" },
    blocked: { label: "Bloqueado", tone: "danger" },
  };
  const m = map[status];
  return <Badge tone={m.tone} dot>{m.label}</Badge>;
}

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        navigator.clipboard?.writeText(value).catch(() => undefined);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
    >
      {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
      {copied ? "Copiado" : label}
    </Button>
  );
}