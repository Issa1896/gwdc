"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// ==================== GW SCHOOL TYPES ====================
export interface AlunoEscola {
  id: string;
  matricula: string; // ex: ESC-2026-0481
  nomeCompleto: string;
  turma: string; // ex: "3º Ano A", "5º Ano B"
  idade: number;
  genero: "M" | "F";
  responsavelNome: string;
  responsavelTelefone: string;
  frequenciaPercentual: number;
  notaMedia: number; // 0 a 20
  recebeMerenda: boolean;
  status: "ativo" | "transferido" | "evadido";
}

export interface ItemMerenda {
  id: string;
  alimento: string; // ex: "Arroz Nacional", "Óleo Vegetal", "Peixe Seco", "Feijão Macassar"
  quantidadeEstoque: number;
  unidade: "kg" | "litros" | "sacas";
  consumoDiarioEstimado: number;
  diasRestantes: number;
  origem: "Produção Local" | "PAM / WFP" | "Governo Central";
}

export interface ComunicadoEscolar {
  id: string;
  data: string;
  titulo: string;
  textoPt: string;
  textoCrioulo: string;
  destinatarios: string;
}

// ==================== GW BUSINESS TYPES ====================
export type EtapaPipeline = "lead" | "qualificacao" | "proposta" | "negociacao" | "ganho" | "perdido";

export interface OportunidadeVenda {
  id: string;
  titulo: string;
  empresaCliente: string;
  valorFCFA: number;
  etapa: EtapaPipeline;
  responsavel: string;
  probabilidade: number; // 0 a 100
  previsaoFechamento: string;
}

export interface ClienteEmpresarial {
  id: string;
  nif: string; // Número de Identificação Fiscal (ex: NIF-GW-500129384)
  nomeEmpresa: string;
  setor: "Agronegócio (Caju)" | "Comércio e Distribuição" | "Construção & Obras" | "Tecnologia & Telecom" | "Serviços";
  cidade: string; // Bissau, Bafatá, Gabú, etc.
  contatoPrincipal: string;
  email: string;
  telefone: string;
  volumeAnualFCFA: number;
  status: "ativo" | "prospect" | "inativo";
}

interface SchoolBusinessState {
  // School
  alunos: AlunoEscola[];
  itensMerenda: ItemMerenda[];
  comunicados: ComunicadoEscolar[];
  // Business
  oportunidades: OportunidadeVenda[];
  clientes: ClienteEmpresarial[];
}

interface SchoolBusinessContextType {
  state: SchoolBusinessState;
  // School actions
  matricularAluno: (aluno: Omit<AlunoEscola, "id" | "matricula" | "status">) => AlunoEscola;
  atualizarNotaFrequencia: (id: string, nota: number, frequencia: number) => void;
  registrarConsumoMerenda: (itemId: string, quantidadeConsumida: number) => void;
  // Business actions
  criarOportunidade: (op: Omit<OportunidadeVenda, "id">) => OportunidadeVenda;
  avancarEtapaOportunidade: (id: string, novaEtapa: EtapaPipeline) => void;
  cadastrarCliente: (cliente: Omit<ClienteEmpresarial, "id">) => ClienteEmpresarial;
}

const SEED_ALUNOS: AlunoEscola[] = [
  {
    id: "alu-01",
    matricula: "ESC-2026-001",
    nomeCompleto: "Mariama Djaló",
    turma: "3º Ano A",
    idade: 8,
    genero: "F",
    responsavelNome: "Braima Djaló",
    responsavelTelefone: "+245 955 123 456",
    frequenciaPercentual: 96,
    notaMedia: 16.5,
    recebeMerenda: true,
    status: "ativo",
  },
  {
    id: "alu-02",
    matricula: "ESC-2026-002",
    nomeCompleto: "Mamadu Serifo Baldé",
    turma: "3º Ano A",
    idade: 9,
    genero: "M",
    responsavelNome: "Aissatu Baldé",
    responsavelTelefone: "+245 966 789 012",
    frequenciaPercentual: 92,
    notaMedia: 14.8,
    recebeMerenda: true,
    status: "ativo",
  },
  {
    id: "alu-03",
    matricula: "ESC-2026-003",
    nomeCompleto: "Fatumata Camará",
    turma: "5º Ano B",
    idade: 11,
    genero: "F",
    responsavelNome: "Seco Camará",
    responsavelTelefone: "+245 955 334 556",
    frequenciaPercentual: 88,
    notaMedia: 15.2,
    recebeMerenda: true,
    status: "ativo",
  },
  {
    id: "alu-04",
    matricula: "ESC-2026-004",
    nomeCompleto: "Joãozinho Gomes da Silva",
    turma: "5º Ano B",
    idade: 10,
    genero: "M",
    responsavelNome: "Domingas Gomes",
    responsavelTelefone: "+245 966 445 667",
    frequenciaPercentual: 98,
    notaMedia: 17.0,
    recebeMerenda: true,
    status: "ativo",
  },
];

