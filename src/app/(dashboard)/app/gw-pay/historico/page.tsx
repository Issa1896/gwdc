"use client";

import { useMemo, useState } from "react";
import { Banknote, Filter, ReceiptText, Search } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/dashboard/widgets";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BackLink, TxStatusBadge, MethodBadge, Money } from "@/components/pay/widgets";
import { PROVIDER_NAMES } from "@/data/pay";
import { fmtDate, type PayTx, type ProviderId, type TxKind, type TxStatus } from "@/data/pay/types";
import { usePay } from "@/lib/pay-store";

const KINDS: { id: TxKind | "all"; label: string }[] = [
  { id: "all", label: "Todos os tipos" },
  { id: "transfer", label: "Transferência" },
  { id: "qr", label: "Pagamento QR" },
  { id: "receive", label: "Recebimento" },
  { id: "topup", label: "Recarga" },
  { id: "withdrawal", label: "Levantamento" },
  { id: "refund", label: "Reembolso" },
];

const STATUSES: { id: TxStatus | "all"; label: string }[] = [
  { id: "all", label: "Todos os estados" },
  { id: "settled", label: "Liquidada" },
  { id: "processing", label: "Processando" },
  { id: "failed", label: "Falhou" },
  { id: "refunded", label: "Reembolsada" },
];

const METHODS: { id: ProviderId | "gw-wallet" | "all"; label: string }[] = [
  { id: "all", label: "Todos os métodos" },
  { id: "orange-money", label: "Orange Money" },
  { id: "momo", label: "MTN MoMo" },
  { id: "gw-pix", label: "GW PIX" },
  { id: "gw-wallet", label: "Carteira GW" },
];

export default function HistoricoPage() {
  const { state } = usePay();
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>("all");
  const [status, setStatus] = useState<(typeof STATUSES)[number]["id"]>("all");
  const [method, setMethod] = useState<(typeof METHODS)[number]["id"]>("all");
  const [detail, setDetail] = useState<PayTx | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return [...state.transactions]
      .filter((t) => (kind === "all" || t.kind === kind))
      .filter((t) => (status === "all" || t.status === status))
      .filter((t) => (method === "all" || t.method === method))
      .filter((t) => !needle || `${t.title} ${t.counterparty} ${t.id} ${t.hash}`.toLowerCase().includes(needle))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [state.transactions, q, kind, status, method]);

  const totals = useMemo(() => {
    const settled = filtered.filter((t) => t.status === "settled");
    const net = settled.reduce((s, t) => s + t.amount, 0);
    const volume = settled.reduce((s, t) => s + t.fee, 0);
    return { net, volume, count: filtered.length };
  }, [filtered]);

  const selectCls =
    "rounded-xl border border-border bg-canvas px-3 py-2 text-sm text-ink outline-none focus:border-brand-400";

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Histórico de transações"
        description="Extrato completo da carteira GW com referência, conector e trilha de auditoria."
      />

      <Card className="flex flex-wrap items-center gap-3 border-b-0 p-4">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pesquisar por título, contraparte, referência ou hash…"
            className="w-full rounded-xl border border-border bg-canvas py-2 pl-9 pr-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand-400"
          />
        </div>
        <Filter className="size-4 text-ink-faint" />
        <select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} className={selectCls} aria-label="Filtrar por tipo">
          {KINDS.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={selectCls} aria-label="Filtrar por estado">
          {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <select value={method} onChange={(e) => setMethod(e.target.value as typeof method)} className={selectCls} aria-label="Filtrar por método">
          {METHODS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
        </select>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-ink-muted">Operações no filtro</p>
          <p className="mt-1 font-display text-xl font-bold text-ink">{totals.count}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink-muted">Líquido</p>
          <p className="mt-1 font-display text-xl font-bold text-ink">
            {totals.net >= 0 ? "+" : "−"}{Math.abs(totals.net).toLocaleString("pt-PT")} FCFA
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink-muted">Taxas cobradas</p>
          <p className="mt-1 font-display text-xl font-bold text-ink">{totals.volume.toLocaleString("pt-PT")} FCFA</p>
        </Card>
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState title="Nada por aqui" description="Ajuste os filtros ou aguarde novas movimentações." icon={Banknote} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referência</TableHead>
                <TableHead>Quando</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Taxa</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs text-ink-muted">{t.id}</TableCell>
                  <TableCell className="text-sm text-ink-muted">{fmtDate(t.createdAt)}</TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-ink">{t.title}</p>
                    <p className="max-w-56 truncate text-xs text-ink-muted" title={t.counterparty}>{t.counterparty}</p>
                  </TableCell>
                  <TableCell><MethodBadge method={t.method} /></TableCell>
                  <TableCell><Money value={t.amount} /></TableCell>
                  <TableCell className="text-sm tabular-nums text-ink-muted">{t.fee.toLocaleString("pt-PT")}</TableCell>
                  <TableCell><TxStatusBadge status={t.status} /></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setDetail(t)}>Detalhe</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Modal open={detail !== null} onClose={() => setDetail(null)} title={detail ? `Operação ${detail.id}` : ""}>
        {detail && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <MethodBadge method={detail.method} />
              <TxStatusBadge status={detail.status} />
              <Badge tone="neutral">{detail.kind.toUpperCase()}</Badge>
            </div>
            <p className="text-sm text-ink-muted">{detail.counterparty}</p>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl border border-border bg-canvas p-4 text-sm">
              <dt className="text-ink-muted">Título</dt>
              <dd className="text-right font-medium text-ink">{detail.title}</dd>
              <dt className="text-ink-muted">Valor</dt>
              <dd className="text-right font-medium text-ink tabular-nums">{detail.amount.toLocaleString("pt-PT")} FCFA</dd>
              <dt className="text-ink-muted">Taxa</dt>
              <dd className="text-right font-medium text-ink tabular-nums">{detail.fee.toLocaleString("pt-PT")} FCFA</dd>
              <dt className="text-ink-muted">Data</dt>
              <dd className="text-right font-medium text-ink">{fmtDate(detail.createdAt)}</dd>
              <dt className="text-ink-muted">Hash de auditoria</dt>
              <dd className="text-right font-mono text-xs text-ink-muted break-all">{detail.hash}</dd>
            </dl>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">Trilha de liquidação</p>
              <ol className="space-y-2.5">
                <li className="flex items-center gap-3 text-sm">
                  <span className="grid size-6 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950">1</span>
                  <span className="text-ink">Submetido ao barramento GWDC</span>
                  <span className="ml-auto text-xs text-ink-faint">{detail.method === "gw-wallet" ? "Carteira GW" : PROVIDER_NAMES[detail.method]}</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="grid size-6 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950">2</span>
                  <span className="text-ink">Liquidação no provedor</span>
                  <span className="ml-auto text-xs text-ink-faint">{fmtDate(detail.createdAt)}</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span
                    className={
                      detail.status === "settled"
                        ? "grid size-6 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950"
                        : detail.status === "failed"
                          ? "grid size-6 place-items-center rounded-full bg-red-100 text-red-700 dark:bg-red-950"
                          : "grid size-6 place-items-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950"
                    }
                  >
                    {detail.status === "processing" ? "…" : "3"}
                  </span>
                  <span className="text-ink">
                    {detail.status === "settled" ? "Conciliada — saldo atualizado" : detail.status === "failed" ? "Recusada — nada debitado" : "Conciliação pendente"}
                  </span>
                </li>
              </ol>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border p-3 text-xs text-ink-muted">
              <ReceiptText className="size-4 shrink-0" />
              Recibo digital disponível no extrato — pode reutilizar a referência para contabilidade.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}