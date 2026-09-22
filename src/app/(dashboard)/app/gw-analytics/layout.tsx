import { AnalyticsGate } from "@/components/analytics/shell";
import { AiAssistant } from "@/components/ai/assistant";
import { AnalyticsProvider } from "@/lib/analytics-store";

/**
 * GW Analytics — Inteligência de Negócios e BI Governamental da Guiné-Bissau.
 * Data Lake do Estado, cruzamento de dados interministeriais e modelos preditivos com IA.
 */
export default function GwAnalyticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider>
      <AnalyticsGate>{children}</AnalyticsGate>
      <AiAssistant productName="GW Analytics" />
    </AnalyticsProvider>
  );
}