const SEED_MERENDA: ItemMerenda[] = [
  {
    id: "mer-01",
    alimento: "Arroz Branco Nacional (Bafatá)",
    quantidadeEstoque: 45,
    unidade: "sacas",
    consumoDiarioEstimado: 2,
    diasRestantes: 22,
    origem: "Produção Local",
  },
  {
    id: "mer-02",
    alimento: "Óleo Vegetal Fortificado",
    quantidadeEstoque: 180,
    unidade: "litros",
    consumoDiarioEstimado: 8,
    diasRestantes: 22,
    origem: "PAM / WFP",
  },
  {
    id: "mer-03",
    alimento: "Peixe Seco dos Bijagós",
    quantidadeEstoque: 320,
    unidade: "kg",
    consumoDiarioEstimado: 15,
    diasRestantes: 21,
    origem: "Produção Local",
  },
  {
    id: "mer-04",
    alimento: "Feijão Macassar Nutritivo",
    quantidadeEstoque: 25,
    unidade: "sacas",
    consumoDiarioEstimado: 1,
    diasRestantes: 25,
    origem: "Governo Central",
  },
];

const SEED_COMUNICADOS: ComunicadoEscolar[] = [
  {
    id: "com-01",
    data: "2026-09-21",
    titulo: "Campanha Nacional de Vacinação Escolar",
    textoPt: "Informamos que a equipe do GW Health estará na escola nesta quinta-feira para vacinação contra o sarampo.",
    textoCrioulo: "No ta avisa tudu familia kuma ekipa di GW Health na bin skola kinta-fera pa vacuna contra sarampu.",
    destinatarios: "Todos os pais e encarregados",
  },
  {
    id: "com-02",
    data: "2026-09-18",
    titulo: "Reunião Trimestral de Pais e Mestres",
    textoPt: "Distribuição dos boletins bimestrais e apresentação do plano de merenda escolar do 2º trimestre.",
    textoCrioulo: "Djuntu di pai ku mestri pa entrega buletin di notas ku papia di kumida di mininus.",
    destinatarios: "3º e 5º Ano do Ensino Básico",
  },
];

const SEED_OPORTUNIDADES: OportunidadeVenda[] = [
  {
    id: "op-01",
    titulo: "Implantação de GW ERP & POS em Rede de Farmácias",
    empresaCliente: "Farmácias Bijagós Lda.",
    valorFCFA: 14500000,
    etapa: "negociacao",
    responsavel: "Carlos Mendonça",
    probabilidade: 85,
    previsaoFechamento: "2026-10-15",
  },
  {
    id: "op-02",
    titulo: "Licenciamento Anual de Assinatura Digital e eKYC",
    empresaCliente: "Banco Comercial da Guiné (BCG)",
    valorFCFA: 28000000,
    etapa: "proposta",
    responsavel: "Aminata Seidi",
    probabilidade: 70,
    previsaoFechamento: "2026-10-30",
  },
  {
    id: "op-03",
    titulo: "Rastreamento de Frota de Caminhões de Caju",
    empresaCliente: "AgroExport Guiné Lda.",
    valorFCFA: 9200000,
    etapa: "qualificacao",
    responsavel: "Carlos Mendonça",
    probabilidade: 50,
    previsaoFechamento: "2026-11-10",
  },
  {
    id: "op-04",
    titulo: "Integração GW Pay com QR Code nos Supermercados",
    empresaCliente: "Supermercado Bissau Center",
    valorFCFA: 6500000,
    etapa: "ganho",
    responsavel: "Aminata Seidi",
    probabilidade: 100,
    previsaoFechamento: "2026-09-18",
  },
];

