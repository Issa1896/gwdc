import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text = "" } = body || {};

    const clean = text.trim();
    let response = "";
    let action: "CON" | "END" = "CON";

    if (!clean || clean === "*123#") {
      response = "GOV.GW Serviços (*123#)\n1. Certidões\n2. Vacinas\n3. Transportes\n4. Processos\n0. Sair";
      action = "CON";
    } else if (clean === "1") {
      response = "GOV.GW Certidões:\n1. Nascimento\n2. Criminal\n3. Casamento\n0. Voltar";
      action = "CON";
    } else if (clean === "2") {
      response = "GW Health Vacinas:\n1. Febre Amarela: Válida\n2. Cólera: Imunizado\n3. COVID: Completo\n0. Sair";
      action = "CON";
    } else if (clean === "3") {
      response = "GW Transport:\n1. Bissau-Bafatá (3.500)\n2. Barco Bubaque (7.500)\n3. Barco Bolama (4.500)\n0. Sair";
      action = "CON";
    } else if (clean === "4") {
      response = "Processos no Protocolo:\nGW-2026-00412: DESPACHADO\nAssento pronto para levantamento.";
      action = "END";
    } else if (clean === "0") {
      response = "Sessão finalizada. Obrigado por utilizar os serviços do Governo da Guiné-Bissau.";
      action = "END";
    } else {
      response = "Pedido registrado com sucesso! O comprovativo oficial foi enviado por SMS para o seu terminal.";
      action = "END";
    }

    return apiSuccess({
      response,
      action,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return apiError(400, "INVALID_JSON", "O corpo da requisição deve ser um JSON válido.");
  }
}
