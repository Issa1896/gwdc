"use client";

import { useState } from "react";
import {
  Clock,
  FileText,
  Filter,
  Plus,
  Search,
  Send,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGovernment } from "@/lib/government-store";
import { formatDate } from "@/lib/utils";
import type { DespachoDecisao, ProcessoPrioridade, ProcessoProtocolo } from "@/data/government/types";

export default function ProtocoloPage() {
  const { state, protocolarProcesso, adicionarDespacho } = useGovernment();

  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<string>("todos");
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [processoSelecionado, setProcessoSelecionado] = useState<ProcessoProtocolo | null>(null);

  // Formulário de Novo Processo
  const [novoRequerenteNome, setNovoRequerenteNome] = useState("");
  const [novoRequerenteBI, setNovoRequerenteBI] = useState("");
  const [novoRequerenteTelefone, setNovoRequerenteTelefone] = useState("");
  const [novoMinisterio, setNovoMinisterio] = useState("MINJUS");
  const [novoAssunto, setNovoAssunto] = useState("");
  const [novaCategoria, setNovaCategoria] = useState<ProcessoProtocolo["categoria"]>("Certidões & Registos");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novaPrioridade, setNovaPrioridade] = useState<ProcessoPrioridade>("normal");

  // Formulário de Despacho
  const [despachoTexto, setDespachoTexto] = useState("");
  const [despachoAutor, setDespachoAutor] = useState("Dr. Mamadu Saido");
  const [despachoCargo, setDespachoCargo] = useState("Diretor-Geral");
  const [despachoOrgao, setDespachoOrgao] = useState("Gabinete Ministerial");
  const [despachoDecisao, setDespachoDecisao] = useState<DespachoDecisao>("favoravel");

  const processosFiltrados = state.processos.filter((p) => {
    const matchBusca =
      p.numeroProtocolo.toLowerCase().includes(busca.toLowerCase()) ||
      p.requerenteNome.toLowerCase().includes(busca.toLowerCase()) ||
      p.assunto.toLowerCase().includes(busca.toLowerCase()) ||
      p.requerenteBI.toLowerCase().includes(busca.toLowerCase());

    const matchStatus = statusFiltro === "todos" || p.status === statusFiltro;

    return matchBusca && matchStatus;
  });

  function handleCriarProcesso(e: React.FormEvent) {
    e.preventDefault();
    if (!novoRequerenteNome || !novoAssunto) return;

    protocolarProcesso({
      requerenteNome: novoRequerenteNome,
      requerenteBI: novoRequerenteBI || "GW-PENDENTE",
      requerenteTelefone: novoRequerenteTelefone || "+245 9",
      ministerioDestino: novoMinisterio,
      assunto: novoAssunto,
      categoria: novaCategoria,
      descricao: novaDescricao || "Processo submetido para tramitação no protocolo.",
      prioridade: novaPrioridade,
    });

    setModalNovoAberto(false);
    // Limpar form
    setNovoRequerenteNome("");
    setNovoRequerenteBI("");
    setNovoRequerenteTelefone("");
    setNovoAssunto("");
    setNovaDescricao("");
  }

  function handleAdicionarDespacho(e: React.FormEvent) {
    e.preventDefault();
    if (!processoSelecionado || !despachoTexto) return;

    adicionarDespacho(processoSelecionado.id, {
      autor: despachoAutor,
      cargo: despachoCargo,
      orgao: despachoOrgao,
      texto: despachoTexto,
      decisao: despachoDecisao,
    });

    setDespachoTexto("");
    // Atualizar processo selecionado
    const updated = state.processos.find((p) => p.id === processoSelecionado.id);
    if (updated) setProcessoSelecionado(updated);
  }

  return (
    <div className="space-y-6">
      {/* Header da Página */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
            Protocolo Eletrónico Único do Estado
          </h2>
          <p className="text-xs text-ink-muted sm:text-sm">
            Registo, tramitação e auditoria de processos públicos interministeriais.
          </p>
        </div>

        <Button onClick={() => setModalNovoAberto(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="size-4" /> Protocolar Novo Processo
        </Button>
      </div>

      {/* Barra de Filtros e Busca */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              placeholder="Buscar por nº de protocolo, requerente, BI ou assunto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface py-2 pr-3 pl-9 text-xs text-ink placeholder:text-ink-faint focus:border-emerald-600 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="size-3.5 text-ink-muted" />
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:outline-hidden"
            >
              <option value="todos">Todos os status</option>
              <option value="recebido">Recebido</option>
              <option value="em_analise">Em Análise</option>
              <option value="despachado">Despachado</option>
              <option value="concluido">Concluído</option>
              <option value="indeferido">Indeferido</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Lista de Processos */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {processosFiltrados.length === 0 ? (
            <Card className="p-8 text-center text-ink-muted">
              <FileText className="mx-auto size-8 text-ink-faint" />
              <p className="mt-2 text-sm">Nenhum processo encontrado com os filtros aplicados.</p>
            </Card>
          ) : (
            processosFiltrados.map((proc) => {
              const isSelected = processoSelecionado?.id === proc.id;
              const statusTone =
                proc.status === "concluido"
                  ? "success"
                  : proc.status === "despachado"
                    ? "brand"
                    : proc.status === "em_analise"
                      ? "warning"
                      : proc.status === "indeferido"
                        ? "danger"
                        : "neutral";

              return (
                <div
                  key={proc.id}
                  onClick={() => setProcessoSelecionado(proc)}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/20"
                      : "border-border bg-surface hover:border-emerald-500/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          {proc.numeroProtocolo}
                        </span>
                        <Badge tone="neutral" className="text-[10px] font-semibold">
                          {proc.ministerioDestino}
                        </Badge>
                        <Badge tone={statusTone} className="text-[10px] uppercase">
                          {proc.status.replace("_", " ")}
                        </Badge>
                        {proc.prioridade === "muito_urgente" && (
                          <Badge tone="danger" className="text-[9px]">Urgência Máxima</Badge>
                        )}
                      </div>
                      <h4 className="mt-1.5 text-sm font-semibold text-ink">{proc.assunto}</h4>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        Requerente: <span className="text-ink font-medium">{proc.requerenteNome}</span> · BI: {proc.requerenteBI}
                      </p>
                    </div>
                    <span className="text-[11px] text-ink-faint">
                      {formatDate(proc.dataAtualizacao)}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-xs text-ink-muted leading-relaxed">
                    {proc.descricao}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 text-[11px] text-ink-faint">
                    <span>{proc.despachos.length} despachos registados</span>
                    <span className="font-medium text-emerald-700 dark:text-emerald-400 hover:underline">
                      Ver detalhes e despachar &rarr;
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detalhes do Processo Selecionado / Tramitação */}
        <div>
          {processoSelecionado ? (
            <Card className="sticky top-20 space-y-4 p-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {processoSelecionado.numeroProtocolo}
                  </span>
                  <h3 className="font-display text-sm font-bold text-ink">
                    Trilha Oficial de Tramitação
                  </h3>
                </div>
                <Badge tone="neutral">{processoSelecionado.ministerioDestino}</Badge>
              </div>

              <div>
                <p className="text-xs font-semibold text-ink">Requerimento:</p>
                <p className="mt-0.5 text-xs text-ink-muted">{processoSelecionado.assunto}</p>
                <p className="mt-1 text-xs text-ink-muted/80">{processoSelecionado.descricao}</p>
              </div>

              {/* Linha do Tempo de Despachos */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-ink">Despachos e Decisões:</p>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {processoSelecionado.despachos.map((d) => (
                    <div key={d.id} className="rounded-lg border border-border bg-surface-muted p-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink">{d.autor}</span>
                        <Badge
                          tone={d.decisao === "favoravel" ? "success" : d.decisao === "desfavoravel" ? "danger" : "brand"}
                          className="text-[9px]"
                        >
                          {d.decisao}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-[10px] text-ink-faint">{d.cargo} · {d.orgao}</p>
                      <p className="mt-1.5 text-xs text-ink-muted leading-relaxed">{d.texto}</p>
                      <span className="mt-1 block text-[10px] text-ink-faint">{formatDate(d.data)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Adicionar Novo Despacho */}
              <form onSubmit={handleAdicionarDespacho} className="space-y-2.5 border-t border-border pt-3">
                <p className="text-xs font-semibold text-ink">Emitir Despacho Governamental:</p>
                
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Nome do emissor"
                    value={despachoAutor}
                    onChange={(e) => setDespachoAutor(e.target.value)}
                    className="rounded border border-border bg-surface px-2 py-1 text-[11px] text-ink"
                  />
                  <input
                    type="text"
                    placeholder="Cargo"
                    value={despachoCargo}
                    onChange={(e) => setDespachoCargo(e.target.value)}
                    className="rounded border border-border bg-surface px-2 py-1 text-[11px] text-ink"
                  />
                  <input
                    type="text"
                    placeholder="Órgão / Gabinete"
                    value={despachoOrgao}
                    onChange={(e) => setDespachoOrgao(e.target.value)}
                    className="rounded border border-border bg-surface px-2 py-1 text-[11px] text-ink"
                  />
                </div>

                <textarea
                  rows={2}
                  placeholder="Insira o parecer oficial ou despacho de encaminhamento..."
                  value={despachoTexto}
                  onChange={(e) => setDespachoTexto(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface p-2 text-xs text-ink placeholder:text-ink-faint focus:border-emerald-600 focus:outline-hidden"
                  required
                />

                <div className="flex items-center gap-2">
                  <select
                    value={despachoDecisao}
                    onChange={(e) => setDespachoDecisao(e.target.value as DespachoDecisao)}
                    className="flex-1 rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-ink"
                  >
                    <option value="favoravel">Parecer Favorável</option>
                    <option value="encaminhamento">Encaminhamento</option>
                    <option value="solicitacao_documentos">Solicitar Documentos</option>
                    <option value="desfavoravel">Indeferimento</option>
                  </select>

                  <Button type="submit" size="sm" className="bg-emerald-600 text-xs hover:bg-emerald-700">
                    <Send className="size-3.5" /> Assinar
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card className="p-8 text-center text-ink-muted">
              <Clock className="mx-auto size-8 text-ink-faint" />
              <p className="mt-2 text-xs">Selecione um processo à esquerda para visualizar a tramitação e assinar despachos.</p>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de Novo Processo */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-base font-bold text-ink">
                Registo de Processo no Protocolo Geral
              </h3>
              <button
                type="button"
                onClick={() => setModalNovoAberto(false)}
                className="rounded p-1 text-ink-muted hover:bg-surface-strong"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCriarProcesso} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-ink">Nome do Requerente / Cidadão:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Bacari Djassi Embaló"
                  value={novoRequerenteNome}
                  onChange={(e) => setNovoRequerenteNome(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink">Nº de BI ou NIF:</label>
                  <input
                    type="text"
                    placeholder="Ex: GW-109283-2024"
                    value={novoRequerenteBI}
                    onChange={(e) => setNovoRequerenteBI(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink">Contacto Telefónico:</label>
                  <input
                    type="text"
                    placeholder="Ex: +245 955 123 456"
                    value={novoRequerenteTelefone}
                    onChange={(e) => setNovoRequerenteTelefone(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink">Ministério de Destino:</label>
                  <select
                    value={novoMinisterio}
                    onChange={(e) => setNovoMinisterio(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-emerald-600 focus:outline-hidden"
                  >
                    {state.ministerios.map((m) => (
                      <option key={m.id} value={m.sigla}>
                        {m.sigla} - {m.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink">Prioridade:</label>
                  <select
                    value={novaPrioridade}
                    onChange={(e) => setNovaPrioridade(e.target.value as ProcessoPrioridade)}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-emerald-600 focus:outline-hidden"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgente">Urgente</option>
                    <option value="muito_urgente">Muito Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Categoria do Processo:</label>
                <select
                  value={novaCategoria}
                  onChange={(e) => setNovaCategoria(e.target.value as ProcessoProtocolo["categoria"])}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-emerald-600 focus:outline-hidden"
                >
                  <option value="Certidões & Registos">Certidões & Registos</option>
                  <option value="Alvará Comercial">Alvará Comercial</option>
                  <option value="Bolsas de Estudo">Bolsas de Estudo</option>
                  <option value="Saúde Pública">Saúde Pública</option>
                  <option value="Obras Públicas">Obras Públicas</option>
                  <option value="Assuntos Fiscais">Assuntos Fiscais</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Assunto do Requerimento:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pedido de Isenção Fiscal para Cooperativa Agrícola"
                  value={novoAssunto}
                  onChange={(e) => setNovoAssunto(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Descrição detalhada:</label>
                <textarea
                  rows={3}
                  placeholder="Descreva os termos do pedido submetido pelo cidadão ou entidade..."
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setModalNovoAberto(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Gerar Protocolo Oficial
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
