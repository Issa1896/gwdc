import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/ui/charts";
import { cn } from "@/lib/utils";

/** Cartão de KPI com tendência e sparkline — padrão de dashboards GWDC. */
export function KpiCard({
  title,
  value,
  delta,
  deltaLabel = "vs. mês anterior",
  icon: Icon,
  spark,
  tone = "brand",
}: {
  title: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  icon: LucideIcon;
  spark?: number[];
  tone?: "brand" | "gold" | "navy";
}) {
  const toneColor = tone === "gold" ? "#D79114" : tone === "navy" ? "#2D5C96" : "#0B9E8A";
  const up = (delta ?? 0) >= 0;
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-muted">{title}</p>
          <p className="mt-1.5 font-display text-2xl font-bold text-ink">{value}</p>
        </div>
        <span
          className="grid size-10 place-items-center rounded-lg"
          style={{ background: `${toneColor}1a`, color: toneColor }}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        {delta !== undefined && (
          <Badge tone={up ? "success" : "danger"}>
            {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(delta).toFixed(1)}%
          </Badge>
        )}
        <span className="text-xs text-ink-faint">{deltaLabel}</span>
      </div>
      {spark && (
        <div className="mt-3">
          <Sparkline data={spark} color={toneColor} height={40} />
        </div>
      )}
    </Card>
  );
}

/** Medidor semicircular (radial gauge) — ex.: meta de arrecadação. */
export function Gauge({ value, max = 100, label, unit = "%" }: { value: number; max?: number; label: string; unit?: string }) {
  const pct = Math.min(Math.max(value / max, 0), 1);
  const angle = -90 + pct * 180;
  const color = pct > 0.75 ? "var(--color-success)" : pct > 0.45 ? "var(--color-gold-500)" : "var(--color-danger)";
  const { cx, cy, r } = { cx: 50, cy: 52, r: 40 };
  const a1 = ((angle - 90) * Math.PI) / 180;
  const x2 = cx + r * Math.cos(a1);
  const y2 = cy + r * Math.sin(a1);
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 62" className="w-full max-w-56" role="img" aria-label={`${label}: ${Math.round(value)}${unit}`}>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="var(--color-border)" strokeWidth="9" strokeLinecap="round" />
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${x2} ${y2}`} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" />
        <text x="50" y="58" textAnchor="middle" className="fill-ink font-display text-[13px] font-bold">
          {Math.round(value)}
          {unit}
        </text>
      </svg>
      <p className="text-center text-xs text-ink-muted">{label}</p>
    </div>
  );
}

/** Cabeçalho de página de dashboard. */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-ink-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/** Estado vazio para tabelas e listas. */
export function EmptyState({ title, description, icon: Icon }: { title: string; description?: string; icon: LucideIcon }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-surface-strong text-ink-faint">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <p className="font-medium text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink-muted">{description}</p>}
    </div>
  );
}

/** Indicador neutro de tendência. */
export function TrendNeutral({ label }: { label: string }) {
  return (
    <Badge>
      <Minus className="size-3" />
      {label}
    </Badge>
  );
}
