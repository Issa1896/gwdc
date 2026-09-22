"use client";

import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Bus,
  CloudSun,
  Globe,
  HeartPulse,
  Landmark,
  Scale,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/lib/analytics-store";

export default function AnalyticsDashboardPage() {
  const { state } = useAnalytics();

  const getSetorIcon = (setor: string) => {
    switch (setor) {
      case "Finanças":
        return Landmark;
      case "Saúde":
        return HeartPulse;
      case "Educação":
        return BookOpen;
      case "Transportes":
        return Bus;
      case "Justiça":
        return Scale;
      default:
        return CloudSun;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner Principal GW Analytics */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 p-6 text-white shadow-xl sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-200 backdrop-blur-md">
            <BarChart3 className="size-3.5 text-indigo-300" /> Inteligência Executiva do Estado
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            GW Analytics — Painel Integrado da República
          </h2>
          <p className="text-sm text-indigo-100/90 sm:text-base">
            Visão 360° do Estado guineense: consolidação de arrecadação fiscal, indicadores de saúde, educação, mobilidade e projeções econômicas em tempo real.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/app/gw-analytics/previsoes">
              <Button className="bg-white text-indigo-950 hover:bg-indigo-50">
                <Sparkles className="size-4" /> Modelos Preditivos (IA)
              </Button>
            </Link>
            <Link href="/app/gw-open-data">
              <Button variant="outline" className="border-indigo-400/40 text-white hover:bg-indigo-900/50">
                <Globe className="size-4" /> Portal de Dados Abertos
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid de Indicadores Setoriais (6 Cards) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {state.metricas.map((m) => {
          const IconComponent = getSetorIcon(m.setor);
          return (
            <Card key={m.id} className="p-5 space-y-3 hover:border-indigo-500/40 transition border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-ink-muted flex items-center gap-1.5">
                  <IconComponent className="size-3.5 text-indigo-600" /> {m.setor}
                </span>
                <span
                  className={`inline-flex items-center text-xs font-semibold ${
                    m.tendencia === "alta" ? "text-emerald-600" : "text-indigo-600"
                  }`}
                >
                  {m.tendencia === "alta" ? (
                    <TrendingUp className="size-3 mr-0.5" />
                  ) : (
                    <TrendingDown className="size-3 mr-0.5" />
                  )}
                  {m.variacaoPercentual > 0 ? `+${m.variacaoPercentual}%` : `${m.variacaoPercentual}%`}
                </span>
              </div>

              <div>
                <span className="font-display text-2xl font-extrabold text-ink font-mono">
                  {m.valor}
                </span>
                <h4 className="text-xs font-bold text-ink mt-0.5">{m.titulo}</h4>
                <p className="text-[11px] text-ink-muted mt-1 leading-snug">{m.descricao}</p>
              </div>

              <div className="pt-2 border-t border-border-subtle text-[10px] text-ink-faint flex items-center justify-between">
                <span>Fonte: {m.fonte}</span>
                <span className="font-mono">Auditado</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Seção Central: Execução Orçamentária & Evolução Mensal */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Gráfico / Tabela de Evolução Macroeconômica (8 cols) */}
        <div className="space-y-3 lg:col-span-8">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
              <Landmark className="size-4 text-indigo-600" /> Execução Orçamentária & Arrecadação (Milhões FCFA)
            </h3>
            <span className="text-xs text-ink-muted">Últimos 6 meses</span>
          </div>

          <Card className="p-6 space-y-4">
            <div className="space-y-3">
              {state.historico.map((h) => {
                const maxVal = 10000;
                const recWidth = Math.min(100, (h.receitaFiscalMilhoes / maxVal) * 100);
                const despWidth = Math.min(100, (h.despesaPublicaMilhoes / maxVal) * 100);

                return (
                  <div key={h.mes} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold text-ink">
                      <span>Mês: {h.mes}</span>
                      <div className="flex gap-4 font-mono text-[11px]">
                        <span className="text-emerald-700 dark:text-emerald-400">
                          Rec: {h.receitaFiscalMilhoes}M
                        </span>
                        <span className="text-rose-700 dark:text-rose-400">
                          Desp: {h.despesaPublicaMilhoes}M
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {/* Barra de Receitas */}
                      <div className="w-full bg-surface-raised rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all"
                          style={{ width: `${recWidth}%` }}
                        />
                      </div>
                      {/* Barra de Despesas */}
                      <div className="w-full bg-surface-raised rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-rose-500 h-2 rounded-full transition-all"
                          style={{ width: `${despWidth}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-border-subtle text-ink-muted">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-emerald-600 inline-block" /> Receita Fiscal
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-rose-500 inline-block" /> Despesas Liquidadas
                </span>
              </div>

              <span className="font-semibold text-emerald-600">Superávit Primário Acumulado</span>
            </div>
          </Card>
        </div>

        {/* Modelos de IA e Atalho Open Data (4 cols) */}
        <div className="space-y-4 lg:col-span-4">
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
              <Sparkles className="size-4 text-indigo-600" /> Modelos Preditivos em Destaque
            </h3>

            <Card className="p-4 space-y-3 border-l-4 border-l-indigo-600">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink">Safra do Caju 2026/2027</span>
                <Badge tone="success" className="text-[10px]">91.4% Acurácia</Badge>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                Estimativa de 215.000 toneladas de castanha de caju com base em sensores de solo e índice NDVI dos mangais.
              </p>
              <Link href="/app/gw-analytics/previsoes" className="text-xs text-indigo-600 font-semibold hover:underline block pt-1">
                Ver todos os 3 modelos &rarr;
              </Link>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-indigo-500/10 to-teal-500/10 border-indigo-500/30 space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="size-4 text-teal-600" />
                <h4 className="text-sm font-bold text-ink">Portal da Transparência</h4>
              </div>
              <p className="text-xs text-ink-muted">
                Acesse o catálogo público de dados abertos para download em CSV/JSON no padrão DCAT.
              </p>
              <Link href="/app/gw-open-data/datasets">
                <Button variant="outline" size="sm" className="w-full text-xs mt-1 border-teal-500/40 text-teal-800 dark:text-teal-200">
                  Explorar Datasets Públicos &rarr;
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
