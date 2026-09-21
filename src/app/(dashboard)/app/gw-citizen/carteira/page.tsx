"use client";

import { useState } from "react";
import {
  CreditCard,
  Download,
  Fingerprint,
  HeartPulse,
  Plus,
  Printer,
  QrCode,
  ShieldCheck,
  Truck,
  User,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCitizen } from "@/lib/citizen-store";
import type { DocumentoDigital, DocumentoTipo } from "@/data/citizen/types";

export default function CarteiraDigitalPage() {
  const { state, adicionarDocumento } = useCitizen();

  const [docAtivo, setDocAtivo] = useState<DocumentoDigital>(state.documentos[0]);
  const [modalNovo, setModalNovo] = useState(false);

  // Form novo doc
  const [titulo, setTitulo] = useState("");
  const [numero, setNumero] = useState("");
  const [tipo, setTipo] = useState<DocumentoTipo>("bi");
  const [orgao, setOrgao] = useState("Ministério da Educação Nacional");

  function handleAdicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo || !numero) return;

    const novo = adicionarDocumento({
      tipo,
      titulo,
      numero,
      titularNome: "Bacari Djassi Embaló",
      dataEmissao: new Date().toISOString().split("T")[0],
      validade: "2030-12-31",
      orgaoEmissor: orgao,
      codigoQR: `QR-${numero}-AUTENTICADO`,
      dadosExtras: {
        Autenticação: "Digital Soberana",
        Estado: "Ativo",
      },
    });

    setDocAtivo(novo);
    setModalNovo(false);
    setTitulo("");
    setNumero("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
            Carteira Digital Soberana
          </h2>
          <p className="text-xs text-ink-muted sm:text-sm">
            Documentos oficiais de identificação, saúde, trânsito e transporte reunidos com validade jurídica nacional.
          </p>
        </div>

        <Button onClick={() => setModalNovo(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="size-4" /> Adicionar Documento
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Seletor de Documentos da Carteira */}
        <div className="space-y-3 lg:col-span-5">
          <p className="text-xs font-semibold text-ink uppercase tracking-wider">
            Selecione o Documento para Apresentar
          </p>

          <div className="space-y-2.5">
            {state.documentos.map((d) => {
              const isSelected = docAtivo?.id === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setDocAtivo(d)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 shadow-xs"
                      : "border-border bg-surface hover:border-blue-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                      {d.tipo === "bi" ? (
                        <User className="size-5" />
                      ) : d.tipo === "carta_conducao" ? (
                        <Truck className="size-5" />
                      ) : d.tipo === "cartao_vacina" ? (
                        <HeartPulse className="size-5" />
                      ) : (
                        <CreditCard className="size-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink">{d.titulo}</h4>
                      <p className="font-mono text-[11px] text-ink-muted">{d.numero}</p>
                    </div>
                  </div>

                  <Badge tone="success" className="text-[9px]">Válido</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visualizador de Cartão Digital em Alta Fidelidade */}
        <div className="lg:col-span-7">
          {docAtivo && (
            <div className="sticky top-20 space-y-4">
              <div
                className={`relative overflow-hidden rounded-2xl border p-6 text-white shadow-2xl transition ${
                  docAtivo.tipo === "bi"
                    ? "border-emerald-500/40 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950"
                    : docAtivo.tipo === "carta_conducao"
                      ? "border-amber-500/40 bg-gradient-to-br from-amber-950 via-yellow-950 to-slate-950"
                      : docAtivo.tipo === "cartao_vacina"
                        ? "border-rose-500/40 bg-gradient-to-br from-rose-950 via-red-900 to-slate-950"
                        : "border-blue-500/40 bg-gradient-to-br from-blue-950 via-sky-900 to-slate-950"
                }`}
              >
                {/* Cabeçalho do Documento */}
                <div className="flex items-start justify-between border-b border-white/20 pb-3">
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest text-white/80 uppercase">
                      REPÚBLICA DA GUINÉ-BISSAU
                    </p>
                    <p className="font-display text-sm font-bold text-white">{docAtivo.titulo}</p>
                  </div>
                  <div className="grid size-8 place-items-center rounded-lg bg-white/10 text-white border border-white/20">
                    <ShieldCheck className="size-4" />
                  </div>
                </div>

                {/* Corpo do Documento */}
                <div className="mt-4 flex gap-4">
                  <div className="grid size-20 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-md">
                    <User className="size-10 text-white/70" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-[10px] text-white/70 uppercase">Nome do Titular</p>
                    <p className="truncate text-xs font-bold text-white">{docAtivo.titularNome}</p>

                    <p className="text-[10px] text-white/70 uppercase pt-1">Nº do Documento</p>
                    <p className="font-mono text-xs font-bold text-white">{docAtivo.numero}</p>
                  </div>
                </div>

                {/* Metadados e Campos Extras */}
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-3 text-[11px]">
                  <div>
                    <span className="text-[10px] text-white/70 block">Órgão Emissor</span>
                    <span className="font-medium text-white">{docAtivo.orgaoEmissor}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/70 block">Validade</span>
                    <span className="font-medium text-white">{docAtivo.validade}</span>
                  </div>

                  {Object.entries(docAtivo.dadosExtras).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-[10px] text-white/70 block">{key}</span>
                      <span className="font-medium text-white">{val}</span>
                    </div>
                  ))}
                </div>

                {/* Rodapé com QR Code */}
                <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3">
                  <div className="text-[10px] text-white/80">
                    <p className="font-semibold flex items-center gap-1">
                      <Fingerprint className="size-3" /> Assinado Digitalmente
                    </p>
                    <p className="font-mono text-[9px] text-white/60">{docAtivo.codigoQR}</p>
                  </div>

                  <div className="grid size-12 place-items-center rounded-lg bg-white p-1 text-slate-950">
                    <QrCode className="size-10" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1.5 text-xs">
                  <Printer className="size-3.5" /> Imprimir Comprovativo
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-1.5 text-xs">
                  <Download className="size-3.5" /> Baixar PDF Autenticado
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Adicionar Documento */}
      {modalNovo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-base font-bold text-ink">
                Adicionar Novo Documento
              </h3>
              <button
                type="button"
                onClick={() => setModalNovo(false)}
                className="rounded p-1 text-ink-muted hover:bg-surface-strong"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAdicionar} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-ink">Tipo de Documento:</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as DocumentoTipo)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-blue-600 focus:outline-hidden"
                >
                  <option value="bi">Bilhete de Identidade / Certidão</option>
                  <option value="carta_conducao">Carta de Condução</option>
                  <option value="cartao_vacina">Cartão de Saúde / Vacina</option>
                  <option value="passe_transporte">Passe de Transporte</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Título do Documento:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carteira de Estudante Universitário"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Número Oficial:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: EST-2026-99120"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Órgão Emissor:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ministério da Educação Nacional"
                  value={orgao}
                  onChange={(e) => setOrgao(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setModalNovo(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Adicionar à Carteira
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
