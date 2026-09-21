"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Download,
  FileBadge,
  Plus,
  Printer,
  QrCode,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGovernment } from "@/lib/government-store";
import { formatDate } from "@/lib/utils";
import type { CertidaoEmitida, CertidaoTipo } from "@/data/government/types";

export default function CertidoesPage() {
  const { state, emitirCertidao } = useGovernment();

  const [busca, setBusca] = useState("");
  const [certidaoSelecionada, setCertidaoSelecionada] = useState<CertidaoEmitida>(state.certidoes[0]);
  const [modalNovo, setModalNovo] = useState(false);

  // Form emissão
  const [tipo, setTipo] = useState<CertidaoTipo>("nascimento");
  const [titular, setTitular] = useState("");
  const [bi, setBi] = useState("");
  const [orgao, setOrgao] = useState("Conservatória do Registo Civil de Bissau");

  const certidoesFiltradas = state.certidoes.filter(
    (c) =>
      c.titularNome.toLowerCase().includes(busca.toLowerCase()) ||
      c.numeroCertidao.toLowerCase().includes(busca.toLowerCase()) ||
      c.codigoValidacao.toLowerCase().includes(busca.toLowerCase()),
  );

  function handleEmitir(e: React.FormEvent) {
    e.preventDefault();
    if (!titular || !bi) return;

    const nova = emitirCertidao({
      tipo,
      titularNome: titular,
      numeroBI: bi,
      orgaoEmissor: orgao,
    });

    setCertidaoSelecionada(nova);
    setModalNovo(false);
    setTitular("");
    setBi("");
  }

  const tipoLabels: Record<CertidaoTipo, string> = {
    nascimento: "Certidão de Nascimento",
    casamento: "Certidão de Casamento",
    registo_criminal: "Registo Criminal",
    residencia: "Atestado de Residência",
    obito: "Certidão de Óbito",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
            Certidões Digitais Autenticadas
          </h2>
          <p className="text-xs text-ink-muted sm:text-sm">
            Emissão instantânea e conferência criptográfica de certidões públicas com validade jurídica nacional.
          </p>
        </div>

        <Button onClick={() => setModalNovo(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="size-4" /> Emitir Nova Certidão
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Lista de Certidões Emitidas */}
        <div className="space-y-4 lg:col-span-5">
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                placeholder="Buscar por titular, certidão ou código..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface py-2 pr-3 pl-9 text-xs text-ink placeholder:text-ink-faint focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </Card>

          <div className="space-y-2.5">
            {certidoesFiltradas.map((c) => {
              const isSelected = certidaoSelecionada?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setCertidaoSelecionada(c)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/30"
                      : "border-border bg-surface hover:border-emerald-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                      <FileBadge className="size-4.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink">{c.titularNome}</p>
                      <p className="text-[11px] text-ink-muted">{tipoLabels[c.tipo]}</p>
                      <p className="font-mono text-[10px] text-ink-faint">{c.numeroCertidao}</p>
                    </div>
                  </div>

                  <Badge tone="success" className="text-[9px]">
                    Válida
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visualizador Oficial do Documento Emitido */}
        <div className="lg:col-span-7">
          {certidaoSelecionada ? (
            <div className="sticky top-20 space-y-4">
              <Card className="relative overflow-hidden border-2 border-emerald-600/30 bg-surface p-6 shadow-xl sm:p-8">
                {/* Carimbo de Fundo / Selo Soberano */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-4">
                  <ShieldCheck className="size-80 text-emerald-900" />
                </div>

                <div className="relative z-10 space-y-6">
                  {/* Cabeçalho Oficial do Estado */}
                  <div className="border-b border-border pb-4 text-center">
                    <p className="text-xs font-semibold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase">
                      REPÚBLICA DA GUINÉ-BISSAU
                    </p>
                    <p className="text-[11px] font-medium text-ink-muted">MINISTÉRIO DA JUSTIÇA E DOS DIREITOS HUMANOS</p>
                    <h3 className="font-display mt-2 text-lg font-bold text-ink uppercase sm:text-xl">
                      {tipoLabels[certidaoSelecionada.tipo]}
                    </h3>
                    <p className="mt-1 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      {certidaoSelecionada.numeroCertidao}
                    </p>
                  </div>

                  {/* Corpo do Assento Governamental */}
                  <div className="space-y-3 text-xs text-ink leading-relaxed">
                    <p>
                      Certifico, a pedido de parte interessada e para os devidos efeitos legais, que nos livros do registo sob custódia de{" "}
                      <span className="font-semibold">{certidaoSelecionada.orgaoEmissor}</span>, constam os seguintes elementos oficiais relativos ao cidadão:
                    </p>

                    <div className="rounded-xl border border-border bg-surface-muted/50 p-4 space-y-2">
                      <p><span className="font-semibold text-ink">Titular do Assento:</span> {certidaoSelecionada.titularNome}</p>
                      <p><span className="font-semibold text-ink">Bilhete de Identidade Único:</span> {certidaoSelecionada.numeroBI}</p>
                      <p><span className="font-semibold text-ink">Data de Expedição:</span> {formatDate(certidaoSelecionada.dataEmissao)}</p>
                      <p><span className="font-semibold text-ink">Situação do Registo:</span> Em pleno vigor e eficácia jurídica</p>
                    </div>
                  </div>

                  {/* Rodapé Criptográfico e QR Code de Validação */}
                  <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border pt-4">
                    <div className="space-y-1 text-[11px]">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="size-3.5" /> Assinado Digitalmente com Chave Governamental
                      </span>
                      <p className="text-[10px] text-ink-muted">Código Único: <span className="font-mono font-bold text-ink">{certidaoSelecionada.codigoValidacao}</span></p>
                      <p className="font-mono text-[9px] text-ink-faint">{certidaoSelecionada.hashAutenticidade}</p>
                    </div>

                    <div className="grid size-16 place-items-center rounded-lg border border-border bg-white text-slate-900 shadow-xs">
                      <QrCode className="size-12" />
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1.5 text-xs">
                  <Printer className="size-3.5" /> Imprimir
                </Button>
                <Button size="sm" className="bg-emerald-600 gap-1.5 text-xs hover:bg-emerald-700">
                  <Download className="size-3.5" /> Baixar PDF Autenticado
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Modal Emitir Certidão */}
      {modalNovo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-base font-bold text-ink">
                Emissão de Certidão Digital
              </h3>
              <button
                type="button"
                onClick={() => setModalNovo(false)}
                className="rounded p-1 text-ink-muted hover:bg-surface-strong"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleEmitir} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-ink">Tipo de Certidão:</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as CertidaoTipo)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-emerald-600 focus:outline-hidden"
                >
                  <option value="nascimento">Certidão de Nascimento</option>
                  <option value="registo_criminal">Registo Criminal</option>
                  <option value="casamento">Certidão de Casamento</option>
                  <option value="residencia">Atestado de Residência</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Nome do Cidadão Titular:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Bacari Djassi Embaló"
                  value={titular}
                  onChange={(e) => setTitular(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Nº de Bilhete de Identidade:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: GW-109283-2024"
                  value={bi}
                  onChange={(e) => setBi(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Conservatória / Órgão Emissor:</label>
                <select
                  value={orgao}
                  onChange={(e) => setOrgao(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-emerald-600 focus:outline-hidden"
                >
                  <option value="Conservatória do Registo Civil de Bissau">Conservatória do Registo Civil de Bissau</option>
                  <option value="Direção-Geral dos Serviços Judiciários">Direção-Geral dos Serviços Judiciários</option>
                  <option value="Conservatória do Registo Civil de Bafatá">Conservatória do Registo Civil de Bafatá</option>
                  <option value="Conservatória de Canchungo">Conservatória de Canchungo</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setModalNovo(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Emitir e Autenticar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
