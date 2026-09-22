"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Kanban,
  XCircle,
} from "lucide-react";
import { useSchoolBusiness, type EtapaPipeline } from "@/lib/school-business-store";

const COLUNAS: { etapa: EtapaPipeline; label: string; cor: string }[] = [
  { etapa: "lead", label: "Novos Leads", cor: "border-slate-500/40" },
  { etapa: "qualificacao", label: "Qualificação", cor: "border-blue-500/40" },
  { etapa: "proposta", label: "Proposta Enviada", cor: "border-indigo-500/40" },
  { etapa: "negociacao", label: "Negociação", cor: "border-amber-500/40" },
  { etapa: "ganho", label: "Fechado Ganho", cor: "border-emerald-500/40" },
];

export default function PipelinePage() {
  const { state, avancarEtapaOportunidade } = useSchoolBusiness();
  const [notificacao, setNotificacao] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotificacao(msg);
    setTimeout(() => setNotificacao(null), 3000);
  };

  const proximaEtapa: Record<EtapaPipeline, EtapaPipeline | null> = {
    lead: "qualificacao",
    qualificacao: "proposta",
    proposta: "negociacao",
    negociacao: "ganho",
    ganho: null,
    perdido: null,
  };

  const handleMudarEtapa = (id: string, novaEtapa: EtapaPipeline, titulo: string) => {
    avancarEtapaOportunidade(id, novaEtapa);
    showNotification(`Oportunidade "${titulo}" movida para "${novaEtapa.toUpperCase()}".`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {notificacao && (
        <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border border-purple-500/30 bg-purple-950/90 px-4 py-3 text-sm text-purple-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="size-5 shrink-0 text-purple-400" />
          <span>{notificacao}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400">
          <Link href="/app/gw-business" className="hover:underline flex items-center gap-1">
            <ArrowLeft className="size-3.5" /> Dashboard Comercial
          </Link>
        </div>
        <h1 className="mt-1 text-2xl font-extrabold text-ink flex items-center gap-2">
          <Kanban className="size-6 text-purple-600" />
          Funil de Vendas Visual (Pipeline Kanban)
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          Acompanhe o ciclo de fechamento de negócios corporativos e avance etapas com um clique.
        </p>
      </div>

      {/* Kanban Board Horizontal Scroll */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
        {COLUNAS.map((col) => {
          const opsNaColuna = state.oportunidades.filter((o) => o.etapa === col.etapa);
          const totalColunaFCFA = opsNaColuna.reduce((acc, o) => acc + o.valorFCFA, 0);

          return (
            <div
              key={col.etapa}
              className={`rounded-2xl border ${col.cor} bg-surface p-4 shadow-sm space-y-3 flex flex-col`}
            >
              {/* Column Header */}
              <div className="border-b border-border-subtle pb-2.5 space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-ink uppercase tracking-wider">{col.label}</h2>
                  <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[11px] font-bold text-ink-faint">
                    {opsNaColuna.length}
                  </span>
                </div>
                <p className="font-mono text-[11px] font-bold text-purple-600 dark:text-purple-400">
                  {(totalColunaFCFA / 1000000).toFixed(1)}M FCFA
                </p>
              </div>

              {/* Cards in Column */}
              <div className="space-y-2.5 min-h-[350px]">
                {opsNaColuna.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border-subtle p-6 text-center text-[11px] text-ink-faint">
                    Nenhuma oportunidade nesta etapa.
                  </div>
                ) : (
                  opsNaColuna.map((op) => {
                    const prox = proximaEtapa[op.etapa];

                    return (
                      <div
                        key={op.id}
                        className="rounded-xl border border-border-subtle bg-surface-ground p-3.5 shadow-sm space-y-2.5 hover:border-purple-500/40 transition"
                      >
                        <div>
                          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">
                            {op.empresaCliente}
                          </span>
                          <h3 className="text-xs font-bold text-ink leading-snug">{op.titulo}</h3>
                        </div>

                        <div className="flex items-center justify-between pt-1 text-xs">
                          <span className="font-mono font-bold text-ink">
                            {(op.valorFCFA / 1000000).toFixed(1)}M FCFA
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold">
                            {op.probabilidade}% prob.
                          </span>
                        </div>

                        <div className="text-[10px] text-ink-faint border-t border-border-subtle/80 pt-1.5 flex items-center justify-between">
                          <span>{op.responsavel}</span>
                          <span>{op.previsaoFechamento}</span>
                        </div>

                        {/* Stage Progression Buttons */}
                        <div className="flex items-center justify-end gap-1.5 pt-1">
                          {prox && (
                            <button
                              onClick={() => handleMudarEtapa(op.id, prox, op.titulo)}
                              className="inline-flex items-center gap-1 rounded-lg bg-purple-600/10 px-2 py-1 text-[10px] font-bold text-purple-700 dark:text-purple-300 hover:bg-purple-600/20 transition"
                              title={`Avançar para ${prox}`}
                            >
                              <span>Avançar</span>
                              <ArrowRight className="size-3" />
                            </button>
                          )}
                          {op.etapa !== "ganho" && op.etapa !== "perdido" && (
                            <button
                              onClick={() => handleMudarEtapa(op.id, "perdido", op.titulo)}
                              className="p-1 rounded-lg hover:bg-rose-500/10 text-ink-faint hover:text-rose-500 transition"
                              title="Marcar como Perdido"
                            >
                              <XCircle className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
