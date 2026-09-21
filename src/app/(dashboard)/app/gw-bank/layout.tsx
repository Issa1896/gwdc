import { BankGate } from "@/components/bank/shell";
import { AiAssistant } from "@/components/ai/assistant";
import { BankProvider } from "@/lib/bank-store";

/**
 * GW Bank — Banco Digital Soberano.
 * Contas, transferências interbancárias (PIX/GW Pay), cartões, orçamentos,
 * Open Finance (padrão BCEAO) e motor antifraude com IA.
 * O BankProvider mantém o estado operacional persistido no navegador.
 */
export default function GwBankLayout({ children }: { children: React.ReactNode }) {
  return (
    <BankProvider>
      <BankGate>{children}</BankGate>
      <AiAssistant productName="GW Bank" />
    </BankProvider>
  );
}