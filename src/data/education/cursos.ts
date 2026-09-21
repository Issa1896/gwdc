import type { Curso } from "./types";

/** GW Education — Catálogo nacional de cursos (MÓDULO 6). */
export const CURSOS: Curso[] = [
  { id: "c1", nome: "Engenharia Informática", faculdade: "Faculdade de Engenharias e Tecnologias", grau: "Licenciatura", duracaoAnos: 4 },
  { id: "c2", nome: "Direito", faculdade: "Faculdade de Direito", grau: "Licenciatura", duracaoAnos: 4 },
  { id: "c3", nome: "Economia", faculdade: "Faculdade de Economia e Gestão", grau: "Licenciatura", duracaoAnos: 4 },
  { id: "c4", nome: "Medicina", faculdade: "Faculdade de Ciências da Saúde", grau: "Licenciatura", duracaoAnos: 6 },
  { id: "c5", nome: "Agronomia", faculdade: "Faculdade de Agronomia", grau: "Licenciatura", duracaoAnos: 4 },
  { id: "c6", nome: "Administração Pública", faculdade: "Faculdade de Economia e Gestão", grau: "Licenciatura", duracaoAnos: 4 },
  { id: "c7", nome: "Letras", faculdade: "Faculdade de Letras e Ciências Sociais", grau: "Licenciatura", duracaoAnos: 4 },
  { id: "c8", nome: "Geografia", faculdade: "Faculdade de Letras e Ciências Sociais", grau: "Licenciatura", duracaoAnos: 4 },
];

export const CURSO_BY_ID: Map<string, Curso> = new Map(CURSOS.map((c) => [c.id, c]));

export function getCurso(id: string): Curso | undefined {
  return CURSO_BY_ID.get(id);
}

/** Disciplinas do catálogo correspondentes a cada curso (vínculo do MÓDULO 6). */
export const DISCIPLINAS_DO_CURSO: Record<string, { id: string; nome: string }[]> = {
  c1: [
    { id: "d1", nome: "Matemática Discreta" },
    { id: "d2", nome: "Programação Web" },
    { id: "d3", nome: "Bases de Dados" },
    { id: "d5", nome: "Estatística Aplicada" },
  ],
  c2: [
    { id: "d6", nome: "Fundamentos de Direito" },
    { id: "d4", nome: "Economia Digital" },
    { id: "d5", nome: "Estatística Aplicada" },
  ],
  c3: [
    { id: "d4", nome: "Economia Digital" },
    { id: "d5", nome: "Estatística Aplicada" },
    { id: "d6", nome: "Fundamentos de Direito" },
  ],
  c4: [
    { id: "m1", nome: "Anatomia Humana" },
    { id: "m2", nome: "Biologia Celular" },
    { id: "m3", nome: "Bioquímica" },
  ],
  c5: [
    { id: "a1", nome: "Solos e Fertilidade" },
    { id: "a2", nome: "Culturas Tropicais" },
    { id: "a3", nome: "Estatística Ambiental" },
  ],
  c6: [
    { id: "ad1", nome: "Gestão Pública" },
    { id: "ad2", nome: "Economia Digital" },
    { id: "ad3", nome: "Direito Administrativo" },
  ],
  c7: [
    { id: "l1", nome: "Literatura Guineense" },
    { id: "l2", nome: "Linguística Geral" },
    { id: "d4", nome: "Economia Digital" },
  ],
  c8: [
    { id: "g1", nome: "Geomorfologia" },
    { id: "g2", nome: "Climatologia" },
    { id: "d5", nome: "Estatística Aplicada" },
  ],
};