"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ClasseProcessual =
  | "Ação Cível Ordinária"
  | "Processo Penal"
  | "Contencioso Administrativo"
  | "Reclamação Trabalhista"
  | "Execução Fiscal";

export type StatusProcesso =
  | "distribuido"
  | "em_instrucao"
  | "audiencia_marcada"
  | "concluso_para_sentenca"
  | "julgado"
  | "arquivado";

export interface MovimentacaoProcessual {
  id: string;
  data: string;
  titulo: string;
  descricao: string;
  responsavel: string;
}

export interface ProcessoJudicial {
  id: string;
  numero: string;
  classe: ClasseProcessual;
  tribunal: string;
  vara: string;
  juiz: string;
  autor: string;
  reu: string;
  advogadoAutor: string;
  assunto: string;
  valorCausa: number;
  status: StatusProcesso;
  prioridade: "normal" | "urgente";
  criadoEm: string;
  movimentacoes: MovimentacaoProcessual[];
}

export interface AudienciaVirtual {
  id: string;
  processoId: string;
  processoNumero: string;
  data: string;
  horario: string;
  tipo: "Conciliação" | "Instrução e Julgamento" | "Oitiva de Testemunhas" | "Preliminar";
  salaVirtualUrl: string;
  status: "agendada" | "em_andamento" | "concluida" | "cancelada";
  magistrado: string;
  partes: string[];
}

export interface CertidaoJudicial {
  id: string;
  codigoAutenticidade: string;
  tipo: "Antecedentes Criminais" | "Distribuição Cível" | "Falência e Recuperação" | "Quitação de Custas";
  requerenteNome: string;
  requerenteDocumento: string;
  finalidade: string;
  resultado: "NADA CONSTA" | "COM APONTAMENTOS";
  emitidaEm: string;
  validaAte: string;
  assinaturaDigital: string;
}

interface JusticeState {
  processos: ProcessoJudicial[];
  audiencias: AudienciaVirtual[];
  certidoes: CertidaoJudicial[];
}

interface JusticeContextType {
  state: JusticeState;
  distribuirProcesso: (novo: Omit<ProcessoJudicial, "id" | "numero" | "status" | "criadoEm" | "movimentacoes">) => ProcessoJudicial;
  protocolarPeticao: (processoId: string, titulo: string, descricao: string, advogado: string) => void;
  agendarAudiencia: (audiencia: Omit<AudienciaVirtual, "id" | "status">) => AudienciaVirtual;
  concluirAudiencia: (audienciaId: string) => void;
  emitirCertidao: (dados: {
    tipo: CertidaoJudicial["tipo"];
    requerenteNome: string;
    requerenteDocumento: string;
    finalidade: string;
  }) => CertidaoJudicial;
  buscarProcessoPorNumero: (numero: string) => ProcessoJudicial | undefined;
}

