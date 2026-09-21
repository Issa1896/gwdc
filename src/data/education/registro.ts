import type { Chamada, Docente, Estudante, Fatura, NotaMateria, Turma } from "./types";
import { DISCIPLINAS_DO_CURSO } from "./cursos";

/**
 * GW Education — Registro nacional (MÓDULO 6): alunos, turmas, faturas,
 * docentes e geradores determinísticos de notas/frequência (demonstração).
 */

export const ESTUDANTES: Estudante[] = [
  { id: "EA-2601", nome: "Aissatu Baldé", sexo: "F", nascimento: "2004-04-12", regiao: "Bissau", telefone: "+245 955 210 402", email: "aissatu.balde@educacao.gw", cursoId: "c1", anoIngresso: 2024, status: "ativo" },
  { id: "EA-2602", nome: "Ibrahima Sané", sexo: "M", nascimento: "2003-11-02", regiao: "Gabú", telefone: "+245 966 701 219", email: "ibrahima.sane@educacao.gw", cursoId: "c1", anoIngresso: 2024, status: "ativo" },
  { id: "EA-2603", nome: "Malam Sanhá", sexo: "M", nascimento: "2004-02-19", regiao: "Oio", telefone: "+245 955 884 317", email: "malam.sanha@educacao.gw", cursoId: "c2", anoIngresso: 2024, status: "ativo" },
  { id: "EA-2604", nome: "Quinta Mendes", sexo: "F", nascimento: "2002-08-05", regiao: "Bissau", telefone: "+245 966 302 845", email: "quinta.mendes@educacao.gw", cursoId: "c3", anoIngresso: 2022, status: "concluinte" },
  { id: "EA-2605", nome: "N'djai Sanhá", sexo: "F", nascimento: "2001-03-27", regiao: "Cacheu", telefone: "+245 955 419 303", email: "ndjai.sanha@educacao.gw", cursoId: "c6", anoIngresso: 2023, status: "ativo" },
  { id: "EA-2606", nome: "Iva Embaló", sexo: "F", nascimento: "2006-01-14", regiao: "Biombo", telefone: "+245 966 910 476", email: "iva.embalo@educacao.gw", cursoId: "c7", anoIngresso: 2025, status: "ativo" },
  { id: "EA-2607", nome: "Ussumane Cá", sexo: "M", nascimento: "2003-07-09", regiao: "Bafatá", telefone: "+245 955 208 714", email: "ussumane.ca@educacao.gw", cursoId: "c8", anoIngresso: 2024, status: "ativo" },
  { id: "EA-2608", nome: "Teodora Vaz", sexo: "F", nascimento: "2003-05-30", regiao: "Quinara", telefone: "+245 966 550 128", email: "teodora.vaz@educacao.gw", cursoId: "c5", anoIngresso: 2023, status: "ativo" },
  { id: "EA-2609", nome: "Braima Cassamá", sexo: "M", nascimento: "2004-09-22", regiao: "Bafatá", telefone: "+245 955 112 463", email: "braima.cassama@educacao.gw", cursoId: "c4", anoIngresso: 2023, status: "ativo" },
  { id: "EA-2610", nome: "Saturina Nanque", sexo: "F", nascimento: "2005-12-01", regiao: "Tombali", telefone: "+245 966 740 918", email: "saturina.nanque@educacao.gw", cursoId: "c3", anoIngresso: 2025, status: "ativo" },
  { id: "EA-2611", nome: "Vicente Lopes", sexo: "M", nascimento: "2002-06-11", regiao: "Bolama", telefone: "+245 955 390 207", email: "vicente.lopes@educacao.gw", cursoId: "c2", anoIngresso: 2021, status: "trancado" },
  { id: "EA-2612", nome: "Mariama Djassi", sexo: "F", nascimento: "2005-10-19", regiao: "Bissau", telefone: "+245 966 208 554", email: "mariama.djassi@educacao.gw", cursoId: "c1", anoIngresso: 2025, status: "ativo" },
];

export const ESTUDANTE_BY_ID: Map<string, Estudante> = new Map(ESTUDANTES.map((e) => [e.id, e]));

