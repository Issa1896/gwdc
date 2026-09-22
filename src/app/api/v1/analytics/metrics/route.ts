import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

const SEED_API_METRICAS = [
  {
    setor: "Finanças",
    titulo: "Receita Fiscal Consolidada",
    valor: "24.8 Bi FCFA",
    variacaoPercentual: 14.2,
    fonte: "Ministério da Economia e Finanças",
  },
  {
    setor: "Saúde",
    titulo: "Prontuários Eletrônicos Registrados (PEP)",
    valor: "96.4 mil",
    variacaoPercentual: 22.8,
    fonte: "Ministério da Saúde Pública",
  },
  {
    setor: "Transportes",
    titulo: "Passageiros com Bilhete Digital (Mês)",
    valor: "84.6 mil",
    variacaoPercentual: 18.0,
    fonte: "Direção-Geral dos Transportes",
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const setor = searchParams.get("setor")?.toLowerCase();

  let lista = SEED_API_METRICAS;
  if (setor) {
    const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    lista = lista.filter((m) => norm(m.setor).includes(norm(setor)));
  }

  return apiSuccess({
    metricas: lista,
    total: lista.length,
    timestamp: new Date().toISOString(),
  });
}
