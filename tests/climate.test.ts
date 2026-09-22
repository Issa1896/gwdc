import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET as getStations } from "../src/app/api/v1/climate/stations/route";
import { GET as getAlerts, POST as postAlert } from "../src/app/api/v1/climate/alerts/route";

describe("GW Climate — Monitoramento Meteorológico e Alertas Precoces", () => {
  it("GET /api/v1/climate/stations retorna estações e suporta filtro por região", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/climate/stations?regiao=Bijagos");
    const res = await getStations(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.estacoes.length).toBeGreaterThanOrEqual(1);
    expect(body.estacoes[0].codigo).toBe("GW-MET-BUBAQUE-04");
  });

  it("GET /api/v1/climate/alerts retorna a lista de alertas meteorológicos", async () => {
    const res = await getAlerts();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.alertas)).toBe(true);
    expect(body.alertas.length).toBeGreaterThanOrEqual(1);
    expect(body.alertas[0].ativo).toBe(true);
  });

  it("POST /api/v1/climate/alerts emite alerta meteorológico multilíngue com código ALT-YYYY-XXX", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/climate/alerts", {
      method: "POST",
      body: JSON.stringify({
        titulo: "Alerta de Vendaval no Rio Cacheu",
        severidade: "alto",
        regiao: "Região de Cacheu",
        descricaoPt: "Ventos fortes de até 45 km/h previstos para as próximas 12 horas.",
        descricaoCrioulo: "Bentu pisadu na Rio Cacheu. Pescadoris ka dibi di bai mar.",
      }),
    });

    const res = await postAlert(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.codigo).toMatch(/^ALT-2026-\d{3}$/);
    expect(body.severidade).toBe("alto");
    expect(body.descricaoCrioulo).toContain("Bentu pisadu");
    expect(body.ativo).toBe(true);
  });

  it("POST /api/v1/climate/alerts rejeita requisição sem campos obrigatórios com 422", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/climate/alerts", {
      method: "POST",
      body: JSON.stringify({
        titulo: "Alerta Incompleto",
        // Faltam severidade e regiao
      }),
    });

    const res = await postAlert(req);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error.code).toBe("MISSING_FIELDS");
  });
});
