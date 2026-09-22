"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface MetricaSetorial {
  id: string;
  setor: "Finanças" | "Saúde" | "Educação" | "Transportes" | "Justiça" | "Clima";
  titulo: string;
  valor: string;
  variacaoPercentual: number;
  tendencia: "alta" | "baixa" | "estavel";
  descricao: string;
  fonte: string;
}

export interface SerieHistorica {
  mes: string;
  receitaFiscalMilhoes: number;
  despesaPublicaMilhoes: number;
  atendimentosSaudeMil: number;
  passageirosTransporteMil: number;
}

export interface ModeloPreditivo {
  id: string;
  nome: string;
  descricao: string;
  acuraciaPercentual: number;
  previsaoTexto: string;
  status: "treinado" | "processando";
  impacto: "alto" | "critico" | "moderado";
}

export interface DatasetAberto {
  id: string;
  slug: string;
  titulo: string;
  orgao: string;
  categoria: "Economia" | "Educação" | "Saúde" | "Transportes" | "Meio Ambiente" | "Justiça";
  formatos: ("CSV" | "JSON" | "PDF" | "API")[];
  descricao: string;
  atualizadoEm: string;
  tamanho: string;
  linhas: number;
  dadosAmostra: Record<string, string | number>[];
}

interface AnalyticsState {
  metricas: MetricaSetorial[];
  historico: SerieHistorica[];
  modelos: ModeloPreditivo[];
  datasets: DatasetAberto[];
}

interface AnalyticsContextType {
  state: AnalyticsState;
  publicarDataset: (dataset: Omit<DatasetAberto, "id" | "atualizadoEm">) => DatasetAberto;
  executarModelo: (modeloId: string) => void;
}

const SEED_METRICAS: MetricaSetorial[] = [
  {
    id: "met-01",
    setor: "Finanças",
    titulo: "Receita Fiscal Consolidada (DGCI / Alfândegas)",
    valor: "24.8 Bi FCFA",
    variacaoPercentual: 14.2,
    tendencia: "alta",
    descricao: "Arrecadação acumulada do trimestre com crescimento no Porto de Bissau.",
    fonte: "Ministério da Economia e Finanças",
  },
  {
    id: "met-02",
    setor: "Saúde",
    titulo: "Prontuários Eletrônicos Registrados (PEP)",
    valor: "96.4 mil",
    variacaoPercentual: 22.8,
    tendencia: "alta",
    descricao: "Históricos clínicos unificados pelo GW Health nos hospitais nacionais.",
    fonte: "Ministério da Saúde Pública",
  },
  {
    id: "met-03",
    setor: "Educação",
    titulo: "Estudantes Matriculados no Sistema",
    valor: "48.2 mil",
    variacaoPercentual: 8.5,
    tendencia: "alta",
    descricao: "Alunos com cadastro no SIGAA nacional e universidades públicas.",
    fonte: "Ministério da Educação Nacional",
  },
  {
    id: "met-04",
    setor: "Transportes",
    titulo: "Passageiros com Bilhete Digital (Mês)",
    valor: "84.6 mil",
    variacaoPercentual: 18.0,
    tendencia: "alta",
    descricao: "Fluxo rodoviário interurbano e marítimo para o arquipélago dos Bijagós.",
    fonte: "Direção-Geral dos Transportes Terrestres e Fluviais",
  },
  {
    id: "met-05",
    setor: "Justiça",
    titulo: "Redução do Tempo de Tramitação Processual",
    valor: "-62%",
    variacaoPercentual: -62.0,
    tendencia: "baixa",
    descricao: "Tempo médio de prolação de despachos no PJe eletrônico.",
    fonte: "Supremo Tribunal de Justiça",
  },
  {
    id: "met-06",
    setor: "Clima",
    titulo: "Cobertura de Sensores Pluviométricos",
    valor: "87%",
    variacaoPercentual: 15.0,
    tendencia: "alta",
    descricao: "Monitoramento em tempo real de bacias hidrográficas e mangais.",
    fonte: "Instituto Nacional de Meteorologia",
  },
];

