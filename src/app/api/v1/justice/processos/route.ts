import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

const SEED_API_PROCESSOS = [
  {
    id: "proc-001",
    numero: "GW-JUS-2026-0042",
    classe: "Ação Cível Ordinária",
    tribunal: "Tribunal Regional de Bissau",
    vara: "1ª Vara Cível e Comercial",
    juiz: "Dr. Mamadu Serifo Djaló",
    autor: "Sociedade Agrícola de Geba Lda",
    reu: "Cooperativa de Transporte Fluvial Bijagós",
    assunto: "Descumprimento contratual de frete marítimo de castanha de caju",
    valorCausa: 45000000,
    status: "audiencia_marcada",
    prioridade: "urgente",
  },
  {
    id: "proc-002",
    numero: "GW-JUS-2026-0089",
    classe: "Processo Penal",
    tribunal: "Tribunal Setorial de Bafatá",
    vara: "Vara Criminal de Bafatá",
    juiz: "Dra. Maria Odete Semedo",
    autor: "Ministério Público da República",
    reu: "Investigado em Autos Sigilosos",
    assunto: "Apropriação indébita e fraude tributária aduaneira",
    valorCausa: 12000000,
    status: "em_instrucao",
    prioridade: "urgente",
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase();

  let lista = SEED_API_PROCESSOS;
  if (q) {
    lista = lista.filter(
      (p) =>
        p.numero.toLowerCase().includes(q) ||
        p.autor.toLowerCase().includes(q) ||
        p.reu.toLowerCase().includes(q)
    );
  }

  return apiSuccess({
    processos: lista,
    total: lista.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { classe, tribunal, vara, autor, reu, assunto, valorCausa, advogadoAutor } = body || {};

    if (!classe || !autor || !reu || !assunto) {
      return apiError(422, "MISSING_FIELDS", "Campos obrigatórios: classe, autor, reu e assunto.");
    }

    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const numero = `GW-JUS-${year}-${rand}`;

    const novoProcesso = {
      id: `proc-${Date.now()}`,
      numero,
      classe,
      tribunal: tribunal || "Tribunal Regional de Bissau",
      vara: vara || "1ª Vara Cível e Comercial",
      juiz: "Juiz de Plantão / Sorteio",
      autor,
      reu,
      advogadoAutor: advogadoAutor || "Advogado Constituído",
      assunto,
      valorCausa: Number(valorCausa) || 0,
      status: "distribuido",
      prioridade: "normal",
      protocoladoEm: new Date().toISOString(),
    };

    return apiSuccess(novoProcesso, 201);
  } catch {
    return apiError(400, "INVALID_JSON", "O corpo da requisição deve ser um JSON válido.");
  }
}
