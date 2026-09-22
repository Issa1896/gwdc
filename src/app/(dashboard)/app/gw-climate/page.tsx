"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Calendar,
  CloudRain,
  CloudSun,
  Droplets,
  Gauge,
  Leaf,
  Radio,
  Sun,
  Thermometer,
  Waves,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useClimate } from "@/lib/climate-store";

export default function ClimateDashboardPage() {
  const { state } = useClimate();

  const totalEstacoes = state.estacoes.length;
  const estacoesOnline = state.estacoes.filter((e) => e.status === "online").length;
  const alertasAtivos = state.alertas.filter((a) => a.ativo);

  const mediaTemp = (
    state.estacoes.reduce((acc, e) => acc + e.temperatura, 0) / (totalEstacoes || 1)
  ).toFixed(1);

  const mediaChuva = (
    state.estacoes.reduce((acc, e) => acc + e.precipitacaoMm, 0) / (totalEstacoes || 1)
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Banner Principal GW Climate */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 p-6 text-white shadow-xl sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-200 backdrop-blur-md">
            <Radio className="size-3.5 text-emerald-300 animate-pulse" /> Rede Soberana de Meteorologia
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            GW Climate — Observatório Meteorológico & Marítimo
          </h2>
          <p className="text-sm text-emerald-100/90 sm:text-base">
            Sensores pluviométricos no continente, previsão de monções para a safra do caju, monitoramento de mangais e tábua de marés do Arquipélago dos Bijagós.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/app/gw-climate/alertas">
              <Button className="bg-white text-emerald-950 hover:bg-emerald-50">
                <AlertTriangle className="size-4" /> Alertas de Cheias & Monção
              </Button>
            </Link>
            <Link href="/app/gw-climate/estacoes">
              <Button variant="outline" className="border-emerald-400/40 text-white hover:bg-emerald-900/50">
                <Gauge className="size-4" /> Telemetria das Estações
              </Button>
            </Link>
            <Link href="/app/gw-climate/mangais">
              <Button variant="outline" className="border-emerald-400/40 text-white hover:bg-emerald-900/50">
                <Leaf className="size-4" /> Observatório dos Mangais
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Indicadores Principais */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-muted">Temperatura Média Nacional</p>
            <span className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Thermometer className="size-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">{mediaTemp} °C</span>
            <span className="text-xs font-semibold text-amber-600">Monção Úmida</span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">Sensores em 8 regiões e ilhas</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-muted">Precipitação Média 24h</p>
            <span className="grid size-9 place-items-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
              <CloudRain className="size-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">{mediaChuva} mm</span>
            <span className="text-xs font-semibold text-sky-600">Chuva Ativa</span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">Bafatá e Bijagós com maior índice</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-muted">Estações Conectadas</p>
            <span className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Gauge className="size-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">{estacoesOnline} / {totalEstacoes}</span>
            <Badge tone="success" className="text-[10px]">Online</Badge>
          </div>
          <p className="mt-1 text-xs text-ink-muted">Transmissão IoT a cada 10 min</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-muted">Alertas Meteorológicos</p>
            <span className="grid size-9 place-items-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <AlertTriangle className="size-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">{alertasAtivos.length}</span>
            <Badge tone="danger" className="text-[10px]">SMS Ativo</Badge>
          </div>
          <p className="mt-1 text-xs text-ink-muted">Rio Geba e Canal de Bubaque</p>
        </Card>
      </div>

      {/* Alertas Ativos em Destaque */}
      {alertasAtivos.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-600" /> Alertas Meteorológicos em Vigor
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {alertasAtivos.map((alt) => (
              <Card
                key={alt.id}
                className={`p-4 border-l-4 ${
                  alt.severidade === "critico"
                    ? "border-l-rose-600 bg-rose-50/20 dark:bg-rose-950/10"
                    : "border-l-amber-600 bg-amber-50/20 dark:bg-amber-950/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink font-mono">{alt.codigo}</span>
                  <Badge tone={alt.severidade === "critico" ? "danger" : "warning"}>
                    {alt.severidade.toUpperCase()}
                  </Badge>
                </div>
                <h4 className="mt-1 text-sm font-bold text-ink">{alt.titulo}</h4>
                <p className="text-xs text-ink-muted mt-1">{alt.descricaoPt}</p>
                <div className="mt-2 rounded bg-surface-raised p-2 text-xs border border-border-subtle">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-[10px] block">
                    TRANSMISSÃO EM CRIOULO (SMS / RÁDIO):
                  </span>
                  <p className="italic text-ink mt-0.5">{alt.descricaoCrioulo}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Previsão de 7 Dias & Condições das Marés */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Previsão Agroclimática (2 cols) */}
        <div className="space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
              <Calendar className="size-4 text-emerald-600" /> Previsão Agroclimática — Guiné-Bissau (7 Dias)
            </h3>
            <span className="text-xs text-ink-muted">Apoio à Safra do Caju & Arroz</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {state.previsao.map((p, i) => (
              <Card key={i} className="p-3 text-center space-y-2 border">
                <span className="text-xs font-bold text-ink block">{p.dia}</span>
                <span className="text-[10px] text-ink-muted block">{p.data}</span>

                <div className="grid size-8 place-items-center rounded-full bg-emerald-50 text-emerald-600 mx-auto dark:bg-emerald-950/60 dark:text-emerald-400 my-1">
                  {p.condicao === "Ensolarado" ? (
                    <Sun className="size-4 text-amber-500" />
                  ) : p.condicao === "Chuva Forte" || p.condicao === "Tempestade" ? (
                    <CloudRain className="size-4 text-sky-600" />
                  ) : (
                    <CloudSun className="size-4 text-emerald-600" />
                  )}
                </div>

                <div className="text-xs">
                  <span className="font-bold text-ink">{p.tempMax}°</span>{" "}
                  <span className="text-ink-muted text-[11px]">{p.tempMin}°</span>
                </div>

                <div className="text-[10px] text-sky-600 font-semibold flex items-center justify-center gap-0.5">
                  <Droplets className="size-2.5" /> {p.probChuva}%
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Tábua de Marés nos Bijagós */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
              <Waves className="size-4 text-sky-600" /> Marés nos Bijagós
            </h3>
            <span className="text-xs text-ink-muted">Bubaque / Bolama</span>
          </div>

          <Card className="p-4 space-y-3 bg-gradient-to-br from-sky-500/10 to-teal-500/10 border-sky-500/20">
            <div className="flex items-center justify-between text-xs border-b border-border-subtle pb-2">
              <span className="font-semibold text-ink">Ciclo da Maré Atual:</span>
              <Badge tone="info">Preamar (Maré Cheia)</Badge>
            </div>

            <div className="space-y-1.5 text-xs text-ink-muted">
              <p className="flex justify-between">
                <span>Altura da Maré:</span>
                <strong className="text-ink font-mono">3.8 metros</strong>
              </p>
              <p className="flex justify-between">
                <span>Velocidade do Vento:</span>
                <strong className="text-ink font-mono">26 km/h (Sudoeste)</strong>
              </p>
              <p className="flex justify-between">
                <span>Visibilidade Marítima:</span>
                <strong className="text-emerald-600 font-semibold">Boa (8 milhas)</strong>
              </p>
            </div>

            <p className="text-[11px] text-ink-muted italic border-t border-border-subtle pt-2">
              Navegação permitida para lanchas regulares. Recomenda-se colete salva-vidas obrigatório nas pirogas.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
