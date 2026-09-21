import { HealthGate } from "@/components/health/shell";
import { AiAssistant } from "@/components/ai/assistant";
import { HealthProvider } from "@/lib/health-store";

/**
 * GW Health — Saúde Digital Conectada.
 * Prontuário eletrónico único, consultas e telemedicina, farmácia e logística,
 * vacinação e vigilância epidemiológica.
 * O HealthProvider mantém o estado operacional persistido no navegador.
 */
export default function GwHealthLayout({ children }: { children: React.ReactNode }) {
  return (
    <HealthProvider>
      <HealthGate>{children}</HealthGate>
      <AiAssistant productName="GW Health" />
    </HealthProvider>
  );
}