"use client";

import { BarChart3, FileText, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackLink, StatCard } from "@/components/education/widgets";
import { PageHeader } from "@/components/dashboard/widgets";
import { MvpChartCard } from "@/components/dashboard/mvp-view";
import type { MvpChart } from "@/data/mvp/types";
import { REGIONS, ENROLLMENT_TREND, EDUCATION_BUDGET, PREDICTED_DROPOUT } from "@/data/education";

const charts: MvpChart[] = [
  {
    id: "rel-matriculas",
    title: "Matrículas ativas — ano letivo 2025/2026",
    type: "area",
    kind: "number",
    series: [
      { key: "matriculas", name: "Matrículas" },
      { key: "ativas", name: "Ativas" },
    ],
    data: ENROLLMENT_TREND,
  },
  {
    id: "rel-aprovacao",
    title: "Evasão predita por IA — estudantes em risco por região",
    type: "bar",
    kind: "number",
    series: [{ key: "risco", name: "Em risco" }],
    data: PREDICTED_DROPOUT,
  },
  {
    id: "rel-orcamento",
    title: "Orçamento da Educação por rubrica (bilhões FCFA)",
    type: "bar",
    kind: "number",
    series: [{ key: "valor", name: "Bilhões FCFA" }],
    data: EDUCATION_BUDGET,
  },
  {
    id: "rel-aprovacao-regioes",
    title: "Taxa de aprovação por região",
    type: "line",
    kind: "percent",
    series: [{ key: "aprovacao", name: "Aprovação %" }],
    data: REGIONS.map((r) => ({ name: r.region, aprovacao: r.approval })),
  },
];

/** MÓDULO 6 — Relatórios gerenciais consolidados. */
export default function RelatoriosPage() {
  const mediaAprovacao = REGIONS.reduce((acc, r) => acc + r.approval, 0) / REGIONS.length;

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Relatórios"
        description="Indicadores consolidados do Ministério da Educação, exportáveis para PDF/Excel e alimentados por todos os módulos."
        actions={<Badge tone="brand" className="self-start">Exportar PDF</Badge>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Aprovação média nacional" value={`${mediaAprovacao.toFixed(1).replace(".", ",")}%`} detail="9 regiões" icon={TrendingUp} tone="brand" />
        <StatCard title="Regiões monitoradas" value="9" detail="Inclui setor autônomo de Bissau" icon={Users} tone="navy" />
        <StatCard title="Frequência média" value={`${REGIONS.reduce((acc, r) => acc + r.attendance, 0) / REGIONS.length}%`.slice(0, 4)} detail="Consolidada" icon={BarChart3} tone="gold" />
        <StatCard title="Relatórios no mês" value="23" detail="Gerados automaticamente" icon={FileText} tone="brand" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {charts.map((chart) => (
          <MvpChartCard key={chart.id} chart={chart} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Relatórios agendados</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {[
            { nome: "Boletim de indicadores nacional", frequencia: "Diário · 06h00", destino: "MEC · Direções regionais" },
            { nome: "Acompanhamento de matrículas", frequencia: "Semanal · Segunda-feira", destino: "Reitorias" },
            { nome: "Alerta de evasão (IA)", frequencia: "Semanal · Sexta-feira", destino: "Diretores de faculdade" },
            { nome: "Balanço financeiro de propinas", frequencia: "Mensal · 1º dia útil", destino: "Tesouraria geral" },
          ].map((r) => (
            <div key={r.nome} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-ink">{r.nome}</p>
                <p className="text-xs text-ink-faint">{r.frequencia}</p>
              </div>
              <Badge tone="neutral">{r.destino}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}