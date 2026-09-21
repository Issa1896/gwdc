"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { PAY_SEED, SEED_VERSION, PROVIDER_NAMES } from "@/data/pay";
import { getProvider } from "@/data/pay/providers";
import { providerRequest, receiptHash } from "@/data/pay/gateway";
import type {
  PayConfig,
  PayState,
  PayTx,
  ProviderId,
  WalletId,
} from "@/data/pay/types";

const STORAGE_KEY = "gw-pay-store:v1";

export interface PayInput {
  method: ProviderId | "gw-wallet";
  amount: number;
  destination: string;
  note?: string;
}

export interface PayResult {
  ok: boolean;
  tx: PayTx;
  providerName: string;
  latencyMs: number;
  fee: number;
  total: number;
  message: string;
}

interface PayContextValue {
  state: PayState;
  pay: (input: PayInput) => Promise<PayResult>;
  simulateIncoming: (amount: number, method: ProviderId | "gw-wallet", note?: string) => PayTx;
  syncWallet: (walletId: WalletId) => void;
  toggleProvider: (id: ProviderId) => void;
  toggleConfig: (key: keyof PayConfig, value: boolean | string) => void;
  reset: () => void;
}

const PayContext = createContext<PayContextValue | null>(null);

/** GW Pay — Banco Digital: estado operacional persistido no navegador. */
export function PayProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PayState>(() => JSON.parse(JSON.stringify(PAY_SEED)));
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { version: number; state: Partial<PayState> };
        if (parsed?.version === SEED_VERSION && parsed.state) {
          setState((prev) => ({
            ...prev,
            ...parsed.state,
            providerStates: { ...PAY_SEED.providerStates, ...parsed.state.providerStates },
          }));
        }
      }
    } catch {
      /* armazenamento indisponível — usa o seed */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SEED_VERSION, state }));
    } catch {
      /* sem armazenamento */
    }
  }, [state]);

  const pay = useCallback(async (input: PayInput): Promise<PayResult> => {
    const value = Math.round(input.amount * 100) / 100;
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error("Informe um valor válido maior que zero.");
    }
    const provider = input.method === "gw-wallet" ? null : getProvider(input.method);
    const { autoFees, dailyLimitGw } = stateRef.current.config;
    const fee = provider && autoFees ? Math.round(value * provider.feeRate) : 0;
    const total = value + fee;
    const gw = stateRef.current.wallets.find((w) => w.id === "gw");

    if (!gw) throw new Error("Carteira principal indisponível.");
    if (total > gw.balance) throw new Error(`Saldo insuficiente — precisa de ${total.toLocaleString("pt-PT")} FCFA.`);
    if (gw.todaySpent + total > dailyLimitGw) {
      throw new Error(`Limite diário excedido (${dailyLimitGw.toLocaleString("pt-PT")} FCFA).`);
    }

    const stamp = `${input.destination}:${value}:${Date.now()}`;
    const txId = `GWP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const tx: PayTx = {
      id: txId,
      kind: input.method === "gw-pix" ? "qr" : "transfer",
      title: input.note?.trim() || `Pagamento via ${provider ? provider.short : "Carteira GW"}`,
      detail: input.note?.trim() || undefined,
      counterparty: input.destination,
      method: input.method,
      amount: -total,
      fee,
      status: "processing",
      createdAt: new Date().toISOString(),
      hash: receiptHash(stamp),
    };

    const appendTx = (updated: PayTx) =>
      setState((prev) => ({
        ...prev,
        transactions: [updated, ...prev.transactions],
        wallets: prev.wallets.map((w) =>
          w.id === "gw"
            ? { ...w, todaySpent: updated.status === "settled" ? w.todaySpent + total : w.todaySpent }
            : w,
        ),
      }));

    appendTx(tx);

    if (!provider) {
      const settled: PayTx = { ...tx, status: "settled" };
      setState((prev) => ({
        ...prev,
        transactions: prev.transactions.map((t) => (t.id === txId ? settled : t)),
        wallets: prev.wallets.map((w) =>
          w.id === "gw" ? { ...w, balance: w.balance - total } : w,
        ),
        events: [
          { id: `EVT-${Date.now()}`, providerId: "gw-pix", type: "payment.settled", summary: `Transferência interna ${total.toLocaleString("pt-PT")} FCFA liquidada`, at: new Date().toISOString() },
          ...prev.events,
        ],
      }));
      return { ok: true, tx: settled, providerName: "Carteira GW", latencyMs: 18, fee, total, message: "Liquidado internamente na carteira GW." };
    }

    const res = await providerRequest(provider.id, "collection", stamp);
    const settled: PayTx = { ...tx, status: res.ok ? "settled" : "failed" };
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) => (t.id === txId ? settled : t)),
      wallets: res.ok
        ? prev.wallets.map((w) => (w.id === "gw" ? { ...w, balance: w.balance - total } : w))
        : prev.wallets,
      events: [
        {
          id: `EVT-${Date.now()}`,
          providerId: provider.id,
          type: res.ok ? "payment.settled" : "payment.failed",
          summary: res.ok
            ? `${provider.short}: ${total.toLocaleString("pt-PT")} FCFA liquidados`
            : `${provider.short}: cobrança recusada — nenhuma taxa aplicada`,
          at: new Date().toISOString(),
        },
        ...prev.events,
      ],
    }));
    return { ok: res.ok, tx: settled, providerName: provider.short, latencyMs: res.latencyMs, fee, total, message: res.message };
  }, []);

  const simulateIncoming = useCallback(
    (value: number, method: ProviderId | "gw-wallet", note?: string): PayTx => {
      const amount = Math.round(value * 100) / 100;
      const tx: PayTx = {
        id: `GWP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        kind: "receive",
        title: note?.trim() || `Recebimento via ${method === "gw-wallet" ? "Carteira GW" : PROVIDER_NAMES[method]} (webhook)`,
        detail: note?.trim() || undefined,
        counterparty: "Entidade externa — FSP conectada",
        method,
        amount,
        fee: 0,
        status: "settled",
        createdAt: new Date().toISOString(),
        hash: receiptHash(`in:${amount}:${Date.now()}`),
      };
      setState((prev) => ({
        ...prev,
        transactions: [tx, ...prev.transactions],
        wallets: prev.wallets.map((w) => (w.id === "gw" ? { ...w, balance: w.balance + amount } : w)),
        events: [
          {
            id: `EVT-${Date.now()}`,
            providerId: method === "gw-wallet" ? "gw-pix" : method,
            type: "wallet.credited",
            summary: `Crédito ${amount.toLocaleString("pt-PT")} FCFA registado por webhook`,
            at: new Date().toISOString(),
          },
          ...prev.events,
        ],
      }));
      return tx;
    },
    [],
  );

  const syncWallet = useCallback((walletId: WalletId) => {
    setState((prev) => {
      const target = prev.wallets.find((w) => w.id === walletId);
      if (!target) return prev;
      const delta = Math.round((Math.random() - 0.35) * target.balance * 0.05);
      return {
        ...prev,
        wallets: prev.wallets.map((w) =>
          w.id === walletId
            ? {
                ...w,
                balance: Math.max(0, w.balance + delta),
                linked: true,
                lastSync: new Date().toISOString(),
              }
            : w,
        ),
        events: [
          {
            id: `EVT-${Date.now()}`,
            providerId: target.providerId ?? "gw-pix",
            type: "connector.health",
            summary: `Carteira ${target.name} sincronizada — saldo ${Math.max(0, target.balance + delta).toLocaleString("pt-PT")} FCFA`,
            at: new Date().toISOString(),
          },
          ...prev.events,
        ],
      };
    });
  }, []);

  const toggleProvider = useCallback((id: ProviderId) => {
    setState((prev) => {
      if (id === "iban") return prev;
      const next: PayState["providerStates"] = { ...prev.providerStates, [id]: prev.providerStates[id] === "disabled" ? "connected" : "disabled" };
      return { ...prev, providerStates: next };
    });
  }, []);

  const toggleConfig = useCallback((key: keyof PayConfig, value: boolean | string) => {
    setState((prev) => ({ ...prev, config: { ...prev.config, [key]: value } }));
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignora */
    }
    setState(JSON.parse(JSON.stringify(PAY_SEED)));
  }, []);

  const value = useMemo(
    () => ({ state, pay, simulateIncoming, syncWallet, toggleProvider, toggleConfig, reset }),
    [state, pay, simulateIncoming, syncWallet, toggleProvider, toggleConfig, reset],
  );

  return <PayContext.Provider value={value}>{children}</PayContext.Provider>;
}

export function usePay(): PayContextValue {
  const ctx = useContext(PayContext);
  if (!ctx) throw new Error("usePay deve ser usado dentro de <PayProvider>.");
  return ctx;
}