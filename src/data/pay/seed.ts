import type { PayMerchant, PayState, PayTx, ProviderEvent, ProviderId } from "./types";
import { daysAgo } from "./types";

/**
 * Estado inicial do GW Pay (Banco Digital) — dados de demonstração realistas.
 * O valor persistente vive em localStorage; este seed define o ponto de partida.
 */
export const SEED_VERSION = 1;

let txSeq = 0;
function mkTx(tx: Omit<PayTx, "id"> & { id?: string }): PayTx {
  txSeq += 1;
  return { ...tx, id: tx.id ?? `GWP-${String(10000 + txSeq * 7)}` };
}

const WALLETS: PayState["wallets"] = [
  {
    id: "gw",
    name: "Carteira Principal GW",
    holder: "GW Digital Company · Bissau",
    kind: "principal",
    currency: "FCFA",
    balance: 1_250_000,
    dailyLimit: 500_000,
    todaySpent: 86_500,
    linked: true,
    lastSync: daysAgo(0, 8),
  },
  {
    id: "om",
    name: "Carteira Orange Money",
    holder: "GW Digital Company · Bissau",
    kind: "mobile",
    providerId: "orange-money",
    currency: "FCFA",
    balance: 84_500,
    dailyLimit: 200_000,
    todaySpent: 0,
    phone: "+245 955 123 456",
    linked: true,
    lastSync: daysAgo(0, 7),
  },
  {
    id: "momo",
    name: "Carteira MTN MoMo",
    holder: "GW Digital Company · Bissau",
    kind: "mobile",
    providerId: "momo",
    currency: "FCFA",
    balance: 62_300,
    dailyLimit: 200_000,
    todaySpent: 0,
    phone: "+245 966 789 012",
    linked: true,
    lastSync: daysAgo(0, 7),
  },
];

