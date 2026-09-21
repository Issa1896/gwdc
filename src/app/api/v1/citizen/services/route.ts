import { NextRequest } from "next/server";
import { CITIZEN_SEED } from "@/data/citizen";
import { apiError, apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  return apiSuccess({
    servicos: CITIZEN_SEED.servicos,
    total: CITIZEN_SEED.servicos.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { servicoId, titularNome = "Cidadão Guineense", titularBI } = body || {};

    const servico = CITIZEN_SEED.servicos.find((s) => s.id === servicoId);
    if (!servico) {
      return apiError(404, "SERVICE_NOT_FOUND", "O serviço público solicitado não foi encontrado.");
    }

    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const codigoAcompanhamento = `PED-${year}-${rand}`;

    const novoPedido = {
      id: `ped-${Date.now()}`,
      codigoAcompanhamento,
      servicoNome: servico.nome,
      categoria: servico.categoria,
      orgaoResponsavel: servico.orgao,
      titularNome,
      titularBI: titularBI || "GW-PENDENTE",
      dataSolicitacao: new Date().toISOString().split("T")[0],
      status: "em_analise",
      prazoDiasUteis: 3,
      taxaFCFA: servico.taxaFCFA,
    };

    return apiSuccess(novoPedido, 201);
  } catch {
    return apiError(400, "INVALID_JSON", "O corpo da requisição deve ser um JSON válido.");
  }
}
