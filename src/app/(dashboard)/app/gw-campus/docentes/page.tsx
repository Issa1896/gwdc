"use client";

import { useMemo } from "react";
import { BookOpen, FlaskConical, GraduationCap, Users } from "lucide-react";
import { KpiCard, PageHeader } from "@/components/dashboard/widgets";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BackLink } from "@/components/campus/widgets";
import { useCampus } from "@/lib/campus-store";

const CATEGORY_TONE: Record<string, "navy" | "gold" | "brand" | "info" | "neutral"> = {
  catedratico: "navy",
  associado: "gold",
  auxiliar: "brand",
  convidado: "info",
  monitor: "neutral",
};

const CATEGORY_LABEL: Record<string, string> = {
  catedratico: "Professor Catedrático",
  associado: "Professor Associado",
  auxiliar: "Professor Auxiliar",
  convidado: "Docente Convidado",
  monitor: "Monitor",
};

export default function DocentesPage() {
  const { state } = useCampus();

  const stats = useMemo(() => {
    const aulas = state.docentes.reduce((s, d) => s + d.aulasSemanais, 0);
    const aulasPorProjeto = state.docentes.reduce((s, d) => s + d.projetos, 0);
    return { catedraticos: state.docentes.filter((d) => d.categoria === "catedratico").length, aulas, aulasPorProjeto };
  }, [state.docentes]);

  const turmasPorDocente = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of state.turmas) if (t.professorId) map.set(t.professorId, (map.get(t.professorId) ?? 0) + 1);
    return map;
  }, [state.turmas]);

  return (
    <div className="space-y-6">
      <BackLink href="/app/gw-campus" label="Voltar à visão geral" />
      <PageHeader
        title="Docentes"
        description="Corpo docente da Universidade Nacional — categorias, cargas letivas e investigação."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Docentes" value={String(state.docentes.length)} delta={3.1} icon={Users} spark={[28, 31, 34, state.docentes.length]} tone="navy" />
        <KpiCard title="Aulas por semana" value={String(stats.aulas)} delta={1.8} icon={BookOpen} spark={[190, 205, 218, stats.aulas]} tone="brand" />
        <KpiCard title="Catedráticos" value={String(stats.catedraticos)} delta={1} icon={GraduationCap} spark={[2, 3, 3, stats.catedraticos]} tone="gold" />
        <KpiCard title="Aulas por projeto" value={String(stats.aulasPorProjeto)} delta={0.4} icon={FlaskConical} spark={[38, 42, 47, stats.aulasPorProjeto]} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {state.docentes.map((d) => {
          const turmas = turmasPorDocente.get(d.id) ?? 0;
          const carga = Math.min(100, Math.round((d.aulasSemanais / 24) * 100));
          return (
            <Card key={d.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-cyan-50 text-sm font-bold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                    {d.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </span>
                  <div>
                    <p className="font-display text-sm font-semibold text-ink">{d.name}</p>
                    <p className="text-xs text-ink-muted">{d.specialty}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge tone={CATEGORY_TONE[d.categoria] ?? "neutral"}>{CATEGORY_LABEL[d.categoria] ?? d.categoria}</Badge>
                {d.coordinator && <Badge tone="success" dot>Coordenador</Badge>}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-surface-strong p-2">
                  <p className="font-display text-base font-bold text-ink">{d.aulasSemanais}h</p>
                  <p className="text-[11px] text-ink-faint">Aulas/semana</p>
                </div>
                <div className="rounded-lg bg-surface-strong p-2">
                  <p className="font-display text-base font-bold text-ink">{d.projetos}</p>
                  <p className="text-[11px] text-ink-faint">Projetos</p>
                </div>
                <div className="rounded-lg bg-surface-strong p-2">
                  <p className="font-display text-base font-bold text-ink">{turmas}</p>
                  <p className="text-[11px] text-ink-faint">Turmas</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-[11px] text-ink-faint">
                  <span>Carga letiva</span>
                  <span>{carga}%</span>
                </div>
                <Progress value={carga} tone={carga >= 90 ? "gold" : "brand"} />
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Critérios de contratação</CardTitle>
          <CardDescription>Política de corpo docente aprovada pelo conselho científico</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 text-sm text-ink-muted sm:grid-cols-2">
            <li>· Mínimo de 60% de professores com doutoramento por curso.</li>
            <li>· Carga letiva semanal entre 8h e 24h conforme a categoria.</li>
            <li>· Cada docente integra pelo menos um projeto de investigação.</li>
            <li>· Coordenação de curso por docente efetivo, não convidado.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}