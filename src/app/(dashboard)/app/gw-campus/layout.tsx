import { CampusGate } from "@/components/campus/shell";
import { AiAssistant } from "@/components/ai/assistant";
import { CampusProvider } from "@/lib/campus-store";

/**
 * GW Campus — Gestão Universitária.
 * Cursos & matrizes curriculares, oferta e turmas, docentes, investigação
 * e extensão, vida académica e acreditação institucional.
 * O CampusProvider mantém o estado operacional persistido no navegador.
 */
export default function GwCampusLayout({ children }: { children: React.ReactNode }) {
  return (
    <CampusProvider>
      <CampusGate>{children}</CampusGate>
      <AiAssistant productName="GW Campus" />
    </CampusProvider>
  );
}