export const TURMAS: Turma[] = [
  { id: "t1", nome: "EI-3A", cursoId: "c1", turno: "Diurno", horario: "08h00 – 13h00", sala: "L-204", coordenadorId: "p2", estudantes: ["EA-2601", "EA-2602"] },
  { id: "t2", nome: "DIR-2A", cursoId: "c2", turno: "Diurno", horario: "08h00 – 12h00", sala: "L-118", coordenadorId: "p6", estudantes: ["EA-2603"] },
  { id: "t3", nome: "ECO-4A", cursoId: "c3", turno: "Noturno", horario: "18h00 – 22h00", sala: "L-305", coordenadorId: "p4", estudantes: ["EA-2604", "EA-2610"] },
  { id: "t4", nome: "MED-3A", cursoId: "c4", turno: "Diurno", horario: "08h00 – 14h00", sala: "Anfiteatro B", coordenadorId: "p1", estudantes: ["EA-2609"] },
  { id: "t5", nome: "AGR-2A", cursoId: "c5", turno: "Diurno", horario: "08h00 – 13h00", sala: "Campos A", coordenadorId: "p5", estudantes: ["EA-2608"] },
  { id: "t6", nome: "AP-3A", cursoId: "c6", turno: "Noturno", horario: "18h00 – 22h00", sala: "L-222", coordenadorId: "p4", estudantes: ["EA-2605"] },
  { id: "t7", nome: "LET-1A", cursoId: "c7", turno: "Diurno", horario: "08h00 – 12h00", sala: "L-101", coordenadorId: "p6", estudantes: ["EA-2606"] },
  { id: "t8", nome: "GEO-2A", cursoId: "c8", turno: "Diurno", horario: "08h00 – 13h00", sala: "L-107", coordenadorId: "p5", estudantes: ["EA-2607"] },
];

export const DOCENTES: Docente[] = [
  { id: "p1", nome: "Prof. Doutor Alfredo Pereira Gomes", titulo: "Professor Catedrático", email: "alfredo.gomes@uac.gw", faculdade: "Faculdade de Engenharias e Tecnologias", cargaSemanal: 18, disciplinas: ["d1"], status: "ativo" },
  { id: "p2", nome: "Prof.ª Doutora Maria Luísa Tavares", titulo: "Professora Auxiliar", email: "maria.tavares@uac.gw", faculdade: "Faculdade de Engenharias e Tecnologias", cargaSemanal: 16, disciplinas: ["d2"], status: "ativo" },
  { id: "p3", nome: "Prof. Doutor Carlos Mendes Correia", titulo: "Professor Associado", email: "carlos.correia@uac.gw", faculdade: "Faculdade de Engenharias e Tecnologias", cargaSemanal: 14, disciplinas: ["d3"], status: "ativo" },
  { id: "p4", nome: "Prof.ª Doutora Dilma Sanhá", titulo: "Professora Catedrática", email: "dilma.sanha@uac.gw", faculdade: "Faculdade de Economia e Gestão", cargaSemanal: 20, disciplinas: ["d4"], status: "ativo" },
  { id: "p5", nome: "Prof. Doutor Edmundo Cá", titulo: "Professor Associado", email: "edmundo.ca@uac.gw", faculdade: "Faculdade de Engenharias e Tecnologias", cargaSemanal: 17, disciplinas: ["d5"], status: "ativo" },
  { id: "p6", nome: "Prof.ª Mestre Fatumata Sissé", titulo: "Professora Auxiliar", email: "fatumata.sisse@uac.gw", faculdade: "Faculdade de Direito", cargaSemanal: 15, disciplinas: ["d6"], status: "ativo" },
  { id: "p7", nome: "Prof. Doutor Alberto Indjai", titulo: "Professor Associado", email: "alberto.indjai@uac.gw", faculdade: "Faculdade de Ciências da Saúde", cargaSemanal: 22, disciplinas: ["m1", "m2", "m3"], status: "ativo" },
  { id: "p8", nome: "Prof.ª Doutora Rosa Mendes", titulo: "Professora Catedrática", email: "rosa.mendes@uac.gw", faculdade: "Faculdade de Agronomia", cargaSemanal: 16, disciplinas: ["a1", "a2"], status: "afastado" },
];

export const DOCENTE_BY_ID: Map<string, Docente> = new Map(DOCENTES.map((d) => [d.id, d]));

