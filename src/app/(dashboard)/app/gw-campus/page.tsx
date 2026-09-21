"use client";

import { useMemo } from "react";
import { FlaskConical, GraduationCap, HeartHandshake, School, Users } from "lucide-react";
import { KpiCard, PageHeader } from "@/components/dashboard/widgets";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AreaTrend, BarCompare, DonutChart } from "@/components/ui/charts";
import { ButtonLink, CourseStatusBadge, ResearchStatusBadge, WelfareStatusBadge } from "@/components/campus/widgets";
import { useCampus } from "@/lib/campus-store";
import { cn } from "@/lib/utils";

const ENROLLMENT_HISTORY = [
  { name: "2023/24", matriculas: 1180 },
  { name: "2024/25", matriculas: 1245 },
  { name: "2025/26", matriculas: 1340 },
  { name: "2026/27", matriculas: 1420 },
  { name: "2027/28", matriculas: 1530 },
  { name: "2028/29", matriculas: 1675 },
];

export default function CampusOverviewPage() {
  const { state } = useCampus();

  const enrolled = useMemo(() => state.turmas.reduce((sum, t) => sum + t.enrolled, 0), [state.turmas]);
  const capacity = useMemo(() => state.turmas.reduce((sum, t) => sum + t.capacity, 0), [state.turmas]);
  const occupancy = capacity > 0 ? Math.round((enrolled / capacity) * 100) : 0;
  const activeCourses = state.cursos.filter((c) => c.status === "active").length;
  const researchActive = state.research.filter((r) => r.status === "active").length;
  const welfareActive = state.welfare.filter((w) => w.status === "ativa").length;

  const regimeData = ["diurno", "noturno", "misto"].map((shift) => ({
    name: shift === "diurno" ? "Diurno" : shift === "noturno" ? "Noturno" : "Misto",
    value: state.turmas.filter((t) => t.shift === shift).reduce((s, t) => s + t.enrolled, 0),
  }));

  const demandPerCourse = state.cursos.map((c) => {
    const turmas = state.turmas.filter((t) => t.courseId === c.id);
    return {
      name: c.code,
      vagas: turmas.reduce((s, t) => s + t.capacity, 0),
      inscritos: turmas.reduce((s, t) => s + t.enrolled, 0),
    };
  });

  const topTurmas = [...state.turmas]
    .map((t) => ({ t, course: state.cursos.find((c) => c.id === t.courseId) }))
    .sort((a, b) => b.t.enrolled / b.t.capacity - a.t.enrolled / a.t.capacity)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visão geral"
        description="Painel reitoral da Universidade Nacional da Guiné-Bissau — oferta, docentes, ciência e vida académica."
        actions={
          <ButtonLink href="/app/gw-campus/turmas" variant="outline" size="sm">
            Gerir turmas
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Estudantes matriculados" value={enrolled.toLocaleString("pt-PT")} delta={6.4} icon={GraduationCap} spark={[1180, 1245, 1340, 1420]} />
        <KpiCard title="Docentes" value={String(state.docentes.length)} delta={3.1} icon={Users} spark={[28, 31, 34, state.docentes.length]} tone="navy" />
        <KpiCard title="Cursos em funcionamento" value={String(activeCourses)} delta={2} icon={School} spark={[8, 9, 10, activeCourses]} tone="gold" />
        <KpiCard title="Taxa de ocupação" value={`${occupancy}%`} delta={occupancy > 80 ? 4.8 : 1.2} icon={FlaskConical} spark={[70, 74, 78, occupancy]} />
      </div>

      {state.config.acreditacao && (
        <Card className="flex items-start gap-3 border-cyan-200 bg-cyan-50/60 p-4 dark:border-cyan-900 dark:bg-cyan-950/40">
          <School className="mt-0.5 size-5 shrink-0 text-cyan-700 dark:text-cyan-300" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-cyan-900 dark:text-cyan-100">Acreditação nacional em curso</p>
            <p className="mt-1 text-sm text-cyan-800/80 dark:text-cyan-200/70">
              A comissão de avaliação externa vai visitar a Universidade Nacional este mês. Os indicadores de qualidade, ocupação e
              empregabilidade já estão sincronizados com a tutela.
            </p>
          </div>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Evolução das matrículas</CardTitle>
            <CardDescription>Estudantes matriculados por ano letivo.</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaTrend data={ENROLLMENT_HISTORY} series={[{ key: "matriculas", name: "Matriculados" }]} formatter={(v) => `${v}`} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estudantes por regime</CardTitle>
            <CardDescription>Distribuição por turno letivo</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={regimeData} formatter={(v) => `${v} estudantes`} />
            {regimeData.map((r) => (
              <div key={r.name} className="mt-1 flex items-center justify-between text-sm">
                <span className="text-ink-muted">{r.name}</span>
                <span className="font-semibold text-ink">{r.value.toLocaleString("pt-PT")}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vagas ofertadas vs. inscritos</CardTitle>
          <CardDescription>Procura por curso no ano letivo 2026/27</CardDescription>
        </CardHeader>
        <CardContent>
          <BarCompare
            data={demandPerCourse}
            series={[
              { key: "vagas", name: "Vagas" },
              { key: "inscritos", name: "Inscritos" },
            ]}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ocupação das turmas</CardTitle>
            <CardDescription>Turmas com maior procura — gerir em Oferta & Turmas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topTurmas.map(({ t, course }) => {
              const pct = Math.min(100, Math.round((t.enrolled / t.capacity) * 100));
              return (
                <div key={t.id} className="flex items-center gap-3">
                  <div className="w-28 shrink-0">
                    <p className="truncate text-sm font-medium text-ink">
                      {course?.code ?? t.code}
                    </p>
                    <p className="text-[11px] text-ink-muted">
                      {t.shift === "diurno" ? "Diurno" : t.shift === "noturno" ? "Noturno" : "Misto"} · {t.enrolled}/{t.capacity}
                    </p>
                  </div>
                  <Progress value={pct} tone={pct >= 95 ? "danger" : pct >= 80 ? "gold" : "brand"} className="flex-1" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-start justify-between">
              <div>
                <CardTitle>Investigação em curso</CardTitle>
                <CardDescription>{researchActive} projetos ativos com financiamento</CardDescription>
              </div>
              <ButtonLink href="/app/gw-campus/investigacao" variant="ghost" size="sm">Ver todos</ButtonLink>
            </CardHeader>
            <CardContent className="space-y-3">
              {state.research.filter((r) => r.status === "active").slice(0, 3).map((r) => (
                <div key={r.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
                    <FlaskConical className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{r.title}</p>
                    <p className="text-xs text-ink-muted">{r.area} · {r.lead}</p>
                  </div>
                  <ResearchStatusBadge status={r.status} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vida académica</CardTitle>
              <CardDescription>Bem-estar estudantil e envolvimento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {state.welfare.slice(0, 3).map((w) => (
                <div key={w.id} className="flex items-center gap-3 text-sm">
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-lg",
                      w.kind === "bolsa" ? "bg-gold-100 text-gold-700 dark:bg-gold-950 dark:text-gold-300" : "bg-surface-strong text-ink-muted",
                    )}
                  >
                    <HeartHandshake className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{w.title}</p>
                    <p className="text-xs text-ink-faint">{w.description}</p>
                  </div>
                  <WelfareStatusBadge status={w.status} />
                </div>
              ))}
              <p className="pt-1 text-xs text-ink-faint">{welfareActive} programas ativos · {state.residencias.length} residências universitárias</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Oferta formativa</CardTitle>
          <CardDescription>Licenciaturas da Universidade Nacional</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {state.cursos.map((c) => (
              <div key={c.id} className="rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display text-sm font-semibold text-ink">{c.name}</p>
                  <CourseStatusBadge status={c.status} />
                </div>
                <p className="mt-1 text-xs text-ink-muted">{c.area} · {c.duration}</p>
                <p className="mt-2 text-[11px] text-ink-faint">
                  {(() => {
                    const t = state.turmas.filter((x) => x.courseId === c.id);
                    return t.length > 0 ? t.map((x) => x.code).join(" · ") : "Sem turmas";
                  })()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}