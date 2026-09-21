"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock,
  FileBadge,
  FileText,
  PlusCircle,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGovernment } from "@/lib/government-store";
import { formatDate } from "@/lib/utils";

export default function GwGovernmentDashboard() {
  const { state } = useGovernment();

  const totalProcessos = state.processos.length;
  const concluidos = state.processos.filter((p) => p.status === "concluido").length;
  const emAndamento = state.processos.filter((p) => p.status === "em_analise" || p.status === "despachado").length;
  const totalCidadaos = state.cidadaos.length;
  const totalCertidoes = state.certidoes.length;

  return (
    <div className="space-y-6">
      {/* Banner de Boas-Vindas Governamental */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 p-6 text-white shadow-xl sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-200 backdrop-blur-md">
            <ShieldCheck className="size-3.5 text-emerald-300" /> Portal Soberano GOV.GW
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Painel Central do Governo Digital da Guiné-Bissau
          </h2>
          <p className="text-sm text-emerald-100/90 sm:text-base">
            Interoperabilidade entre ministérios, protocolo eletrónico sem papel e identidade digital nacional unificada para todos os guineenses.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/app/gw-government/protocolo">
              <Button className="bg-white text-emerald-900 hover:bg-emerald-50">
                <PlusCircle className="size-4" /> Novo Processo Eletrónico
              </Button>
            </Link>
            <Link href="/app/gw-government/certidoes">
              <Button variant="outline" className="border-emerald-400/40 text-white hover:bg-emerald-700/50">
                <FileBadge className="size-4" /> Emitir Certidão
              </Button>
            </Link>
            <Link href="/app/gw-government/identidade">
              <Button variant="ghost" className="text-emerald-200 hover:bg-emerald-800/40 hover:text-white">
                <UserCheck className="size-4" /> Base de Cidadãos
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Indicadores Principais (KPIs) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-muted">Processos no Protocolo</p>
            <span className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <FileText className="size-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">{totalProcessos}</span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
              <TrendingUp className="mr-0.5 size-3" /> 100% digital
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            {emAndamento} em tramitação · {concluidos} concluídos
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-muted">Cidadãos no GW ID</p>
            <span className="grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Users className="size-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">{totalCidadaos.toLocaleString()}</span>
            <Badge tone="success" className="text-[10px]">Biometria ativa</Badge>
          </div>
          <p className="mt-1 text-xs text-ink-muted">Número Único de Identificação</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-muted">Certidões Autenticadas</p>
            <span className="grid size-9 place-items-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <FileBadge className="size-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">{totalCertidoes}</span>
            <span className="text-xs font-semibold text-emerald-600">Com QR Code</span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">Nascimento, Casamento e Registo</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-muted">Tempo Médio de Despacho</p>
            <span className="grid size-9 place-items-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <Clock className="size-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">48 horas</span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
              <TrendingDown className="mr-0.5 size-3" /> -78% vs papel
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">Interligação via barramento do Estado</p>
        </Card>
      </div>

      {/* Grid com Ministérios Integrados e Processos Recentes */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna 1 & 2: Processos Recentes do Protocolo */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-ink">Tramitação Recente no Protocolo Geral</h3>
              <p className="text-xs text-ink-muted">Processos sob análise nos gabinetes ministeriais</p>
            </div>
            <Link href="/app/gw-government/protocolo">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Ver todos <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {state.processos.slice(0, 4).map((proc) => {
              const statusTone =
                proc.status === "concluido"
                  ? "success"
                  : proc.status === "despachado"
                    ? "brand"
                    : proc.status === "em_analise"
                      ? "warning"
                      : "neutral";

              return (
                <Card key={proc.id} className="p-4 transition hover:border-emerald-600/30">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          {proc.numeroProtocolo}
                        </span>
                        <Badge tone="neutral" className="text-[10px] font-semibold">
                          {proc.ministerioDestino}
                        </Badge>
                        <Badge tone={statusTone} className="text-[10px] uppercase">
                          {proc.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <h4 className="mt-1 text-sm font-semibold text-ink">{proc.assunto}</h4>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        Requerente: <span className="font-medium text-ink">{proc.requerenteNome}</span> ({proc.requerenteBI})
                      </p>
                    </div>
                    <span className="text-[11px] text-ink-faint">
                      {formatDate(proc.dataAbertura)}
                    </span>
                  </div>

                  {proc.despachos.length > 0 && (
                    <div className="mt-3 rounded-lg border border-border/80 bg-surface-muted p-2.5 text-xs">
                      <p className="font-semibold text-ink">
                        Último Despacho: <span className="text-ink-muted font-normal">{proc.despachos[proc.despachos.length - 1].texto}</span>
                      </p>
                      <p className="mt-1 text-[10px] text-ink-faint">
                        Por {proc.despachos[proc.despachos.length - 1].autor} ({proc.despachos[proc.despachos.length - 1].orgao})
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Coluna 3: Rede de Ministérios Integrados */}
        <div className="space-y-4">
          <div>
            <h3 className="font-display text-base font-bold text-ink">Órgãos Integrados</h3>
            <p className="text-xs text-ink-muted">Barramento do Estado em tempo real</p>
          </div>

          <Card className="divide-y divide-border p-0">
            {state.ministerios.map((min) => (
              <div key={min.id} className="p-3.5 transition hover:bg-surface-strong/50">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-ink">{min.sigla}</span>
                  <Badge tone="success" className="text-[9px]">Online</Badge>
                </div>
                <p className="mt-1 text-xs font-medium text-ink">{min.nome}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-ink-muted">
                  <span>{min.servicosAtivos} serviços digitais</span>
                  <span className="font-medium text-amber-700 dark:text-amber-400">
                    {min.processosPendentes} pendentes
                  </span>
                </div>
              </div>
            ))}
          </Card>

          {/* Destaque Soberano */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/50 p-4 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                Soberania de Dados Governamentais
              </h4>
            </div>
            <p className="mt-1 text-xs text-emerald-800/80 dark:text-emerald-400/90 leading-relaxed">
              Todos os dados do protocolo e registos de cidadãos permanecem criptografados e hospedados em território soberano guineense.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
