"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bus,
  Clock,
  Compass,
  Route,
  Ship,
  Sparkles,
  Ticket,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTransport } from "@/lib/transport-store";

export default function TransportDashboardPage() {
  const { state } = useTransport();

  const totalBilhetes = state.bilhetes.length;
  const validados = state.bilhetes.filter((b) => b.status === "validado").length;
  const frotasAtivas = state.frota.filter((f) => f.status === "em_transito").length;

  return (
    <div className="space-y-6">
      {/* Banner de Mobilidade */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-950 p-6 text-white shadow-xl sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 px-3 py-1 text-xs font-semibold tracking-wide text-sky-200 backdrop-blur-md">
            <Compass className="size-3.5 text-sky-300" /> Rede Integrada de Mobilidade
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Terminal Geral de Transportes da Guiné-Bissau
          </h2>
          <p className="text-sm text-sky-100/90 sm:text-base">
            Bilhetagem eletrônica soberana, conexão terrestre interurbana e travessias marítimas regulares para o Arquipélago dos Bijagós.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/app/gw-transport/bilhetes">
              <Button className="bg-white text-sky-900 hover:bg-sky-50">
                <Ticket className="size-4" /> Comprar Bilhete com QR Code
              </Button>
            </Link>
            <Link href="/app/gw-transport/frota">
              <Button variant="outline" className="border-sky-400/40 text-white hover:bg-sky-800/50">
                <Route className="size-4" /> Monitorar Frotas & Navios
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Indicadores Principais */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-muted">Bilhetes Emitidos</p>
            <span className="grid size-9 place-items-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
              <Ticket className="size-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">{totalBilhetes}</span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
              <TrendingUp className="mr-0.5 size-3" /> +14% hoje
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">{validados} validados no embarque</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-muted">Receita do Dia</p>
            <span className="grid size-9 place-items-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Sparkles className="size-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">18.4M FCFA</span>
            <Badge tone="success" className="text-[10px]">Mobile Money</Badge>
          </div>
          <p className="mt-1 text-xs text-ink-muted">Orange Money & MTN integrados</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-muted">Frotas em Operação</p>
            <span className="grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Route className="size-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">{state.frota.length}</span>
            <span className="text-xs font-medium text-ink-muted">{frotasAtivas} em trânsito</span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">Rodovias nacionais & linhas marítimas</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-muted">Pontualidade Média</p>
            <span className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Clock className="size-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">88.5%</span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
              <TrendingUp className="mr-0.5 size-3" /> Monitorado
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">Controle de horários por GPS</p>
        </Card>
      </div>

      {/* Grid com Rotas e Partidas Imediatas */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Próximas Partidas e Rotas */}
        <div className="space-y-4 lg:col-span-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-ink">Rotas e Próximas Saídas</h3>
              <p className="text-xs text-ink-muted">Horários oficiais e tarifas fixadas pelo Ministério dos Transportes</p>
            </div>
            <Link href="/app/gw-transport/bilhetes">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Ver todos os bilhetes <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {state.rotas.map((rota) => {
              const isMaritimo = rota.modalidade === "maritimo";
              return (
                <Card key={rota.id} className="p-4 transition hover:border-sky-500/40">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`grid size-10 place-items-center rounded-xl ${
                          isMaritimo
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300"
                            : "bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300"
                        }`}
                      >
                        {isMaritimo ? <Ship className="size-5" /> : <Bus className="size-5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-sm font-bold text-ink">
                            {rota.origem} → {rota.destino}
                          </h4>
                          <Badge tone={isMaritimo ? "info" : "neutral"} className="text-[10px]">
                            {isMaritimo ? "Travessia Marítima" : "Rodoviário"}
                          </Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-ink-muted">
                          Operador: <span className="font-medium text-ink">{rota.operadora}</span> · {rota.duracaoEstimada} ({rota.distanciaKm} km)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-display text-sm font-bold text-ink">
                          {rota.precoFCFA.toLocaleString()} FCFA
                        </span>
                        <p className="text-[10px] text-ink-muted">Por assento</p>
                      </div>

                      <Link href={`/app/gw-transport/bilhetes?rota=${rota.id}`}>
                        <Button size="sm" className="bg-sky-600 hover:bg-sky-700 text-xs">
                          Comprar
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/60 pt-2.5 text-[11px] text-ink-muted">
                    <Clock className="size-3 text-ink-faint" />
                    <span className="font-semibold text-ink">Horários diários:</span>
                    {rota.horarios.map((h) => (
                      <span key={h} className="rounded bg-surface-strong px-2 py-0.5 font-mono text-[10px] font-medium text-ink">
                        {h}
                      </span>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Coluna Direita: Frotas e Bilhetes Rápidos */}
        <div className="space-y-4 lg:col-span-4">
          <div>
            <h3 className="font-display text-base font-bold text-ink">Em Trânsito Agora</h3>
            <p className="text-xs text-ink-muted">Rastreamento em tempo real</p>
          </div>

          <Card className="divide-y divide-border p-0">
            {state.frota.map((v) => (
              <div key={v.id} className="p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-ink">{v.identificador}</span>
                  <Badge tone={v.status === "em_transito" ? "success" : "warning"} className="text-[9px]">
                    {v.status === "em_transito" ? "Em Viagem" : "No Píer / Estação"}
                  </Badge>
                </div>
                <p className="text-xs font-medium text-ink">{v.nome}</p>
                <div className="flex items-center justify-between text-[11px] text-ink-muted">
                  <span>Próx.: <strong className="text-ink">{v.proximaParada}</strong></span>
                  <span className="font-mono text-sky-700 dark:text-sky-400">ETA: {v.eta}</span>
                </div>
                <div className="text-[10px] text-ink-faint">
                  Ocupação: {v.assentosOcupados}/{v.capacidadeTotal} assentos
                </div>
              </div>
            ))}
          </Card>

          {/* Destaque Bijagós */}
          <div className="rounded-xl border border-sky-500/30 bg-gradient-to-br from-sky-50 to-blue-50/60 p-4 dark:from-sky-950/40 dark:to-blue-950/30">
            <div className="flex items-center gap-2">
              <Ship className="size-4 text-sky-600 dark:text-sky-400" />
              <h4 className="text-xs font-bold text-sky-900 dark:text-sky-200">
                Conectividade com as Ilhas dos Bijagós
              </h4>
            </div>
            <p className="mt-1 text-xs text-sky-800/80 dark:text-sky-300/80 leading-relaxed">
              Travessias marítimas para Bolama e Bubaque agora com bilhete digital emitido por smartphone, garantindo vaga e controle seguro da capitania dos portos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
