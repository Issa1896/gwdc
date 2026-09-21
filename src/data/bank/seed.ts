import type { BankState } from "./types";
import { daysAgo } from "./types";

/**
 * Estado inicial do GW Bank — Banco Digital Soberano (demonstração realista).
 * Regulado pelo BCEAO; cifras em FCFA: dados fictícios que simulam operação real.
 */
export const SEED_VERSION = 1;

let seq = 0;
function mkTx(tx: Omit<BankState["transactions"][number], "id"> & { id?: string }) {
  seq += 1;
  return { ...tx, id: tx.id ?? `GWBTX-${String(21000 + seq * 13)}` };
}

export const ACCOUNTS: BankState["accounts"] = [
  {
    id: "acc-checking",
    name: "Conta à Ordem — Operacional",
    holder: "GW Digital Company · Direção Financeira",
    kind: "checking",
    number: "OD-2041 0001 0001",
    iban: "GW88 BBBB 0100 0000 1234 5678 90",
    balance: 2_480_000,
    limit: 1_500_000,
    createdAt: "2025-04-02",
    status: "active",
  },
  {
    id: "acc-savings",
    name: "Poupança Soberana",
    holder: "GW Digital Company · Tesouraria",
    kind: "savings",
    number: "PO-2041 0001 0002",
    iban: "GW88 BBBB 0100 0000 9876 5432 10",
    balance: 750_000,
    limit: 500_000,
    interestRate: 3.5,
    goal: 2_000_000,
    createdAt: "2025-06-18",
    status: "active",
  },
  {
    id: "acc-treasury",
    name: "Conta Tesouraria — Liquidação GW Pay",
    holder: "GW Digital Company · Clearing",
    kind: "treasury",
    number: "TS-2041 0001 0003",
    iban: "GW88 BBBB 0100 0000 1111 2222 33",
    balance: 320_000,
    limit: 900_000,
    createdAt: "2025-11-10",
    status: "active",
  },
];

export const CARDS: BankState["cards"] = [
  {
    id: "crd-1",
    name: "GW Virtual Mastercard",
    network: "Mastercard",
    kind: "virtual",
    status: "active",
    last4: "8124",
    expiry: "09/28",
    limit: 300_000,
    usedToday: 86_500,
    color: "#0EA5E9",
  },
  {
    id: "crd-2",
    name: "GW Corporate VISA",
    network: "VISA",
    kind: "physical",
    status: "active",
    last4: "4431",
    expiry: "03/29",
    limit: 800_000,
    usedToday: 412_000,
    color: "#2563EB",
  },
  {
    id: "crd-3",
    name: "GW Executive Mastercard",
    network: "Mastercard",
    kind: "physical",
    status: "requested",
    last4: "----",
    expiry: "—",
    limit: 1_000_000,
    usedToday: 0,
    color: "#0F766E",
  },
];

