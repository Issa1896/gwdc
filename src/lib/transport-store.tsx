"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { TRANSPORT_SEED, SEED_VERSION } from "@/data/transport";
import type {
  BilheteDigital,
  BilheteStatus,
  ModalidadeTransporte,
  TransportState,
  VeiculoStatus,
} from "@/data/transport/types";

const STORAGE_KEY = "gw-transport-store:v1";

interface TransportContextValue {
  state: TransportState;
  comprarBilhete: (input: {
    passageiroNome: string;
    passageiroBI: string;
    passageiroTelefone: string;
    rotaId: string;
    dataViagem: string;
    horarioPartida: string;
    assento?: string;
  }) => BilheteDigital;
  validarBilhete: (numeroBilhete: string) => boolean;
  cancelarBilhete: (id: string) => void;
  atualizarStatusVeiculo: (veiculoId: string, status: VeiculoStatus) => void;
  reset: () => void;
}

const TransportContext = createContext<TransportContextValue | null>(null);

export function TransportProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TransportState>(() => JSON.parse(JSON.stringify(TRANSPORT_SEED)));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { version: number; state: Partial<TransportState> };
        if (parsed?.version === SEED_VERSION && parsed.state) {
          setState((prev) => ({ ...prev, ...parsed.state }));
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SEED_VERSION, state }));
    } catch {
      /* ignore */
    }
  }, [state]);

  const comprarBilhete = useCallback(
    (input: {
      passageiroNome: string;
      passageiroBI: string;
      passageiroTelefone: string;
      rotaId: string;
      dataViagem: string;
      horarioPartida: string;
      assento?: string;
    }) => {
      const rota = state.rotas.find((r) => r.id === input.rotaId);
      const rotaNome = rota ? `${rota.origem} → ${rota.destino}` : "Rota Geral";
      const modalidade: ModalidadeTransporte = rota?.modalidade || "rodoviario";
      const precoPagoFCFA = rota?.precoFCFA || 3500;
      const randNum = Math.floor(10000 + Math.random() * 90000);
      const numeroBilhete = `GW-BIL-${randNum}`;
      const assento = input.assento || `${Math.floor(1 + Math.random() * 40)}${Math.random() > 0.5 ? "A" : "B"}`;

      const novoBilhete: BilheteDigital = {
        id: `bil-${Date.now()}`,
        numeroBilhete,
        passageiroNome: input.passageiroNome,
        passageiroBI: input.passageiroBI,
        passageiroTelefone: input.passageiroTelefone,
        rotaId: input.rotaId,
        rotaNome,
        modalidade,
        dataViagem: input.dataViagem,
        horarioPartida: input.horarioPartida,
        assento,
        precoPagoFCFA,
        codigoValidacao: `QR-${randNum}-GW`,
        status: "confirmado",
        dataEmissao: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        bilhetes: [novoBilhete, ...prev.bilhetes],
      }));

      return novoBilhete;
    },
    [state.rotas],
  );

  const validarBilhete = useCallback((numeroOuCodigo: string) => {
    let encontrado = false;
    setState((prev) => ({
      ...prev,
      bilhetes: prev.bilhetes.map((b) => {
        if (b.numeroBilhete === numeroOuCodigo || b.codigoValidacao === numeroOuCodigo) {
          encontrado = true;
          return { ...b, status: "validado" as BilheteStatus };
        }
        return b;
      }),
    }));
    return encontrado;
  }, []);

  const cancelarBilhete = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      bilhetes: prev.bilhetes.map((b) => (b.id === id ? { ...b, status: "cancelado" as BilheteStatus } : b)),
    }));
  }, []);

  const atualizarStatusVeiculo = useCallback((veiculoId: string, status: VeiculoStatus) => {
    setState((prev) => ({
      ...prev,
      frota: prev.frota.map((v) => (v.id === veiculoId ? { ...v, status } : v)),
    }));
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setState(JSON.parse(JSON.stringify(TRANSPORT_SEED)));
  }, []);

  return (
    <TransportContext.Provider
      value={{
        state,
        comprarBilhete,
        validarBilhete,
        cancelarBilhete,
        atualizarStatusVeiculo,
        reset,
      }}
    >
      {children}
    </TransportContext.Provider>
  );
}

export function useTransport() {
  const ctx = useContext(TransportContext);
  if (!ctx) throw new Error("useTransport deve ser usado dentro de um TransportProvider");
  return ctx;
}
