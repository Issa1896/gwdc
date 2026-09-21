"use client";

import { useMemo, useState } from "react";
import { BookOpen, Clock, Layers, Wallet } from "lucide-react";
import { PageHeader } from "@/components/dashboard/widgets";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BackLink, CourseStatusBadge, ButtonLink } from "@/components/campus/widgets";
import { useCampus } from "@/lib/campus-store";

const REGIMES: Record<string, { label: string; tone: "navy" | "gold" | "brand" | "info" }> = {
  presencial: { label: "Presencial", tone: "navy" },
  hibrido: { label: "Híbrido", tone: "gold" },
  distancia: { label: "A distância", tone: "info" },
};

export default function CursosPage() {
  const { state } = useCampus();
  const [selectedId, setSelectedId] = useState<string>(state.cursos[0]?.id ?? "");

  const matriculasPorCurso = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of state.turmas) map.set(t.courseId, (map.get(t.courseId) ?? 0) + t.enrolled);
    return map;
  }, [state.turmas]);

  const selected = state.cursos.find((c) => c.id === selectedId) ?? state.cursos[0];
  const selectedTurmas = state.turmas.filter((t) => t.courseId === selected?.id);
  const totalEcts = selected ? selected.soa.reduce((s, c) => s + c.ects, 0) : 0;
  const fee = selected?.mensalidade ?? 0;

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Cursos & Matrizes"
        description="Licenciaturas, regimes de funcionamento e matrizes curriculares da Universidade Nacional."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {state.cursos.map((c) => {
          const matriculados = matriculasPorCurso.get(c.id) ?? 0;
          const active = selectedId === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              className={`rounded-xl border p-4 text-left transition-all ${active ? "border-cyan-400 bg-cyan-50/50 dark:border-cyan-700 dark:bg-cyan-950/40" : "border-border bg-surface hover:border-border-strong"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-sm font-semibold text-ink">{c.name}</p>
                <span className="font-mono text-[11px] text-ink-faint">{c.code}</span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <CourseStatusBadge status={c.status} />
                <Badge tone={REGIMES[c.regime]?.tone ?? "neutral"}>{REGIMES[c.regime]?.label ?? c.regime}</Badge>
              </div>
              <p className="mt-3 text-xs text-ink-muted">{c.area} · {c.duration} · {c.ectsCp} ECTS</p>
              <p className="mt-1 text-xs text-ink-faint">{matriculados} matriculados · {c.soa.length} semestres</p>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{selected.name} — Matriz curricular</CardTitle>
              <CardDescription>
                {selected.soa.length} semestres · ECTS por semestre e total do plano
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-surface-strong p-3">
                  <Layers className="size-4 text-cyan-700 dark:text-cyan-300" aria-hidden="true" />
                  <p className="mt-1.5 font-display text-lg font-bold text-ink">{selected.soa.length} semestres</p>
                  <p className="text-xs text-ink-muted">Plano de estudos</p>
                </div>
                <div className="rounded-xl bg-surface-strong p-3">
                  <BookOpen className="size-4 text-cyan-700 dark:text-cyan-300" aria-hidden="true" />
                  <p className="mt-1.5 font-display text-lg font-bold text-ink">{selected.soa.reduce((s, c) => s + c.ects, 0)} ECTS</p>
                  <p className="text-xs text-ink-muted">Carga total</p>
                </div>
                <div className="rounded-xl bg-surface-strong p-3">
                  <Clock className="size-4 text-cyan-700 dark:text-cyan-300" aria-hidden="true" />
                  <p className="mt-1.5 font-display text-lg font-bold text-ink">{selected.duration}</p>
                  <p className="text-xs text-ink-muted">Duração</p>
                </div>
                <div className="rounded-xl bg-surface-strong p-3">
                  <Wallet className="size-4 text-cyan-700 dark:text-cyan-300" aria-hidden="true" />
                  <p className="mt-1.5 font-display text-lg font-bold text-ink">{fee.toLocaleString("pt-PT")} FCFA</p>
                  <p className="text-xs text-ink-muted">Propina mensal</p>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Semestre</TableHead>
                    <TableHead>Cadeiras</TableHead>
                    <TableHead>ECTS</TableHead>
                    <TableHead>Oferta 2026/27</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selected.soa.map((s) => {
                    const turma = selectedTurmas.find((t) => t.semester === s.num) ?? selectedTurmas[0];
                    return (
                      <TableRow key={s.num}>
                        <TableCell className="font-medium text-ink">{s.num}.º semestre</TableCell>
                        <TableCell className="text-sm text-ink-muted">{s.courses.join(" · ")}</TableCell>
                        <TableCell className="text-sm text-ink">{s.ects} ECTS</TableCell>
                        <TableCell className="text-sm text-ink-muted">
                          {turma ? `${turma.code} — ${turma.enrolled}/${turma.capacity} inscritos` : "Por constituir"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell className="font-semibold text-ink">Total</TableCell>
                    <TableCell className="text-xs text-ink-faint">plano de {selected.duration}</TableCell>
                    <TableCell className="font-semibold text-ink">{totalEcts} ECTS</TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Turmas deste curso</CardTitle>
                <CardDescription>Oferta 2026/27</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedTurmas.length === 0 && (
                  <p className="text-sm text-ink-muted">Sem turmas constituídas para este curso.</p>
                )}
                {selectedTurmas.map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3 text-sm">
                    <div>
                      <p className="font-medium text-ink">{t.code}</p>
                      <p className="text-xs text-ink-muted">
                        {t.shift === "diurno" ? "Diurno" : t.shift === "noturno" ? "Noturno" : "Misto"} · {t.semester}º semestre
                      </p>
                    </div>
                    <p className="text-xs text-ink-muted">{t.enrolled}/{t.capacity}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-cyan-200 bg-cyan-50/50 p-4 dark:border-cyan-900 dark:bg-cyan-950/40">
              <p className="text-sm font-semibold text-ink">Matriz em vigor</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                Aprovação do Ministério da Educação e Ensino Superior · plano {selected?.ectsCp ?? "—"} ECTS ajustado ao sistema
                nacional de créditos.
              </p>
              <ButtonLink href="/app/gw-campus/turmas" variant="outline" size="sm" className="mt-3">
                Gerir turmas
              </ButtonLink>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}