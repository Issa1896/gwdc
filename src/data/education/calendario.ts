import type { CalendarEventItem } from "./types";

/** GW Education — Calendário acadêmico nacional (2º semestre de 2026). */
export const CALENDAR: CalendarEventItem[] = [
  { date: "2026-08-01", label: "Fim do recesso acadêmico", tone: "info", category: "Acadêmico" },
  { date: "2026-08-03", label: "Início das aulas — Semestre 2/2026", tone: "brand", category: "Acadêmico" },
  { date: "2026-08-05", label: "Prazo — Trabalho prático API REST (INF-220)", tone: "gold", category: "Avaliação" },
  { date: "2026-08-07", label: "Reunião dos Conselhos Científicos", tone: "info", category: "Institucional" },
  { date: "2026-08-08", label: "Mini-teste — Bases de Dados (INF-230)", tone: "danger", category: "Avaliação" },
  { date: "2026-08-10", label: "Matrícula de calouros (1ª fase)", tone: "brand", category: "Matrícula" },
  { date: "2026-08-14", label: "Apresentação de projetos — Economia Digital", tone: "gold", category: "Avaliação" },
  { date: "2026-08-15", label: "Seminário Nacional de Educação Digital", tone: "info", category: "Institucional" },
  { date: "2026-08-19", label: "Mini-teste — Matemática Discreta (MAT-210)", tone: "danger", category: "Avaliação" },
  { date: "2026-08-20", label: "Mini-teste — Fundamentos de Direito (DIR-260)", tone: "danger", category: "Avaliação" },
  { date: "2026-08-21", label: "Mini-teste — Programação Web (INF-220)", tone: "danger", category: "Avaliação" },
  { date: "2026-08-28", label: "Entrega de notas parciais", tone: "info", category: "Acadêmico" },
  { date: "2026-08-30", label: "Dia do Estudante", tone: "gold", category: "Institucional" },
  { date: "2026-09-02", label: "Fórum avaliativo — Regulação de dados (DIR-260)", tone: "gold", category: "Avaliação" },
  { date: "2026-09-05", label: "Matrícula de calouros (2ª fase)", tone: "brand", category: "Matrícula" },
  { date: "2026-09-10", label: "Projeto final — Programação Web (INF-220)", tone: "gold", category: "Avaliação" },
  { date: "2026-09-12", label: "Semana da Ciência e Tecnologia", tone: "info", category: "Institucional" },
  { date: "2026-09-24", label: "Feriado nacional — Independência", tone: "navy", category: "Feriado" },
  { date: "2026-10-01", label: "Exames da 1ª época", tone: "danger", category: "Avaliação" },
  { date: "2026-10-15", label: "Fim da 1ª época de exames", tone: "info", category: "Avaliação" },
  { date: "2026-10-22", label: "Exames da 2ª época", tone: "danger", category: "Avaliação" },
  { date: "2026-11-09", label: "Publicação de pautas finais", tone: "info", category: "Acadêmico" },
  { date: "2026-11-18", label: "Colação de grau — turma 2022", tone: "brand", category: "Institucional" },
  { date: "2026-11-30", label: "Encerramento letivo S2/2026", tone: "info", category: "Acadêmico" },
];

export const CALENDAR_CATEGORIES = ["Acadêmico", "Avaliação", "Matrícula", "Feriado", "Institucional"] as const;

export function eventsOfMonth(month: number, year = 2026): CalendarEventItem[] {
  return CALENDAR.filter((e) => {
    const d = new Date(`${e.date}T00:00:00`);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}