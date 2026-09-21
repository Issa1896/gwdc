/** GW Campus — Gestão Universitária Completa · Tipos centrais. */

export interface CourseSemester {
  num: number;
  courses: string[];
  ects: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  area: string;
  duration: string;
  regime: "presencial" | "hibrido" | "distancia";
  ectsCp: number;
  status: "active" | "new" | "evaluating";
  coordinator: string;
  soa: CourseSemester[];
  mensalidade: number;
}

export interface Turma {
  id: string;
  code: string;
  courseId: string;
  semester: number;
  year: number;
  shift: "diurno" | "noturno" | "misto";
  professorId: string;
  enrolled: number;
  capacity: number;
}

export type ProfessorCategoria = "catedratico" | "associado" | "auxiliar" | "convidado" | "monitor";

export interface Professor {
  id: string;
  name: string;
  specialty: string;
  categoria: ProfessorCategoria;
  aulasSemanais: number;
  projetos: number;
  coordinator: boolean;
}

export type ResearchStatus = "active" | "pipeline" | "concluded";

export interface ResearchProject {
  id: string;
  title: string;
  area: string;
  lead: string;
  funding: number;
  status: ResearchStatus;
  progress: number;
  members: number;
  startedAt?: string;
  publications?: number;
}

export interface ExtensionProject {
  id: string;
  title: string;
  community: string;
  type: string;
  beneficiaries: number;
  status: "active" | "pipeline";
}

export type WelfareKind = "bolsa" | "residencia" | "apoio";

export type WelfareStatus = "ativa" | "suspensa" | "candidatura";

export interface Welfare {
  id: string;
  kind: WelfareKind;
  title: string;
  description: string;
  status: WelfareStatus;
}

export interface Residencia {
  id: string;
  name: string;
  capacity: number;
  occupants: number;
}

export interface CampusConfig {
  acreditacao: boolean;
  calendarioUnificado: boolean;
  bolsasAutomaticas: boolean;
  alertasAcademicos: boolean;
}

export interface CampusState {
  cursos: Course[];
  turmas: Turma[];
  docentes: Professor[];
  research: ResearchProject[];
  extension: ExtensionProject[];
  welfare: Welfare[];
  residencias: Residencia[];
  config: CampusConfig;
}

export function fmtFcfa(n: number): string {
  return `${new Intl.NumberFormat("pt-PT").format(Math.round(n))} FCFA`;
}

export function daysAgo(days: number, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, Math.floor(Math.random() * 59), 0, 0);
  return d.toISOString();
}

const dateFmt = new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short", year: "numeric" });

export function fmtDate(iso: string): string {
  try {
    return dateFmt.format(new Date(iso));
  } catch {
    return iso;
  }
}