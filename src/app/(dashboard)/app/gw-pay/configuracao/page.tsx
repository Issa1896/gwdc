"use client";

import { useState } from "react";
import { AlertTriangle, Check, Eye, EyeOff, KeyRound, RefreshCw, ShieldCheck, Webhook } from "lucide-react";
import { PageHeader } from "@/components/dashboard/widgets";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/education/widgets";
import { BackLink } from "@/components/pay/widgets";
import { usePay } from "@/lib/pay-store";

const CREDENTIALS: { label: string; key: string; hint: string }[] = [
  { label: "Orange Money", key: "GW_OM_CLIENT_KEY · sk_live_9f2a…", hint: "OAuth2 client_credentials · concessão emitida a 10/11/2025" },
  { label: "MTN MoMo", key: "GW_MTN_API_KEY · mtn_1c48…", hint: "API Key · ambiente de produção (X-Target-Environment: prod)" },
  { label: "GW PIX", key: "GW_PIX_CERT · mTLS 2048-bit", hint: "Certificado GWDC + chave de assinatura · rotação a cada 90 dias" },
];

export default function ConfiguracaoPage() {
  const { state, toggleConfig, reset } = usePay();
  const [webhook, setWebhook] = useState(state.config.webhookUrl);
  const [webhookSaved, setWebhookSaved] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [arm, setArm] = useState(false);

  function saveWebhook() {
    toggleConfig("webhookUrl", webhook.trim());
    setWebhookSaved(true);
    setTimeout(() => setWebhookSaved(false), 1800);
  }

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Configurações do GW Pay"
        description="Preferências de liquidação, webhooks, credenciais e limites da carteira."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-display text-base font-semibold text-ink">Motor de liquidação</h2>
          <div className="mt-3 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-ink">Taxas automáticas por conector</p>
                <p className="text-xs text-ink-muted">Aplica a taxa do provedor (OM 1,2% · MoMo 1,5% · PIX 0%) a cada operação.</p>
              </div>
              <Switch checked={state.config.autoFees} onChange={(v) => toggleConfig("autoFees", v)} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-ink">Webhooks de liquidação</p>
                <p className="text-xs text-ink-muted">Regista eventos assinados dos FSP (payment.settled, failed, wallet.credited).</p>
              </div>
              <Switch checked={state.config.webhooks} onChange={(v) => toggleConfig("webhooks", v)} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-ink">Modo de manutenção</p>
                <p className="text-xs text-ink-muted">Suspende novas operações nos conectores (avisado na página Pagar).</p>
              </div>
              <Switch checked={state.config.maintenance} onChange={(v) => toggleConfig("maintenance", v)} />
            </div>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <label htmlFor="webhook" className="mb-1.5 flex items-center gap-2 text-sm font-medium text-ink">
              <Webhook className="size-4 text-ink-muted" /> URL de callback (webhook)
            </label>
            <div className="flex gap-2">
              <input
                id="webhook"
                type="url"
                value={webhook}
                onChange={(e) => setWebhook(e.target.value)}
                className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2 text-sm font-mono text-ink outline-none placeholder:text-ink-faint focus:border-brand-400"
              />
              <Button variant="outline" onClick={saveWebhook}>
                {webhookSaved ? <Check className="size-4 text-emerald-600" /> : "Guardar"}
              </Button>
            </div>
            <p className="mt-1.5 text-xs text-ink-muted">O barramento entrega notificações assinadas para este endpoint.</p>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
            <KeyRound className="size-4 text-ink-muted" /> Credenciais dos conectores
          </h2>
          <p className="mt-1 text-xs text-ink-muted">Segredos de integração — nunca partilhados fora do barramento.</p>
          <div className="mt-4 space-y-3">
            {CREDENTIALS.map((c) => (
              <div key={c.label} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{c.label}</p>
                  <Button variant="ghost" size="sm" onClick={() => setReveal((v) => !v)}>
                    {reveal ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    {reveal ? "Ocultar" : "Revelar"}
                  </Button>
                </div>
                <p className="mt-1 truncate font-mono text-xs text-ink-muted">
                  {reveal ? c.key.replace("· ", "· ") : "••••••••••••••••••••"}
                </p>
                <p className="mt-1 text-xs text-ink-faint">{c.hint}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            <ShieldCheck className="size-4 shrink-0" />
            Todas as chamadas são assinadas (HMAC-SHA256 / mTLS) e auditadas no barramento GWDC.
          </p>
        </Card>
      </div>

      <Card className="border-red-200 bg-red-50/40 dark:border-red-900 dark:bg-red-950/20">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 text-red-600" />
            <div>
              <h2 className="font-display text-sm font-semibold text-ink">Zona perigosa</h2>
              <p className="text-xs text-ink-muted">Repõe o estado de demonstração: carteiras, transações, conectores e configurações.</p>
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