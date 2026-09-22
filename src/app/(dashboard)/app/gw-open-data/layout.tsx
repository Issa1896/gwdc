import { OpenDataGate } from "@/components/open-data/shell";
import { AiAssistant } from "@/components/ai/assistant";
import { AnalyticsProvider } from "@/lib/analytics-store";

/**
 * GW Open Data — Portal Nacional de Dados Abertos e Transparência da Guiné-Bissau.
 * Padrão internacional DCAT, OGE, Saúde, Educação, Clima e Exportações.
 */
export default function GwOpenDataLayout({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider>
      <OpenDataGate>{children}</OpenDataGate>
      <AiAssistant productName="GW Open Data" />
    </AnalyticsProvider>
  );
}
