"use client";

import { useState } from "react";
import { AlertTriangle, RefreshCw, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/dashboard/widgets";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/education/widgets";
import { BackLink } from "@/components/bank/widgets";
import { fmtFcfa } from "@/data/bank/types";
import { useBank } from "@/lib/bank-store";

export default function ConfiguracoesPage() {
  const { state, toggleConfig, reset } = useBank();
  const [arm, setArm] = useState(false);

  const switches: { key: keyof typeof state.config; title: string; desc: string }[] = [
    { key: "openFinance", title: "Open Finance (BCEAO)", desc: "Partilha de dados com terceiros sob concessão revogável." },
    { key: "notifications", title: "Notificações de operação", desc: "Alertas instantâneos por e-mail e push a cada movimento." },
    { key: "autoCategorize", title: "Categorização automática", desc: "Associa despesas aos orçamentos automaticamente." },
    { key: "mfa", title: "Autenticação em duas etapas", desc: "Exigida em acessos novos e operações acima de 200 mil FCFA." },
    { key: "autoblock", title: "Bloqueio automático de fraude", desc: "Suspende cartões/utilizadores com ThreatScore elevado." },
  ];

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Configurações do GW Bank"
        description="Preferências, limites e políticas de segurança da instituição."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-display text-base font-semibold text-ink">Preferências & segurança</h2>
          <div className="mt-3 space-y-4">
            {switches.map((s) => (
              <div key={s.key} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-ink">{s.title}</p>
                  <p className="text-xs text-ink-muted">{s.desc}</p>
                </div>
                <Switch
                  checked={Boolean(state.config[s.key])}
                  onChange={(v) => toggleConfig(s.key, v)}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
            <SlidersHorizontal className="size-4 text-ink-muted" /> Limites institucionais
          </h2>
          <div className="mt-4 space-y-2.5 text-sm">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <span className="text-ink-muted">Transferência máxima por operação</span>
              <span className="font-semibold tabular-nums text-ink">{fmtFcfa(state.config.maxTransfer)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <span className="text-ink-muted">Levantamento diário por cartão (ATM)</span>
              <span className="font-semibold tabular-nums text-ink">{fmtFcfa(state.config.atmDailyLimit)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-muted">Cartão virtual — limite padrão</span>
              <span className="font-semibold tabular-nums text-ink">300.000 FCFA</span>
            </div>
          </div>
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" />
            Limites alinhados à diretiva de inclusão financeira do BCEAO e às políticas de capital da instituição.
          </p>
        </Card>
      </div>

      <Card className="border-red-200 bg-red-50/40 dark:border-red-900 dark:bg-red-950/20">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 text-red-600" />
            <div>
              <h2 className="font-display text-sm font-semibold text-ink">Zona perigosa</h2>
              <p className="text-xs text-ink-muted">Repõe o estado de demonstração: contas, cartões, orçamentos, consensos e alertas.</p>
            </div>
          </div>
          <Button variant="danger" onClick={() => (arm ? (reset(), setArm(false)) : setArm(true))}>
            <RefreshCw className="size-4" />
            {arm ? "Confirmar restauro?" : "Restaurar dados de demonstração"}
          </Button>
        </div>
      </Card>
    </div>
  );
}