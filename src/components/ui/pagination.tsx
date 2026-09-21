"use client";

import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Paginação — Design System GWDC. */
export function Pagination({
  totalPages,
  page,
  onPageChange,
  className,
}: {
  totalPages: number;
  page: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const [current, setCurrent] = useState(page);

  const goTo = (next: number) => {
    const clamped = Math.min(Math.max(next, 1), totalPages);
    setCurrent(clamped);
    onPageChange(clamped);
  };

  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - current) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  return (
    <nav aria-label="Paginação" className={cn("flex items-center gap-1.5", className)}>
      <Button variant="outline" size="icon" aria-label="Página anterior" disabled={current === 1} onClick={() => goTo(current - 1)}>
        <ChevronLeft className="size-4" />
      </Button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e-${i}`} className="px-1.5 text-ink-faint">
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === current ? "primary" : "outline"}
            size="icon"
            aria-current={p === current ? "page" : undefined}
            aria-label={`Página ${p}`}
            onClick={() => goTo(p)}
            className="text-xs font-semibold"
          >
            {p}
          </Button>
        ),
      )}
      <Button variant="outline" size="icon" aria-label="Próxima página" disabled={current === totalPages} onClick={() => goTo(current + 1)}>
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}

export function PaginationStateful({ totalPages = 8 }: { totalPages?: number }) {
  return <Pagination totalPages={totalPages} page={1} onPageChange={() => undefined} />;
}

export type { ReactNode };
