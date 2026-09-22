import { SecurityGate } from "@/components/security/shell";
import { AiAssistant } from "@/components/ai/assistant";
import { SecurityProvider } from "@/lib/security-store";

/**
 * GW Security — Centro de Operações de Segurança (SOC) e Ciberdefesa Nacional da Guiné-Bissau.
 * SIEM em tempo real, mitigação de ameaças, WAF e defesa de infraestruturas críticas.
 */
export default function GwSecurityLayout({ children }: { children: React.ReactNode }) {
  return (
    <SecurityProvider>
      <SecurityGate>{children}</SecurityGate>
      <AiAssistant productName="GW Security" />
    </SecurityProvider>
  );
}
