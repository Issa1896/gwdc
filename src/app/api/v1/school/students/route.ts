import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

const SEED_API_ALUNOS = [
  {
    matricula: "ESC-2026-001",
    nomeCompleto: "Mariama Djaló",
    turma: "3º Ano A",
    idade: 8,
    responsavelNome: "Braima Djaló",
    responsavelTelefone: "+245 955 123 456",
    frequenciaPercentual: 96,
    notaMedia: 16.5,
    status: "ativo",
  },
  {
    matricula: "ESC-2026-002",
    nomeCompleto: "Mamadu Serifo Baldé",
    turma: "3º Ano A",
    idade: 9,
    responsavelNome: "Aissatu Baldé",
    responsavelTelefone: "+245 966 789 012",
    frequenciaPercentual: 92,
    notaMedia: 14.8,
    status: "ativo",
  },
  {
    matricula: "ESC-2026-003",
    nomeCompleto: "Fatumata Camará",
    turma: "5º Ano B",
    idade: 11,
    responsavelNome: "Seco Camará",
    responsavelTelefone: "+245 955 334 556",
    frequenciaPercentual: 88,
    notaMedia: 15.2,
    status: "ativo",
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const turma = searchParams.get("turma")?.toLowerCase();
  const status = searchParams.get("status")?.toLowerCase();

  let lista = SEED_API_ALUNOS;

  if (turma) {
    lista = lista.filter((a) => a.turma.toLowerCase().includes(turma));
  }
  if (status) {
    lista = lista.filter((a) => a.status.toLowerCase() === status);
  }

  return apiSuccess({
    total: lista.length,
    escola: "Escola Básica 23 de Janeiro (Bissau)",
    alunos: lista,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nomeCompleto, turma, responsavelNome, responsavelTelefone, idade } = body || {};

    if (!nomeCompleto || !turma || !responsavelNome) {
      return apiError(422, "MISSING_FIELDS", "Campos obrigatórios: nomeCompleto, turma e responsavelNome.");
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const matricula = `ESC-2026-${randomNum}`;

    const novoAluno = {
      matricula,
      nomeCompleto,
      turma,
      idade: idade || 7,
      responsavelNome,
      responsavelTelefone: responsavelTelefone || "+245 955 000 000",
      frequenciaPercentual: 100,
      notaMedia: 14.0,
      recebeMerenda: true,
      status: "ativo",
      dataMatricula: new Date().toISOString().split("T")[0],
    };

    return apiSuccess(novoAluno, 201);
  } catch {
    return apiError(400, "INVALID_JSON", "O corpo da requisição deve ser um JSON válido.");
  }
}
