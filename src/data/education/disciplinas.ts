import type { Discipline } from "./types";

/** GW Education — Catálogo de disciplinas ofertadas no semestre 2/2026. */
export const DISCIPLINES: Discipline[] = [
  {
    id: "d1",
    code: "MAT-210",
    name: "Matemática Discreta",
    department: "Matemática e Estatística",
    credits: 4,
    hours: 60,
    year: 1,
    mandatory: true,
    description:
      "Lógica proposicional, conjuntos, relações, grafos e árvores — os fundamentos matemáticos da computação e da análise de algoritmos.",
    vacancies: 150,
    enrolled: 148,
    professorId: "p1",
  },
  {
    id: "d2",
    code: "INF-220",
    name: "Programação Web",
    department: "Ciências da Computação",
    credits: 5,
    hours: 75,
    year: 2,
    mandatory: true,
    description:
      "Desenvolvimento full-stack: HTML/CSS, JavaScript, React e APIs REST, com projeto prático de aplicação completa.",
    vacancies: 120,
    enrolled: 118,
    professorId: "p2",
  },
  {
    id: "d3",
    code: "INF-230",
    name: "Bases de Dados",
    department: "Ciências da Computação",
    credits: 5,
    hours: 75,
    year: 2,
    mandatory: true,
    description:
      "Modelo relacional, SQL, normalização, transações e introdução a bancos NoSQL, com laboratórios práticos.",
    vacancies: 120,
    enrolled: 115,
    professorId: "p3",
  },
  {
    id: "d4",
    code: "ECO-240",
    name: "Economia Digital",
    department: "Economia e Gestão",
    credits: 4,
    hours: 60,
    year: 2,
    mandatory: false,
    description:
      "Plataformas digitais, moedas digitais, inclusão financeira e o impacto da digitalização na economia da Guiné-Bissau.",
    vacancies: 180,
    enrolled: 172,
    professorId: "p4",
  },
  {
    id: "d5",
    code: "EST-250",
    name: "Estatística Aplicada",
    department: "Matemática e Estatística",
    credits: 4,
    hours: 60,
    year: 2,
    mandatory: true,
    description:
      "Estatística descritiva, inferência, regressão e uso de ferramentas computacionais para análise de dados reais.",
    vacancies: 200,
    enrolled: 191,
    professorId: "p5",
  },
  {
    id: "d6",
    code: "DIR-260",
    name: "Fundamentos de Direito",
    department: "Direito",
    credits: 4,
    hours: 60,
    year: 1,
    mandatory: true,
    description:
      "Teoria geral do direito, fontes normativas, direito constitucional e introdução à legislação digital guineense.",
    vacancies: 160,
    enrolled: 154,
    professorId: "p6",
  },
];

export function getDiscipline(id: string): Discipline | undefined {
  return DISCIPLINES.find((d) => d.id === id);
}

/** Estudantes matriculados numa disciplina (cross-reference com o catálogo de alunos). */
export function studentsOf(disciplineId: string): string[] {
  const map: Record<string, string[]> = {
    d1: ["2024-0012", "2024-0013", "2025-0031", "2023-0098"],
    d2: ["2024-0012", "2024-0013"],
    d3: ["2024-0012", "2024-0013"],
    d4: ["2023-0087", "2022-0044", "2024-0019", "2025-0031", "2024-0026", "2023-0098"],
    d5: ["2024-0012", "2023-0087", "2022-0044", "2024-0019", "2024-0026", "2023-0098"],
    d6: ["2023-0087", "2022-0044", "2024-0019", "2025-0031", "2024-0026"],
  };
  return map[disciplineId] ?? [];
}