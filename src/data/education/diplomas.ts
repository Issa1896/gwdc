import type { Diploma } from "./types";

/** GW Education — Emissão e verificação de diplomas (blockchain/QR de demonstração). */
export const DIPLOMAS: Diploma[] = [
  {
    id: "dp1",
    code: "GW-DIP-2026-0001",
    studentName: "Quinta Mendes",
    course: "Licenciatura em Economia",
    institution: "Universidade Amílcar Cabral",
    issuedAt: "2026-07-25",
    status: "Verificado",
    verifiedCount: 14,
  },
  {
    id: "dp2",
    code: "GW-DIP-2026-0002",
    studentName: "Malam Sanhá",
    course: "Licenciatura em Direito",
    institution: "Universidade Amílcar Cabral",
    issuedAt: "2026-07-28",
    status: "Verificado",
    verifiedCount: 6,
  },
  {
    id: "dp3",
    code: "GW-DIP-2026-0003",
    studentName: "Teodora Vaz",
    course: "Licenciatura em Agronomia",
    institution: "Escola Superior Agrária de Bissorã",
    issuedAt: "2026-06-30",
    status: "Emitido",
    verifiedCount: 1,
  },
  {
    id: "dp4",
    code: "GW-DIP-2026-0004",
    studentName: "Ussumane Cá",
    course: "Licenciatura em Geografia",
    institution: "Instituto Nacional de Estudos e Pesquisa",
    issuedAt: "2026-07-18",
    status: "Emitido",
    verifiedCount: 2,
  },
  {
    id: "dp5",
    code: "GW-DIP-2025-0847",
    studentName: "Iva Embaló",
    course: "Licenciatura em Letras",
    institution: "Universidade Colinas de Boé",
    issuedAt: "2025-11-21",
    status: "Verificado",
    verifiedCount: 21,
  },
  {
    id: "dp6",
    code: "GW-DIP-2026-0006",
    studentName: "N'djai Sanhá",
    course: "Licenciatura em Administração Pública",
    institution: "Instituto Superior de Ciências de Educação",
    issuedAt: "2026-08-02",
    status: "Pendente",
    verifiedCount: 0,
  },
];

/** Registos públicos de verificação (simulação de livro aberto). */
export const VERIFICATION_LOG = [
  { hash: "a1f3c9…77be", date: "2026-08-18", holder: "Gabinete de Recursos Humanos — MEC" },
  { hash: "b2e4d8…88cf", date: "2026-08-15", holder: "GW Digital Company (DPRH)" },
  { hash: "c3d5e7…99d0", date: "2026-08-09", holder: "Embaixada de Portugal em Bissau" },
  { hash: "d4e6f0…aae1", date: "2026-08-02", holder: "Banco da África Ocidental (BCEAO)" },
];

export function getDiploma(id: string): Diploma | undefined {
  return DIPLOMAS.find((d) => d.id === id);
}