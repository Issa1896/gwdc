import { EducationGate } from "@/components/education/shell";
import { AiAssistant } from "@/components/ai/assistant";
import { EducationProvider } from "@/lib/education-store";

/**
 * GW Education — Sistema de Gestão Acadêmica Nacional.
 * Ecossistema completo e navegável: portais do aluno/professor/gestor, AVA,
 * biblioteca, calendário, matrículas, avaliações online, diplomas e mais.
 * O EducationProvider mantém o estado operacional persistido no navegador.
 */
export default function GwEducationLayout({ children }: { children: React.ReactNode }) {
  return (
    <EducationProvider>
      <EducationGate>{children}</EducationGate>
      <AiAssistant productName="GW Education" />
    </EducationProvider>
  );
}