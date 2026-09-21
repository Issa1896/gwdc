import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET as getHealthz } from "../src/app/healthz/route";
import { POST as postLogin } from "../src/app/api/v1/auth/login/route";
import { GET as getProducts } from "../src/app/api/v1/products/route";
import { GET as getProductBySlug } from "../src/app/api/v1/products/[slug]/route";
import { POST as postTranslate } from "../src/app/api/v1/ai/translate/route";
import { POST as postFraudCheck } from "../src/app/api/v1/ai/fraud-check/route";
import { POST as postChat } from "../src/app/api/v1/ai/chat/route";
import { GET as getProcesses, POST as postProcess } from "../src/app/api/v1/government/processes/route";
import { GET as getCitizenServices, POST as postCitizenService } from "../src/app/api/v1/citizen/services/route";
import { POST as postUssd } from "../src/app/api/v1/citizen/ussd/route";

describe("Camada de API REST (v1) — Contratos e Endpoints", () => {
  it("GET /healthz retorna 200 OK com metadados de liveness", async () => {
    const res = await getHealthz();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("ok");
    expect(data.service).toBe("gwdc-platform");
    expect(data.version).toBe("1.0.0");
  });

  it("POST /api/v1/auth/login valida credenciais válidas e retorna JWT", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "demo@gwdc.gw", password: "demo1234" }),
    });
    const res = await postLogin(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.accessToken).toBeDefined();
    expect(data.user.email).toBe("demo@gwdc.gw");
    expect(data.user.role).toBe("admin");
  });

  it("POST /api/v1/auth/login rejeita senha com menos de 6 caracteres com 400", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "test@gwdc.gw", password: "123" }),
    });
    const res = await postLogin(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });

  it("GET /api/v1/products lista os produtos e suporta filtro por categoria", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/products?category=GovTech");
    const res = await getProducts(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
    expect(data.data.every((p: { category: string }) => p.category === "GovTech")).toBe(true);
  });

  it("GET /api/v1/products/[slug] retorna detalhes ou 404 padronizado", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/products/gw-government");
    const resValid = await getProductBySlug(req, { params: Promise.resolve({ slug: "gw-government" }) });
    expect(resValid.status).toBe(200);
    const validData = await resValid.json();
    expect(validData.slug).toBe("gw-government");

    const resInvalid = await getProductBySlug(req, { params: Promise.resolve({ slug: "produto-inexistente" }) });
    expect(resInvalid.status).toBe(404);
    const errData = await resInvalid.json();
    expect(errData.error.code).toBe("PRODUCT_NOT_FOUND");
  });

  it("POST /api/v1/ai/translate traduz texto para Crioulo", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/ai/translate", {
      method: "POST",
      body: JSON.stringify({ text: "bem-vindo cidadão", target: "crioulo" }),
    });
    const res = await postTranslate(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.translated).toBe("ben-vindu sidadaun");
  });

  it("POST /api/v1/ai/fraud-check avalia risco em transações", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/ai/fraud-check", {
      method: "POST",
      body: JSON.stringify({ amount: 2000000, hour: 2, isForeign: true, attemptsInHour: 4 }),
    });
    const res = await postFraudCheck(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.risk).toBe("Alto");
    expect(data.recommendation).toBe("block");
  });

  it("GET & POST /api/v1/government/processes lista e protocola processos", async () => {
    const reqGet = new NextRequest("http://localhost:3000/api/v1/government/processes");
    const resGet = await getProcesses(reqGet);
    expect(resGet.status).toBe(200);
    const list = await resGet.json();
    expect(list.data.length).toBeGreaterThan(0);

    const reqPost = new NextRequest("http://localhost:3000/api/v1/government/processes", {
      method: "POST",
      body: JSON.stringify({
        requerenteNome: "Kadiatu Mané",
        requerenteBI: "GW-448291-2024",
        ministerioDestino: "MINED",
        assunto: "Revalidação de Diploma Estrangeiro",
      }),
    });
    const resPost = await postProcess(reqPost);
    expect(resPost.status).toBe(201);
    const created = await resPost.json();
    expect(created.numeroProtocolo).toMatch(/^GW-\d{4}-\d+/);
    expect(created.status).toBe("recebido");
  });

  it("POST /api/v1/ai/chat responde contextualmente sobre transporte e Crioulo", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message: "Quais são os barcos para Bubaque e Bolama?", productName: "GW Transport" }),
    });
    const res = await postChat(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.intent).toBe("transport");
    expect(data.reply).toContain("Bubaque");
    expect(data.reply).toContain("FCFA");
  });

  it("GET & POST /api/v1/citizen/services lista catálogo e solicita serviço", async () => {
    const resGet = await getCitizenServices();
    expect(resGet.status).toBe(200);
    const dataGet = await resGet.json();
    expect(dataGet.servicos.length).toBeGreaterThan(0);

    const reqPost = new NextRequest("http://localhost:3000/api/v1/citizen/services", {
      method: "POST",
      body: JSON.stringify({ servicoId: "srv-01", titularNome: "Bacari Djassi" }),
    });
    const resPost = await postCitizenService(reqPost);
    expect(resPost.status).toBe(201);
    const dataPost = await resPost.json();
    expect(dataPost.codigoAcompanhamento).toMatch(/^PED-\d{4}-\d+/);
  });

  it("POST /api/v1/citizen/ussd processa comandos do protocolo telecom", async () => {
    const reqRoot = new NextRequest("http://localhost:3000/api/v1/citizen/ussd", {
      method: "POST",
      body: JSON.stringify({ text: "*123#" }),
    });
    const resRoot = await postUssd(reqRoot);
    expect(resRoot.status).toBe(200);
    const dataRoot = await resRoot.json();
    expect(dataRoot.action).toBe("CON");
    expect(dataRoot.response).toContain("Certidões");

    const reqOption = new NextRequest("http://localhost:3000/api/v1/citizen/ussd", {
      method: "POST",
      body: JSON.stringify({ text: "4" }),
    });
    const resOption = await postUssd(reqOption);
    expect(resOption.status).toBe(200);
    const dataOption = await resOption.json();
    expect(dataOption.action).toBe("END");
    expect(dataOption.response).toContain("Processos");
  });
});
