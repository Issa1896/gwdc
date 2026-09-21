import { NextRequest } from "next/server";
import { translate } from "@/lib/ai";
import { apiError, apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, target = "crioulo" } = body || {};

    if (!text || typeof text !== "string") {
      return apiError(400, "VALIDATION_ERROR", "O campo 'text' é obrigatório e deve ser uma string.", {
        text: "Ausente ou inválido",
      });
    }

    if (!["pt", "fr", "crioulo"].includes(target)) {
      return apiError(400, "VALIDATION_ERROR", "O idioma de destino deve ser 'pt', 'fr' ou 'crioulo'.", {
        target: "Idioma não suportado",
      });
    }

    const translated = translate(text, target as "pt" | "fr" | "crioulo");

    return apiSuccess({
      original: text,
      translated,
      target,
      confidence: 0.94,
    });
  } catch {
    return apiError(400, "INVALID_JSON", "O corpo da requisição deve ser um JSON válido.");
  }
}
