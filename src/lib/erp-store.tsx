"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CategoriaProduto =
  | "Alimentos"
  | "Bebidas"
  | "Agrícola"
  | "Construção"
  | "Higiene"
  | "Diversos";

export interface EstoqueAlmoxarifado {
  nome: string;
  quantidade: number;
}

export interface ProdutoEstoque {
  id: string;
  sku: string;
  nome: string;
  categoria: CategoriaProduto;
  precoUnitario: number;
  custoUnitario: number;
  estoqueTotal: number;
  estoqueMinimo: number;
  almoxarifados: EstoqueAlmoxarifado[];
  unidade: "un" | "kg" | "saco" | "fardo" | "cx";
}

export interface ItemVenda {
  produtoId: string;
  sku: string;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface VendaPOS {
  id: string;
  numeroCupom: string;
  data: string;
  itens: ItemVenda[];
  subtotal: number;
  desconto: number;
  total: number;
  formaPagamento: "dinheiro" | "gw-pay" | "orange-money" | "cartao";
  valorRecebido: number;
  troco: number;
  operador: string;
  status: "concluida" | "cancelada";
}

export interface FaturaComercial {
  id: string;
  numero: string;
  clienteNome: string;
  clienteNif: string;
  dataEmissao: string;
  dataVencimento: string;
  itens: ItemVenda[];
  subtotal: number;
  iva: number;
  total: number;
  status: "paga" | "pendente" | "cancelada";
}

export interface SessaoCaixa {
  id: string;
  abertoEm: string;
  fechadoEm?: string;
  saldoInicial: number;
  totalVendas: number;
  totalDinheiro: number;
  totalGwPay: number;
  totalMobileMoney: number;
  status: "aberto" | "fechado";
  operador: string;
}

interface ErpState {
  produtos: ProdutoEstoque[];
  vendas: VendaPOS[];
  faturas: FaturaComercial[];
  caixaAtual: SessaoCaixa;
}

interface ErpContextType {
  state: ErpState;
  adicionarProduto: (produto: Omit<ProdutoEstoque, "id">) => ProdutoEstoque;
  ajustarEstoque: (produtoId: string, almoxarifadoNome: string, delta: number) => void;
  realizarVendaPOS: (dados: {
    itens: ItemVenda[];
    desconto: number;
    formaPagamento: VendaPOS["formaPagamento"];
    valorRecebido: number;
    operador?: string;
  }) => VendaPOS;
  emitirFatura: (dados: {
    clienteNome: string;
    clienteNif: string;
    itens: ItemVenda[];
    dataVencimento: string;
  }) => FaturaComercial;
  abrirCaixa: (saldoInicial: number, operador: string) => void;
  fecharCaixa: () => void;
}

const SEED_PRODUTOS: ProdutoEstoque[] = [
  {
    id: "prod-001",
    sku: "CAJU-EXP-001",
    nome: "Castanha de Caju Tipo Exportação (Saco 50kg)",
    categoria: "Agrícola",
    precoUnitario: 45000,
    custoUnitario: 32000,
    estoqueTotal: 180,
    estoqueMinimo: 40,
    unidade: "saco",
    almoxarifados: [
      { nome: "Armazém Central - Porto de Bissau", quantidade: 120 },
      { nome: "Depósito Regional - Safim", quantidade: 60 },
    ],
  },
  {
    id: "prod-002",
    sku: "ARROZ-MANGO-002",
    nome: "Arroz Mangona Nacional (Saco 25kg)",
    categoria: "Alimentos",
    precoUnitario: 16500,
    custoUnitario: 12500,
    estoqueTotal: 340,
    estoqueMinimo: 50,
    unidade: "saco",
    almoxarifados: [
      { nome: "Armazém Central - Porto de Bissau", quantidade: 200 },
      { nome: "Mercado de Bandim - Box 14", quantidade: 140 },
    ],
  },
  {
    id: "prod-003",
    sku: "OLEO-PALMA-003",
    nome: "Óleo de Palma Puro de Bolama (Garrafão 5L)",
    categoria: "Alimentos",
    precoUnitario: 7500,
    custoUnitario: 5200,
    estoqueTotal: 95,
    estoqueMinimo: 20,
    unidade: "un",
    almoxarifados: [
      { nome: "Mercado de Bandim - Box 14", quantidade: 65 },
      { nome: "Depósito Regional - Safim", quantidade: 30 },
    ],
  },
  {
    id: "prod-004",
    sku: "CIM-CIMENCAM-004",
    nome: "Cimento Portland CP-32 (Saco 50kg)",
    categoria: "Construção",
    precoUnitario: 6800,
    custoUnitario: 5100,
    estoqueTotal: 520,
    estoqueMinimo: 100,
    unidade: "saco",
    almoxarifados: [
      { nome: "Armazém Central - Porto de Bissau", quantidade: 400 },
      { nome: "Depósito Regional - Safim", quantidade: 120 },
    ],
  },
  {
    id: "prod-005",
    sku: "AGUA-BIJAGOS-005",
    nome: "Água Mineral Natural das Ilhas (Fardo 12x1.5L)",
    categoria: "Bebidas",
    precoUnitario: 4200,
    custoUnitario: 2800,
    estoqueTotal: 310,
    estoqueMinimo: 60,
    unidade: "fardo",
    almoxarifados: [
      { nome: "Mercado de Bandim - Box 14", quantidade: 190 },
      { nome: "Armazém Central - Porto de Bissau", quantidade: 120 },
    ],
  },
  {
    id: "prod-006",
    sku: "SABAO-BARRA-006",
    nome: "Sabão Artesanal de Coco e Palma (Caixa com 24un)",
    categoria: "Higiene",
    precoUnitario: 8900,
    custoUnitario: 6100,
    estoqueTotal: 140,
    estoqueMinimo: 30,
    unidade: "cx",
    almoxarifados: [
      { nome: "Mercado de Bandim - Box 14", quantidade: 90 },
      { nome: "Depósito Regional - Safim", quantidade: 50 },
    ],
  },
];

const SEED_VENDAS: VendaPOS[] = [
  {
    id: "venda-001",
    numeroCupom: "POS-2026-8812",
    data: "2026-09-21 14:15",
    itens: [
      {
        produtoId: "prod-002",
        sku: "ARROZ-MANGO-002",
        produtoNome: "Arroz Mangona Nacional (Saco 25kg)",
        quantidade: 2,
        precoUnitario: 16500,
        subtotal: 33000,
      },
      {
        produtoId: "prod-003",
        sku: "OLEO-PALMA-003",
        produtoNome: "Óleo de Palma Puro de Bolama (Garrafão 5L)",
        quantidade: 1,
        precoUnitario: 7500,
        subtotal: 7500,
      },
    ],
    subtotal: 40500,
    desconto: 500,
    total: 40000,
    formaPagamento: "gw-pay",
    valorRecebido: 40000,
    troco: 0,
    operador: "Maria Francisca Có",
    status: "concluida",
  },
  {
    id: "venda-002",
    numeroCupom: "POS-2026-8813",
    data: "2026-09-21 15:40",
    itens: [
      {
        produtoId: "prod-005",
        sku: "AGUA-BIJAGOS-005",
        produtoNome: "Água Mineral Natural das Ilhas (Fardo 12x1.5L)",
        quantidade: 3,
        precoUnitario: 4200,
        subtotal: 12600,
      },
    ],
    subtotal: 12600,
    desconto: 0,
    total: 12600,
    formaPagamento: "dinheiro",
    valorRecebido: 15000,
    troco: 2400,
    operador: "Maria Francisca Có",
    status: "concluida",
  },
];

const SEED_FATURAS: FaturaComercial[] = [
  {
    id: "fat-001",
    numero: "FT-2026-0042",
    clienteNome: "Sociedade Hoteleira e Turismo Bijagós Lda",
    clienteNif: "510293847",
    dataEmissao: "2026-09-18",
    dataVencimento: "2026-10-18",
    itens: [
      {
        produtoId: "prod-005",
        sku: "AGUA-BIJAGOS-005",
        produtoNome: "Água Mineral Natural das Ilhas (Fardo 12x1.5L)",
        quantidade: 50,
        precoUnitario: 4200,
        subtotal: 210000,
      },
      {
        produtoId: "prod-003",
        sku: "OLEO-PALMA-003",
        produtoNome: "Óleo de Palma Puro de Bolama (Garrafão 5L)",
        quantidade: 20,
        precoUnitario: 7500,
        subtotal: 150000,
      },
    ],
    subtotal: 360000,
    iva: 54000,
    total: 414000,
    status: "paga",
  },
];

const SEED_CAIXA: SessaoCaixa = {
  id: "cx-sessao-01",
  abertoEm: "2026-09-21 08:00",
  saldoInicial: 50000,
  totalVendas: 52600,
  totalDinheiro: 12600,
  totalGwPay: 40000,
  totalMobileMoney: 0,
  status: "aberto",
  operador: "Maria Francisca Có",
};

const STORAGE_KEY = "gwdc_erp_state_v1";

const ErpContext = createContext<ErpContextType | undefined>(undefined);

export function ErpProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ErpState>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (err) {
        console.error("Erro ao carregar estado do GW ERP/POS:", err);
      }
    }
    return {
      produtos: SEED_PRODUTOS,
      vendas: SEED_VENDAS,
      faturas: SEED_FATURAS,
      caixaAtual: SEED_CAIXA,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Erro ao salvar estado do GW ERP/POS:", err);
    }
  }, [state]);

  const adicionarProduto = (novo: Omit<ProdutoEstoque, "id">): ProdutoEstoque => {
    const produto: ProdutoEstoque = {
      ...novo,
      id: `prod-${Date.now()}`,
    };

    setState((prev) => ({
      ...prev,
      produtos: [produto, ...prev.produtos],
    }));

    return produto;
  };

  const ajustarEstoque = (produtoId: string, almoxarifadoNome: string, delta: number) => {
    setState((prev) => ({
      ...prev,
      produtos: prev.produtos.map((p) => {
        if (p.id !== produtoId) return p;

        const almoxs = p.almoxarifados.map((a) =>
          a.nome === almoxarifadoNome ? { ...a, quantidade: Math.max(0, a.quantidade + delta) } : a
        );

        const novoTotal = almoxs.reduce((acc, a) => acc + a.quantidade, 0);
        return {
          ...p,
          almoxarifados: almoxs,
          estoqueTotal: novoTotal,
        };
      }),
    }));
  };

  const realizarVendaPOS = ({
    itens,
    desconto,
    formaPagamento,
    valorRecebido,
    operador = "Operador de Caixa",
  }: {
    itens: ItemVenda[];
    desconto: number;
    formaPagamento: VendaPOS["formaPagamento"];
    valorRecebido: number;
    operador?: string;
  }): VendaPOS => {
    const subtotal = itens.reduce((acc, item) => acc + item.subtotal, 0);
    const total = Math.max(0, subtotal - desconto);
    const troco = Math.max(0, valorRecebido - total);

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const numeroCupom = `POS-${new Date().getFullYear()}-${randomNum}`;
    const hojeStr = new Date().toISOString().replace("T", " ").substring(0, 16);

    const novaVenda: VendaPOS = {
      id: `venda-${Date.now()}`,
      numeroCupom,
      data: hojeStr,
      itens,
      subtotal,
      desconto,
      total,
      formaPagamento,
      valorRecebido,
      troco,
      operador,
      status: "concluida",
    };

    setState((prev) => {
      // 1. Dá baixa automática no estoque de cada produto vendido
      const produtosAtualizados = prev.produtos.map((prod) => {
        const itemVendido = itens.find((it) => it.produtoId === prod.id);
        if (!itemVendido) return prod;

        const qtdVenda = itemVendido.quantidade;
        let restante = qtdVenda;

        const novosAlmoxs = prod.almoxarifados.map((almox) => {
          if (restante <= 0) return almox;
          const deduzir = Math.min(almox.quantidade, restante);
          restante -= deduzir;
          return { ...almox, quantidade: almox.quantidade - deduzir };
        });

        const novoTotal = novosAlmoxs.reduce((acc, a) => acc + a.quantidade, 0);
        return {
          ...prod,
          almoxarifados: novosAlmoxs,
          estoqueTotal: novoTotal,
        };
      });

      // 2. Atualiza a sessão de caixa
      const novoDinheiro =
        formaPagamento === "dinheiro" ? prev.caixaAtual.totalDinheiro + total : prev.caixaAtual.totalDinheiro;
      const novoGwPay =
        formaPagamento === "gw-pay" ? prev.caixaAtual.totalGwPay + total : prev.caixaAtual.totalGwPay;
      const novoMobileMoney =
        formaPagamento === "orange-money"
          ? prev.caixaAtual.totalMobileMoney + total
          : prev.caixaAtual.totalMobileMoney;

      const caixaAtualizado: SessaoCaixa = {
        ...prev.caixaAtual,
        totalVendas: prev.caixaAtual.totalVendas + total,
        totalDinheiro: novoDinheiro,
        totalGwPay: novoGwPay,
        totalMobileMoney: novoMobileMoney,
      };

      return {
        ...prev,
        produtos: produtosAtualizados,
        vendas: [novaVenda, ...prev.vendas],
        caixaAtual: caixaAtualizado,
      };
    });

    return novaVenda;
  };

  const emitirFatura = ({
    clienteNome,
    clienteNif,
    itens,
    dataVencimento,
  }: {
    clienteNome: string;
    clienteNif: string;
    itens: ItemVenda[];
    dataVencimento: string;
  }): FaturaComercial => {
    const subtotal = itens.reduce((acc, item) => acc + item.subtotal, 0);
    const iva = Math.round(subtotal * 0.15); // IVA padrão de 15% na Guiné-Bissau
    const total = subtotal + iva;

    const seq = state.faturas.length + 43;
    const numero = `FT-${new Date().getFullYear()}-${String(seq).padStart(4, "0")}`;
    const dataEmissao = new Date().toISOString().split("T")[0];

    const novaFatura: FaturaComercial = {
      id: `fat-${Date.now()}`,
      numero,
      clienteNome,
      clienteNif,
      dataEmissao,
      dataVencimento,
      itens,
      subtotal,
      iva,
      total,
      status: "pendente",
    };

    setState((prev) => ({
      ...prev,
      faturas: [novaFatura, ...prev.faturas],
    }));

    return novaFatura;
  };

  const abrirCaixa = (saldoInicial: number, operador: string) => {
    const novaSessao: SessaoCaixa = {
      id: `cx-${Date.now()}`,
      abertoEm: new Date().toISOString().replace("T", " ").substring(0, 16),
      saldoInicial,
      totalVendas: 0,
      totalDinheiro: 0,
      totalGwPay: 0,
      totalMobileMoney: 0,
      status: "aberto",
      operador,
    };

    setState((prev) => ({
      ...prev,
      caixaAtual: novaSessao,
    }));
  };

  const fecharCaixa = () => {
    setState((prev) => ({
      ...prev,
      caixaAtual: {
        ...prev.caixaAtual,
        status: "fechado",
        fechadoEm: new Date().toISOString().replace("T", " ").substring(0, 16),
      },
    }));
  };

  return (
    <ErpContext.Provider
      value={{
        state,
        adicionarProduto,
        ajustarEstoque,
        realizarVendaPOS,
        emitirFatura,
        abrirCaixa,
        fecharCaixa,
      }}
    >
      {children}
    </ErpContext.Provider>
  );
}

export function useErp() {
  const context = useContext(ErpContext);
  if (!context) {
    throw new Error("useErp deve ser utilizado dentro de um ErpProvider");
  }
  return context;
}
