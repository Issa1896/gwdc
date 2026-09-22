import { JusticeGate } from "@/components/justice/shell";
import { AiAssistant } from "@/components/ai/assistant";
import { JusticeProvider } from "@/lib/justice-store";

/**
 * GW Justice — Tribunal Digital Soberano da Guiné-Bissau.
 * Processo Judicial Eletrônico (PJe), distribuição, audiências virtuais e certidões judiciais.
 */
export default function GwJusticeLayout({ children }: { children: React.ReactNode }) {
  return (
    <JusticeProvider>
      <JusticeGate>{children}</JusticeGate>
      <AiAssistant productName="GW Justice" />
    </JusticeProvider>
  );
}
