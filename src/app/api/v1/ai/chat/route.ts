import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";
import { detectFraud, mockOcr, summarize, translate } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, productName = "Plataforma GWDC" } = body || {};

    if (!message || typeof message !== "string") {
      return apiError(400, "VALIDATION_ERROR", "O campo 'message' é obrigatório.");
    }

    const text = message.toLowerCase().trim();
    let reply = "";
    let intent = "general";

    // Resumo de dados
    if (text.includes("resum") || text.includes("sumar") || text.includes("relat")) {
      intent = "summary";
      reply = summarize(
        `O módulo ${productName} registra excelente adesão nacional em 2026. Processamento médio reduzido em 78%, arrecadação e transações 100% auditadas com moedas FCFA e mobile money ativo. Recomendação: priorizar integração de novos canais regionais em Gabú e Bafatá.`,
      );
    }
    // Tradução e Crioulo
    else if (text.includes("crioulo") || text.includes("kriolu") || text.includes("traduz") || text.includes("franc")) {
      intent = "translation";
      const target = text.includes("franc") ? "fr" : "crioulo";
      const sample = translate("Bem-vindo cidadão à plataforma digital soberana", target);
      reply = `Tradução contextual (${target === "crioulo" ? "Crioulo da Guiné-Bissau" : "Francês"}):\n"${sample}".\n\nNossa inteligência artificial suporta expressões locais guineenses para facilitar o acesso de todos os cidadãos.`;
    }
    // Antifraude e Risco
    else if (text.includes("fraude") || text.includes("risco") || text.includes("seguran") || text.includes("score")) {
      intent = "fraud_check";
      const result = detectFraud(1800000, new Date().getHours(), true, 3);
      reply = `Avaliação de Risco Antifraude (IA Soberana):\n• Nível: ${result.risk} (Score: ${result.score}/100)\n• Alertas: ${result.reasons.join(", ")}\n• Ação Recomendada: Exigir validação de bilhete de identidade ou biometria via GW Identity.`;
    }
    // OCR e Extração de Documentos
    else if (text.includes("ocr") || text.includes("document") || text.includes("digitaliz") || text.includes("certid")) {
      intent = "ocr";
      const ocr = mockOcr("certidao-nascimento-bissau.jpg");
      reply = `Extração OCR realizada com ${ocr.confidence}% de acurácia:\n${ocr.text}\nMetadados: ${Object.entries(ocr.fields)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" | ")}`;
    }
    // Transporte e Rotas
    else if (text.includes("transporte") || text.includes("barco") || text.includes("bubaque") || text.includes("bolama") || text.includes("onibus") || text.includes("viag")) {
      intent = "transport";
      reply = `Informações de Mobilidade (GW Transport):\n• Linha Marítima Bissau ↔ Ilha de Bubaque: partidas às quartas, sextas e domingos (7.500 FCFA).\n• Travessia Bissau ↔ Ilha de Bolama: 3 saídas diárias (4.500 FCFA).\n• Linha Rodoviária Bissau ↔ Bafatá e Gabú: saídas a cada hora a partir do Terminal Central com validação por QR Code.`;
    }
    // Governo e Protocolo
    else if (text.includes("governo") || text.includes("protocolo") || text.includes("certid") || text.includes("bi") || text.includes("identidade")) {
      intent = "government";
      reply = `Serviços de Governo Digital (GOV.GW):\n• Protocolo Único: tramitação interministerial eletrônica sem uso de papel.\n• GW Identity: emissão do Bilhete de Identidade Único com validação biométrica soberana.\n• Certidões Digitais: assentos de nascimento e registo criminal emitidos com QR Code e hash de autenticidade.`;
    }
    // Saudações
    else if (text.includes("olá") || text.includes("ola") || text.includes("bom dia") || text.includes("boa tarde") || text.includes("kuma")) {
      intent = "greeting";
      reply = `Olá! Sou a IA Central da GW Digital Company, operando no contexto de ${productName}. Posso auxiliar com:\n1. Tradução para Crioulo da Guiné-Bissau\n2. Verificação de rotas e bilhetes (GW Transport)\n3. Protocolo do Estado e certidões (GW Government)\n4. Resumo analítico e auditoria antifraude\n\nComo posso apoiar suas atividades hoje?`;
    }
    // Resposta padrão
    else {
      reply = `Compreendido! Estou à disposição para apoiar suas operações no ${productName}. Posso analisar indicadores, consultar rotas de transporte, orientar sobre serviços do Estado (GOV.GW) ou traduzir mensagens em Crioulo. O que gostaria de verificar?`;
    }

    return apiSuccess({
      reply,
      intent,
      productContext: productName,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return apiError(400, "INVALID_JSON", "O corpo da requisição deve ser um JSON válido.");
  }
}
