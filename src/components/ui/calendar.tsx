"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export interface CalendarEvent {
  date: string;
  label: string;
  tone?: "brand" | "gold" | "danger" | "info";
}

/** Calendário mensal — Design System GWDC. */
export function Calendar({
  events,
  className,
}: {
  events?: CalendarEvent[];
  className?: string;
}) {
  const now = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });

  const eventMap = new Map<string, { label: string; tone: string }[]>();
  events?.forEach((e) => {
    const key = e.date.slice(0, 10);
    eventMap.set(key, [...(eventMap.get(key) ?? []), { label: e.label, tone: e.tone ?? "brand" }]);
  });

  const firstDay = new Date(view.year, view.month, 1).getDay(); // 0 = domingo
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const prevMonthDays = new Date(view.year, view.month, 0).getDate();

  const cells: (number | null)[] = [];
  const offset = (firstDay + 6) % 7; // segunda-feira como início
  for (let i = 0; i < offset; i++) cells.push(prevMonthDays - offset + i + 1);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = new Intl.DateTimeFormat("pt-PT", { month: "long", year: "numeric" }).format(
    new Date(view.year, view.month, 1),
  );

  const move = (delta: number) => {
    const date = new Date(view.year, view.month + delta, 1);
    setView({ year: date.getFullYear(), month: date.getMonth() });
  };

  return (
    <div className={cn("rounded-xl border border-border bg-surface", className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="Mês anterior"
          className="cursor-pointer rounded-md p-1.5 text-ink-muted hover:bg-surface-strong"
        >
          <ChevronLeft className="size-4" />
        </button>
        <p className="font-display text-sm font-semibold text-ink capitalize">{monthLabel}</p>
        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Próximo mês"
          className="cursor-pointer rounded-md p-1.5 text-ink-muted hover:bg-surface-strong"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-px p-3 text-center text-[11px]">
        {WEEKDAYS.map((d) => (
          <div key={d} className="pb-2 font-semibold text-ink-faint">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          const key = day
            ? `${view.year}-${String(view.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            : `empty-${i}`;
          const dayEvents = day ? eventMap.get(key) ?? [] : [];
          const isToday =
            day === now.getDate() && view.month === now.getMonth() && view.year === now.getFullYear();
          return (
            <div
              key={key}
              className={cn(
                "flex min-h-12 flex-col items-center gap-1 rounded-md p-1",
                day ? "hover:bg-surface-alt" : "",
              )}
            >
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-full text-xs",
                  isToday ? "bg-brand-500 font-bold text-white" : "text-ink",
                )}
              >
                {day ?? ""}
              </span>
              {dayEvents.slice(0, 2).map((e, j) => (
                <span
                  key={j}
                  title={e.label}
                  className={cn(
                    "h-1.5 w-full max-w-8 rounded-full",
                    e.tone === "gold" && "bg-gold-400",
                    e.tone === "danger" && "bg-danger",
                    e.tone === "info" && "bg-info",
                    e.tone === "brand" && "bg-brand-400",
                  )}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
