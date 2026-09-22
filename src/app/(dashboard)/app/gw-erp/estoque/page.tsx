"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Filter,
  Minus,
  Plus,
  PlusCircle,
  Search,
  Warehouse,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useErp, type CategoriaProduto, type ProdutoEstoque } from "@/lib/erp-store";

export default function EstoquePage() {
  const { state, adicionarProduto, ajustarEstoque } = useErp();
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todas");

  // Modal Novo Produto
  const [modalNovo, setModalNovo] = useState(false);
  const [sku, setSku] = useState("");
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<CategoriaProduto>("Alimentos");
  const [preco, setPreco] = useState("10000");
  const [custo, setCusto] = useState("7000");
  const [estoqueInicial, setEstoqueInicial] = useState("50");
  const [unidade, setUnidade] = useState<ProdutoEstoque["unidade"]>("un");
  const [sucessoMsg, setSucessoMsg] = useState("");

  const produtosFiltrados = state.produtos.filter((p) => {
    const matchBusca =
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.sku.toLowerCase().includes(busca.toLowerCase());
    const matchCat = categoriaFiltro === "todas" || p.categoria === categoriaFiltro;
    return matchBusca && matchCat;
  });

  const handleSalvarProduto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || !nome) return;

    const qtd = Number(estoqueInicial) || 0;
    adicionarProduto({
      sku,
      nome,
      categoria,
      precoUnitario: Number(preco) || 0,
      custoUnitario: Number(custo) || 0,
      estoqueTotal: qtd,
      estoqueMinimo: 20,
      unidade,
      almoxarifados: [
        { nome: "Armazém Central - Porto de Bissau", quantidade: Math.round(qtd * 0.7) },
        { nome: "Mercado de Bandim - Box 14", quantidade: Math.round(qtd * 0.3) },
      ],
    });

    setSucessoMsg(`Produto ${nome} cadastrado com sucesso!`);
    setModalNovo(false);
    setSku("");
    setNome("");
    setTimeout(() => setSucessoMsg(""), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Estoque & Almoxarifados Multicentro
          </h2>
          <p className="text-sm text-ink-muted">
            Rastreamento de mercadorias no Porto de Bissau, Mercado de Bandim e depósitos regionais.
          </p>
        </div>

        <Button
          onClick={() => setModalNovo(true)}
          className="bg-amber-700 hover:bg-amber-800 text-white"
        >
          <PlusCircle className="size-4 mr-1.5" /> Cadastrar Novo Produto
        </Button>
      </div>

      {sucessoMsg && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
          <CheckCircle2 className="size-4" />
          <span>{sucessoMsg}</span>
        </div>
      )}

      {/* Barra de Busca e Filtros */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-faint" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome do produto ou código SKU..."
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="size-4 text-ink-faint" />
            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-xs text-ink"
            >
              <option value="todas">Todas as Categorias</option>
              <option value="Agrícola">Agrícola</option>
              <option value="Alimentos">Alimentos</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Construção">Construção</option>
              <option value="Higiene">Higiene</option>
              <option value="Diversos">Diversos</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Lista / Tabela de Produtos */}
      <div className="grid gap-4">
        {produtosFiltrados.map((prod) => (
          <Card key={prod.id} className="p-5 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300">
                    {prod.sku}
                  </span>
                  <Badge tone="warning" className="text-[10px]">
                    {prod.categoria}
                  </Badge>
                  {prod.estoqueTotal <= prod.estoqueMinimo && (
                    <Badge tone="danger" className="text-[10px]">
                      Estoque Crítico
                    </Badge>
                  )}
                </div>
                <h3 className="text-base font-bold text-ink">{prod.nome}</h3>
                <p className="text-xs text-ink-muted">
                  Preço de Venda:{" "}
                  <strong className="text-ink">
                    {prod.precoUnitario.toLocaleString("pt-GW")} FCFA
                  </strong>{" "}
                  &bull; Custo: {prod.custoUnitario.toLocaleString("pt-GW")} FCFA
                </p>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="font-display text-2xl font-bold text-ink">
                    {prod.estoqueTotal}
                  </span>
                  <span className="text-xs text-ink-muted ml-1">{prod.unidade}</span>
                  <p className="text-[10px] text-ink-faint">
                    Mínimo: {prod.estoqueMinimo} {prod.unidade}
                  </p>
                </div>
              </div>
            </div>

            {/* Distribuição por Almoxarifado */}
            <div className="border-t border-border-subtle pt-3">
              <p className="text-[11px] font-semibold text-ink-muted mb-2 flex items-center gap-1.5">
                <Warehouse className="size-3.5 text-amber-600" /> Distribuição por Almoxarifado / Loja
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {prod.almoxarifados.map((almox) => (
                  <div
                    key={almox.nome}
                    className="flex items-center justify-between rounded-lg bg-surface-raised p-2 text-xs border border-border-subtle"
                  >
                    <div>
                      <p className="font-medium text-ink leading-tight">{almox.nome.split(" - ")[0]}</p>
                      <p className="text-[10px] text-ink-muted">{almox.nome.split(" - ")[1] || "Central"}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-ink mr-1">
                        {almox.quantidade} {prod.unidade}
                      </span>
                      <button
                        onClick={() => ajustarEstoque(prod.id, almox.nome, -1)}
                        className="grid size-6 place-items-center rounded bg-surface border border-border-subtle hover:bg-surface-raised text-ink-muted"
                        title="Baixar 1 unidade"
                      >
                        <Minus className="size-3" />
                      </button>
                      <button
                        onClick={() => ajustarEstoque(prod.id, almox.nome, 1)}
                        className="grid size-6 place-items-center rounded bg-surface border border-border-subtle hover:bg-surface-raised text-ink-muted"
                        title="Adicionar 1 unidade"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Novo Produto */}
      {modalNovo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="font-display text-base font-bold text-ink">Cadastrar Novo Produto</h3>
              <button onClick={() => setModalNovo(false)} className="text-xs text-ink-muted hover:text-ink">
                Cancelar
              </button>
            </div>

            <form onSubmit={handleSalvarProduto} className="space-y-3 text-xs">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-semibold text-ink">Código SKU / Referência</label>
                  <Input
                    required
                    placeholder="Ex: ARROZ-50KG-001"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="mt-1 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink">Categoria</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as CategoriaProduto)}
                    className="mt-1 w-full rounded-lg border border-border-subtle bg-surface p-2 text-xs text-ink"
                  >
                    <option value="Alimentos">Alimentos</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Agrícola">Agrícola</option>
                    <option value="Construção">Construção</option>
                    <option value="Higiene">Higiene</option>
                    <option value="Diversos">Diversos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-ink">Nome Comercial do Produto</label>
                <Input
                  required
                  placeholder="Ex: Fardo de Açúcar Cristal Nacional"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="font-semibold text-ink">Preço Venda (FCFA)</label>
                  <Input
                    type="number"
                    required
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink">Custo (FCFA)</label>
                  <Input
                    type="number"
                    required
                    value={custo}
                    onChange={(e) => setCusto(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink">Unidade</label>
                  <select
                    value={unidade}
                    onChange={(e) => setUnidade(e.target.value as ProdutoEstoque["unidade"])}
                    className="mt-1 w-full rounded-lg border border-border-subtle bg-surface p-2 text-xs text-ink"
                  >
                    <option value="un">Unidade (un)</option>
                    <option value="kg">Quilo (kg)</option>
                    <option value="saco">Saco</option>
                    <option value="fardo">Fardo</option>
                    <option value="cx">Caixa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-ink">Estoque Inicial (Total)</label>
                <Input
                  type="number"
                  required
                  value={estoqueInicial}
                  onChange={(e) => setEstoqueInicial(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalNovo(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" className="bg-amber-700 hover:bg-amber-800 text-white">
                  Salvar Produto
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
