import { Bus, CloudSun, Droplets, Gauge, QrCode, Route, Thermometer, Ticket } from "lucide-react";
import type { MvpData } from "./types";
import { badge, date, text } from "./types";

const monthly = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

/** MÓDULOS 10-11 — MVPs de Transporte (GW Transport) e Clima (GW Climate). */
export const mvpTransporteClima: Record<string, MvpData> = {
  "gw-transport": {
    productSlug: "gw-transport",
    greeting: "Terminal Rodoviário de Bissau",
    kpis: [
      { title: "Passagens vendidas hoje", value: "3.412", delta: 6.8, icon: Ticket, tone: "brand", spark: [1900, 2200, 2500, 2700, 2950, 3100, 3250, 3412] },
      { title: "Receita do dia", value: "18,4M FCFA", delta: 9.2, icon: Bus, tone: "gold", spark: [11, 12.5, 13.8, 15, 16.2, 17, 17.6, 18.4] },
      { title: "Viagens em curso", value: "24", delta: 4.3, icon: Route, tone: "navy", spark: [15, 16, 18, 19, 20, 21, 23, 24] },
      { title: "Bilhetes QR validados", value: "2.896", delta: 11.6, icon: QrCode, tone: "brand", spark: [1200, 1500, 1800, 2100, 2400, 2600, 2750, 2896] },
    ],
    charts: [
      {
        id: "rotas",
        title: "Passagens por rota",
        type: "bar",
        kind: "number",
        series: [{ key: "passagens", name: "Passagens" }],
        data: [
          { name: "Bissau–Bafatá", passagens: 890 },
          { name: "Bissau–Cacheu", passagens: 720 },
          { name: "Bissau–Gabú", passagens: 610 },
          { name: "Bissau–Bolama (barco)", passagens: 540 },
          { name: "Bissau–Bubaque (barco)", passagens: 420 },
          { name: "Bissau–Bissorã", passagens: 232 },
        ],
      },
      {
        id: "pontualidade",
        title: "Pontualidade de partida",
        type: "line",
        kind: "percent",
        series: [{ key: "pct", name: "% no horário" }],
        data: monthly.map((name, i) => ({ name, pct: [71, 74, 78, 81, 85, 88][i] })),
      },
    ],
    tables: [
      {
        id: "bilhetes",
        title: "Meus bilhetes",
        columns: ["Bilhete", "Rota", "Data/Hora", "Assento", "Status"],
        rows: [
          [text("GW-BIL-88412"), text("Bissau → Bafatá"), text("01/08 · 09h00"), text("12"), badge("Validado", "success")],
          [text("GW-BIL-88645"), text("Bissau → Bolama"), text("02/08 · 16h30"), text("5"), badge("Embarque aberto", "info")],
          [text("GW-BIL-88701"), text("Bissau → Cacheu"), text("05/08 · 08h00"), text("3"), badge("Confirmado", "brand")],
        ],
      },
      {
        id: "frota",
        title: "Frota em movimento",
        columns: ["Veículo", "Rota", "Velocidade", "Próxima parada", "ETA"],
        rows: [
          [text("Ônibus GW-102"), text("Bissau–Bafatá"), text("74 km/h"), text("Mansabá"), text("10 min")],
          [text("Barco Êrnesto Lima"), text("Bissau–Bubaque"), text("28 nós"), text("Ilha de Bolama"), text("1h 20min")],
          [text("Ônibus GW-114"), text("Bissau–Gabú"), text("69 km/h"), text("Nova Lamego"), text("40 min")],
          [text("Barco Cantanhez"), text("Bissau–Cacheu"), text("24 nós"), text("Enxudé"), text("2h 05min")],
        ],
      },
    ],
    alerts: [
      { tone: "info", title: "Rota Bissau–Bubaque com 94% de ocupação", message: "Sugerimos reforço de um horário às sextas-feiras." },
      { tone: "success", title: "Sincronização concluída", message: "12 terminais sincronizados — vendas de balcão e online consolidadas." },
    ],
    extras: ["transport"],
  },
  "gw-climate": {
    productSlug: "gw-climate",
    greeting: "Centro Nacional de Monitoramento Climático",
    kpis: [
      { title: "Sensores ativos", value: "214", delta: 3.9, icon: Gauge, tone: "brand", spark: [160, 172, 180, 190, 198, 205, 210, 214] },
      { title: "Chuva acumulada (mês)", value: "312 mm", delta: 18.6, icon: Droplets, tone: "gold", spark: [120, 160, 190, 220, 260, 280, 300, 312] },
      { title: "Temp. média hoje", value: "29,4 °C", delta: 1.2, icon: Thermometer, tone: "navy", spark: [30, 30.5, 30.2, 29.8, 29.6, 29.5, 29.4, 29.4] },
      { title: "Alertas ativos", value: "3", delta: -25.0, icon: CloudSun, tone: "brand", spark: [8, 7, 6, 5, 5, 4, 4, 3] },
    ],
    charts: [
      {
        id: "chuva",
        title: "Precipitação por região (mm)",
        type: "bar",
        kind: "number",
        series: [{ key: "mm", name: "mm" }],
        data: [
          { name: "Bissau", mm: 340 },
          { name: "Cacheu", mm: 290 },
          { name: "Bafatá", mm: 180 },
          { name: "Gabú", mm: 120 },
          { name: "Bolama", mm: 260 },
          { name: "Oio", mm: 210 },
        ],
      },
      {
        id: "previsao",
        title: "Previsão IA — próximos 7 dias (°C / chuva)",
        type: "line",
        kind: "number",
        series: [
          { key: "temp", name: "Temperatura (°C)" },
          { key: "chuva", name: "Chuva (mm)" },
        ],
        data: ["Sáb", "Dom", "Seg", "Ter", "Qua", "Qui", "Sex"].map((name, i) => ({ name, temp: [30, 29, 28, 29, 30, 31, 30][i], chuva: [42, 28, 15, 8, 12, 30, 25][i] })),
      },
    ],
    tables: [
      {
        id: "sensores",
        title: "Estações em destaque",
        columns: ["Estação", "Região", "Temp.", "Umidade", "Chuva 24h"],
        rows: [
          [text("Bissau Aeroporto"), text("Bissau"), text("29,1 °C"), text("82%"), text("18 mm")],
          [text("Bafatá Agro"), text("Bafatá"), text("31,8 °C"), text("64%"), text("4 mm")],
          [text("Cacheu Manguezal"), text("Cacheu"), text("27,9 °C"), text("89%"), text("36 mm")],
          [text("Bolama Ilha"), text("Bolama"), text("28,4 °C"), text("86%"), text("22 mm")],
        ],
      },
      {
        id: "alertas",
        title: "Alertas ativos",
        columns: ["Alerta", "Área", "Severidade", "Emitido"],
        rows: [
          [text("Risco de inundação"), text("Bairros de Bissau"), badge("Alto", "danger"), date("2026-07-31")],
          [text("Vento forte"), text("Costa de Cacheu"), badge("Médio", "warning"), date("2026-07-31")],
          [text("Seca relativa"), text("Gabú"), badge("Moderado", "gold"), date("2026-07-29")],
        ],
      },
    ],
    alerts: [
      { tone: "danger", title: "Alerta de inundação", message: "Previsão de 80mm+ nas próximas 48h em Bissau — Defesa Civil acionada, SMS enviado a 14.200 residentes." },
      { tone: "info", title: "IA de previsão atualizada", message: "Modelo recalibrado com dados de satélite da semana — acurácia 87% em 7 dias." },
    ],
    extras: ["climate"],
  },
};

export const transportMapPoints = [
  { name: "Bissau", lat: 11.8636, lon: -15.5977 },
  { name: "Bafatá", lat: 12.1713, lon: -14.6582 },
  { name: "Gabú", lat: 12.2785, lon: -14.2222 },
  { name: "Cacheu", lat: 12.2676, lon: -16.1679 },
  { name: "Bolama", lat: 11.1473, lon: -15.4977 },
];

export const climateGauges = [
  { label: "Chuva esperada — Bissau", value: 74, unit: "mm", max: 100 },
  { label: "Vento — costa", value: 32, unit: "km/h", max: 60 },
  { label: "Umidade do solo — Bafatá", value: 55, unit: "%", max: 100 },
];
