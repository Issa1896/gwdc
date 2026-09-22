"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface EstacaoMeteorologica {
  id: string;
  codigo: string;
  nome: string;
  regiao: string;
  temperatura: number;
  umidade: number;
  precipitacaoMm: number;
  ventoKmH: number;
  pressaoHpa: number;
  indiceUv: number;
  status: "online" | "alerta" | "manutencao";
  atualizadoEm: string;
}

export interface AlertaClimatico {
  id: string;
  codigo: string;
  titulo: string;
  severidade: "critico" | "alto" | "moderado" | "informativo";
  regiao: string;
  descricaoPt: string;
  descricaoCrioulo: string;
  emitidoEm: string;
  validoAte: string;
  ativo: boolean;
  canais: string[];
}

export interface PrevisaoDiaria {
  dia: string;
  data: string;
  condicao: "Ensolarado" | "Chuva Forte" | "Pancadas Tropicais" | "Nublado" | "Tempestade";
  tempMin: number;
  tempMax: number;
  probChuva: number;
  ventoKmH: number;
  mareBijagos: string;
}

export interface MangalZona {
  id: string;
  nome: string;
  regiao: string;
  areaHectares: number;
  indiceNDVI: number;
  status: "Excelente" | "Vulnerável" | "Sob Alerta";
  bioma: string;
}

interface ClimateState {
  estacoes: EstacaoMeteorologica[];
  alertas: AlertaClimatico[];
  previsao: PrevisaoDiaria[];
  mangais: MangalZona[];
}

interface ClimateContextType {
  state: ClimateState;
  emitirAlerta: (alerta: Omit<AlertaClimatico, "id" | "codigo" | "emitidoEm" | "ativo">) => AlertaClimatico;
  desativarAlerta: (id: string) => void;
  atualizarEstacao: (id: string, dados: Partial<EstacaoMeteorologica>) => void;
}

const SEED_ESTACOES: EstacaoMeteorologica[] = [
  {
    id: "est-001",
    codigo: "GW-MET-BISSAU-01",
    nome: "Estação Meteorológica do Porto de Bissau",
    regiao: "Setor Autônomo de Bissau",
    temperatura: 31.4,
    umidade: 78,
    precipitacaoMm: 14.2,
    ventoKmH: 22,
    pressaoHpa: 1012,
    indiceUv: 9,
    status: "online",
    atualizadoEm: "Há 4 minutos",
  },
  {
    id: "est-002",
    codigo: "GW-MET-BAFATA-02",
    nome: "Estação Agroclimática do Rio Geba - Bafatá",
    regiao: "Região de Bafatá",
    temperatura: 33.8,
    umidade: 64,
    precipitacaoMm: 28.5,
    ventoKmH: 18,
    pressaoHpa: 1010,
    indiceUv: 10,
    status: "alerta",
    atualizadoEm: "Há 2 minutos",
  },
  {
    id: "est-003",
    codigo: "GW-MET-GABU-03",
    nome: "Posto Pluviométrico Regional de Gabú",
    regiao: "Região de Gabú",
    temperatura: 34.6,
    umidade: 58,
    precipitacaoMm: 5.0,
    ventoKmH: 14,
    pressaoHpa: 1009,
    indiceUv: 11,
    status: "online",
    atualizadoEm: "Há 8 minutos",
  },
  {
    id: "est-004",
    codigo: "GW-MET-BUBAQUE-04",
    nome: "Observatório Marítimo e Insular de Bubaque",
    regiao: "Arquipélago dos Bijagós",
    temperatura: 29.8,
    umidade: 86,
    precipitacaoMm: 42.0,
    ventoKmH: 36,
    pressaoHpa: 1008,
    indiceUv: 8,
    status: "alerta",
    atualizadoEm: "Há 1 minuto",
  },
  {
    id: "est-005",
    codigo: "GW-MET-CACHEU-05",
    nome: "Estação do Parque Natural dos Tarrafes de Cacheu",
    regiao: "Região de Cacheu",
    temperatura: 30.5,
    umidade: 82,
    precipitacaoMm: 18.0,
    ventoKmH: 20,
    pressaoHpa: 1011,
    indiceUv: 9,
    status: "online",
    atualizadoEm: "Há 6 minutos",
  },
  {
    id: "est-006",
    codigo: "GW-MET-CATIO-06",
    nome: "Posto Meteorológico do Sul - Catió",
    regiao: "Região de Tombali",
    temperatura: 31.0,
    umidade: 84,
    precipitacaoMm: 22.0,
    ventoKmH: 16,
    pressaoHpa: 1011,
    indiceUv: 9,
    status: "online",
    atualizadoEm: "Há 10 minutos",
  },
];

