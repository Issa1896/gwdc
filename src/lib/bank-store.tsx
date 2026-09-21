"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { BANK_SEED, SEED_VERSION } from "@/data/bank";
import type {
  Account,
  BankConfig,
  BankState,
  BankTx,
  Card,
  ConsentStatus,
} from "@/data/bank/types";

const STORAGE_KEY = "gw-bank-store:v1";

export interface TransferInput {
  from: string;
  to: string;
  amount: number;
  note?: string;
  external?: boolean;
}

export interface TransferResult {
  ok: boolean;
  tx: BankTx;
  message: string;
  alertCreated: boolean;
}

export interface OpenAccountInput {
  name: string;
  kind: "checking" | "savings";
}

interface BankContextValue {
  state: BankState;
  transfer: (input: TransferInput) => TransferResult;
  requestCard: (input: { name: string; network: Card["network"]; kind: Card["kind"] }) => string;
  toggleCard: (id: string) => void;
  setCardLimit: (id: string, limit: number) => void;
  setBudget: (id: string, limit: number) => void;
  spendBudget: (id: string, amount: number) => void;
  openAccount: (input: OpenAccountInput) => Account;
  grantConsent: (input: { partner: string; entity: string; scopes: string[] }) => void;
  revokeConsent: (id: string) => void;
  renewConsent: (id: string) => void;
  resolveAlert: (id: string, action: "reviewed" | "blocked") => void;
  toggleConfig: (key: keyof BankConfig, value: boolean) => void;
  reset: () => void;
}

const BankContext = createContext<BankContextValue | null>(null);

function makeAccount(input: OpenAccountInput, count: number): Account {
  return {
    id: `acc-${Date.now().toString(36)}`,
    name: input.name,
    holder: "GW Digital Company · Direção Financeira",
    kind: input.kind,
    number: `${input.kind === "savings" ? "PO" : "OD"}-2041 ${String(1000 + count).padStart(4, "0")} ${String(1000 + count).padStart(4, "0")}`,
    iban: `GW88 BBBB 0100 0000 ${String(4321 + count).padStart(4, "0")} ${String(8765).padStart(4, "0")} ${String(count * 11)}`,
    balance: 0,
    limit: input.kind === "savings" ? 500_000 : 1_500_000,
    interestRate: input.kind === "savings" ? 3.5 : undefined,
    createdAt: new Date().toISOString().slice(0, 10),
    status: "active",
  };
}

