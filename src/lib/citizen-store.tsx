"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { CITIZEN_SEED, SEED_VERSION } from "@/data/citizen";
import type {
  CitizenState,
  DocumentoDigital,
  PedidoCidadao,
  UssdSessionState,
} from "@/data/citizen/types";

const STORAGE_KEY = "gw-citizen-store:v1";

interface CitizenContextValue {
  state: CitizenState;
  solicitarServico: (servicoId: string) => PedidoCidadao;
  adicionarDocumento: (doc: Omit<DocumentoDigital, "id">) => DocumentoDigital;
  enviarComandoUssd: (input: string) => void;
  reiniciarUssd: () => void;
  reset: () => void;
}

const CitizenContext = createContext<CitizenContextValue | null>(null);

export function CitizenProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CitizenState>(() => JSON.parse(JSON.stringify(CITIZEN_SEED)));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { version: number; state: Partial<CitizenState> };
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

  const solicitarServico = useCallback(
    (servicoId: string) => {
      const servico = state.servicos.find((s) => s.id === servicoId);
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const year = new Date().getFullYear();
      const codigoAcompanhamento = `PED-${year}-${randNum}`;

      const novoPedido: PedidoCidadao = {
        id: `ped-${Date.now()}`,
        codigoAcompanhamento,
        servicoNome: servico?.nome || "Serviço Público Geral",
        categoria: servico?.categoria || "Identidade & Civil",
        orgaoResponsavel: servico?.orgao || "Chancelaria do Estado",
        dataSolicitacao: new Date().toISOString().split("T")[0],
        status: "em_analise",
        prazoDiasUteis: 3,
        taxaFCFA: servico?.taxaFCFA || 0,
      };

      setState((prev) => ({
        ...prev,
        pedidos: [novoPedido, ...prev.pedidos],
      }));

      return novoPedido;
    },
    [state.servicos],
  );

  const adicionarDocumento = useCallback((doc: Omit<DocumentoDigital, "id">) => {
    const novoDoc: DocumentoDigital = {
      id: `doc-${Date.now()}`,
      ...doc,
    };

    setState((prev) => ({
      ...prev,
      documentos: [novoDoc, ...prev.documentos],
    }));

    return novoDoc;
  }, []);

  const enviarComandoUssd = useCallback((input: string) => {
    setState((prev) => {
      const trim = input.trim();
      let novoMenu: UssdSessionState["menuAtual"] = prev.ussd.menuAtual;
      let resposta = "";

      if (trim === "*123#" || prev.ussd.menuAtual === "raiz") {
        if (trim === "1") {
          novoMenu = "certidoes";
          resposta = "GOV.GW Certidões:\n1. Nascimento\n2. Criminal\n3. Casamento\n0. Voltar";
        } else if (trim === "2") {
          novoMenu = "vacinas";
          resposta = "GW Health Vacinas:\n1. Febre Amarela: Válida\n2. Cólera: Imunizado\n3. COVID: Completo\n0. Voltar";
        } else if (trim === "3") {
          novoMenu = "transportes";
          resposta = "GW Transport:\n1. Bissau-Bafatá (3.500)\n2. Barco Bubaque (7.500)\n3. Barco Bolama (4.500)\n0. Voltar";
        } else if (trim === "4") {
          novoMenu = "resultado";
          resposta = "Processos no Protocolo:\nGW-2026-00412: DESPACHADO\nAssento de nascimento pronto.\n0. Menu Principal";
        } else if (trim === "0") {
          novoMenu = "raiz";
          resposta = "Sessão finalizada. Obrigado por utilizar o GOV.GW (*123#).";
        } else {
          novoMenu = "raiz";
          resposta = "GOV.GW Serviços (*123#)\n1. Certidões\n2. Vacinas\n3. Transportes\n4. Processos\n0. Sair";
        }
      } else {
        if (trim === "0") {
          novoMenu = "raiz";
          resposta = "GOV.GW Serviços (*123#)\n1. Certidões\n2. Vacinas\n3. Transportes\n4. Processos\n0. Sair";
        } else {
          novoMenu = "resultado";
          resposta = "Solicitação recebida com sucesso via USSD! O código de validação foi enviado por SMS para o seu número.\n0. Voltar";
        }
      }

      return {
        ...prev,
        ussd: {
          menuAtual: novoMenu,
          historicoMensagem: input,
          respostaTela: resposta,
        },
      };
    });
  }, []);

  const reiniciarUssd = useCallback(() => {
    setState((prev) => ({
      ...prev,
      ussd: {
        menuAtual: "raiz",
        historicoMensagem: "",
        respostaTela: "GOV.GW Serviços (*123#)\n1. Certidões\n2. Vacinas\n3. Transportes\n4. Processos\n0. Sair",
      },
    }));
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setState(JSON.parse(JSON.stringify(CITIZEN_SEED)));
  }, []);

  return (
    <CitizenContext.Provider
      value={{
        state,
        solicitarServico,
        adicionarDocumento,
        enviarComandoUssd,
        reiniciarUssd,
        reset,
      }}
    >
      {children}
    </CitizenContext.Provider>
  );
}

export function useCitizen() {
  const ctx = useContext(CitizenContext);
  if (!ctx) throw new Error("useCitizen deve ser usado dentro de um CitizenProvider");
  return ctx;
}
