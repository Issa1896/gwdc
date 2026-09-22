"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  Lock,
  Printer,
  QrCode,
  Smartphone,
  Store,
  Unlock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useErp } from "@/lib/erp-store";

export default function ControleCaixaPage() {
  const { state, abrirCaixa, fecharCaixa } = useErp();
  const { caixaAtual } = state;

  const [modalAbrir, setModalAbrir] = useState(false);
  const [saldoInicial, setSaldoInicial] = useState("50000");
  const [operadorNome, setOperadorNome] = useState(caixaAtual.operador || "Maria Francisca Có");
  const [sucessoMsg, setSucessoMsg] = useState("");

  const handleAbrir = (e: React.FormEvent) => {
    e.preventDefault();
    abrirCaixa(Number(saldoInicial) || 0, operadorNome);
    setModalAbrir(false);
    setSucessoMsg("Turno de caixa aberto com sucesso!");
    setTimeout(() => setSucessoMsg(""), 5000);
  };

  const handleFechar = () => {
    if (confirm("Deseja realmente encerrar a sessão do caixa do dia?")) {
      fecharCaixa();
      setSucessoMsg("Caixa encerrado com sucesso! Relatório gerado.");
      setTimeout(() => setSucessoMsg(""), 5000);
    }
  };

  const totalGeralGaveta = caixaAtual.saldoInicial + caixaAtual.totalDinheiro;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/app/gw-pos">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="size-4" /> Voltar ao PDV
            </Button>
          </Link>
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              Controle de Turno & Fechamento de Caixa
            </h2>
            <p className="text-sm text-ink-muted">
              Conciliação de numerário em dinheiro, recebimentos via GW Pay e Mobile Money.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {caixaAtual.status === "aberto" ? (
            <Button
              onClick={handleFechar}
              variant="outline"
              className="border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950/30 text-xs"
            >
              <Lock className="size-3.5 mr-1" /> Encerrar Turno do Caixa
            </Button>
          ) : (
            <Button
              onClick={() => setModalAbrir(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
            >
              <Unlock className="size-3.5 mr-1" /> Abrir Novo Turno
            </Button>
          )}
        </div>
      </div>

      {sucessoMsg && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
          <CheckCircle2 className="size-4" />
          <span>{sucessoMsg}</span>
        </div>
      )}

      {/* Cartão de Status do Caixa */}
      <Card className="p-6 border-2 border-border-subtle bg-surface shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-subtle pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`grid size-12 place-items-center rounded-xl text-white ${
                caixaAtual.status === "aberto" ? "bg-emerald-600" : "bg-rose-600"
              }`}
            >
              <Store className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-ink">
                  Caixa Principal &bull; Mercado de Bandim
                </h3>
                <Badge tone={caixaAtual.status === "aberto" ? "success" : "danger"}>
                  {caixaAtual.status === "aberto" ? "Turno Ativo" : "Caixa Encerrado"}
                </Badge>
              </div>
              <p className="text-xs text-ink-muted mt-0.5">
                Operador: <strong>{caixaAtual.operador}</strong> &bull; Abertura: {caixaAtual.abertoEm}
                {caixaAtual.fechadoEm && ` &bull; Fechado: ${caixaAtual.fechadoEm}`}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-ink-muted block">Total Vendido no Turno</span>
            <span className="font-display text-2xl font-extrabold text-pink-600 dark:text-pink-400 font-mono">
              {caixaAtual.totalVendas.toLocaleString("pt-GW")} FCFA
            </span>
          </div>
        </div>

        {/* Breakdown por Forma de Pagamento */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Dinheiro */}
          <div className="rounded-xl border border-border-subtle bg-surface-raised p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <DollarSign className="size-4 text-emerald-600" /> Dinheiro em Espécie
              </span>
              <Badge tone="success" className="text-[10px]">Na Gaveta</Badge>
            </div>
            <p className="font-display text-xl font-bold text-ink font-mono">
              {caixaAtual.totalDinheiro.toLocaleString("pt-GW")} FCFA
            </p>
            <p className="text-[10px] text-ink-muted">
              Fundo inicial: {caixaAtual.saldoInicial.toLocaleString("pt-GW")} FCFA
            </p>
          </div>

          {/* GW Pay */}
          <div className="rounded-xl border border-border-subtle bg-surface-raised p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <QrCode className="size-4 text-purple-600" /> GW Pay (Instantâneo)
              </span>
              <Badge tone="navy" className="text-[10px]">Conta GW</Badge>
            </div>
            <p className="font-display text-xl font-bold text-ink font-mono">
              {caixaAtual.totalGwPay.toLocaleString("pt-GW")} FCFA
            </p>
            <p className="text-[10px] text-ink-muted">Liquidado direto no GW Bank</p>
          </div>

          {/* Mobile Money */}
          <div className="rounded-xl border border-border-subtle bg-surface-raised p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <Smartphone className="size-4 text-amber-600" /> Orange / MTN Money
              </span>
              <Badge tone="warning" className="text-[10px]">Mobile Money</Badge>
            </div>
            <p className="font-display text-xl font-bold text-ink font-mono">
              {caixaAtual.totalMobileMoney.toLocaleString("pt-GW")} FCFA
            </p>
            <p className="text-[10px] text-ink-muted">Carteiras móveis integradas</p>
          </div>
        </div>

        {/* Resumo Final de Gaveta */}
        <div className="rounded-xl bg-amber-500/10 p-4 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-amber-900 dark:text-amber-200">
              Total Físico Esperado na Gaveta:
            </span>
            <p className="text-ink-muted text-[11px]">
              Saldo Inicial ({caixaAtual.saldoInicial.toLocaleString("pt-GW")}) + Vendas em Dinheiro ({caixaAtual.totalDinheiro.toLocaleString("pt-GW")})
            </p>
          </div>

          <span className="font-mono text-xl font-extrabold text-amber-900 dark:text-amber-200">
            {totalGeralGaveta.toLocaleString("pt-GW")} FCFA
          </span>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="text-xs gap-1.5"
          >
            <Printer className="size-3.5" /> Imprimir Fechamento de Caixa
          </Button>
        </div>
      </Card>

      {/* Modal Abertura de Caixa */}
      {modalAbrir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="font-display text-base font-bold text-ink">Abertura de Turno de Caixa</h3>
              <button onClick={() => setModalAbrir(false)} className="text-xs text-ink-muted hover:text-ink">
                Cancelar
              </button>
            </div>

            <form onSubmit={handleAbrir} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-ink">Operador Responsável</label>
                <Input
                  required
                  value={operadorNome}
                  onChange={(e) => setOperadorNome(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-ink">Fundo de Caixa / Troco Inicial (FCFA)</label>
                <Input
                  type="number"
                  required
                  min={0}
                  value={saldoInicial}
                  onChange={(e) => setSaldoInicial(e.target.value)}
                  className="mt-1 font-mono font-bold"
                />
                <p className="mt-1 text-[10px] text-ink-muted">
                  Valor em cédulas e moedas físicas disponível para troco na abertura.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalAbrir(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Confirmar Abertura
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
