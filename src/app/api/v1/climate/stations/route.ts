import { NextRequest } from "next/server";
import { apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

const SEED_API_ESTACOES = [
  {
    codigo: "GW-MET-BISSAU-01",
    nome: "Estação Meteorológica do Porto de Bissau",
    regiao: "Setor Autônomo de Bissau",
    temperatura: 31.4,
    umidade: 78,
    precipitacaoMm: 14.2,
    ventoKmH: 22,
    status: "online",
  },
  {
    codigo: "GW-MET-BAFATA-02",
    nome: "Estação Agroclimática do Rio Geba - Bafatá",
    regiao: "Região de Bafatá",
    temperatura: 33.8,
    umidade: 64,
    precipitacaoMm: 28.5,
    ventoKmH: 18,
    status: "alerta",
  },
  {
    codigo: "GW-MET-BUBAQUE-04",
    nome: "Observatório Marítimo e Insular de Bubaque",
    regiao: "Arquipélago dos Bijagós",
    temperatura: 29.8,
    umidade: 86,
    precipitacaoMm: 42.0,
    ventoKmH: 36,
    status: "alerta",
  },
];

function normalizeStr(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const regiao = searchParams.get("regiao");

  let lista = SEED_API_ESTACOES;
  if (regiao) {
    const regiaoNorm = normalizeStr(regiao);
    lista = lista.filter((e) => normalizeStr(e.regiao).includes(regiaoNorm));
  }

  return apiSuccess({
    estacoes: lista,
    total: lista.length,
    atualizadoEm: new Date().toISOString(),
  });
}
