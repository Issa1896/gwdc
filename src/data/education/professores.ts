import type { Professor } from "./types";

/** GW Education — Corpo docente (demonstração). */
export const PROFESSORS: Professor[] = [
  {
    id: "p1",
    name: "Prof. Doutor Alfredo Pereira Gomes",
    title: "Professor Catedrático",
    department: "Matemática e Estatística",
    email: "alfredo.gomes@uac.gw",
    focus: "Matemática Discreta · Combinatória",
    subjects: ["MAT-210"],
    totalStudents: 2140,
  },
  {
    id: "p2",
    name: "Prof.ª Doutora Maria Luísa Tavares",
    title: "Professora Auxiliar",
    department: "Ciências da Computação",
    email: "maria.tavares@uac.gw",
    focus: "Engenharia de Software · Web",
    subjects: ["INF-220"],
    totalStudents: 1260,
  },
  {
    id: "p3",
    name: "Prof. Doutor Carlos Mendes Correia",
    title: "Professor Associado",
    department: "Ciências da Computação",
    email: "carlos.correia@uac.gw",
    focus: "Bases de Dados · Sistemas de Informação",
    subjects: ["INF-230"],
    totalStudents: 1180,
  },
  {
    id: "p4",
    name: "Prof.ª Doutora Dilma Sanhá",
    title: "Professora Catedrática",
    department: "Economia e Gestão",
    email: "dilma.sanha@uac.gw",
    focus: "Economia Digital · Inovação",
    subjects: ["ECO-240"],
    totalStudents: 2310,
  },
  {
    id: "p5",
    name: "Prof. Doutor Edmundo Cá",
    title: "Professor Associado",
    department: "Matemática e Estatística",
    email: "edmundo.ca@uac.gw",
    focus: "Estatística Aplicada · Econometria",
    subjects: ["EST-250"],
    totalStudents: 1490,
  },
  {
    id: "p6",
    name: "Prof.ª Mestre Fatumata Sissé",
    title: "Professora Auxiliar",
    department: "Direito",
    email: "fatumata.sisse@uac.gw",
    focus: "Direito Administrativo · Legislação Digital",
    subjects: ["DIR-260"],
    totalStudents: 980,
  },
];

export function getProfessor(id: string): Professor | undefined {
  return PROFESSORS.find((p) => p.id === id);
}