export const TRANSACTIONS: BankState["transactions"] = [
  mkTx({ kind: "credit", title: "Recebimento de serviços", counterparty: "Ministério das Finanças", accountId: "acc-checking", amount: 850_000, fee: 0, status: "settled", category: "Receitas", createdAt: daysAgo(0, 9), hash: "B41F90CEB2B1" }),
  mkTx({ kind: "pos", title: "Compra POS — Supermercado Lima", counterparty: "Cartão •••• 4431", accountId: "acc-checking", amount: -42_800, fee: 0, status: "settled", category: "Compras", createdAt: daysAgo(0, 10), hash: "7C0D12FA390A" }),
  mkTx({ kind: "transfer", title: "Liquidação GW Pay (PIX)", counterparty: "Clearing GWDC — conta tesouraria", accountId: "acc-treasury", amount: -180_000, fee: 0, status: "settled", category: "Liquidação", createdAt: daysAgo(0, 8), hash: "A391E77D0C4E" }),
  mkTx({ kind: "debit", title: "Pagamento a fornecedor", counterparty: "Cacheu Comercial Lda.", accountId: "acc-checking", amount: -214_500, fee: 1_500, status: "settled", category: "Fornecedores", createdAt: daysAgo(1, 9), hash: "5E2F8A11B0D9" }),
  mkTx({ kind: "savings", title: "Reforço Poupança Soberana", counterparty: "Tesouraria interna", accountId: "acc-savings", amount: 100_000, fee: 0, status: "settled", category: "Poupança", createdAt: daysAgo(1, 11), hash: "99C1B2A3D4E5" }),
  mkTx({ kind: "fee", title: "Tarifa de manutenção", counterparty: "GW Bank — contratos", accountId: "acc-checking", amount: -4_500, fee: 0, status: "settled", category: "Tarifas", createdAt: daysAgo(2, 9), hash: "D0A9F1C2B3E4" }),
  mkTx({ kind: "credit", title: "Recebimento de serviços", counterparty: "Fundo de Apoio às Escolas", accountId: "acc-checking", amount: 1_240_000, fee: 0, status: "settled", category: "Receitas", createdAt: daysAgo(3, 9), hash: "1E2D3C4B5A69" }),
  mkTx({ kind: "pos", title: "Compra POS — Hotel Bissau Inn", counterparty: "Cartão •••• 8124", accountId: "acc-checking", amount: -64_000, fee: 0, status: "settled", category: "Compras", createdAt: daysAgo(3, 13), hash: "FE1A2B3C4D50" }),
  mkTx({ kind: "transfer", title: "Pagamento de folha", counterparty: "Processamento salarial", accountId: "acc-checking", amount: -620_000, fee: 0, status: "settled", category: "Pessoal", createdAt: daysAgo(4, 9), hash: "2A3B4C5D6EF0" }),
  mkTx({ kind: "debit", title: "Licença de software", counterparty: "Azure — cloud corporativa", accountId: "acc-checking", amount: -96_000, fee: 0, status: "settled", category: "Tecnologia", createdAt: daysAgo(5, 9), hash: "B0C1D2E3F4A5" }),
  mkTx({ kind: "credit", title: "Recebimento PIX", counterparty: "Cooperativa Sissé & Filhos", accountId: "acc-treasury", amount: 210_500, fee: 0, status: "settled", category: "Receitas", createdAt: daysAgo(5, 12), hash: "6A7B8C9D0EF1" }),
  mkTx({ kind: "fee", title: "Tarifa de liquidação interbancária", counterparty: "BCEAO — sistema de pagamentos", accountId: "acc-treasury", amount: -3_200, fee: 0, status: "settled", category: "Tarifas", createdAt: daysAgo(6, 9), hash: "C2D3E4F5A6B7" }),
  mkTx({ kind: "debit", title: "Manutenção de frotas", counterparty: "Auto Central Bissau", accountId: "acc-checking", amount: -185_000, fee: 0, status: "settled", category: "Operações", createdAt: daysAgo(7, 9), hash: "3A4B5C6D7E8F" }),
  mkTx({ kind: "savings", title: "Juros de poupança (3,5% a.a.)", counterparty: "GW Bank — remuneração", accountId: "acc-savings", amount: 21_875, fee: 0, status: "settled", category: "Poupança", createdAt: daysAgo(8, 9), hash: "8E7F6A5B4C3D" }),
  mkTx({ kind: "credit", title: "Recebimento de serviços", counterparty: "Hospital Nacional Simão Mendes", accountId: "acc-checking", amount: 640_000, fee: 0, status: "settled", category: "Receitas", createdAt: daysAgo(9, 10), hash: "D0E1F2A3B4C5" }),
  mkTx({ kind: "pos", title: "Compra POS — Restaurante Terra Amarela", counterparty: "Cartão •••• 4431", accountId: "acc-checking", amount: -38_400, fee: 0, status: "settled", category: "Compras", createdAt: daysAgo(10, 9), hash: "4C5D6E7F8A9B" }),
  mkTx({ kind: "debit", title: "Campanha de comunicação", counterparty: "Agência Azul Bissau", accountId: "acc-checking", amount: -120_000, fee: 0, status: "settled", category: "Marketing", createdAt: daysAgo(11, 9), hash: "0A1B2C3D4E5F" }),
  mkTx({ kind: "transfer", title: "Aporte ao clearing GW Pay", counterparty: "Clearing GWDC", accountId: "acc-treasury", amount: 300_000, fee: 0, status: "settled", category: "Liquidação", createdAt: daysAgo(12, 9), hash: "5F6E7D8C9BA0" }),
  mkTx({ kind: "credit", title: "Recebimento mensalidade", counterparty: "Cliente empresarial — ULC", accountId: "acc-checking", amount: 375_000, fee: 0, status: "settled", category: "Receitas", createdAt: daysAgo(13, 9), hash: "AB12CD34EF56" }),
  mkTx({ kind: "fee", title: "Tarifa de cartão corporativo", counterparty: "GW Bank — cartões", accountId: "acc-checking", amount: -1_000, fee: 0, status: "settled", category: "Tarifas", createdAt: daysAgo(15, 9), hash: "78EF90AB12CD" }),
  mkTx({ kind: "pos", title: "Compra online — Google Workspace", counterparty: "Cartão •••• 8124", accountId: "acc-checking", amount: -24_000, fee: 0, status: "settled", category: "Tecnologia", createdAt: daysAgo(16, 11), hash: "3412CD56EF78" }),
  mkTx({ kind: "debit", title: "Seguro corporativo", counterparty: "Seguradora Nacional", accountId: "acc-checking", amount: -150_000, fee: 0, status: "settled", category: "Operações", createdAt: daysAgo(18, 9), hash: "90AB34CD56EF" }),
  mkTx({ kind: "credit", title: "Cancelamento parcial — reembolso", counterparty: "Cacheu Comercial Lda.", accountId: "acc-checking", amount: 18_500, fee: 0, status: "refunded", category: "Fornecedores", createdAt: daysAgo(20, 9), hash: "EF5612AB78CD" }),
  mkTx({ kind: "savings", title: "Reforço Poupança Soberana", counterparty: "Tesouraria interna", accountId: "acc-savings", amount: 75_000, fee: 0, status: "settled", category: "Poupança", createdAt: daysAgo(22, 9), hash: "CD34EF9012AB" }),
];