const SEED_ALERTAS: AlertaClimatico[] = [
  {
    id: "alt-001",
    codigo: "ALT-2026-089",
    titulo: "Risco Iminente de Cheia na Bacia do Rio Geba",
    severidade: "critico",
    regiao: "Bafatá / Rio Geba",
    descricaoPt:
      "Precipitação acumulada superior a 75mm nas últimas 24h. Risco de alagamento das bolanhas arrozeiras ribeirinhas nas zonas baixas.",
    descricaoCrioulo:
      "Tchuba pisadu dimás na Rio Geba. Bolanha di bas di agu na perigu di fika tchiga agu. N’torki bu biku ku família.",
    emitidoEm: "2026-09-21 07:30",
    validoAte: "2026-09-23 18:00",
    ativo: true,
    canais: ["SMS em Crioulo", "Rádio Nacional", "Defesa Civil", "App Cidadão"],
  },
  {
    id: "alt-002",
    codigo: "ALT-2026-090",
    titulo: "Aviso de Mar Revolto e Ventania no Arquipélago dos Bijagós",
    severidade: "alto",
    regiao: "Bijagós (Bubaque, Uno, Caravela)",
    descricaoPt:
      "Rajadas de vento de até 50 km/h e ondas de 3.5 metros no canal de entrada para Bubaque. Recomenda-se cautela a pirogas e lanchas de passageiros.",
    descricaoCrioulo:
      "Bentu ta supla forti na mar di Bijagós. Kankuran ku kanoa ka dibi di sai pa mar ti ki tempo kalma.",
    emitidoEm: "2026-09-21 11:00",
    validoAte: "2026-09-22 20:00",
    ativo: true,
    canais: ["SMS Pescadores", "Capitania dos Portos", "GW Transport"],
  },
];

const SEED_PREVISAO: PrevisaoDiaria[] = [
  {
    dia: "Hoje",
    data: "21 Set",
    condicao: "Chuva Forte",
    tempMin: 24,
    tempMax: 31,
    probChuva: 85,
    ventoKmH: 26,
    mareBijagos: "Alta (3.8m)",
  },
  {
    dia: "Terça",
    data: "22 Set",
    condicao: "Pancadas Tropicais",
    tempMin: 23,
    tempMax: 32,
    probChuva: 65,
    ventoKmH: 20,
    mareBijagos: "Alta (3.6m)",
  },
  {
    dia: "Quarta",
    data: "23 Set",
    condicao: "Nublado",
    tempMin: 24,
    tempMax: 33,
    probChuva: 40,
    ventoKmH: 16,
    mareBijagos: "Média (2.4m)",
  },
  {
    dia: "Quinta",
    data: "24 Set",
    condicao: "Ensolarado",
    tempMin: 25,
    tempMax: 34,
    probChuva: 20,
    ventoKmH: 14,
    mareBijagos: "Baixa (1.1m)",
  },
  {
    dia: "Sexta",
    data: "25 Set",
    condicao: "Pancadas Tropicais",
    tempMin: 24,
    tempMax: 32,
    probChuva: 55,
    ventoKmH: 18,
    mareBijagos: "Média (2.1m)",
  },
  {
    dia: "Sábado",
    data: "26 Set",
    condicao: "Chuva Forte",
    tempMin: 23,
    tempMax: 30,
    probChuva: 80,
    ventoKmH: 24,
    mareBijagos: "Alta (3.7m)",
  },
  {
    dia: "Domingo",
    data: "27 Set",
    condicao: "Nublado",
    tempMin: 24,
    tempMax: 32,
    probChuva: 30,
    ventoKmH: 15,
    mareBijagos: "Média (2.0m)",
  },
];

