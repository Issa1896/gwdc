/** GW Pay — Banco Digital · Tipos centrais do motor de pagamentos. */

export type ProviderId = "orange-money" | "momo" | "gw-pix" | "iban";

export type ProviderKind = "mobile-money" | "instant" | "iban";

export type ConnectorState = "connected" | "degraded" | "disabled" | "future";

export type TxKind = "transfer" | "receive" | "qr" | "topup" | "withdrawal" | "refund";

export type TxStatus = "settled" | "processing" | "failed" | "refunded";

export interface ProviderEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
}

export interface PayProvider {
  id: ProviderId;
  name: string;
  short: string;
  operator: string;
  kind: ProviderKind;
  feeRate: number;
  baseUrl: string;
  apiVersion: string;
  auth: string;
  settlement: string;
  gatewayDelayMs: number;
  failRate: number;
  channel: string;
  since: string;
  future?: string;
  endpoints: ProviderEndpoint[];
}

export type WalletId = "gw" | "om" | "momo";

export interface PayWallet {
  id: WalletId;
  name: string;
  holder: string;
  kind: "principal" | "mobile";
  providerId?: ProviderId;
  currency: "FCFA";
  balance: number;
  dailyLimit: number;
  todaySpent: number;
  phone?: string;
  linked: boolean;
  lastSync: string;
}

export interface PayTx {
  id: string;
  kind: TxKind;
  title: string;
  detail?: string;
  counterparty: string;
  method: ProviderId | "gw-wallet";
  amount: number;
  fee: number;
  status: TxStatus;
  createdAt: string;
  hash: string;
}

export interface PayMerchant {
  id: string;
  name: string;
  category: string;
  city: string;
  phone: string;
  nif: string;
}

export type ProviderEventType =
  | "payment.settled"
  | "payment.failed"
  | "wallet.credited"
  | "connector.health";

export interface ProviderEvent {
  id: string;
  providerId: ProviderId;
  type: ProviderEventType;
  summary: string;
  at: string;
}

export interface PayConfig {
  autoFees: boolean;
  webhooks: boolean;
  maintenance: boolean;
  webhookUrl: string;
  dailyLimitGw: number;
  pixKey: string;
}

export interface PayState {
  wallets: PayWallet[];
  transactions: PayTx[];
  providerStates: Record<ProviderId, ConnectorState>;
  events: ProviderEvent[];
  config: PayConfig;
}

/** Formatação monetária FCFA com separador de milhares. */
export function fmtFcfa(n: number): string {
  return `${new Intl.NumberFormat("pt-PT").format(Math.round(n))} FCFA`;
}

/** Formatação compacta para KPIs (ex.: 1,25 M). */
export function fmtFcfaShort(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace(".", ",")} M FCFA`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(n === 0 ? 0 : 1).replace(".", ",")} mil FCFA`;
  return `${n.toLocaleString("pt-PT")} FCFA`;
}

/** Data ISO relativa (em dias atrás) para semear o histórico. */
export function daysAgo(days: number, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, Math.floor(Math.random() * 59), 0, 0);
  return d.toISOString();
}

const dateFmt = new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

export function fmtDate(iso: string): string {
  try {
    return dateFmt.format(new Date(iso));
  } catch {
    return iso;
  }
}