export const TRANSACTIONS: PayTx[] = [
  mkTx({
    kind: "qr", title: "Pagamento QR — Mercado Central", counterparty: "Mercado Central de Bissau",
    method: "gw-pix", amount: -18_500, fee: 0, status: "settled", createdAt: daysAgo(0, 9), hash: "A41F90CEB2B1",
  }),
  mkTx({
    kind: "topup", title: "Recarga carteira", counterparty: "Orange Money · +245 955 123 456",
    method: "orange-money", amount: -100_000, fee: 1_200, status: "settled", createdAt: daysAgo(0, 8), hash: "7C0D12FA390A",
  }),
  mkTx({
    kind: "receive", title: "Recebimento PIX", counterparty: "Secretaria Académica Nacional",
    method: "gw-pix", amount: 320_000, fee: 0, status: "settled", createdAt: daysAgo(1, 10), hash: "B391E77D0C4E",
  }),
  mkTx({
    kind: "transfer", title: "Transferência P2P", counterparty: "Aissatu Baldé",
    method: "orange-money", amount: -25_000, fee: 300, status: "settled", createdAt: daysAgo(1, 12), hash: "5E2F8A11B0D9",
  }),
  mkTx({
    kind: "qr", title: "Pagamento QR — Supermercado Lima", counterparty: "Supermercado Lima",
    method: "gw-pix", amount: -42_800, fee: 0, status: "processing", createdAt: daysAgo(2, 9), hash: "99C1B2A3D4E5",
  }),
  mkTx({
    kind: "topup", title: "Recarga carteira", counterparty: "MTN MoMo · +245 966 789 012",
    method: "momo", amount: -75_000, fee: 1_125, status: "settled", createdAt: daysAgo(2, 11), hash: "D0A9F1C2B3E4",
  }),
  mkTx({
    kind: "withdrawal", title: "Levantamento", counterparty: "Agente Orange Money · Bairro de Belém",
    method: "orange-money", amount: -60_000, fee: 720, status: "settled", createdAt: daysAgo(3, 9), hash: "1E2D3C4B5A69",
  }),
  mkTx({
    kind: "receive", title: "Recebimento PIX", counterparty: "Fundo de Apoio às Escolas",
    method: "gw-pix", amount: 500_000, fee: 0, status: "settled", createdAt: daysAgo(4, 9), hash: "FE1A2B3C4D50",
  }),
  mkTx({
    kind: "qr", title: "Pagamento QR — Farmácia Central", counterparty: "Farmácia Central",
    method: "momo", amount: -15_200, fee: 228, status: "settled", createdAt: daysAgo(4, 14), hash: "2A3B4C5D6EF0",
  }),
  mkTx({
    kind: "transfer", title: "Transferência P2P", counterparty: "Mamadú Sissé",
    method: "gw-pix", amount: -12_000, fee: 0, status: "settled", createdAt: daysAgo(5, 9), hash: "B0C1D2E3F4A5",
  }),
  mkTx({
    kind: "refund", title: "Reembolso — falha de liquidação", counterparty: "Transporte Cacheu",
    method: "momo", amount: 8_500, fee: 0, status: "settled", createdAt: daysAgo(6, 9), hash: "6A7B8C9D0EF1",
  }),
  mkTx({
    kind: "qr", title: "Pagamento QR — Restaurante Terra Amarela", counterparty: "Restaurante Terra Amarela",
    method: "gw-pix", amount: -34_500, fee: 0, status: "settled", createdAt: daysAgo(6, 13), hash: "C2D3E4F5A6B7",
  }),
  mkTx({
    kind: "transfer", title: "Transferência P2P", counterparty: "Fatumata Cissé",
    method: "orange-money", amount: -30_000, fee: 360, status: "failed", createdAt: daysAgo(7, 9), hash: "3A4B5C6D7E8F",
  }),
  mkTx({
    kind: "topup", title: "Recarga carteira", counterparty: "Orange Money · +245 955 123 456",
    method: "orange-money", amount: -50_000, fee: 600, status: "settled", createdAt: daysAgo(8, 9), hash: "8E7F6A5B4C3D",
  }),
  mkTx({
    kind: "receive", title: "Recebimento PIX", counterparty: "Município de Bissau",
    method: "gw-pix", amount: 150_000, fee: 0, status: "settled", createdAt: daysAgo(9, 10), hash: "D0E1F2A3B4C5",
  }),
  mkTx({
    kind: "qr", title: "Pagamento QR — Hotel Bissau Inn", counterparty: "Hotel Bissau Inn",
    method: "gw-pix", amount: -88_000, fee: 0, status: "settled", createdAt: daysAgo(10, 9), hash: "4C5D6E7F8A9B",
  }),
  mkTx({
    kind: "withdrawal", title: "Levantamento", counterparty: "Agente MTN MoMo · Bandim",
    method: "momo", amount: -40_000, fee: 600, status: "settled", createdAt: daysAgo(11, 9), hash: "0A1B2C3D4E5F",
  }),
  mkTx({
    kind: "qr", title: "Pagamento QR — Mercado Central", counterparty: "Mercado Central de Bissau",
    method: "momo", amount: -22_400, fee: 336, status: "settled", createdAt: daysAgo(12, 9), hash: "5F6E7D8C9BA0",
  }),
  mkTx({
    kind: "receive", title: "Recebimento Orange Money", counterparty: "Cooperativa Sissé & Filhos",
    method: "orange-money", amount: 210_500, fee: 0, status: "settled", createdAt: daysAgo(13, 9), hash: "AB12CD34EF56",
  }),
  mkTx({
    kind: "transfer", title: "Transferência P2P", counterparty: "Instructor Académico — Bras",
    method: "gw-pix", amount: -9_800, fee: 0, status: "settled", createdAt: daysAgo(14, 9), hash: "78EF90AB12CD",
  }),
  mkTx({
    kind: "topup", title: "Recarga carteira", counterparty: "MTN MoMo · +245 966 789 012",
    method: "momo", amount: -120_000, fee: 1_800, status: "failed", createdAt: daysAgo(15, 9), hash: "3412CD56EF78",
  }),
  mkTx({
    kind: "qr", title: "Pagamento QR — Cacheu Trans", counterparty: "Cacheu Trans",
    method: "gw-pix", amount: -27_000, fee: 0, status: "settled", createdAt: daysAgo(16, 11), hash: "90AB34CD56EF",
  }),
  mkTx({
    kind: "receive", title: "Recebimento PIX", counterparty: "Hospital Nacional Simão Mendes",
    method: "gw-pix", amount: 640_000, fee: 0, status: "settled", createdAt: daysAgo(18, 9), hash: "EF5612AB78CD",
  }),
  mkTx({
    kind: "topup", title: "Recarga carteira", counterparty: "Orange Money · +245 955 123 456",
    method: "orange-money", amount: -80_000, fee: 960, status: "settled", createdAt: daysAgo(20, 9), hash: "CD34EF9012AB",
  }),
  mkTx({
    kind: "transfer", title: "Transferência P2P", counterparty: "Braima Mané",
    method: "orange-money", amount: -18_000, fee: 216, status: "settled", createdAt: daysAgo(22, 9), hash: "56AB78CD90EF",
  }),
  mkTx({
    kind: "receive", title: "Recebimento Orange Money", counterparty: "Comunidade de Base — Bairro de Mindara",
    method: "orange-money", amount: 95_000, fee: 0, status: "settled", createdAt: daysAgo(25, 9), hash: "1290EF56AB34",
  }),
  mkTx({
    kind: "qr", title: "Pagamento QR — Farmácia Central", counterparty: "Farmácia Central",
    method: "gw-pix", amount: -11_600, fee: 0, status: "refunded", createdAt: daysAgo(27, 9), hash: "7889AB0ACDEF",
  }),
];