const SEED_HISTORICO: SerieHistorica[] = [
  { mes: "Abr", receitaFiscalMilhoes: 6800, despesaPublicaMilhoes: 5900, atendimentosSaudeMil: 22, passageirosTransporteMil: 18 },
  { mes: "Mai", receitaFiscalMilhoes: 7400, despesaPublicaMilhoes: 6200, atendimentosSaudeMil: 25, passageirosTransporteMil: 21 },
  { mes: "Jun", receitaFiscalMilhoes: 8100, despesaPublicaMilhoes: 6800, atendimentosSaudeMil: 28, passageirosTransporteMil: 24 },
  { mes: "Jul", receitaFiscalMilhoes: 7900, despesaPublicaMilhoes: 7100, atendimentosSaudeMil: 31, passageirosTransporteMil: 27 },
  { mes: "Ago", receitaFiscalMilhoes: 8500, despesaPublicaMilhoes: 7400, atendimentosSaudeMil: 34, passageirosTransporteMil: 29 },
  { mes: "Set", receitaFiscalMilhoes: 9200, despesaPublicaMilhoes: 7800, atendimentosSaudeMil: 38, passageirosTransporteMil: 32 },
];

const SEED_MODELOS: ModeloPreditivo[] = [
  {
    id: "mod-01",
    nome: "Previsão de Produção e Exportação de Castanha de Caju",
    descricao: "Modelo de aprendizado de máquina correlacionando dados de satélite (NDVI) com o volume esperado da safra.",
    acuraciaPercentual: 91.4,
    previsaoTexto: "Projeção de 215 mil toneladas de castanha de caju para a próxima safra com valor estimado em 96.7 Bi FCFA.",
    status: "treinado",
    impacto: "critico",
  },
  {
    id: "mod-02",
    nome: "Previsão de Demanda Marítima de Passageiros para os Bijagós",
    descricao: "Previsão de lotação de embarcações entre Bissau, Bolama e Bubaque para evitar sobrecarga em fins de semana.",
    acuraciaPercentual: 88.7,
    previsaoTexto: "Aumento de 34% no fluxo de viagens marítimas na primeira quinzena de dezembro. Recomenda-se adicionar 2 viagens extras.",
    status: "treinado",
    impacto: "alto",
  },
  {
    id: "mod-03",
    nome: "Detector de Anomalias em Faturamento Aduaneiro do Porto",
    descricao: "Identificação automática de discrepâncias entre peso declarado e valor aduaneiro no Porto de Bissau.",
    acuraciaPercentual: 94.2,
    previsaoTexto: "Detectadas 4 declarações aduaneiras com indício de subfaturamento fiscal esta semana.",
    status: "treinado",
    impacto: "alto",
  },
];

