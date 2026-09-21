import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

/** Trilha de navegação (breadcrumb) — Design System GWDC. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Trilha de navegação" className="text-sm text-ink-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const Icon = item.icon;
          const content = (
            <span className="inline-flex items-center gap-1">
              {Icon && <Icon className="size-3.5" aria-hidden="true" />}
              {item.label}
            </span>
          );
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="font-medium text-ink">
                  {content}
                </span>
              ) : item.href ? (
                <Link href={item.href} className="transition-colors hover:text-brand-600">
                  {content}
                </Link>
              ) : (
                content
              )}
              {!isLast && <ChevronRight className="size-3.5 text-ink-faint" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
