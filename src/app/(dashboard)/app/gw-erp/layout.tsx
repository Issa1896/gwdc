import { ErpGate } from "@/components/erp/shell";
import { AiAssistant } from "@/components/ai/assistant";
import { ErpProvider } from "@/lib/erp-store";

/**
 * GW ERP — Gestão Empresarial Integrada para a Guiné-Bissau.
 * Inventário multicentro, finanças em FCFA, vendas e faturamento com NIF.
 */
export default function GwErpLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErpProvider>
      <ErpGate>{children}</ErpGate>
      <AiAssistant productName="GW ERP" />
    </ErpProvider>
  );
}
