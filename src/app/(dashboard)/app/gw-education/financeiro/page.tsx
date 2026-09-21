"use client";

import { useState } from "react";
import { Banknote, CheckCircle2, Hourglass, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { BackLink, StatCard } from "@/components/education/widgets";
import { EduTable } from "@/components/education/widgets";
import { currency, date, text, type Cell } from "@/data/education/types";
import { STATUS_PAGAMENTO_LABEL, fcfa, type Fatura } from "@/data/education";
import { useEducation } from "@/lib/education-store";

/** MÓDULO 6 — Financeiro do estudante: propinas e faturas com recebimento. */
export default function FinanceiroPage() {
  const { state, registrarPagamento } = useEducation();
  const alunos = state.alunos;
  const [estudanteId, setEstudanteId] = useState(alunos[0]?.id ?? "");
  const [pagando, setPagando] = useState<Fatura | null>(null);
  const [valor, setValor] = useState("");
  const [ok, setOk] = useState(false);

  const estudante = alunos.find((e) => e.id === estudanteId);
  const faturas = state.faturas.filter((f) => f.estudanteId === estudanteId);
  const totalValor = faturas.reduce((acc, f) => acc + f.valor, 0);
  const totalPago = faturas.reduce((acc, f) => acc + f.pago, 0);
  const pendentes = faturas.filter((f) => f.status !== "pago").length;

  const abrirPagamento = (f: Fatura) => {
    setPagando(f);
    setValor(String(f.valor - f.pago));
    setOk(false);
  };

  const confirmarPagamento = () => {
    if (!pagando) return;
    const v = Number(valor.replace(",", "."));
    if (Number.isNaN(v) || v <= 0) return;
    registrarPagamento(pagando.id, v);
    setPagando(null);
    setOk(true);
    window.setTimeout(() => setOk(false), 3000);
  };

  const rows: Cell[][] = faturas.map((f) => {
    const st = STATUS_PAGAMENTO_LABEL[f.status];
    return [
      text(f.referencia),
      text(f.descricao),
      date(f.vencimento),
      currency(f.valor),
      currency(f.pago),
      currency(f.valor - f.pago),
      text(st.label),
    ];
  });

  return (
    <div className="space-y-6">
      <BackLink />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-ink-faint">Faturas do semestre 2/2026 · valores em FCFA · recebimentos ficam registados.</p>
          <Select aria-label="Selecionar estudante" value={estudanteId} onChange={(e) => setEstudanteId(e.target.value)} className="mt-2 w-full max-w-sm">
            {alunos.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome} — {e.id}
              </option>
            ))}
          </Select>
        </div>
        <Badge tone="navy">{estudante?.nome}</Badge>
      </div>

      {ok && (
        <div className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success-strong">
          Pagamento registado com sucesso. A fatura foi atualizada no sistema financeiro nacional.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total lançado" value={fcfa(totalValor)} detail="Faturas do período vigente" icon={Wallet} tone="brand" />
        <StatCard title="Total pago" value={fcfa(totalPago)} detail="Recebimentos registados" icon={Banknote} tone="navy" />
        <StatCard title="Saldo devedor" value={fcfa(totalValor - totalPago)} detail="A regularizar" icon={Hourglass} tone="gold" />
        <StatCard title="Faturas pendentes" value={String(pendentes)} detail="Inclui vencidas" icon={CheckCircle2} tone="brand" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Faturas — {estudante?.nome}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-2">
          {faturas.length === 0 ? (
            <p className="px-5 py-6 text-sm text-ink-muted">Nenhuma fatura gerada para este estudante no período vigente.</p>
          ) : (
            <EduTable
              columns={["Referência", "Descrição", "Vencimento", "Valor", "Pago", "Saldo", "Status"]}
              rows={rows}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Registar recebimentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {faturas.filter((f) => f.pago < f.valor).length === 0 && (
            <p className="text-sm text-ink-muted">Todas as faturas deste estudante estão liquidadas.</p>
          )}
          {faturas
            .filter((f) => f.pago < f.valor)
            .map((f) => {
              const st = STATUS_PAGAMENTO_LABEL[f.status];
              return (
                <div key={f.id} className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{f.referencia}</p>
                    <p className="text-xs text-ink-faint">
                      {f.descricao} · saldo {fcfa(f.valor - f.pago)}
                    </p>
                  </div>
                  <Badge tone={st.tone}>{st.label}</Badge>
                  <Button size="sm" variant="secondary" onClick={() => abrirPagamento(f)} disabled={f.pago >= f.valor}>
                    <Banknote className="size-3.5" /> Registar pagamento
                  </Button>
                </div>
              );
            })}
        </CardContent>
      </Card>

      <Modal
        open={Boolean(pagando)}
        onClose={() => setPagando(null)}
        title={`Registar pagamento — ${pagando?.referencia ?? ""}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setPagando(null)}>Cancelar</Button>
            <Button onClick={confirmarPagamento}><Banknote className="size-4" /> Confirmar recebimento</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-ink-muted">
            Fatura de <strong className="text-ink">{pagando?.descricao}</strong> — valor {pagando ? fcfa(pagando.valor) : ""}, já pago{" "}
            {pagando ? fcfa(pagando.pago) : ""}.
          </p>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="valor-pagamento">
              Valor do recebimento (FCFA)
            </label>
            <input
              id="valor-pagamento"
              type="number"
              min={1}
              max={pagando?.valor ?? 1}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="h-10 w-full rounded-lg border border-border-strong bg-surface px-3 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25"
            />
          </div>
          <p className="text-xs text-ink-faint">O comprovativo é emitido automaticamente e o estado da fatura é recalculado.</p>
        </div>
      </Modal>
    </div>
  );
}