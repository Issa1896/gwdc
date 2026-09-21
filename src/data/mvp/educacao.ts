import { BookOpen, CalendarDays, GraduationCap, School, Users } from "lucide-react";
import type { CalendarEvent } from "@/components/ui/calendar";
import type { MvpData } from "./types";
import { badge, date, number, text } from "./types";

const monthly = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

/** MÓDULO 7 — MVPs de Educação (GW Education, GW Campus, GW School). */
export const mvpEducacao: Record<string, MvpData> = {
  "gw-education": {
    productSlug: "gw-education",
    greeting: "Portal do Aluno — Semestre 2/2026",
    kpis: [
      { title: "Média ponderada", value: "15,8", delta: 2.1, icon: GraduationCap, tone: "brand", spark: [12, 13, 13, 14, 15, 15, 16, 16] },
      { title: "Disciplinas ativas", value: "6", delta: 0, icon: BookOpen, tone: "navy", spark: [5, 5, 6, 6, 6, 6, 6, 6] },
      { title: "Frequência", value: "92%", delta: 3.4, icon: Users, tone: "gold", spark: [85, 86, 88, 89, 90, 90, 91, 92] },
      { title: "Atividades pendentes", value: "3", delta: -25.0, icon: CalendarDays, tone: "brand", spark: [8, 7, 6, 6, 5, 4, 4, 3] },
    ],
    charts: [
      {
        id: "notas",
        title: "Evolução de notas por disciplina",
        type: "line",
        kind: "number",
        series: [
          { key: "matematica", name: "Matemática" },
          { key: "informatica", name: "Informática" },
        ],
        data: monthly.map((name, i) => ({ name, matematica: [12, 13, 14, 14, 15, 16][i], informatica: [14, 14, 15, 16, 17, 17][i] })),
      },
      {
        id: "carga",
        title: "Carga horária por dia",
        type: "bar",
        kind: "number",
        series: [{ key: "horas", name: "Horas" }],
        data: [
          { name: "Seg", horas: 4 },
          { name: "Ter", horas: 6 },
          { name: "Qua", horas: 2 },
          { name: "Qui", horas: 6 },
          { name: "Sex", horas: 4 },
          { name: "Sáb", horas: 3 },
        ],
      },
    ],
    tables: [
      {
        id: "boletim",
        title: "Boletim — semestre atual",
        columns: ["Disciplina", "1ª AV", "2ª AV", "Final", "Status"],
        rows: [
          [text("Matemática Discreta"), number(14), number(15), number(16), badge("Aprovado", "success")],
          [text("Programação Web"), number(16), number(17), number(17), badge("Aprovado", "success")],
          [text("Bases de Dados"), number(13), number(14), number(14), badge("Aprovado", "success")],
          [text("Economia Digital"), number(11), number(12), text("—"), badge("Em curso", "info")],
          [text("Estatística Aplicada"), number(10), number(11), text("—"), badge("Em curso", "info")],
        ],
      },
      {
        id: "atividades",
        title: "Próximas atividades",
        columns: ["Atividade", "Disciplina", "Data", "Peso"],
        rows: [
          [text("Trabalho prático — API REST"), text("Programação Web"), date("2026-08-05"), text("30%")],
          [text("Mini-teste 3"), text("Bases de Dados"), date("2026-08-08"), text("20%")],
          [text("Apresentação de projeto"), text("Economia Digital"), date("2026-08-14"), text("40%")],
        ],
      },
    ],
    alerts: [
      { tone: "info", title: "Novo material no AVA", message: "O professor de Programação Web publicou o conteúdo da aula 24." },
      { tone: "success", title: "Matrícula confirmada", message: "Sua matrícula para o semestre 2/2026 foi confirmada pela secretaria." },
    ],
    extras: ["calendar"],
  },
  "gw-campus": {
    productSlug: "gw-campus",
    greeting: "Painel do Gestor Acadêmico — UAC",
    kpis: [
      { title: "Estudantes matriculados", value: "9.842", delta: 6.8, icon: Users, tone: "brand", spark: [7200, 7600, 8000, 8400, 8900, 9200, 9500, 9842] },
      { title: "Disciplinas ofertadas", value: "312", delta: 4.0, icon: BookOpen, tone: "navy", spark: [250, 260, 270, 280, 290, 300, 305, 312] },
      { title: "Taxa de evasão", value: "4,2%", delta: -12.5, icon: GraduationCap, tone: "gold", spark: [7, 7, 6, 6, 5, 5, 4, 4] },
      { title: "Docentes ativos", value: "246", delta: 2.5, icon: School, tone: "brand", spark: [210, 215, 220, 225, 232, 238, 242, 246] },
    ],
    charts: [
      {
        id: "matriculas",
        title: "Matrículas por faculdade",
        type: "bar",
        kind: "number",
        series: [{ key: "alunos", name: "Alunos" }],
        data: [
          { name: "Direito", alunos: 2100 },
          { name: "Economia", alunos: 1850 },
          { name: "Engenharia", alunos: 1720 },
          { name: "Saúde", alunos: 1480 },
          { name: "Letras", alunos: 1120 },
          { name: "Agronomia", alunos: 1572 },
        ],
      },
      {
        id: "evasao",
        title: "Evasão predita por IA (próximo semestre)",
        type: "line",
        kind: "number",
        series: [{ key: "risco", name: "Estudantes em risco" }],
        data: monthly.map((name, i) => ({ name, risco: [180, 165, 150, 130, 115, 98][i] })),
      },
    ],
    tables: [
      {
        id: "vagas",
        title: "Ocupação de vagas por curso",
        columns: ["Curso", "Vagas", "Candidatos", "Ocupação"],
        rows: [
          [text("Engenharia Informática"), number(120), number(480), badge("100%", "success")],
          [text("Medicina"), number(60), number(310), badge("100%", "success")],
          [text("Administração Pública"), number(100), number(210), badge("100%", "success")],
          [text("Geografia"), number(80), number(64), badge("80%", "gold")],
          [text("Filosofia"), number(50), number(31), badge("62%", "warning")],
        ],
      },
    ],
    alerts: [
      { tone: "info", title: "Calendário de matrículas", message: "Matrícula online abre em 10/08/2026 para calouros." },
      { tone: "success", title: "IA ativa", message: "Modelo preditivo identificou 98 estudantes em risco — plano de tutoria sugerido." },
    ],
    extras: ["calendar"],
  },
  "gw-school": {
    productSlug: "gw-school",
    greeting: "Escola Primária de Bairro Militar",
    kpis: [
      { title: "Alunos matriculados", value: "486", delta: 3.6, icon: Users, tone: "brand", spark: [430, 445, 450, 458, 465, 472, 480, 486] },
      { title: "Turmas ativas", value: "16", delta: 0, icon: School, tone: "navy", spark: [14, 14, 15, 15, 16, 16, 16, 16] },
      { title: "Frequência média", value: "91%", delta: 2.2, icon: GraduationCap, tone: "gold", spark: [86, 87, 88, 88, 89, 90, 90, 91] },
      { title: "Merendas servidas", value: "12.908", delta: 4.8, icon: BookOpen, tone: "brand", spark: [10000, 10600, 11000, 11500, 11900, 12300, 12600, 12908] },
    ],
    charts: [
      {
        id: "alunos-por-turma",
        title: "Alunos por turma",
        type: "bar",
        kind: "number",
        series: [{ key: "alunos", name: "Alunos" }],
        data: [
          { name: "1ª A", alunos: 32 },
          { name: "2ª A", alunos: 29 },
          { name: "3ª A", alunos: 31 },
          { name: "4ª A", alunos: 28 },
          { name: "5ª A", alunos: 30 },
          { name: "6ª A", alunos: 27 },
        ],
      },
      {
        id: "presenca",
        title: "Frequência por dia da semana",
        type: "line",
        kind: "percent",
        series: [{ key: "freq", name: "Frequência %" }],
        data: [
          { name: "Seg", freq: 93 },
          { name: "Ter", freq: 91 },
          { name: "Qua", freq: 92 },
          { name: "Qui", freq: 90 },
          { name: "Sex", freq: 88 },
        ],
      },
    ],
    tables: [
      {
        id: "merenda",
        title: "Gestão da merenda — estoque",
        columns: ["Item", "Estoque", "Consumo diário", "Status"],
        rows: [
          [text("Arroz (kg)"), number(120), number(45), badge("Suficiente", "success")],
          [text("Feijão (kg)"), number(40), number(20), badge("Repor", "warning")],
          [text("Óleo (L)"), number(30), number(8), badge("Suficiente", "success")],
          [text("Farinha (kg)"), number(18), number(12), badge("Crítico", "danger")],
        ],
      },
    ],
    alerts: [
      { tone: "warning", title: "Estoque de farinha crítico", message: "A entrega da cooperativa está prevista para sexta-feira." },
      { tone: "info", title: "Comunicado aos pais", message: "Enviados 42 avisos por SMS sobre a reunião de pais de agosto." },
    ],
  },
};

export const eduCalendarEvents: CalendarEvent[] = [
  { date: "2026-08-01", label: "Fim do recesso", tone: "info" },
  { date: "2026-08-03", label: "Início das aulas — S2", tone: "brand" },
  { date: "2026-08-10", label: "Matrícula de calouros", tone: "brand" },
  { date: "2026-08-14", label: "Prazo de atividades", tone: "gold" },
  { date: "2026-08-21", label: "Mini-teste 3", tone: "danger" },
  { date: "2026-08-28", label: "Entrega de notas parciais", tone: "info" },
];
