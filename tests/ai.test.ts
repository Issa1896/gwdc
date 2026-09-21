import { describe, expect, it } from "vitest";
import {
  detectFraud,
  mockOcr,
  predictRevenue,
  recommend,
  semanticSearch,
  summarize,
  translate,
} from "../src/lib/ai";

describe("Módulo 13 — Inteligência Artificial (camada de demonstração)", () => {
  it("detectFraud classifica risco alto para operações anômalas", () => {
    const result = detectFraud(2_000_000, 2, true, 4);
    expect(result.risk).toBe("Alto");
    expect(result.score).toBeGreaterThanOrEqual(60);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it("detectFraud mantém risco baixo para operações normais", () => {
    const result = detectFraud(25_000, 14, false, 0);
    expect(result.risk).toBe("Baixo");
  });

  it("mockOcr extrai campos de documentos", () => {
    const ocr = mockOcr("certidao-nascimento-08421.jpg");
    expect(ocr.confidence).toBeGreaterThan(90);
    expect(ocr.fields["Número"]).toBe("CN-2026-08421");
    expect(ocr.text).toContain("Certidão de Nascimento");
  });

  it("translate converte para crioulo", () => {
    expect(translate("Bom dia, bem-vindo", "crioulo")).toBe("bon dia, ben-vindu");
  });

  it("translate converte para francês", () => {
    expect(translate("saúde educação", "fr")).toBe("santé éducation");
  });

  it("summarize reduz textos longos", () => {
    const text =
      "Primeira frase sobre o painel. Segunda frase sobre KPIs. Terceira frase irrelevante para o resumo. Quarta frase descartada.";
    const summary = summarize(text, 2);
    expect(summary).toContain("resumo gerado por IA");
    expect(summary.length).toBeLessThan(text.length);
  });

  it("predictRevenue projeta tendência crescente", () => {
    const projection = predictRevenue([100, 110, 120], 2);
    expect(projection).toHaveLength(2);
    expect(projection[1]).toBeGreaterThan(projection[0]);
  });

  it("recommend ranqueia por afinidade de tags", () => {
    const catalog = [
      { id: "a", title: "GovTech", tags: ["governo", "digital"] },
      { id: "b", title: "FinTech", tags: ["banco", "digital"] },
      { id: "c", title: "Saúde", tags: ["saúde"] },
    ];
    const ids = recommend(["digital", "governo"], catalog);
    expect(ids[0]).toBe("a");
    expect(ids).toContain("b");
  });

  it("semanticSearch ranqueia documentos relevantes", () => {
    const docs = [
      "O portal do cidadão digital permite emitir certidões",
      "A previsão de chuva com IA ajuda a agricultura",
      "Pagamentos instantâneos com QR Code",
    ];
    const results = semanticSearch("cidadão certidão digital", docs);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.document).toContain("cidadão");
  });
});
