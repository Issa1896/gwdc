/** GW Bank — Banco Digital Soberano · Tipos centrais. */

export type AccountKind = "checking" | "savings" | "treasury";

export interface Account {
  id: string;
  name: string;
  holder: string;
  kind: AccountKind;
  number: string;
  iban: string;
  balance: number;
  limit: number;
  interestRate?: number;
  goal?: number;
  createdAt: string;
  status: "active" | "pending";
}

export type CardKind = "virtual" | "physical";

export type CardStatus = "active" | "blocked" | "requested";

export interface Card {
  id: string;
  name: string;
  network: "VISA" | "Mastercard";
  kind: CardKind;
  status: CardStatus;
  last4: string;
  expiry: string;
  limit: number;
  usedToday: number;
  color: string;
}

export type TxKind = "credit" | "debit" | "fee" | "transfer" | "pos" | "savings";

export type TxStatus = "settled" | "processing" | "failed" | "refunded";

export interface BankTx {
  id: string;
  kind: TxKind;
  title: string;
  counterparty: string;
  accountId: string;
  amount: number;
  fee: number;
  status: TxStatus;
  category: string;
  createdAt: string;
  hash: string;
}

export type ConsentStatus = "active" | "revoked" | "expired";

export interface Consent {
  id: string;
  partner: string;
  entity: string;
  scopes: string[];
  status: ConsentStatus;
  grantedAt: string;
  expiresAt: string;
}

export type AlertSeverity = "alta" | "media" | "baixa";

export type AlertStatus = "pending" | "reviewed" | "blocked";

export interface FraudAlert {
  id: string;
  title: string;
  details: string;
  severity: AlertSeverity;
  score: number;
  amount: number;
  counterparty: string;
  status: AlertStatus;
  createdAt: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

export interface BankConfig {
  openFinance: boolean;
  notifications: boolean;
  autoCategorize: boolean;
  mfa: boolean;
  maxTransfer: number;
  atmDailyLimit: number;
  autoblock: boolean;
}

export interface BankState {
  accounts: Account[];
  cards: Card[];
  transactions: BankTx[];
  budgets: Budget[];
  consents: Consent[];
  fraudAlerts: FraudAlert[];
  config: BankConfig;
}

export function fmtFcfa(n: number): string {
  return `${new Intl.NumberFormat("pt-PT").format(Math.round(n))} FCFA`;
}

export function fmtFcfaShort(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace(".", ",")} M FCFA`;
  if (abs >= 1_000) return `${(n / 1_000).toFixed(n === 0 ? 0 : 1).replace(".", ",")} mil FCFA`;
  return `${n.toLocaleString("pt-PT")} FCFA`;
}

export function daysAgo(days: number, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, Math.floor(Math.random() * 59), 0, 0);
  return d.toISOString();
}

const dateFmt = new Intl.DateTimeFormat("pt-PT", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function fmtDate(iso: string): string {
  try {
    return dateFmt.format(new Date(iso));
  } catch {
    return iso;
  }
}

/** Hash determinístico (padrões de QR/exposição visual). */
export function hashStr(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}