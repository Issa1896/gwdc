"use client";

import { useState } from "react";
import { Banknote, Landmark, Loader2, RefreshCw, Smartphone, Wallet, Zap } from "lucide-react";
import { PageHeader } from "@/components/dashboard/widgets";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BackLink, CopyButton } from "@/components/pay/widgets";
import type { WalletId } from "@/data/pay/types";
import { fmtDate, fmtFcfa } from "@/data/pay/types";
import { usePay } from "@/lib/pay-store";

export default function CarteirasPage() {
  const { state, syncWallet } = usePay();
  const [syncing, setSyncing] = useState<Record<string, boolean>>({});

  const gw = state.wallets.find((w) => w.id === "gw");
  const mobiles = state.wallets.filter((w) => w.kind === "mobile");
  const total = state.wallets.filter((w) => w.linked).reduce((s, w) => s + w.balance, 0);
  const dailyPct = gw ? Math.round((gw.todaySpent / gw.dailyLimit) * 100) : 0;

  function sync(id: WalletId) {
    setSyncing((s) => ({ ...s, [id]: true }));
    setTimeout(() => {
      syncWallet(id);
      setSyncing((s) => ({ ...s, [id]: false }));
    }, 900);
  }

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Carteiras & saldos"
        description="Carteira principal GW, contas ligadas de carteiras móveis e chaves de cobrança."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-ink-muted">Saldo total ligado</p>
          <p className="mt-1.5 font-display text-2xl font-bold text-ink">{fmtFcfa(total)}</p>
          <p className="mt-1 text-xs text-ink-faint">Carteira GW + carteiras móveis</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-ink-muted">Uso do limite diário (GW)</p>
          <p className="mt-1.5 font-display text-2xl font-bold text-ink">{(gw?.todaySpent ?? 0).toLocaleString("pt-PT")} FCFA</p>
          <Progress value={dailyPct} tone={dailyPct > 75 ? "danger" : "brand"} className="mt-3" ariaLabel="Uso do limite diário" />
        </Card>
        <Card className="p-5">
          <p className="text-sm text-ink-muted">Conectores ligados</p>
          <p className="mt-1.5 font-display text-2xl font-bold text-ink">
            {state.wallets.filter((w) => w.linked).length}
            <span className="text-sm font-medium text-ink-faint"> / 3 carteiras</span>
          </p>
          <p className="mt-1 text-xs text-ink-faint">GW · Orange Money · MTN MoMo</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 bg-navy-950 px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-white/10">
              <Landmark className="size-5" />
            </span>
            <div>
              <h2 className="font-display text-base font-semibold">Carteira Principal GW</h2>
              <p className="text-xs text-white/70">{gw?.holder}</p>
            </div>
          </div>
          <Badge tone="success">Conta verificada</Badge>
        </div>
        <div className="grid gap-6 p-5 md:grid-cols-2">
          <div>
            <p className="text-sm text-ink-muted">Saldo disponível</p>
            <p className="mt-1 font-display text-3xl font-bold text-ink">{fmtFcfa(gw?.balance ?? 0)}</p>
            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-muted">Chave PIX</span>
                <span className="flex items-center gap-2">
                  <code className="font-mono text-xs text-ink">{state.config.pixKey}</code>
                  <CopyButton value={state.config.pixKey} label="Copiar" />
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-muted">NIF emitente</span>
                <span className="flex items-center gap-2">
                  <code className="font-mono text-xs text-ink">0108451-GW</code>
                  <CopyButton value="0108451-GW" label="Copiar" />
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-muted">Limite diário</span>
                <span className="font-medium tabular-nums text-ink">{gw?.dailyLimit.toLocaleString("pt-PT")} FCFA</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-muted">Última sincronização</span>
                <span className="text-ink">{gw ? fmtDate(gw.lastSync) : "—"}</span>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface-strong/50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Wallet className="size-4 text-emerald-600" /> Capacidades da conta
            </div>
            <ul className="mt-3 space-y-2 text-sm text-ink-muted">
              <li className="flex items-center gap-2"><Zap className="size-3.5 text-gold-600" /> GW PIX — instantâneo 24/7 sem taxas</li>
              <li className="flex items-center gap-2"><Smartphone className="size-3.5 text-gold-600" /> Ligação a carteiras móveis (OM · MoMo)</li>
              <li className="flex items-center gap-2"><Banknote className="size-3.5 text-gold-600" /> Limite diário de saída configurável</li>
            </ul>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="mb-3 font-display text-base font-semibold text-ink">Carteiras móveis ligadas</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {mobiles.map((w) => {
            const providerState = w.providerId ? state.providerStates[w.providerId] : "disabled";
            const blocked = providerState === "disabled";
            return (
              <Card key={w.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-surface-strong text-ink-muted">
                      <Smartphone className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-sm font-semibold text-ink">{w.name}</h3>
                      <p className="font-mono text-xs text-ink-muted">{w.phone}</p>
                    </div>
                  </div>
                  <Badge tone={blocked ? "neutral" : "success"} dot>{blocked ? "Conector inativo" : "Ligada"}</Badge>
                </div>
                <p className="mt-4 font-display text-2xl font-bold text-ink">{fmtFcfa(w.balance)}</p>
                <p className="text-xs text-ink-muted">Saldo reportado pelo provedor</p>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                  <p className="text-xs text-ink-muted">Última sync · {fmtDate(w.lastSync)}</p>
                  <Button variant="outline" size="sm" onClick={() => sync(w.id)} disabled={syncing[w.id] || blocked}>
                    {syncing[w.id] ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
                    {syncing[w.id] ? "A sincronizar…" : "Sincronizar"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}