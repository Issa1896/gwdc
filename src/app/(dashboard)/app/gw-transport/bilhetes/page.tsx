"use client";

import { useState } from "react";
import {
  Bus,
  CheckCircle2,
  Download,
  Plus,
  Printer,
  QrCode,
  ScanLine,
  Search,
  Ship,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTransport } from "@/lib/transport-store";
import { formatDate } from "@/lib/utils";
import type { BilheteDigital } from "@/data/transport/types";

export default function BilhetesPage() {
  const { state, comprarBilhete, validarBilhete } = useTransport();

  const [busca, setBusca] = useState("");
  const [modalidadeFiltro, setModalidadeFiltro] = useState("todas");
  const [bilheteSelecionado, setBilheteSelecionado] = useState<BilheteDigital>(state.bilhetes[0]);
  const [modalCompraAberto, setModalCompraAberto] = useState(false);

  // Form de Compra
  const [nome, setNome] = useState("");
  const [bi, setBi] = useState("");
  const [telefone, setTelefone] = useState("+245 9");
  const [rotaId, setRotaId] = useState(state.rotas[0]?.id || "rot-01");
  const [dataViagem, setDataViagem] = useState("2026-03-25");
  const [horario, setHorario] = useState("08:30");
  const [metodoPagamento, setMetodoPagamento] = useState("orange_money");

  const bilhetesFiltrados = state.bilhetes.filter((b) => {
    const matchBusca =
      b.numeroBilhete.toLowerCase().includes(busca.toLowerCase()) ||
      b.passageiroNome.toLowerCase().includes(busca.toLowerCase()) ||
      b.rotaNome.toLowerCase().includes(busca.toLowerCase());

    const matchModalidade = modalidadeFiltro === "todas" || b.modalidade === modalidadeFiltro;

    return matchBusca && matchModalidade;
  });

  function handleComprar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome) return;

    const novo = comprarBilhete({
      passageiroNome: nome,
      passageiroBI: bi || "GW-PENDENTE",
      passageiroTelefone: telefone,
      rotaId,
      dataViagem,
      horarioPartida: horario,
    });

    setBilheteSelecionado(novo);
    setModalCompraAberto(false);
    setNome("");
    setBi("");
  }

  function handleValidar(num: string) {
    validarBilhete(num);
    const updated = state.bilhetes.find((b) => b.numeroBilhete === num);
    if (updated) {
      setBilheteSelecionado({ ...updated, status: "validado" });
    }
  }

  const rotaEscolhida = state.rotas.find((r) => r.id === rotaId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
            Bilhetes Digitais & Cartão de Embarque
          </h2>
          <p className="text-xs text-ink-muted sm:text-sm">
            Emissão de bilhete com QR Code para embarque seguro no transporte público e navios dos Bijagós.
          </p>
        </div>

        <Button onClick={() => setModalCompraAberto(true)} className="bg-sky-600 hover:bg-sky-700">
          <Plus className="size-4" /> Comprar Nova Passagem
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Lista de Bilhetes Emitidos */}
        <div className="space-y-4 lg:col-span-6">
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[200px] flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" />
                <input
                  type="text"
                  placeholder="Pesquisar bilhete, passageiro ou rota..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface py-2 pr-3 pl-9 text-xs text-ink placeholder:text-ink-faint focus:border-sky-600 focus:outline-hidden"
                />
              </div>

              <select
                value={modalidadeFiltro}
                onChange={(e) => setModalidadeFiltro(e.target.value)}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:outline-hidden"
              >
                <option value="todas">Todos os modais</option>
                <option value="rodoviario">Rodoviário</option>
                <option value="maritimo">Marítimo (Bijagós)</option>
              </select>
            </div>
          </Card>

          <div className="space-y-2.5">
            {bilhetesFiltrados.map((b) => {
              const isSelected = bilheteSelecionado?.id === b.id;
              const tone =
                b.status === "validado"
                  ? "success"
                  : b.status === "embarque_aberto"
                    ? "info"
                    : b.status === "cancelado"
                      ? "danger"
                      : "neutral";

              return (
                <div
                  key={b.id}
                  onClick={() => setBilheteSelecionado(b)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition ${
                    isSelected
                      ? "border-sky-600 bg-sky-50/40 dark:bg-sky-950/30"
                      : "border-border bg-surface hover:border-sky-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`grid size-10 place-items-center rounded-xl ${
                        b.modalidade === "maritimo"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300"
                          : "bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300"
                      }`}
                    >
                      {b.modalidade === "maritimo" ? <Ship className="size-5" /> : <Bus className="size-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-400">
                          {b.numeroBilhete}
                        </span>
                        <Badge tone={tone} className="text-[9px] uppercase">
                          {b.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-xs font-bold text-ink">{b.passageiroNome}</p>
                      <p className="text-[11px] text-ink-muted">
                        {b.rotaNome} · Partida: {b.horarioPartida} · Assento: {b.assento}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-ink">
                      {b.precoPagoFCFA.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visualizador do Cartão de Embarque Digital com QR Code */}
        <div className="lg:col-span-6">
          {bilheteSelecionado ? (
            <div className="sticky top-20 space-y-4">
              <Card className="relative overflow-hidden border-2 border-sky-600/30 bg-surface p-6 shadow-xl sm:p-8">
                {/* Topo do Bilhete de Embarque */}
                <div className="flex items-start justify-between border-b border-border pb-4">
                  <div>
                    <span className="text-[10px] font-semibold tracking-widest text-sky-600 dark:text-sky-400 uppercase">
                      MINISTÉRIO DOS TRANSPORTES · GW TRANSPORT
                    </span>
                    <h3 className="font-display text-lg font-bold text-ink">
                      Cartão de Embarque Soberano
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-400">
                      {bilheteSelecionado.numeroBilhete}
                    </span>
                    <Badge tone={bilheteSelecionado.status === "validado" ? "success" : "info"} className="mt-1 block text-[10px]">
                      {bilheteSelecionado.status === "validado" ? "EMBARCADO" : "VÁLIDO PARA EMBARQUE"}
                    </Badge>
                  </div>
                </div>

                {/* Trajeto e Dados Principais */}
                <div className="my-5 space-y-4">
                  <div className="rounded-xl border border-border bg-surface-muted/50 p-4">
                    <p className="text-[10px] text-ink-muted uppercase">Trajeto / Linha</p>
                    <p className="font-display text-base font-bold text-ink sm:text-lg">
                      {bilheteSelecionado.rotaNome}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-ink-muted block">Passageiro</span>
                      <strong className="text-ink">{bilheteSelecionado.passageiroNome}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-muted block">Data da Viagem</span>
                      <strong className="text-ink">{formatDate(bilheteSelecionado.dataViagem)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-muted block">Horário de Partida</span>
                      <strong className="text-sky-700 dark:text-sky-400 font-mono text-sm">{bilheteSelecionado.horarioPartida}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 border-t border-border/80 pt-3 text-xs">
                    <div>
                      <span className="text-[10px] text-ink-muted block">Assento Marcado</span>
                      <strong className="font-mono text-base text-ink">{bilheteSelecionado.assento}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-muted block">Modalidade</span>
                      <strong className="capitalize text-ink">{bilheteSelecionado.modalidade}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-ink-muted block">Tarifa Oficial</span>
                      <strong className="text-ink">{bilheteSelecionado.precoPagoFCFA.toLocaleString()} FCFA</strong>
                    </div>
                  </div>
                </div>

                {/* QR Code de Validação na Catraca */}
                <div className="flex items-center justify-between border-t-2 border-dashed border-border pt-4">
                  <div>
                    <p className="text-xs font-semibold text-ink">Validação no Embarque</p>
                    <p className="text-[11px] text-ink-muted">Apresente este código ao cobrador ou leitor do porto/ônibus.</p>
                    <p className="mt-1 font-mono text-[10px] text-ink-faint">{bilheteSelecionado.codigoValidacao}</p>
                  </div>

                  <div className="grid size-20 place-items-center rounded-xl border border-border bg-white text-slate-950 p-1 shadow-sm">
                    <QrCode className="size-16" />
                  </div>
                </div>
              </Card>

              {/* Ações do Bilhete */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                {bilheteSelecionado.status !== "validado" ? (
                  <Button
                    onClick={() => handleValidar(bilheteSelecionado.numeroBilhete)}
                    className="bg-emerald-600 hover:bg-emerald-700 gap-1.5 text-xs"
                  >
                    <ScanLine className="size-3.5" /> Simular Validação na Catraca
                  </Button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                    <CheckCircle2 className="size-4" /> Bilhete Conferido e Validado
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1.5 text-xs">
                    <Printer className="size-3.5" /> Imprimir
                  </Button>
                  <Button size="sm" className="bg-sky-600 hover:bg-sky-700 gap-1.5 text-xs">
                    <Download className="size-3.5" /> Baixar Bilhete
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Modal de Compra de Bilhete */}
      {modalCompraAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-base font-bold text-ink">
                Compra de Passagem Eletrônica
              </h3>
              <button
                type="button"
                onClick={() => setModalCompraAberto(false)}
                className="rounded p-1 text-ink-muted hover:bg-surface-strong"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleComprar} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-ink">Nome do Passageiro:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Malam Djassi"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-sky-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink">Nº de BI ou Documento:</label>
                  <input
                    type="text"
                    placeholder="Ex: GW-109283-2024"
                    value={bi}
                    onChange={(e) => setBi(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-sky-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink">Telefone Móvel:</label>
                  <input
                    type="text"
                    placeholder="Ex: +245 955 123 456"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-sky-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Selecione a Rota:</label>
                <select
                  value={rotaId}
                  onChange={(e) => setRotaId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-sky-600 focus:outline-hidden"
                >
                  {state.rotas.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.origem} → {r.destino} ({r.precoFCFA.toLocaleString()} FCFA)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink">Data da Viagem:</label>
                  <input
                    type="date"
                    required
                    value={dataViagem}
                    onChange={(e) => setDataViagem(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-sky-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink">Horário:</label>
                  <select
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-sky-600 focus:outline-hidden"
                  >
                    {(rotaEscolhida?.horarios || ["08:00", "12:00"]).map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Método de Pagamento Integrado:</label>
                <select
                  value={metodoPagamento}
                  onChange={(e) => setMetodoPagamento(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-sky-600 focus:outline-hidden"
                >
                  <option value="orange_money">Orange Money Guiné-Bissau</option>
                  <option value="mtn_momo">MTN Mobile Money</option>
                  <option value="gw_pay">GW Pay Digital Wallet</option>
                </select>
              </div>

              <div className="rounded-lg border border-border bg-surface-muted p-2.5 text-xs text-ink flex items-center justify-between">
                <span>Total a Pagar:</span>
                <strong className="font-mono text-sm text-sky-700 dark:text-sky-400">
                  {rotaEscolhida?.precoFCFA.toLocaleString() || 3500} FCFA
                </strong>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setModalCompraAberto(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
                  Pagar e Emitir Bilhete QR
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
