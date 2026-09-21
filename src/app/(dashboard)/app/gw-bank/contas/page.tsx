"use client";

import { useMemo, useState } from "react";
import { Banknote, CirclePlus, Landmark, Wallet } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/dashboard/widgets";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BackLink, BankMoney, CopyButton, TxStatusBadge } from "@/components/bank/widgets";
import { fmtDate, fmtFcfa } from "@/data/bank/types";
import { useBank } from "@/lib/bank-store";

const KIND_LABEL: Record<string, string> = {
  checking: "À ordem",
  savings: "Poupança",
  treasury: "Tesouraria",
};

export default function ContasPage() {
  const { state, openAccount } = useBank();
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<"checking" | "savings">("checking");
  const [created, setCreated] = useState<string | null>(null);

  const rows = useMemo(() => {
    return [...state.transactions]
      .filter((t) => filter === "all" || t.accountId === filter)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [state.transactions, filter]);

  function submitOpen() {
    if (!name.trim()) return;
    const acc = openAccount({ name: name.trim(), kind });
    setCreated(`${acc.name} · ${acc.number}`);
    setName("");
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Contas"
        description="Contas à ordem, poupança e tesouraria — números, IBAN e saldos em FCFA."
        actions={
          <Button onClick={() => setOpen(true)}>
            <CirclePlus className="size-4" /> Abrir conta
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {state.accounts.map((a) => (
          <Card key={a.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950">
                  {a.kind === "checking" ? <Landmark className="size-5" /> : a.kind === "savings" ? <Wallet className="size-5" /> : <Banknote className="size-5" />}
                </span>
                <div>
                  <h3 className="font-display text-sm font-semibold text-ink">{a.name}</h3>
                  <p className="font-mono text-xs text-ink-muted">{a.number}</p>
                </div>
              </div>
              <Badge tone="navy">{KIND_LABEL[a.kind]}</Badge>
            </div>
            <p className="mt-4 font-display text-2xl font-bold text-ink">{fmtFcfa(a.balance)}</p>
            <div className="mt-2 flex items-center justify-between text-xs text-ink-muted">
              <span>Limite: {fmtFcfa(a.limit)}</span>
              {a.interestRate != null && <span className="font-medium text-emerald-600">{a.interestRate}% a.a.</span>}
            </div>
            {a.kind === "savings" && a.goal != null && (
              <div className="mt-3">
                <Progress value={(a.balance / a.goal) * 100} tone="gold" ariaLabel={`Progresso da meta de ${a.goal.toLocaleString("pt-PT")} FCFA`} />
                <p className="mt-1 text-xs text-ink-muted">Meta {fmtFcfa(a.goal)}</p>
              </div>
            )}
            <div className="mt-3 border-t border-border pt-3">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-mono text-[10px] text-ink-muted" title={a.iban}>{a.iban}</span>
                <CopyButton value={a.iban} label="Copiar IBAN" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-base font-semibold text-ink">Extrato</h2>
            <p className="text-xs text-ink-muted">Movimentações por conta.</p>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand-400"
            aria-label="Filtrar por conta"
          >
            <option value="all">Todas as contas</option>
            {state.accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        {rows.length === 0 ? (
          <EmptyState title="Sem movimentações" description="As operações desta conta aparecerão aqui." icon={Banknote} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referência</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Contraparte</TableHead>
                <TableHead>Quando</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice(0, 20).map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs text-ink-muted">{t.id}</TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-ink">{t.title}</p>
                    <span className="text-xs text-ink-muted">{t.category}</span>
                  </TableCell>
                  <TableCell className="text-sm text-ink-muted">{t.counterparty}</TableCell>
                  <TableCell className="text-sm text-ink-muted">{fmtDate(t.createdAt)}</TableCell>
                  <TableCell><BankMoney value={t.amount} /></TableCell>
                  <TableCell><TxStatusBadge status={t.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {created && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          Conta criada: {created} — já aparece nas contas ativas.
        </p>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Abrir nova conta">
        <div className="space-y-4">
          <div>
            <label htmlFor="accname" className="mb-1.5 block text-sm font-medium text-ink">Nome da conta</label>
            <input
              id="accname"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Conta Operacional — Filial Bissau"
              className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand-400"
            />
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink">Tipo de conta</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setKind("checking")}
                className={`rounded-xl border p-3 text-left transition-colors ${kind === "checking" ? "border-sky-500 bg-sky-50 dark:bg-sky-950/40" : "border-border hover:border-sky-300"}`}
              >
                <Landmark className="size-4.5 text-ink-muted" />
                <span className="mt-1 block text-sm font-semibold text-ink">À ordem</span>
                <span className="text-[11px] text-ink-muted">Operação corrente do dia a dia.</span>
              </button>
              <button
                type="button"
                onClick={() => setKind("savings")}
                className={`rounded-xl border p-3 text-left transition-colors ${kind === "savings" ? "border-gold-400 bg-gold-50 dark:bg-gold-950/30" : "border-border hover:border-gold-300"}`}
              >
                <Wallet className="size-4.5 text-ink-muted" />
                <span className="mt-1 block text-sm font-semibold text-ink">Poupança</span>
                <span className="text-[11px] text-ink-muted">Remuneração de 3,5% a.a.</span>
              </button>
            </div>
          </div>
          <Button className="w-full" size="lg" onClick={submitOpen} disabled={!name.trim()}>
            Criar conta
          </Button>
        </div>
      </Modal>
    </div>
  );
}