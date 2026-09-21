"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PROVIDERS, PROVIDER_NAMES, stableLatency } from "@/data/pay";
import type { ProviderId, TxStatus } from "@/data/pay/types";
import { cn } from "@/lib/utils";

/** Link de retorno usado no topo das páginas do módulo. */
export function BackLink({ href = "/app/gw-pay", label = "Voltar à visão geral" }: { href?: string; label?: string }) {
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

/** Link estilizado como botão (o kit não suporta asChild). */
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

/** Selo de estado de uma transação. */
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

/** Selo do método/conector usado na transação. */
export function MethodBadge({ method }: { method: ProviderId | "gw-wallet" }) {
  const isMobile = method === "orange-money" || method === "momo";
  return (
    <Badge tone={isMobile ? "gold" : method === "gw-wallet" ? "success" : "info"}>
      {method === "gw-wallet" ? "Carteira GW" : PROVIDER_NAMES[method]}
    </Badge>
  );
}

/** Valor com sinal e cor por direção. */
export function Money({ value }: { value: number }) {
  const negative = value < 0;
  return (
    <span className={cn("font-semibold tabular-nums", negative ? "text-ink" : "text-emerald-600 dark:text-emerald-400")}>
      {negative ? "−" : "+"}
      {Math.abs(value).toLocaleString("pt-PT")} <span className="text-xs font-medium text-ink-faint">FCFA</span>
    </span>
  );
}

/** Latência estável do conector (saúde simulada). */
export function LatencyPill({ providerId, className }: { providerId: ProviderId; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs text-ink-muted tabular-nums", className)}>
      <span className={cn("size-1.5 rounded-full", providerId === "gw-pix" ? "bg-emerald-500" : "bg-amber-500")} />
      {stableLatency(providerId)} ms
    </span>
  );
}

/** Copia texto para a área de transferência com feedback visual. */
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

/**
 * QR Code visual (simulação) — padrão determinístico derivado do seed.
 * Apenas representação visual; a interoperabilidade real é descrita na
 * página de provedores (API /pix/qrcode).
 */
export function QrCode({ seed, size = 17 }: { seed: string; size?: number }) {
  const src = seed || "gw-pay";
  let h = 2166136261;
  for (let i = 0; i < src.length; i++) {
    h ^= src.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const modules: boolean[] = [];
  for (let i = 0; i < size * size; i++) {
    h = (h * 31 + i * 7 + src.charCodeAt(i % src.length)) | 0;
    modules.push(((h >>> 0) & 0b111) !== 0);
  }
  const finder = (row: number, col: number) =>
    (row < 4 && col < 4) || (row < 4 && col >= size - 4) || (row >= size - 4 && col < 4);
  return (
    <div
      aria-label="QR Code simulado"
      role="img"
      className="grid w-fit gap-px rounded-lg border border-border bg-border p-2"
      style={{ gridTemplateColumns: `repeat(${size}, 5px)` }}
    >
      {Array.from({ length: size }).map((_, r) =>
        Array.from({ length: size }).map((_, c) => {
          const inFinder = finder(r, c);
          const solid = inFinder ? (r + c) % 2 === 0 : modules[r * size + c];
          return <span key={`${r}-${c}`} className="size-[5px] rounded-[0.5px]" style={{ background: solid ? "#0f172a" : "transparent" }} />;
        }),
      )}
    </div>
  );
}

/** Cartão de conector (usado na visão geral e na página de provedores). */
export function ConnectorStatusBadge({ providerId }: { providerId: ProviderId }) {
  const provider = PROVIDERS.find((p) => p.id === providerId);
  if (!provider) return null;
  return (
    <Badge tone="neutral" dot>
      {provider.short} · <LatencyPill providerId={providerId} />
    </Badge>
  );
}