import type { AcadStudent } from "./types";

/**
 * GW Education — Estudantes (demonstração).
 * Instituição: Universidade Amílcar Cabral (Bissau).
 */
export const STUDENTS: AcadStudent[] = [
  {
    id: "2024-0012",
    name: "Aissatu Baldé",
    gender: "F",
    course: "Engenharia Informática",
    institution: "Universidade Amílcar Cabral",
    year: 3,
    semester: "2026.2",
    status: "Ativo",
    email: "aissatu.balde@estudante.gw",
    phone: "+245 955 210 402",
    guardian: "Mamadu Baldé (pai)",
    subjects: [
      { id: "d2", name: "Programação Web", code: "INF-220", credits: 5, av1: 16, av2: 17, final: 17, attendance: 95, status: "Aprovado", professorId: "p2" },
      { id: "d3", name: "Bases de Dados", code: "INF-230", credits: 5, av1: 13, av2: 14, final: 14, attendance: 91, status: "Aprovado", professorId: "p3" },
      { id: "d1", name: "Matemática Discreta", code: "MAT-210", credits: 4, av1: 14, av2: 15, final: 16, attendance: 93, status: "Aprovado", professorId: "p1" },
      { id: "d5", name: "Estatística Aplicada", code: "EST-250", credits: 4, av1: 11, av2: 12, attendance: 88, status: "Em curso", professorId: "p5" },
    ],
  },
  {
    id: "2024-0013",
    name: "Ibrahima Sané",
    gender: "M",
    course: "Engenharia Informática",
    institution: "Universidade Amílcar Cabral",
    year: 3,
    semester: "2026.2",
    status: "Em risco",
    email: "ibrahima.sane@estudante.gw",
    phone: "+245 966 701 219",
    subjects: [
      { id: "d2", name: "Programação Web", code: "INF-220", credits: 5, av1: 9, av2: 10, attendance: 74, status: "Em risco", professorId: "p2" },
      { id: "d3", name: "Bases de Dados", code: "INF-230", credits: 5, av1: 12, av2: 13, attendance: 81, status: "Em curso", professorId: "p3" },
      { id: "d1", name: "Matemática Discreta", code: "MAT-210", credits: 4, av1: 8, av2: 9, attendance: 67, status: "Em risco", professorId: "p1" },
    ],
  },
  {
    id: "2023-0087",
    name: "Malam Sanhá",
    gender: "M",
    course: "Direito",
    institution: "Universidade Amílcar Cabral",
    year: 2,
    semester: "2026.2",
    status: "Ativo",
    email: "malam.sanha@estudante.gw",
    phone: "+245 955 884 317",
    subjects: [
      { id: "d6", name: "Fundamentos de Direito", code: "DIR-260", credits: 4, av1: 15, av2: 16, final: 16, attendance: 94, status: "Aprovado", professorId: "p6" },
      { id: "d4", name: "Economia Digital", code: "ECO-240", credits: 4, av1: 14, av2: 14, final: 15, attendance: 90, status: "Aprovado", professorId: "p4" },
      { id: "d5", name: "Estatística Aplicada", code: "EST-250", credits: 4, av1: 12, av2: 13, attendance: 89, status: "Em curso", professorId: "p5" },
    ],
  },
  {
    id: "2022-0044",
    name: "Quinta Mendes",
    gender: "F",
    course: "Economia",
    institution: "Universidade Amílcar Cabral",
    year: 4,
    semester: "2026.2",
    status: "Ativo",
    email: "quinta.mendes@estudante.gw",
    phone: "+245 966 302 845",
    subjects: [
      { id: "d4", name: "Economia Digital", code: "ECO-240", credits: 4, av1: 15, av2: 16, final: 16, attendance: 93, status: "Aprovado", professorId: "p4" },
      { id: "d5", name: "Estatística Aplicada", code: "EST-250", credits: 4, av1: 14, av2: 15, final: 15, attendance: 92, status: "Aprovado", professorId: "p5" },
      { id: "d6", name: "Fundamentos de Direito", code: "DIR-260", credits: 4, av1: 13, av2: 13, attendance: 86, status: "Em curso", professorId: "p6" },
    ],
  },
  {
    id: "2024-0019",
    name: "N'djai Sanhá",
    gender: "F",
    course: "Administração Pública",
    institution: "Universidade Amílcar Cabral",
    year: 3,
    semester: "2026.2",
    status: "Ativo",
    email: "ndjai.sanha@estudante.gw",
    phone: "+245 955 419 303",
    guardian: "Sene Sanhá (mãe)",
    subjects: [
      { id: "d4", name: "Economia Digital", code: "ECO-240", credits: 4, av1: 13, av2: 14, final: 14, attendance: 90, status: "Aprovado", professorId: "p4" },
      { id: "d5", name: "Estatística Aplicada", code: "EST-250", credits: 4, av1: 12, av2: 12, attendance: 88, status: "Em curso", professorId: "p5" },
      { id: "d6", name: "Fundamentos de Direito", code: "DIR-260", credits: 4, av1: 10, av2: 11, attendance: 79, status: "Em risco", professorId: "p6" },
    ],
  },
  {
    id: "2025-0031",
    name: "Iva Embaló",
    gender: "F",
    course: "Letras",
    institution: "Universidade Amílcar Cabral",
    year: 1,
    semester: "2026.2",
    status: "Ativo",
    email: "iva.embalo@estudante.gw",
    phone: "+245 966 910 476",
    guardian: "Família Embaló (encarregado)",
    subjects: [
      { id: "d4", name: "Economia Digital", code: "ECO-240", credits: 4, av1: 14, av2: 15, attendance: 96, status: "Em curso", professorId: "p4" },
      { id: "d6", name: "Fundamentos de Direito", code: "DIR-260", credits: 4, av1: 13, av2: 14, attendance: 94, status: "Em curso", professorId: "p6" },
      { id: "d1", name: "Matemática Discreta", code: "MAT-210", credits: 4, av1: 15, av2: 16, attendance: 95, status: "Em curso", professorId: "p1" },
    ],
  },
  {
    id: "2024-0026",
    name: "Ussumane Cá",
    gender: "M",
    course: "Geografia",
    institution: "Universidade Amílcar Cabral",
    year: 2,
    semester: "2026.2",
    status: "Ativo",
    email: "ussumane.ca@estudante.gw",
    phone: "+245 955 208 714",
    subjects: [
      { id: "d5", name: "Estatística Aplicada", code: "EST-250", credits: 4, av1: 12, av2: 13, attendance: 87, status: "Em curso", professorId: "p5" },
      { id: "d4", name: "Economia Digital", code: "ECO-240", credits: 4, av1: 13, av2: 13, attendance: 91, status: "Em curso", professorId: "p4" },
      { id: "d6", name: "Fundamentos de Direito", code: "DIR-260", credits: 4, av1: 12, av2: 12, attendance: 84, status: "Em curso", professorId: "p6" },
    ],
  },
  {
    id: "2023-0098",
    name: "Teodora Vaz",
    gender: "F",
    course: "Agronomia",
    institution: "Universidade Amílcar Cabral",
    year: 2,
    semester: "2026.2",
    status: "Ativo",
    email: "teodora.vaz@estudante.gw",
    phone: "+245 966 550 128",
    subjects: [
      { id: "d5", name: "Estatística Aplicada", code: "EST-250", credits: 4, av1: 14, av2: 15, attendance: 93, status: "Em curso", professorId: "p5" },
      { id: "d1", name: "Matemática Discreta", code: "MAT-210", credits: 4, av1: 13, av2: 14, attendance: 92, status: "Em curso", professorId: "p1" },
      { id: "d4", name: "Economia Digital", code: "ECO-240", credits: 4, av1: 12, av2: 13, attendance: 89, status: "Em curso", professorId: "p4" },
    ],
  },
];

/** Calcula a média ponderada (0–20) de um estudante nas disciplinas com nota final ou soma parcial. */
export function weightedAverage(student: AcadStudent): number {
  const entries = student.subjects.filter((s) => s.av1 !== undefined || s.av2 !== undefined);
  if (!entries.length) return 0;
  const total = entries.reduce((acc, s) => {
    const base = s.final ?? Math.max(s.av1 ?? 0, s.av2 ?? 0);
    return acc + base * s.credits;
  }, 0);
  const credits = entries.reduce((acc, s) => acc + s.credits, 0);
  return total / credits;
}

/** Frequência média ponderada por ECTS. */
export function overallAttendance(student: AcadStudent): number {
  const total = student.subjects.reduce((acc, s) => acc + s.attendance * s.credits, 0);
  const credits = student.subjects.reduce((acc, s) => acc + s.credits, 0);
  return total / credits;
}

export function getStudent(id: string): AcadStudent | undefined {
  return STUDENTS.find((s) => s.id === id);
}