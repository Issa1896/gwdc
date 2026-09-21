"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Carrossel — Design System GWDC (acessível, com autoplay opcional). */
export function Carousel({
  children,
  interval = 5000,
  autoPlay = false,
  className,
  slidesToShow = 1,
}: {
  children: ReactNode[];
  interval?: number;
  autoPlay?: boolean;
  className?: string;
  slidesToShow?: number;
}) {
  const [index, setIndex] = useState(0);
  const total = Math.max(1, children.length - slidesToShow + 1);
  const current = Math.min(index, total - 1);

  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    const id = window.setInterval(() => setIndex((prev) => (prev + 1) % total), interval);
    return () => window.clearInterval(id);
  }, [autoPlay, total, interval]);

  const goTo = (next: number) => setIndex(((next % total) + total) % total);

  return (
    <div className={className}>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * (100 / slidesToShow)}%)` }}
        >
          {children.map((child, i) => (
            <div key={i} className="shrink-0 px-2" style={{ width: `${100 / slidesToShow}%` }}>
              {child}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-center gap-3">
        <Button variant="outline" size="icon" aria-label="Anterior" onClick={() => goTo(current - 1)}>
          <ChevronLeft className="size-4" />
        </Button>
        <div className="flex gap-1.5" role="tablist" aria-label="Indicadores do carrossel">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={cn(
                "h-2 cursor-pointer rounded-full transition-all",
                i === current ? "w-6 bg-brand-500" : "w-2 bg-border-strong hover:bg-ink-faint",
              )}
            />
          ))}
        </div>
        <Button variant="outline" size="icon" aria-label="Próximo" onClick={() => goTo(current + 1)}>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
