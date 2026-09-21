import type { LucideIcon } from "lucide-react";
import type { BadgeProps } from "@/components/ui/badge";

/** Tipos do motor de MVPs (Módulo 5) — dados fictícios realistas. */

export interface MvpKpi {
  title: string;
  value: string;
  delta?: number;
  icon: LucideIcon;
  tone?: "brand" | "gold" | "navy";
  spark?: number[];
}

export interface MvpChart {
  id: string;
  title: string;
  type: "line" | "area" | "bar" | "donut";
  data: { name: string; [key: string]: string | number }[];
  series?: { key: string; name: string }[];
  kind?: "number" | "fcfa" | "percent";
}

export type MvpCell =
  | { kind: "text"; value: string }
  | { kind: "badge"; value: string; tone: BadgeProps["tone"] }
  | { kind: "currency"; value: number }
  | { kind: "number"; value: number }
  | { kind: "date"; value: string };

export interface MvpTable {
  id: string;
  title: string;
  description?: string;
  columns: string[];
  rows: MvpCell[][];
}

export interface MvpAlert {
  tone: "info" | "success" | "warning" | "danger";
  title: string;
  message: string;
}

export interface MvpData {
  productSlug: string;
  greeting: string;
  kpis: MvpKpi[];
  charts: MvpChart[];
  tables: MvpTable[];
  alerts: MvpAlert[];
  extras?: string[];
}

/** Helpers compactos para células de tabela. */
export const text = (value: string): MvpCell => ({ kind: "text", value });
export const badge = (value: string, tone: BadgeProps["tone"] = "neutral"): MvpCell => ({ kind: "badge", value, tone });
export const currency = (value: number): MvpCell => ({ kind: "currency", value });
export const number = (value: number): MvpCell => ({ kind: "number", value });
export const date = (value: string): MvpCell => ({ kind: "date", value });

/** Formata FCFA para uso em tabelas. */
export const fcfa = (value: number) => new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 0 }).format(value) + " FCFA";

export const shortDate = (value: string) =>
  new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short" }).format(new Date(value));
