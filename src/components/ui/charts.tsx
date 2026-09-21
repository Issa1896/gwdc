"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

export interface SeriesPoint {
  name: string;
  [key: string]: string | number;
}

const COLORS = ["#0B9E8A", "#2D5C96", "#D79114", "#5FD4BC", "#EDC653", "#6192C7"];

/** Props do tooltip customizado (assinatura compatível com recharts). */
interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: { name?: string | number; value?: number | string; color?: string; payload?: { fill?: string } }[];
  formatter?: (value: number) => string;
}

/** Tooltip padronizado do Design System GWDC. */
function ChartTooltip({ active, payload, label, formatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-1 font-semibold text-ink">{label}</p>}
      {payload.map((entry) => {
        const value = Number(entry.value);
        return (
          <p key={String(entry.name)} className="flex items-center gap-2 text-ink-muted">
            <span className="size-2 rounded-full" style={{ background: entry.color ?? entry.payload?.fill }} />
            {String(entry.name)}:{" "}
            <span className="font-semibold text-ink">{formatter ? formatter(value) : entry.value}</span>
          </p>
        );
      })}
    </div>
  );
}

const axisProps = {
  tick: { fill: "var(--color-ink-faint)", fontSize: 11 },
  axisLine: false,
  tickLine: false,
};

/** Gráfico de linha (tendências) — Design System GWDC. */
export function LineTrend({
  data,
  series,
  height = 260,
  formatter,
  className,
}: {
  data: SeriesPoint[];
  series: { key: string; name: string }[];
  height?: number;
  formatter?: (v: number) => string;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="name" {...axisProps} />
          <YAxis {...axisProps} width={44} />
          <Tooltip content={<ChartTooltip formatter={formatter} />} />
          {series.map((s, i) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Gráfico de área (evolução cumulativa). */
export function AreaTrend({
  data,
  series,
  height = 260,
  formatter,
  className,
}: {
  data: SeriesPoint[];
  series: { key: string; name: string }[];
  height?: number;
  formatter?: (v: number) => string;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            {series.map((s, i) => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.35} />
                <stop offset="100%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="name" {...axisProps} />
          <YAxis {...axisProps} width={44} />
          <Tooltip content={<ChartTooltip formatter={formatter} />} />
          {series.map((s, i) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              fill={`url(#grad-${s.key})`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Gráfico de barras (comparação). */
export function BarCompare({
  data,
  series,
  height = 260,
  formatter,
  className,
}: {
  data: SeriesPoint[];
  series: { key: string; name: string }[];
  height?: number;
  formatter?: (v: number) => string;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barGap={4}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="name" {...axisProps} />
          <YAxis {...axisProps} width={44} />
          <Tooltip content={<ChartTooltip formatter={formatter} />} cursor={{ fill: "var(--color-surface-alt)" }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {series.map((s, i) => (
            <Bar key={s.key} dataKey={s.key} name={s.name} fill={COLORS[i % COLORS.length]} radius={[6, 6, 0, 0]} maxBarSize={36} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Gráfico de rosca (proporções). */
export function DonutChart({
  data,
  height = 220,
  formatter,
  className,
}: {
  data: { name: string; value: number }[];
  height?: number;
  formatter?: (v: number) => string;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<ChartTooltip formatter={formatter} />} />
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="90%" paddingAngle={3} strokeWidth={0}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Mini-gráfico de linha (sparkline) para KPIs. */
export function Sparkline({ data, color = "#0B9E8A", height = 48 }: { data: number[]; color?: string; height?: number }) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.map((value, i) => ({ i, value }))} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
