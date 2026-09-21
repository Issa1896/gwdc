"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Landmark,
  Library,
  PenLine,
  School,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs } from "@/components/ui/tabs";
import { PageHeader, KpiCard } from "@/components/dashboard/widgets";
import { BackLink } from "@/components/education/widgets";
import { MvpChartCard } from "@/components/dashboard/mvp-view";
import type { MvpChart } from "@/data/mvp/types";
import {
  ENROLLMENT_TREND,
  PREDICTED_DROPOUT,
  CALENDAR,
} from "@/data/education";

const roleTabs = [
  { label: "Portal do Aluno", value: "aluno", icon: <GraduationCap className="size-4" /> },
  { label: "Portal do Professor", value: "professor", icon: <UserRound className="size-4" /> },
  { label: "Portal do Gestor", value: "gestor", icon: <Landmark className="size-4" /> },
];

const roleContent = {
  aluno: {
    kpis: [
      { title: "Média ponderada", value: "15,8", delta: 2.1 },
      { title: "Disciplinas ativas", value: "6", delta: 0 },
      { title: "Frequência", value: "92%", delta: 3.4 },
      { title: "Atividades pendentes", value: "3", delta: -25.0 },
    ],
    description:
      "Boletim em tempo real, frequência, disciplinas e atividades do semestre — acessível ao estudante e à família, em qualquer dispositivo.",
    href: "/app/gw-education/aluno",
  },
  professor: {
    kpis: [
      { title: "Turmas atribuídas", value: "14", delta: 1.1 },
      { title: "Alunos sob responsabilidade", value: "1.260", delta: 4.2 },
      { title: "Aulas lecionadas (S2)", value: "342", delta: 8.9 },
      { title: "Lançamentos pendentes", value: "2", delta: -33.3 },
    ],
    description:
      "Chamada digital por telefone, lançamento de notas com correção assistida e relatório de turma em um clique.",
    href: "/app/gw-education/professor",
  },
  gestor: {
    kpis: [
      { title: "Escolas conectadas", value: "312", delta: 6.8 },
      { title: "Estudantes no sistema", value: "48 mil", delta: 5.2 },
      { title: "Taxa de aprovação", value: "78,4%", delta: 1.9 },
      { title: "Evasão média", value: "4,2%", delta: -12.5 },
    ],
    description:
      "Indicadores nacionais em tempo real, evasão predita por IA e relatórios para o Ministério da Educação.",
    href: "/app/gw-education/gestor",
  },
};

const modules = [
  { href: "/app/gw-education/aluno", label: "Portal do Aluno", icon: GraduationCap, tone: "bg-brand-500" },
  { href: "/app/gw-education/alunos", label: "Alunos (cadastro)", icon: Users, tone: "bg-emerald-600" },
  { href: "/app/gw-education/professor", label: "Portal do Professor", icon: UserRound, tone: "bg-sky-500" },
  { href: "/app/gw-education/docentes", label: "Docentes", icon: School, tone: "bg-indigo-600" },
  { href: "/app/gw-education/gestor", label: "Portal do Gestor", icon: Landmark, tone: "bg-navy-700" },
  { href: "/app/gw-education/cursos", label: "Cursos", icon: BookOpen, tone: "bg-violet-600" },
  { href: "/app/gw-education/turmas", label: "Turmas", icon: ClipboardList, tone: "bg-fuchsia-600" },
  { href: "/app/gw-education/matriculas", label: "Matrículas", icon: ClipboardList, tone: "bg-gold-500" },
  { href: "/app/gw-education/notas", label: "Notas & Boletim", icon: PenLine, tone: "bg-rose-500" },
  { href: "/app/gw-education/frequencia", label: "Frequência", icon: CalendarDays, tone: "bg-teal-600" },
  { href: "/app/gw-education/avaliacoes", label: "Avaliações online", icon: PenLine, tone: "bg-pink-600" },
  { href: "/app/gw-education/calendario", label: "Calendário", icon: CalendarDays, tone: "bg-indigo-600" },
  { href: "/app/gw-education/financeiro", label: "Financeiro", icon: Wallet, tone: "bg-emerald-700" },
  { href: "/app/gw-education/ava", label: "AVA — LMS", icon: BookOpen, tone: "bg-cyan-600" },
  { href: "/app/gw-education/biblioteca", label: "Biblioteca", icon: Library, tone: "bg-violet-600" },
  { href: "/app/gw-education/diplomas", label: "Diplomas", icon: BadgeCheck, tone: "bg-teal-600" },
  { href: "/app/gw-education/relatorios", label: "Relatórios", icon: Landmark, tone: "bg-slate-600" },
  { href: "/app/gw-education/configuracoes", label: "Configurações", icon: ClipboardList, tone: "bg-slate-500" },
];

