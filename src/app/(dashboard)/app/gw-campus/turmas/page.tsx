"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, UserPlus } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/dashboard/widgets";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BackLink } from "@/components/campus/widgets";
import { useCampus } from "@/lib/campus-store";
import { cn } from "@/lib/utils";

const SHIFT_LABEL: Record<string, string> = { diurno: "Diurno", noturno: "Noturno", misto: "Misto" };

export default function TurmasPage() {
  const { state, allocateProfessor, setCapacity, enroll } = useCampus();
  const [filter, setFilter] = useState<string>("all");

  const rows = useMemo(() => {
    const list = state.turmas
      .map((t) => ({ t, course: state.cursos.find((c) => c.id === t.courseId) }))
      .sort((a, b) => a.t.code.localeCompare(b.t.code));
    return filter === "all" ? list : list.filter(({ course }) => course?.id === filter);
  }, [state.turmas, state.cursos, filter]);

  const occupied = rows.filter(({ t }) => t.enrolled >= t.capacity).length;

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Oferta & Turmas"
        description="Afectação de docentes, capacidade das turmas e inscrições do ano letivo 2026/27."
        actions={
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand-400"
            aria-label="Filtrar por curso"
          >
            <option value="all">Todos os cursos</option>
            {state.cursos.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        }
      />

      {occupied > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-semibold">Atenção: {occupied} turma(s) com ocupação plena.</p>
          <p className="mt-0.5 text-amber-800/80 dark:text-amber-200/70">Considere abrir novas turmas ou ajustar a capacidade nas linhas abaixo.</p>
        </div>
      )}

      <Card>
        {rows.length === 0 ? (
          <EmptyState title="Sem turmas" description="Não existem turmas para o filtro selecionado." icon={UserPlus} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Turma</TableHead>
                <TableHead>Curso & semestre</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead>Docente responsável</TableHead>
                <TableHead className="text-right">Capacidade</TableHead>
                <TableHead className="text-right">Inscritos</TableHead>
                <TableHead>Ocupação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ t, course }) => {
                const pct = Math.min(100, Math.round((t.enrolled / t.capacity) * 100));
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium text-ink">{t.code}</TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-ink">{course?.name ?? t.courseId}</p>
                      <p className="text-xs text-ink-muted">{t.semester}.º semestre · {t.year}º ano</p>
                    </TableCell>
                    <TableCell className="text-sm text-ink-muted">{SHIFT_LABEL[t.shift] ?? t.shift}</TableCell>
                    <TableCell>
                      <select
                        value={t.professorId}
                        onChange={(e) => allocateProfessor(t.id, e.target.value)}
                        className="w-full max-w-52 rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-sm text-ink outline-none focus:border-brand-400"
                        aria-label={`Docente da turma ${t.code}`}
                      >
                        <option value="">Sem docente atribuído</option>
                        {state.docentes.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="outline" size="icon" className="size-7" onClick={() => setCapacity(t.id, t.capacity - 5)} aria-label={`Reduzir capacidade de ${t.code}`}>
                          <Minus className="size-3.5" />
                        </Button>
                        <span className="w-10 text-center text-sm font-semibold tabular-nums text-ink">{t.capacity}</span>
                        <Button variant="outline" size="icon" className="size-7" onClick={() => setCapacity(t.id, t.capacity + 5)} aria-label={`Aumentar capacidade de ${t.code}`}>
                          <Plus className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          disabled={t.enrolled <= 0}
                          onClick={() => enroll(t.id, -1)}
                          aria-label={`Remover inscrição de ${t.code}`}
                        >
                          <Minus className="size-3.5" />
                        </Button>
                        <span className="w-10 text-center text-sm font-semibold tabular-nums text-ink">{t.enrolled}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          disabled={t.enrolled >= t.capacity}
                          onClick={() => enroll(t.id, 1)}
                          aria-label={`Adicionar inscrição a ${t.code}`}
                        >
                          <Plus className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={pct}
                          tone={pct >= 100 ? "danger" : pct >= 80 ? "gold" : "brand"}
                          className="w-24"
                        />
                        <span className={cn("text-xs font-semibold tabular-nums", pct >= 100 ? "text-danger" : pct >= 80 ? "text-gold-600 dark:text-gold-400" : "text-ink-muted")}>
                          {pct}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}