const SEED_DATASETS: DatasetAberto[] = [
  {
    id: "ds-01",
    slug: "orcamento-geral-estado-2026",
    titulo: "Orçamento Geral do Estado (OGE) — Execução Orçamentária 2026",
    orgao: "Ministério da Economia e Finanças",
    categoria: "Economia",
    formatos: ["CSV", "JSON", "API"],
    descricao: "Demonstrativo detalhado de receitas orçamentárias arrecadadas e despesas liquidadas por ministério e programa.",
    atualizadoEm: "2026-09-20",
    tamanho: "3.4 MB",
    linhas: 480,
    dadosAmostra: [
      { ministerio: "Educação Nacional", orcadoFCFA: 34000000000, executadoFCFA: 25800000000, percentual: "75.8%" },
      { ministerio: "Saúde Pública", orcadoFCFA: 29500000000, executadoFCFA: 23100000000, percentual: "78.3%" },
      { ministerio: "Obras Públicas e Transportes", orcadoFCFA: 22000000000, executadoFCFA: 17400000000, percentual: "79.1%" },
      { ministerio: "Justiça e Direitos Humanos", orcadoFCFA: 12500000000, executadoFCFA: 9800000000, percentual: "78.4%" },
    ],
  },
  {
    id: "ds-02",
    slug: "rotas-transportes-nacionais",
    titulo: "Malha de Rotas Terrestres e Marítimas da Guiné-Bissau",
    orgao: "Ministério dos Transportes e Comunicações",
    categoria: "Transportes",
    formatos: ["CSV", "JSON"],
    descricao: "Itinerários, distâncias em quilômetros, tarifas oficiais em FCFA e frequência de partidas para províncias e ilhas.",
    atualizadoEm: "2026-09-18",
    tamanho: "850 KB",
    linhas: 58,
    dadosAmostra: [
      { rota: "Bissau - Bafatá", modal: "Terrestre", distanciaKm: 150, precoFCFA: 4500, tempoMedio: "2h 30m" },
      { rota: "Bissau - Gabú", modal: "Terrestre", distanciaKm: 205, precoFCFA: 6000, tempoMedio: "3h 30m" },
      { rota: "Bissau - Bubaque (Bijagós)", modal: "Marítimo", distanciaKm: 65, precoFCFA: 8500, tempoMedio: "2h 00m" },
      { rota: "Bissau - Bolama", modal: "Marítimo", distanciaKm: 45, precoFCFA: 5000, tempoMedio: "1h 30m" },
    ],
  },
  {
    id: "ds-03",
    slug: "estatisticas-judiciais-pje",
    titulo: "Estatísticas de Processos Judiciais e Julgamentos dos Tribunais",
    orgao: "Supremo Tribunal de Justiça",
    categoria: "Justiça",
    formatos: ["CSV", "JSON"],
    descricao: "Métricas consolidadas de processos cíveis, criminais e trabalhistas distribuídos e julgados nas comarcas do país.",
    atualizadoEm: "2026-09-15",
    tamanho: "1.2 MB",
    linhas: 240,
    dadosAmostra: [
      { tribunal: "Tribunal Regional de Bissau", distribuidos: 1420, julgados: 980, taxaConclusao: "69.0%" },
      { tribunal: "Tribunal Setorial de Bafatá", distribuidos: 480, julgados: 365, taxaConclusao: "76.0%" },
      { tribunal: "Tribunal Setorial de Gabú", distribuidos: 390, julgados: 295, taxaConclusao: "75.6%" },
      { tribunal: "Supremo Tribunal de Justiça", distribuidos: 210, julgados: 175, taxaConclusao: "83.3%" },
    ],
  },
];

const STORAGE_KEY = "gwdc_analytics_state_v1";

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AnalyticsState>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (err) {
        console.error("Erro ao carregar estado do GW Analytics:", err);
      }
    }
    return {
      metricas: SEED_METRICAS,
      historico: SEED_HISTORICO,
      modelos: SEED_MODELOS,
      datasets: SEED_DATASETS,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Erro ao salvar estado do GW Analytics:", err);
    }
  }, [state]);

  const publicarDataset = (
    novo: Omit<DatasetAberto, "id" | "atualizadoEm">
  ): DatasetAberto => {
    const dataset: DatasetAberto = {
      ...novo,
      id: `ds-${Date.now()}`,
      atualizadoEm: new Date().toISOString().split("T")[0],
    };

    setState((prev) => ({
      ...prev,
      datasets: [dataset, ...prev.datasets],
    }));

    return dataset;
  };

  const executarModelo = (modeloId: string) => {
    setState((prev) => ({
      ...prev,
      modelos: prev.modelos.map((m) =>
        m.id === modeloId ? { ...m, status: "treinado", acuraciaPercentual: Math.min(99, m.acuraciaPercentual + 0.5) } : m
      ),
    }));
  };

  return (
    <AnalyticsContext.Provider
      value={{
        state,
        publicarDataset,
        executarModelo,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics deve ser utilizado dentro de um AnalyticsProvider");
  }
  return context;
}
