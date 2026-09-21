import { TransportGate } from "@/components/transport/shell";
import { AiAssistant } from "@/components/ai/assistant";
import { TransportProvider } from "@/lib/transport-store";

/**
 * GW Transport — Mobilidade Nacional da Guiné-Bissau.
 * Bilhetagem digital, conexões rodoviárias e travessias marítimas para o arquipélago dos Bijagós.
 */
export default function GwTransportLayout({ children }: { children: React.ReactNode }) {
  return (
    <TransportProvider>
      <TransportGate>{children}</TransportGate>
      <AiAssistant productName="GW Transport" />
    </TransportProvider>
  );
}
