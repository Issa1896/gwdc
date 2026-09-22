"use client";

import Link from "next/link";
import {
  Calendar,
  FileCheck2,
  FileText,
  Gavel,
  Scale,
  Send,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useJustice } from "@/lib/justice-store";

export default function JusticeDashboardPage() {
  const { state } = useJustice();

  const totalProcessos = state.processos.length;
  const audienciasAgendadas = state.audiencias.filter((a) => a.status === "agendada").length;
  const certidoesEmitidas = state.certidoes.length;
  const urgentes = state.processos.filter((p) => p.prioridade === "urgente").length;

  return (
    <div className="space-y-6">
      {/* Banner Principal PJe */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-900 p-6 text-white shadow-xl sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold tracking-wide text-purple-200 backdrop-blur-md">
            <Scale className="size-3.5 text-purple-300" /> Poder Judiciário Soberano
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Tribunal Digital & PJe da Guiné-Bissau
          </h2>
          <p className="text-sm text-purple-100/90 sm:text-base">
            Distribuição automatizada de processos, autos 100% eletrônicos, audiências por videoconferência e certidões judiciais com fé pública.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/app/gw-justice/peticionar">
              <Button className="bg-white text-purple-950 hover:bg-purple-50">
                <Send className="size-4" /> Protocolar Nova Ação
              </Button>
            </Link>
            <Link href="/app/gw-justice/processos">
              <Button variant="outline" className="border-purple-400/40 text-white hover:bg-purple-900/50">
                <FileText className="size-4" /> Consultar Autos Eletrônicos
              </Button>
            </Link>
            <Link href="/app/gw-justice/certidoes">
              <Button variant="outline" className="border-purple-400/40 text-white hover:bg-purple-900/50">
                <FileCheck2 className="size-4" /> Emitir Certidão Negativa
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Indicadores Principais */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-muted">Processos em Tramitação</p>
            <span className="grid size-9 place-items-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <FileText className="size-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">{totalProcessos}</span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
              <TrendingUp className="mr-0.5 size-3" /> 100% digital
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">Bissau, Bafatá, Gabú e STJ</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-muted">Audiências Virtuais</p>
            <span className="grid size-9 place-items-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Video className="size-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">{audienciasAgendadas}</span>
            <Badge tone="navy" className="text-[10px]">WebRTC Seguro</Badge>
          </div>
          <p className="mt-1 text-xs text-ink-muted">Pautas designadas esta semana</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-muted">Certidões Emitidas</p>
            <span className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <ShieldCheck className="size-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">{certidoesEmitidas}</span>
            <span className="text-xs font-medium text-emerald-600">QR Code Ativo</span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">Validação pública instantânea</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-muted">Pedidos Urgentes</p>
            <span className="grid size-9 place-items-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <ShieldAlert className="size-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">{urgentes}</span>
            <span className="text-xs font-medium text-rose-600">Plantão Judiciário</span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">Liminares e réus presos</p>
        </Card>
      </div>

      {/* Seção Central: Processos Recentes & Pauta de Audiências */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Autos Recentes */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-ink">Últimos Processos Autuados</h3>
            <Link href="/app/gw-justice/processos" className="text-xs font-medium text-purple-600 hover:underline">
              Ver todos ({totalProcessos})
            </Link>
          </div>

          <div className="space-y-3">
            {state.processos.slice(0, 4).map((proc) => (
              <Card key={proc.id} className="p-4 transition hover:border-purple-500/40">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-300">
                        {proc.numero}
                      </span>
                      <Badge
                        tone={
                          proc.prioridade === "urgente"
                            ? "danger"
                            : proc.status === "concluso_para_sentenca"
                            ? "warning"
                            : "navy"
                        }
                        className="text-[10px]"
                      >
                        {proc.classe}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-semibold text-ink">{proc.assunto}</h4>
                    <p className="text-xs text-ink-muted">
                      <strong>Autor:</strong> {proc.autor} &bull; <strong>Réu:</strong> {proc.reu}
                    </p>
                    <p className="text-[11px] text-ink-faint">
                      {proc.tribunal} &bull; {proc.vara} &bull; Juiz: {proc.juiz}
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-1 sm:items-end">
                    <span className="text-xs font-semibold text-ink">
                      {proc.valorCausa.toLocaleString("pt-GW")} FCFA
                    </span>
                    <span className="text-[10px] text-ink-muted">
                      Última mov: {proc.movimentacoes[0]?.data || "Recente"}
                    </span>
                    <Link href={`/app/gw-justice/processos?id=${proc.id}`}>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-purple-600 hover:text-purple-700">
                        Visualizar Autos &rarr;
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Pauta do Dia & Links Rápidos */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-ink">Pauta de Audiências</h3>
              <Link href="/app/gw-justice/audiencias" className="text-xs font-medium text-purple-600 hover:underline">
                Acessar Salas
              </Link>
            </div>

            <div className="space-y-3">
              {state.audiencias.map((aud) => (
                <Card key={aud.id} className="p-4 border-l-4 border-l-purple-600">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300">
                      <Calendar className="size-3.5" /> {aud.data} às {aud.horario}
                    </span>
                    <Badge tone="navy" className="text-[10px]">{aud.tipo}</Badge>
                  </div>
                  <p className="mt-2 text-xs font-medium text-ink font-mono">{aud.processoNumero}</p>
                  <p className="text-xs text-ink-muted mt-0.5">Magistrado: {aud.magistrado}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-2">
                    <span className="text-[10px] text-ink-faint flex items-center gap-1">
                      <Users className="size-3" /> {aud.partes.length} partes notificadas
                    </span>
                    <Link href="/app/gw-justice/audiencias">
                      <Button size="sm" className="h-7 text-[11px] bg-purple-600 hover:bg-purple-700 text-white">
                        <Video className="size-3 mr-1" /> Entrar na Sala
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Cartório STJ */}
          <Card className="p-4 bg-gradient-to-br from-purple-500/5 to-indigo-500/10 border-purple-500/20">
            <div className="flex items-center gap-2">
              <Gavel className="size-5 text-purple-600" />
              <h4 className="text-sm font-bold text-ink">Cartório Unificado STJ</h4>
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              Necessita de certidão para concurso, licitação pública ou abertura de contas bancárias?
            </p>
            <div className="mt-3">
              <Link href="/app/gw-justice/certidoes">
                <Button variant="outline" size="sm" className="w-full text-xs border-purple-400/40 text-purple-800 dark:text-purple-200">
                  Gerar Certidão com Autenticidade Digital
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
