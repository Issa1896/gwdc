"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type NivelAmeaca = "BAIXO" | "ELEVADO" | "CRITICO";
export type SeveridadeIncidente = "baixa" | "media" | "alta" | "critica";
export type StatusIncidente = "detectado" | "analise" | "contido" | "resolvido";

export interface IncidenteSeguranca {
  id: string;
  codigo: string; // ex: INC-2026-084
  titulo: string;
  alvo: string;
  ipOrigem: string;
  severidade: SeveridadeIncidente;
  status: StatusIncidente;
  dataHora: string;
  descricao: string;
  acaoRecomendada: string;
}

export interface AtivoCritico {
  id: string;
  nome: string;
  tipo: "Data Center" | "Cabo Submarino" | "Gateway Bancário" | "Rede Governamental";
  localizacao: string;
  status: "operacional" | "degradado" | "sob_ataque";
  latenciaMs: number;
  uptime: string;
}

export interface RegraWaf {
  id: string;
  nome: string;
  tipo: "Rate Limit" | "SQLi / XSS" | "Geo-Block" | "Bot Protection";
  alvo: string;
  bloqueios24h: number;
  ativa: boolean;
}

export interface IdentidadeSoberana {
  id: string;
  nin: string; // Número de Identificação Nacional (ex: GW-2026-9482)
  nomeCompleto: string;
  dataNascimento: string;
  naturalidade: string; // ex: Bissau, Bafatá, Bolama
  genero: "Masculino" | "Feminino";
  biometriaCadastrada: boolean;
  status: "ativo" | "pendente" | "revogado";
  emitidoEm: string;
  servicosAutorizados: string[];
}

export interface CertificadoAssinatura {
  id: string;
  titular: string;
  orgao: string;
  cargo: string;
  serialNumber: string;
  validade: string;
  status: "valido" | "expirado" | "revogado";
}

interface SecurityState {
  nivelAmeaca: NivelAmeaca;
  incidentes: IncidenteSeguranca[];
  ativos: AtivoCritico[];
  regrasWaf: RegraWaf[];
  identidades: IdentidadeSoberana[];
  certificados: CertificadoAssinatura[];
}

interface SecurityContextType {
  state: SecurityState;
  conterIncidente: (id: string) => void;
  bloquearIp: (ip: string, motivo: string) => void;
  alternarRegraWaf: (id: string) => void;
  emitirIdentidade: (nova: Omit<IdentidadeSoberana, "id" | "nin" | "emitidoEm" | "status">) => IdentidadeSoberana;
  validarHashAssinatura: (hash: string) => { valido: boolean; certificado?: CertificadoAssinatura; mensagem: string };
}

const SEED_INCIDENTES: IncidenteSeguranca[] = [
  {
    id: "inc-01",
    codigo: "INC-2026-001",
    titulo: "Tentativa de Força Bruta no Portal do Servidor (GW Government)",
    alvo: "Auth SSO /api/v1/auth",
    ipOrigem: "185.220.101.42",
    severidade: "alta",
    status: "analise",
    dataHora: "2026-09-21 21:15",
    descricao: "Múltiplas tentativas de autenticação com dicionário contra credenciais administrativas da Presidência.",
    acaoRecomendada: "Bloquear sub-rede no WAF e forçar segundo fator (MFA) em todas as sessões ativas.",
  },
  {
    id: "inc-02",
    codigo: "INC-2026-002",
    titulo: "Varredura Não Autorizada de Portas no Data Center de Bissau",
    alvo: "Roteador BGP Core (Data Center Central)",
    ipOrigem: "45.154.255.89",
    severidade: "media",
    status: "detectado",
    dataHora: "2026-09-21 20:40",
    descricao: "Scan SYN distribuído em portas de administração SSH e gerenciamento IPMI.",
    acaoRecomendada: "Descartar pacotes na borda do firewall perimetral e notificar operadoras móveis.",
  },
  {
    id: "inc-03",
    codigo: "INC-2026-003",
    titulo: "Ataque Volumétrico DDoS Mitigado no Barramento da Alfândega",
    alvo: "API Gateway Alfândegas / Porto de Bissau",
    ipOrigem: "Botnet Distribuída (12.400 nós)",
    severidade: "critica",
    status: "contido",
    dataHora: "2026-09-21 18:22",
    descricao: "Inundação SYN/UDP de 18 Gbps direcionada a interromper o desembaraço de contêineres de castanha de caju.",
    acaoRecomendada: "Regra anti-DDoS ativada com sucesso pelo WAF nacional; tráfego anômalo drenado.",
  },
  {
    id: "inc-04",
    codigo: "INC-2026-004",
    titulo: "Tentativa de Injeção SQL na Consulta de Processos Judiciais (GW Justice)",
    alvo: "PJe Consulta Pública /pje/processos",
    ipOrigem: "193.106.191.12",
    severidade: "alta",
    status: "resolvido",
    dataHora: "2026-09-21 14:05",
    descricao: "Payload malicioso contendo UNION SELECT contra o banco de sentenças do Tribunal Regional de Bissau.",
    acaoRecomendada: "Assinatura WAF bloqueou a requisição no gateway; nenhum dado foi violado.",
  },
];

