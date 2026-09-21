"use client";

import { useMemo } from "react";
import { Activity, HeartPulse, Pill, Stethoscope, Syringe, Users, Video } from "lucide-react";
import { KpiCard, PageHeader } from "@/components/dashboard/widgets";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AreaTrend, DonutChart } from "@/components/ui/charts";
import { ButtonLink, ConsultaStatusBadge, ConsultaTipoBadge, SurtoStatusBadge } from "@/components/health/widgets";
import { useHealth } from "@/lib/health-store";
import { fmtDate } from "@/data/health/types";

const CONSULTAS_TREND = [
  { name: "Fev", consultas: 1240, teleconsulta: 180 },
  { name: "Mar", consultas: 1390, teleconsulta: 260 },
  { name: "Abr", consultas: 1510, teleconsulta: 340 },
  { name: "Mai", consultas: 1480, teleconsulta: 420 },
  { name: "Jun", consultas: 1670, teleconsulta: 510 },
  { name: "Jul", consultas: 1820, teleconsulta: 640 },
];

export default function HealthOverviewPage() {
  const { state } = useHealth();

  const vacinasTotal = state.vacinas.length;
  const teleconsultas = state.consultas.filter((c) => c.tipo === "teleconsulta").length;
  const surtosAtivos = state.surtos.filter((s) => s.situacao === "ativo").length;
  const stockCritico = state.medicamentos.filter((m) => m.stock <= m.stockMinimo).length;

  const atendimentosPorUnidade = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of state.consultas) {
      const med = state.medicos.find((m) => m.id === c.medicoId);
      const unidade = med?.unidade ?? "Sem unidade";
      map.set(unidade, (map.get(unidade) ?? 0) + 1);
    }
    return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [state.consultas, state.medicos]);

  const criticos = state.medicamentos.filter((m) => m.stock <= m.stockMinimo).sort((a, b) => a.stock / a.stockMinimo - b.stock / b.stockMinimo).slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visão geral"
        description="Painel da Direção Clínica — prontuário nacional, telemedicina, farmácia e vigilância epidemiológica."
        actions={
          <ButtonLink href="/app/gw-health/consultas" variant="outline" size="sm">
            Agendar consulta
          </ButtonLink>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Prontuários digitais" value={String(state.pacientes.length * 9600 + 9600)} delta={9.3} icon={Users} spark={[41, 52, 66, 78]} />
        <KpiCard title="Vacinas registadas" value={String(vacinasTotal)} delta={4.1} icon={Syringe} spark={[12, 16, 19, vacinasTotal]} tone="gold" />
        <KpiCard title="Teleconsultas" value={String(teleconsultas)} delta={27.8} icon={Video} spark={[2, 5, teleconsultas]} tone="navy" />
        <KpiCard title="Surtos ativos" value={String(surtosAtivos)} delta={stockCritico} icon={Activity} spark={[3, 4, 3, surtosAtivos]} tone="brand" />
      </div>

      {surtosAtivos > 0 && (
        <Card className="flex items-start gap-3 border-red-200 bg-red-50/60 p-4 dark:border-red-950 dark:bg-red-950/40">
          <Activity className="mt-0.5 size-5 shrink-0 text-red-700 dark:text-red-300" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-red-900 dark:text-red-100">Alerta de saúde pública — {surtosAtivos} surto(s) ativo(s)</p>
            <p className="mt-1 text-sm text-red-800/80 dark:text-red-200/70">
              {state.surtos.filter((s) => s.situacao === "ativo").map((s) => `${s.doenca} (${s.regiao}, ${s.casos} casos)`).join(" · ")}. Equipas
              de resposta rápida notificadas.
            </p>
          </div>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Consultas por mês</CardTitle>
            <CardDescription>Atendimentos presenciais e por telemedicina</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaTrend
              data={CONSULTAS_TREND}
              series={[
                { key: "consultas", name: "Consultas" },
                { key: "teleconsulta", name: "Telemedicina" },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atendimentos por unidade</CardTitle>
            <CardDescription>Distribuição recente</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={atendimentosPorUnidade} />
            {atendimentosPorUnidade.slice(0, 4).map((u) => (
              <div key={u.name} className="mt-1 flex items-center justify-between gap-2 text-sm">
                <span className="truncate text-ink-muted">{u.name}</span>
                <span className="shrink-0 font-semibold text-ink">{u.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-start justify-between">
            <div>
              <CardTitle>Stock crítico de medicamentos</CardTitle>
              <CardDescription>{stockCritico} itens abaixo do mínimo regulamentar</CardDescription>
            </div>
            <ButtonLink href="/app/gw-health/medicamentos" variant="ghost" size="sm">Gerir stock</ButtonLink>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticos.length === 0 && <p className="text-sm text-ink-muted">Sem itens críticos. Excelente gestão de farmácia.</p>}
            {criticos.map((m) => {
              const pct = Math.min(100, Math.round((m.stock / m.stockMinimo) * 100));
              return (
                <div key={m.id} className="flex items-center gap-3">
                  <Pill className="size-4 shrink-0 text-ink-faint" aria-hidden="true" />
                  <div className="w-52 min-w-0 shrink-0">
                    <p className="truncate text-sm font-medium text-ink">{m.name}</p>
                    <p className="text-[11px] text-ink-muted">{m.categoria}</p>
                  </div>
                  <Progress value={pct} tone={pct <= 60 ? "danger" : "gold"} className="flex-1" />
                  <span className="w-14 shrink-0 text-right text-xs font-semibold tabular-nums text-ink">{m.stock} un.</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-start justify-between">
              <div>
                <CardTitle>Últimas consultas</CardTitle>
                <CardDescription>Atendimentos recentes no sistema</CardDescription>
              </div>
              <ButtonLink href="/app/gw-health/consultas" variant="ghost" size="sm">Ver todas</ButtonLink>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {state.consultas.slice(0, 4).map((c) => {
                const paciente = state.pacientes.find((p) => p.id === c.patientId);
                const medico = state.medicos.find((m) => m.id === c.medicoId);
                return (
                  <div key={c.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      <Stethoscope className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{paciente?.name ?? c.patientId}</p>
                      <p className="truncate text-xs text-ink-muted">{medico?.name} · {fmtDate(c.data)}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <ConsultaTipoBadge tipo={c.tipo} />
                      <ConsultaStatusBadge status={c.status} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vigilância epidemiológica</CardTitle>
              <CardDescription>Doenças sob monitorização nacional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {state.surtos.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{s.doenca}</p>
                    <p className="text-xs text-ink-muted">{s.regiao} · {s.casos} casos</p>
                  </div>
                  <SurtoStatusBadge situacao={s.situacao} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="flex-row items-start justify-between">
          <div>
            <CardTitle>Prontuário Eletrónico Único</CardTitle>
            <CardDescription>Indicadores de adoção do PEP em todo o país</CardDescription>
          </div>
          <HeartPulse className="size-5 text-ink-faint" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Unidades ligadas ao PEP", value: 92, detail: "126 unidades de saúde" },
              { label: "Cobertura de vacinação", value: 86, detail: "Programa Nacional de Vacinação" },
              { label: "Receitas digitais", value: 74, detail: "Padrão HL7 FHIR" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-surface-strong p-4">
                <p className="text-sm font-medium text-ink">{item.label}</p>
                <p className="mt-1 font-display text-2xl font-bold text-ink">{item.value}%</p>
                <p className="mt-1 text-xs text-ink-faint">{item.detail}</p>
                <Progress value={item.value} tone="brand" className="mt-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}