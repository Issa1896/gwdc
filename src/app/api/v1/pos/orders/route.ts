import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { itens, formaPagamento = "dinheiro", valorRecebido, desconto = 0, operador = "Operador Caixa 01" } = body || {};

    if (!Array.isArray(itens) || itens.length === 0) {
      return apiError(422, "EMPTY_CART", "O pedido deve conter pelo menos um item válido.");
    }

    const subtotal = itens.reduce((acc: number, item: { precoUnitario: number; quantidade: number }) => {
      return acc + (Number(item.precoUnitario) || 0) * (Number(item.quantidade) || 1);
    }, 0);

    const total = Math.max(0, subtotal - Number(desconto));
    const recebido = Number(valorRecebido) || total;

    if (recebido < total) {
      return apiError(400, "INSUFFICIENT_PAYMENT", `Valor recebido (${recebido} FCFA) é inferior ao total (${total} FCFA).`);
    }

    const troco = recebido - total;
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const numeroCupom = `POS-${year}-${rand}`;

    const vendaConcluida = {
      id: `venda-${Date.now()}`,
      numeroCupom,
      data: new Date().toISOString(),
      itens,
      subtotal,
      desconto: Number(desconto),
      total,
      formaPagamento,
      valorRecebido: recebido,
      troco,
      operador,
      qrCodeFiscal: `GW-POS-AUTH:${numeroCupom}:${total}:FCFA`,
      status: "concluida",
    };

    return apiSuccess(vendaConcluida, 201);
  } catch {
    return apiError(400, "INVALID_JSON", "O corpo da requisição deve ser um JSON válido.");
  }
}
