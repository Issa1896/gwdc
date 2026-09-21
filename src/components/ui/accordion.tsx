"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Accordion — Design System GWDC. */
export function Accordion({
  items,
  multiple = false,
  className,
}: {
  items: { title: string; content: ReactNode }[];
  multiple?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState<number[]>(multiple ? [0] : []);

  const toggle = (index: number) => {
    setOpen((prev) => (multiple ? (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]) : prev[0] === index ? [] : [index]));
  };

  return (
    <div className={cn("divide-y divide-border rounded-xl border border-border", className)}>
      {items.map((item, index) => {
        const isOpen = multiple ? open.includes(index) : open[0] === index;
        return (
          <div key={item.title}>
            <button
              type="button"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-medium text-ink transition-colors hover:bg-surface-alt"
            >
              <span>{item.title}</span>
              <ChevronDown
                aria-hidden="true"
                className={cn("size-4 shrink-0 text-ink-muted transition-transform duration-200", isOpen && "rotate-180")}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm leading-relaxed text-ink-muted">{item.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