export const FATURAS: Fatura[] = [
  { id: "f1", referencia: "PRO-2026.2-0001", estudanteId: "EA-2601", descricao: "Propina 1ª parcela — S2/2026", vencimento: "2026-07-31", valor: 250000, pago: 250000, status: "pago" },
  { id: "f2", referencia: "PRO-2026.2-0002", estudanteId: "EA-2601", descricao: "Propina 2ª parcela — S2/2026", vencimento: "2026-09-30", valor: 250000, pago: 0, status: "pendente" },
  { id: "f3", referencia: "PRO-2026.2-0003", estudanteId: "EA-2603", descricao: "Propina 1ª parcela — S2/2026", vencimento: "2026-07-31", valor: 250000, pago: 150000, status: "parcial" },
  { id: "f4", referencia: "PRO-2026.2-0004", estudanteId: "EA-2604", descricao: "Propina anual — S2/2026", vencimento: "2026-07-15", valor: 500000, pago: 500000, status: "pago" },
  { id: "f5", referencia: "PRO-2026.2-0005", estudanteId: "EA-2605", descricao: "Propina 1ª parcela — S2/2026", vencimento: "2026-07-31", valor: 250000, pago: 0, status: "vencido" },
  { id: "f6", referencia: "PRO-2026.2-0006", estudanteId: "EA-2609", descricao: "Propina 1ª parcela — S2/2026", vencimento: "2026-07-31", valor: 320000, pago: 320000, status: "pago" },
  { id: "f7", referencia: "MAT-2026-0012", estudanteId: "EA-2602", descricao: "Material didático digital", vencimento: "2026-08-15", valor: 45000, pago: 0, status: "pendente" },
  { id: "f8", referencia: "INS-2026-0003", estudanteId: "EA-2606", descricao: "Seguro escolar anual", vencimento: "2026-08-01", valor: 15000, pago: 15000, status: "pago" },
  { id: "f9", referencia: "PRO-2026.2-0009", estudanteId: "EA-2607", descricao: "Propina 1ª parcela — S2/2026", vencimento: "2026-07-31", valor: 250000, pago: 250000, status: "pago" },
  { id: "f10", referencia: "PRO-2026.2-0010", estudanteId: "EA-2608", descricao: "Propina 1ª parcela — S2/2026", vencimento: "2026-07-31", valor: 220000, pago: 100000, status: "parcial" },
];

/* ──────────── Geradores determinísticos de desempenho (demonstração) ──────────── */

function hashOf(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100000;
  return h;
}

function clampNota(n: number) {
  return Math.min(19.0, Math.max(8.0, n));
}

/** Notas do estudante no semestre 1/2026 (dados determinísticos). */
export function notasDe(estudanteId: string, cursoId: string): NotaMateria[] {
  const disciplinas = DISCIPLINAS_DO_CURSO[cursoId] ?? [];
  return disciplinas.map((d) => {
    const seed = hashOf(estudanteId + d.id);
    const base = 10 + (seed % 90) / 10;
    const av1 = clampNota(base);
    const av2 = clampNota(base + (hashOf(estudanteId + "v2" + d.id) % 30) / 10 - 1);
    const aprovadoChance = seed % 8; // 0..7 → ~60% aprovados
    const situacao = aprovadoChance >= 3 ? "aprovado" : aprovadoChance === 2 ? "em_curso" : "reprovado";
    const provaFinal = situacao === "aprovado" ? clampNota(av1 + (seed % 30) / 10) : null;
    const media = situacao === "aprovado" ? (av1 + av2 + provaFinal!) / 3 : situacao === "em_curso" ? (av1 + av2) / 2 : (av1 + av2) / 2 - 2;
    return {
      disciplinaId: d.id,
      disciplina: d.nome,
      av1: Math.round(av1 * 10) / 10,
      av2: Math.round(av2 * 10) / 10,
      provaFinal: provaFinal !== null ? Math.round(provaFinal * 10) / 10 : null,
      media: Math.round(media * 10) / 10,
      frequencia: Math.round(78 + (hashOf(estudanteId + "f" + d.id) % 220) / 10),
      situacao,
    };
  });
}

/** Chamadas dos últimos 10 dias letivos (determinísticas). */
export function chamadasDe(estudanteId: string): Chamada[] {
  const dias = ["2026-08-03", "2026-08-04", "2026-08-05", "2026-08-06", "2026-08-07", "2026-08-10", "2026-08-11", "2026-08-12", "2026-08-13", "2026-08-14"];
  return dias.map((dia, i) => {
    const r = hashOf(estudanteId + "c" + dia);
    return { dia, disciplinaId: `d${(i % 4) + 1}`, disciplina: "Disciplina do semestre", presenca: r % 10 < 8 };
  });
}

/** Média geral (0–20) do estudante. */
export function mediaGeralDe(estudanteId: string, cursoId: string): number {
  const notas = notasDe(estudanteId, cursoId).filter((n) => n.media !== null);
  if (!notas.length) return 0;
  return Math.round((notas.reduce((acc, n) => acc + n.media!, 0) / notas.length) * 10) / 10;
}