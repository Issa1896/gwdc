"use client";

import { useState } from "react";
import { PiggyBank, Plus, Target } from "lucide-react";
import { PageHeader } from "@/components/dashboard/widgets";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Progress } from "@/components/ui/progress";
import { BackLink } from "@/components/bank/widgets";
import { fmtFcfa } from "@/data/bank/types";
import { useBank } from "@/lib/bank-store";
import { cn } from "@/lib/utils";

export default function OrcamentoPage() {
  const { state, setBudget, spendBudget } = useBank();
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const total = state.budgets.reduce((s, b) => s + b.limit, 0);
  const spent = state.budgets.reduce((s, b) => s + b.spent, 0);
  const avg = total > 0 ? Math.round((spent / total) * 100) : 0;

  function openEdit(id: string, current: number) {
    setEditId(id);
    setEditValue(String(current));
  }

  function saveEdit() {
    const v = parseInt(editValue, 10);
    if (editId && Number.isFinite(v) && v > 0) setBudget(editId, v);
    setEditId(null);
  }

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Orçamentos & controle"
        description="Limites por categoria, consumo do mês e registo de despesas em tempo real."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-ink-muted">Orçamento mensal</p>
          <p className="mt-1.5 font-display text-2xl font-bold text-ink">{fmtFcfa(total)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-ink-muted">Despesa registada</p>
          <p className="mt-1.5 font-display text-2xl font-bold text-ink">{fmtFcfa(spent)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-ink-muted">Consumo médio</p>
          <p className="mt-1.5 font-display text-2xl font-bold text-ink">{avg}%</p>
          <Progress value={avg} tone={avg > 85 ? "danger" : avg > 65 ? "gold" : "brand"} className="mt-3" ariaLabel="Consumo médio do orçamento" />
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {state.budgets.map((b) => {
          const pct = b.limit > 0 ? Math.round((b.spent / b.limit) * 100) : 0;
          return (
            <Card key={b.id} className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-sm font-semibold text-ink">{b.category}</h3>
                  <p className="text-xs text-ink-muted">Limite {fmtFcfa(b.limit)}</p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-bold tabular-nums",
                    pct >= 100 ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" : pct > 75 ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                  )}
                >
                  {pct}%
                </span>
              </div>
              <p className="mt-3 font-display text-xl font-bold text-ink">{fmtFcfa(b.spent)}</p>
              <Progress value={pct} tone={pct >= 100 ? "danger" : pct > 75 ? "gold" : "brand"} className="mt-2" ariaLabel={`Consumo da categoria ${b.category}`} />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => openEdit(b.id, b.limit)}>
                  <Target className="size-3.5" /> Ajustar limite
                </Button>
                <Button variant="ghost" size="sm" onClick={() => spendBudget(b.id, 25_000)}>
                  <Plus className="size-3.5" /> Registar despesa +25k
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="flex items-start gap-3 p-4">
        <PiggyBank className="mt-0.5 size-4 shrink-0 text-gold-600" />
        <p className="text-sm text-ink-muted">
          O registro de despesas alimenta o painel antifraude e a categorização automática dos extratos.
        </p>
      </Card>

      <ModalBudget
        open={editId !== null}
        onClose={() => setEditId(null)}
        value={editValue}
        onChange={setEditValue}
        onSave={saveEdit}
      />
    </div>
  );
}

function ModalBudget({
  open,
  onClose,
  value,
  onChange,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Ajustar limite da categoria (FCFA)">
      <input
        type="number"
        min="10000"
        step="10000"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand-400"
      />
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={onSave}>Guardar</Button>
      </div>
    </Modal>
  );
}