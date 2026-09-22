import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

const SEED_API_LEADS = [
  {
    id: "op-01",
    titulo: "Implantação de GW ERP & POS em Rede de Farmácias",
    empresaCliente: "Farmácias Bijagós Lda.",
    valorFCFA: 14500000,
    etapa: "negociacao",
    responsavel: "Carlos Mendonça",
    probabilidade: 85,
  },
  {
    id: "op-02",
    titulo: "Licenciamento Anual de Assinatura Digital e eKYC",
    empresaCliente: "Banco Comercial da Guiné (BCG)",
    valorFCFA: 28000000,
    etapa: "proposta",
    responsavel: "Aminata Seidi",
    probabilidade: 70,
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const etapa = searchParams.get("etapa")?.toLowerCase();

  let lista = SEED_API_LEADS;

  if (etapa) {
    lista = lista.filter((l) => l.etapa.toLowerCase() === etapa);
  }

  const valorTotalPipeline = lista.reduce((acc, curr) => acc + curr.valorFCFA, 0);

  return apiSuccess({
    totalOportunidades: lista.length,
    valorTotalPipelineFCFA: valorTotalPipeline,
    leads: lista,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { titulo, empresaCliente, valorFCFA, etapa, responsavel } = body || {};

    if (!titulo || !empresaCliente || valorFCFA === undefined) {
      return apiError(422, "MISSING_FIELDS", "Campos obrigatórios: titulo, empresaCliente e valorFCFA.");
    }

    const novoLead = {
      id: `op-${Date.now()}`,
      titulo,
      empresaCliente,
      valorFCFA: Number(valorFCFA),
      etapa: etapa || "lead",
      responsavel: responsavel || "Equipe Comercial GWDC",
      probabilidade: etapa === "proposta" ? 70 : 25,
      criadoEm: new Date().toISOString().split("T")[0],
    };

    return apiSuccess(novoLead, 201);
  } catch {
    return apiError(400, "INVALID_JSON", "O corpo da requisição deve ser um JSON válido.");
  }
}
