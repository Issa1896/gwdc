"use client";

import { BrainCircuit, CheckCircle2, Lock, ShieldAlert, ShieldCheck } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/dashboard/widgets";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/education/widgets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BackLink, AlertStatusBadge, BankMoney, SeverityBadge } from "@/components/bank/widgets";
import { fmtDate } from "@/data/bank/types";
import { useBank } from "@/lib/bank-store";
import { cn } from "@/lib/utils";

const RULES = [
  "Algoritmo ThreatScore (rede neural)",
  "Análise comportamental de operações",
  "Padrões de estructuração (smurfing)",
  "Geo-movimentação e ATM não credenciadas",
  "Monitorização de dispositivos e sessões",
];

function scoreColor(score: number) {
  return score >= 75 ? "bg-red-500" : score >= 55 ? "bg-amber-500" : "bg-emerald-500";
}

export default function AntifraudePage() {
  const { state, resolveAlert, toggleConfig } = useBank();
  const pending = state.fraudAlerts.filter((a) => a.status === "pending").length;
  const blocked = state.fraudAlerts.filter((a) => a.status === "blocked").length;
  const avgScore = state.fraudAlerts.length
    ? Math.round(state.fraudAlerts.reduce((s, a) => s + a.score, 0) / state.fraudAlerts.length)
    : 0;

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Antifraude & ALD/CFT"
        description="Motor de inteligência artificial que classifica operações por risco e combate à lavagem de dinheiro."
      />

      <Card className="flex flex-wrap items-center justify-between gap-3 border-sky-200 bg-sky-50/60 p-4 dark:border-sky-900 dark:bg-sky-950/30">
        <div className="flex items-start gap-3">
          <BrainCircuit className="mt-0.5 size-4 shrink-0 text-sky-600" />
          <p className="text-sm text-ink-muted">
            <strong className="text-ink">Motor de IA ativo.</strong> A cada operação é atribuído um ThreatScore; acima do
            limiar, o cartão/utilizador é bloqueado automaticamente e um caso é aberto para revisão.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-muted">Bloqueio automático</span>
          <Switch checked={state.config.autoblock} onChange={(v) => toggleConfig("autoblock", v)} />
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="p-5"><p className="text-xs text-ink-muted">Em análise</p><p className="mt-1 font-display text-2xl font-bold text-ink">{pending}</p></Card>
        <Card className="p-5"><p className="text-xs text-ink-muted">Bloqueadas</p><p className="mt-1 font-display text-2xl font-bold text-ink">{blocked}</p></Card>
        <Card className="p-5"><p className="text-xs text-ink-muted">ThreatScore médio</p><p className="mt-1 font-display text-2xl font-bold text-ink">{avgScore}/100</p></Card>
        <Card className="p-5"><p className="text-xs text-ink-muted">Regras ativas</p><p className="mt-1 font-display text-2xl font-bold text-ink">{RULES.length}</p></Card>
      </div>

      <Card>
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-display text-base font-semibold text-ink">Regras do motor</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {RULES.map((r) => (
              <Badge key={r} tone="neutral"><ShieldCheck className="size-3" /> {r}</Badge>
            ))}
          </div>
        </div>
        {state.fraudAlerts.length === 0 ? (
          <EmptyState title="Sem alertas" description="O motor não detetou operações suspeitas." icon={ShieldAlert} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alerta</TableHead>
                <TableHead>Severidade</TableHead>
                <TableHead>ThreatScore</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Quando</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.fraudAlerts.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <p className="max-w-64 text-sm font-semibold text-ink">{a.title}</p>
                    <p className="max-w-64 truncate text-xs text-ink-muted" title={a.details}>{a.details}</p>
                  </TableCell>
                  <TableCell><SeverityBadge severity={a.severity} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="w-16 overflow-hidden rounded-full bg-surface-strong">
                        <span className={cn("block h-1.5 rounded-full", scoreColor(a.score))} style={{ width: `${a.score}%` }} />
                      </span>
                      <span className="text-xs font-bold tabular-nums text-ink">{a.score}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <BankMoney value={a.amount === 0 ? 0 : -a.amount} />
                    {a.counterparty && <p className="text-xs text-ink-muted">{a.counterparty}</p>}
                  </TableCell>
                  <TableCell><AlertStatusBadge status={a.status} /></TableCell>
                  <TableCell className="text-sm text-ink-muted">{fmtDate(a.createdAt)}</TableCell>
                  <TableCell>
                    {a.status === "pending" ? (
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="sm" onClick={() => resolveAlert(a.id, "reviewed")}>
                          <CheckCircle2 className="size-3.5" /> Rever
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => resolveAlert(a.id, "blocked")}>
                          <Lock className="size-3.5" /> Bloquear
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-ink-faint">{a.status === "blocked" ? "Operação bloqueada" : "Caso revisto"}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}