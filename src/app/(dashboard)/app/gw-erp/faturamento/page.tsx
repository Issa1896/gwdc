"use client";

import { useState } from "react";
import {
  Download,
  PlusCircle,
  Printer,
  QrCode,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useErp, type FaturaComercial, type ItemVenda } from "@/lib/erp-store";

export default function FaturamentoPage() {
  const { state, emitirFatura } = useErp();
  const [faturaSelecionada, setFaturaSelecionada] = useState<FaturaComercial | null>(
    state.faturas[0] || null
  );

  // Modal Nova Fatura
  const [modalNova, setModalNova] = useState(false);
  const [clienteNome, setClienteNome] = useState("");
  const [clienteNif, setClienteNif] = useState("");
  const [vencimento, setVencimento] = useState("2026-10-25");
  const [produtoId, setProdutoId] = useState(state.produtos[0]?.id || "");
  const [quantidade, setQuantidade] = useState("10");
  const [itensFatura, setItensFatura] = useState<ItemVenda[]>([]);

  const handleAdicionarItem = () => {
    const prod = state.produtos.find((p) => p.id === produtoId);
    if (!prod) return;

    const qtd = Number(quantidade) || 1;
    const item: ItemVenda = {
      produtoId: prod.id,
      sku: prod.sku,
      produtoNome: prod.nome,
      quantidade: qtd,
      precoUnitario: prod.precoUnitario,
      subtotal: prod.precoUnitario * qtd,
    };

    setItensFatura((prev) => [...prev, item]);
  };

  const handleSalvarFatura = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteNome || !clienteNif || itensFatura.length === 0) return;

    const nova = emitirFatura({
      clienteNome,
      clienteNif,
      itens: itensFatura,
      dataVencimento: vencimento,
    });

    setFaturaSelecionada(nova);
    setModalNova(false);
    setClienteNome("");
    setClienteNif("");
    setItensFatura([]);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Faturamento Comercial & Faturas com NIF
          </h2>
          <p className="text-sm text-ink-muted">
            Emissão de faturas certificadas pela Direção-Geral de Contribuições e Impostos (DGCI).
          </p>
        </div>

        <Button
          onClick={() => {
            setModalNova(true);
            setItensFatura([]);
          }}
          className="bg-amber-700 hover:bg-amber-800 text-white"
        >
          <PlusCircle className="size-4 mr-1.5" /> Emitir Nova Fatura
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Lista de Faturas (5 cols) */}
        <div className="space-y-3 lg:col-span-5">
          <div className="flex items-center justify-between text-xs text-ink-muted px-1">
            <span>Faturas Emitidas ({state.faturas.length})</span>
            <span>Totalizador B2B</span>
          </div>

          <div className="space-y-2">
            {state.faturas.map((fat) => {
              const isSelected = faturaSelecionada?.id === fat.id;
              return (
                <Card
                  key={fat.id}
                  onClick={() => setFaturaSelecionada(fat)}
                  className={`p-4 cursor-pointer transition border ${
                    isSelected
                      ? "border-amber-600 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm"
                      : "hover:border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300">
                      {fat.numero}
                    </span>
                    <Badge
                      tone={fat.status === "paga" ? "success" : "warning"}
                      className="text-[10px]"
                    >
                      {fat.status.toUpperCase()}
                    </Badge>
                  </div>

                  <h4 className="mt-1 text-xs font-semibold text-ink line-clamp-1">
                    {fat.clienteNome}
                  </h4>
                  <p className="text-[11px] text-ink-muted mt-0.5">
                    NIF: <span className="font-mono">{fat.clienteNif}</span>
                  </p>

                  <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-border-subtle">
                    <span className="text-[10px] text-ink-faint">Vence em: {fat.dataVencimento}</span>
                    <strong className="text-ink font-mono font-bold">
                      {fat.total.toLocaleString("pt-GW")} FCFA
                    </strong>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Visualizador do Documento Fiscal (7 cols) */}
        <div className="lg:col-span-7">
          {faturaSelecionada ? (
            <Card className="p-8 border-2 border-border-subtle bg-surface shadow-lg space-y-6">
              {/* Topo da Fatura */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-subtle pb-5">
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">
                    FATURA COMERCIAL
                  </h3>
                  <p className="font-mono text-sm font-bold text-amber-700 dark:text-amber-300">
                    {faturaSelecionada.numero}
                  </p>
                  <p className="text-[11px] text-ink-muted mt-1">
                    Data de Emissão: {faturaSelecionada.dataEmissao} &bull; Vencimento: {faturaSelecionada.dataVencimento}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <Badge tone={faturaSelecionada.status === "paga" ? "success" : "warning"}>
                    {faturaSelecionada.status === "paga" ? "Liquidada" : "Aguardando Pagamento"}
                  </Badge>
                  <p className="text-[10px] text-ink-faint mt-1 font-mono">DGCI Certificado ICP-GW</p>
                </div>
              </div>

              {/* Dados do Emissor e do Cliente */}
              <div className="grid gap-4 sm:grid-cols-2 text-xs rounded-lg bg-surface-raised p-4 border border-border-subtle">
                <div>
                  <p className="font-bold text-ink uppercase text-[10px] text-ink-faint">Emissor</p>
                  <p className="font-semibold text-ink mt-0.5">GW Digital Company Enterprise Lda</p>
                  <p className="text-ink-muted">Avenida Amílcar Cabral, Bissau</p>
                  <p className="text-ink-muted font-mono">NIF: 500192834</p>
                </div>

                <div>
                  <p className="font-bold text-ink uppercase text-[10px] text-ink-faint">Cliente (Adquirente)</p>
                  <p className="font-semibold text-ink mt-0.5">{faturaSelecionada.clienteNome}</p>
                  <p className="text-ink-muted font-mono">NIF: {faturaSelecionada.clienteNif}</p>
                  <p className="text-ink-muted">República da Guiné-Bissau</p>
                </div>
              </div>

              {/* Tabela de Itens */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-ink uppercase text-ink-faint">Discriminação das Mercadorias</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border-subtle text-ink-muted">
                        <th className="pb-2 font-medium">Descrição</th>
                        <th className="pb-2 font-medium text-center">Qtd</th>
                        <th className="pb-2 font-medium text-right">Preço Unit.</th>
                        <th className="pb-2 font-medium text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {faturaSelecionada.itens.map((it, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 font-medium text-ink">{it.produtoNome}</td>
                          <td className="py-2.5 text-center font-mono">{it.quantidade}</td>
                          <td className="py-2.5 text-right font-mono">
                            {it.precoUnitario.toLocaleString("pt-GW")}
                          </td>
                          <td className="py-2.5 text-right font-mono font-semibold text-ink">
                            {it.subtotal.toLocaleString("pt-GW")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totais com IVA */}
              <div className="border-t border-border-subtle pt-4 space-y-1.5 text-xs text-right">
                <div className="flex justify-end gap-6 text-ink-muted">
                  <span>Subtotal:</span>
                  <span className="font-mono w-28 font-medium">
                    {faturaSelecionada.subtotal.toLocaleString("pt-GW")} FCFA
                  </span>
                </div>
                <div className="flex justify-end gap-6 text-ink-muted">
                  <span>IVA (15%):</span>
                  <span className="font-mono w-28 font-medium">
                    {faturaSelecionada.iva.toLocaleString("pt-GW")} FCFA
                  </span>
                </div>
                <div className="flex justify-end gap-6 text-base font-bold text-ink pt-1 border-t border-border-subtle">
                  <span>Total Geral:</span>
                  <span className="font-mono w-28 text-amber-700 dark:text-amber-300">
                    {faturaSelecionada.total.toLocaleString("pt-GW")} FCFA
                  </span>
                </div>
              </div>

              {/* QR Code e Assinatura */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-subtle pt-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="grid size-14 place-items-center rounded bg-white text-black p-1 border">
                    <QrCode className="size-12" />
                  </div>
                  <div>
                    <span className="font-bold text-ink text-[11px]">Selo de Autenticidade Fiscal</span>
                    <p className="text-[10px] text-ink-muted">Comprovante eletrônico registrado na DGCI</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="text-xs gap-1"
                  >
                    <Printer className="size-3.5" /> Imprimir
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => alert(`Fatura ${faturaSelecionada.numero} baixada.`)}
                    className="bg-amber-700 hover:bg-amber-800 text-white text-xs gap-1"
                  >
                    <Download className="size-3.5" /> Exportar PDF
                  </Button>
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      </div>

      {/* Modal Nova Fatura */}
      {modalNova && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="font-display text-base font-bold text-ink">Emitir Fatura Comercial</h3>
              <button onClick={() => setModalNova(false)} className="text-xs text-ink-muted hover:text-ink">
                Cancelar
              </button>
            </div>

            <form onSubmit={handleSalvarFatura} className="space-y-4 text-xs">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-semibold text-ink">Razão Social / Nome do Cliente</label>
                  <Input
                    required
                    placeholder="Ex: Comercial Guineense Lda"
                    value={clienteNome}
                    onChange={(e) => setClienteNome(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink">NIF do Cliente</label>
                  <Input
                    required
                    placeholder="Ex: 510928374"
                    value={clienteNif}
                    onChange={(e) => setClienteNif(e.target.value)}
                    className="mt-1 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-ink">Data de Vencimento</label>
                <Input
                  type="date"
                  required
                  value={vencimento}
                  onChange={(e) => setVencimento(e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Seletor de Itens */}
              <div className="rounded-lg border border-border-subtle p-3 space-y-3 bg-surface-raised">
                <p className="font-semibold text-ink">Adicionar Mercadoria à Fatura</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <select
                      value={produtoId}
                      onChange={(e) => setProdutoId(e.target.value)}
                      className="w-full rounded-lg border border-border-subtle bg-surface p-2 text-xs text-ink"
                    >
                      {state.produtos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nome} — {p.precoUnitario.toLocaleString("pt-GW")} FCFA
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={1}
                      value={quantidade}
                      onChange={(e) => setQuantidade(e.target.value)}
                      className="w-20"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAdicionarItem}
                      className="bg-amber-700 hover:bg-amber-800 text-white"
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>

                {itensFatura.length > 0 && (
                  <div className="divide-y divide-border-subtle border-t border-border-subtle pt-2">
                    {itensFatura.map((item, i) => (
                      <div key={i} className="flex justify-between py-1 text-[11px]">
                        <span>
                          {item.quantidade}x {item.produtoNome}
                        </span>
                        <strong className="font-mono">
                          {item.subtotal.toLocaleString("pt-GW")} FCFA
                        </strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalNova(false)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={itensFatura.length === 0}
                  className="bg-amber-700 hover:bg-amber-800 text-white"
                >
                  Concluir Emissão com NIF
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
