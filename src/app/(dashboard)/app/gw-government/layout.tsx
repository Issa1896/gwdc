import { GovernmentGate } from "@/components/government/shell";
import { AiAssistant } from "@/components/ai/assistant";
import { GovernmentProvider } from "@/lib/government-store";

/**
 * GW Government — Plataforma Nacional de Governo Digital da Guiné-Bissau.
 * Núcleo de identidade cidadã, protocolo único interministerial e certidões autenticadas.
 */
export default function GwGovernmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <GovernmentProvider>
      <GovernmentGate>{children}</GovernmentGate>
      <AiAssistant productName="GW Government" />
    </GovernmentProvider>
  );
}
