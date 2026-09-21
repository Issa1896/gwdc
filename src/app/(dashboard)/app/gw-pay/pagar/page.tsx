"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Landmark,
  Loader2,
  QrCode,
  Send,
  Smartphone,
  Store,
  Wallet,
  XCircle,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/widgets";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { BackLink, ButtonLink, QrCode as QrVisual } from "@/components/pay/widgets";
import { MERCHANTS, PROVIDERS } from "@/data/pay";
import { usePay, type PayResult } from "@/lib/pay-store";
import { cn } from "@/lib/utils";

const SLEEP = (ms: number) => new Promise((r) => setTimeout(r, ms));

const METHODS = [
  { id: "gw-wallet" as const, label: "Carteira GW", desc: "Interno · sem taxas · instantâneo", icon: Wallet },
  { id: "orange-money" as const, label: "Orange Money", desc: "Carteira móvel · taxa 1,2%", icon: Smartphone },
  { id: "momo" as const, label: "MTN MoMo", desc: "Carteira móvel · taxa 1,5%", icon: Smartphone },
  { id: "gw-pix" as const, label: "GW PIX", desc: "Instantâneo 24/7 · sem taxas", icon: Zap },
];

type FlowPhase = "idle" | "submitted" | "processing" | "done" | "error";

export default function PagarPage() {
  const { state, pay } = usePay();
  const gw = state.wallets.find((w) => w.id === "gw");
  const [method, setMethod] = useState<(typeof METHODS)[number]["id"]>("gw-pix");
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [phase, setPhase] = useState<FlowPhase>("idle");
  const [result, setResult] = useState<PayResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const provider = method === "gw-wallet" ? null : PROVIDERS.find((p) => p.id === method);
  const merchant = MERCHANTS.find((m) => m.id === merchantId) ?? null;
  const value = parseFloat(amount.replace(",", ".")) || 0;
  const fee = provider && state.config.autoFees ? Math.round(value * provider.feeRate) : 0;
  const total = value + fee;
  const methodBlocked = method !== "gw-wallet" && state.providerStates[method] === "disabled";

  const feeText = useMemo(() => {
    if (method === "gw-wallet") return "Sem taxa interna.";
    const p = PROVIDERS.find((x) => x.id === method);
    if (!p) return "";
    return state.config.autoFees ? `Taxa ${(p.feeRate * 100).toFixed(1).replace(".", ",")}% — ${fee.toLocaleString("pt-PT")} FCFA` : "Taxa automática desativada nas configurações.";
  }, [method, fee, state.config.autoFees]);

  async function handlePay() {
    setError(null);
    if (value <= 0) return setError("Informe um valor maior que zero.");
    if (!destination.trim() && !merchant) return setError("Indique o destino (número, chave ou NIF) do pagamento.");
    try {
      setPhase("submitted");
      await SLEEP(700);
      setPhase("processing");
      const res = await pay({
        method,
        amount: value,
        destination: merchant ? `${merchant.name} · ${merchant.phone}` : destination.trim(),
        note: merchant ? `QR ${merchant.name}` : note.trim() || undefined,
      });
      setResult(res);
      setPhase(res.ok ? "done" : "error");
    } catch (e) {
      setPhase("idle");
      setError(e instanceof Error ? e.message : "Não foi possível processar o pagamento.");
    }
  }

  function resetForm() {
    setPhase("idle");
    setResult(null);
    setAmount("");
    setNote("");
    setDestination("");
    setMerchantId(null);
  }

  const steps = [
    { key: "submitted", label: "Submetido" },
    { key: "processing", label: "Liquidação no conector" },
    { key: "done", label: "Concluído" },
  ];

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Pagar"
        description="Envie para carteiras móveis, chaves PIX ou NIF emitente através de qualquer conector ativo."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="font-display text-base font-semibold text-ink">Método de pagamento</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
            {METHODS.map((m) => {
              const blocked = m.id !== "gw-wallet" && state.providerStates[m.id] === "disabled";
              const active = method === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  disabled={blocked}
                  onClick={() => {
                    setMethod(m.id);
                    setMerchantId(null);
                  }}
                  className={cn(
                    "flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-colors",
                    active ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40" : "border-border hover:border-emerald-300",
                    blocked && "cursor-not-allowed opacity-40",
                  )}
                >
                  <m.icon className={cn("size-5", active ? "text-emerald-600" : "text-ink-muted")} />
                  <span className="text-sm font-semibold text-ink">{m.label}</span>
                  <span className="text-[11px] leading-snug text-ink-muted">{m.desc}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="to" className="mb-1.5 block text-sm font-medium text-ink">
                Destino {merchant && <Badge tone="navy">Comerciante conectado</Badge>}
              </label>
              {merchant ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-300 bg-emerald-50/60 p-3 dark:bg-emerald-950/30">
                  <div>
                    <p className="text-sm font-semibold text-ink">{merchant.name}</p>
                    <p className="text-xs text-ink-muted">
                      {merchant.category} · {merchant.city} · {merchant.nif}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setMerchantId(null)}>Trocar</Button>
                </div>
              ) : (
                <input
                  id="to"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder={
                    method === "orange-money" || method === "momo"
                      ? "+245 9xx xxx xxx"
                      : method === "gw-wallet"
                        ? "NIF ou e-mail interno da rede GW"
                        : "Chave PIX (e-mail, NIF ou telefone)"
                  }
                  className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand-400"
                />
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="amount" className="mb-1.5 block text-sm font-medium text-ink">Valor (FCFA)</label>
                <input
                  id="amount"
                  type="number"
                  min="1"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand-400"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[5000, 10000, 25000, 50000].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAmount(String(v))}
                      className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-ink-muted hover:border-emerald-400 hover:text-emerald-600"
                    >
                      {v.toLocaleString("pt-PT")}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="note" className="mb-1.5 block text-sm font-medium text-ink">Nota (opcional)</label>
                <input
                  id="note"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ex.: mensalidade, serviço…"
                  className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand-400"
                />
                <Button variant="outline" size="sm" className="mt-2" onClick={() => setPickerOpen(true)}>
                  <Store className="size-3.5" /> Pagar a comerciante (QR)
                </Button>
              </div>
            </div>

            {merchant && (
              <div className="flex items-center gap-4 rounded-xl border border-border bg-surface-strong/50 p-3">
                <QrVisual seed={`${merchant.id}:${value || 0}`} />
                <div className="text-xs text-ink-muted">
                  <p className="text-sm font-semibold text-ink">QR dinâmico — {merchant.name}</p>
                  <p>Gerado com o valor em tempo real · emitido pela API <code className="font-mono">POST /pix/qrcode</code></p>
                </div>
              </div>
            )}

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </p>
            )}

            {state.config.maintenance && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                Modo de manutenção ativo (Configurações) — os conectores podem rejeitar operações.
              </p>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="font-display text-base font-semibold text-ink">Resumo da operação</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Método</dt>
                <dd className="font-medium text-ink">{provider ? provider.short : "Carteira GW"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Valor</dt>
                <dd className="font-medium text-ink tabular-nums">{value.toLocaleString("pt-PT")} FCFA</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Taxa</dt>
                <dd className="font-medium text-ink tabular-nums">{fee.toLocaleString("pt-PT")} FCFA</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2.5">
                <dt className="font-medium text-ink">Total</dt>
                <dd className="font-bold text-ink tabular-nums">{total.toLocaleString("pt-PT")} FCFA</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-ink-muted">{feeText}</p>
            <p className="mt-1 text-xs text-ink-muted">
              Saldo disponível: <span className="font-semibold text-ink">{gw?.balance.toLocaleString("pt-PT") ?? 0} FCFA</span>
              {" · "}Limite diário: {(gw?.dailyLimit ?? 0).toLocaleString("pt-PT")}.
            </p>
            <Button
              className="mt-4 w-full"
              size="lg"
              disabled={phase === "submitted" || phase === "processing" || methodBlocked}
              onClick={handlePay}
            >
              {phase === "submitted" || phase === "processing" ? (
                <><Loader2 className="size-4 animate-spin" /> A processar…</>
              ) : (
                <><Send className="size-4" /> Pagar {total > 0 ? `${total.toLocaleString("pt-PT")} FCFA` : ""}</>
              )}
            </Button>
            {methodBlocked && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                Este conector está desativado — ative-o na página de provedores.
              </p>
            )}
          </Card>

          <Card className="flex items-start gap-3 p-4">
            <Landmark className="mt-0.5 size-4 shrink-0 text-gold-600" />
            <p className="text-xs leading-relaxed text-ink-muted">
              Todas as operações passam pelo barramento do <strong className="text-ink">Banco Central — GwDC</strong> com
              referência única, assinatura e trilha de auditoria. Consentimento é pedido no dispositivo do pagador.
            </p>
          </Card>
        </div>
      </div>

      {/* ── Seletor de comerciante ─────────────────────────── */}
      <Modal open={pickerOpen} onClose={() => setPickerOpen(false)} title="Pagar a comerciante (QR)">
        <div className="space-y-2">
          {MERCHANTS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMerchantId(m.id);
                setPickerOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left transition-colors hover:border-emerald-400"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950">
                <QrCode className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink">{m.name}</span>
                <span className="block truncate text-xs text-ink-muted">{m.category} · {m.city} · {m.nif}</span>
              </span>
            </button>
          ))}
        </div>
      </Modal>

      {/* ── Modal de execução / recibo ─────────────────────── */}
      <Modal
        open={phase !== "idle"}
        onClose={() => {
          if (phase === "done" || phase === "error") resetForm();
        }}
        title={phase === "done" ? "Pagamento concluído" : phase === "error" ? "Pagamento falhou" : "A processar pagamento"}
      >
        {phase === "submitted" || phase === "processing" ? (
          <div className="space-y-4 py-2">
            <ol className="space-y-3">
              {steps.map((s, i) => {
                const idx = steps.findIndex((x) => x.key === phase);
                const state = i < idx ? "done" : i === idx ? "current" : "todo";
                return (
                  <li key={s.key} className="flex items-center gap-3">
                    {state === "done" ? (
                      <CheckCircle2 className="size-5 text-emerald-600" />
                    ) : state === "current" ? (
                      <Loader2 className="size-5 animate-spin text-brand-500" />
                    ) : (
                      <Circle className="size-5 text-ink-faint" />
                    )}
                    <span className={cn("text-sm font-medium", state === "todo" ? "text-ink-muted" : "text-ink")}>{s.label}</span>
                    {state === "current" && (
                      <span className="ml-auto text-xs text-ink-faint">
                        {phase === "submitted" ? "empacotando…" : `chamando ${provider?.baseUrl ?? ""}…`}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        ) : (
          <div className="space-y-4">
            {phase === "done" && result && (
              <>
                <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950">
                  <CheckCircle2 className="size-8" />
                </div>
                <div className="rounded-xl border border-border bg-canvas p-4 text-sm">
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <dt className="text-ink-muted">Referência GW</dt>
                    <dd className="text-right font-mono text-xs font-medium text-ink">{result.tx.id}</dd>
                    <dt className="text-ink-muted">Conector</dt>
                    <dd className="text-right font-medium text-ink">{result.providerName}</dd>
                    <dt className="text-ink-muted">Valor</dt>
                    <dd className="text-right font-medium text-ink tabular-nums">{result.tx.amount.toLocaleString("pt-PT")} FCFA</dd>
                    <dt className="text-ink-muted">Hash</dt>
                    <dd className="text-right font-mono text-xs text-ink-muted">{result.tx.hash}</dd>
                    <dt className="text-ink-muted">Liquidação</dt>
                    <dd className="text-right font-medium text-ink tabular-nums">{result.latencyMs} ms</dd>
                  </dl>
                </div>
                <p className="text-sm leading-relaxed text-ink-muted">{result.message}</p>
              </>
            )}
            {phase === "error" && result && (
              <>
                <div className="mx-auto grid size-14 place-items-center rounded-full bg-red-100 text-red-600 dark:bg-red-950">
                  <XCircle className="size-8" />
                </div>
                <p className="text-sm leading-relaxed text-ink-muted">
                  O conector <strong className="text-ink">{result.providerName}</strong> recusou a operação.
                  Nenhum valor foi debitado da sua carteira. Pode tentar novamente ou usar outro método.
                </p>
              </>
            )}
            <div className="flex justify-end gap-2">
              <ButtonLink href="/app/gw-pay/historico" variant="outline">Ver histórico</ButtonLink>
              <Button onClick={resetForm}>Fazer novo pagamento</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}