export const BUDGETS: BankState["budgets"] = [
  { id: "bdg-1", category: "Operações", limit: 600_000, spent: 520_000 },
  { id: "bdg-2", category: "Tecnologia", limit: 400_000, spent: 310_000 },
  { id: "bdg-3", category: "Marketing", limit: 250_000, spent: 120_000 },
  { id: "bdg-4", category: "Compliance", limit: 200_000, spent: 95_000 },
  { id: "bdg-5", category: "Pessoal", limit: 700_000, spent: 620_000 },
];

export const CONSENTS: BankState["consents"] = [
  { id: "cst-1", partner: "Banco Central (BCEAO)", entity: "Supervisão prudencial", scopes: ["Saldos", "Movimentações", "Limites de exposição"], status: "active", grantedAt: "2026-01-05", expiresAt: "2027-01-05" },
  { id: "cst-2", partner: "GW Lend (fintech)", entity: "Análise de crédito", scopes: ["Perfil de fluxo", "Saldos agregados"], status: "active", grantedAt: "2026-02-12", expiresAt: "2026-08-12" },
  { id: "cst-3", partner: "Auditores externos (PKG)", entity: "Auditoria anual", scopes: ["Movimentações", "Comprovantes", "Contrapartes"], status: "active", grantedAt: "2026-03-01", expiresAt: "2026-09-01" },
  { id: "cst-4", partner: "Instituição de pagamento externa", entity: "Agregação de contas", scopes: ["Perfil"], status: "revoked", grantedAt: "2025-11-20", expiresAt: "2026-05-20" },
];

export const FRAUD_ALERTS: BankState["fraudAlerts"] = [
  { id: "fa-1", title: "Compras anómalas no estrangeiro", details: "3 transações POS em Paris em 15 minutos, fora do padrão histórico da entidade.", severity: "alta", score: 92, amount: 640_000, counterparty: "Cartões •••• 4431", status: "pending", createdAt: daysAgo(0, 7) },
  { id: "fa-2", title: "Transferência acima do padrão", details: "1,2 M FCFA para conta aberta há 3 dias — acima do limite de confiança do perfil.", severity: "media", score: 78, amount: 1_200_000, counterparty: "Banco parceiro — conta nova", status: "pending", createdAt: daysAgo(0, 11) },
  { id: "fa-3", title: "Padrão de smurfing", details: "Valores redondos com devolução imediata sugerem estruturação (lavagem de dinheiro).", severity: "alta", score: 85, amount: 450_000, counterparty: "Vários destinatários", status: "reviewed", createdAt: daysAgo(2, 9) },
  { id: "fa-4", title: "Login em dispositivo novo", details: "Acesso de dispositivo não registado às 04h — verificação em segundo fator aprovada manualmente.", severity: "baixa", score: 55, amount: 0, counterparty: "Sessão web", status: "reviewed", createdAt: daysAgo(3, 23) },
  { id: "fa-5", title: "Uso de ATM não registada", details: "Saque em terminal fora da rede credenciada do GW Bank.", severity: "media", score: 61, amount: 150_000, counterparty: "ATM — Bissau", status: "pending", createdAt: daysAgo(4, 18) },
];

export const BANK_SEED: BankState = {
  accounts: ACCOUNTS.map((a) => ({ ...a })),
  cards: CARDS.map((c) => ({ ...c })),
  transactions: TRANSACTIONS.map((t) => ({ ...t })),
  budgets: BUDGETS.map((b) => ({ ...b })),
  consents: CONSENTS.map((c) => ({ ...c })),
  fraudAlerts: FRAUD_ALERTS.map((a) => ({ ...a })),
  config: {
    openFinance: true,
    notifications: true,
    autoCategorize: true,
    mfa: true,
    maxTransfer: 1_500_000,
    atmDailyLimit: 200_000,
    autoblock: true,
  },
};