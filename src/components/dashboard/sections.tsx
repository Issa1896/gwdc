"use client";

import { CalendarDays, MapPin, QrCode, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Gauge } from "@/components/dashboard/widgets";
import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import { eduCalendarEvents } from "@/data/mvp";
import { climateGauges, transportMapPoints } from "@/data/mvp";

/** Seções especiais dos MVPs (por produto). */

/** Calendário acadêmico (GW Education / GW Campus). */
export function AcademicCalendarExtra() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <CalendarDays className="size-4 text-brand-500" /> Calendário acadêmico — Agosto de 2026
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar events={eduCalendarEvents} />
      </CardContent>
    </Card>
  );
}

/** Transações bancárias (GW Bank) com verificação antifraude por IA. */
export function BankTransactionsExtra() {
  const transactions = [
    { desc: "Mercado Central — GW Pay", amount: -12500, risk: "Baixo" },
    { desc: "Salário mensal", amount: 450000, risk: "Baixo" },
    { desc: "Transferência internacional", amount: 3200000, risk: "Alto" },
    { desc: "Petróleo Bissau", amount: -25000, risk: "Baixo" },
  ];
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-sm">Fluxo de pagamentos com análise antifraude (IA)</CardTitle>
        <Badge tone="info">
          <ShieldAlert className="size-3" /> IA ativa
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.desc} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium text-ink">{tx.desc}</p>
              <p className="text-xs text-ink-faint">Risco estimado: {tx.risk}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-semibold tabular-nums ${tx.amount < 0 ? "text-danger" : "text-success"}`}>
                {tx.amount < 0 ? "-" : "+"}
                {Math.abs(tx.amount).toLocaleString("pt-PT")} FCFA
              </span>
              <Badge tone={tx.risk === "Alto" ? "danger" : tx.risk === "Médio" ? "warning" : "success"}>{tx.risk}</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/** Bilhetes com QR Code (GW Transport). */
export function TransportTicketsExtra() {
  const [openQr, setOpenQr] = useState<string | null>(null);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <QrCode className="size-4 text-brand-500" /> Bilhete digital com QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        {[
          { id: "GW-BIL-88412", route: "Bissau → Bafatá", when: "01/08 · 09h00", seat: "12" },
          { id: "GW-BIL-88645", route: "Bissau → Bolama", when: "02/08 · 16h30", seat: "5" },
          { id: "GW-BIL-88701", route: "Bissau → Cacheu", when: "05/08 · 08h00", seat: "3" },
        ].map((ticket) => (
          <div key={ticket.id} className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-brand-400 bg-brand-50/50 p-5 text-center dark:bg-brand-950/40">
            <div className="grid size-20 place-items-center rounded-lg bg-white shadow-sm dark:bg-surface-strong" aria-hidden="true">
              <div className="grid grid-cols-3 gap-1 p-1 opacity-80">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span key={i} className="size-3 rounded-[3px] bg-navy-950" style={{ opacity: [1, 0, 1, 0, 1, 0, 1, 0, 1][i] }} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{ticket.route}</p>
              <p className="text-xs text-ink-faint">
                {ticket.when} · Assento {ticket.seat}
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setOpenQr(ticket.id)}>
              Ver QR Code
            </Button>
          </div>
        ))}
      </CardContent>

      <Modal open={Boolean(openQr)} onClose={() => setOpenQr(null)} title="Bilhete digital">
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="grid size-44 place-items-center rounded-xl border border-border bg-white p-4" aria-hidden="true">
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 49 }).map((_, i) => (
                <span key={i} className="size-3 bg-navy-950" style={{ opacity: [1, 0, 1, 1, 0, 0, 1][i % 7] }} />
              ))}
            </div>
          </div>
          <p className="text-sm font-semibold text-ink">Valide este código no embarque</p>
          <Badge tone="brand">Bilhete {openQr}</Badge>
        </div>
      </Modal>
    </Card>
  );
}

/** Mapas de rotas (GW Transport). */
export function TransportMapExtra() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <MapPin className="size-4 text-brand-500" /> Rotas ativas — rastreamento em tempo real
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {transportMapPoints.map((point, i) => (
            <div key={point.name} className="flex items-center gap-3 rounded-lg border border-border px-4 py-2.5">
              <span className="grid size-7 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                {i + 1}
              </span>
              <p className="flex-1 text-sm font-medium text-ink">{point.name}</p>
              <p className="text-xs text-ink-faint">
                {point.lat.toFixed(4)}, {point.lon.toFixed(4)}
              </p>
              <Badge tone="success" dot>Sinal ativo</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/** Medidores de sensores (GW Climate). */
export function ClimateGaugesExtra() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Sensores em tempo real</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        {climateGauges.map((gauge) => (
          <Gauge key={gauge.label} value={gauge.value} max={gauge.max} label={gauge.label} unit={gauge.unit} />
        ))}
      </CardContent>
    </Card>
  );
}

/** Indicador de prontuários (GW Health). */
export function HealthOverviewExtra() {
  const wards = [
    { name: "Emergência", occupation: 74, beds: 12 },
    { name: "Pediatria", occupation: 62, beds: 18 },
    { name: "Maternidade", occupation: 81, beds: 15 },
    { name: "Medicina", occupation: 58, beds: 24 },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Ocupação de leitos por enfermaria</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {wards.map((ward) => (
          <div key={ward.name} className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">{ward.name}</p>
              <Badge tone={ward.occupation > 75 ? "danger" : ward.occupation > 60 ? "warning" : "success"}>
                {ward.occupation}%
              </Badge>
            </div>
            <p className="mt-1 text-xs text-ink-faint">
              {Math.round((ward.occupation / 100) * ward.beds)} de {ward.beds} leitos ocupados
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/** Relatório inteligente por IA (GW Analytics). */
export function AiReportExtra() {
  const [report] = useState(
    "Resumo executivo (gerado por IA): A receita do 2º trimestre superou a projeção em 4,2%, impulsionada pelo GW Pay (+18,7%) e GW Transport (+9,2%). Risco principal: estoque crítico em 3 SKUs do segmento alimentar. Recomendação: antecipar pedidos de compra e intensificar vendas da linha construção, com margem 31,4%.",
  );
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-sm">Relatório inteligente semanal</CardTitle>
        <Badge tone="brand">
          <ShieldAlert className="size-3" /> IA
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-ink-muted">{report}</p>
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline">Exportar PDF</Button>
          <Button size="sm" variant="outline">Solicitar análise detalhada</Button>
        </div>
      </CardContent>
    </Card>
  );
}
