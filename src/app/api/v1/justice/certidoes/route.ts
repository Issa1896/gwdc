import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tipo, requerenteNome, requerenteDocumento, finalidade } = body || {};

    if (!tipo || !requerenteNome || !requerenteDocumento) {
      return apiError(422, "MISSING_FIELDS", "Campos obrigatórios: tipo, requerenteNome e requerenteDocumento.");
    }

    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const codigoAutenticidade = `GW-STJ-2026-${randomHex}-V`;
    const hoje = new Date();
    const validade = new Date(hoje);
    validade.setDate(validade.getDate() + 90);

    const certidao = {
      id: `cert-${Date.now()}`,
      codigoAutenticidade,
      tipo,
      requerenteNome,
      requerenteDocumento,
      finalidade: finalidade || "Fins de Direito",
      resultado: "NADA CONSTA",
      emitidaEm: hoje.toISOString(),
      validaAte: validade.toISOString().substring(0, 10),
      assinaturaDigital: `STJ_CHANCELA_${randomHex}_SOBERANA`,
      orgaoEmissor: "Supremo Tribunal de Justiça da Guiné-Bissau",
    };

    return apiSuccess(certidao, 201);
  } catch {
    return apiError(400, "INVALID_JSON", "O corpo da requisição deve ser um JSON válido.");
  }
}
