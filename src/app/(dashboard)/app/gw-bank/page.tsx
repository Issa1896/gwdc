"use client";

import {
  ArrowLeftRight,
  CreditCard,
  Landmark,
  PiggyBank,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { PageHeader, KpiCard, EmptyState } from "@/components/dashboard/widgets";
import { MvpChartCard } from "@/components/dashboard/mvp-view";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BankMoney, ButtonLink, CopyButton, TxStatusBadge } from "@/components/bank/widgets";
import { fmtDate, fmtFcfa, fmtFcfaShort } from "@/data/bank/types";
import type { MvpChart } from "@/data/mvp/types";
import { useBank } from "@/lib/bank-store";

const KIND_LABEL: Record<string, { label: string; tone: "brand" | "gold" | "navy" }> = {
  checking: { label: "À ordem", tone: "navy" },
  savings: { label: "Poupança", tone: "gold" },
  treasury: { label: "Tesouraria", tone: "brand" },
};

export default function GwBankOverviewPage() {
  const { state } = useBank();
  const total = state.accounts.reduce((s, a) => s + a.balance, 0);
  const pendingAlerts = state.fraudAlerts.filter((a) => a.status === "pending").length;
  const latest = [...state.transactions].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const byCategory = state.budgets.map((b) => ({
    name: b.category,
    valor: Math.abs(
      state.transactions
        .filter((t) => t.status === "settled" && t.category === b.category)
        .reduce((s, t) => s + t.amount, 0),
    ),
  }));
  const flowChart: MvpChart = {
    id: "fluxo-categorias",
    title: "Movimentação liquidada por categoria",
    type: "bar",
    kind: "fcfa",
    data: byCategory,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Painel do GW Bank — Banco Digital Soberano"
        description="Contas, transferências, cartões, Open Finance e antifraude sob a supervisão do BCEAO."
        actions={
          <>
            <ButtonLink href="/app/gw-bank/transferencias">
              <ArrowLeftRight className="size-4" /> Transferir
            </ButtonLink>
            <ButtonLink href="/app/gw-bank/cartoes" variant="outline">
              <CreditCard className="size-4" /> Cartões
            </ButtonLink>
          </>
        }
      />

      {pendingAlerts > 0 && (
        <Card className="flex items-start gap-3 border-red-200 bg-red-50/60 p-4 dark:border-red-900 dark:bg-red-950/30">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-red-600" />
          <p className="text-sm text-ink-muted">
            <strong className="text-ink">{pendingAlerts} alerta(s) de fraude em análise</strong> — o motor de IA assinalou
            operações fora do padrão. <ButtonLink href="/app/gw-bank/antifraude" variant="ghost" size="sm" className="-my-1 ml-1">Ver fila &rsaquo;</ButtonLink>
          </p>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Património em custódia"
          value={fmtFcfaShort(total)}
          delta={3.1}
          deltaLabel="este mês"
          icon={Landmark} tone="navy"
          spark={[1.0, 1.02, 1.04, 1.09, 1.12, 1.15, 1.19]}
        />
        <KpiCard
          title="Contas ativas"
          value={String(state.accounts.length)}
          delta={1.5}
          deltaLabel="novas no trimestre"
          icon={PiggyBank} tone="gold"
          spark={[2, 2, 3, 3, 3, 4, state.accounts.length]}
        />
        <KpiCard
          title="Cartões em circulação"
          value={String(state.cards.filter((c) => c.status !== "requested").length)}
          delta={0}
          deltaLabel="ativos"
          icon={CreditCard}
          spark={[2, 2, 3, 3, 3, 3, 3]}
        />
        <KpiCard
          title="Alertas antifraude"
          value={String(pendingAlerts)}
          delta={-20}
          deltaLabel="pendentes"
          icon={ShieldAlert} tone="brand"
          spark={[5, 4, 6, 4, 3, 2, pendingAlerts]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MvpChartCard chart={flowChart} />
        </div>
        <Card className="p-5">
          <h2 className="font-display text-base font-semibold text-ink">Conta principal</h2>
          <p className="mt-1 text-xs text-ink-muted">Resumo da operação corrente.</p>
          {state.accounts[0] && (
            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-muted">Número</span>
                <span className="font-mono text-xs text-ink">{state.accounts[0].number}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-muted">IBAN</span>
                <span className="flex items-center gap-2">
                  <code className="font-mono text-[10px] text-ink">{state.accounts[0].iban}</code>
                  <CopyButton value={state.accounts[0].iban} label="Copiar" />
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-muted">Saldo</span>
                <span className="font-semibold tabular-nums text-ink">{fmtFcfa(state.accounts[0].balance)}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-muted">Limite de operação</span>
                <span className="tabular-nums text-ink">{fmtFcfa(state.accounts[0].limit)}</span>
              </div>
            </div>
          )}
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50/60 p-3 text-xs text-sky-800 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300">
            <TrendingUp className="size-4 shrink-0" />
            Rendimento da poupança: 3,5% a.a. — regimes e limites conforme o BCEAO.
          </div>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {state.accounts.map((a) => (
          <Card key={a.id} className="p-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-sm font-semibold text-ink">{a.name}</h3>
              <Badge tone={KIND_LABEL[a.kind].tone}>{KIND_LABEL[a.kind].label}</Badge>
            </div>
            <p className="mt-1 font-mono text-xs text-ink-muted">{a.number}</p>
            <p className="mt-3 font-display text-2xl font-bold text-ink">{fmtFcfaShort(a.balance)}</p>
            <p className="text-xs text-ink-muted">
              {a.kind === "savings" && a.goal ? `Meta: ${fmtFcfaShort(a.goal)}` : `Limite: ${fmtFcfaShort(a.limit)}`}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-base font-semibold text-ink">Últimas movimentações</h2>
            <p className="text-xs text-ink-muted">Extrato consolidado das contas do banco.</p>
          </div>
          <ButtonLink href="/app/gw-bank/contas" variant="ghost" size="sm">Ver contas &rsaquo;</ButtonLink>
        </div>
        {latest.length === 0 ? (
          <EmptyState title="Sem movimentações" description="As operações aparecerão aqui." icon={ArrowLeftRight} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referência</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Conta</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latest.slice(0, 8).map((t) => {
                const acc = state.accounts.find((a) => a.id === t.accountId);
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-xs text-ink-muted">{t.id}</TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-ink">{t.title}</p>
                      <p className="text-xs text-ink-muted">{t.counterparty} · {fmtDate(t.createdAt)}</p>
                    </TableCell>
                    <TableCell className="text-sm text-ink-muted">{acc?.name ?? t.accountId}</TableCell>
                    <TableCell><BankMoney value={t.amount} /></TableCell>
                    <TableCell><TxStatusBadge status={t.status} /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}