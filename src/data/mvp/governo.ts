import { FileCheck2, Fingerprint, Landmark, MessageSquareText, ScanLine, Users } from "lucide-react";
import type { MvpData } from "./types";
import { badge, date, number, text } from "./types";

const monthly = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

/** MÓDULO 6 — MVPs do Governo Digital (GW Government, GW Citizen, GW Identity, GW Open Data). */
export const mvpGoverno: Record<string, MvpData> = {
  "gw-government": {
    productSlug: "gw-government",
    greeting: "Painel consolidado do Estado",
    kpis: [
      { title: "Serviços digitalizados", value: "42", delta: 8.2, icon: FileCheck2, tone: "brand", spark: [10, 14, 13, 18, 22, 28, 35, 42] },
      { title: "Órgãos integrados", value: "14", delta: 5.0, icon: Landmark, tone: "navy", spark: [4, 6, 7, 9, 11, 12, 13, 14] },
      { title: "Protocolos este mês", value: "18.402", delta: 12.4, icon: MessageSquareText, tone: "gold", spark: [9000, 11000, 10400, 13000, 15000, 16200, 17500, 18402] },
      { title: "Cidadãos autenticados", value: "78.214", delta: 9.1, icon: Users, tone: "brand", spark: [30000, 40000, 45000, 55000, 62000, 68000, 74000, 78214] },
    ],
    charts: [
      {
        id: "protocolos",
        title: "Protocolos eletrônicos por ministério",
        type: "bar",
        kind: "number",
        series: [{ key: "protocolos", name: "Protocolos" }],
        data: [
          { name: "Fazenda", protocolos: 4200 },
          { name: "Educação", protocolos: 3100 },
          { name: "Saúde", protocolos: 2700 },
          { name: "Justiça", protocolos: 2100 },
          { name: "Interior", protocolos: 1900 },
          { name: "Obras", protocolos: 1200 },
        ],
      },
      {
        id: "atendimento",
        title: "Tempo médio de atendimento (dias)",
        type: "line",
        kind: "number",
        series: [{ key: "tempo", name: "Dias" }],
        data: monthly.map((name, i) => ({ name, tempo: [45, 38, 30, 24, 18, 12][i] })),
      },
    ],
    tables: [
      {
        id: "protocolos-recentes",
        title: "Protocolos recentes",
        description: "Últimos pedidos registrados no barramento interministerial.",
        columns: ["Nº Protocolo", "Serviço", "Órgão", "Data", "Status"],
        rows: [
          [text("PROT-2026-08421"), text("Certidão de nascimento"), text("Registo Civil Bissau"), date("2026-07-30"), badge("Em análise", "info")],
          [text("PROT-2026-08422"), text("Alvará comercial"), text("Ministério do Comércio"), date("2026-07-30"), badge("Concluído", "success")],
          [text("PROT-2026-08423"), text("Matrícula escolar"), text("Ministério da Educação"), date("2026-07-29"), badge("Em análise", "info")],
          [text("PROT-2026-08424"), text("Carta de condução"), text("DGTT"), date("2026-07-29"), badge("Aguardando docs", "warning")],
          [text("PROT-2026-08425"), text("Passaporte"), text("Ministério do Interior"), date("2026-07-28"), badge("Concluído", "success")],
        ],
      },
      {
        id: "indicadores",
        title: "Indicadores dos ministérios",
        description: "SLA médio de resposta por órgão.",
        columns: ["Órgão", "Solicitações", "SLA médio", "Satisfação"],
        rows: [
          [text("Ministério da Fazenda"), number(1204), text("2 dias"), badge("92%", "success")],
          [text("Ministério da Educação"), number(983), text("3 dias"), badge("88%", "success")],
          [text("Ministério da Saúde"), number(751), text("4 dias"), badge("84%", "brand")],
          [text("Ministério da Justiça"), number(610), text("6 dias"), badge("79%", "gold")],
          [text("Registos e Notariado"), number(1489), text("1 dia"), badge("95%", "success")],
        ],
      },
    ],
    alerts: [
      { tone: "success", title: "Meta do trimestre atingida", message: "42 serviços digitalizados — 105% da meta estabelecida com o Ministério da Modernização." },
      { tone: "info", title: "Integração em andamento", message: "Ministério das Finanças finaliza integração com o barramento (previsão: 14/08/2026)." },
    ],
  },
  "gw-citizen": {
    productSlug: "gw-citizen",
    greeting: "Portal do Cidadão — Bissau",
    kpis: [
      { title: "Serviços utilizados", value: "18.402", delta: 12.4, icon: FileCheck2, tone: "brand", spark: [9000, 11000, 10400, 13000, 15000, 16200, 17500, 18402] },
      { title: "Certidões emitidas", value: "4.208", delta: 7.8, icon: ScanLine, tone: "gold", spark: [2100, 2400, 2600, 2900, 3300, 3600, 3900, 4208] },
      { title: "Tempo médio", value: "3 min", delta: -18.2, icon: Landmark, tone: "navy", spark: [9, 8, 7, 6, 5, 4, 4, 3] },
      { title: "Satisfação (NPS)", value: "84", delta: 4.5, icon: Users, tone: "brand", spark: [68, 70, 72, 75, 78, 80, 82, 84] },
    ],
    charts: [
      {
        id: "servicos-populares",
        title: "Serviços mais procurados",
        type: "bar",
        kind: "number",
        series: [{ key: "pedidos", name: "Pedidos" }],
        data: [
          { name: "Certidão de nascimento", pedidos: 4200 },
          { name: "Atestado de residência", pedidos: 3100 },
          { name: "Carteira de estudante", pedidos: 2700 },
          { name: "NIF", pedidos: 2100 },
          { name: "Passaporte", pedidos: 1500 },
        ],
      },
      {
        id: "canais",
        title: "Uso por canal de acesso",
        type: "donut",
        kind: "number",
        data: [
          { name: "Web", value: 52 },
          { name: "Mobile", value: 33 },
          { name: "USSD/SMS", value: 12 },
          { name: "Balcão assistido", value: 3 },
        ],
      },
    ],
    tables: [
      {
        id: "minhas-certidoes",
        title: "Minhas solicitações",
        columns: ["Documento", "Solicitado em", "Prazo", "Status"],
        rows: [
          [text("Certidão de nascimento"), date("2026-07-30"), text("3 dias úteis"), badge("Em análise", "info")],
          [text("Atestado de residência"), date("2026-07-28"), text("1 dia útil"), badge("Concluído", "success")],
          [text("Antecedentes criminais"), date("2026-07-25"), text("5 dias úteis"), badge("Concluído", "success")],
          [text("NIF"), date("2026-07-22"), text("1 dia útil"), badge("Concluído", "success")],
        ],
      },
    ],
    alerts: [
      { tone: "success", title: "Certidão disponível", message: "Seu atestado de residência foi emitido e está na sua carteira digital." },
      { tone: "info", title: "Novo serviço", message: "Agendamento de passaporte já está disponível no portal." },
    ],
  },
  "gw-identity": {
    productSlug: "gw-identity",
    greeting: "Plataforma Nacional de Identidade",
    kpis: [
      { title: "Identidades emitidas", value: "78.214", delta: 9.1, icon: Fingerprint, tone: "brand", spark: [30000, 40000, 45000, 55000, 62000, 68000, 74000, 78214] },
      { title: "Autenticações hoje", value: "22.408", delta: 11.3, icon: Users, tone: "navy", spark: [9000, 12000, 14000, 16000, 18000, 19500, 21000, 22408] },
      { title: "Assinaturas digitais", value: "6.512", delta: 6.7, icon: FileCheck2, tone: "gold", spark: [2000, 2800, 3200, 4000, 4600, 5200, 5900, 6512] },
      { title: "Serviços conectados", value: "23", delta: 2.0, icon: Landmark, tone: "brand", spark: [10, 12, 14, 16, 18, 20, 22, 23] },
    ],
    charts: [
      {
        id: "emissao",
        title: "Emissões por mês",
        type: "area",
        kind: "number",
        series: [{ key: "emissao", name: "Emissões" }],
        data: monthly.map((name, i) => ({ name, emissao: [5200, 6100, 5800, 7200, 8400, 9200][i] })),
      },
      {
        id: "verificacao",
        title: "Verificações por setor",
        type: "donut",
        kind: "number",
        data: [
          { name: "GovTech", value: 44 },
          { name: "FinTech", value: 31 },
          { name: "Saúde", value: 14 },
          { name: "Educação", value: 11 },
        ],
      },
    ],
    tables: [
      {
        id: "postos",
        title: "Postos de atendimento",
        columns: ["Posto", "Região", "Atendimentos", "Tempo médio"],
        rows: [
          [text("Posto Central Bissau"), text("Bissau"), number(1840), text("12 min")],
          [text("Hospital Regional"), text("Bafatá"), number(860), text("18 min")],
          [text("Centro de Saúde"), text("Cacheu"), number(640), text("15 min")],
          [text("Administração Regional"), text("Gabú"), number(520), text("20 min")],
        ],
      },
    ],
    alerts: [
      { tone: "warning", title: "Pico de emissões", message: "Campanha de renovação do BI elevou as filas nos postos de Bissau em 40%." },
      { tone: "info", title: "Novo padrão", message: "Cartão biométrico com chip (ICAO) entra em produção em 2026." },
    ],
  },
  "gw-open-data": {
    productSlug: "gw-open-data",
    greeting: "Portal de Dados Abertos do Estado",
    kpis: [
      { title: "Datasets publicados", value: "186", delta: 6.9, icon: FileCheck2, tone: "brand", spark: [90, 110, 120, 140, 155, 168, 178, 186] },
      { title: "Downloads no mês", value: "42.890", delta: 21.0, icon: Users, tone: "gold", spark: [12000, 18000, 22000, 26000, 31000, 36000, 40000, 42890] },
      { title: "API calls hoje", value: "9.415", delta: 8.5, icon: ScanLine, tone: "navy", spark: [3000, 4200, 5100, 5900, 6800, 7600, 8600, 9415] },
      { title: "Órgãos publicadores", value: "31", delta: 3.3, icon: Landmark, tone: "brand", spark: [18, 21, 23, 25, 27, 29, 30, 31] },
    ],
    charts: [
      {
        id: "categorias",
        title: "Datasets por tema",
        type: "donut",
        kind: "number",
        data: [
          { name: "Orçamento", value: 34 },
          { name: "Saúde", value: 22 },
          { name: "Educação", value: 18 },
          { name: "Clima", value: 15 },
          { name: "Geografia", value: 11 },
        ],
      },
      {
        id: "downloads",
        title: "Downloads por mês",
        type: "area",
        kind: "number",
        series: [{ key: "downloads", name: "Downloads" }],
        data: monthly.map((name, i) => ({ name, downloads: [12000, 18000, 22000, 26000, 31000, 42890][i] })),
      },
    ],
    tables: [
      {
        id: "recentes",
        title: "Datasets recentes",
        columns: ["Dataset", "Órgão", "Licença", "Atualização"],
        rows: [
          [text("Execução orçamentária 2026"), text("Min. Fazenda"), badge("CC-BY", "success"), date("2026-07-28")],
          [text("Precipitação diária — sensores"), text("GW Climate"), badge("CC-BY", "success"), date("2026-07-30")],
          [text("Matrículas por escola"), text("Min. Educação"), badge("CC-BY", "success"), date("2026-07-25")],
          [text("Índice de preços ao consumidor"), text("INE"), badge("CC-BY", "success"), date("2026-07-22")],
        ],
      },
    ],
    alerts: [
      { tone: "success", title: "Padrão OGDA", message: "O portal agora é compatível com a Carta de Dados Abertos da CEDEAO." },
      { tone: "info", title: "Hackathon", message: "Dados de transporte e clima liberados para o hackathon nacional 2026." },
    ],
  },
};
