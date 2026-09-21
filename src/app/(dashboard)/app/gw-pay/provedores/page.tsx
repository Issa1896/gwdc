"use client";

import { useState } from "react";
import {
  Activity,
  Cable,
  CheckCircle2,
  Landmark,
  Loader2,
  Smartphone,
  Webhook,
  XCircle,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/widgets";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/education/widgets";
import { BackLink, LatencyPill } from "@/components/pay/widgets";
import { PROVIDERS, providerPing, type ApiResponse } from "@/data/pay";
import { fmtDate, type ProviderId } from "@/data/pay/types";
import { usePay } from "@/lib/pay-store";
import { cn } from "@/lib/utils";

const ICONS: Record<ProviderId, typeof Zap> = {
  "orange-money": Smartphone,
  momo: Smartphone,
  "gw-pix": Zap,
  iban: Landmark,
};

const STATUS_FOR: Record<string, { label: string; tone: "success" | "warning" | "neutral" | "info" }> = {
  connected: { label: "Operacional", tone: "success" },
  degraded: { label: "Instável", tone: "warning" },
  disabled: { label: "Inativo", tone: "neutral" },
  future: { label: "Futuro · 2027", tone: "info" },
};

export default function ProvedoresPage() {
  const { state, toggleProvider } = usePay();
  const [pingMap, setPingMap] = useState<Record<string, { testing: boolean; last: ApiResponse | null }>>({});

  async function test(id: ProviderId) {
    setPingMap((m) => ({ ...m, [id]: { testing: true, last: m[id]?.last ?? null } }));
    const last = await providerPing(id);
    setPingMap((m) => ({ ...m, [id]: { testing: false, last } }));
  }

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Provedores & conectores"
        description="Integrações REST com Orange Money, MTN MoMo e GW PIX. Credenciais, contratos de API, saúde e webhooks."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {PROVIDERS.map((p) => {
          const Icon = ICONS[p.id];
          const st = state.providerStates[p.id];
          const status = STATUS_FOR[st];
          const ping = pingMap[p.id];
          const isFuture = st === "future";
          const kindLabel =
            p.kind === "mobile-money" ? "Carteira móvel" : p.kind === "instant" ? "Pagamentos instantâneos" : "Transferência bancária";
          return (
            <Card key={p.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-strong text-ink-muted">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-base font-semibold text-ink">{p.short}</h2>
                    <p className="text-xs text-ink-muted">{p.operator}</p>
                  </div>
                </div>
                <Badge tone={status.tone} dot>{status.label}</Badge>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <dt className="text-xs text-ink-faint">Tipo</dt>
                  <dd className="font-medium text-ink">{kindLabel}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-faint">Taxa</dt>
                  <dd className="font-medium text-ink tabular-nums">{(p.feeRate * 100).toFixed(1).replace(".", ",")}%</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-faint">Liquidação</dt>
                  <dd className="font-medium text-ink">{p.settlement}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-faint">Latência média</dt>
                  <dd><LatencyPill providerId={p.id} /></dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-faint">Canal</dt>
                  <dd className="truncate font-medium text-ink" title={p.channel}>{p.channel}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-faint">Integrado desde</dt>
                  <dd className="font-medium text-ink tabular-nums">{p.since}</dd>
                </div>
              </dl>

              {isFuture ? (
                <p className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs leading-relaxed text-sky-800 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300">
                  {p.future}
                </p>
              ) : (
                <>
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-canvas p-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">Conector {st === "disabled" ? "desativado" : "ativo"}</p>
                      <p className="font-mono text-[11px] text-ink-muted">{p.baseUrl}</p>
                    </div>
                    <Switch checked={st === "connected" || st === "degraded"} onChange={() => toggleProvider(p.id)} label="" />
                  </div>

                  <details className="mt-3 rounded-xl border border-border">
                    <summary className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm font-medium text-ink hover:bg-surface-strong">
                      <Cable className="size-4 text-ink-muted" /> Contrato API · {p.apiVersion}
                    </summary>
                    <div className="border-t border-border px-3 py-3 text-xs text-ink-muted">
                      <p className="mb-2"><span className="font-semibold text-ink">Autenticação:</span> {p.auth}</p>
                      <ul className="space-y-1">
                        {p.endpoints.map((e) => (
                          <li key={e.path} className="flex items-center gap-2">
                            <span className="w-12 shrink-0 font-mono">{e.method}</span>
                            <code className="shrink-0 font-mono text-ink">{e.path}</code>
                            <span className="truncate text-ink-faint" title={e.description}>{e.description}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </>
              )}

              {!isFuture && (
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                  <Button variant="outline" size="sm" onClick={() => test(p.id)} disabled={ping?.testing}>
                    {ping?.testing ? <Loader2 className="size-3.5 animate-spin" /> : <Activity className="size-3.5" />}
                    Testar conexão
                  </Button>
                  <div className="flex items-center gap-2 text-xs">
                    {ping?.last && (
                      ping.last.ok ? (
                        <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600">
                          <CheckCircle2 className="size-3.5" /> OK · {ping.last.latencyMs} ms
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 font-medium text-red-600">
                          <XCircle className="size-3.5" /> Sem resposta
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Card>
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Webhook className="size-4 text-ink-muted" />
          <div>
            <h2 className="font-display text-base font-semibold text-ink">Webhooks recebidos</h2>
            <p className="text-xs text-ink-muted">
              Notificações assinadas dos FSP — URL: <code className="font-mono">{state.config.webhookUrl}</code>
            </p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Evento</TableHead>
              <TableHead>Conector</TableHead>
              <TableHead>Resumo</TableHead>
              <TableHead>Quando</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.events.slice(0, 8).map((e) => (
              <TableRow key={e.id}>
                <TableCell>
                  <Badge tone={e.type.includes("failed") ? "danger" : e.type === "wallet.credited" ? "success" : "info"} dot>
                    {e.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-ink">{PROVIDERS.find((p) => p.id === e.providerId)?.short ?? e.providerId}</TableCell>
                <TableCell className="text-sm text-ink-muted">{e.summary}</TableCell>
                <TableCell className={cn("text-sm text-ink-muted")}>{fmtDate(e.at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}