const SEED_PROCESSOS: ProcessoJudicial[] = [
  {
    id: "proc-001",
    numero: "GW-JUS-2026-0042",
    classe: "Ação Cível Ordinária",
    tribunal: "Tribunal Regional de Bissau",
    vara: "1ª Vara Cível e Comercial",
    juiz: "Dr. Mamadu Serifo Djaló",
    autor: "Sociedade Agrícola de Geba Lda",
    reu: "Cooperativa de Transporte Fluvial Bijagós",
    advogadoAutor: "Dra. Aissatu Mané (OAB-GW nº 182)",
    assunto: "Descumprimento contratual de frete marítimo de castanha de caju",
    valorCausa: 45000000,
    status: "audiencia_marcada",
    prioridade: "urgente",
    criadoEm: "2026-09-12T10:00:00Z",
    movimentacoes: [
      {
        id: "mov-01",
        data: "2026-09-12 10:00",
        titulo: "Petição Inicial Protocolada",
        descricao: "Petição inicial cadastrada eletronicamente com guia de custas autenticada.",
        responsavel: "Secretaria Judiciária Geral",
      },
      {
        id: "mov-02",
        data: "2026-09-14 14:30",
        titulo: "Distribuição por Sorteio Eletrônico",
        descricao: "Processo distribuído aleatoriamente ao Juízo da 1ª Vara Cível de Bissau.",
        responsavel: "Sistema PJe Nacional",
      },
      {
        id: "mov-03",
        data: "2026-09-18 09:15",
        titulo: "Audiência de Conciliação Designada",
        descricao: "Audiência designada em ambiente virtual para mediação das partes.",
        responsavel: "Dr. Mamadu Serifo Djaló",
      },
    ],
  },
  {
    id: "proc-002",
    numero: "GW-JUS-2026-0089",
    classe: "Processo Penal",
    tribunal: "Tribunal Setorial de Bafatá",
    vara: "Vara Criminal de Bafatá",
    juiz: "Dra. Maria Odete Semedo",
    autor: "Ministério Público da República",
    reu: "Investigado em Autos Sigilosos",
    advogadoAutor: "Dr. Carlos Sanhá (Procurador da República)",
    assunto: "Apropriação indébita e fraude tributária aduaneira",
    valorCausa: 12000000,
    status: "em_instrucao",
    prioridade: "urgente",
    criadoEm: "2026-09-08T09:00:00Z",
    movimentacoes: [
      {
        id: "mov-04",
        data: "2026-09-08 09:00",
        titulo: "Denúncia Oferecida pelo Ministério Público",
        descricao: "Autos autuados e convertidos em processo eletrônico.",
        responsavel: "Ministério Público",
      },
      {
        id: "mov-05",
        data: "2026-09-11 11:20",
        titulo: "Recebimento da Denúncia",
        descricao: "Citação eletrônica expedida com prazo legal de resposta.",
        responsavel: "Dra. Maria Odete Semedo",
      },
    ],
  },
  {
    id: "proc-003",
    numero: "GW-JUS-2026-0115",
    classe: "Reclamação Trabalhista",
    tribunal: "Tribunal Regional de Bissau",
    vara: "Vara Especial do Trabalho",
    juiz: "Dr. Bacar Camará",
    autor: "Sindicato dos Estivadores do Porto de Bissau",
    reu: "Empresa Portuária Nacional",
    advogadoAutor: "Dr. Braima Seidi (OAB-GW nº 094)",
    assunto: "Horas extraordinárias e adicional de insalubridade portuária",
    valorCausa: 28500000,
    status: "concluso_para_sentenca",
    prioridade: "normal",
    criadoEm: "2026-08-25T14:00:00Z",
    movimentacoes: [
      {
        id: "mov-06",
        data: "2026-08-25 14:00",
        titulo: "Autuação e Notificação Inicial",
        descricao: "Reclamação trabalhista autuada e notificada à reclamada.",
        responsavel: "Secretaria do Trabalho",
      },
      {
        id: "mov-07",
        data: "2026-09-15 16:45",
        titulo: "Autos Conclusos para Prolação de Sentença",
        descricao: "Encerrada a instrução probatória; autos ao gabinete do magistrado.",
        responsavel: "Secretaria Judiciária",
      },
    ],
  },
];

const SEED_AUDIENCIAS: AudienciaVirtual[] = [
  {
    id: "aud-001",
    processoId: "proc-001",
    processoNumero: "GW-JUS-2026-0042",
    data: "2026-09-24",
    horario: "10:30",
    tipo: "Conciliação",
    salaVirtualUrl: "https://justica.gov.gw/sala/v-0042",
    status: "agendada",
    magistrado: "Dr. Mamadu Serifo Djaló",
    partes: ["Sociedade Agrícola de Geba", "Cooperativa de Transporte Fluvial"],
  },
  {
    id: "aud-002",
    processoId: "proc-002",
    processoNumero: "GW-JUS-2026-0089",
    data: "2026-09-25",
    horario: "14:00",
    tipo: "Instrução e Julgamento",
    salaVirtualUrl: "https://justica.gov.gw/sala/v-0089",
    status: "agendada",
    magistrado: "Dra. Maria Odete Semedo",
    partes: ["Ministério Público da República", "Defesa Dativa"],
  },
];

const SEED_CERTIDOES: CertidaoJudicial[] = [
  {
    id: "cert-001",
    codigoAutenticidade: "GW-STJ-2026-8841-A",
    tipo: "Antecedentes Criminais",
    requerenteNome: "Domingos Simões Vaz",
    requerenteDocumento: "BI 19880412-004",
    finalidade: "Admissão em Concurso Público Nacional",
    resultado: "NADA CONSTA",
    emitidaEm: "2026-09-20 09:30",
    validaAte: "2026-12-20",
    assinaturaDigital: "CHANCELA_ELETRONICA_STJ_GW_HASH_8F41C90",
  },
];

const STORAGE_KEY = "gwdc_justice_state_v1";

const JusticeContext = createContext<JusticeContextType | undefined>(undefined);

