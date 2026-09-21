"use client";

import { useState } from "react";
import { CheckCircle2, Landmark, Loader2, Send, XCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/widgets";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { BackLink, BankMoney, ButtonLink } from "@/components/bank/widgets";
import { fmtFcfa } from "@/data/bank/types";
import { useBank, type TransferResult } from "@/lib/bank-store";
import { cn } from "@/lib/utils";

const SLEEP = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Phase = "idle" | "submitted" | "settling" | "done" | "error";

export default function TransferenciasPage() {
  const { state, transfer } = useBank();
  const [from, setFrom] = useState(state.accounts[0]?.id ?? "");
  const [to, setTo] = useState(state.accounts[1]?.id ?? "");
  const [external, setExternal] = useState(false);
  const [externalDest, setExternalDest] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<TransferResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const value = parseFloat(amount.replace(",", ".")) || 0;
  const origin = state.accounts.find((a) => a.id === from);
  const destination = external ? null : state.accounts.find((a) => a.id === to);

  async function handleTransfer() {
    setError(null);
    if (value <= 0) return setError("Informe um valor maior que zero.");
    if (external && !externalDest.trim()) return setError("Indique o destino externo (chave PIX/NIF).");
    try {
      setPhase("submitted");
      await SLEEP(650);
      setPhase("settling");
      const res = transfer({ from, to, amount: value, note: note.trim() || undefined, external });
      await SLEEP(500);
      setResult(res);
      setPhase(res.ok ? "done" : "error");
    } catch (e) {
      setPhase("idle");
      setError(e instanceof Error ? e.message : "Não foi possível executar a transferência.");
    }
  }

  function resetForm() {
    setPhase("idle");
    setResult(null);
    setAmount("");
    setNote("");
    setExternalDest("");
  }

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Transferências"
        description="Movimentações entre contas GW Bank ou externas (PIX/GW Pay) com limites e regras BCEAO."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="font-display text-base font-semibold text-ink">Nova transferência</h2>

          <div className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="from" className="mb-1.5 block text-sm font-medium text-ink">Conta de origem</label>
                <select
                  id="from"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full rounded-xl border border-border bg-canvas px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-400"
                >
                  {state.accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} — {fmtFcfa(a.balance)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="to" className="mb-1.5 block text-sm font-medium text-ink">
                  Destino {external && <Badge tone="info">Externo · PIX/GW Pay</Badge>}
                </label>
                {external ? (
                  <input
                    id="to"
                    type="text"
                    value={externalDest}
                    onChange={(e) => setExternalDest(e.target.value)}
                    placeholder="Chave PIX, NIF ou IBAN externo"
                    className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand-400"
                  />
                ) : (
                  <select
                    id="to"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full rounded-xl border border-border bg-canvas px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-400"
                  >
                    {state.accounts.filter((a) => a.id !== from).map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-muted">
              <input type="checkbox" checked={external} onChange={(e) => setExternal(e.target.checked)} className="size-4 accent-sky-600" />
              Transferir para fora do GW Bank — liquidado na infraestrutura PIX do GW Pay
            </label>

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
                  {[25_000, 100_000, 500_000].map((v) => (
                    <button key={v} type="button" onClick={() => setAmount(String(v))}
                      className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-ink-muted hover:border-sky-400 hover:text-sky-600">
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
                  placeholder="Ex.: pagamento de fatura…"
                  className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand-400"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </p>
            )}

            {result?.alertCreated && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                O motor antifraude gerou um alerta automático — verifique a fila em Antifraude.
              </p>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="font-display text-base font-semibold text-ink">Resumo</h2>
            <dl className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-ink-muted">Origem</dt>
                <dd className="truncate font-medium text-ink">{origin?.name ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-ink-muted">Destino</dt>
                <dd className="truncate font-medium text-ink">{external ? "Externo (PIX/GW Pay)" : (destination?.name ?? "—")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Valor</dt>
                <dd className="font-medium tabular-nums text-ink">{value.toLocaleString("pt-PT")} FCFA</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Taxa de liquidação</dt>
                <dd className="font-medium tabular-nums text-ink">0 FCFA</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2.5">
                <dt className="font-medium text-ink">Total a debitar</dt>
                <dd className="font-bold tabular-nums text-ink">{value.toLocaleString("pt-PT")} FCFA</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-ink-muted">
              Limite máximo por operação: {fmtFcfa(state.config.maxTransfer)}. Saldo disponível: {fmtFcfa(origin?.balance ?? 0)}.
            </p>
            <Button className="mt-4 w-full" size="lg" disabled={phase === "submitted" || phase === "settling"} onClick={handleTransfer}>
              {phase === "submitted" || phase === "settling" ? (
                <><Loader2 className="size-4 animate-spin" /> A processar…</>
              ) : (
                <><Send className="size-4" /> Transferir {value > 0 ? `${value.toLocaleString("pt-PT")} FCFA` : ""}</>
              )}
            </Button>
          </Card>

          <Card className="flex items-start gap-3 p-4">
            <Landmark className="mt-0.5 size-4 shrink-0 text-sky-600" />
            <p className="text-xs leading-relaxed text-ink-muted">
              Transferências externas são liquidadas na infraestrutura de pagamentos instantâneos do{" "}
              <strong className="text-ink">GW Pay</strong> (barramento GWDC), com referência única e auditoria.
            </p>
          </Card>
        </div>
      </div>

      <Modal
        open={phase !== "idle"}
        onClose={() => {
          if (phase === "done" || phase === "error") resetForm();
        }}
        title={phase === "done" ? "Transferência concluída" : phase === "error" ? "Transferência falhou" : "A processar transferência"}
      >
        {phase === "submitted" || phase === "settling" ? (
          <div className="space-y-3 py-2">
            <StepRow phase="submitted" current={phase} label="Submetida ao banco" />
            <StepRow phase="settling" current={phase} label={external ? "Liquidação na infraestrutura PIX" : "Débito/crédito das contas"} />
            <StepRow phase="done" current={phase} label="Conciliação e comprovante" />
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
                    <dt className="text-ink-muted">Referência</dt>
                    <dd className="text-right font-mono text-xs font-bold text-ink">{result.tx.id}</dd>
                    <dt className="text-ink-muted">Valor debitado</dt>
                    <dd className="text-right font-medium tabular-nums text-ink">
                      {Math.abs(result.tx.amount).toLocaleString("pt-PT")} FCFA
                    </dd>
                    <dt className="text-ink-muted">Hash</dt>
                    <dd className="text-right font-mono text-xs text-ink-muted break-all">{result.tx.hash}</dd>
                    <dt className="text-ink-muted">Estado</dt>
                    <dd className="text-right"><BankMoney value={Math.abs(result.tx.amount) > 0 ? Math.abs(result.tx.amount) : 0} /></dd>
                  </dl>
                </div>
                <p className="text-sm leading-relaxed text-ink-muted">{result.message}</p>
              </>
            )}
            {phase === "error" && (
              <p className="flex items-start gap-2 text-sm leading-relaxed text-ink-muted">
                <XCircle className="mt-0.5 size-4 shrink-0 text-red-600" />
                A operação não foi executada — nenhum valor foi debitado. Verifique os limites e tente novamente.
              </p>
            )}
            <div className="flex justify-end gap-2">
              <ButtonLink href="/app/gw-bank/contas" variant="outline">Ver extrato</ButtonLink>
              <Button onClick={resetForm}>Nova transferência</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function StepRow({ label, phase, current }: { label: string; phase: Phase; current: Phase }) {
  const active = current === phase || current === "done";
  const past = phase === "done" ? current === "done" || current === "error" : current === phase;
  return (
    <div className={cn("flex items-center gap-3")}>
      {past ? (
        <CheckCircle2 className="size-5 text-emerald-600" />
      ) : active && phase !== "done" ? (
        <Loader2 className="size-5 animate-spin text-sky-500" />
      ) : (
        <span className="size-5 rounded-full border-2 border-border" />
      )}
      <span className={cn("text-sm font-medium", phase === "done" ? "text-ink-muted" : "text-ink")}>{label}</span>
    </div>
  );
}