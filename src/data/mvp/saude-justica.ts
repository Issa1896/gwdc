import { Activity, HeartPulse, Pill, Scale, Stethoscope, Syringe } from "lucide-react";
import type { MvpData } from "./types";
import { badge, date, number, text } from "./types";

const monthly = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

/** MVPs de Saúde (GW Health) e Justiça (GW Justice). */
export const mvpSaudeJustica: Record<string, MvpData> = {
  "gw-health": {
    productSlug: "gw-health",
    greeting: "Centro de Saúde de Bissau — Painel",
    kpis: [
      { title: "Atendimentos hoje", value: "214", delta: 8.1, icon: Stethoscope, tone: "brand", spark: [120, 140, 155, 170, 185, 195, 205, 214] },
      { title: "Teleconsultas no mês", value: "2.310", delta: 22.4, icon: Activity, tone: "gold", spark: [900, 1150, 1350, 1600, 1850, 2050, 2200, 2310] },
      { title: "Leitos ocupados", value: "68%", delta: -4.2, icon: HeartPulse, tone: "navy", spark: [82, 80, 76, 75, 72, 70, 69, 68] },
      { title: "Vacinas aplicadas", value: "4.108", delta: 12.6, icon: Syringe, tone: "brand", spark: [1800, 2200, 2600, 3000, 3400, 3700, 3950, 4108] },
    ],
    charts: [
      {
        id: "atendimentos",
        title: "Atendimentos por tipo",
        type: "bar",
        kind: "number",
        series: [{ key: "atendimentos", name: "Atendimentos" }],
        data: [
          { name: "Clínica geral", atendimentos: 420 },
          { name: "Pediatria", atendimentos: 310 },
          { name: "Pré-natal", atendimentos: 260 },
          { name: "Emergência", atendimentos: 190 },
          { name: "Teleconsulta", atendimentos: 480 },
        ],
      },
      {
        id: "surtos",
        title: "Casos monitorados por IA",
        type: "line",
        kind: "number",
        series: [{ key: "malaria", name: "Malária" }, { key: "dengue", name: "Dengue" }],
        data: monthly.map((name, i) => ({ name, malaria: [140, 160, 155, 175, 190, 210][i], dengue: [20, 24, 18, 30, 26, 22][i] })),
      },
    ],
    tables: [
      {
        id: "agenda",
        title: "Agenda de consultas",
        columns: ["Paciente", "Tipo", "Data", "Profissional", "Status"],
        rows: [
          [text("N'Guessan F."), text("Pré-natal"), date("2026-08-01"), text("Dra. Embaló"), badge("Confirmado", "success")],
          [text("Carlos Mendes"), text("Clínica geral"), date("2026-08-01"), text("Dr. Silva"), badge("Confirmado", "success")],
          [text("Aissatu J."), text("Pediatria"), date("2026-08-02"), text("Dra. Cá"), badge("Pendente", "warning")],
          [text("Mamadu Gomes"), text("Teleconsulta"), date("2026-08-02"), text("Dr. Pereira"), badge("Confirmado", "success")],
        ],
      },
      {
        id: "farmacia",
        title: "Farmácia — estoque crítico",
        columns: ["Medicamento", "Estoque", "Mínimo", "Status"],
        rows: [
          [text("Coartem (malária)"), number(240), number(300), badge("Repor", "warning")],
          [text("Amoxicilina 500mg"), number(820), number(400), badge("Ok", "success")],
          [text("Paracetamol 500mg"), number(150), number(500), badge("Crítico", "danger")],
          [text("Soro fisiológico"), number(610), number(300), badge("Ok", "success")],
        ],
      },
    ],
    alerts: [
      { tone: "warning", title: "Alerta de surto (IA)", message: "Casos de malária em Bairro Militar 22% acima do esperado para agosto — intensificar campanha de mosquiteiros." },
      { tone: "info", title: "Vacinção infantil", message: "Coorte de 1.200 crianças elegíveis para reforço em setembro." },
    ],
    extras: ["health"],
  },
  "gw-justice": {
    productSlug: "gw-justice",
    greeting: "Tribunal Regional de Bissau",
    kpis: [
      { title: "Processos ativos", value: "4.812", delta: 3.4, icon: Scale, tone: "brand", spark: [3800, 4000, 4200, 4300, 4500, 4650, 4750, 4812] },
      { title: "Sentenças no mês", value: "214", delta: 16.9, icon: Scale, tone: "gold", spark: [90, 110, 130, 150, 170, 185, 200, 214] },
      { title: "Audiências virtuais", value: "180", delta: 24.1, icon: Activity, tone: "navy", spark: [60, 80, 100, 120, 140, 155, 168, 180] },
      { title: "Prazos em atraso", value: "12", delta: -40.0, icon: Pill, tone: "brand", spark: [60, 55, 45, 38, 30, 22, 16, 12] },
    ],
    charts: [
      {
        id: "tempo",
        title: "Tempo médio por fase (dias)",
        type: "bar",
        kind: "number",
        series: [{ key: "dias", name: "Dias" }],
        data: [
          { name: "Distribuição", dias: 3 },
          { name: "Citação", dias: 12 },
          { name: "Instrução", dias: 84 },
          { name: "Sentença", dias: 21 },
          { name: "Recursos", dias: 45 },
        ],
      },
      {
        id: "distribuicao",
        title: "Distribuição por vara",
        type: "donut",
        kind: "percent",
        data: [
          { name: "Cível", value: 42 },
          { name: "Criminal", value: 31 },
          { name: "Família", value: 15 },
          { name: "Comercial", value: 12 },
        ],
      },
    ],
    tables: [
      {
        id: "processos",
        title: "Processos em destaque",
        columns: ["Processo", "Classe", "Partes", "Próximo ato", "Status"],
        rows: [
          [text("0001234-56.2026"), text("Cível"), text("A. Silva vs. Seguradora GW"), date("2026-08-04"), badge("Em instrução", "info")],
          [text("0001235-56.2026"), text("Família"), text("Guarda de menores"), date("2026-08-07"), badge("Audiência marcada", "gold")],
          [text("0001236-56.2026"), text("Criminal"), text("Ministério Público vs. R. Gomes"), date("2026-08-11"), badge("Em instrução", "info")],
          [text("0001237-56.2026"), text("Comercial"), text("Comercial Bissau vs. TekBissau"), date("2026-08-15"), badge("Sentença", "success")],
        ],
      },
    ],
    alerts: [
      { tone: "success", title: "Metas do CNJ", message: "Tempo médio de sentença cível reduzido para 118 dias — meta era 150." },
      { tone: "info", title: "Intimação eletrônica", message: "412 intimações enviadas eletronicamente este mês (economia de papel e tempo)." },
    ],
  },
};