const SEED_MANGAIS: MangalZona[] = [
  {
    id: "man-001",
    nome: "Tarrafes de Cacheu (Parque Natural)",
    regiao: "Cacheu",
    areaHectares: 88400,
    indiceNDVI: 0.82,
    status: "Excelente",
    bioma: "Mangal de Rhizophora mangle",
  },
  {
    id: "man-002",
    nome: "Estuário do Rio Geba e Bolanha de Bissau",
    regiao: "Bissau / Biombo",
    areaHectares: 34200,
    indiceNDVI: 0.61,
    status: "Vulnerável",
    bioma: "Mangal Periurbano e Arrozal de Bolanha",
  },
  {
    id: "man-003",
    nome: "Manguezais das Ilhas de Orango e Bubaque",
    regiao: "Bijagós",
    areaHectares: 112000,
    indiceNDVI: 0.88,
    status: "Excelente",
    bioma: "Reserva da Biosfera da UNESCO",
  },
  {
    id: "man-004",
    nome: "Cantanhez e Estuário do Rio Cacine",
    regiao: "Tombali",
    areaHectares: 65000,
    indiceNDVI: 0.79,
    status: "Excelente",
    bioma: "Transição Floresta Tropical e Mangal",
  },
];

const STORAGE_KEY = "gwdc_climate_state_v1";

const ClimateContext = createContext<ClimateContextType | undefined>(undefined);

export function ClimateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ClimateState>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (err) {
        console.error("Erro ao carregar estado do GW Climate:", err);
      }
    }
    return {
      estacoes: SEED_ESTACOES,
      alertas: SEED_ALERTAS,
      previsao: SEED_PREVISAO,
      mangais: SEED_MANGAIS,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Erro ao salvar estado do GW Climate:", err);
    }
  }, [state]);

  const emitirAlerta = (
    dados: Omit<AlertaClimatico, "id" | "codigo" | "emitidoEm" | "ativo">
  ): AlertaClimatico => {
    const seq = state.alertas.length + 91;
    const codigo = `ALT-2026-${String(seq).padStart(3, "0")}`;
    const hojeStr = new Date().toISOString().replace("T", " ").substring(0, 16);

    const novoAlerta: AlertaClimatico = {
      ...dados,
      id: `alt-${Date.now()}`,
      codigo,
      emitidoEm: hojeStr,
      ativo: true,
    };

    setState((prev) => ({
      ...prev,
      alertas: [novoAlerta, ...prev.alertas],
    }));

    return novoAlerta;
  };

  const desativarAlerta = (id: string) => {
    setState((prev) => ({
      ...prev,
      alertas: prev.alertas.map((a) => (a.id === id ? { ...a, ativo: false } : a)),
    }));
  };

  const atualizarEstacao = (id: string, dados: Partial<EstacaoMeteorologica>) => {
    setState((prev) => ({
      ...prev,
      estacoes: prev.estacoes.map((e) => (e.id === id ? { ...e, ...dados } : e)),
    }));
  };

  return (
    <ClimateContext.Provider
      value={{
        state,
        emitirAlerta,
        desativarAlerta,
        atualizarEstacao,
      }}
    >
      {children}
    </ClimateContext.Provider>
  );
}

export function useClimate() {
  const context = useContext(ClimateContext);
  if (!context) {
    throw new Error("useClimate deve ser utilizado dentro de um ClimateProvider");
  }
  return context;
}
