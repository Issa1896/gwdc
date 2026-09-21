"use client";

import { useState } from "react";
import { CheckCircle2, Inbox, Smartphone, Waves, Zap } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/dashboard/widgets";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BackLink, QrCode, CopyButton, MethodBadge, Money } from "@/components/pay/widgets";
import { usePay } from "@/lib/pay-store";
import { fmtDate, type ProviderId } from "@/data/pay/types";
import { cn } from "@/lib/utils";

const CHANNELS: { id: ProviderId | "gw-wallet"; label: string; icon: typeof Zap }[] = [
  { id: "gw-pix", label: "GW PIX", icon: Zap },
  { id: "orange-money", label: "Orange Money", icon: Smartphone },
  { id: "momo", label: "MTN MoMo", icon: Smartphone },
  { id: "gw-wallet", label: "Carteira GW", icon: Waves },
];

export default function ReceberPage() {
  const { state, simulateIncoming } = usePay();
  const gw = state.wallets.find((w) => w.id === "gw");
  const [amount, setAmount] = useState("");
  const [channel, setChannel] = useState<(typeof CHANNELS)[number]["id"]>("gw-pix");
  const [note, setNote] = useState("");
  const [lastIn, setLastIn] = useState<string | null>(null);

  const value = parseFloat(amount.replace(",", ".")) || 0;
  const qrSeed = `${state.config.pixKey}:${value || 0}`;
  const recebidos = state.transactions.filter((t) => t.kind === "receive").slice(0, 6);

  function handleSimulate() {
    if (value <= 0) return;
    const tx = simulateIncoming(value, channel, note);
    setLastIn(tx.id);
    setAmount("");
    setNote("");
  }

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Receber"
        description="Divulgue a sua chave PIX, NIF ou QR dinâmico e acompanhe entradas liquidadas por webhook."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-display text-base font-semibold text-ink">A sua chave de cobrança</h2>
          <p className="mt-1 text-xs text-ink-muted">Emissão via barramento nacional — válida em qualquer participante.</p>

          <div className="mt-4 flex flex-col items-center gap-4 rounded-xl border border-border bg-canvas p-5 sm:flex-row sm:justify-between">
            <QrCode seed={qrSeed} />
            <div className="w-full space-y-2 text-sm sm:max-w-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-muted">Valor no QR</span>
                <span className="font-semibold tabular-nums text-ink">{value > 0 ? `${value.toLocaleString("pt-PT")} FCFA` : "Livre (estático)"}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-muted">Chave PIX</span>
                <CopyButton value={state.config.pixKey} label="Copiar" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-muted">NIF emitente</span>
                <CopyButton value="NIF 0108451-GW" label="Copiar" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-muted">Carteira GW</span>
                <CopyButton value="GWB-2041-990" label="Copiar" />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="qramount" className="mb-1.5 block text-sm font-medium text-ink">
              Valor do QR dinâmico (FCFA) — opcional
            </label>
            <input
              id="qramount"
              type="number"
              min="0"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0 (QR estático)"
              className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand-400"
            />
          </div>

          <div className="mt-5 rounded-xl border border-border bg-surface-strong/50 p-3 text-xs text-ink-muted">
            <p className="flex items-center gap-2 font-semibold text-ink"><Inbox className="size-3.5" /> Como funcionam as entradas</p>
            <p className="mt-1 leading-relaxed">
              O pagador liquida no seu provedor; o FSP notifica o barramento por webhook{" "}
              <code className="font-mono">POST /pix/callback</code> (ou equivalente), e o crédito entra na sua
              carteira GW com referência e hash de auditoria.
            </p>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-ink">Recebimento simulado (webhook)</h2>
              <Badge tone="info">Modo sandbox</Badge>
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              Simule um pagamento externo liquidado num conector — a carteira é creditada em tempo real.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CHANNELS.map((c) => {
                const blocked = c.id !== "gw-wallet" && c.id !== "gw-pix" && state.providerStates[c.id] === "disabled";
                const active = channel === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    disabled={blocked}
                    onClick={() => setChannel(c.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors",
                      active ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40" : "border-border hover:border-emerald-300",
                      blocked && "cursor-not-allowed opacity-40",
                    )}
                  >
                    <c.icon className={cn("size-4.5", active ? "text-emerald-600" : "text-ink-muted")} />
                    <span className="text-xs font-semibold text-ink">{c.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="inamount" className="mb-1.5 block text-sm font-medium text-ink">Valor a receber (FCFA)</label>
                <input
                  id="inamount"
                  type="number"
                  min="1"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ex.: 25 000"
                  className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand-400"
                />
              </div>
              <div>
                <label htmlFor="innote" className="mb-1.5 block text-sm font-medium text-ink">Nota (opcional)</label>
                <input
                  id="innote"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ex.: encomenda, serviço…"
                  className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand-400"
                />
              </div>
            </div>

            {lastIn && (
              <p className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 className="size-4 shrink-0" />
                Crédito registado — referência <span className="font-mono text-xs font-bold">{lastIn}</span> no extrato.
              </p>
            )}

            <Button className="mt-4 w-full" size="lg" onClick={handleSimulate} disabled={value <= 0}>
              Simular recebimento
            </Button>
          </Card>

          <Card>
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-display text-base font-semibold text-ink">Últimos recebimentos</h2>
              <p className="text-xs text-ink-muted">Saldo atual: {(gw?.balance ?? 0).toLocaleString("pt-PT")} FCFA</p>
            </div>
            {recebidos.length === 0 ? (
              <EmptyState title="Nada recebido ainda" description="Entradas liquidadas aparecerão aqui." icon={Inbox} />
            ) : (
              <ul className="divide-y divide-border">
                {recebidos.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{t.title}</p>
                      <p className="text-xs text-ink-muted">{t.counterparty} · {fmtDate(t.createdAt)}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <MethodBadge method={t.method} />
                      <Money value={t.amount} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}