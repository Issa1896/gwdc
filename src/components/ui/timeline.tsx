import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/ui/badge";

export interface TimelineItemData {
  title: string;
  description?: string;
  date?: string;
  badge?: { label: string; tone?: BadgeProps["tone"] };
  icon?: ReactNode;
}

/** Linha do tempo — Design System GWDC. */
export function Timeline({ items, className }: { items: TimelineItemData[]; className?: string }) {
  return (
    <ol className={cn("relative space-y-6 border-l-2 border-border pl-6", className)}>
      {items.map((item) => (
        <li key={item.title} className="relative">
          <span
            aria-hidden="true"
            className="absolute top-1 -left-[31px] grid size-4 place-items-center rounded-full border-2 border-brand-500 bg-surface"
          >
            <span className="size-1.5 rounded-full bg-brand-500" />
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-sm font-semibold text-ink">{item.title}</h3>
            {item.badge && <Badge tone={item.badge.tone ?? "neutral"}>{item.badge.label}</Badge>}
            {item.date && <time className="text-xs text-ink-faint">{item.date}</time>}
          </div>
          {item.description && <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.description}</p>}
          {item.icon && <div className="mt-2">{item.icon}</div>}
        </li>
      ))}
    </ol>
  );
}
