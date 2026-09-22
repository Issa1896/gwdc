import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET as getIncidents, POST as postIncident } from "../src/app/api/v1/security/incidents/route";
import { POST as verifyIdentity } from "../src/app/api/v1/identity/verify/route";

describe("GW Security & GW Identity — Infraestrutura & Ciberdefesa Nacional", () => {
  it("GET /api/v1/security/incidents retorna incidentes do SOC e nível de ameaça nacional", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/security/incidents");
    const res = await getIncidents(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.socOperacional).toBe(true);
    expect(body.nivelAmeacaNacional).toBe("ELEVADO");
    expect(Array.isArray(body.incidentes)).toBe(true);
    expect(body.total).toBeGreaterThanOrEqual(1);
  });

  it("GET /api/v1/security/incidents suporta filtro por severidade e status", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/security/incidents?severidade=alta&status=analise");
    const res = await getIncidents(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.incidentes.length).toBe(1);
    expect(body.incidentes[0].codigo).toBe("INC-2026-001");
  });

  it("POST /api/v1/security/incidents registra novo incidente no SIEM com código INC-2026-XXX", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/security/incidents", {
      method: "POST",
      body: JSON.stringify({
        titulo: "Tráfego anômalo no gateway de pagamentos",
        alvo: "Gateway BCEAO",
        severidade: "alta",
        ipOrigem: "194.26.29.112",
        descricao: "Pico de requisições malformadas.",
      }),
    });

    const res = await postIncident(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.codigo).toMatch(/^INC-2026-\d{3}$/);
    expect(body.severidade).toBe("alta");
    expect(body.status).toBe("detectado");
  });

  it("POST /api/v1/security/incidents rejeita payload sem campos obrigatórios com 422", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/security/incidents", {
      method: "POST",
      body: JSON.stringify({
        titulo: "Incidente sem alvo",
        // Faltam alvo e severidade
      }),
    });

    const res = await postIncident(req);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error.code).toBe("MISSING_FIELDS");
  });

  it("POST /api/v1/identity/verify valida identidade soberana por NIN", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/identity/verify", {
      method: "POST",
      body: JSON.stringify({
        nin: "GW-2026-0001",
      }),
    });

    const res = await verifyIdentity(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.valido).toBe(true);
    expect(body.tipoValidacao).toBe("IDENTIDADE_SOBERANA");
    expect(body.autoridadeCertificadora).toContain("ICP-Guiné");
    expect(body.integridadeGarantida).toBe(true);
  });

  it("POST /api/v1/identity/verify valida assinatura digital qualificada por hash do documento", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/identity/verify", {
      method: "POST",
      body: JSON.stringify({
        documentHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      }),
    });

    const res = await verifyIdentity(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.valido).toBe(true);
    expect(body.tipoValidacao).toBe("ASSINATURA_DIGITAL_QUALIFICADA");
  });

  it("POST /api/v1/identity/verify rejeita requisição sem identificadores com 422", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/identity/verify", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await verifyIdentity(req);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error.code).toBe("MISSING_FIELDS");
  });
});
