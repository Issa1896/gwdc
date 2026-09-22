import { SchoolGate } from "@/components/school/shell";
import { AiAssistant } from "@/components/ai/assistant";
import { SchoolBusinessProvider } from "@/lib/school-business-store";

/**
 * GW School — Sistema de Gestão do Ensino Básico e Alimentação Escolar da Guiné-Bissau.
 * Matrículas, caderneta eletrônica, merenda escolar e comunicação com famílias em Crioulo.
 */
export default function GwSchoolLayout({ children }: { children: React.ReactNode }) {
  return (
    <SchoolBusinessProvider>
      <SchoolGate>{children}</SchoolGate>
      <AiAssistant productName="GW School" />
    </SchoolBusinessProvider>
  );
}
