import { NextRequest } from "next/server";
import { detectFraud } from "@/lib/ai";
import { apiError, apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, hour = new Date().getHours(), isForeign = false, attemptsInHour = 1 } = body || {};

    if (amount === undefined || typeof amount !== "number" || amount < 0) {
      return apiError(400, "VALIDATION_ERROR", "O campo 'amount' deve ser um número positivo.", {
        amount: "Inválido ou ausente",
      });
    }

    const result = detectFraud(Number(amount), Number(hour), Boolean(isForeign), Number(attemptsInHour));

    return apiSuccess({
      score: result.score,
      risk: result.risk,
      flags: result.reasons,
      recommendation: result.risk === "Alto" ? "block" : result.risk === "Médio" ? "review" : "approve",
      evaluatedAt: new Date().toISOString(),
    });
  } catch {
    return apiError(400, "INVALID_JSON", "O corpo da requisição deve ser um JSON válido.");
  }
}
