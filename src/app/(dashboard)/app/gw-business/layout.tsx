import { BusinessGate } from "@/components/business/shell";
import { AiAssistant } from "@/components/ai/assistant";
import { SchoolBusinessProvider } from "@/lib/school-business-store";

/**
 * GW Business — CRM, Pipeline de Vendas e Gestão Comercial para Empresas da Guiné-Bissau.
 * Funil Kanban, carteira 360° de clientes com NIF e previsão de receitas com IA.
 */
export default function GwBusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    <SchoolBusinessProvider>
      <BusinessGate>{children}</BusinessGate>
      <AiAssistant productName="GW Business" />
    </SchoolBusinessProvider>
  );
}