export const MERCHANTS: PayMerchant[] = [
  { id: "MRCA-001", name: "Mercado Central de Bissau", category: "Alimentação", city: "Bissau", phone: "+245 955 111 222", nif: "NIF 010245781" },
  { id: "MRCA-002", name: "Supermercado Lima", category: "Alimentação", city: "Bissau", phone: "+245 966 222 333", nif: "NIF 013499222" },
  { id: "MRCA-003", name: "Farmácia Central", category: "Saúde", city: "Bissau", phone: "+245 955 333 444", nif: "NIF 011277333" },
  { id: "MRCA-004", name: "Cacheu Trans", category: "Transporte", city: "Cacheu", phone: "+245 966 444 555", nif: "NIF 012518444" },
  { id: "MRCA-005", name: "Hotel Bissau Inn", category: "Hotelaria", city: "Bissau", phone: "+245 955 555 666", nif: "NIF 010366555" },
  { id: "MRCA-006", name: "Restaurante Terra Amarela", category: "Restauração", city: "Bissau", phone: "+245 966 666 777", nif: "NIF 014803666" },
];

export const SEED_EVENTS: ProviderEvent[] = [
  { id: "EVT-9401", providerId: "gw-pix", type: "payment.settled", summary: "PIX 18.500 FCFA liquidado — Mercado Central de Bissau", at: daysAgo(0, 9) },
  { id: "EVT-9400", providerId: "orange-money", type: "connector.health", summary: "Handshake OK · 912 ms · Segredo da API rodado", at: daysAgo(0, 8) },
  { id: "EVT-9397", providerId: "momo", type: "payment.failed", summary: "Collection recusada (falha de saldo) — retry automático ok", at: daysAgo(1, 13) },
  { id: "EVT-9392", providerId: "gw-pix", type: "wallet.credited", summary: "Crédito 320.000 FCFA — Secretaria Académica Nacional", at: daysAgo(1, 10) },
  { id: "EVT-9388", providerId: "orange-money", type: "payment.settled", summary: "Top-up 100.000 FCFA liquidado · taxa 1,2%", at: daysAgo(2, 8) },
  { id: "EVT-9380", providerId: "momo", type: "connector.health", summary: "Latência elevada (1.214 ms) — monitorização ativa", at: daysAgo(3, 9) },
];

export const PAY_SEED: PayState = {
  wallets: WALLETS.map((w) => ({ ...w })),
  transactions: TRANSACTIONS.map((t) => ({ ...t })),
  providerStates: {
    "orange-money": "connected",
    momo: "connected",
    "gw-pix": "connected",
    iban: "future",
  },
  events: SEED_EVENTS.map((e) => ({ ...e })),
  config: {
    autoFees: true,
    webhooks: true,
    maintenance: false,
    webhookUrl: "https://api.gwpay.gw/hooks/liquidation",
    dailyLimitGw: 500_000,
    pixKey: "pix-gwdc@bissau.gw",
  },
};

export function defaultTransactions(): PayTx[] {
  return TRANSACTIONS.map((t) => ({ ...t }));
}

/** Resumo auxiliar usado nos gráficos de volume por provedor. */
export const PROVIDER_NAMES: Record<ProviderId, string> = {
  "orange-money": "Orange Money",
  momo: "MTN MoMo",
  "gw-pix": "GW PIX",
  iban: "IBAN",
};