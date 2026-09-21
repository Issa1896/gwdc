import { BarChart3, BrainCircuit, Database, Radar, ShieldAlert, ShieldCheck, UserCheck } from "lucide-react";
import type { MvpData } from "./types";
import { badge, number, text } from "./types";

const monthly = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

/** MVPs de Dados e Segurança (GW Analytics, GW Security). */
export const mvpDados: Record<string, MvpData> = {
  "gw-analytics": {
    productSlug: "gw-analytics",
    greeting: "GW Analytics — Sala de Decisão",
    kpis: [
      { title: "Dashboards ativos", value: "74", delta: 8.8, icon: BarChart3, tone: "brand", spark: [42, 48, 52, 58, 63, 68, 71, 74] },
      { title: "Consultas de dados hoje", value: "12.480", delta: 14.2, icon: Database, tone: "gold", spark: [4200, 5500, 6800, 8000, 9400, 10500, 11500, 12480] },
      { title: "Fontes integradas", value: "16", delta: 6.7, icon: BrainCircuit, tone: "navy", spark: [8, 9, 11, 12, 13, 14, 15, 16] },
      { title: "Alertas inteligentes", value: "9", delta: -18.2, icon: Radar, tone: "brand", spark: [18, 17, 15, 14, 13, 11, 10, 9] },
    ],
    charts: [
      {
        id: "fontes",
        title: "Volume de dados por fonte",
        type: "bar",
        kind: "number",
        series: [{ key: "volume", name: "Registros (milhões)" }],
        data: [
          { name: "GW Bank", volume: 8.2 },
          { name: "GW Pay", volume: 6.4 },
          { name: "GW Citizen", volume: 4.1 },
          { name: "GW Transport", volume: 2.8 },
          { name: "GW Climate", volume: 1.9 },
        ],
      },
      {
        id: "receita",
        title: "Receita prevista vs. realizada",
        type: "line",
        kind: "number",
        series: [
          { key: "real", name: "Realizado" },
          { key: "previsto", name: "Previsto (IA)" },
        ],
        data: monthly.map((name, i) => ({ name, real: [28, 32, 30, 38, 42, 48][i], previsto: [29, 31, 33, 36, 41, 47][i] })),
      },
    ],
    tables: [
      {
        id: "dashboards",
        title: "Dashboards recentes",
        columns: ["Dashboard", "Área", "Atualização", "Uso"],
        rows: [
          [text("Execução orçamentária"), text("Min. Fazenda"), text("Diária"), badge("120 usos", "success")],
          [text("Operações bancárias"), text("GW Bank"), text("Tempo real"), badge("89 usos", "success")],
          [text("Vendas por região"), text("GW ERP"), text("Diária"), badge("64 usos", "brand")],
          [text("Chuvas e safra"), text("GW Climate"), text("6h"), badge("41 usos", "gold")],
        ],
      },
    ],
    alerts: [
      { tone: "info", title: "Relatório inteligente", message: "O assistente gerou o resumo executivo semanal automaticamente — disponível para revisão." },
      { tone: "success", title: "Modelo de receita", message: "Previsão do 3º trimestre concluída com 94% de aderência ao realizado." },
    ],
    extras: ["analytics"],
  },
  "gw-security": {
    productSlug: "gw-security",
    greeting: "SOC Nacional — Monitoramento 24/7",
    kpis: [
      { title: "Eventos analisados (24h)", value: "12,4 mi", delta: 8.9, icon: Radar, tone: "brand", spark: [6.2, 7.1, 8, 9.2, 10.1, 11, 11.8, 12.4] },
      { title: "Ameaças bloqueadas", value: "1.842", delta: 12.3, icon: ShieldCheck, tone: "gold", spark: [800, 950, 1100, 1250, 1400, 1560, 1700, 1842] },
      { title: "Incidentes abertos", value: "4", delta: -33.3, icon: ShieldAlert, tone: "navy", spark: [12, 11, 9, 8, 7, 6, 5, 4] },
      { title: "Fraudes evitadas", value: "38,2M FCFA", delta: 15.4, icon: UserCheck, tone: "brand", spark: [14, 18, 22, 26, 30, 33, 36, 38] },
    ],
    charts: [
      {
        id: "ataques",
        title: "Tentativas de ataque por tipo",
        type: "bar",
        kind: "number",
        series: [{ key: "ataques", name: "Tentativas" }],
        data: [
          { name: "Phishing", ataques: 640 },
          { name: "Brute force", ataques: 480 },
          { name: "Injeção SQL", ataques: 320 },
          { name: "Fraude de identidade", ataques: 210 },
          { name: "DDoS", ataques: 92 },
        ],
      },
      {
        id: "resposta",
        title: "Tempo de resposta a incidentes (min)",
        type: "line",
        kind: "number",
        series: [{ key: "min", name: "Minutos" }],
        data: monthly.map((name, i) => ({ name, min: [34, 28, 22, 17, 12, 8][i] })),
      },
    ],
    tables: [
      {
        id: "incidentes",
        title: "Incidentes em andamento",
        columns: ["Incidente", "Severidade", "Sistema", "Status"],
        rows: [
          [text("Possível vazamento de credenciais"), badge("Alta", "danger"), text("GW Bank"), badge("Contendo", "warning")],
          [text("Scan de portas anômalo"), badge("Média", "warning"), text("GW Pay"), badge("Investigando", "info")],
          [text("E-mail suspeito (phishing)"), badge("Baixa", "gold"), text("GW Citizen"), badge("Resolvido", "success")],
        ],
      },
      {
        id: "sistemas",
        title: "Postura dos sistemas",
        columns: ["Sistema", "Sistemas monitorados", "Último scan", "Postura"],
        rows: [
          [text("GW Bank"), number(14), text("há 4 min"), badge("Saudável", "success")],
          [text("GW Pay"), number(9), text("há 6 min"), badge("Saudável", "success")],
          [text("GW Government"), number(22), text("há 2 min"), badge("Saudável", "success")],
        ],
      },
    ],
    alerts: [
      { tone: "warning", title: "Possível vazamento de credenciais", message: "Padrão de acesso detectado no GW Bank — sessões contestadas bloqueadas automaticamente." },
      { tone: "success", title: "Simulação concluída", message: "Phishing simulation: 87% dos colaboradores identificaram o e-mail malicioso." },
    ],
  },
};
