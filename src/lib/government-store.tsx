"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { GOVERNMENT_SEED, SEED_VERSION } from "@/data/government";
import type {
  CertidaoEmitida,
  CertidaoTipo,
  CidadaoGW,
  Despacho,
  DespachoDecisao,
  GovernmentConfig,
  GovernmentState,
  ProcessoPrioridade,
  ProcessoProtocolo,
  ProcessoStatus,
} from "@/data/government/types";

const STORAGE_KEY = "gw-government-store:v1";

interface GovernmentContextValue {
  state: GovernmentState;
  protocolarProcesso: (input: {
    requerenteNome: string;
    requerenteBI: string;
    requerenteTelefone: string;
    ministerioDestino: string;
    assunto: string;
    categoria: ProcessoProtocolo["categoria"];
    descricao: string;
    prioridade: ProcessoPrioridade;
  }) => ProcessoProtocolo;
  adicionarDespacho: (
    processoId: string,
    input: {
      autor: string;
      cargo: string;
      orgao: string;
      texto: string;
      decisao: DespachoDecisao;
      novoStatus?: ProcessoStatus;
    },
  ) => void;
  atualizarStatusProcesso: (processoId: string, status: ProcessoStatus) => void;
  emitirCertidao: (input: {
    tipo: CertidaoTipo;
    titularNome: string;
    numeroBI: string;
    orgaoEmissor: string;
  }) => CertidaoEmitida;
  cadastrarCidadao: (input: Omit<CidadaoGW, "id">) => CidadaoGW;
  toggleConfig: (key: keyof GovernmentConfig, value: boolean) => void;
  reset: () => void;
}

const GovernmentContext = createContext<GovernmentContextValue | null>(null);

/** GW Government — Governo Digital e Protocolo Eletrónico da Guiné-Bissau. */
export function GovernmentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GovernmentState>(() => JSON.parse(JSON.stringify(GOVERNMENT_SEED)));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { version: number; state: Partial<GovernmentState> };
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

  const protocolarProcesso = useCallback(
    (input: {
      requerenteNome: string;
      requerenteBI: string;
      requerenteTelefone: string;
      ministerioDestino: string;
      assunto: string;
      categoria: ProcessoProtocolo["categoria"];
      descricao: string;
      prioridade: ProcessoPrioridade;
    }) => {
      const year = new Date().getFullYear();
      const count = state.processos.length + 416;
      const numeroProtocolo = `GW-${year}-${String(count).padStart(5, "0")}`;

      const novoProcesso: ProcessoProtocolo = {
        id: `prc-${Date.now()}`,
        numeroProtocolo,
        ...input,
        status: "recebido",
        dataAbertura: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
        despachos: [
          {
            id: `dsp-${Date.now()}`,
            autor: "Sistema de Protocolo Único",
            cargo: "Automação Governamental",
            orgao: "GOV.GW Central",
            data: new Date().toISOString(),
            texto: `Processo protocolado com sucesso sob número ${numeroProtocolo}. Encaminhado ao Ministério competente (${input.ministerioDestino}).`,
            decisao: "encaminhamento",
          },
        ],
        anexos: ["requerimento_protocolado.pdf"],
      };

      setState((prev) => ({
        ...prev,
        processos: [novoProcesso, ...prev.processos],
      }));

      return novoProcesso;
    },
    [state.processos.length],
  );

  const adicionarDespacho = useCallback(
    (
      processoId: string,
      input: {
        autor: string;
        cargo: string;
        orgao: string;
        texto: string;
        decisao: DespachoDecisao;
        novoStatus?: ProcessoStatus;
      },
    ) => {
      const novoDespacho: Despacho = {
        id: `dsp-${Date.now()}`,
        autor: input.autor,
        cargo: input.cargo,
        orgao: input.orgao,
        data: new Date().toISOString(),
        texto: input.texto,
        decisao: input.decisao,
      };

      setState((prev) => ({
        ...prev,
        processos: prev.processos.map((p) => {
          if (p.id !== processoId) return p;
          const status = input.novoStatus || (input.decisao === "favoravel" ? "concluido" : input.decisao === "desfavoravel" ? "indeferido" : "despachado");
          return {
            ...p,
            status,
            dataAtualizacao: new Date().toISOString(),
            despachos: [...p.despachos, novoDespacho],
          };
        }),
      }));
    },
    [],
  );

  const atualizarStatusProcesso = useCallback((processoId: string, status: ProcessoStatus) => {
    setState((prev) => ({
      ...prev,
      processos: prev.processos.map((p) =>
        p.id === processoId ? { ...p, status, dataAtualizacao: new Date().toISOString() } : p,
      ),
    }));
  }, []);

  const emitirCertidao = useCallback(
    (input: {
      tipo: CertidaoTipo;
      titularNome: string;
      numeroBI: string;
      orgaoEmissor: string;
    }) => {
      const year = new Date().getFullYear();
      const code = Math.random().toString(36).substring(2, 6).toUpperCase();
      const randHash = Math.random().toString(16).substring(2, 18);
      const prefix = input.tipo === "nascimento" ? "CRN" : input.tipo === "registo_criminal" ? "CRC" : input.tipo === "casamento" ? "CRM" : "CRD";
      const numeroCertidao = `${prefix}-${year}-${String(Math.floor(1000 + Math.random() * 9000))}`;

      const novaCertidao: CertidaoEmitida = {
        id: `crt-${Date.now()}`,
        ...input,
        numeroCertidao,
        dataEmissao: new Date().toISOString().split("T")[0],
        codigoValidacao: `VLD-${code}-${year}`,
        hashAutenticidade: `sha256:${randHash}...`,
        status: "valida",
      };

      setState((prev) => ({
        ...prev,
        certidoes: [novaCertidao, ...prev.certidoes],
      }));

      return novaCertidao;
    },
    [],
  );

  const cadastrarCidadao = useCallback((input: Omit<CidadaoGW, "id">) => {
    const novoCidadao: CidadaoGW = {
      id: `cid-${Date.now()}`,
      ...input,
    };

    setState((prev) => ({
      ...prev,
      cidadaos: [novoCidadao, ...prev.cidadaos],
    }));

    return novoCidadao;
  }, []);

  const toggleConfig = useCallback((key: keyof GovernmentConfig, value: boolean) => {
    setState((prev) => ({ ...prev, config: { ...prev.config, [key]: value } }));
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setState(JSON.parse(JSON.stringify(GOVERNMENT_SEED)));
  }, []);

  return (
    <GovernmentContext.Provider
      value={{
        state,
        protocolarProcesso,
        adicionarDespacho,
        atualizarStatusProcesso,
        emitirCertidao,
        cadastrarCidadao,
        toggleConfig,
        reset,
      }}
    >
      {children}
    </GovernmentContext.Provider>
  );
}

export function useGovernment() {
  const ctx = useContext(GovernmentContext);
  if (!ctx) throw new Error("useGovernment deve ser usado dentro de um GovernmentProvider");
  return ctx;
}
