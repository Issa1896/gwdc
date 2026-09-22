import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

const SEED_API_ALERTAS = [
  {
    codigo: "ALT-2026-089",
    titulo: "Risco Iminente de Cheia na Bacia do Rio Geba",
    severidade: "critico",
    regiao: "Bafatá / Rio Geba",
    descricaoPt: "Precipitação acumulada superior a 75mm nas últimas 24h. Risco de alagamento.",
    descricaoCrioulo: "Tchuba pisadu dimás na Rio Geba. Bolanha na perigu di fika tchiga agu.",
    ativo: true,
  },
  {
    codigo: "ALT-2026-090",
    titulo: "Aviso de Mar Revolto no Arquipélago dos Bijagós",
    severidade: "alto",
    regiao: "Bijagós (Bubaque, Uno)",
    descricaoPt: "Rajadas de vento de até 50 km/h e ondas de 3.5 metros.",
    descricaoCrioulo: "Bentu ta supla forti na mar di Bijagós. Kanoa ka dibi di sai pa mar.",
    ativo: true,
  },
];

export async function GET() {
  return apiSuccess({
    alertas: SEED_API_ALERTAS,
    total: SEED_API_ALERTAS.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { titulo, severidade, regiao, descricaoPt, descricaoCrioulo } = body || {};

    if (!titulo || !severidade || !regiao) {
      return apiError(422, "MISSING_FIELDS", "Campos obrigatórios: titulo, severidade e regiao.");
    }

    const rand = Math.floor(100 + Math.random() * 900);
    const codigo = `ALT-${new Date().getFullYear()}-${rand}`;

    const novoAlerta = {
      id: `alt-${Date.now()}`,
      codigo,
      titulo,
      severidade,
      regiao,
      descricaoPt: descricaoPt || titulo,
      descricaoCrioulo: descricaoCrioulo || titulo,
      emitidoEm: new Date().toISOString(),
      ativo: true,
      canais: ["SMS em Crioulo", "Defesa Civil", "Rádio Nacional"],
    };

    return apiSuccess(novoAlerta, 201);
  } catch {
    return apiError(400, "INVALID_JSON", "O corpo da requisição deve ser um JSON válido.");
  }
}
