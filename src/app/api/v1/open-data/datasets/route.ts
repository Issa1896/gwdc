import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

const SEED_API_DATASETS = [
  {
    id: "ds-01",
    slug: "orcamento-geral-estado-2026",
    titulo: "Orçamento Geral do Estado (OGE) — Execução Orçamentária 2026",
    orgao: "Ministério da Economia e Finanças",
    categoria: "Economia",
    formatos: ["CSV", "JSON", "API"],
    tamanho: "3.4 MB",
    linhas: 480,
  },
  {
    id: "ds-02",
    slug: "rotas-transportes-nacionais",
    titulo: "Malha de Rotas Terrestres e Marítimas da Guiné-Bissau",
    orgao: "Ministério dos Transportes e Comunicações",
    categoria: "Transportes",
    formatos: ["CSV", "JSON"],
    tamanho: "850 KB",
    linhas: 58,
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase();
  const categoria = searchParams.get("categoria")?.toLowerCase();

  let lista = SEED_API_DATASETS;

  if (categoria) {
    lista = lista.filter((d) => d.categoria.toLowerCase().includes(categoria));
  }
  if (q) {
    lista = lista.filter((d) => d.titulo.toLowerCase().includes(q) || d.orgao.toLowerCase().includes(q));
  }

  return apiSuccess({
    datasets: lista,
    total: lista.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { titulo, orgao, categoria, descricao, formatos } = body || {};

    if (!titulo || !orgao || !categoria) {
      return apiError(422, "MISSING_FIELDS", "Campos obrigatórios: titulo, orgao e categoria.");
    }

    const slug = titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const novoDataset = {
      id: `ds-${Date.now()}`,
      slug,
      titulo,
      orgao,
      categoria,
      descricao: descricao || titulo,
      formatos: formatos || ["CSV", "JSON"],
      atualizadoEm: new Date().toISOString().split("T")[0],
      tamanho: "1.0 MB",
      linhas: 100,
    };

    return apiSuccess(novoDataset, 201);
  } catch {
    return apiError(400, "INVALID_JSON", "O corpo da requisição deve ser um JSON válido.");
  }
}
