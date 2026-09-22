"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Plus,
  Power,
  Shield,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";
import { useSecurity, type RegraWaf } from "@/lib/security-store";
import { Badge } from "@/components/ui/badge";

export default function WafPage() {
  const { state, alternarRegraWaf } = useSecurity();
  const [isNovaRegraOpen, setIsNovaRegraOpen] = useState(false);
  const [notificacao, setNotificacao] = useState<string | null>(null);

  // Form State
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<RegraWaf["tipo"]>("Rate Limit");
  const [alvo, setAlvo] = useState("");

  const showNotification = (msg: string) => {
    setNotificacao(msg);
    setTimeout(() => setNotificacao(null), 3500);
  };

  const totalBloqueios = state.regrasWaf.reduce((acc, r) => acc + (r.ativa ? r.bloqueios24h : 0), 0);

  const handleCriarRegra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !alvo) return;

    const nova: RegraWaf = {
      id: `waf-usr-${Date.now()}`,
      nome,
      tipo,
      alvo,
      bloqueios24h: 0,
      ativa: true,
    };

    state.regrasWaf.unshift(nova);
    setIsNovaRegraOpen(false);
    setNome("");
    setAlvo("");
    showNotification(`Regra "${nova.nome}" implantada com sucesso no WAF.`);
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
            <ShieldAlert className="size-6 text-rose-600" />
            Firewall de Aplicações Web (WAF) & Proteção de APIs
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Inspeção profunda de pacotes, bloqueio de exploits OWASP e proteção contra botnets em todas as rotas do Estado.
          </p>
        </div>

        <button
          onClick={() => setIsNovaRegraOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-rose-700 transition"
        >
          <Plus className="size-4" /> Criar Regra de Proteção
        </button>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <span className="text-xs font-semibold text-ink-faint uppercase tracking-wider">Regras Ativas</span>
          <p className="mt-1 text-2xl font-bold text-ink">
            {state.regrasWaf.filter((r) => r.ativa).length} / {state.regrasWaf.length}
          </p>
          <p className="text-[11px] text-ink-muted">Inspeção perimetral habilitada</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <span className="text-xs font-semibold text-ink-faint uppercase tracking-wider">Requisições Bloqueadas (24h)</span>
          <p className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400">
            {totalBloqueios.toLocaleString("pt-GW")}
          </p>
          <p className="text-[11px] text-ink-muted">Ameaças descartadas na borda</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <span className="text-xs font-semibold text-ink-faint uppercase tracking-wider">Tempo Médio de Inspeção</span>
          <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">0.8 ms</p>
          <p className="text-[11px] text-ink-muted">Impacto imperceptível na latência</p>
        </div>
      </div>

      {/* Rules Table */}
      <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <Shield className="size-4 text-rose-500" />
            Políticas de Segurança do Firewall
          </h2>
          <Badge tone="brand" className="text-[10px] font-semibold">Motor NGINX ModSecurity + IA</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border-subtle bg-surface-raised text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Nome da Regra</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Alvo de Aplicação</th>
                <th className="px-4 py-3 font-semibold text-right">Bloqueios (24h)</th>
                <th className="px-4 py-3 font-semibold text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-surface">
              {state.regrasWaf.map((regra) => (
                <tr key={regra.id} className="hover:bg-surface-raised/60 transition">
                  <td className="px-4 py-3">
                    {regra.ativa ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="size-3.5" /> Ativa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-ink-faint">
                        <Power className="size-3.5" /> Pausada
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-bold text-ink">{regra.nome}</td>
                  <td className="px-4 py-3">
                    <Badge tone="neutral" className="text-[10px]">
                      {regra.tipo}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-ink-muted text-[11px]">{regra.alvo}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                    {regra.bloqueios24h.toLocaleString("pt-GW")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        alternarRegraWaf(regra.id);
                        showNotification(`Regra "${regra.nome}" ${regra.ativa ? "desativada" : "ativada"}.`);
                      }}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        regra.ativa
                          ? "border border-border-subtle bg-surface-raised text-ink-muted hover:text-ink"
                          : "bg-rose-600 text-white shadow hover:bg-rose-700"
                      }`}
                    >
                      {regra.ativa ? "Desativar" : "Ativar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Criar Nova Regra */}
      {isNovaRegraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border-subtle bg-surface p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                <Lock className="size-5 text-rose-600" />
                Implantar Nova Regra no WAF
              </h3>
              <button
                onClick={() => setIsNovaRegraOpen(false)}
                className="rounded-lg p-1 text-ink-faint hover:bg-surface-raised hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCriarRegra} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink">Nome da Regra</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Bloqueio de Scanners na API do Cidadão"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink">Tipo de Proteção</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as RegraWaf["tipo"])}
                    className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-rose-500 focus:outline-none"
                  >
                    <option value="Rate Limit">Rate Limit</option>
                    <option value="SQLi / XSS">SQLi / XSS</option>
                    <option value="Geo-Block">Geo-Block</option>
                    <option value="Bot Protection">Bot Protection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink">Alvo (Path ou IP)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: /api/v1/pagamentos/*"
                    value={alvo}
                    onChange={(e) => setAlvo(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsNovaRegraOpen(false)}
                  className="rounded-xl border border-border-subtle px-4 py-2 text-xs font-medium text-ink hover:bg-surface-raised transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-rose-700 transition"
                >
                  Implantar Regra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