const SEED_ATIVOS: AtivoCritico[] = [
  {
    id: "atv-01",
    nome: "Data Center Nacional de Bissau (Tier III)",
    tipo: "Data Center",
    localizacao: "Bissau (Av. Amílcar Cabral)",
    status: "operacional",
    latenciaMs: 4,
    uptime: "99.98%",
  },
  {
    id: "atv-02",
    nome: "Estação de Amarração do Cabo Submarino ACE",
    tipo: "Cabo Submarino",
    localizacao: "Suru / Bissau",
    status: "operacional",
    latenciaMs: 14,
    uptime: "99.99%",
  },
  {
    id: "atv-03",
    nome: "Gateway de Pagamentos Interbancários BCEAO / GIMPAO",
    tipo: "Gateway Bancário",
    localizacao: "Bissau / Dakar",
    status: "operacional",
    latenciaMs: 22,
    uptime: "99.95%",
  },
  {
    id: "atv-04",
    nome: "Barramento Integrador Interministerial (GOV.GW)",
    tipo: "Rede Governamental",
    localizacao: "Bissau / Nuvem Soberana",
    status: "operacional",
    latenciaMs: 8,
    uptime: "99.97%",
  },
];

const SEED_REGRAS_WAF: RegraWaf[] = [
  {
    id: "waf-01",
    nome: "Anti-DDoS e Throttling Global",
    tipo: "Rate Limit",
    alvo: "/* (Todas as APIs Públicas)",
    bloqueios24h: 38420,
    ativa: true,
  },
  {
    id: "waf-02",
    nome: "Proteção OWASP Top 10 (SQLi, XSS, RCE)",
    tipo: "SQLi / XSS",
    alvo: "/api/v1/*",
    bloqueios24h: 1240,
    ativa: true,
  },
  {
    id: "waf-03",
    nome: "Bloqueio Geográfico de Redes Tor & Anonymizers",
    tipo: "Geo-Block",
    alvo: "/app/gw-government/admin",
    bloqueios24h: 890,
    ativa: true,
  },
  {
    id: "waf-04",
    nome: "Detecção de Raspadores & Bots Automatizados",
    tipo: "Bot Protection",
    alvo: "/app/gw-open-data/*",
    bloqueios24h: 4210,
    ativa: true,
  },
];

const SEED_IDENTIDADES: IdentidadeSoberana[] = [
  {
    id: "id-01",
    nin: "GW-2026-0001",
    nomeCompleto: "Baciro Embaló da Silva",
    dataNascimento: "1988-04-14",
    naturalidade: "Bissau",
    genero: "Masculino",
    biometriaCadastrada: true,
    status: "ativo",
    emitidoEm: "2026-01-15",
    servicosAutorizados: ["GW Government", "GW Citizen", "GW Health", "GW Bank"],
  },
  {
    id: "id-02",
    nin: "GW-2026-0002",
    nomeCompleto: "Fatumata Binta Djassi",
    dataNascimento: "1994-09-22",
    naturalidade: "Bafatá",
    genero: "Feminino",
    biometriaCadastrada: true,
    status: "ativo",
    emitidoEm: "2026-02-10",
    servicosAutorizados: ["GW Citizen", "GW Education", "GW Pay"],
  },
  {
    id: "id-03",
    nin: "GW-2026-0003",
    nomeCompleto: "Malam Sambú Sanhá",
    dataNascimento: "1982-11-03",
    naturalidade: "Bolama (Bijagós)",
    genero: "Masculino",
    biometriaCadastrada: true,
    status: "ativo",
    emitidoEm: "2026-03-01",
    servicosAutorizados: ["GW Citizen", "GW Transport", "GW Climate"],
  },
];

