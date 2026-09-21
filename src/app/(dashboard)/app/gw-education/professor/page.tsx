"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarCheck, Check, FolderOpen, GraduationCap, Save, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, Progress } from "@/components/ui/progress";
import { PageHeader, KpiCard } from "@/components/dashboard/widgets";
import { BackLink } from "@/components/education/widgets";
import { getProfessor, getStudent, getDiscipline, DISCIPLINES } from "@/data/education";
import { cn } from "@/lib/utils";

const DEMO_PROFESSOR_ID = "p2";

/** Portal do Professor — chamada e lançamento de notas interativos. */
export default function ProfessorPortalPage() {
  const professor = getProfessor(DEMO_PROFESSOR_ID)!;
  const [disciplineId, setDisciplineId] = useState("d2");
  const discipline = getDiscipline(disciplineId)!;

  const [attendance, setAttendance] = useState<Record<string, number>>({ "2024-0012": 95, "2024-0013": 74 });
  const [grades, setGrades] = useState<Record<string, string>>({ "2024-0012": "", "2024-0013": "" });
  const [saved, setSaved] = useState<string | null>(null);

  const students = ["2024-0012", "2024-0013"].map(getStudent).filter(Boolean);
  const otherStudents = ["2023-0087", "2022-0044", "2024-0019", "2025-0031", "2024-0026", "2023-0098"].map(getStudent).filter(Boolean);
  const presentCount = students.filter((s) => s && (attendance[s.id] ?? 0) > 0).length;
  const attendanceRate = Math.round((presentCount / students.length) * 100);

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Portal do Professor"
        description={`Docente ${professor.title} · ${professor.department} · ${professor.focus}.`}
        actions={
          <Badge tone="brand" className="self-start">
            INF-220 · Semestre 2/2026
          </Badge>
        }
      />

      {/* Cartão do docente */}
      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar name={professor.name.replace("Prof.ª Doutora ", "").replace("Prof. Doutor ", "")} className="size-14 text-lg" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-bold text-ink">{professor.name}</p>
            <p className="text-sm text-ink-muted">{professor.department} · {professor.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {professor.subjects.map((code) => (
                <Badge key={code} tone="navy">{code}</Badge>
              ))}
              <Badge tone="success">{professor.totalStudents.toLocaleString("pt-PT")} estudantes ao longo da carreira</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Turmas atribuídas" value="14" delta={1.1} icon={FolderOpen} tone="brand" spark={[10, 11, 12, 12, 13, 13, 14, 14]} />
        <KpiCard title="Alunos na disciplina" value={String(discipline.enrolled)} delta={0} icon={Users} tone="navy" spark={[112, 114, 115, 117, 118, 118, 118, discipline.enrolled]} />
        <KpiCard title="Chamadas registadas" value="18/21" delta={4.8} icon={CalendarCheck} tone="gold" spark={[12, 13, 14, 15, 16, 17, 18, 18]} />
        <KpiCard title="Notas a lançar" value="2" delta={-50} icon={GraduationCap} tone="brand" spark={[8, 6, 5, 4, 4, 3, 2, 2]} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Chamada de frequência */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm">Chamada de hoje — {discipline.name}</CardTitle>
            <Badge tone={attendanceRate >= 75 ? "success" : "warning"}>Frequência {attendanceRate}%</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Select aria-label="Disciplina" value={disciplineId} onChange={(e) => setDisciplineId(e.target.value)} className="w-full max-w-xs">
                {DISCIPLINES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} — {d.name}
                  </option>
                ))}
              </Select>
              <p className="text-xs text-ink-faint">Aula 21 · 19/08/2026 · 09h00–10h30</p>
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Estudante</TableHeader>
                  <TableHeader>Curso</TableHeader>
                  <TableHeader>Média atual</TableHeader>
                  <TableHeader>Presença hoje</TableHeader>
                  <TableHeader>Frequência total</TableHeader>
                  <TableHeader>Perfil</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => {
                  if (!student) return null;
                  const avg = ((student.subjects.find((s) => s.id === disciplineId)?.av1 ?? 0) + (student.subjects.find((s) => s.id === disciplineId)?.av2 ?? 0)) / 2;
                  const present = (attendance[student.id] ?? 0) > 0;
                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <span className="flex items-center gap-2.5">
                          <Avatar name={student.name} className="size-8 text-[10px]" />
                          <span className="font-medium text-ink">{student.name}</span>
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-ink-muted">{student.course}</TableCell>
                      <TableCell className="tabular-nums">{avg.toFixed(1).replace(".", ",")}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant={present ? "primary" : "outline"}
                          onClick={() => setAttendance((prev) => ({ ...prev, [student.id]: present ? 0 : 100 }))}
                        >
                          {present ? <Check className="size-3.5" /> : "Marcar"}
                          {present ? "Presente" : "Ausente"}
                        </Button>
                      </TableCell>
                      <TableCell className="min-w-32">
                        <div className="flex items-center gap-2">
                          <Progress value={student.subjects.find((s) => s.id === disciplineId)?.attendance ?? 0} tone="brand" className="w-20" ariaLabel="Frequência total" />
                          <span className="tabular-nums text-xs text-ink-muted">{student.subjects.find((s) => s.id === disciplineId)?.attendance ?? 0}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link href={`/app/gw-education/aluno/${student.id}`} className="text-brand-600 hover:underline">
                          Ver perfil
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSaved("chamada");
                  window.setTimeout(() => setSaved(null), 2500);
                }}
              >
                <Save className="size-3.5" /> Registar chamada
              </Button>
            </div>
            {saved === "chamada" && <Alert tone="success" title="Chamada registada com sucesso">Sincronizada com o sistema nacional e o boletim dos estudantes.</Alert>}
          </CardContent>
        </Card>

        {/* Lançamento de notas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Lançar notas — 2ª AV</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-ink-muted">
              Correção assistida por IA sugerida para as avaliações abaixo (simulação). Edite e guarde.
            </p>
            {students.map((student) => {
              if (!student) return null;
              return (
                <div key={student.id} className="rounded-xl border border-border p-3">
                  <p className="text-sm font-medium text-ink">{student.name}</p>
                  <p className="text-xs text-ink-faint">{student.course}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      aria-label={`Nota de ${student.name}`}
                      type="number"
                      min={0}
                      max={20}
                      placeholder="Nota 0–20"
                      value={grades[student.id]}
                      onChange={(e) => setGrades((prev) => ({ ...prev, [student.id]: e.target.value }))}
                      className={cn("h-9 w-24", grades[student.id] && Number(grades[student.id]) < 10 && "border-danger focus:border-danger focus:ring-danger/25")}
                    />
                    <Badge tone="info">Sugestão IA: {["14", "10"][students.indexOf(student)]}</Badge>
                  </div>
                </div>
              );
            })}
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => {
                setSaved("notas");
                window.setTimeout(() => setSaved(null), 2500);
              }}
            >
              <Save className="size-3.5" /> Guardar notas
            </Button>
            {saved === "notas" && <Alert tone="success" title="Notas guardadas">Publicadas no boletim dos estudantes com verificação de consistência.</Alert>}
          </CardContent>
        </Card>
      </div>

      {/* Demais estudantes do catálogo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Estudantes sob tutoria — acesso rápido aos perfis</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {otherStudents.map((student) => {
            if (!student) return null;
            return (
              <Link
                key={student.id}
                href={`/app/gw-education/aluno/${student.id}`}
                className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:border-brand-400 hover:bg-surface-alt"
              >
                <Avatar name={student.name} className="size-9 text-[10px]" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{student.name}</p>
                  <p className="truncate text-xs text-ink-faint">
                    {student.course} · {student.year}º ano
                  </p>
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}