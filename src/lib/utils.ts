import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina classes CSS com suporte a condicionais e merge de conflitos (Tailwind). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formata números no padrão guineense (pt-PT / fr-FR: vírgula decimal). */
export function formatNumber(value: number, digits = 0): string {
  return new Intl.NumberFormat("pt-PT", { maximumFractionDigits: digits }).format(value);
}

/** Formata valores monetários em FCFA (Franco CFA da África Ocidental). */
export function formatFcfa(value: number, digits = 0): string {
  return `${formatNumber(value, digits)} FCFA`;
}

/** Formata porcentagens. */
export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

const MONTHS_SHORT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** Converte datas ISO (YYYY-MM-DD) para Date local, evitando deslocamento de fuso. */
function parseLocalDate(value: string): Date {
  const parts = value.split("-").map(Number);
  if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) {
    return new Date(parts[0]!, parts[1]! - 1, parts[2]!);
  }
  return new Date(value);
}

/** Formata datas curtas (ex.: 12 de março de 2026) — sem depender do ICU do Node. */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? parseLocalDate(date) : date;
  return `${d.getDate()} de ${MONTHS_SHORT[d.getMonth()]} de ${d.getFullYear()}`;
}

/** Formata horas (ex.: 14:05). */
export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat("pt-PT", { hour: "2-digit", minute: "2-digit" }).format(new Date(date));
}

/** Converte string com acentos para slug URL. */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Trunca texto com reticências. */
export function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}
