"use client";

import { BadgeCheck, School, TrendingUp, UserRound, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { PageHeader, KpiCard } from "@/components/dashboard/widgets";
import { BackLink } from "@/components/education/widgets";
import { MvpChartCard } from "@/components/dashboard/mvp-view";
import type { MvpChart } from "@/data/mvp/types";
import { NATIONAL_INDICATORS, ENROLLMENT_TREND, EDUCATION_BUDGET, PREDICTED_DROPOUT, REGIONS } from "@/data/education";
import { useEducation } from "@/lib/education-store";

const charts: MvpChart[] = [
  {
    id: "nacional-matriculas",
    title: "Matrículas ativas — ano letivo 2025/2026 (nacional)",
    type: "area",
    kind: "number",
    series: [
      { key: "matriculas", name: "Matrículas" },
      { key: "ativas", name: "Ativas" },
    ],
    data: ENROLLMENT_TREND,
  },
  {
    id: "orcamento",
    title: "Orçamento da Educação por rubrica (bilhões FCFA)",
    type: "bar",
    kind: "number",
    series: [{ key: "valor", name: "Bilhões FCFA" }],
    data: EDUCATION_BUDGET,
  },
  {
    id: "evasao-ia",
    title: "Evasão predita por IA — estudantes em risco por região",
    type: "bar",
    kind: "number",
    series: [{ key: "risco", name: "Em risco" }],
    data: PREDICTED_DROPOUT,
  },
];

/** Portal do Gestor — painel nacional do Ministério da Educação. */
export default function GestorPortalPage() {
  const n = NATIONAL_INDICATORS;
  const { state } = useEducation();
  const operacional = [
    { label: "Alunos no registo", value: String(state.alunos.length) },
    { label: "Faturas pendentes", value: String(state.faturas.filter((f) => f.status !== "pago").length) },
    { label: "Turmas ativas", value: String(state.turmas.length) },
    { label: "Diplomas emitidos", value: String(state.diplomas.length) },
  ];
  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Portal do Gestor"
        description="Painel nacional em tempo real para o Ministério da Educação, direções regionais e reitorias."
        actions={
          <Badge tone="brand" className="self-start">
            Dados consolidados · S2/2026
          </Badge>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Registo operacional — esta instituição</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-4">
          {operacional.map((item) => (
            <div key={item.label} className="rounded-xl border border-border p-4 text-center">
              <p className="font-display text-2xl font-bold text-brand-600 dark:text-brand-300">{item.value}</p>
              <p className="mt-1 text-xs text-ink-muted">{item.label}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Alert tone="info" title="Modelo preditivo ativo">
        A IA identificou <strong>aproximadamente 2.140 estudantes</strong> em risco de evasão no próximo trimestre —
        plano de tutoria sugerido para as regiões de Gabú e Biombo.
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Estudantes" value={n.students.toLocaleString("pt-PT")} delta={5.2} icon={Users} tone="brand" spark={[420, 431, 440, 451, 458, 464, 472, 480]} />
        <KpiCard title="Escolas conectadas" value={String(n.schools)} delta={6.8} icon={School} tone="navy" spark={[220, 235, 250, 265, 280, 292, 302, 312]} />
        <KpiCard title="Docentes" value={n.teachers.toLocaleString("pt-PT")} delta={2.4} icon={UserRound} tone="gold" spark={[10800, 11100, 11500, 11800, 12000, 12150, 12300, 12480]} />
        <KpiCard title="Aprovação anual" value={`${String(n.approvalRate).replace(".", ",")}%`} delta={1.9} icon={TrendingUp} tone="brand" spark={[72, 73, 74, 75, 76, 77, 78, 78]} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {charts.slice(0, 2).map((chart) => (
          <MvpChartCard key={chart.id} chart={chart} />
        ))}
      </div>

      <MvpChartCard chart={charts[2]} />

      {/* Indicadores por região */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-sm">Indicadores por região</CardTitle>
          <Badge tone="info">9 regiões + setor autônomo</Badge>
        </CardHeader>
        <CardContent className="p-0 pb-2">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Região</TableHeader>
                <TableHeader>Escolas</TableHeader>
                <TableHeader>Estudantes</TableHeader>
                <TableHeader>Docentes</TableHeader>
                <TableHeader>Aprovação</TableHeader>
                <TableHeader>Frequência</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {REGIONS.map((r) => (
                <TableRow key={r.region}>
                  <TableCell className="font-medium text-ink">{r.region}</TableCell>
                  <TableCell className="tabular-nums">{r.schools}</TableCell>
                  <TableCell className="tabular-nums">{r.students.toLocaleString("pt-PT")}</TableCell>
                  <TableCell className="tabular-nums">{r.teachers.toLocaleString("pt-PT")}</TableCell>
                  <TableCell className="min-w-32">
                    <div className="flex items-center gap-2">
                      <Progress value={r.approval} tone={r.approval >= 78 ? "success" : r.approval >= 74 ? "gold" : "danger"} className="w-20" ariaLabel={`Aprovação ${r.approval}%`} />
                      <span className="tabular-nums text-xs text-ink-muted">{r.approval}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums">{r.attendance}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Certificação digital */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <BadgeCheck className="size-4 text-brand-500" /> Certificação digital de diplomas
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Diplomas emitidos", value: n.digitalDiplomas.toLocaleString("pt-PT") },
            { label: "Verificações públicas", value: n.verifiedDiplomas.toLocaleString("pt-PT") },
            { label: "Instituições emissoras", value: "18" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border p-4 text-center">
              <p className="font-display text-2xl font-bold text-brand-600 dark:text-brand-300">{item.value}</p>
              <p className="mt-1 text-xs text-ink-muted">{item.label}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}