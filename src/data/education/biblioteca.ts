import type { LibraryItem } from "./types";

/** GW Education — Biblioteca digital nacional (acervo de demonstração). */
export const LIBRARY: LibraryItem[] = [
  { id: "b1", title: "Fundamentos de Programação Web", author: "Maria Luísa Tavares", category: "Computação", year: 2024, copies: 12, available: 9, digital: true },
  { id: "b2", title: "Matemática Discreta e suas Aplicações", author: "Alfredo Pereira Gomes", category: "Matemática", year: 2023, copies: 8, available: 2, digital: true },
  { id: "b3", title: "Introdução às Bases de Dados Modernas", author: "Carlos Mendes Correia", category: "Computação", year: 2024, copies: 10, available: 6, digital: true },
  { id: "b4", title: "Economia Digital da África Ocidental", author: "Dilma Sanhá", category: "Economia", year: 2022, copies: 6, available: 0, digital: true },
  { id: "b5", title: "Estatística Aplicada às Ciências Sociais", author: "Edmundo Cá", category: "Estatística", year: 2021, copies: 15, available: 11, digital: true },
  { id: "b6", title: "Constituição da Guiné-Bissau Anotada", author: "Fatumata Sissé", category: "Direito", year: 2020, copies: 20, available: 3, digital: false },
  { id: "b7", title: "História Contemporânea da Guiné-Bissau", author: "Justino Mendes", category: "História", year: 2019, copies: 9, available: 7, digital: false },
  { id: "b8", title: "Sistemas de Informação para Gestão Pública", author: "N'djai Sanhá", category: "Gestão", year: 2024, copies: 7, available: 4, digital: true },
  { id: "b9", title: "Geografia das Ilhas Bijagós", author: "Ussumane Cá", category: "Geografia", year: 2022, copies: 5, available: 1, digital: false },
  { id: "b10", title: "Agronomia Tropical e Segurança Alimentar", author: "Teodora Vaz", category: "Agronomia", year: 2023, copies: 8, available: 8, digital: true },
  { id: "b11", title: "Literatura Guineense: Antologia", author: "Iva Embaló", category: "Letras", year: 2021, copies: 14, available: 10, digital: false },
  { id: "b12", title: "Direito Digital e Proteção de Dados", author: "Fatumata Sissé", category: "Direito", year: 2025, copies: 6, available: 1, digital: true },
];

export const LIBRARY_CATEGORIES = ["Computação", "Direito", "Economia", "Estatística", "Geografia", "Gestão", "História", "Letras", "Matemática", "Agronomia"];