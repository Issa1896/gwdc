"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Play,
  RotateCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/lib/analytics-store";

export default function PrevisoesPage() {
  const { state, executarModelo } = useAnalytics();
  const [executandoId, setExecutandoId] = useState<string | null>(null);
  const [sucessoMsg, setSucessoMsg] = useState("");

  const handleExecutar = (id: string, nome: string) => {
    setExecutandoId(id);
    setTimeout(() => {
      executarModelo(id);
      setExecutandoId(null);
      setSucessoMsg(`Modelo "${nome}" recalculado com os dados mais recentes do Data Lake!`);
      setTimeout(() => setSucessoMsg(""), 5000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/app/gw-analytics">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="size-4" /> Voltar ao Painel
            </Button>
          </Link>
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              Modelos Preditivos por Inteligência Artificial
            </h2>
            <p className="text-sm text-ink-muted">
              Algoritmos de aprendizado de máquina treinados nos dados soberanos do Estado guineense.
            </p>
          </div>
        </div>

        <Badge tone="success" className="text-xs">
          <Cpu className="size-3 mr-1" /> IA Ativa em Produção
        </Badge>
      </div>

      {sucessoMsg && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3.5 text-sm text-emerald-900 dark:text-emerald-200 border border-emerald-500/20">
          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
          <span>{sucessoMsg}</span>
        </div>
      )}

      {/* Grid de Modelos Preditivos */}
      <div className="grid gap-5">
        {state.modelos.map((mod) => (
          <Card key={mod.id} className="p-6 space-y-4 border hover:border-indigo-500/40 transition">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    {mod.id.toUpperCase()}
                  </span>
                  <Badge
                    tone={
                      mod.impacto === "critico"
                        ? "danger"
                        : mod.impacto === "alto"
                        ? "warning"
                        : "info"
                    }
                  >
                    Impacto: {mod.impacto.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-semibold text-emerald-600">
                    {mod.acuraciaPercentual.toFixed(1)}% de Precisão
                  </span>
                </div>
                <h3 className="text-lg font-bold text-ink">{mod.nome}</h3>
                <p className="text-xs text-ink-muted">{mod.descricao}</p>
              </div>

              <Button
                size="sm"
                disabled={executandoId === mod.id}
                onClick={() => handleExecutar(mod.id, mod.nome)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5 shrink-0"
              >
                {executandoId === mod.id ? (
                  <>
                    <RotateCw className="size-3.5 animate-spin" /> Processando...
                  </>
                ) : (
                  <>
                    <Play className="size-3.5" /> Re-executar Modelo
                  </>
                )}
              </Button>
            </div>

            {/* Resultado da Projeção */}
            <div className="rounded-xl bg-indigo-500/10 p-4 border border-indigo-500/20 space-y-1 text-xs">
              <span className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-indigo-600" /> Projeção Analítica & Recomendação do Algoritmo:
              </span>
              <p className="text-ink text-sm font-medium leading-relaxed mt-1">
                {mod.previsaoTexto}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-ink-muted pt-1 border-t border-border-subtle">
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-emerald-600" /> Modelo auditado pelo Conselho Econômico
              </span>
              <span className="font-mono text-[10px]">Framework: Scikit-Learn & Transformers</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
