import { ClimateGate } from "@/components/climate/shell";
import { AiAssistant } from "@/components/ai/assistant";
import { ClimateProvider } from "@/lib/climate-store";

/**
 * GW Climate — Monitoramento Meteorológico e Ambiental da Guiné-Bissau.
 * Rede de estações e sensores, alertas de monção e cheias com SMS em Crioulo, previsão agroclimática e mangais.
 */
export default function GwClimateLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClimateProvider>
      <ClimateGate>{children}</ClimateGate>
      <AiAssistant productName="GW Climate" />
    </ClimateProvider>
  );
}
