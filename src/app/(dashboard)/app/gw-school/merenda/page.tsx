"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Apple,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MinusCircle,
  Package,
  ShieldCheck,
  Utensils,
} from "lucide-react";
import { useSchoolBusiness } from "@/lib/school-business-store";
import { Badge } from "@/components/ui/badge";

export default function MerendaPage() {
  const { state, registrarConsumoMerenda } = useSchoolBusiness();
  const [consumoQuantidades, setConsumoQuantidades] = useState<Record<string, number>>({});
  const [notificacao, setNotificacao] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotificacao(msg);
    setTimeout(() => setNotificacao(null), 3000);
  };

  const handleBaixaConsumo = (itemId: string, nomeAlimento: string) => {
    const qtd = consumoQuantidades[itemId] || 1;
    registrarConsumoMerenda(itemId, qtd);
    showNotification(`Consumo de ${qtd} registrado para ${nomeAlimento}.`);
    setConsumoQuantidades((prev) => ({ ...prev, [itemId]: 1 }));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Alert */}
      {notificacao && (
        <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/90 px-4 py-3 text-sm text-emerald-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-400" />
          <span>{notificacao}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Link href="/app/gw-school" className="hover:underline flex items-center gap-1">
            <ArrowLeft className="size-3.5" /> Painel da Escola
          </Link>
        </div>
        <h1 className="mt-1 text-2xl font-extrabold text-ink flex items-center gap-2">
          <Apple className="size-6 text-emerald-600" />
          Programa Nacional de Merenda Escolar (PNAE)
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          Monitoramento nutricional, segurança alimentar infantil e controle de suprimentos do Programa Alimentar Mundial (PAM/WFP).
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Utensils className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Refeições Servidas / Dia</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-ink">480 Refeições</p>
          <p className="text-[11px] text-ink-muted">100% dos alunos alimentados no turno matutino e vespertino</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Clock className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Autonomia Média</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-ink">~23 Dias</p>
          <p className="text-[11px] text-ink-muted">Suprimento seguro até a próxima remessa</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Produção Local</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">65%</p>
          <p className="text-[11px] text-ink-muted">Arroz de Bafatá e peixe do arquipélago dos Bijagós</p>
        </div>
      </div>

      {/* Inventory Items Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-ink flex items-center gap-2">
          <Package className="size-4 text-indigo-600" />
          Estoque em Armazém Escolar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.itensMerenda.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm space-y-3 hover:border-indigo-500/40 transition"
            >
              <div className="flex items-center justify-between">
                <Badge tone="neutral" className="text-[10px]">
                  {item.origem}
                </Badge>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {item.diasRestantes} dias restantes
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-ink">{item.alimento}</h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Consumo médio diário: {item.consumoDiarioEstimado} {item.unidade}/dia
                </p>
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-ink-faint uppercase font-semibold">Saldo Atual</span>
                  <p className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {item.quantidadeEstoque} {item.unidade}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={item.quantidadeEstoque}
                    value={consumoQuantidades[item.id] ?? 1}
                    onChange={(e) =>
                      setConsumoQuantidades({
                        ...consumoQuantidades,
                        [item.id]: Number(e.target.value),
                      })
                    }
                    className="w-16 rounded-xl border border-border-subtle bg-surface-ground py-1.5 px-2 text-xs font-mono text-center text-ink focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleBaixaConsumo(item.id, item.alimento)}
                    disabled={item.quantidadeEstoque <= 0}
                    className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition disabled:opacity-50"
                  >
                    <MinusCircle className="size-3.5" /> Registrar Saída
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
