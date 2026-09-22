import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET as getProducts, POST as postProduct } from "../src/app/api/v1/erp/products/route";
import { POST as postPosOrder } from "../src/app/api/v1/pos/orders/route";

describe("GW ERP & GW POS — Gestão Empresarial e Frente de Caixa", () => {
  it("GET /api/v1/erp/products lista o inventário e suporta busca textual", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/erp/products?q=Caju");
    const res = await getProducts(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.produtos.length).toBeGreaterThanOrEqual(1);
    expect(body.produtos[0].sku).toBe("CAJU-EXP-001");
  });

  it("POST /api/v1/erp/products cadastra novo produto no inventário", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/erp/products", {
      method: "POST",
      body: JSON.stringify({
        sku: "ACUCAR-50KG-001",
        nome: "Açúcar Cristal Nacional (Saco 50kg)",
        categoria: "Alimentos",
        precoUnitario: 31000,
        custoUnitario: 24000,
        estoqueTotal: 100,
        unidade: "saco",
      }),
    });

    const res = await postProduct(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.sku).toBe("ACUCAR-50KG-001");
    expect(body.precoUnitario).toBe(31000);
  });

  it("POST /api/v1/erp/products rejeita requisição sem campos obrigatórios com 422", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/erp/products", {
      method: "POST",
      body: JSON.stringify({
        sku: "TEST-001",
        // Faltam nome e precoUnitario
      }),
    });

    const res = await postProduct(req);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error.code).toBe("MISSING_FIELDS");
  });

  it("POST /api/v1/pos/orders processa venda com cálculo de troco e selo fiscal", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/pos/orders", {
      method: "POST",
      body: JSON.stringify({
        itens: [
          {
            produtoId: "prod-002",
            sku: "ARROZ-MANGO-002",
            produtoNome: "Arroz Mangona Nacional (Saco 25kg)",
            precoUnitario: 16500,
            quantidade: 2,
          },
          {
            produtoId: "prod-003",
            sku: "OLEO-PALMA-003",
            produtoNome: "Óleo de Palma Puro de Bolama",
            precoUnitario: 7500,
            quantidade: 1,
          },
        ],
        formaPagamento: "dinheiro",
        valorRecebido: 45000,
        desconto: 500,
        operador: "Operador de Caixa",
      }),
    });

    const res = await postPosOrder(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.numeroCupom).toMatch(/^POS-2026-\d{4}$/);
    expect(body.subtotal).toBe(40500);
    expect(body.total).toBe(40000);
    expect(body.troco).toBe(5000);
    expect(body.qrCodeFiscal).toContain("GW-POS-AUTH");
    expect(body.status).toBe("concluida");
  });

  it("POST /api/v1/pos/orders rejeita carrinho vazio com 422", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/pos/orders", {
      method: "POST",
      body: JSON.stringify({
        itens: [],
      }),
    });

    const res = await postPosOrder(req);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error.code).toBe("EMPTY_CART");
  });

  it("POST /api/v1/pos/orders rejeita pagamento insuficiente com 400", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/pos/orders", {
      method: "POST",
      body: JSON.stringify({
        itens: [
          {
            produtoId: "prod-002",
            sku: "ARROZ-MANGO-002",
            produtoNome: "Arroz Mangona Nacional",
            precoUnitario: 16500,
            quantidade: 1,
          },
        ],
        formaPagamento: "dinheiro",
        valorRecebido: 10000, // Menor que 16500
      }),
    });

    const res = await postPosOrder(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("INSUFFICIENT_PAYMENT");
  });
});
