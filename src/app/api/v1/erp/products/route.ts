import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

const SEED_API_PRODUTOS = [
  {
    id: "prod-001",
    sku: "CAJU-EXP-001",
    nome: "Castanha de Caju Tipo Exportação (Saco 50kg)",
    categoria: "Agrícola",
    precoUnitario: 45000,
    estoqueTotal: 180,
    unidade: "saco",
  },
  {
    id: "prod-002",
    sku: "ARROZ-MANGO-002",
    nome: "Arroz Mangona Nacional (Saco 25kg)",
    categoria: "Alimentos",
    precoUnitario: 16500,
    estoqueTotal: 340,
    unidade: "saco",
  },
  {
    id: "prod-003",
    sku: "OLEO-PALMA-003",
    nome: "Óleo de Palma Puro de Bolama (Garrafão 5L)",
    categoria: "Alimentos",
    precoUnitario: 7500,
    estoqueTotal: 95,
    unidade: "un",
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase();

  let lista = SEED_API_PRODUTOS;
  if (q) {
    lista = lista.filter(
      (p) =>
        p.nome.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
    );
  }

  return apiSuccess({
    produtos: lista,
    total: lista.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sku, nome, categoria, precoUnitario, custoUnitario, estoqueTotal, unidade } = body || {};

    if (!sku || !nome || !precoUnitario) {
      return apiError(422, "MISSING_FIELDS", "Campos obrigatórios: sku, nome e precoUnitario.");
    }

    const novoProduto = {
      id: `prod-${Date.now()}`,
      sku,
      nome,
      categoria: categoria || "Diversos",
      precoUnitario: Number(precoUnitario),
      custoUnitario: Number(custoUnitario) || 0,
      estoqueTotal: Number(estoqueTotal) || 0,
      unidade: unidade || "un",
      cadastradoEm: new Date().toISOString(),
    };

    return apiSuccess(novoProduto, 201);
  } catch {
    return apiError(400, "INVALID_JSON", "O corpo da requisição deve ser um JSON válido.");
  }
}
