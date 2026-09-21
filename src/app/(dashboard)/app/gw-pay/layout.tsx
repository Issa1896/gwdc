import { PayGate } from "@/components/pay/shell";
import { AiAssistant } from "@/components/ai/assistant";
import { PayProvider } from "@/lib/pay-store";

/**
 * GW Pay — Banco Digital.
 * Motor de pagamentos integrado com Orange Money, MTN MoMo e GW PIX
 * (pagamentos instantâneos inspirados no PIX; IBAN/BCEAO previsto para 2027).
 * O PayProvider mantém carteiras, transações e conectores persistidos no navegador.
 */
export default function BancoDigitalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PayProvider>
      <PayGate>{children}</PayGate>
      <AiAssistant productName="GW Pay" />
    </PayProvider>
  );
}