"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Download,
  FileCheck2,
  FileSearch,
  Gavel,
  Printer,
  QrCode,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJustice, type CertidaoJudicial } from "@/lib/justice-store";

export default function CertidoesJudiciaisPage() {
  const { state, emitirCertidao } = useJustice();

  const [tipo, setTipo] = useState<CertidaoJudicial["tipo"]>("Antecedentes Criminais");
  const [requerenteNome, setRequerenteNome] = useState("");
  const [requerenteDocumento, setRequerenteDocumento] = useState("");
  const [finalidade, setFinalidade] = useState("Concurso Público / Fins de Direito");

  const [certidaoGerada, setCertidaoGerada] = useState<CertidaoJudicial | null>(
    state.certidoes[0] || null
  );

  const [codigoBusca, setCodigoBusca] = useState("");
  const [certidaoVerificada, setCertidaoVerificada] = useState<CertidaoJudicial | null | "nao_encontrada">(null);

  const handleEmitir = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requerenteNome || !requerenteDocumento) return;

    const nova = emitirCertidao({
      tipo,
      requerenteNome,
      requerenteDocumento,
      finalidade,
    });

    setCertidaoGerada(nova);
  };

  const handleVerificar = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = codigoBusca.trim().toUpperCase();
    const encontrada = state.certidoes.find(
      (c) => c.codigoAutenticidade.toUpperCase() === clean
    );

    if (encontrada) {
      setCertidaoVerificada(encontrada);
    } else {
      setCertidaoVerificada("nao_encontrada");
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
          Certidões Judiciais com Fé Pública
        </h2>
        <p className="text-sm text-ink-muted">
          Emissão instantânea e validação pública de certidões negativas autenticadas pelo Supremo Tribunal de Justiça.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Formulário de Emissão (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
              <FileCheck2 className="size-5 text-purple-600" />
              <h3 className="font-display text-sm font-bold text-ink">
                Solicitar Nova Certidão Digital
              </h3>
            </div>

            <form onSubmit={handleEmitir} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-ink">Tipo de Certidão</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as CertidaoJudicial["tipo"])}
                  className="mt-1 w-full rounded-lg border border-border-subtle bg-surface p-2 text-xs text-ink"
                >
                  <option value="Antecedentes Criminais">Antecedentes Criminais</option>
                  <option value="Distribuição Cível">Distribuição Cível (Ações em Trâmite)</option>
                  <option value="Falência e Recuperação">Falência e Recuperação Judicial</option>
                  <option value="Quitação de Custas">Quitação de Custas Judiciais</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-ink">Nome Completo do Requerente</label>
                <Input
                  required
                  placeholder="Ex: Domingos Simões Vaz"
                  value={requerenteNome}
                  onChange={(e) => setRequerenteNome(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-ink">Documento de Identificação (BI / Passaporte)</label>
                <Input
                  required
                  placeholder="Ex: BI 19880412-004 ou NIF"
                  value={requerenteDocumento}
                  onChange={(e) => setRequerenteDocumento(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-ink">Finalidade da Certidão</label>
                <Input
                  required
                  placeholder="Ex: Concurso Público, Admissão de Emprego, Licitação"
                  value={finalidade}
                  onChange={(e) => setFinalidade(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="rounded bg-purple-500/10 p-2.5 text-[11px] text-purple-900 dark:text-purple-200 border border-purple-500/20">
                <p className="font-semibold flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-purple-600" /> Emissão Gratuita e Instantânea
                </p>
                <p className="mt-0.5 text-ink-muted">
                  A certidão é emitida com assinatura eletrônica e validade de 90 dias em todo o território nacional.
                </p>
              </div>

              <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800 text-white">
                <Gavel className="size-4 mr-1.5" /> Emitir Certidão Soberana
              </Button>
            </form>
          </Card>

          {/* Card de Verificação de Autenticidade */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
              <FileSearch className="size-5 text-purple-600" />
              <h3 className="font-display text-sm font-bold text-ink">
                Verificar Autenticidade
              </h3>
            </div>

            <form onSubmit={handleVerificar} className="space-y-3 text-xs">
              <p className="text-ink-muted text-[11px]">
                Digite o código alfanumérico impresso no rodapé da certidão judicial para validar sua autenticidade.
              </p>

              <div className="flex gap-2">
                <Input
                  required
                  placeholder="Ex: GW-STJ-2026-8841-A"
                  value={codigoBusca}
                  onChange={(e) => setCodigoBusca(e.target.value)}
                  className="uppercase font-mono"
                />
                <Button type="submit" variant="outline" size="sm">
                  Consultar
                </Button>
              </div>

              {certidaoVerificada === "nao_encontrada" && (
                <div className="rounded bg-rose-500/10 p-2.5 text-[11px] text-rose-800 dark:text-rose-300 border border-rose-500/20">
                  Código de certidão não localizado ou cancelado pelo STJ.
                </div>
              )}

              {certidaoVerificada && certidaoVerificada !== "nao_encontrada" && (
                <div className="rounded bg-emerald-500/10 p-3 text-xs text-emerald-900 dark:text-emerald-200 border border-emerald-500/20 space-y-1">
                  <p className="font-bold flex items-center gap-1 text-emerald-600">
                    <CheckCircle2 className="size-4" /> Certidão Autêntica e Válida
                  </p>
                  <p>Titular: <strong>{certidaoVerificada.requerenteNome}</strong></p>
                  <p>Tipo: {certidaoVerificada.tipo} &bull; Resultado: <strong>{certidaoVerificada.resultado}</strong></p>
                  <p className="text-[10px] text-ink-faint">Validade até: {certidaoVerificada.validaAte}</p>
                </div>
              )}
            </form>
          </Card>
        </div>

        {/* Visualizador do Documento Oficial (7 cols) */}
        <div className="lg:col-span-7">
          {certidaoGerada ? (
            <Card className="p-8 border-2 border-purple-300 dark:border-purple-800/80 bg-surface shadow-lg space-y-6 relative overflow-hidden">
              {/* Marca d'água de fundo */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] grid place-items-center">
                <Scale className="size-96 text-purple-950" />
              </div>

              {/* Cabeçalho Oficial do Estado */}
              <div className="text-center space-y-1.5 border-b-2 border-border-subtle pb-4">
                <div className="grid size-12 place-items-center rounded-full bg-purple-100 text-purple-800 mx-auto dark:bg-purple-900/40 dark:text-purple-300">
                  <Gavel className="size-6" />
                </div>
                <h3 className="font-display text-base font-bold tracking-wider uppercase text-ink">
                  República da Guiné-Bissau
                </h3>
                <h4 className="text-xs font-semibold text-ink-muted uppercase">
                  Supremo Tribunal de Justiça &bull; Secretaria Geral Judiciária
                </h4>
                <p className="text-[10px] text-purple-700 dark:text-purple-300 font-mono font-bold">
                  SISTEMA DE PROCESSO JUDICIAL ELETRÔNICO (PJe-GW)
                </p>
              </div>

              {/* Título da Certidão */}
              <div className="text-center space-y-1">
                <h4 className="font-display text-lg font-extrabold uppercase tracking-wide text-purple-900 dark:text-purple-200">
                  Certidão de {certidaoGerada.tipo}
                </h4>
                <p className="font-mono text-xs font-semibold text-ink-muted">
                  Autenticidade: {certidaoGerada.codigoAutenticidade}
                </p>
              </div>

              {/* Texto Certificador */}
              <div className="text-xs leading-relaxed text-ink space-y-3 bg-surface-raised/40 p-4 rounded-lg border border-border-subtle">
                <p>
                  <strong>CERTIFICO</strong>, a requerimento de parte interessada, após pesquisa minuciosa nos registros eletrônicos centralizados do Poder Judiciário da República da Guiné-Bissau, que em nome de:
                </p>

                <div className="pl-4 border-l-2 border-purple-600 space-y-0.5">
                  <p className="text-sm font-bold text-ink">{certidaoGerada.requerenteNome}</p>
                  <p className="text-ink-muted">Documento: <strong>{certidaoGerada.requerenteDocumento}</strong></p>
                  <p className="text-ink-muted">Finalidade declarada: <em>{certidaoGerada.finalidade}</em></p>
                </div>

                <p>
                  Até a presente data e horário ({certidaoGerada.emitidaEm} GMT),{" "}
                  <strong className="text-emerald-600 uppercase font-bold tracking-wide">
                    {certidaoGerada.resultado}
                  </strong>{" "}
                  quanto a processos em andamento ou condenações criminais transitadas em julgado perante os tribunais desta República.
                </p>
              </div>

              {/* Rodapé com QR Code e Chancela */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-subtle pt-4 text-xs">
                {/* QR Code Simulado */}
                <div className="flex items-center gap-3">
                  <div className="grid size-16 place-items-center rounded-lg border border-border-subtle bg-white text-black p-1">
                    <QrCode className="size-14" />
                  </div>
                  <div>
                    <span className="font-bold text-ink text-[11px]">Validação por QR Code</span>
                    <p className="text-[10px] text-ink-muted">Aponte a câmera para conferir integridade</p>
                    <p className="text-[10px] font-mono text-purple-600 font-semibold">
                      Válida até: {certidaoGerada.validaAte}
                    </p>
                  </div>
                </div>

                {/* Chancela */}
                <div className="text-right space-y-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                    <ShieldCheck className="size-3.5" /> Assinado Digitalmente STJ
                  </span>
                  <p className="font-mono text-[9px] text-ink-faint">
                    {certidaoGerada.assinaturaDigital}
                  </p>
                  <p className="text-[10px] text-ink-muted">Chancela Soberana ICP-GW</p>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="text-xs gap-1.5"
                >
                  <Printer className="size-3.5" /> Imprimir Certidão
                </Button>
                <Button
                  size="sm"
                  onClick={() => alert(`Certidão ${certidaoGerada.codigoAutenticidade} pronta para download.`)}
                  className="bg-purple-700 hover:bg-purple-800 text-white text-xs gap-1.5"
                >
                  <Download className="size-3.5" /> Baixar PDF Certificado
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center text-ink-muted">
              <FileCheck2 className="size-12 mx-auto text-ink-faint mb-3" />
              <p className="text-sm">Preencha o formulário ao lado para emitir sua certidão com fé pública.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
