import { IdentityGate } from "@/components/identity/shell";
import { AiAssistant } from "@/components/ai/assistant";
import { SecurityProvider } from "@/lib/security-store";

/**
 * GW Identity — Infraestrutura Nacional de Identidade Soberana da Guiné-Bissau.
 * Biometria multifatorial, credenciais digitais soberanas, SSO e assinatura digital qualificada.
 */
export default function GwIdentityLayout({ children }: { children: React.ReactNode }) {
  return (
    <SecurityProvider>
      <IdentityGate>{children}</IdentityGate>
      <AiAssistant productName="GW Identity" />
    </SecurityProvider>
  );
}
