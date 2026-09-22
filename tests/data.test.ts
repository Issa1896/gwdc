import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET as getMetrics } from "../src/app/api/v1/analytics/metrics/route";
import { GET as getDatasets, POST as postDataset } from "../src/app/api/v1/open-data/datasets/route";

describe("GW Analytics & GW Open Data — Dados do Estado e Transparência", () => {
  it("GET /api/v1/analytics/metrics retorna métricas setoriais consolidadas do Estado", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/analytics/metrics");
    const res = await getMetrics(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.metricas)).toBe(true);
    expect(body.total).toBeGreaterThanOrEqual(1);
    expect(body.metricas.some((m: { setor: string }) => m.setor === "Finanças")).toBe(true);
  });

  it("GET /api/v1/analytics/metrics filtra métricas por setor", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/analytics/metrics?setor=saude");
    const res = await getMetrics(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.metricas.length).toBe(1);
    expect(body.metricas[0].setor).toBe("Saúde");
  });

  it("GET /api/v1/open-data/datasets retorna catálogo público e suporta filtro por categoria e busca", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/open-data/datasets?categoria=economia");
    const res = await getDatasets(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.datasets.length).toBeGreaterThanOrEqual(1);
    expect(body.datasets[0].slug).toBe("orcamento-geral-estado-2026");

    const reqSearch = new NextRequest("http://localhost:3000/api/v1/open-data/datasets?q=rotas");
    const resSearch = await getDatasets(reqSearch);
    const bodySearch = await resSearch.json();
    expect(bodySearch.datasets[0].slug).toBe("rotas-transportes-nacionais");
  });

  it("POST /api/v1/open-data/datasets cadastra novo dataset público com geração automática de slug DCAT", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/open-data/datasets", {
      method: "POST",
      body: JSON.stringify({
        titulo: "Exportações de Castanha de Caju 2026",
        orgao: "Ministério da Agricultura e Desenvolvimento Rural",
        categoria: "Economia",
        descricao: "Volume de sacas inspecionadas e arrecadação de taxas de saída.",
        formatos: ["CSV", "JSON", "API"],
      }),
    });

    const res = await postDataset(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.slug).toBe("exportacoes-de-castanha-de-caju-2026");
    expect(body.categoria).toBe("Economia");
    expect(body.formatos).toContain("CSV");
  });

  it("POST /api/v1/open-data/datasets rejeita requisição sem campos obrigatórios com 422", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/open-data/datasets", {
      method: "POST",
      body: JSON.stringify({
        titulo: "Dataset sem Órgão",
        // Faltam orgao e categoria
      }),
    });

    const res = await postDataset(req);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error.code).toBe("MISSING_FIELDS");
  });
});
