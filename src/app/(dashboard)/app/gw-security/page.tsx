"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Globe,
  Lock,
  Radio,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useSecurity, type IncidenteSeguranca } from "@/lib/security-store";
import { Badge } from "@/components/ui/badge";

export default function SecurityDashboardPage() {
  const { state, conterIncidente, bloquearIp } = useSecurity();
  const [ipBloquear, setIpBloquear] = useState("");
  const [motivoBloqueio, setMotivoBloqueio] = useState("");
  const [sucessoMsg, setSucessoMsg] = useState<string | null>(null);

  const getSeveridadeBadge = (sev: IncidenteSeguranca["severidade"]) => {
    switch (sev) {
      case "critica":
        return <Badge tone="danger">Crítica</Badge>;
      case "alta":
        return <Badge tone="warning">Alta</Badge>;
      case "media":
        return <Badge tone="info">Média</Badge>;
      case "baixa":
        return <Badge tone="neutral">Baixa</Badge>;
    }
  };

  const getStatusBadge = (status: IncidenteSeguranca["status"]) => {
    switch (status) {
      case "detectado":
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500"><Radio className="size-3 animate-pulse" /> Detectado</span>;
      case "analise":
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500"><Activity className="size-3" /> Em Análise</span>;
      case "contido":
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-500"><Lock className="size-3" /> Contido</span>;
      case "resolvido":
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500"><CheckCircle2 className="size-3" /> Resolvido</span>;
    }
  };

  const handleBloquear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipBloquear) return;
    bloquearIp(ipBloquear, motivoBloqueio || "Ameaça identificada manualmente no SOC");
    setSucessoMsg(`IP ${ipBloquear} adicionado à lista de bloqueio imediato do WAF!`);
    setIpBloquear("");
    setMotivoBloqueio("");
    setTimeout(() => setSucessoMsg(null), 3500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast alert */}
      {sucessoMsg && (
        <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-950/90 px-4 py-3 text-sm text-rose-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="size-5 shrink-0 text-rose-400" />
          <span>{sucessoMsg}</span>
        </div>
      )}

      {/* Hero / SOC Status Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-rose-500/20 bg-gradient-to-br from-rose-950/40 via-surface to-surface-ground p-6 sm:p-10 shadow-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="danger" className="gap-1.5 py-1 px-3 bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 font-semibold">
              <ShieldAlert className="size-3.5" /> SOC Nacional 24/7
            </Badge>
            <span className="text-xs text-ink-muted">Centro de Operações de Segurança Cibernética • República da Guiné-Bissau</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-ink">
            Defesa Ativa da Infraestrutura Crítica do Estado
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-ink-muted">
            Monitoramento em tempo real de redes governamentais, links submarinos, gateways bancários e sistemas eleitorais.
            Contenção automatizada de ataques por IA e resposta coordenada a incidentes nacionais.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/app/gw-security/incidentes"
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-rose-700 transition"
            >
              <AlertTriangle className="size-4" />
              <span>Ver Central de Incidentes ({state.incidentes.length})</span>
            </Link>
            <Link
              href="/app/gw-security/waf"
              className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-surface px-5 py-2.5 text-sm font-semibold text-ink hover:border-rose-500 hover:text-rose-600 transition"
            >
              <ShieldCheck className="size-4 text-rose-500" />
              <span>Regras do WAF Ativas</span>
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <Radio className="size-4 animate-pulse" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">Eventos SIEM / Dia</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">12.4 mi</p>
          <p className="text-[11px] text-ink-muted">Telemetria de borda em tempo real</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertOctagon className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">Ataques Neutralizados</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">44.7 mil</p>
          <p className="text-[11px] text-ink-muted">Bloqueados nas últimas 24h</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Zap className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">Tempo de Contenção</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">&lt; 4 min</p>
          <p className="text-[11px] text-ink-muted">Automação de playbooks com IA</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Server className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">Ativos Críticos</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">100%</p>
          <p className="text-[11px] text-ink-muted">Disponibilidade operacional</p>
        </div>
      </section>

      {/* Critical Infrastructure Health Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink flex items-center gap-2">
              <Server className="size-5 text-rose-600" />
              Saúde da Infraestrutura Crítica Nacional
            </h2>
            <p className="text-xs text-ink-muted">Monitoramento perimetral e conectividade dos pilares soberanos.</p>
          </div>
          <Badge tone="success">Todos os Nódulos Saudáveis</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {state.ativos.map((ativo) => (
            <div
              key={ativo.id}
              className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  {ativo.tipo}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                  Operacional
                </span>
              </div>

              <h3 className="text-xs font-bold text-ink leading-snug">{ativo.nome}</h3>
              <p className="text-[11px] text-ink-faint flex items-center gap-1">
                <Globe className="size-3" /> {ativo.localizacao}
              </p>

              <div className="pt-2 border-t border-border-subtle/80 flex items-center justify-between text-xs text-ink-muted">
                <span>Latência: <strong className="text-ink">{ativo.latenciaMs} ms</strong></span>
                <span>Uptime: <strong className="text-ink">{ativo.uptime}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Grid: Live Threat Stream & Quick Block Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Incidents Feed */}
        <div className="lg:col-span-8 rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4">
            <div>
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <Activity className="size-5 text-rose-500" />
                Feed de Incidentes e Ameaças Recentes (SIEM)
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">Eventos classificados pelo motor de correlação do SOC.</p>
            </div>
            <Link
              href="/app/gw-security/incidentes"
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border-subtle space-y-3">
            {state.incidentes.map((inc) => (
              <div key={inc.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-ink">{inc.codigo}</span>
                    {getSeveridadeBadge(inc.severidade)}
                    {getStatusBadge(inc.status)}
                  </div>
                  <span className="text-[11px] text-ink-faint">{inc.dataHora}</span>
                </div>

                <h3 className="text-xs font-bold text-ink">{inc.titulo}</h3>
                <p className="text-[11px] text-ink-muted leading-relaxed">{inc.descricao}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1">
                  <span className="text-ink-faint">Alvo: <strong className="text-ink">{inc.alvo}</strong> • Origem: <strong className="text-ink">{inc.ipOrigem}</strong></span>
                  {inc.status !== "contido" && inc.status !== "resolvido" && (
                    <button
                      onClick={() => {
                        conterIncidente(inc.id);
                        setSucessoMsg(`Incidente ${inc.codigo} contido com sucesso!`);
                        setTimeout(() => setSucessoMsg(null), 3000);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-rose-600/10 px-2.5 py-1 text-[11px] font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-600/20 transition"
                    >
                      <Lock className="size-3" /> Conter Ameaça
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quick IP Containment & SOC Playbook */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-rose-500/30 bg-surface p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-ink flex items-center gap-2">
              <Shield className="size-4 text-rose-600" />
              Bloqueio Manual Perimetral (WAF)
            </h3>
            <p className="text-xs text-ink-muted">
              Insira um IP ou prefixo malicioso detectado fora do país para aplicar descarte de pacotes imediato.
            </p>

            <form onSubmit={handleBloquear} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-ink">Endereço IP / CIDR</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 185.220.101.42 ou 45.154.0.0/16"
                  value={ipBloquear}
                  onChange={(e) => setIpBloquear(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3 py-2 text-xs text-ink focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink">Motivo do Bloqueio</label>
                <input
                  type="text"
                  placeholder="Ex: Varredura de portas no Data Center"
                  value={motivoBloqueio}
                  onChange={(e) => setMotivoBloqueio(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3 py-2 text-xs text-ink focus:border-rose-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-rose-600 py-2 text-xs font-semibold text-white shadow hover:bg-rose-700 transition"
              >
                Bloquear na Borda Nacional
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-ink flex items-center gap-1.5">
              <Cpu className="size-3.5 text-blue-500" /> Motor Heurístico de IA
            </h4>
            <p className="text-[11px] text-ink-muted leading-relaxed">
              O motor de IA nacional correlaciona eventos do WAF, do barramento interministerial e do sistema de pagamentos para detectar ameaças antes que atinjam os serviços públicos.
            </p>
            <div className="rounded-xl bg-surface-raised p-3 text-[11px] text-ink-faint space-y-1 font-mono">
              <div>&gt; Playbook auto-drenagem: ATIVO</div>
              <div>&gt; Assinaturas OWASP 2026: ATUALIZADAS</div>
              <div>&gt; Proteção de BGP RPKI: SINCRONIZADA</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
