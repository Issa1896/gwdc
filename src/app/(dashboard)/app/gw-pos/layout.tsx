import { PosGate } from "@/components/pos/shell";
import { AiAssistant } from "@/components/ai/assistant";
import { ErpProvider } from "@/lib/erp-store";

/**
 * GW POS — Ponto de Venda Inteligente e Offline-First.
 * Frente de caixa para comércio e mercados locais com integração direta ao GW ERP e GW Pay.
 */
export default function GwPosLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErpProvider>
      <PosGate>{children}</PosGate>
      <AiAssistant productName="GW POS" />
    </ErpProvider>
  );
}