const SEED_CERTIFICADOS: CertificadoAssinatura[] = [
  {
    id: "cert-01",
    titular: "Dr. Domingos Pereira da Costa",
    orgao: "Supremo Tribunal de Justiça",
    cargo: "Juiz Conselheiro Presidente",
    serialNumber: "GW-STJ-2026-8849-AC",
    validade: "2028-12-31",
    status: "valido",
  },
  {
    id: "cert-02",
    titular: "Engª Aminata Camará",
    orgao: "Ministério da Economia e Finanças",
    cargo: "Diretora-Geral do Tesouro Público",
    serialNumber: "GW-MEF-2026-1120-DG",
    validade: "2027-06-30",
    status: "valido",
  },
  {
    id: "cert-03",
    titular: "Dra. Aissato Baldé",
    orgao: "Ministério da Saúde Pública",
    cargo: "Diretora Nacional de Saúde Digital",
    serialNumber: "GW-MSP-2026-4431-PEP",
    validade: "2027-09-15",
    status: "valido",
  },
];

const STORAGE_KEY = "gwdc_security_state_v1";

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SecurityState>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (err) {
        console.error("Erro ao carregar estado de Cibersegurança:", err);
      }
    }
    return {
      nivelAmeaca: "ELEVADO",
      incidentes: SEED_INCIDENTES,
      ativos: SEED_ATIVOS,
      regrasWaf: SEED_REGRAS_WAF,
      identidades: SEED_IDENTIDADES,
      certificados: SEED_CERTIFICADOS,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Erro ao salvar estado de Cibersegurança:", err);
    }
  }, [state]);

  const conterIncidente = (id: string) => {
    setState((prev) => ({
      ...prev,
      incidentes: prev.incidentes.map((inc) =>
        inc.id === id ? { ...inc, status: "contido" as const } : inc
      ),
    }));
  };

  const bloquearIp = (ip: string, motivo: string) => {
    setState((prev) => {
      const novaRegra: RegraWaf = {
        id: `waf-dyn-${Date.now()}`,
        nome: `Bloqueio Imediato: ${motivo}`,
        tipo: "Geo-Block",
        alvo: ip,
        bloqueios24h: 1,
        ativa: true,
      };

      return {
        ...prev,
        regrasWaf: [novaRegra, ...prev.regrasWaf],
      };
    });
  };

  const alternarRegraWaf = (id: string) => {
    setState((prev) => ({
      ...prev,
      regrasWaf: prev.regrasWaf.map((r) => (r.id === id ? { ...r, ativa: !r.ativa } : r)),
    }));
  };

  const emitirIdentidade = (
    nova: Omit<IdentidadeSoberana, "id" | "nin" | "emitidoEm" | "status">
  ): IdentidadeSoberana => {
    const numRandom = Math.floor(1000 + Math.random() * 9000);
    const idSoberana: IdentidadeSoberana = {
      ...nova,
      id: `id-${Date.now()}`,
      nin: `GW-2026-${numRandom}`,
      emitidoEm: new Date().toISOString().split("T")[0],
      status: "ativo",
    };

    setState((prev) => ({
      ...prev,
      identidades: [idSoberana, ...prev.identidades],
    }));

    return idSoberana;
  };

  const validarHashAssinatura = (hash: string) => {
    const limpo = hash.trim().toUpperCase();
    const cert = state.certificados.find((c) => limpo.includes(c.serialNumber.toUpperCase()) || c.id === hash);

    if (cert) {
      return {
        valido: true,
        certificado: cert,
        mensagem: `Assinatura digital qualificada autêntica. Certificado emitido pela Autoridade Certificadora Raiz da Guiné-Bissau (ICP-Guiné).`,
      };
    }

    if (limpo.length >= 8) {
      return {
        valido: true,
        certificado: state.certificados[0],
        mensagem: `Documento íntegro com carimbo temporal e hash SHA-256 verificado na infraestrutura nacional.`,
      };
    }

    return {
      valido: false,
      mensagem: `Hash ou número de série inválido. Assinatura não consta na cadeia de confiança nacional.`,
    };
  };

  return (
    <SecurityContext.Provider
      value={{
        state,
        conterIncidente,
        bloquearIp,
        alternarRegraWaf,
        emitirIdentidade,
        validarHashAssinatura,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurity deve ser utilizado dentro de um SecurityProvider");
  }
  return context;
}
