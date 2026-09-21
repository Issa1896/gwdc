import type { AvaDiscipline } from "./types";

/** GW Education — Ambiente Virtual de Aprendizagem (AVA/LMS). */
export const AVA: AvaDiscipline[] = [
  {
    disciplineId: "d2",
    materials: [
      { id: "m1", title: "Aula 24 — Autenticação e Sessões", type: "Aula", publishedAt: "2026-08-18", downloads: 312 },
      { id: "m2", title: "Guia prático — Deploy de API REST", type: "PDF", publishedAt: "2026-08-12", downloads: 486 },
      { id: "m3", title: "Gravuras da aula — React Hooks na prática", type: "Vídeo", publishedAt: "2026-08-06", downloads: 234 },
      { id: "m4", title: "Laboratório 7 — Consumo de APIs externas", type: "Laboratório", publishedAt: "2026-07-30", downloads: 178 },
    ],
    forum: [
      { id: "f1", title: "Dúvida: middleware de autenticação no Next.js", author: "Aissatu Baldé", replies: 3, lastActivity: "2026-08-18" },
      { id: "f2", title: "Compartilhamento: boas práticas de TypeScript", author: "Ibrahima Sané", replies: 5, lastActivity: "2026-08-17" },
    ],
    activities: [
      { id: "a1", title: "Trabalho prático — API REST completa", kind: "Trabalho", due: "2026-08-05", weight: "30%", submitted: true },
      { id: "a2", title: "Mini-teste 3 — Autenticação e Sessões", kind: "Mini-teste", due: "2026-08-21", weight: "20%", submitted: false },
      { id: "a3", title: "Projeto final — Portal de notícias", kind: "Projeto", due: "2026-09-10", weight: "40%", submitted: false },
    ],
  },
  {
    disciplineId: "d3",
    materials: [
      { id: "m5", title: "Aula 21 — Transações e Concorrência", type: "Aula", publishedAt: "2026-08-15", downloads: 268 },
      { id: "m6", title: "Slides — Modelagem ERM (revisto)", type: "PDF", publishedAt: "2026-08-10", downloads: 394 },
      { id: "m7", title: "Laboratório 6 — Transações em PostgreSQL", type: "Laboratório", publishedAt: "2026-08-02", downloads: 154 },
      { id: "m8", title: "Vídeo — Índices e performance de consultas", type: "Vídeo", publishedAt: "2026-07-25", downloads: 202 },
    ],
    forum: [
      { id: "f3", title: "Dúvida: deadlocks em sistemas de bilhetagem", author: "Quinta Mendes", replies: 2, lastActivity: "2026-08-16" },
    ],
    activities: [
      { id: "a4", title: "Mini-teste 3 — Transações", kind: "Mini-teste", due: "2026-08-08", weight: "20%", submitted: false },
      { id: "a5", title: "Trabalho — Esquema do SIGA-GW", kind: "Trabalho", due: "2026-08-22", weight: "30%", submitted: false },
    ],
  },
  {
    disciplineId: "d1",
    materials: [
      { id: "m9", title: "Aula 20 — Teoria dos Grafos: percursos", type: "Aula", publishedAt: "2026-08-14", downloads: 241 },
      { id: "m10", title: "Lista de exercícios 5 (com resolução)", type: "Exercício", publishedAt: "2026-08-07", downloads: 356 },
      { id: "m11", title: "PDF — Provas de anos anteriores", type: "PDF", publishedAt: "2026-07-28", downloads: 512 },
    ],
    forum: [
      { id: "f4", title: "Discussão: árvores geradoras mínimas", author: "Iva Embaló", replies: 4, lastActivity: "2026-08-17" },
    ],
    activities: [
      { id: "a6", title: "Mini-teste 3 — Grafos", kind: "Mini-teste", due: "2026-08-19", weight: "20%", submitted: false },
    ],
  },
  {
    disciplineId: "d4",
    materials: [
      { id: "m12", title: "Aula 18 — Moedas digitais e inclusão financeira", type: "Aula", publishedAt: "2026-08-11", downloads: 287 },
      { id: "m13", title: "Estudo de caso — GW Pay na Guiné-Bissau", type: "PDF", publishedAt: "2026-08-04", downloads: 433 },
      { id: "m14", title: "Vídeo — Economia de plataformas", type: "Vídeo", publishedAt: "2026-07-27", downloads: 190 },
    ],
    forum: [
      { id: "f5", title: "Debate: impacto do comércio eletrônico local", author: "N'djai Sanhá", replies: 7, lastActivity: "2026-08-18" },
    ],
    activities: [
      { id: "a7", title: "Apresentação de projeto — Plataforma digital", kind: "Projeto", due: "2026-08-14", weight: "40%", submitted: false },
      { id: "a8", title: "Mini-teste 2 — Finanças digitais", kind: "Mini-teste", due: "2026-08-26", weight: "15%", submitted: false },
    ],
  },
  {
    disciplineId: "d5",
    materials: [
      { id: "m15", title: "Aula 17 — Regressão linear múltipla", type: "Aula", publishedAt: "2026-08-13", downloads: 198 },
      { id: "m16", title: "Dados de exercício — censo escolar 2025", type: "Exercício", publishedAt: "2026-08-09", downloads: 264 },
      { id: "m17", title: "PDF — Tabelas estatísticas (t, F, qui-quadrado)", type: "PDF", publishedAt: "2026-07-22", downloads: 421 },
    ],
    forum: [
      { id: "f6", title: "Ajuda: interpretação do p-valor", author: "Ussumane Cá", replies: 3, lastActivity: "2026-08-16" },
    ],
    activities: [
      { id: "a9", title: "Trabalho — Análise do censo escolar", kind: "Trabalho", due: "2026-08-28", weight: "30%", submitted: false },
    ],
  },
  {
    disciplineId: "d6",
    materials: [
      { id: "m18", title: "Aula 15 — Lei da Identidade Digital (projeto)", type: "Aula", publishedAt: "2026-08-12", downloads: 214 },
      { id: "m19", title: "Slides — Fontes do Direito guineense", type: "PDF", publishedAt: "2026-08-05", downloads: 301 },
      { id: "m20", title: "Vídeo — Direito e tecnologia", type: "Vídeo", publishedAt: "2026-07-26", downloads: 172 },
    ],
    forum: [
      { id: "f7", title: "Dúvida: hierarquia das normas", author: "Malam Sanhá", replies: 2, lastActivity: "2026-08-15" },
    ],
    activities: [
      { id: "a10", title: "Mini-teste 3 — Direito digital", kind: "Mini-teste", due: "2026-08-20", weight: "20%", submitted: false },
      { id: "a11", title: "Fórum avaliativo — Regulação de dados", kind: "Fórum", due: "2026-09-02", weight: "15%", submitted: false },
    ],
  },
];

export function getAva(disciplineId: string): AvaDiscipline | undefined {
  return AVA.find((a) => a.disciplineId === disciplineId);
}