/** GW Bank — Banco Digital Soberano: estado persistido no navegador. */
export function BankProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BankState>(() => JSON.parse(JSON.stringify(BANK_SEED)));
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { version: number; state: Partial<BankState> };
        if (parsed?.version === SEED_VERSION && parsed.state) {
          setState((prev) => ({ ...prev, ...parsed.state }));
        }
      }
    } catch {
      /* armazenamento indisponível */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SEED_VERSION, state }));
    } catch {
      /* sem armazenamento */
    }
  }, [state]);

  const transfer = useCallback((input: TransferInput): TransferResult => {
    const value = Math.round(input.amount * 100) / 100;
    if (!Number.isFinite(value) || value <= 0) throw new Error("Informe um valor válido maior que zero.");
    if (input.from === input.to && !input.external) throw new Error("Selecione contas diferentes.");

    const { config } = stateRef.current;
    const from = stateRef.current.accounts.find((a) => a.id === input.from);
    const to = input.external ? null : stateRef.current.accounts.find((a) => a.id === input.to);
    if (!from) throw new Error("Conta de origem inválida.");
    if (value > from.balance) throw new Error(`Saldo insuficiente (${from.balance.toLocaleString("pt-PT")} FCFA).`);
    if (value > config.maxTransfer) throw new Error(`Valor acima do limite máximo (${config.maxTransfer.toLocaleString("pt-PT")} FCFA).`);
    if (value > from.limit) throw new Error(`Valor acima do limite da conta origem (${from.limit.toLocaleString("pt-PT")} FCFA).`);

    const hash = [...value.toString(), input.to, Date.now().toString(36)].join(":").split("").reduce((h, c) => ((h * 31 + c.charCodeAt(0)) | 0), 7).toString(16).padStart(12, "0").toUpperCase().slice(0, 12);
    const txId = `GWBTX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const now = new Date().toISOString();

    const tx: BankTx = {
      id: txId,
      kind: "transfer",
      title: input.note?.trim() || (input.external ? "Transferência externa (PIX) — GW Pay" : "Transferência entre contas"),
      counterparty: input.external ? "Banco parceiro / chave PIX" : to?.name ?? "—",
      accountId: input.from,
      amount: -value,
      fee: 0,
      status: "settled",
      category: "Transferências",
      createdAt: now,
      hash,
    };

    const alertTriggered = config.autoblock && value > config.maxTransfer;

    setState((prev) => {
      const nextAccounts = prev.accounts.map((a) => {
        if (a.id === input.from) return { ...a, balance: a.balance - value };
        if (!input.external && a.id === input.to) return { ...a, balance: a.balance + value };
        return a;
      });
      const alertRow = alertTriggered
        ? {
            id: `fa-${Date.now()}`,
            title: "Transferência acima do padrão (automático)",
            details: `Valor ${value.toLocaleString("pt-PT")} FCFA acima do limite de confiança — alerta gerado automaticamente pelo motor antifraude.`,
            severity: "media" as const,
            score: 76,
            amount: value,
            counterparty: input.external ? "Banco parceiro" : input.to,
            status: "pending" as const,
            createdAt: now,
          }
        : null;
      return {
        ...prev,
        accounts: nextAccounts,
        transactions: [tx, ...prev.transactions],
        fraudAlerts: alertRow ? [alertRow, ...prev.fraudAlerts] : prev.fraudAlerts,
      };
    });

    return {
      ok: true,
      tx,
      message: input.external
        ? "Liquidado pela infraestrutura PIX do GW Pay (barramento GWDC)."
        : `Creditado em ${to?.name ?? "destino"}.`,
      alertCreated: alertTriggered,
    };
  }, []);

  const requestCard = useCallback(
    ({ name, network, kind }: { name: string; network: Card["network"]; kind: Card["kind"] }): string => {
      const id = `crd-${Date.now().toString(36)}`;
      const last4 = String(Math.floor(1000 + Math.random() * 9000));
      const card: Card = {
        id,
        name,
        network,
        kind,
        status: "requested",
        last4: kind === "virtual" ? last4 : "----",
        expiry: kind === "virtual" ? "12/29" : "—",
        limit: kind === "virtual" ? 300_000 : 800_000,
        usedToday: 0,
        color: kind === "virtual" ? "#0EA5E9" : "#0F766E",
      };
      setState((prev) => ({ ...prev, cards: [card, ...prev.cards] }));
      return id;
    },
    [],
  );

  const toggleCard = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      cards: prev.cards.map((c) =>
        c.id === id && c.status !== "requested"
          ? { ...c, status: c.status === "active" ? "blocked" : "active" }
          : c,
      ),
    }));
  }, []);

  const setCardLimit = useCallback((id: string, limit: number) => {
    setState((prev) => ({
      ...prev,
      cards: prev.cards.map((c) => (c.id === id ? { ...c, limit } : c)),
    }));
  }, []);

  const setBudget = useCallback((id: string, limit: number) => {
    setState((prev) => ({
      ...prev,
      budgets: prev.budgets.map((b) => (b.id === id ? { ...b, limit } : b)),
    }));
  }, []);

  const spendBudget = useCallback((id: string, amount: number) => {
    setState((prev) => ({
      ...prev,
      budgets: prev.budgets.map((b) => (b.id === id ? { ...b, spent: Math.max(0, b.spent + amount) } : b)),
    }));
  }, []);

  const openAccount = useCallback((input: OpenAccountInput): Account => {
    const account = makeAccount(input, stateRef.current.accounts.length);
    setState((prev) => ({ ...prev, accounts: [...prev.accounts, account] }));
    return account;
  }, []);

  const grantConsent = useCallback(
    ({ partner, entity, scopes }: { partner: string; entity: string; scopes: string[] }) => {
      setState((prev) => ({
        ...prev,
        consents: [
          {
            id: `cst-${Date.now()}`,
            partner,
            entity,
            scopes,
            status: "active" as ConsentStatus,
            grantedAt: new Date().toISOString().slice(0, 10),
            expiresAt: new Date(Date.now() + 180 * 864e5).toISOString().slice(0, 10),
          },
          ...prev.consents,
        ],
      }));
    },
    [],
  );

  const revokeConsent = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      consents: prev.consents.map((c) => (c.id === id ? { ...c, status: "revoked" as ConsentStatus } : c)),
    }));
  }, []);

  const renewConsent = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      consents: prev.consents.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "active" as ConsentStatus,
              grantedAt: new Date().toISOString().slice(0, 10),
              expiresAt: new Date(Date.now() + 180 * 864e5).toISOString().slice(0, 10),
            }
          : c,
      ),
    }));
  }, []);

  const resolveAlert = useCallback((id: string, action: "reviewed" | "blocked") => {
    setState((prev) => ({
      ...prev,
      fraudAlerts: prev.fraudAlerts.map((a) => (a.id === id ? { ...a, status: action } : a)),
    }));
  }, []);

  const toggleConfig = useCallback((key: keyof BankConfig, value: boolean) => {
    setState((prev) => ({ ...prev, config: { ...prev.config, [key]: value } }));
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignora */
    }
    setState(JSON.parse(JSON.stringify(BANK_SEED)));
  }, []);

  const value = useMemo(
    () => ({
      state,
      transfer,
      requestCard,
      toggleCard,
      setCardLimit,
      setBudget,
      spendBudget,
      openAccount,
      grantConsent,
      revokeConsent,
      renewConsent,
      resolveAlert,
      toggleConfig,
      reset,
    }),
    [state, transfer, requestCard, toggleCard, setCardLimit, setBudget, spendBudget, openAccount, grantConsent, revokeConsent, renewConsent, resolveAlert, toggleConfig, reset],
  );

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
}

export function useBank(): BankContextValue {
  const ctx = useContext(BankContext);
  if (!ctx) throw new Error("useBank deve ser usado dentro de <BankProvider>.");
  return ctx;
}