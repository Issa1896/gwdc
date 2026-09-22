import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET as getStudents, POST as postStudent } from "../src/app/api/v1/school/students/route";
import { GET as getLeads, POST as postLead } from "../src/app/api/v1/business/leads/route";

describe("GW School & GW Business — Educação Básica & Gestão Comercial", () => {
  // GW School Tests
  it("GET /api/v1/school/students retorna lista de alunos e suporta filtro por turma", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/school/students");
    const res = await getStudents(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.alunos)).toBe(true);
    expect(body.total).toBeGreaterThanOrEqual(1);
    expect(body.escola).toContain("Escola Básica 23 de Janeiro");

    const reqFiltro = new NextRequest("http://localhost:3000/api/v1/school/students?turma=5º Ano B");
    const resFiltro = await getStudents(reqFiltro);
    const bodyFiltro = await resFiltro.json();
    expect(bodyFiltro.alunos.length).toBeGreaterThanOrEqual(1);
    expect(bodyFiltro.alunos[0].turma).toBe("5º Ano B");
  });

  it("POST /api/v1/school/students matricula aluno com código ESC-2026-XXX", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/school/students", {
      method: "POST",
      body: JSON.stringify({
        nomeCompleto: "Bacari Sanhá",
        turma: "1º Ano A",
        idade: 6,
        responsavelNome: "Fatumata Sanhá",
        responsavelTelefone: "+245 955 777 888",
      }),
    });

    const res = await postStudent(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.matricula).toMatch(/^ESC-2026-\d{3}$/);
    expect(body.nomeCompleto).toBe("Bacari Sanhá");
    expect(body.recebeMerenda).toBe(true);
  });

  it("POST /api/v1/school/students rejeita payload incompleto com 422", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/school/students", {
      method: "POST",
      body: JSON.stringify({
        nomeCompleto: "Criança sem responsável",
        // Faltam turma e responsavelNome
      }),
    });

    const res = await postStudent(req);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error.code).toBe("MISSING_FIELDS");
  });

  // GW Business Tests
  it("GET /api/v1/business/leads retorna pipeline de vendas e suporta filtro por etapa", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/business/leads");
    const res = await getLeads(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.totalOportunidades).toBeGreaterThanOrEqual(1);
    expect(body.valorTotalPipelineFCFA).toBeGreaterThan(0);

    const reqFiltro = new NextRequest("http://localhost:3000/api/v1/business/leads?etapa=negociacao");
    const resFiltro = await getLeads(reqFiltro);
    const bodyFiltro = await resFiltro.json();
    expect(bodyFiltro.leads.length).toBe(1);
    expect(bodyFiltro.leads[0].etapa).toBe("negociacao");
  });

  it("POST /api/v1/business/leads cadastra nova oportunidade no funil comercial", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/business/leads", {
      method: "POST",
      body: JSON.stringify({
        titulo: "Digitalização de Bilhetagem para Frotas de Cacheu",
        empresaCliente: "TransCacheu Transportes",
        valorFCFA: 8500000,
        etapa: "qualificacao",
        responsavel: "Carlos Mendonça",
      }),
    });

    const res = await postLead(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.id).toMatch(/^op-\d+$/);
    expect(body.valorFCFA).toBe(8500000);
    expect(body.etapa).toBe("qualificacao");
  });

  it("POST /api/v1/business/leads rejeita payload sem campos obrigatórios com 422", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/business/leads", {
      method: "POST",
      body: JSON.stringify({
        titulo: "Lead sem valor nem empresa",
      }),
    });

    const res = await postLead(req);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error.code).toBe("MISSING_FIELDS");
  });
});
