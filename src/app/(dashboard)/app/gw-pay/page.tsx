"use client";

import {
  ArrowRight,
  Banknote,
  CircleDollarSign,
  Info,
  Plug,
  ReceiptText,
  ScanLine,
  Send,
  Wallet,
} from "lucide-react";
import { PageHeader, KpiCard, EmptyState } from "@/components/dashboard/widgets";
import { MvpChartCard } from "@/components/dashboard/mvp-view";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BackLink, ButtonLink, TxStatusBadge, MethodBadge, Money, LatencyPill } from "@/components/pay/widgets";
import { PROVIDERS, uptimePercent } from "@/data/pay";
import { fmtDate, fmtFcfaShort } from "@/data/pay/types";
import type { MvpChart } from "@/data/mvp/types";
import { usePay } from "@/lib/pay-store";

export default function BancoDigitalOverviewPage() {
  const { state } = usePay();
  const gw = state.wallets.find((w) => w.id === "gw");

  const today = new Date().toDateString();
  const txs = [...state.transactions].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const txsToday = txs.filter((t) => new Date(t.createdAt).toDateString() === today);
  const volume = txsToday.filter((t) => t.status === "settled").reduce((s, t) => s + Math.abs(t.amount), 0);

  const byProvider = PROVIDERS.filter((p) => p.id !== "iban").map((p) => ({
    name: p.short,
    valor: txs.filter((t) => t.status === "settled" && t.method === p.id).reduce((s, t) => s + Math.abs(t.amount), 0),
  }));
  byProvider.push({
    name: "Carteira GW",
    valor: txs.filter((t) => t.status === "settled" && t.method === "gw-wallet").reduce((s, t) => s + Math.abs(t.amount), 0),
  });

  const volumeChart: MvpChart = {
    id: "volume-provider",
    title: "Volume liquidado por conector",
    type: "bar",
    kind: "fcfa",
    data: byProvider,
  };

  const uptime = uptimePercent(state.providerStates);

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Painel de Pagamentos — GW Pay"
        description="Carteira digital, conectores Orange Money · MTN MoMo · GW PIX e motor de liquidação em tempo real, com suporte futuro a IBAN (BCEAO)."
        actions={
          <>
            <ButtonLink href="/app/gw-pay/pagar">
              <Send className="size-4" /> Pagar
            </ButtonLink>
            <ButtonLink href="/app/gw-pay/receber" variant="outline">
              <ScanLine className="size-4" /> Receber
            </ButtonLink>
          </>
        }
      />

      <Card className="flex items-start gap-3 border-sky-200 bg-sky-50/60 p-4 dark:border-sky-900 dark:bg-sky-950/30">
        <Info className="mt-0.5 size-4 shrink-0 text-sky-600 dark:text-sky-400" />
        <p className="text-sm text-ink-muted">
          <strong className="text-ink">GW PIX</strong> — pagamentos instantâneos 24/7 sem taxas sobre o barramento nacional GWDC.
          Conector <strong className="text-ink">IBAN (BCEAO)</strong> em homologação, previsto para 2027.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Saldo carteira GW"
          value={fmtFcfaShort(gw?.balance ?? 0)}
          delta={2.4}
          deltaLabel="este mês"
          icon={Wallet}
          tone="navy"
          spark={[1.05, 1.08, 1.1, 1.13, 1.15, 1.21, 1.24]}
        />
        <KpiCard
          title="Transações hoje"
          value={String(txsToday.length)}
          delta={4.2}
          deltaLabel="vs. ontem"
          icon={ReceiptText}
          tone="gold"
          spark={[4, 6, 5, 8, 7, 9, txsToday.length]}
        />
        <KpiCard
          title="Volume do dia"
          value={fmtFcfaShort(volume)}
          delta={-1.8}
          deltaLabel="liquidado"
          icon={CircleDollarSign}
          spark={[7, 9, 6, 10, 8, 12, volume / 10000]}
        />
        <KpiCard
          title="Disponibilidade conectores"
          value={`${uptime}%`}
          delta={0.6}
          deltaLabel="últimas 24 h"
          icon={Plug}
          spark={[98, 99, 98, 97, 99, 99, uptime]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MvpChartCard chart={volumeChart} />
        </div>
        <Card className="p-5">
          <h2 className="font-display text-base font-semibold text-ink">Conectores ativos</h2>
          <p className="mt-1 text-xs text-ink-muted">Saúde simulada do barramento de liquidação.</p>
          <div className="mt-4 space-y-3">
            {PROVIDERS.map((p) => {
              const st = state.providerStates[p.id];
              const badge =
                st === "connected"
                  ? { label: "Operacional", tone: "success" as const }
                  : st === "degraded"
                    ? { label: "Instável", tone: "warning" as const }
                    : st === "future"
                      ? { label: "Futuro · 2027", tone: "info" as const }
                      : { label: "Inativo", tone: "neutral" as const };
              return (
                <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{p.short}</p>
                    <p className="truncate text-xs text-ink-muted">{p.operator}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge tone={badge.tone} dot>{badge.label}</Badge>
                    <LatencyPill providerId={p.id} />
                  </div>
                </div>
              );
            })}
          </div>
          <ButtonLink href="/app/gw-pay/provedores" variant="outline" size="sm" className="mt-4 w-full">
            <Plug className="size-3.5" /> Gerir conectores
          </ButtonLink>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-base font-semibold text-ink">Últimas transações</h2>
            <p className="text-xs text-ink-muted">Histórico recente da carteira e conectores.</p>
          </div>
          <ButtonLink href="/app/gw-pay/historico" variant="ghost" size="sm">
            Ver histórico <ArrowRight className="size-3.5" />
          </ButtonLink>
        </div>
        {txs.length === 0 ? (
          <EmptyState title="Sem transações" description="As suas movimentações aparecerão aqui." icon={Banknote} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referência</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {txs.slice(0, 7).map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs text-ink-muted">{t.id}</TableCell>
                  <TableCell>
                    <p className="text-sm font-medium text-ink">{t.title}</p>
                    <p className="text-xs text-ink-muted">{t.counterparty} · {fmtDate(t.createdAt)}</p>
                  </TableCell>
                  <TableCell><MethodBadge method={t.method} /></TableCell>
                  <TableCell><Money value={t.amount} /></TableCell>
                  <TableCell><TxStatusBadge status={t.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}