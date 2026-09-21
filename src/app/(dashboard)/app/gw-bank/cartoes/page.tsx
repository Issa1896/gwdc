"use client";

import { useState } from "react";
import { CreditCard, Lock, LockOpen, Plus, SlidersHorizontal, Unlock } from "lucide-react";
import { PageHeader } from "@/components/dashboard/widgets";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Progress } from "@/components/ui/progress";
import { BackLink, CardStatusBadge } from "@/components/bank/widgets";
import { fmtFcfa } from "@/data/bank/types";
import { useBank } from "@/lib/bank-store";

export default function CartoesPage() {
  const { state, toggleCard, setCardLimit, requestCard } = useBank();
  const [limitId, setLimitId] = useState<string | null>(null);
  const [limitValue, setLimitValue] = useState("");
  const [orderOpen, setOrderOpen] = useState(false);
  const [cardName, setCardName] = useState("");
  const [network, setNetwork] = useState<"VISA" | "Mastercard">("Mastercard");
  const [cardKind, setCardKind] = useState<"virtual" | "physical">("virtual");

  const activeCards = state.cards.filter((c) => c.status === "active" || c.status === "blocked");
  const pending = state.cards.filter((c) => c.status === "requested");

  function openLimit(id: string, current: number) {
    setLimitId(id);
    setLimitValue(String(current));
  }

  function saveLimit() {
    const v = parseInt(limitValue, 10);
    if (limitId && Number.isFinite(v) && v > 0) setCardLimit(limitId, v);
    setLimitId(null);
  }

  function submitOrder() {
    if (!cardName.trim()) return;
    requestCard({ name: cardName.trim(), network, kind: cardKind });
    setCardName("");
    setOrderOpen(false);
  }

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Cartões"
        description="Cartões virtuais e físicos, limites diários e gestão de segurança."
        actions={
          <Button onClick={() => setOrderOpen(true)}>
            <Plus className="size-4" /> Pedir cartão
          </Button>
        }
      />

      {pending.length > 0 && (
        <Card className="flex items-start gap-3 border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900 dark:bg-amber-950/30">
          <Unlock className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <div className="text-sm text-ink-muted">
            <strong className="text-ink">Emissão em curso para {pending.length} cartão(ões)</strong> — o fabricador recebeu o
            pedido; ativação após validação KYC/BCEAO.
          </div>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {activeCards.map((c) => (
          <Card key={c.id} className="overflow-hidden">
            <div className="relative p-5 text-white" style={{ background: `linear-gradient(135deg, ${c.color}, #0c4a6e)` }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/70">{c.network}</p>
                  <p className="mt-1 font-display text-sm font-semibold">{c.name}</p>
                </div>
                <div className="flex gap-1">
                  <CreditCard className="size-6 text-white/80" />
                </div>
              </div>
              <p className="mt-4 font-mono text-base tracking-widest">
                •••• •••• •••• {c.last4}
              </p>
              <div className="mt-3 flex items-end justify-between text-xs text-white/80">
                <span>VÁLIDO ATÉ {c.expiry}</span>
                <span>{c.kind === "virtual" ? "VIRTUAL" : "FÍSICO"}</span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <Badge tone="navy">Limite diário {fmtFcfa(c.limit)}</Badge>
                <CardStatusBadge status={c.status} />
              </div>
              <div className="mt-3">
                <Progress value={(c.usedToday / c.limit) * 100} tone={c.usedToday / c.limit > 0.75 ? "danger" : "brand"} ariaLabel={`Uso do limite do cartão ${c.last4}`} />
                <p className="mt-1 text-xs text-ink-muted">{fmtFcfa(c.usedToday)} usados hoje</p>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openLimit(c.id, c.limit)}>
                  <SlidersHorizontal className="size-3.5" /> Ajustar limite
                </Button>
                <Button variant={c.status === "active" ? "danger" : "outline"} size="sm" onClick={() => toggleCard(c.id)}>
                  {c.status === "active" ? <Lock className="size-3.5" /> : <LockOpen className="size-3.5" />}
                  {c.status === "active" ? "Bloquear" : "Ativar"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {pending.map((c) => (
        <Card key={c.id} className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-sm font-semibold text-ink">{c.name}</h3>
              <p className="text-xs text-ink-muted">
                {c.network} · {c.kind === "virtual" ? "Virtual" : "Físico"} · limite previsto {fmtFcfa(c.limit)}
              </p>
            </div>
            <CardStatusBadge status={c.status} />
          </div>
        </Card>
      ))}

      {activeCards.length === 0 && pending.length === 0 && (
        <Card className="p-10 text-center text-sm text-ink-muted">Pedir um cartão para começar a usar limites e pagamentos.</Card>
      )}

      <p className="text-xs text-ink-muted">
        Cartões sujeitos a KYC e limites do BCEAO. O bloqueio imediato é obrigatório na suspeita de uso indevido.
      </p>

      <Modal open={limitId !== null} onClose={() => setLimitId(null)} title="Ajustar limite diário (FCFA)">
        <input
          type="number"
          min="10000"
          step="10000"
          value={limitValue}
          onChange={(e) => setLimitValue(e.target.value)}
          className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand-400"
        />
        <p className="mt-2 text-xs text-ink-muted">O novo limite entra em vigor imediatamente na próxima autorização.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setLimitId(null)}>Cancelar</Button>
          <Button onClick={saveLimit}>Guardar</Button>
        </div>
      </Modal>

      <Modal open={orderOpen} onClose={() => setOrderOpen(false)} title="Pedir novo cartão">
        <div className="space-y-4">
          <div>
            <label htmlFor="cardname" className="mb-1.5 block text-sm font-medium text-ink">Nome no cartão</label>
            <input
              id="cardname"
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Ex.: Direção Financeira — Cel. 2"
              className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand-400"
            />
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink">Bandeira</p>
            <div className="grid grid-cols-2 gap-2">
              {(["VISA", "Mastercard"] as const).map((n) => (
                <button key={n} type="button" onClick={() => setNetwork(n)}
                  className={`rounded-xl border p-3 text-sm font-semibold transition-colors ${network === n ? "border-sky-500 bg-sky-50 dark:bg-sky-950/40" : "border-border hover:border-sky-300"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink">Tipo</p>
            <div className="grid grid-cols-2 gap-2">
              {(["virtual", "physical"] as const).map((k) => (
                <button key={k} type="button" onClick={() => setCardKind(k)}
                  className={`rounded-xl border p-3 text-left transition-colors ${cardKind === k ? "border-sky-500 bg-sky-50 dark:bg-sky-950/40" : "border-border hover:border-sky-300"}`}>
                  <span className="block text-sm font-semibold text-ink">{k === "virtual" ? "Virtual" : "Físico"}</span>
                  <span className="text-[11px] text-ink-muted">{k === "virtual" ? "Imediato, para compras online." : "Emissão e entrega pelo correio."}</span>
                </button>
              ))}
            </div>
          </div>
          <Button className="w-full" size="lg" onClick={submitOrder} disabled={!cardName.trim()}>
            Pedir cartão
          </Button>
        </div>
      </Modal>
    </div>
  );
}