const SEED_CLIENTES: ClienteEmpresarial[] = [
  {
    id: "cli-01",
    nif: "NIF-GW-500129384",
    nomeEmpresa: "Farmácias Bijagós Lda.",
    setor: "Comércio e Distribuição",
    cidade: "Bissau",
    contatoPrincipal: "Dr. Fernando Semedo",
    email: "direcao@farmaciasbijagos.gw",
    telefone: "+245 955 888 111",
    volumeAnualFCFA: 120000000,
    status: "ativo",
  },
  {
    id: "cli-02",
    nif: "NIF-GW-500982311",
    nomeEmpresa: "Banco Comercial da Guiné (BCG)",
    setor: "Serviços",
    cidade: "Bissau",
    contatoPrincipal: "Mariama Cassamá (TI)",
    email: "mcassama@bcg.gw",
    telefone: "+245 966 222 333",
    volumeAnualFCFA: 850000000,
    status: "ativo",
  },
  {
    id: "cli-03",
    nif: "NIF-GW-500441920",
    nomeEmpresa: "AgroExport Guiné Lda.",
    setor: "Agronegócio (Caju)",
    cidade: "Bafatá",
    contatoPrincipal: "Aladje Ibraima Sow",
    email: "vendas@agroexport.gw",
    telefone: "+245 955 777 444",
    volumeAnualFCFA: 460000000,
    status: "prospect",
  },
];

const STORAGE_KEY = "gwdc_school_business_state_v1";

const SchoolBusinessContext = createContext<SchoolBusinessContextType | undefined>(undefined);

export function SchoolBusinessProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SchoolBusinessState>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (err) {
        console.error("Erro ao carregar estado de School & Business:", err);
      }
    }
    return {
      alunos: SEED_ALUNOS,
      itensMerenda: SEED_MERENDA,
      comunicados: SEED_COMUNICADOS,
      oportunidades: SEED_OPORTUNIDADES,
      clientes: SEED_CLIENTES,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Erro ao salvar estado de School & Business:", err);
    }
  }, [state]);

  // School actions
  const matricularAluno = (aluno: Omit<AlunoEscola, "id" | "matricula" | "status">): AlunoEscola => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const novo: AlunoEscola = {
      ...aluno,
      id: `alu-${Date.now()}`,
      matricula: `ESC-2026-${randomNum}`,
      status: "ativo",
    };

    setState((prev) => ({
      ...prev,
      alunos: [novo, ...prev.alunos],
    }));

    return novo;
  };

  const atualizarNotaFrequencia = (id: string, nota: number, frequencia: number) => {
    setState((prev) => ({
      ...prev,
      alunos: prev.alunos.map((a) => (a.id === id ? { ...a, notaMedia: nota, frequenciaPercentual: frequencia } : a)),
    }));
  };

  const registrarConsumoMerenda = (itemId: string, quantidadeConsumida: number) => {
    setState((prev) => ({
      ...prev,
      itensMerenda: prev.itensMerenda.map((m) =>
        m.id === itemId
          ? {
              ...m,
              quantidadeEstoque: Math.max(0, m.quantidadeEstoque - quantidadeConsumida),
              diasRestantes: Math.max(0, Math.floor((m.quantidadeEstoque - quantidadeConsumida) / m.consumoDiarioEstimado)),
            }
          : m
      ),
    }));
  };

  // Business actions
  const criarOportunidade = (op: Omit<OportunidadeVenda, "id">): OportunidadeVenda => {
    const nova: OportunidadeVenda = {
      ...op,
      id: `op-${Date.now()}`,
    };

    setState((prev) => ({
      ...prev,
      oportunidades: [nova, ...prev.oportunidades],
    }));

    return nova;
  };

  const avancarEtapaOportunidade = (id: string, novaEtapa: EtapaPipeline) => {
    setState((prev) => ({
      ...prev,
      oportunidades: prev.oportunidades.map((o) =>
        o.id === id ? { ...o, etapa: novaEtapa, probabilidade: novaEtapa === "ganho" ? 100 : novaEtapa === "perdido" ? 0 : o.probabilidade } : o
      ),
    }));
  };

  const cadastrarCliente = (cliente: Omit<ClienteEmpresarial, "id">): ClienteEmpresarial => {
    const novo: ClienteEmpresarial = {
      ...cliente,
      id: `cli-${Date.now()}`,
    };

    setState((prev) => ({
      ...prev,
      clientes: [novo, ...prev.clientes],
    }));

    return novo;
  };

  return (
    <SchoolBusinessContext.Provider
      value={{
        state,
        matricularAluno,
        atualizarNotaFrequencia,
        registrarConsumoMerenda,
        criarOportunidade,
        avancarEtapaOportunidade,
        cadastrarCliente,
      }}
    >
      {children}
    </SchoolBusinessContext.Provider>
  );
}

export function useSchoolBusiness() {
  const context = useContext(SchoolBusinessContext);
  if (!context) {
    throw new Error("useSchoolBusiness deve ser utilizado dentro de um SchoolBusinessProvider");
  }
  return context;
}
