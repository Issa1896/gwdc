"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { HEALTH_SEED, SEED_VERSION } from "@/data/health";
import type { Consulta, ConsultaStatus, ConsultaTipo, HealthConfig, HealthState } from "@/data/health/types";

const STORAGE_KEY = "gw-health-store:v1";

interface HealthContextValue {
  state: HealthState;
  agendarConsulta: (input: { patientId: string; medicoId: string; tipo: ConsultaTipo; data: string; motivo: string }) => void;
  setConsultaStatus: (id: string, status: ConsultaStatus) => void;
  registrarVacina: (input: { patientId: string; nome: string; dose: string; unidade: string }) => void;
  ajustarStock: (id: string, delta: number) => void;
  setSurtoStatus: (id: string, status: HealthState["surtos"][number]["situacao"]) => void;
  toggleConfig: (key: keyof HealthConfig, value: boolean) => void;
  reset: () => void;
}

const HealthContext = createContext<HealthContextValue | null>(null);

/** GW Health — Saúde Digital Conectada: estado persistido no navegador. */
export function HealthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HealthState>(() => JSON.parse(JSON.stringify(HEALTH_SEED)));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { version: number; state: Partial<HealthState> };
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

  const agendarConsulta = useCallback(
    ({ patientId, medicoId, tipo, data, motivo }: { patientId: string; medicoId: string; tipo: ConsultaTipo; data: string; motivo: string }) => {
      const consulta: Consulta = {
        id: `cs-${Date.now()}`,
        patientId,
        medicoId,
        tipo,
        data,
        motivo,
        status: "agendada",
      };
      setState((prev) => ({ ...prev, consultas: [consulta, ...prev.consultas] }));
    },
    [],
  );

  const setConsultaStatus = useCallback((id: string, status: ConsultaStatus) => {
    setState((prev) => ({
      ...prev,
      consultas: prev.consultas.map((c) => (c.id === id ? { ...c, status } : c)),
    }));
  }, []);

  const registrarVacina = useCallback(
    ({ patientId, nome, dose, unidade }: { patientId: string; nome: string; dose: string; unidade: string }) => {
      const vacina = { id: `vac-${Date.now()}`, patientId, nome, dose, data: new Date().toISOString(), unidade };
      setState((prev) => ({ ...prev, vacinas: [vacina, ...prev.vacinas] }));
    },
    [],
  );

  const ajustarStock = useCallback((id: string, delta: number) => {
    setState((prev) => ({
      ...prev,
      medicamentos: prev.medicamentos.map((m) =>
        m.id === id ? { ...m, stock: Math.max(0, m.stock + delta) } : m,
      ),
    }));
  }, []);

  const setSurtoStatus = useCallback((id: string, status: HealthState["surtos"][number]["situacao"]) => {
    setState((prev) => ({
      ...prev,
      surtos: prev.surtos.map((s) => (s.id === id ? { ...s, situacao: status } : s)),
    }));
  }, []);

  const toggleConfig = useCallback((key: keyof HealthConfig, value: boolean) => {
    setState((prev) => ({ ...prev, config: { ...prev.config, [key]: value } }));
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignora */
    }
    setState(JSON.parse(JSON.stringify(HEALTH_SEED)));
  }, []);

  const value = useMemo(
    () => ({
      state,
      agendarConsulta,
      setConsultaStatus,
      registrarVacina,
      ajustarStock,
      setSurtoStatus,
      toggleConfig,
      reset,
    }),
    [state, agendarConsulta, setConsultaStatus, registrarVacina, ajustarStock, setSurtoStatus, toggleConfig, reset],
  );

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
}

export function useHealth(): HealthContextValue {
  const ctx = useContext(HealthContext);
  if (!ctx) throw new Error("useHealth deve ser usado dentro de <HealthProvider>.");
  return ctx;
}