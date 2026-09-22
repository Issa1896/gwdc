import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET as getProcessos, POST as postProcesso } from "../src/app/api/v1/justice/processos/route";
import { POST as postCertidao } from "../src/app/api/v1/justice/certidoes/route";

describe("GW Justice (PJe Soberano) — Contratos e Regras Judiciais", () => {
  it("GET /api/v1/justice/processos retorna lista de autos e suporta busca textual", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/justice/processos?q=Geba");
    const res = await getProcessos(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.processos.length).toBeGreaterThanOrEqual(1);
    expect(body.processos[0].numero).toBe("GW-JUS-2026-0042");
  });

  it("POST /api/v1/justice/processos autua e distribui nova ação judicial com número unificado", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/justice/processos", {
      method: "POST",
      body: JSON.stringify({
        classe: "Ação Cível Ordinária",
        tribunal: "Tribunal Regional de Bissau",
        vara: "1ª Vara Cível e Comercial",
        autor: "Empresa de Construção Cacheu Lda",
        reu: "Consórcio Rodoviário de Mansôa",
        advogadoAutor: "Dr. Braima Seidi",
        assunto: "Cobrança de serviços de pavimentação de trecho rodoviário",
        valorCausa: 75000000,
      }),
    });

    const res = await postProcesso(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.numero).toMatch(/^GW-JUS-2026-\d{4}$/);
    expect(body.status).toBe("distribuido");
    expect(body.autor).toBe("Empresa de Construção Cacheu Lda");
  });

  it("POST /api/v1/justice/processos rejeita requisição sem campos obrigatórios com 422", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/justice/processos", {
      method: "POST",
      body: JSON.stringify({
        classe: "Ação Cível Ordinária",
        // Faltam autor, reu e assunto
      }),
    });

    const res = await postProcesso(req);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error.code).toBe("MISSING_FIELDS");
  });

  it("POST /api/v1/justice/certidoes emite certidão judicial com código de autenticidade STJ", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/justice/certidoes", {
      method: "POST",
      body: JSON.stringify({
        tipo: "Antecedentes Criminais",
        requerenteNome: "Carlos Alberto Gomes",
        requerenteDocumento: "BI 19910520-001",
        finalidade: "Admissão em Quadro de Oficiais do Estado",
      }),
    });

    const res = await postCertidao(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.codigoAutenticidade).toMatch(/^GW-STJ-2026-[0-9A-F]{4}-V$/);
    expect(body.resultado).toBe("NADA CONSTA");
    expect(body.validaAte).toBeDefined();
    expect(body.orgaoEmissor).toBe("Supremo Tribunal de Justiça da Guiné-Bissau");
  });

  it("POST /api/v1/justice/certidoes rejeita requisição com dados faltantes", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/justice/certidoes", {
      method: "POST",
      body: JSON.stringify({
        tipo: "Distribuição Cível",
        // Faltam nome e documento
      }),
    });

    const res = await postCertidao(req);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error.code).toBe("MISSING_FIELDS");
  });
});
