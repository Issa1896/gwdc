import { CitizenGate } from "@/components/citizen/shell";
import { AiAssistant } from "@/components/ai/assistant";
import { CitizenProvider } from "@/lib/citizen-store";

/**
 * GW Citizen — Portal Único do Cidadão da Guiné-Bissau.
 * Carteira digital de documentos, autoatendimento de certidões e canal USSD offline-first.
 */
export default function GwCitizenLayout({ children }: { children: React.ReactNode }) {
  return (
    <CitizenProvider>
      <CitizenGate>{children}</CitizenGate>
      <AiAssistant productName="GW Citizen" />
    </CitizenProvider>
  );
}
