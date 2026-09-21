import { CreditCard, Landmark, QrCode, ShieldCheck, Wallet, Zap } from "lucide-react";
import type { MvpData } from "./types";
import { badge, currency, date, number, text } from "./types";

const monthly = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

/** MÓDULO 9 — MVPs Financeiros (GW Bank, GW Pay). */
export const mvpFinancas: Record<string, MvpData> = {
  "gw-bank": {
    productSlug: "gw-bank",
    greeting: "Conta Digital — Maria da Silva",
    kpis: [
      { title: "Saldo disponível", value: "486.250 FCFA", delta: 6.4, icon: Wallet, tone: "brand", spark: [310, 340, 360, 390, 420, 440, 460, 486] },
      { title: "Entradas no mês", value: "1,2M FCFA", delta: 12.8, icon: Landmark, tone: "gold", spark: [720, 780, 820, 900, 980, 1050, 1130, 1200] },
      { title: "Cartões ativos", value: "2", delta: 0, icon: CreditCard, tone: "navy", spark: [2, 2, 2, 2, 2, 2, 2, 2] },
      { title: "Score de crédito", value: "742", delta: 3.5, icon: ShieldCheck, tone: "brand", spark: [680, 690, 700, 710, 715, 725, 735, 742] },
    ],
    charts: [
      {
        id: "fluxo",
        title: "Fluxo de caixa (FCFA)",
        type: "area",
        kind: "number",
        series: [
          { key: "entradas", name: "Entradas" },
          { key: "saidas", name: "Saídas" },
        ],
        data: monthly.map((name, i) => ({ name, entradas: [720, 780, 820, 900, 980, 1200][i], saidas: [650, 700, 780, 760, 890, 940][i] })),
      },
      {
        id: "gastos",
        title: "Gastos por categoria",
        type: "donut",
        kind: "percent",
        data: [
          { name: "Alimentação", value: 32 },
          { name: "Transporte", value: 18 },
          { name: "Educação", value: 15 },
          { name: "Compras", value: 22 },
          { name: "Serviços", value: 13 },
        ],
      },
    ],
    tables: [
      {
        id: "transacoes",
        title: "Transações recentes",
        columns: ["Data", "Descrição", "Categoria", "Valor"],
        rows: [
          [date("2026-07-30"), text("Transferência GW Pay — Mercado Central"), text("Alimentação"), text("-12.500 FCFA")],
          [date("2026-07-30"), text("Pagamento de salário"), text("Rendimentos"), text("+450.000 FCFA")],
          [date("2026-07-29"), text("Compra com cartão — Petróleo Bissau"), text("Transporte"), text("-25.000 FCFA")],
          [date("2026-07-28"), text("Pix para cooperativa de Bafatá"), text("Família"), text("-50.000 FCFA")],
          [date("2026-07-27"), text("Recarga de telemóvel"), text("Serviços"), text("-2.000 FCFA")],
        ],
      },
      {
        id: "cartoes",
        title: "Meus cartões",
        columns: ["Cartão", "Bandeira", "Limite", "Última compra"],
        rows: [
          [text("Débito ···· 4821"), badge("Mastercard", "info"), currency(0), date("2026-07-29")],
          [text("Crédito ···· 7390"), badge("Visa", "navy"), currency(250000), date("2026-07-25")],
        ],
      },
    ],
    alerts: [
      { tone: "success", title: "Salário creditado", message: "O pagamento de julho foi creditado à 08h02 via Open Finance." },
      { tone: "warning", title: "Limite de gastos", message: "Você usou 74% do orçamento mensal definido para 'Compras'." },
    ],
    extras: ["bank"],
  },
  "gw-pay": {
    productSlug: "gw-pay",
    greeting: "Painel de Pagamentos — GW Pay",
    kpis: [
      { title: "Transações hoje", value: "84.210", delta: 15.3, icon: Zap, tone: "brand", spark: [31000, 38000, 44000, 52000, 60000, 69000, 77000, 84210] },
      { title: "Volume processado", value: "2,4B FCFA", delta: 18.7, icon: QrCode, tone: "gold", spark: [900, 1100, 1250, 1500, 1750, 1950, 2200, 2400] },
      { title: "Estabelecimentos", value: "3.412", delta: 8.9, icon: Landmark, tone: "navy", spark: [1800, 2100, 2400, 2700, 2950, 3150, 3300, 3412] },
      { title: "Disponibilidade", value: "99,98%", delta: 0.1, icon: ShieldCheck, tone: "brand", spark: [99.9, 99.9, 99.95, 99.94, 99.96, 99.97, 99.97, 99.98] },
    ],
    charts: [
      {
        id: "transacoes-mes",
        title: "Transações por mês",
        type: "bar",
        kind: "number",
        series: [{ key: "transacoes", name: "Transações (milhares)" }],
        data: monthly.map((name, i) => ({ name, transacoes: [310, 380, 440, 520, 600, 690][i] })),
      },
      {
        id: "liquidez",
        title: "Liquidação em tempo real (min)",
        type: "line",
        kind: "number",
        series: [{ key: "seg", name: "Segundos" }],
        data: monthly.map((name, i) => ({ name, seg: [8.2, 7.8, 6.9, 5.4, 4.8, 3.2][i] })),
      },
    ],
    tables: [
      {
        id: "comerciantes",
        title: "Comerciantes em destaque",
        columns: ["Comerciante", "Setor", "Transações", "Volume"],
        rows: [
          [text("Mercado Central Bissau"), text("Varejo"), number(12480), currency(312000000)],
          [text("Supermercado Lima"), text("Alimentar"), number(8410), currency(248000000)],
          [text("Transporte Cacheu"), text("Mobilidade"), number(6130), currency(142000000)],
          [text("Farmácia Central"), text("Saúde"), number(3850), currency(98000000)],
        ],
      },
    ],
    alerts: [
      { tone: "success", title: "SLA de liquidação", message: "99,4% das transações liquidadas em menos de 5 segundos." },
      { tone: "info", title: "Novo limite", message: "Limite de transferências elevado para 5.000.000 FCFA/dia para empresas." },
    ],
  },
};
