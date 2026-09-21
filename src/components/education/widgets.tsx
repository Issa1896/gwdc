"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fcfa, shortDate, type Cell } from "@/data/education/types";

/** Renderiza célula do sistema GW Education. */
export function EduCell({ cell }: { cell: Cell }) {
  switch (cell.kind) {
    case "badge":
      return <Badge tone={cell.tone}>{cell.value}</Badge>;
    case "number":
      return <span className="tabular-nums">{cell.value.toLocaleString("pt-PT")}</span>;
    case "currency":
      return <span className="font-medium tabular-nums">{fcfa(cell.value)}</span>;
    case "percent":
      return <span className="tabular-nums">{cell.value.toFixed(1)}%</span>;
    case "date":
      return <span className="whitespace-nowrap">{shortDate(cell.value)}</span>;
    default:
      return <span>{cell.value}</span>;
  }
}

/** Tabela de dados genérica do sistema. */
export function EduTable({
  columns,
  rows,
  onRowClick,
  rowKey,
  dense,
}: {
  columns: string[];
  rows: Cell[][];
  onRowClick?: (rowIndex: number) => void;
  rowKey?: (rowIndex: number) => string;
  dense?: boolean;
}) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((col) => (
            <TableHeader key={col}>{col}</TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow
            key={rowKey?.(i) ?? i}
            onClick={onRowClick ? () => onRowClick(i) : undefined}
            className={cn(onRowClick && "cursor-pointer")}
          >
            {row.map((cell, j) => (
              <TableCell key={j} className={dense ? "py-2" : undefined}>
                <EduCell cell={cell} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** Paginação controlada pelo consumidor. */
export function Pager({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }
  const go = (next: number) => onChange(Math.min(Math.max(next, 1), totalPages));
  return (
    <nav aria-label="Paginação" className="flex items-center justify-between gap-2 pt-4">
      <p className="text-xs text-ink-faint">
        Página {page} de {totalPages}
      </p>
      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="icon" aria-label="Página anterior" disabled={page === 1} onClick={() => go(page - 1)}>
          <ChevronLeft className="size-4" />
        </Button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e-${i}`} className="px-1.5 text-ink-faint">…</span>
          ) : (
            <Button
              key={p}
              variant={p === page ? "primary" : "outline"}
              size="icon"
              aria-current={p === page ? "page" : undefined}
              aria-label={`Página ${p}`}
              onClick={() => go(p)}
              className="text-xs font-semibold"
            >
              {p}
            </Button>
          ),
        )}
        <Button variant="outline" size="icon" aria-label="Próxima página" disabled={page === totalPages} onClick={() => go(page + 1)}>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  );
}

/** Ligação de navegação de volta para a página anterior do módulo. */
export function BackLink({ href = "/app/gw-education", label = "Voltar à visão geral" }: { href?: string; label?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:underline dark:text-brand-300">
      <ArrowLeft className="size-4" aria-hidden="true" /> {label}
    </Link>
  );
}

/** Campo de busca com ícone. */
export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
      <Input aria-label={placeholder} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="pl-9" />
    </div>
  );
}

/** Interruptor (switch) para configurações. */
export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label ?? "Interruptor"}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors",
        checked ? "border-brand-500 bg-brand-500" : "border-border-strong bg-surface-strong",
      )}
    >
      <span
        className={cn(
          "absolute size-4.5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

/** Cartão de estatística simples com ícone e realce. */
export function StatCard({
  title,
  value,
  detail,
  icon: Icon,
  tone = "brand",
}: {
  title: string;
  value: string;
  detail?: string;
  icon: LucideIcon;
  tone?: "brand" | "navy" | "gold";
}) {
  const toneColor = tone === "gold" ? "#D79114" : tone === "navy" ? "#2D5C96" : "#0B9E8A";
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-muted">{title}</p>
          <p className="mt-1.5 font-display text-2xl font-bold text-ink">{value}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-lg" style={{ background: `${toneColor}1a`, color: toneColor }}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      {detail && <p className="mt-2 text-xs text-ink-faint">{detail}</p>}
    </Card>
  );
}

/** Cartão com título e conteúdo padrão do sistema. */
export function EduCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle className="text-sm">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/** Barra de progresso compacta. */
export function ProgressBar({ value, tone = "brand" }: { value: number; tone?: "brand" | "gold" | "danger" | "success" | "info" }) {
  const tones = { brand: "bg-brand-500", gold: "bg-gold-500", danger: "bg-danger", success: "bg-success", info: "bg-info" };
  const clamped = Math.min(Math.max(value, 0), 100);
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-strong" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn("h-full rounded-full transition-all duration-500", tones[tone])} style={{ width: `${clamped}%` }} />
    </div>
  );
}

/** Campo de seleção com contagem de linhas por página. */
export function usePagination(totalItems: number, pageSize = 8) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = (page - 1) * pageSize;
  return { page, setPage, start, pageSize, totalPages, slice: <T,>(items: T[]) => items.slice(start, start + pageSize) };
}