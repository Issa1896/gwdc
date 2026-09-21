import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "brand" | "navy" | "gold" | "success" | "warning" | "danger" | "info" | "neutral";

const toneClasses: Record<BadgeTone, string> = {
  brand: "bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-200 border-brand-200 dark:border-brand-800",
  navy: "bg-navy-100 text-navy-800 dark:bg-navy-900 dark:text-navy-100 border-navy-200 dark:border-navy-700",
  gold: "bg-gold-100 text-gold-800 dark:bg-gold-950 dark:text-gold-200 border-gold-200 dark:border-gold-800",
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border-amber-200 dark:border-amber-800",
  danger: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200 border-red-200 dark:border-red-800",
  info: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200 border-sky-200 dark:border-sky-800",
  neutral: "bg-surface-strong text-ink-muted border-border",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  dot?: boolean;
}

/** Selo de status/categoria — Design System GWDC. */
export function Badge({ className, tone = "neutral", dot = false, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}
