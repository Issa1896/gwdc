"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AreaTrend, BarCompare, DonutChart, LineTrend } from "@/components/ui/charts";
import { KpiCard, PageHeader } from "@/components/dashboard/widgets";
import type { MvpCell, MvpChart, MvpData, MvpTable } from "@/data/mvp/types";
import { fcfa, shortDate } from "@/data/mvp/types";

/** Renderiza célula de tabela do MVP conforme o tipo. */
function Cell({ cell }: { cell: MvpCell }) {
  switch (cell.kind) {
    case "badge":
      return <Badge tone={cell.tone}>{cell.value}</Badge>;
    case "currency":
      return <span className="font-medium tabular-nums">{fcfa(cell.value)}</span>;
    case "number":
      return <span className="tabular-nums">{cell.value.toLocaleString("pt-PT")}</span>;
    case "date":
      return <span className="whitespace-nowrap">{shortDate(cell.value)}</span>;
    default:
      return <span>{cell.value}</span>;
  }
}

/** Renderiza um gráfico conforme o tipo. */
export function MvpChartCard({ chart }: { chart: MvpChart }) {
  const format = (value: number) => (chart.kind === "fcfa" ? fcfa(value) : chart.kind === "percent" ? `${value}%` : value.toLocaleString("pt-PT"));
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{chart.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {chart.type === "line" && <LineTrend data={chart.data} series={chart.series ?? []} height={250} formatter={format} />}
        {chart.type === "area" && <AreaTrend data={chart.data} series={chart.series ?? []} height={250} formatter={format} />}
        {chart.type === "bar" && <BarCompare data={chart.data} series={chart.series ?? []} height={250} formatter={format} />}
        {chart.type === "donut" && (
          <div className="flex items-center justify-center">
            <DonutChart data={chart.data as { name: string; value: number }[]} height={250} formatter={format} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Renderiza tabela do MVP. */
export function MvpTableCard({ table }: { table: MvpTable }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{table.title}</CardTitle>
        {table.description && <CardDescription>{table.description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-0 pb-2">
        <Table>
          <TableHead>
            <TableRow>
              {table.columns.map((col) => (
                <TableHeader key={col}>{col}</TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {table.rows.map((row, i) => (
              <TableRow key={i}>
                {row.map((cell, j) => (
                  <TableCell key={j}>
                    <Cell cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/** Motor de MVP genérico: KPIs + alertas + gráficos + seções especiais + tabelas. */
export function MvpView({ data, extras }: { data: MvpData; extras?: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={data.greeting}
        description={`Demonstração interativa com dados fictícios realistas — produto ${data.productSlug}.`}
        actions={
          <Badge tone="gold" className="self-start">
            Ambiente de demonstração
          </Badge>
        }
      />

      {/* Alertas */}
      {data.alerts.length > 0 && (
        <div className="grid gap-3 lg:grid-cols-2">
          {data.alerts.map((alert) => (
            <Alert key={alert.title} tone={alert.tone} title={alert.title}>
              {alert.message}
            </Alert>
          ))}
        </div>
      )}

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.title} title={kpi.title} value={kpi.value} delta={kpi.delta} icon={kpi.icon} tone={kpi.tone} spark={kpi.spark} />
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 lg:grid-cols-2">
        {data.charts.map((chart) => (
          <MvpChartCard key={chart.id} chart={chart} />
        ))}
      </div>

      {/* Seções especiais por produto */}
      {extras}

      {/* Tabelas */}
      <div className="grid gap-4">
        {data.tables.map((table) => (
          <MvpTableCard key={table.id} table={table} />
        ))}
      </div>
    </div>
  );
}