const charts: MvpChart[] = [
  {
    id: "matriculas-trend",
    title: "Matrículas ativas no ano letivo 2025/2026",
    type: "area",
    kind: "number",
    series: [
      { key: "matriculas", name: "Matrículas" },
      { key: "ativas", name: "Ativas" },
    ],
    data: ENROLLMENT_TREND,
  },
  {
    id: "evasao-regioes",
    title: "Evasão predita por IA — estudantes em risco (próximo trimestre)",
    type: "bar",
    kind: "number",
    series: [{ key: "risco", name: "Em risco" }],
    data: PREDICTED_DROPOUT,
  },
];

/** Visão geral — ponto de entrada do ecossistema GW Education. */
export default function EducationOverviewPage() {
  return (
    <div className="space-y-6">
      <BackLink href="/mvps" label="Outros módulos GWDC" />
      <PageHeader
        title="GW Education — Portal Nacional"
        description="Sistema de gestão acadêmica da Guiné-Bissau: da matrícula ao diploma, para estudantes, professores, escolas e o Ministério da Educação."
        actions={
          <Badge tone="success" className="self-start">
            Semestre 2/2026
          </Badge>
        }
      />

      <Alert tone="success" title="Matrícula 2026/2027 aberta">
        A 1ª fase de matrículas para calouros termina em 05/09/2026. Fila de análise em tempo real no módulo de{" "}
        <Link href="/app/gw-education/matriculas" className="font-semibold underline">
          Matrículas
        </Link>
        .
      </Alert>

      {/* Indicadores nacionais */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Estudantes atendidos" value="48 mil" delta={5.2} icon={Users} tone="brand" spark={[38, 40, 42, 43, 44, 45, 47, 48]} />
        <KpiCard title="Escolas conectadas" value="312" delta={6.8} icon={School} tone="navy" spark={[220, 235, 250, 265, 280, 292, 302, 312]} />
        <KpiCard title="Docentes ativos" value="12.480" delta={2.4} icon={UserRound} tone="gold" spark={[10800, 11100, 11500, 11800, 12000, 12150, 12300, 12480]} />
        <KpiCard title="Diplomas verificáveis" value="15.211" delta={11.2} icon={BadgeCheck} tone="brand" spark={[8400, 9600, 10800, 12000, 13200, 14100, 14700, 15211]} />
      </div>

      {/* Portais por papel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Portais por papel</CardTitle>
          <p className="text-xs text-ink-muted">Um sistema, três experiências — escolha seu papel na comunidade acadêmica.</p>
        </CardHeader>
        <CardContent>
          <Tabs items={roleTabs}>
            {(active) => {
              const role = roleContent[active as keyof typeof roleContent];
              return (
                <div className="pt-5">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {role.kpis.map((k) => (
                      <KpiCard key={k.title} title={k.title} value={k.value} delta={k.delta} icon={GraduationCap} />
                    ))}
                  </div>
                  <div className="mt-5 flex flex-col gap-3 rounded-xl border border-border bg-surface-alt p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-2xl text-sm text-ink-muted">{role.description}</p>
                    <Link href={role.href}>
                      <Button>
                        Abrir portal <ArrowRight className="size-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            }}
          </Tabs>
        </CardContent>
      </Card>

      {/* Gráficos nacionais */}
      <div className="grid gap-4 lg:grid-cols-2">
        {charts.map((chart) => (
          <MvpChartCard key={chart.id} chart={chart} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Módulos do ecossistema */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm">Módulos do ecossistema</CardTitle>
            <Badge tone="info">18 módulos</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {modules.map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  className="group flex items-center gap-3 rounded-xl border border-border p-4 transition-all hover:border-brand-400 hover:shadow-sm"
                >
                  <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${m.tone} text-white`}>
                    <m.icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{m.label}</p>
                    <p className="truncate text-xs text-ink-faint group-hover:text-brand-600">Abrir módulo →</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calendário em destaque */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <CalendarDays className="size-4 text-brand-500" /> Calendário acadêmico
            </CardTitle>
            <Link href="/app/gw-education/calendario" className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-300">
              Ver completo
            </Link>
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
      </div>
    </div>
  );
}