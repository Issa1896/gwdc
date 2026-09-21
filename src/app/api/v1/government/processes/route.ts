import { NextRequest } from "next/server";
import { GOVERNMENT_SEED } from "@/data/government";
import { apiError, apiSuccess } from "@/lib/api-response";
import type { ProcessoPrioridade, ProcessoProtocolo } from "@/data/government/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const ministerio = searchParams.get("ministerio");
  const search = searchParams.get("q");

  let list = [...GOVERNMENT_SEED.processos];

  if (status) {
    list = list.filter((p) => p.status === status);
  }

  if (ministerio) {
    list = list.filter((p) => p.ministerioDestino.toLowerCase() === ministerio.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.numeroProtocolo.toLowerCase().includes(q) ||
        p.requerenteNome.toLowerCase().includes(q) ||
        p.assunto.toLowerCase().includes(q),
    );
  }

  return apiSuccess(
    {
      data: list,
      total: list.length,
    },
    200,
    {
      "X-Total-Count": String(list.length),
    },
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      requerenteNome,
      requerenteBI,
      requerenteTelefone = "+245 9",
      ministerioDestino = "MINJUS",
      assunto,
      categoria = "Certidões & Registos",
      descricao = "",
      prioridade = "normal",
    } = body || {};

    if (!requerenteNome || typeof requerenteNome !== "string") {
      return apiError(400, "VALIDATION_ERROR", "O campo requerenteNome é obrigatório.", {
        requerenteNome: "Inválido ou ausente",
      });
    }

    if (!assunto || typeof assunto !== "string") {
      return apiError(400, "VALIDATION_ERROR", "O campo assunto é obrigatório.", {
        assunto: "Inválido ou ausente",
      });
    }

    const year = new Date().getFullYear();
    const rand = Math.floor(10000 + Math.random() * 90000);
    const numeroProtocolo = `GW-${year}-${rand}`;

    const novoProcesso: ProcessoProtocolo = {
      id: `prc-${Date.now()}`,
      numeroProtocolo,
      requerenteNome,
      requerenteBI: requerenteBI || "GW-PENDENTE",
      requerenteTelefone,
      ministerioDestino,
      assunto,
      categoria,
      descricao,
      prioridade: prioridade as ProcessoPrioridade,
      status: "recebido",
      dataAbertura: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      despachos: [
        {
          id: `dsp-${Date.now()}`,
          autor: "Sistema Central GOV.GW",
          cargo: "Protocolo Único",
          orgao: "Presidência do Conselho de Ministros",
          data: new Date().toISOString(),
          texto: `Processo rececionado e protocolado digitalmente sob nº ${numeroProtocolo}.`,
          decisao: "encaminhamento",
        },
      ],
      anexos: ["submissao_api.pdf"],
    };

    return apiSuccess(novoProcesso, 201);
  } catch {
    return apiError(400, "INVALID_JSON", "O corpo da requisição deve ser um JSON válido.");
  }
}
