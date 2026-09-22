"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Filter,
  Lock,
  Plus,
  Radio,
  Search,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";
import { useSecurity, type IncidenteSeguranca } from "@/lib/security-store";
import { Badge } from "@/components/ui/badge";

export default function IncidentesPage() {
  const { state, conterIncidente, bloquearIp } = useSecurity();
  const [searchTerm, setSearchTerm] = useState("");
  const [severidadeFiltro, setSeveridadeFiltro] = useState<string>("todas");
  const [statusFiltro, setStatusFiltro] = useState<string>("todos");
  const [notificacao, setNotificacao] = useState<string | null>(null);
  const [isNovoOpen, setIsNovoOpen] = useState(false);

  // Form State
  const [titulo, setTitulo] = useState("");
  const [alvo, setAlvo] = useState("");
  const [ipOrigem, setIpOrigem] = useState("");
  const [severidade, setSeveridade] = useState<IncidenteSeguranca["severidade"]>("alta");
  const [descricao, setDescricao] = useState("");
  const [acaoRecomendada, setAcaoRecomendada] = useState("");

  const showNotification = (msg: string) => {
    setNotificacao(msg);
    setTimeout(() => setNotificacao(null), 3500);
  };

  const filteredIncidentes = state.incidentes.filter((inc) => {
    const matchesSearch =
      inc.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.alvo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.ipOrigem.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSev = severidadeFiltro === "todas" || inc.severidade === severidadeFiltro;
    const matchesStatus = statusFiltro === "todos" || inc.status === statusFiltro;
    return matchesSearch && matchesSev && matchesStatus;
  });

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
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500">
            <Radio className="size-3 animate-pulse" /> Detectado
          </span>
        );
      case "analise":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500">
            <Activity className="size-3" /> Em Análise
          </span>
        );
      case "contido":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-500">
            <Lock className="size-3" /> Contido
          </span>
        );
      case "resolvido":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
            <CheckCircle2 className="size-3" /> Resolvido
          </span>
        );
    }
  };

  const handleCadastrarIncidente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !alvo) return;

    const randomNum = Math.floor(100 + Math.random() * 900);
    const novo: IncidenteSeguranca = {
      id: `inc-${Date.now()}`,
      codigo: `INC-2026-${randomNum}`,
      titulo,
      alvo,
      ipOrigem: ipOrigem || "Desconhecido",
      severidade,
      status: "detectado",
      dataHora: new Date().toISOString().replace("T", " ").substring(0, 16),
      descricao,
      acaoRecomendada: acaoRecomendada || "Isolar tráfego e acionar equipe de plantão.",
    };

    state.incidentes.unshift(novo);
    setIsNovoOpen(false);
    setTitulo("");
    setAlvo("");
    setIpOrigem("");
    setDescricao("");
    setAcaoRecomendada("");
    showNotification(`Incidente ${novo.codigo} registrado no SIEM nacional.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {notificacao && (
        <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-950/90 px-4 py-3 text-sm text-rose-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="size-5 shrink-0 text-rose-400" />
          <span>{notificacao}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <Link href="/app/gw-security" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="size-3.5" /> Painel Geral do SOC
            </Link>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-ink flex items-center gap-2">
            <AlertTriangle className="size-6 text-rose-600" />
            Central de Incidentes & Resposta SIEM
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Triagem, análise forense e contenção coordenada de ameaças digitais à soberania nacional.
          </p>
        </div>

        <button
          onClick={() => setIsNovoOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-rose-700 transition"
        >
          <Plus className="size-4" /> Reportar Novo Incidente
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-faint" />
          <input
            type="text"
            placeholder="Buscar por código, título, alvo ou IP de origem..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-border-subtle bg-surface py-2 pl-10 pr-4 text-xs text-ink placeholder-ink-faint focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 shadow-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-ink-faint">
            <Filter className="size-3.5" />
            <span>Severidade:</span>
          </div>
          {["todas", "critica", "alta", "media", "baixa"].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeveridadeFiltro(sev)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition ${
                severidadeFiltro === sev
                  ? "bg-rose-600 text-white font-semibold shadow-sm"
                  : "bg-surface border border-border-subtle text-ink-muted hover:text-ink"
              }`}
            >
              {sev}
            </button>
          ))}

          <div className="flex items-center gap-1 text-xs text-ink-faint ml-1">
            <span>Status:</span>
          </div>
          {["todos", "detectado", "analise", "contido", "resolvido"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFiltro(st)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition ${
                statusFiltro === st
                  ? "bg-rose-600 text-white font-semibold shadow-sm"
                  : "bg-surface border border-border-subtle text-ink-muted hover:text-ink"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider">
          {filteredIncidentes.length} {filteredIncidentes.length === 1 ? "Incidente Listado" : "Incidentes Listados"}
        </p>

        {filteredIncidentes.length === 0 ? (
          <div className="rounded-2xl border border-border-subtle bg-surface p-12 text-center text-xs text-ink-muted">
            Nenhum incidente encontrado com os filtros selecionados.
          </div>
        ) : (
          filteredIncidentes.map((inc) => (
            <div
              key={inc.id}
              className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm space-y-3 hover:border-rose-500/40 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-sm text-ink">{inc.codigo}</span>
                  {getSeveridadeBadge(inc.severidade)}
                  {getStatusBadge(inc.status)}
                </div>
                <span className="text-xs text-ink-faint">{inc.dataHora}</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-ink">{inc.titulo}</h3>
                <p className="text-xs text-ink-muted leading-relaxed">{inc.descricao}</p>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-ground p-3 text-xs space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-ink-muted">
                  <span>Alvo Impactado: <strong className="text-ink">{inc.alvo}</strong></span>
                  <span>IP Origem / Vetor: <strong className="text-ink font-mono">{inc.ipOrigem}</strong></span>
                </div>
                <div className="text-rose-700 dark:text-rose-300">
                  Ação Recomendada pelo SOC: <span className="text-ink">{inc.acaoRecomendada}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                {inc.ipOrigem && inc.ipOrigem !== "Desconhecido" && (
                  <button
                    onClick={() => {
                      bloquearIp(inc.ipOrigem, `Origem de ${inc.codigo}`);
                      showNotification(`IP ${inc.ipOrigem} bloqueado nas regras de borda.`);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-raised px-3 py-1.5 text-xs font-semibold text-ink hover:border-rose-500 hover:text-rose-600 transition"
                  >
                    <ShieldAlert className="size-3.5 text-rose-500" />
                    Bloquear IP no WAF
                  </button>
                )}

                {inc.status !== "contido" && inc.status !== "resolvido" && (
                  <button
                    onClick={() => {
                      conterIncidente(inc.id);
                      showNotification(`Incidente ${inc.codigo} marcado como contido.`);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-rose-700 transition"
                  >
                    <Lock className="size-3.5" />
                    Executar Contenção
                  </button>
                )}

                {inc.status === "contido" && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500 py-1.5 px-3">
                    <ShieldCheck className="size-3.5" /> Ameaça Neutralizada
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Reportar Novo Incidente */}
      {isNovoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border-subtle bg-surface p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                <AlertTriangle className="size-5 text-rose-600" />
                Reportar Incidente ao SOC Nacional
              </h3>
              <button
                onClick={() => setIsNovoOpen(false)}
                className="rounded-lg p-1 text-ink-faint hover:bg-surface-raised hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCadastrarIncidente} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink">Título da Ocorrência</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Anomalia no fluxo de autenticação do GW Pay"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink">Alvo / Sistema</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: API Core Banking"
                    value={alvo}
                    onChange={(e) => setAlvo(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink">Severidade</label>
                  <select
                    value={severidade}
                    onChange={(e) => setSeveridade(e.target.value as IncidenteSeguranca["severidade"])}
                    className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-rose-500 focus:outline-none"
                  >
                    <option value="critica">Crítica</option>
                    <option value="alta">Alta</option>
                    <option value="media">Média</option>
                    <option value="baixa">Baixa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">IP de Origem / Prefixo</label>
                <input
                  type="text"
                  placeholder="Ex: 194.26.29.112"
                  value={ipOrigem}
                  onChange={(e) => setIpOrigem(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Descrição Forense</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Descreva o comportamento observado, logs relevantes e impacto potencial..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsNovoOpen(false)}
                  className="rounded-xl border border-border-subtle px-4 py-2 text-xs font-medium text-ink hover:bg-surface-raised transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-rose-700 transition"
                >
                  Confirmar e Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
