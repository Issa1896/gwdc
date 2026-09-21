import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { PageHeader } from "@/components/dashboard/widgets";
import { BackLink } from "@/components/education/widgets";
import { CALENDAR, CALENDAR_CATEGORIES } from "@/data/education";
import { shortDate } from "@/data/mvp/types";
import { cn } from "@/lib/utils";

const categoryTone: Record<string, "brand" | "gold" | "danger" | "info" | "navy"> = {
  Acadêmico: "info",
  Avaliação: "danger",
  Matrícula: "brand",
  Feriado: "navy",
  Institucional: "gold",
};

/** Calendário acadêmico nacional — visão mensal e agenda. */
export default function CalendarioPage() {
  const months = ["2026-08", "2026-09", "2026-10", "2026-11"].map((prefix) => ({
    key: prefix,
    label: new Intl.DateTimeFormat("pt-PT", { month: "long", year: "numeric" }).format(new Date(`${prefix}-01T00:00:00`)),
    events: CALENDAR.filter((e) => e.date.startsWith(prefix)).sort((a, b) => a.date.localeCompare(b.date)),
  }));

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Calendário Acadêmico Nacional"
        description="Datas oficiais do semestre 2/2026, sincronizadas com portais, AVA e notificações SMS."
        actions={
          <Badge tone="brand" className="self-start">
            Ano letivo 2026/2027
          </Badge>
        }
      />

      {/* Legenda */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-ink-faint uppercase">Legenda:</span>
          {CALENDAR_CATEGORIES.map((c) => (
            <Badge key={c} tone={categoryTone[c]} dot>
              {c}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Vista mensal */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <CalendarDays className="size-4 text-brand-500" /> Vista mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              events={CALENDAR.map((e) => ({
                date: e.date,
                label: e.label,
                tone: e.tone === "navy" || e.tone === "success" || e.tone === "warning" ? "info" : e.tone,
              }))}
            />
          </CardContent>
        </Card>

        {/* Agenda por mês */}
        <div className="space-y-6">
          {months.map((month) => (
            <Card key={month.key}>
              <CardHeader>
                <CardTitle className="text-sm capitalize">{month.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {month.events.length === 0 && <p className="text-sm text-ink-faint">Nenhum evento oficial neste mês.</p>}
                {month.events.map((e) => (
                  <div key={e.date + e.label} className="flex items-center gap-3 rounded-xl border border-border p-3">
                    <span className="grid min-w-14 place-items-center rounded-lg bg-surface-strong px-2 py-1.5 text-center">
                      <span className="font-display text-sm leading-tight font-bold text-ink">{e.date.slice(8, 10)}</span>
                      <span className="text-[10px] text-ink-faint uppercase">{new Intl.DateTimeFormat("pt-PT", { month: "short" }).format(new Date(`${e.date}T00:00:00`))}</span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{e.label}</p>
                      <p className="text-xs text-ink-faint">{shortDate(e.date)}</p>
                    </div>
                    <Badge tone={categoryTone[e.category]} className={cn("hidden sm:inline-flex")}>
                      {e.category}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-ink-faint">
        Calendário administrativo completo no módulo institucional ·{" "}
        <Link href="/app/gw-education" className="font-medium text-brand-600 hover:underline dark:text-brand-300">
          voltar à visão geral
        </Link>
      </p>
    </div>
  );
}