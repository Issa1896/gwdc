import type { RegionIndicator } from "./types";

/** GW Education — Indicadores nacionais (Ministério da Educação · demonstração). */
export const NATIONAL_INDICATORS = {
  students: 480000,
  schools: 312,
  teachers: 12480,
  classrooms: 8412,
  approvalRate: 78.4,
  dropoutRate: 4.2,
  digitalDiplomas: 18420,
  verifiedDiplomas: 15211,
  internshipPartners: 96,
  avaActiveUsers: 31240,
};

export const REGIONS: RegionIndicator[] = [
  { region: "Bissau", schools: 68, students: 156400, teachers: 3840, approval: 82.1, attendance: 91.5 },
  { region: "Bafatá", schools: 51, students: 68400, teachers: 1830, approval: 76.4, attendance: 87.2 },
  { region: "Gabú", schools: 47, students: 61200, teachers: 1590, approval: 74.8, attendance: 85.9 },
  { region: "Oio", schools: 38, students: 55200, teachers: 1440, approval: 79.2, attendance: 88.4 },
  { region: "Cacheu", schools: 34, students: 48900, teachers: 1270, approval: 77.9, attendance: 86.8 },
  { region: "Biombo", schools: 24, students: 32600, teachers: 860, approval: 73.5, attendance: 84.1 },
  { region: "Quinara", schools: 19, students: 25300, teachers: 620, approval: 71.2, attendance: 82.6 },
  { region: "Tombali", schools: 17, students: 21400, teachers: 540, approval: 70.6, attendance: 81.9 },
  { region: "Bolama/Bijagós", schools: 14, students: 10600, teachers: 490, approval: 75.3, attendance: 86.2 },
];

/** Evolução mensal de matrículas ativas no ano letivo 2025/2026. */
export const ENROLLMENT_TREND = [
  { name: "Out", matriculas: 441200, ativas: 421300 },
  { name: "Nov", matriculas: 449800, ativas: 426100 },
  { name: "Dez", matriculas: 456400, ativas: 430800 },
  { name: "Jan", matriculas: 462100, ativas: 434500 },
  { name: "Fev", matriculas: 468300, ativas: 438200 },
  { name: "Mar", matriculas: 473800, ativas: 441700 },
  { name: "Abr", matriculas: 478200, ativas: 444400 },
  { name: "Mai", matriculas: 480000, ativas: 446100 },
];

/** Evasão predita por IA por região (próximo trimestre). */
export const PREDICTED_DROPOUT = REGIONS.map((r) => ({
  name: r.region,
  risco: Math.round(r.approval * 0.12 + (100 - r.attendance) * 0.3),
})).sort((a, b) => b.risco - a.risco);

/** Orçamento do setor por rubrica (bilhões FCFA). */
export const EDUCATION_BUDGET = [
  { name: "Salários", valor: 128.4 },
  { name: "Merenda escolar", valor: 24.6 },
  { name: "Infraestrutura", valor: 31.2 },
  { name: "Recursos didáticos", valor: 9.8 },
  { name: "Digitalização", valor: 12.4 },
  { name: "Bolsa social", valor: 7.2 },
];