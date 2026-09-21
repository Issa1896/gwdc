"use client";

import { BookOpen, DoorOpen, GraduationCap, School } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackLink, StatCard } from "@/components/education/widgets";
import { PageHeader } from "@/components/dashboard/widgets";
import { CURSOS, DISCIPLINAS_DO_CURSO } from "@/data/education";
import { useEducation } from "@/lib/education-store";

/** MÓDULO 6 — Catálogo de cursos (licenciaturas). */
export default function CursosPage() {
  const { state } = useEducation();
  const totalAlunos = state.alunos.length;

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Cursos"
        description="Catálogo nacional de licenciaturas e graus acadêmicos oferecidos pelas instituições conectadas."
        actions={<Badge tone="brand" className="self-start">{CURSOS.length} licenciaturas</Badge>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Licenciaturas" value={String(CURSOS.length)} detail="Catálogo nacional vigente" icon={GraduationCap} tone="brand" />
        <StatCard title="Faculdades" value="5" detail="Unidades de ensino superior" icon={School} tone="navy" />
        <StatCard title="Disciplinas vinculadas" value={String(Object.values(DISCIPLINAS_DO_CURSO).reduce((acc, list) => acc + list.length, 0))} detail="Matrizes curriculares 2026" icon={BookOpen} tone="gold" />
        <StatCard title="Alunos no catálogo" value={String(totalAlunos)} detail="Registo nacional vigente" icon={DoorOpen} tone="brand" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {CURSOS.map((curso) => {
          const alunos = state.alunos.filter((e) => e.cursoId === curso.id);
          const disciplinas = DISCIPLINAS_DO_CURSO[curso.id] ?? [];
          return (
            <Card key={curso.id} className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-ink">{curso.nome}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{curso.faculdade}</p>
                </div>
                <Badge tone="navy">{curso.grau}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-surface-alt py-2">
                  <p className="font-display text-sm font-bold text-ink">{curso.duracaoAnos}</p>
                  <p className="text-[10px] text-ink-faint">Anos</p>
                </div>
                <div className="rounded-lg bg-surface-alt py-2">
                  <p className="font-display text-sm font-bold text-ink">{disciplinas.length}</p>
                  <p className="text-[10px] text-ink-faint">Disciplinas</p>
                </div>
                <div className="rounded-lg bg-surface-alt py-2">
                  <p className="font-display text-sm font-bold text-ink">{alunos.length}</p>
                  <p className="text-[10px] text-ink-faint">Alunos</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Turmas ativas por curso</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-2">
          <div className="divide-y divide-border">
            {CURSOS.map((curso) => (
              <div key={curso.id} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm font-medium text-ink">{curso.nome}</span>
                <Badge tone={curso.id === "c1" ? "brand" : "neutral"}>
                  {state.alunos.filter((e) => e.cursoId === curso.id).length} aluno(s)
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}