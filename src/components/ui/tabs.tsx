"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  label: string;
  value: string;
  icon?: ReactNode;
}

/** Abas — Design System GWDC. */
export function Tabs({
  items,
  defaultValue,
  onChange,
  className,
  children,
}: {
  items: TabItem[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  children?: (active: string) => ReactNode;
}) {
  const [active, setActive] = useState(defaultValue ?? items[0]?.value ?? "");

  return (
    <div className={className}>
      <div role="tablist" aria-label="Seções" className="flex flex-wrap gap-1 border-b border-border">
        {items.map((item) => {
          const isActive = active === item.value;
          return (
            <button
              key={item.value}
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActive(item.value);
                onChange?.(item.value);
              }}
              className={cn(
                "flex cursor-pointer items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-brand-500 text-brand-600 dark:text-brand-300"
                  : "border-transparent text-ink-muted hover:text-ink",
              )}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>
      {children?.(active)}
    </div>
  );
}
