"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileCheck2,
  FileText,
  Lock,
  Search,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useSecurity, type CertificadoAssinatura } from "@/lib/security-store";
import { Badge } from "@/components/ui/badge";

export default function ValidarAssinaturasPage() {
  const { validarHashAssinatura } = useSecurity();
  const [consulta, setConsulta] = useState("");
  const [resultado, setResultado] = useState<{
    valido: boolean;
    certificado?: CertificadoAssinatura;
    mensagem: string;
  } | null>(null);

  const handleValidar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consulta.trim()) return;
    const res = validarHashAssinatura(consulta);
    setResultado(res);
  };

  const handleSimularArquivo = (nomeArquivo: string, serial: string) => {
    setConsulta(serial);
    const res = validarHashAssinatura(serial);
    setResultado({
      ...res,
      mensagem: `Arquivo "${nomeArquivo}" verificado com sucesso. Assinatura digital autêntica de autoridade pública.`,
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-400">
          <Link href="/app/gw-identity" className="hover:underline flex items-center gap-1">
            <ArrowLeft className="size-3.5" /> Identidades Nacionais
          </Link>
        </div>
        <h1 className="mt-1 text-2xl font-extrabold text-ink flex items-center gap-2">
          <FileCheck2 className="size-6 text-violet-600" />
          Validador Nacional de Assinaturas Digitais & Credenciais
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          Verifique a autenticidade, integridade e conformidade de documentos assinados com certificados ICP-Guiné.
        </p>
      </div>

      {/* Main Validation Input Form */}
      <div className="rounded-3xl border border-violet-500/20 bg-surface p-6 sm:p-8 shadow-sm space-y-6">
        <form onSubmit={handleValidar} className="space-y-4">
          <label className="block text-sm font-bold text-ink">
            Insira o Hash SHA-256, Número de Série do Certificado ou NIN
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-faint" />
              <input
                type="text"
                required
                placeholder="Ex: GW-STJ-2026-8849-AC ou e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
                value={consulta}
                onChange={(e) => setConsulta(e.target.value)}
                className="w-full rounded-xl border border-border-subtle bg-surface-ground py-3 pl-10 pr-4 text-xs font-mono text-ink placeholder-ink-faint focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-xs font-semibold text-white shadow hover:bg-violet-700 transition"
            >
              <ShieldCheck className="size-4" />
              <span>Verificar Autenticidade</span>
            </button>
          </div>
        </form>

        {/* Quick Test Document Buttons */}
        <div className="border-t border-border-subtle pt-4 space-y-2">
          <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider">
            Ou teste com documentos oficiais emitidos recentemente:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() =>
                handleSimularArquivo("Acordao-STJ-2026-084.pdf", "GW-STJ-2026-8849-AC")
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-raised px-3 py-1.5 text-xs text-ink hover:border-violet-500 transition"
            >
              <FileText className="size-3.5 text-violet-500" />
              Acórdão Supremo Tribunal (Dr. Domingos)
            </button>
            <button
              onClick={() =>
                handleSimularArquivo("Despacho-Tesouro-OGE-2026.pdf", "GW-MEF-2026-1120-DG")
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-raised px-3 py-1.5 text-xs text-ink hover:border-violet-500 transition"
            >
              <FileText className="size-3.5 text-emerald-500" />
              Despacho Tesouro Público (Engª Aminata)
            </button>
            <button
              onClick={() =>
                handleSimularArquivo("Portaria-Saude-Digital-PEP.pdf", "GW-MSP-2026-4431-PEP")
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-raised px-3 py-1.5 text-xs text-ink hover:border-violet-500 transition"
            >
              <FileText className="size-3.5 text-rose-500" />
              Portaria Saúde Digital (Dra. Aissato)
            </button>
          </div>
        </div>
      </div>

      {/* Validation Result Box */}
      {resultado && (
        <div
          className={`rounded-2xl border p-6 shadow-md transition-all animate-in fade-in slide-in-from-bottom-2 ${
            resultado.valido
              ? "border-emerald-500/40 bg-emerald-950/10 dark:bg-emerald-950/20"
              : "border-rose-500/40 bg-rose-950/10 dark:bg-rose-950/20"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-2xl shrink-0 ${
                resultado.valido
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/20 text-rose-600 dark:text-rose-400"
              }`}
            >
              {resultado.valido ? <ShieldCheck className="size-7" /> : <ShieldAlert className="size-7" />}
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-bold text-ink">
                  {resultado.valido ? "Assinatura Digital Qualificada VÁLIDA" : "Assinatura Não Reconhecida"}
                </h3>
                <Badge tone={resultado.valido ? "success" : "danger"}>
                  {resultado.valido ? "100% Autêntico" : "Inválido / Não Verificado"}
                </Badge>
              </div>

              <p className="text-xs text-ink-muted leading-relaxed">{resultado.mensagem}</p>

              {resultado.certificado && (
                <div className="rounded-xl border border-border-subtle bg-surface p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-ink-faint">Titular do Certificado:</span>
                    <p className="font-bold text-ink text-sm">{resultado.certificado.titular}</p>
                    <p className="text-ink-muted">{resultado.certificado.cargo}</p>
                  </div>

                  <div>
                    <span className="text-ink-faint">Órgão Emissor / Lotação:</span>
                    <p className="font-bold text-ink">{resultado.certificado.orgao}</p>
                    <p className="text-ink-muted font-mono text-[11px]">{resultado.certificado.serialNumber}</p>
                  </div>

                  <div>
                    <span className="text-ink-faint">Autoridade Certificadora:</span>
                    <p className="font-semibold text-violet-600 dark:text-violet-400">
                      ICP-Guiné Raiz v1 (Soberana)
                    </p>
                  </div>

                  <div>
                    <span className="text-ink-faint">Validade do Certificado:</span>
                    <p className="font-semibold text-ink">{resultado.certificado.validade}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Trust Chain Architecture */}
      <section className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-ink flex items-center gap-2">
          <Lock className="size-4 text-violet-600" />
          Cadeia Nacional de Confiança Criptográfica (ICP-Guiné)
        </h2>
        <p className="text-xs text-ink-muted leading-relaxed">
          A infraestrutura de chaves públicas da Guiné-Bissau opera com módulos HSM (Hardware Security Module) de nível FIPS 140-2, garantindo não-repúdio e validade jurídica plena a todos os atos administrativos e judiciais eletrônicos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="rounded-xl border border-border-subtle bg-surface-ground p-4 space-y-2">
            <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">Nível 1</span>
            <h3 className="text-xs font-bold text-ink">Autoridade Certificadora Raiz</h3>
            <p className="text-[11px] text-ink-muted">Custodiada no cofre do Data Center Nacional de Bissau com chave RSA-4096 offline.</p>
          </div>

          <div className="rounded-xl border border-border-subtle bg-surface-ground p-4 space-y-2">
            <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">Nível 2</span>
            <h3 className="text-xs font-bold text-ink">Autoridades Intermediárias</h3>
            <p className="text-[11px] text-ink-muted">AC Governo Digital, AC Judiciário (STJ) e AC Cidadão & Comércio Eletrônico.</p>
          </div>

          <div className="rounded-xl border border-border-subtle bg-surface-ground p-4 space-y-2">
            <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">Nível 3</span>
            <h3 className="text-xs font-bold text-ink">Certificados Finais dos Usuários</h3>
            <p className="text-[11px] text-ink-muted">Tokens criptográficos, smartcards de servidores e credenciais biométricas em smartphones.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
