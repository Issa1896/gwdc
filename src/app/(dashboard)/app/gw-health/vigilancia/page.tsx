"use client";

import { useMemo } from "react";
import { Activity, AlertTriangle, MapPin, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";
import { KpiCard, PageHeader } from "@/components/dashboard/widgets";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BackLink, SurtoStatusBadge, TendenciaBadge } from "@/components/health/widgets";
import { useHealth } from "@/lib/health-store";
import { fmtDate } from "@/data/health/types";
import { cn } from "@/lib/utils";
import type { SurtoStatus } from "@/data/health/types";

export default function VigilanciaPage() {
  const { state, setSurtoStatus } = useHealth();

  const ativos = state.surtos.filter((s) => s.situacao === "ativo");
  const casosAtivos = ativos.reduce((s, x) => s + x.casos, 0);
  const suspeitos = state.surtos.reduce((s, x) => s + x.suspeitos, 0);
  const emSubida = state.surtos.filter((s) => s.tendencia === "subida").length;

  const rows = useMemo(
    () => [...state.surtos].sort((a, b) => (a.situacao === "ativo" ? -1 : b.situacao === "ativo" ? 1 : 0) || b.casos - a.casos),
    [state.surtos],
  );

  return (
    <div className="space-y-6">
      <BackLink href="/app/gw-health" label="Voltar à visão geral" />
      <PageHeader
        title="Vigilância & Surtos"
        description="Central epidemiológica — monitorização de doenças de notificação obrigatória em tempo real."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Surtos ativos" value={String(ativos.length)} delta={1} icon={Activity} spark={[2, 3, 3, ativos.length]} tone="brand" />
        <KpiCard title="Casos confirmados" value={casosAtivos.toLocaleString("pt-PT")} delta={12.4} icon={AlertTriangle} spark={[140, 210, casosAtivos]} tone="gold" />
        <KpiCard title="Casos suspeitos" value={String(suspeitos)} delta={4.6} icon={AlertTriangle} spark={[96, 210, suspeitos]} tone="navy" />
        <KpiCard title="Doenças em subida" value={String(emSubida)} delta={emSubida} icon={TrendingUp} spark={[1, 2, emSubida]} />
      </div>

      {ativos.length > 0 && (
        <Card className="flex items-start gap-3 border-red-200 bg-red-50/60 p-4 dark:border-red-950 dark:bg-red-950/40">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-700 dark:text-red-300" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-red-900 dark:text-red-100">Resposta rápida em curso</p>
            <p className="mt-1 text-sm text-red-800/80 dark:text-red-200/70">
              Equipas de investigação de campo destacadas para {ativos.map((s) => s.regiao).join(" e ")}. Posto de reidratação e
              sensibilização comunitária ativos para os surtos de cólera e malária.
            </p>
          </div>
        </Card>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doença</TableHead>
              <TableHead>Região</TableHead>
              <TableHead className="text-right">Casos</TableHead>
              <TableHead className="text-right">Suspeitos</TableHead>
              <TableHead>Tendência</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Última atualização</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium text-ink">{s.doenca}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 text-sm text-ink-muted">
                    <MapPin className="size-3.5 text-ink-faint" aria-hidden="true" /> {s.regiao}
                  </span>
                </TableCell>
                <TableCell className="text-right text-sm font-semibold tabular-nums text-ink">{s.casos.toLocaleString("pt-PT")}</TableCell>
                <TableCell className="text-right text-sm tabular-nums text-ink-muted">{s.suspeitos}</TableCell>
                <TableCell><TendenciaBadge tendencia={s.tendencia} /></TableCell>
                <TableCell><SurtoStatusBadge situacao={s.situacao} /></TableCell>
                <TableCell className="text-sm text-ink-muted">{fmtDate(s.ultimoUpdate)}</TableCell>
                <TableCell>
                  <select
                    value={s.situacao}
                    onChange={(e) => setSurtoStatus(s.id, e.target.value as SurtoStatus)}
                    className="rounded-lg border border-border bg-canvas px-2 py-1.5 text-xs text-ink outline-none focus:border-brand-400"
                    aria-label={`Situação do surto de ${s.doenca}`}
                  >
                    <option value="monitorado">Monitorado</option>
                    <option value="ativo">Ativo</option>
                    <option value="controlado">Controlado</option>
                  </select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-start justify-between">
            <div>
              <CardTitle>Cólera — Bafatá</CardTitle>
              <CardDescription>Curva epidémica dos últimos 30 dias</CardDescription>
            </div>
            <SurtoStatusBadge situacao="ativo" />
          </CardHeader>
          <CardContent>
            {[
              { label: "S1", v: 12 }, { label: "S2", v: 18 }, { label: "S3", v: 26 }, { label: "S4", v: 34 },
              { label: "S5", v: 29 }, { label: "S6", v: 41 }, { label: "S7", v: 38 }, { label: "S8", v: 52 },
            ].map((b, _i, arr) => {
              const max = Math.max(...arr.map((x) => x.v));
              return (
                <div key={b.label} className="mb-3 flex items-center gap-2 text-xs">
                  <span className="w-6 shrink-0 text-ink-faint">{b.label}</span>
                  <div className="h-20 flex-1 rounded-lg bg-surface-strong" style={{ position: "relative" }}>
                    <div
                      className="absolute bottom-0 w-full rounded-lg bg-red-500/80 transition-all"
                      style={{ height: `${(b.v / max) * 100}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right font-semibold tabular-nums text-ink">{b.v}</span>
                </div>
              );
            })}
            <div className="mt-2 flex items-center gap-2 rounded-xl bg-surface-strong p-3 text-xs text-ink-muted">
              {emSubida > 0 ? <TrendingUp className="size-4 text-red-600" /> : <TrendingDown className="size-4 text-emerald-600" />}
              Fase epidémica — reforço de vigilância comunitária e campanha de água segura.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medidas ativas</CardTitle>
            <CardDescription>Intervenções da central epidemiológica</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {[
              { title: "Posto de reidratação — Bafatá", detail: "Cólera · 320 doses de SRO distribuídas", active: true },
              { title: "Distribuição de redes mosquiteiras — Gabú", detail: "Malária · campanha de prevenção", active: true },
              { title: "Vigilância nas fronteiras — Bolama", detail: "Febre de Lassa · controlo de viagens", active: true },
              { title: "Campanha porta-a-porta — Cacheu", detail: "Sarampo · verificação de cobertura SRP", active: false },
            ].map((m) => (
              <div key={m.title} className={cn("flex items-center gap-3 rounded-xl border p-3", m.active ? "border-border" : "border-border bg-surface-strong/50")}>
                <ShieldCheck className={cn("size-5 shrink-0", m.active ? "text-emerald-600" : "text-ink-faint")} aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-ink">{m.title}</p>
                  <p className="text-xs text-ink-muted">{m.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}