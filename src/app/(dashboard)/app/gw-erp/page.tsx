"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Boxes,
  Briefcase,
  Receipt,
  ShoppingCart,
  Store,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useErp } from "@/lib/erp-store";

export default function ErpDashboardPage() {
  const { state } = useErp();

  const totalProdutos = state.produtos.length;
  const valorTotalEstoque = state.produtos.reduce(
    (acc, p) => acc + p.estoqueTotal * p.precoUnitario,
    0
  );
  const totalFaturado = state.faturas.reduce((acc, f) => acc + f.total, 0);
  const produtosCriticos = state.produtos.filter(
    (p) => p.estoqueTotal <= p.estoqueMinimo
  );
  const vendasHoje = state.vendas.length;
  const faturamentoPOSHoje = state.vendas.reduce((acc, v) => acc + v.total, 0);

  return (
    <div className="space-y-6">
      {/* Banner Principal ERP */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-950 via-orange-950 to-stone-900 p-6 text-white shadow-xl sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold tracking-wide text-amber-200 backdrop-blur-md">
            <Briefcase className="size-3.5 text-amber-300" /> Gestão Operacional Integrada
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            GW ERP — Retaguarda Empresarial da Guiné-Bissau
          </h2>
          <p className="text-sm text-amber-100/90 sm:text-base">
            Controle de inventário multicentro em Bissau e províncias, emissão de faturas com NIF guineense e sincronização em tempo real com o GW POS.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/app/gw-erp/estoque">
              <Button className="bg-white text-amber-950 hover:bg-amber-50">
                <Boxes className="size-4" /> Gerenciar Estoque
              </Button>
            </Link>
            <Link href="/app/gw-erp/faturamento">
              <Button variant="outline" className="border-amber-400/40 text-white hover:bg-amber-900/50">
                <Receipt className="size-4" /> Emitir Fatura Comercial
              </Button>
            </Link>
            <Link href="/app/gw-pos">
              <Button variant="outline" className="border-amber-400/40 text-white hover:bg-amber-900/50">
                <Store className="size-4" /> Abrir Frente de Caixa (POS)
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Indicadores Principais */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-muted">Valor em Estoque</p>
            <span className="grid size-9 place-items-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Boxes className="size-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">
              {(valorTotalEstoque / 1000000).toFixed(1)}M
            </span>
            <span className="text-xs font-semibold text-ink-muted">FCFA</span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">{totalProdutos} itens catalogados</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-muted">Vendas no POS Hoje</p>
            <span className="grid size-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <ShoppingCart className="size-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">
              {faturamentoPOSHoje.toLocaleString("pt-GW")}
            </span>
            <span className="text-xs font-semibold text-emerald-600">FCFA</span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">{vendasHoje} cupons emitidos</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-muted">Faturamento B2B</p>
            <span className="grid size-9 place-items-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
              <Receipt className="size-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">
              {(totalFaturado / 1000).toFixed(0)}k
            </span>
            <span className="text-xs font-semibold text-ink-muted">FCFA</span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">{state.faturas.length} faturas emitidas</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink-muted">Alertas de Reposição</p>
            <span className="grid size-9 place-items-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <AlertTriangle className="size-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ink">
              {produtosCriticos.length}
            </span>
            <Badge tone={produtosCriticos.length > 0 ? "danger" : "success"} className="text-[10px]">
              {produtosCriticos.length > 0 ? "Estoque Baixo" : "Normal"}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-ink-muted">Abaixo da margem de segurança</p>
        </Card>
      </div>

      {/* Grid: Produtos mais movimentados e últimas vendas */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Inventário e Centros de Distribuição */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-ink">Estoque nos Armazéns</h3>
            <Link href="/app/gw-erp/estoque" className="text-xs font-medium text-amber-600 hover:underline">
              Ver inventário completo &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {state.produtos.slice(0, 5).map((prod) => (
              <Card key={prod.id} className="p-4 transition hover:border-amber-500/40">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300">
                        {prod.sku}
                      </span>
                      <Badge tone="warning" className="text-[10px]">
                        {prod.categoria}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-semibold text-ink">{prod.nome}</h4>
                    <div className="flex flex-wrap gap-2 text-[11px] text-ink-muted">
                      {prod.almoxarifados.map((a) => (
                        <span key={a.nome} className="rounded bg-surface-raised px-1.5 py-0.5 border border-border-subtle">
                          {a.nome.split(" - ")[0]}: <strong>{a.quantidade}</strong> {prod.unidade}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-1 sm:items-end">
                    <span className="text-sm font-bold text-ink">
                      {prod.precoUnitario.toLocaleString("pt-GW")} FCFA
                    </span>
                    <span className="text-[11px] text-ink-muted">
                      Total: <strong>{prod.estoqueTotal}</strong> {prod.unidade}
                    </span>
                    {prod.estoqueTotal <= prod.estoqueMinimo && (
                      <span className="text-[10px] text-rose-600 font-semibold flex items-center gap-1">
                        <AlertTriangle className="size-3" /> Reposição Necessária
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Últimas Transações POS */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-ink">Últimas Vendas POS</h3>
              <Link href="/app/gw-pos" className="text-xs font-medium text-amber-600 hover:underline">
                Ir ao Caixa
              </Link>
            </div>

            <div className="space-y-3">
              {state.vendas.slice(0, 4).map((venda) => (
                <Card key={venda.id} className="p-4 border-l-4 border-l-amber-600">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300">
                      {venda.numeroCupom}
                    </span>
                    <Badge tone="success" className="text-[10px]">
                      {venda.formaPagamento.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-ink font-semibold">
                    {venda.total.toLocaleString("pt-GW")} FCFA
                  </p>
                  <p className="text-[11px] text-ink-muted mt-0.5">
                    {venda.itens.length} {venda.itens.length === 1 ? "item" : "itens"} &bull; Op: {venda.operador}
                  </p>
                  <p className="text-[10px] text-ink-faint mt-1 font-mono">{venda.data}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Atalho Frente de Caixa */}
          <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/20 border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <Store className="size-5 text-amber-600" />
              <h4 className="text-sm font-bold text-ink">Terminal GW POS Integrado</h4>
            </div>
            <p className="text-xs text-ink-muted">
              Abra a frente de caixa rápida para vendas no balcão com leitor tátil e baixa imediata no estoque.
            </p>
            <Link href="/app/gw-pos">
              <Button className="w-full bg-amber-700 hover:bg-amber-800 text-white text-xs">
                Acessar Ponto de Venda &rarr;
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
