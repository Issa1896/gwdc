/** GW Health — Saúde Digital Conectada · Tipos centrais. */

export interface Paciente {
  id: string;
  niss: string;
  name: string;
  sexo: "M" | "F";
  idade: number;
  sangue: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  localidade: string;
  unidade: string;
  cronicas: string[];
  alergias: string[];
  seguimento: "estavel" | "seguimento" | "critico";
}

export type ConsultaTipo = "presencial" | "teleconsulta";

export type ConsultaStatus = "agendada" | "realizada" | "cancelada";

export interface Consulta {
  id: string;
  patientId: string;
  medicoId: string;
  tipo: ConsultaTipo;
  data: string;
  motivo: string;
  status: ConsultaStatus;
  tensao?: string;
  pulso?: number;
  temperatura?: number;
  triagem?: "normal" | "alerta" | "critica";
}

export interface Medico {
  id: string;
  name: string;
  specialty: string;
  unidade: string;
  telefone: string;
  disponivel: boolean;
}

export interface Vacina {
  id: string;
  patientId: string;
  nome: string;
  dose: string;
  data: string;
  unidade: string;
}

export interface Medicamento {
  id: string;
  name: string;
  categoria: string;
  stock: number;
  stockMinimo: number;
  custo: number;
}

export type SurtoStatus = "monitorado" | "ativo" | "controlado";

export interface Surto {
  id: string;
  doenca: string;
  regiao: string;
  casos: number;
  suspeitos: number;
  situacao: SurtoStatus;
  tendencia: "subida" | "estavel" | "descida";
  ultimoUpdate: string;
}

export interface HealthConfig {
  prontuarioUnico: boolean;
  telemedicina: boolean;
  alertaSurtos: boolean;
  stockCritico: boolean;
  carteiraVacinacao: boolean;
}

export interface HealthState {
  pacientes: Paciente[];
  medicos: Medico[];
  consultas: Consulta[];
  vacinas: Vacina[];
  medicamentos: Medicamento[];
  surtos: Surto[];
  config: HealthConfig;
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