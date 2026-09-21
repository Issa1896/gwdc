import { BadgeCheck, Boxes, ChartColumn, DollarSign, PackageSearch, Store, TrendingUp, Users } from "lucide-react";
import type { MvpData } from "./types";
import { badge, currency, date, number, text } from "./types";

const monthly = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

/** MÓDULO 8 — MVPs de Empresas (GW ERP, GW Business, GW POS). */
export const mvpEmpresas: Record<string, MvpData> = {
  "gw-erp": {
    productSlug: "gw-erp",
    greeting: "Painel executivo — Comercial Bissau Lda.",
    kpis: [
      { title: "Receita do mês", value: "48,2M FCFA", delta: 14.6, icon: DollarSign, tone: "brand", spark: [28, 32, 30, 36, 40, 42, 45, 48] },
      { title: "Pedidos abertos", value: "86", delta: 6.2, icon: Boxes, tone: "gold", spark: [60, 64, 70, 68, 74, 78, 82, 86] },
      { title: "Estoque em risco", value: "9", delta: -30.8, icon: PackageSearch, tone: "navy", spark: [18, 17, 15, 14, 13, 11, 10, 9] },
      { title: "Margem bruta", value: "31,4%", delta: 2.8, icon: ChartColumn, tone: "brand", spark: [27, 28, 28, 29, 30, 30, 31, 31] },
    ],
    charts: [
      {
        id: "vendas",
        title: "Vendas por mês (milhões FCFA)",
        type: "bar",
        kind: "number",
        series: [{ key: "vendas", name: "Vendas" }],
        data: monthly.map((name, i) => ({ name, vendas: [28, 32, 30, 36, 40, 48][i] })),
      },
      {
        id: "categorias",
        title: "Receita por categoria",
        type: "donut",
        kind: "number",
        data: [
          { name: "Alimentar", value: 38 },
          { name: "Construção", value: 24 },
          { name: "Tecnologia", value: 18 },
          { name: "Têxtil", value: 12 },
          { name: "Outros", value: 8 },
        ],
      },
    ],
    tables: [
      {
        id: "pedidos",
        title: "Pedidos de compra em aberto",
        columns: ["Pedido", "Fornecedor", "Valor", "Previsão", "Status"],
        rows: [
          [text("PC-1042"), text("Ceres Importadora"), currency(3200000), date("2026-08-04"), badge("Aprovado", "success")],
          [text("PC-1043"), text("TekBissau"), currency(1850000), date("2026-08-06"), badge("Em análise", "info")],
          [text("PC-1044"), text("AgroCacheu"), currency(960000), date("2026-08-09"), badge("Aguardando", "warning")],
          [text("PC-1045"), text("Porto Bissau Log"), currency(2400000), date("2026-08-12"), badge("Aprovado", "success")],
        ],
      },
      {
        id: "estoque",
        title: "Estoque crítico",
        columns: ["Produto", "Estoque", "Mínimo", "Situação"],
        rows: [
          [text("Arroz 25kg (saco)"), number(34), number(50), badge("Repor", "warning")],
          [text("Cimento 50kg"), number(120), number(100), badge("Ok", "success")],
          [text("Óleo 5L"), number(22), number(40), badge("Crítico", "danger")],
          [text("Água engarrafada"), number(310), number(200), badge("Ok", "success")],
        ],
      },
    ],
    alerts: [
      { tone: "success", title: "Conciliação bancária concluída", message: "Diferença de 0,02% resolvida automaticamente no fechamento de julho." },
      { tone: "warning", title: "Estoque crítico", message: "3 produtos abaixo do mínimo — sugerimos pedido de compra automático." },
    ],
  },
  "gw-business": {
    productSlug: "gw-business",
    greeting: "CRM — Equipa Comercial",
    kpis: [
      { title: "Leads no mês", value: "312", delta: 18.2, icon: Users, tone: "brand", spark: [180, 210, 230, 250, 270, 290, 300, 312] },
      { title: "Taxa de conversão", value: "24,6%", delta: 3.1, icon: TrendingUp, tone: "gold", spark: [18, 19, 20, 21, 22, 23, 24, 25] },
      { title: "Pipeline total", value: "96,4M FCFA", delta: 11.4, icon: DollarSign, tone: "navy", spark: [52, 58, 62, 70, 78, 84, 90, 96] },
      { title: "Clientes ativos", value: "1.284", delta: 7.6, icon: BadgeCheck, tone: "brand", spark: [900, 950, 1010, 1080, 1140, 1190, 1240, 1284] },
    ],
    charts: [
      {
        id: "funil",
        title: "Funil de vendas",
        type: "bar",
        kind: "number",
        series: [{ key: "negocios", name: "Negócios" }],
        data: [
          { name: "Prospecção", negocios: 312 },
          { name: "Qualificado", negocios: 208 },
          { name: "Proposta", negocios: 124 },
          { name: "Negociação", negocios: 58 },
          { name: "Fechado", negocios: 31 },
        ],
      },
      {
        id: "previsao",
        title: "Previsão de receita com IA (FCFA)",
        type: "line",
        kind: "number",
        series: [{ key: "previsto", name: "Previsto" }],
        data: [...monthly.slice(0, 4)].map((name, i) => ({ name, previsto: [28, 32, 36, 41][i] })),
      },
    ],
    tables: [
      {
        id: "oportunidades",
        title: "Oportunidades em destaque",
        columns: ["Cliente", "Produto", "Valor", "Estágio"],
        rows: [
          [text("Grupo Simões"), text("GW ERP"), currency(12500000), badge("Negociação", "gold")],
          [text("Supermercado Lima"), text("GW POS"), currency(4800000), badge("Proposta", "info")],
          [text("Hotel Atlântico"), text("GW Business"), currency(6200000), badge("Qualificado", "brand")],
          [text("Clínica Djata"), text("GW Health"), currency(3800000), badge("Proposta", "info")],
        ],
      },
    ],
    alerts: [
      { tone: "info", title: "IA recomenda", message: "3 leads com alto potencial de fechamento este mês — priorize-os." },
      { tone: "success", title: "Contrato renovado", message: "Comercial Bissau renovou o GW ERP por mais 2 anos." },
    ],
  },
  "gw-pos": {
    productSlug: "gw-pos",
    greeting: "PDV — Loja Centro, Bissau",
    kpis: [
      { title: "Vendas hoje", value: "842.500 FCFA", delta: 9.4, icon: Store, tone: "brand", spark: [400, 480, 520, 600, 640, 700, 770, 842] },
      { title: "Ticket médio", value: "4.212 FCFA", delta: 2.1, icon: TrendingUp, tone: "gold", spark: [3500, 3600, 3700, 3800, 3900, 4000, 4100, 4212] },
      { title: "Itens vendidos", value: "612", delta: 7.2, icon: Boxes, tone: "navy", spark: [380, 420, 450, 480, 520, 550, 580, 612] },
      { title: "Transações no caixa", value: "200", delta: 5.8, icon: BadgeCheck, tone: "brand", spark: [140, 150, 160, 170, 180, 185, 192, 200] },
    ],
    charts: [
      {
        id: "vendas-hora",
        title: "Vendas por hora (FCFA)",
        type: "line",
        kind: "number",
        series: [{ key: "vendas", name: "FCFA" }],
        data: ["8h", "10h", "12h", "14h", "16h", "18h", "20h"].map((name, i) => ({ name, vendas: [12000, 45000, 180000, 150000, 96000, 240000, 119500][i] })),
      },
      {
        id: "metodos",
        title: "Métodos de pagamento",
        type: "donut",
        kind: "percent",
        data: [
          { name: "GW Pay", value: 41 },
          { name: "Dinheiro", value: 38 },
          { name: "Cartão", value: 16 },
          { name: "Parcelado", value: 5 },
        ],
      },
    ],
    tables: [
      {
        id: "ultimas",
        title: "Últimas vendas",
        columns: ["Hora", "Itens", "Total", "Pagamento"],
        rows: [
          [text("20:42"), number(3), currency(12500), badge("GW Pay", "brand")],
          [text("20:31"), number(1), currency(3900), badge("Dinheiro", "neutral")],
          [text("20:18"), number(6), currency(28400), badge("Cartão", "info")],
          [text("20:05"), number(2), currency(7600), badge("GW Pay", "brand")],
          [text("19:52"), number(4), currency(19850), badge("Dinheiro", "neutral")],
        ],
      },
    ],
    alerts: [
      { tone: "success", title: "Caixa equilibrado", message: "Fechamento parcial de 20h: 812.000 FCFA no cofre, 0 divergências." },
      { tone: "info", title: "Modo offline ativo", message: "12 vendas sincronizadas quando a rede voltou às 19h40." },
    ],
  },
};
