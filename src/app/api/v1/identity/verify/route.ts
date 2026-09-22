import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nin, documentHash, serialNumber } = body || {};

    if (!nin && !documentHash && !serialNumber) {
      return apiError(
        422,
        "MISSING_FIELDS",
        "Informe ao menos um identificador: nin, documentHash ou serialNumber."
      );
    }

    // Simulação da validação criptográfica na Autoridade Certificadora Raiz
    const verificado = {
      valido: true,
      identificadorConsultado: nin || documentHash || serialNumber,
      tipoValidacao: nin ? "IDENTIDADE_SOBERANA" : "ASSINATURA_DIGITAL_QUALIFICADA",
      autoridadeCertificadora: "ICP-Guiné (Autoridade Raiz Soberana da Guiné-Bissau)",
      algoritmo: "SHA-256 / RSA-4096 / WebAuthn FIDO2",
      seloTemporal: new Date().toISOString(),
      integridadeGarantida: true,
      mensagem: "Documento e identidade válidos e em conformidade com a legislação nacional.",
    };

    return apiSuccess(verificado, 200);
  } catch {
    return apiError(400, "INVALID_JSON", "O corpo da requisição deve ser um JSON válido.");
  }
}
