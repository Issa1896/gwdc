import type { BadgeProps } from "@/components/ui/badge";

/**
 * GW Education — Sistema de Gestão Acadêmica Nacional.
 * Tipos do ecossistema completo (dados fictícios realistas).
 */

/* ────────────────────────── Células de tabela (MÓDULO 6) ────────────────────────── */

export type Cell =
  | { kind: "text"; value: string }
  | { kind: "badge"; value: string; tone: BadgeProps["tone"] }
  | { kind: "number"; value: number }
  | { kind: "currency"; value: number }
  | { kind: "percent"; value: number }
  | { kind: "date"; value: string };

/** Helpers compactos para células de tabela. */
export const text = (value: string): Cell => ({ kind: "text", value });
export const badge = (value: string, tone: BadgeProps["tone"] = "neutral"): Cell => ({ kind: "badge", value, tone });
export const number = (value: number): Cell => ({ kind: "number", value });
export const currency = (value: number): Cell => ({ kind: "currency", value });
export const percent = (value: number): Cell => ({ kind: "percent", value });
export const date = (value: string): Cell => ({ kind: "date", value });

/** Formata FCFA (franco da África Ocidental). */
export const fcfa = (value: number) =>
  new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 0 }).format(value) + " FCFA";

export const shortDate = (value: string) =>
  new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short" }).format(new Date(value));

/* ────────────────────────── Cadastro nacional (MÓDULO 6) ────────────────────────── */

export type StatusAluno = "ativo" | "concluinte" | "trancado" | "suspenso";
export type StatusPagamento = "pago" | "parcial" | "pendente" | "vencido";
export type SituacaoMateria = "aprovado" | "em_curso" | "reprovado";

export interface Estudante {
  id: string;
  nome: string;
  sexo: "F" | "M";
  nascimento: string;
  regiao: string;
  telefone: string;
  email: string;
  cursoId: string;
  anoIngresso: number;
  status: StatusAluno;
}

export interface Curso {
  id: string;
  nome: string;
  faculdade: string;
  grau: string;
  duracaoAnos: number;
}

export interface Turma {
  id: string;
  nome: string;
  cursoId: string;
  turno: string;
  horario: string;
  sala: string;
  coordenadorId: string;
  estudantes: string[];
}

export interface Fatura {
  id: string;
  referencia: string;
  estudanteId: string;
  descricao: string;
  vencimento: string;
  valor: number;
  pago: number;
  status: StatusPagamento;
}

export interface NotaMateria {
  disciplinaId: string;
  disciplina: string;
  av1: number | null;
  av2: number | null;
  provaFinal: number | null;
  media: number | null;
  frequencia: number;
  situacao: SituacaoMateria;
}

export interface Chamada {
  dia: string;
  disciplinaId: string;
  disciplina: string;
  presenca: boolean;
}

export interface Docente {
  id: string;
  nome: string;
  titulo: string;
  email: string;
  faculdade: string;
  cargaSemanal: number;
  disciplinas: string[];
  status: "ativo" | "afastado";
}

/* ────────────────────────── Domínio (portais e módulos) ────────────────────────── */

export type Tone = "brand" | "navy" | "gold" | "success" | "warning" | "danger" | "info";

export type Status = "Ativo" | "Trancado" | "Concluído" | "Em risco";

export interface SubjectGrade {
  id: string;
  name: string;
  code: string;
  credits: number;
  av1?: number;
  av2?: number;
  final?: number;
  attendance: number;
  status: "Aprovado" | "Em curso" | "Em risco" | "Reprovado";
  professorId: string;
}

export interface AcadStudent {
  id: string;
  name: string;
  gender: "F" | "M";
  course: string;
  institution: string;
  year: number;
  semester: string;
  status: Status;
  email: string;
  phone: string;
  guardian?: string;
  subjects: SubjectGrade[];
}

export interface Professor {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  focus: string;
  subjects: string[];
  totalStudents: number;
}

export interface Discipline {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  hours: number;
  year: number;
  mandatory: boolean;
  description: string;
  vacancies: number;
  enrolled: number;
  professorId: string;
}

export interface Material {
  id: string;
  title: string;
  type: "Aula" | "PDF" | "Vídeo" | "Exercício" | "Laboratório";
  publishedAt: string;
  downloads: number;
}

export interface ForumTopic {
  id: string;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
}

export interface AvaActivity {
  id: string;
  title: string;
  kind: "Trabalho" | "Mini-teste" | "Fórum" | "Projeto";
  due: string;
  weight: string;
  submitted: boolean;
}

export interface AvaDiscipline {
  disciplineId: string;
  materials: Material[];
  forum: ForumTopic[];
  activities: AvaActivity[];
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
}

export interface OnlineExam {
  id: string;
  disciplineId: string;
  title: string;
  attempts: number;
  duration: string;
  window: string;
  status: "Disponível" | "Agendada" | "Encerrada";
  antiFraud: string[];
  questions: ExamQuestion[];
}

export interface LibraryItem {
  id: string;
  title: string;
  author: string;
  category: string;
  year: number;
  copies: number;
  available: number;
  digital: boolean;
}

export interface CalendarEventItem {
  date: string;
  label: string;
  tone: Tone;
  category: "Acadêmico" | "Matrícula" | "Avaliação" | "Férias" | "Feriado" | "Institucional";
}

export interface Diploma {
  id: string;
  code: string;
  studentName: string;
  course: string;
  institution: string;
  issuedAt: string;
  status: "Emitido" | "Verificado" | "Pendente";
  verifiedCount: number;
}

export interface EnrollmentRequest {
  id: string;
  studentName: string;
  course: string;
  preference: number;
  documents: string[];
  requestedAt: string;
  sexo?: "F" | "M";
  regiao?: string;
  nascimento?: string;
  email?: string;
}

export interface RegionIndicator {
  region: string;
  schools: number;
  students: number;
  teachers: number;
  approval: number;
  attendance: number;
}

/** Empréstimo ativo da biblioteca nacional. */
export interface LoanRecord {
  id: string;
  livroId: string;
  titulo: string;
  leitor: string;
  inicio: string;
  devolucao: string;
}

/** Matrícula realizada (histórico). */
export interface RecentEnrollment {
  id: string;
  student: string;
  course: string;
  date: string;
  status: string;
}

/** Registo público de verificação de diploma. */
export interface VerificationLogEntry {
  hash: string;
  date: string;
  holder: string;
}

/** Rótulos de status para células Badge. */
export const STATUS_ALUNO_LABEL: Record<StatusAluno, { label: string; tone: BadgeProps["tone"] }> = {
  ativo: { label: "Ativo", tone: "success" },
  concluinte: { label: "Concluinte", tone: "brand" },
  trancado: { label: "Trancado", tone: "warning" },
  suspenso: { label: "Suspenso", tone: "danger" },
};

export const STATUS_PAGAMENTO_LABEL: Record<StatusPagamento, { label: string; tone: BadgeProps["tone"] }> = {
  pago: { label: "Pago", tone: "success" },
  parcial: { label: "Parcial", tone: "warning" },
  pendente: { label: "Pendente", tone: "info" },
  vencido: { label: "Vencido", tone: "danger" },
};

/** Rótulo de situação acadêmica de uma disciplina. */
export function situacaoLabel(s: SituacaoMateria): { label: string; tone: BadgeProps["tone"] } {
  switch (s) {
    case "aprovado":
      return { label: "Aprovado", tone: "success" };
    case "em_curso":
      return { label: "Em curso", tone: "info" };
    case "reprovado":
      return { label: "Reprovado", tone: "danger" };
  }
}