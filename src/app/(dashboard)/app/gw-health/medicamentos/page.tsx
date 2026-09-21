"use client";

import { useMemo } from "react";
import { AlertTriangle, Minus, PackagePlus, Plus, ShieldCheck } from "lucide-react";
import { KpiCard, PageHeader } from "@/components/dashboard/widgets";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BackLink } from "@/components/health/widgets";
import { useHealth } from "@/lib/health-store";
import { fmtFcfa } from "@/data/health/types";
import { cn } from "@/lib/utils";

export default function MedicamentosPage() {
  const { state, ajustarStock } = useHealth();

  const stockTotal = useMemo(() => state.medicamentos.reduce((s, m) => s + m.stock, 0), [state.medicamentos]);
  const stockCritico = state.medicamentos.filter((m) => m.stock <= m.stockMinimo).length;
  const valorStock = useMemo(() => state.medicamentos.reduce((s, m) => s + m.stock * m.custo, 0), [state.medicamentos]);
  const roturas = state.medicamentos.filter((m) => m.stock === 0).length;

  const rows = useMemo(() => [...state.medicamentos].sort((a, b) => a.name.localeCompare(b.name)), [state.medicamentos]);

  return (
    <div className="space-y-6">
      <BackLink href="/app/gw-health" label="Voltar à visão geral" />
      <PageHeader
        title="Farmácia & Logística"
        description="Gestão de medicamentos e consumíveis críticos — reposição e alerta de roturas."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Unidades em stock" value={stockTotal.toLocaleString("pt-PT")} delta={3.7} icon={PackagePlus} spark={[11.2, 12.4, 13.6, stockTotal / 1000]} tone="brand" />
        <KpiCard title="Valor do armazém" value={fmtFcfa(valorStock)} delta={2.1} icon={ShieldCheck} spark={[3.8, 4.2, 4.5, valorStock / 1_000_000]} tone="gold" />
        <KpiCard title="Itens abaixo do mínimo" value={String(stockCritico)} delta={1} icon={AlertTriangle} spark={[2, 3, stockCritico]} tone="navy" />
        <KpiCard title="Roturas confirmadas" value={String(roturas)} delta={roturas > 0 ? 2 : -1} icon={AlertTriangle} spark={[1, 1, roturas]} />
      </div>

      {stockCritico > 0 && (
        <Card className="flex items-start gap-3 border-red-200 bg-red-50/60 p-4 dark:border-red-950 dark:bg-red-950/40">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-700 dark:text-red-300" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-red-900 dark:text-red-100">Alerta de stock crítico</p>
            <p className="mt-1 text-sm text-red-800/80 dark:text-red-200/70">
              {state.medicamentos.filter((m) => m.stock <= m.stockMinimo).map((m) => `${m.name} (${m.stock}/${m.stockMinimo} un.)`).join(" · ")}.
              Pedido de reposição enviado ao fornecedor nacional.
            </p>
          </div>
        </Card>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicamento</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Stock atual</TableHead>
              <TableHead className="text-right">Mínimo</TableHead>
              <TableHead className="text-right">Custo unitário</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Reposição</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((m) => {
              const pct = m.stockMinimo > 0 ? Math.round((m.stock / m.stockMinimo) * 100) : 100;
              return (
                <TableRow key={m.id}>
                  <TableCell className="font-medium text-ink">{m.name}</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-surface-strong px-2.5 py-0.5 text-xs font-medium text-ink-muted">{m.categoria}</span>
                  </TableCell>
                  <TableCell className={cn("text-right text-sm font-semibold tabular-nums", m.stock <= m.stockMinimo ? "text-danger" : "text-ink")}>
                    {m.stock}
                  </TableCell>
                  <TableCell className="text-right text-sm tabular-nums text-ink-muted">{m.stockMinimo}</TableCell>
                  <TableCell className="text-right text-sm tabular-nums text-ink-muted">{fmtFcfa(m.custo)}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        m.stock === 0
                          ? "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
                          : m.stock <= m.stockMinimo
                            ? "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
                            : "border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
                      )}
                    >
                      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                      {m.stock === 0 ? "Rotura" : m.stock <= m.stockMinimo ? `Crítico (${pct}% do mínimo)` : "Adequado"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="outline" size="icon" className="size-7" onClick={() => ajustarStock(m.id, -100)} disabled={m.stock <= 0} aria-label={`Retirar 100 unidades de ${m.name}`}>
                        <Minus className="size-3.5" />
                      </Button>
                      <Button variant="outline" size="icon" className="size-7" onClick={() => ajustarStock(m.id, 100)} aria-label={`Repor 100 unidades de ${m.name}`}>
                        <Plus className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <Card>
        <CardContent className="grid gap-1 text-sm text-ink-muted sm:grid-cols-2">
          <p className="font-medium text-ink">Política de reposição</p>
          <p>· Reposição automática quando o stock desce abaixo do mínimo regulamentar.</p>
          <p>· Validade e lotes verificados por farmacêutico antes da entrada no armazém.</p>
          <p>· Distribuição diária às unidades periféricas por rota logística.</p>
        </CardContent>
      </Card>
    </div>
  );
}