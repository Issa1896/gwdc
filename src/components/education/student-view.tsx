import Link from "next/link";
import { BookOpen, CalendarClock, GraduationCap, Mail, Phone, ShieldAlert, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/progress";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, KpiCard } from "@/components/dashboard/widgets";
import { BarCompare, LineTrend } from "@/components/ui/charts";
import { getStudent, weightedAverage, overallAttendance, STUDENTS } from "@/data/education";
import { getAva } from "@/data/education";
import { shortDate } from "@/data/mvp/types";

/** Badge de status de disciplina. */
function subjectBadge(status: string) {
  const tone = status === "Aprovado" ? "success" : status === "Em risco" ? "danger" : "info";
  return <Badge tone={tone}>{status}</Badge>;
}

/** KPIs calculados a partir do catálogo. */
function studentKpis(id: string) {
  const student = getStudent(id)!;
  const average = weightedAverage(student);
  const attendance = overallAttendance(student);
  const pending = student.subjects
    .flatMap((s) => getAva(s.id)?.activities ?? [])
    .filter((a) => !a.submitted).length;
  return {
    average,
    attendance,
    pending,
    disciplines: student.subjects.length,
  };
}

const subjectChartData = (id: string) => {
  const student = getStudent(id)!;
  return student.subjects.map((s) => ({
    name: s.code,
    av1: s.av1 ?? 0,
    av2: s.av2 ?? 0,
    final: s.final ?? 0,
  }));
};

const gradeTrend = (id: string) => {
  const student = getStudent(id)!;
  return [
    { name: "Mar", media: 13.4 },
    { name: "Abr", media: 14.1 },
    { name: "Mai", media: 14.6 },
    { name: "Jun", media: 15.2 },
    { name: "Jul", media: 15.6 },
    { name: "Ago", media: weightedAverage(student) },
  ];
};

/** Visão do estudante: perfil, boletim, frequência e pendências. */
export function StudentView({
  studentId,
  switcher = false,
}: {
  studentId: string;
  switcher?: boolean;
}) {
  const student = getStudent(studentId) ?? STUDENTS[0];
  const kpis = studentKpis(student.id);

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "GW Education", href: "/app/gw-education", icon: GraduationCap },
          { label: "Portal do Aluno", href: "/app/gw-education/aluno" },
          { label: student.name },
        ]}
      />

      <PageHeader
        title="Portal do Aluno"
        description="Boletim, frequência, disciplinas e atividades — a vida acadêmica em tempo real."
        actions={switcher ? undefined : <Badge tone="gold">Perfil individual</Badge>}
      />

      {/* Perfil */}
      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar name={student.name} className="size-14 text-lg" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-bold text-ink">{student.name}</p>
            <p className="text-sm text-ink-muted">
              {student.course} · {student.institution}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge tone="brand">Semestre {student.semester}</Badge>
              <Badge tone="navy">{student.year}º ano</Badge>
              <Badge tone={student.status === "Ativo" ? "success" : "danger"} dot>
                {student.status}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 text-sm text-ink-muted">
            <span className="flex items-center gap-2">
              <Mail className="size-4 text-ink-faint" /> {student.email}
            </span>
            <span className="flex items-center gap-2">
              <Phone className="size-4 text-ink-faint" /> {student.phone}
            </span>
            {student.guardian && (
              <span className="flex items-center gap-2">
                <UserRound className="size-4 text-ink-faint" /> {student.guardian}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Média ponderada" value={kpis.average.toFixed(1).replace(".", ",")} delta={1.4} icon={GraduationCap} tone="brand" spark={[12, 13, 14, 14, 15, 15, 16, 16]} />
        <KpiCard title="Disciplinas ativas" value={String(kpis.disciplines)} delta={0} icon={BookOpen} tone="navy" spark={[5, 5, 6, 6, 6, 6, 6, kpis.disciplines]} />
        <KpiCard title="Frequência" value={`${Math.round(kpis.attendance)}%`} delta={2.1} icon={ShieldAlert} tone="gold" spark={[86, 87, 88, 89, 90, 91, 91, Math.round(kpis.attendance)]} />
        <KpiCard title="Atividades pendentes" value={String(kpis.pending)} delta={-20} icon={CalendarClock} tone="brand" spark={[6, 5, 5, 4, 4, 3, 3, kpis.pending]} />
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Notas por avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            <BarCompare
              data={subjectChartData(student.id)}
              series={[
                { key: "av1", name: "1ª AV" },
                { key: "av2", name: "2ª AV" },
                { key: "final", name: "Final" },
              ]}
              height={250}
              formatter={(v) => v.toFixed(1)}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Evolução da média geral</CardTitle>
          </CardHeader>
          <CardContent>
            <LineTrend data={gradeTrend(student.id)} series={[{ key: "media", name: "Média" }]} height={250} formatter={(v) => v.toFixed(1)} />
          </CardContent>
        </Card>
      </div>

      {/* Boletim */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-sm">Boletim — Semestre {student.semester}</CardTitle>
          <Badge tone="info">Escala 0–20</Badge>
        </CardHeader>
        <CardContent className="p-0 pb-2">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Disciplina</TableHeader>
                <TableHeader>Código</TableHeader>
                <TableHeader>1ª AV</TableHeader>
                <TableHeader>2ª AV</TableHeader>
                <TableHeader>Final</TableHeader>
                <TableHeader>Frequência</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>AVA</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {student.subjects.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium text-ink">{s.name}</TableCell>
                  <TableCell className="font-mono text-xs text-ink-faint">{s.code}</TableCell>
                  <TableCell className="tabular-nums">{s.av1 ?? "—"}</TableCell>
                  <TableCell className="tabular-nums">{s.av2 ?? "—"}</TableCell>
                  <TableCell className="tabular-nums">{s.final ?? "—"}</TableCell>
                  <TableCell className="min-w-32">
                    <div className="flex items-center gap-2">
                      <Progress value={s.attendance} tone={s.attendance >= 85 ? "success" : s.attendance >= 75 ? "gold" : "danger"} className="w-20" ariaLabel={`Frequência ${s.attendance}%`} />
                      <span className="tabular-nums text-xs text-ink-muted">{s.attendance}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{subjectBadge(s.status)}</TableCell>
                  <TableCell>
                    <Link href={`/app/gw-education/ava/${s.id}`} className="text-brand-600 hover:underline">
                      Acessar
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Próximas atividades */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Próximas atividades e avaliações</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 lg:grid-cols-2">
          {student.subjects
            .flatMap((s) => (getAva(s.id)?.activities ?? []).map((a) => ({ ...a, discipline: s.name, code: s.code })))
            .filter((a) => !a.submitted)
            .sort((a, b) => a.due.localeCompare(b.due))
            .map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-xl border border-border p-4">
                <div>
                  <p className="text-sm font-semibold text-ink">{a.title}</p>
                  <p className="mt-0.5 text-xs text-ink-faint">
                    {a.discipline} · Peso {a.weight}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={a.kind === "Mini-teste" ? "danger" : a.kind === "Projeto" ? "gold" : "info"}>{a.kind}</Badge>
                  <span className="text-xs whitespace-nowrap text-ink-muted">{shortDate(a.due)}</span>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}