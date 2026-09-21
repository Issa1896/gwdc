import type { MvpData } from "./types";
import { mvpGoverno } from "./governo";
import { mvpEducacao, eduCalendarEvents } from "./educacao";
import { mvpEmpresas } from "./empresas";
import { mvpFinancas } from "./financas";
import { mvpSaudeJustica } from "./saude-justica";
import { mvpTransporteClima, transportMapPoints, climateGauges } from "./transporte-clima";
import { mvpDados } from "./dados";

const ALL: Record<string, MvpData> = {
  ...mvpGoverno,
  ...mvpEducacao,
  ...mvpEmpresas,
  ...mvpFinancas,
  ...mvpSaudeJustica,
  ...mvpTransporteClima,
  ...mvpDados,
};

/** Retorna os dados do MVP de um produto. */
export function getMvpData(slug: string): MvpData | undefined {
  return ALL[slug];
}

/** Slugs com MVP disponível. */
export function availableMvpSlugs(): string[] {
  return Object.keys(ALL);
}

export { transportMapPoints, climateGauges, eduCalendarEvents };
