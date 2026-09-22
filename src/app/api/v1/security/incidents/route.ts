import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

const SEED_API_INCIDENTES = [
  {
    codigo: "INC-2026-001",
    titulo: "Tentativa de Força Bruta no Portal do Servidor",
    alvo: "Auth SSO /api/v1/auth",
    severidade: "alta",
    status: "analise",
    dataHora: "2026-09-21 21:15",
  },
  {
    codigo: "INC-2026-002",
    titulo: "Varredura Não Autorizada de Portas no Data Center",
    alvo: "Roteador BGP Core",
    severidade: "media",
    status: "detectado",
    dataHora: "2026-09-21 20:40",
  },
  {
    codigo: "INC-2026-003",
    titulo: "Ataque Volumétrico DDoS Mitigado na Alfândega",
    alvo: "API Gateway Alfândegas",
    severidade: "critica",
    status: "contido",
    dataHora: "2026-09-21 18:22",
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const severidade = searchParams.get("severidade")?.toLowerCase();
  const status = searchParams.get("status")?.toLowerCase();

  let lista = SEED_API_INCIDENTES;

  if (severidade) {
    lista = lista.filter((i) => i.severidade.toLowerCase() === severidade);
  }
  if (status) {
    lista = lista.filter((i) => i.status.toLowerCase() === status);
  }

  return apiSuccess({
    nivelAmeacaNacional: "ELEVADO",
    socOperacional: true,
    total: lista.length,
    incidentes: lista,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { titulo, alvo, severidade, descricao, ipOrigem } = body || {};

    if (!titulo || !alvo || !severidade) {
      return apiError(422, "MISSING_FIELDS", "Campos obrigatórios: titulo, alvo e severidade.");
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const codigo = `INC-2026-${randomNum}`;

    const novoIncidente = {
      codigo,
      titulo,
      alvo,
      severidade,
      ipOrigem: ipOrigem || "0.0.0.0",
      status: "detectado",
      dataHora: new Date().toISOString().replace("T", " ").substring(0, 16),
      descricao: descricao || "Incidente reportado via API do SOC Nacional.",
    };

    return apiSuccess(novoIncidente, 201);
  } catch {
    return apiError(400, "INVALID_JSON", "O corpo da requisição deve ser um JSON válido.");
  }
}
