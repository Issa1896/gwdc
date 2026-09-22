"use client";

import { useState } from "react";
import {
  CreditCard,
  DollarSign,
  Minus,
  Plus,
  Printer,
  QrCode,
  Search,
  ShoppingCart,
  Smartphone,
  Store,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useErp, type ItemVenda, type VendaPOS } from "@/lib/erp-store";

export default function PosTerminalPage() {
  const { state, realizarVendaPOS } = useErp();

  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("todas");
  const [busca, setBusca] = useState("");

  // Carrinho de Compras
  const [carrinho, setCarrinho] = useState<ItemVenda[]>([]);
  const [desconto, setDesconto] = useState<number>(0);

  // Modal de Pagamento
  const [modalPagamento, setModalPagamento] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState<VendaPOS["formaPagamento"]>("dinheiro");
  const [valorRecebido, setValorRecebido] = useState<string>("");
  const [vendaConcluida, setVendaConcluida] = useState<VendaPOS | null>(null);

  const subtotal = carrinho.reduce((acc, it) => acc + it.subtotal, 0);
  const totalPagar = Math.max(0, subtotal - desconto);

  const produtosFiltrados = state.produtos.filter((p) => {
    const matchCat = categoriaAtiva === "todas" || p.categoria === categoriaAtiva;
    const matchBusca =
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.sku.toLowerCase().includes(busca.toLowerCase());
    return matchCat && matchBusca;
  });

  const handleAdicionarItem = (prodId: string) => {
    const prod = state.produtos.find((p) => p.id === prodId);
    if (!prod || prod.estoqueTotal <= 0) return;

    setCarrinho((prev) => {
      const existe = prev.find((item) => item.produtoId === prodId);
      if (existe) {
        if (existe.quantidade >= prod.estoqueTotal) return prev; // Limite de estoque
        return prev.map((item) =>
          item.produtoId === prodId
            ? {
                ...item,
                quantidade: item.quantidade + 1,
                subtotal: (item.quantidade + 1) * item.precoUnitario,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          produtoId: prod.id,
          sku: prod.sku,
          produtoNome: prod.nome,
          quantidade: 1,
          precoUnitario: prod.precoUnitario,
          subtotal: prod.precoUnitario,
        },
      ];
    });
  };

  const handleAlterarQtd = (prodId: string, delta: number) => {
    setCarrinho((prev) => {
      return prev
        .map((item) => {
          if (item.produtoId !== prodId) return item;
          const novaQtd = item.quantidade + delta;
          if (novaQtd <= 0) return null;
          return {
            ...item,
            quantidade: novaQtd,
            subtotal: novaQtd * item.precoUnitario,
          };
        })
        .filter(Boolean) as ItemVenda[];
    });
  };

  const handleRemoverItem = (prodId: string) => {
    setCarrinho((prev) => prev.filter((item) => item.produtoId !== prodId));
  };

  const handleAbrirPagamento = () => {
    if (carrinho.length === 0) return;
    setValorRecebido(String(totalPagar));
    setModalPagamento(true);
  };

  const handleFinalizarVenda = (e: React.FormEvent) => {
    e.preventDefault();
    const recebido = Number(valorRecebido) || totalPagar;
    if (recebido < totalPagar) return;

    const venda = realizarVendaPOS({
      itens: carrinho,
      desconto,
      formaPagamento,
      valorRecebido: recebido,
      operador: state.caixaAtual.operador,
    });

    setVendaConcluida(venda);
    setCarrinho([]);
    setDesconto(0);
    setModalPagamento(false);
  };

  const trocoCalculado = Math.max(0, (Number(valorRecebido) || 0) - totalPagar);

  return (
    <div className="space-y-4">
      {/* Grid Principal: Catálogo Visual (7 cols) + Carrinho / Caixa (5 cols) */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Coluna do Catálogo (7 cols) */}
        <div className="space-y-3 lg:col-span-7">
          {/* Barra de Busca e Categorias */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-faint" />
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Digitar nome do produto, SKU ou bipar leitor..."
                className="pl-9 h-10 text-xs"
              />
            </div>
          </div>

          {/* Filtros de Categoria em Botões Táteis */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {["todas", "Alimentos", "Bebidas", "Agrícola", "Construção", "Higiene"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoriaAtiva(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
                  categoriaAtiva === cat
                    ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                    : "bg-surface border-border-subtle text-ink-muted hover:bg-surface-raised"
                }`}
              >
                {cat === "todas" ? "Todos os Itens" : cat}
              </button>
            ))}
          </div>

          {/* Grid de Produtos Táteis */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[640px] overflow-y-auto pr-1">
            {produtosFiltrados.map((prod) => {
              const semEstoque = prod.estoqueTotal <= 0;
              return (
                <button
                  key={prod.id}
                  disabled={semEstoque}
                  onClick={() => handleAdicionarItem(prod.id)}
                  className={`flex flex-col justify-between text-left p-3.5 rounded-xl border bg-surface transition shadow-xs ${
                    semEstoque
                      ? "opacity-40 cursor-not-allowed border-border-subtle"
                      : "hover:border-pink-500 hover:shadow-md active:scale-[0.98]"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-ink-faint font-semibold uppercase">
                      {prod.sku}
                    </span>
                    <h4 className="text-xs font-bold text-ink line-clamp-2 leading-tight">
                      {prod.nome}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2 border-t border-border-subtle flex items-end justify-between">
                    <div>
                      <span className="text-[10px] text-ink-muted block">Preço</span>
                      <span className="text-xs font-extrabold text-pink-600 dark:text-pink-400 font-mono">
                        {prod.precoUnitario.toLocaleString("pt-GW")} FCFA
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-ink-muted">
                      Est: {prod.estoqueTotal}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Coluna do Carrinho & Checkout (5 cols) */}
        <div className="space-y-3 lg:col-span-5">
          <Card className="p-4 flex flex-col h-full min-h-[580px] justify-between border-2 border-border-subtle">
            <div className="space-y-3">
              {/* Header do Carrinho */}
              <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="size-4 text-pink-600" />
                  <h3 className="font-display text-sm font-bold text-ink">Cupom Fiscal em Aberto</h3>
                </div>
                {carrinho.length > 0 && (
                  <button
                    onClick={() => setCarrinho([])}
                    className="text-[11px] text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="size-3" /> Limpar
                  </button>
                )}
              </div>

              {/* Lista de Itens no Carrinho */}
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {carrinho.length === 0 ? (
                  <div className="p-10 text-center text-ink-muted">
                    <Store className="size-10 mx-auto text-ink-faint mb-2" />
                    <p className="text-xs font-medium">Nenhum item no carrinho.</p>
                    <p className="text-[10px] text-ink-faint mt-0.5">
                      Toque nos produtos ao lado para iniciar a venda.
                    </p>
                  </div>
                ) : (
                  carrinho.map((it) => (
                    <div
                      key={it.produtoId}
                      className="flex items-center justify-between p-2 rounded-lg bg-surface-raised border border-border-subtle text-xs"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="font-semibold text-ink truncate">{it.produtoNome}</p>
                        <p className="text-[10px] text-ink-muted font-mono">
                          {it.precoUnitario.toLocaleString("pt-GW")} FCFA &times; {it.quantidade}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-surface rounded border border-border-subtle p-0.5">
                          <button
                            onClick={() => handleAlterarQtd(it.produtoId, -1)}
                            className="grid size-5 place-items-center text-ink-muted hover:bg-surface-raised rounded"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="font-mono font-bold px-1">{it.quantidade}</span>
                          <button
                            onClick={() => handleAlterarQtd(it.produtoId, 1)}
                            className="grid size-5 place-items-center text-ink-muted hover:bg-surface-raised rounded"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>

                        <span className="font-mono font-bold text-ink w-16 text-right">
                          {it.subtotal.toLocaleString("pt-GW")}
                        </span>

                        <button
                          onClick={() => handleRemoverItem(it.produtoId)}
                          className="text-ink-faint hover:text-rose-600 ml-1"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Rodapé do Caixa: Subtotal, Desconto e Total */}
            <div className="border-t border-border-subtle pt-3 space-y-2">
              <div className="flex justify-between text-xs text-ink-muted">
                <span>Subtotal ({carrinho.reduce((a, b) => a + b.quantidade, 0)} itens):</span>
                <span className="font-mono font-semibold">{subtotal.toLocaleString("pt-GW")} FCFA</span>
              </div>

              <div className="flex justify-between items-center text-xs text-ink-muted">
                <span>Desconto Promocional:</span>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={0}
                    value={desconto}
                    onChange={(e) => setDesconto(Math.max(0, Number(e.target.value) || 0))}
                    className="w-24 h-7 text-right font-mono text-xs"
                  />
                  <span className="text-[10px]">FCFA</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline border-t border-border-subtle pt-2">
                <span className="text-sm font-bold text-ink">Total a Pagar:</span>
                <span className="font-display text-2xl font-extrabold text-pink-600 dark:text-pink-400 font-mono">
                  {totalPagar.toLocaleString("pt-GW")} FCFA
                </span>
              </div>

              <Button
                size="lg"
                disabled={carrinho.length === 0}
                onClick={handleAbrirPagamento}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold h-12 text-sm shadow-md mt-2"
              >
                Cobrar & Fechar Venda &rarr;
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de Pagamento & Troco */}
      {modalPagamento && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-ink">Recebimento da Venda</h3>
                <p className="text-xs text-ink-muted">Escolha a forma de liquidação</p>
              </div>
              <button onClick={() => setModalPagamento(false)} className="text-xs text-ink-muted hover:text-ink">
                Cancelar
              </button>
            </div>

            <form onSubmit={handleFinalizarVenda} className="space-y-4">
              {/* Valor Total em Destaque */}
              <div className="rounded-xl bg-pink-500/10 p-3 text-center border border-pink-500/20">
                <span className="text-xs text-pink-800 dark:text-pink-200 uppercase font-semibold">
                  Valor Total Devido
                </span>
                <p className="font-display text-2xl font-extrabold text-pink-700 dark:text-pink-300 font-mono">
                  {totalPagar.toLocaleString("pt-GW")} FCFA
                </p>
              </div>

              {/* Formas de Pagamento */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setFormaPagamento("dinheiro")}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border font-semibold transition ${
                    formaPagamento === "dinheiro"
                      ? "border-pink-600 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300"
                      : "border-border-subtle bg-surface text-ink-muted hover:bg-surface-raised"
                  }`}
                >
                  <DollarSign className="size-4 text-emerald-600" /> Dinheiro Físico
                </button>

                <button
                  type="button"
                  onClick={() => setFormaPagamento("gw-pay")}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border font-semibold transition ${
                    formaPagamento === "gw-pay"
                      ? "border-pink-600 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300"
                      : "border-border-subtle bg-surface text-ink-muted hover:bg-surface-raised"
                  }`}
                >
                  <QrCode className="size-4 text-purple-600" /> GW Pay (QR)
                </button>

                <button
                  type="button"
                  onClick={() => setFormaPagamento("orange-money")}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border font-semibold transition ${
                    formaPagamento === "orange-money"
                      ? "border-pink-600 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300"
                      : "border-border-subtle bg-surface text-ink-muted hover:bg-surface-raised"
                  }`}
                >
                  <Smartphone className="size-4 text-amber-600" /> Orange / MTN
                </button>

                <button
                  type="button"
                  onClick={() => setFormaPagamento("cartao")}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border font-semibold transition ${
                    formaPagamento === "cartao"
                      ? "border-pink-600 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300"
                      : "border-border-subtle bg-surface text-ink-muted hover:bg-surface-raised"
                  }`}
                >
                  <CreditCard className="size-4 text-sky-600" /> Cartão Bancário
                </button>
              </div>

              {/* Campo de Valor Recebido e Troco para Dinheiro */}
              {formaPagamento === "dinheiro" ? (
                <div className="space-y-2 rounded-lg bg-surface-raised p-3 border border-border-subtle text-xs">
                  <div>
                    <label className="font-semibold text-ink">Valor Recebido do Cliente (FCFA)</label>
                    <Input
                      type="number"
                      required
                      min={totalPagar}
                      value={valorRecebido}
                      onChange={(e) => setValorRecebido(e.target.value)}
                      className="mt-1 font-mono text-base font-bold text-ink"
                    />
                  </div>

                  <div className="flex justify-between items-baseline pt-1">
                    <span className="font-semibold text-ink">Troco a Devolver:</span>
                    <span className="font-mono text-lg font-extrabold text-emerald-600">
                      {trocoCalculado.toLocaleString("pt-GW")} FCFA
                    </span>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-surface-raised p-4 border border-border-subtle text-xs text-center space-y-2">
                  <QrCode className="size-16 mx-auto text-pink-600" />
                  <p className="font-bold text-ink">Aponte o app para pagar via {formaPagamento.toUpperCase()}</p>
                  <p className="text-[10px] text-ink-muted font-mono">
                    Chave PIX/GW: 245-955-0102 &bull; Total: {totalPagar.toLocaleString("pt-GW")} FCFA
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold h-11 text-xs"
              >
                Confirmar Recebimento & Emitir Cupom
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Recibo / Talão da Venda Concluída */}
      {vendaConcluida && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-sm p-6 space-y-4 bg-white text-black shadow-2xl font-mono text-xs">
            <div className="text-center space-y-1 border-b pb-3">
              <h4 className="font-bold text-sm tracking-wider uppercase">GW DIGITAL STORE</h4>
              <p className="text-[10px] text-zinc-600">MERCADO DE BANDIM &bull; BISSAU</p>
              <p className="text-[9px] text-zinc-500 font-bold">NIF: 500192834 &bull; CUPOM FISCAL ELETRÔNICO</p>
              <p className="font-bold text-xs pt-1">{vendaConcluida.numeroCupom}</p>
              <p className="text-[10px] text-zinc-500">{vendaConcluida.data}</p>
            </div>

            <div className="divide-y text-[11px]">
              {vendaConcluida.itens.map((it, idx) => (
                <div key={idx} className="py-1.5 flex justify-between">
                  <div>
                    <p className="font-bold">{it.produtoNome}</p>
                    <p className="text-[9px] text-zinc-600">
                      {it.quantidade} x {it.precoUnitario.toLocaleString("pt-GW")} FCFA
                    </p>
                  </div>
                  <strong className="text-right">{it.subtotal.toLocaleString("pt-GW")}</strong>
                </div>
              ))}
            </div>

            <div className="border-t pt-2 space-y-1 text-right text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal:</span>
                <span>{vendaConcluida.subtotal.toLocaleString("pt-GW")} FCFA</span>
              </div>
              {vendaConcluida.desconto > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Desconto:</span>
                  <span>-{vendaConcluida.desconto.toLocaleString("pt-GW")} FCFA</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold border-t pt-1">
                <span>TOTAL PAGO:</span>
                <span>{vendaConcluida.total.toLocaleString("pt-GW")} FCFA</span>
              </div>
              <div className="flex justify-between text-zinc-600 text-[10px]">
                <span>Forma: {vendaConcluida.formaPagamento.toUpperCase()}</span>
                {vendaConcluida.troco > 0 && (
                  <span>Troco: {vendaConcluida.troco.toLocaleString("pt-GW")} FCFA</span>
                )}
              </div>
            </div>

            {/* QR Code de Autenticação */}
            <div className="text-center pt-2 border-t">
              <div className="grid size-16 place-items-center mx-auto border p-1 bg-white">
                <QrCode className="size-14" />
              </div>
              <p className="text-[9px] text-zinc-500 mt-1">
                Autenticado pela DGCI Guiné-Bissau
              </p>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="w-full text-xs text-black border-zinc-300"
              >
                <Printer className="size-3.5 mr-1" /> Imprimir
              </Button>
              <Button
                size="sm"
                onClick={() => setVendaConcluida(null)}
                className="w-full bg-black text-white text-xs hover:bg-zinc-800"
              >
                Nova Venda
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