export function JusticeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<JusticeState>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (err) {
        console.error("Erro ao carregar estado do GW Justice:", err);
      }
    }
    return {
      processos: SEED_PROCESSOS,
      audiencias: SEED_AUDIENCIAS,
      certidoes: SEED_CERTIDOES,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Erro ao salvar estado do GW Justice:", err);
    }
  }, [state]);

  const distribuirProcesso = (
    novo: Omit<ProcessoJudicial, "id" | "numero" | "status" | "criadoEm" | "movimentacoes">
  ): ProcessoJudicial => {
    const sequential = state.processos.length + 43;
    const padded = String(sequential).padStart(4, "0");
    const ano = new Date().getFullYear();
    const numero = `GW-JUS-${ano}-${padded}`;
    const id = `proc-${Date.now()}`;
    const criadoEm = new Date().toISOString();

    const novoProcesso: ProcessoJudicial = {
      ...novo,
      id,
      numero,
      status: "distribuido",
      criadoEm,
      movimentacoes: [
        {
          id: `mov-${Date.now()}`,
          data: new Date().toISOString().replace("T", " ").substring(0, 16),
          titulo: "Distribuição Eletrônica Registrada",
          descricao: `Petição protocolada e distribuída ao Juízo da ${novo.vara} do ${novo.tribunal}.`,
          responsavel: "Distribuição Automatizada PJe-GW",
        },
      ],
    };

    setState((prev) => ({
      ...prev,
      processos: [novoProcesso, ...prev.processos],
    }));

    return novoProcesso;
  };

  const protocolarPeticao = (processoId: string, titulo: string, descricao: string, advogado: string) => {
    const novaMov: MovimentacaoProcessual = {
      id: `mov-${Date.now()}`,
      data: new Date().toISOString().replace("T", " ").substring(0, 16),
      titulo: `Petição Intermediária: ${titulo}`,
      descricao,
      responsavel: advogado,
    };

    setState((prev) => ({
      ...prev,
      processos: prev.processos.map((proc) =>
        proc.id === processoId
          ? {
              ...proc,
              movimentacoes: [novaMov, ...proc.movimentacoes],
            }
          : proc
      ),
    }));
  };

  const agendarAudiencia = (dados: Omit<AudienciaVirtual, "id" | "status">): AudienciaVirtual => {
    const novaAudiencia: AudienciaVirtual = {
      ...dados,
      id: `aud-${Date.now()}`,
      status: "agendada",
    };

    setState((prev) => ({
      ...prev,
      audiencias: [novaAudiencia, ...prev.audiencias],
    }));

    // Atualiza status do processo
    setState((prev) => ({
      ...prev,
      processos: prev.processos.map((p) =>
        p.id === dados.processoId ? { ...p, status: "audiencia_marcada" as StatusProcesso } : p
      ),
    }));

    return novaAudiencia;
  };

  const concluirAudiencia = (audienciaId: string) => {
    setState((prev) => ({
      ...prev,
      audiencias: prev.audiencias.map((aud) =>
        aud.id === audienciaId ? { ...aud, status: "concluida" } : aud
      ),
    }));
  };

  const emitirCertidao = ({
    tipo,
    requerenteNome,
    requerenteDocumento,
    finalidade,
  }: {
    tipo: CertidaoJudicial["tipo"];
    requerenteNome: string;
    requerenteDocumento: string;
    finalidade: string;
  }): CertidaoJudicial => {
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const codigo = `GW-STJ-2026-${randomHex}-V`;
    const hoje = new Date();
    const validade = new Date(hoje);
    validade.setDate(validade.getDate() + 90);

    const novaCertidao: CertidaoJudicial = {
      id: `cert-${Date.now()}`,
      codigoAutenticidade: codigo,
      tipo,
      requerenteNome,
      requerenteDocumento,
      finalidade,
      resultado: "NADA CONSTA",
      emitidaEm: hoje.toISOString().replace("T", " ").substring(0, 16),
      validaAte: validade.toISOString().substring(0, 10),
      assinaturaDigital: `STJ_CHANCELA_${randomHex}_SOBERANA`,
    };

    setState((prev) => ({
      ...prev,
      certidoes: [novaCertidao, ...prev.certidoes],
    }));

    return novaCertidao;
  };

  const buscarProcessoPorNumero = (numero: string): ProcessoJudicial | undefined => {
    const clean = numero.trim().toLowerCase();
    return state.processos.find((p) => p.numero.toLowerCase().includes(clean));
  };

  return (
    <JusticeContext.Provider
      value={{
        state,
        distribuirProcesso,
        protocolarPeticao,
        agendarAudiencia,
        concluirAudiencia,
        emitirCertidao,
        buscarProcessoPorNumero,
      }}
    >
      {children}
    </JusticeContext.Provider>
  );
}

export function useJustice() {
  const context = useContext(JusticeContext);
  if (!context) {
    throw new Error("useJustice deve ser utilizado dentro de um JusticeProvider");
  }
  return context;
}
