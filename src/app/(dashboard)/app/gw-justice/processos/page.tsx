"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  FileSearch,
  Filter,
  PlusCircle,
  Scale,
  Search,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJustice, type ProcessoJudicial } from "@/lib/justice-store";

export default function ProcessosJudiciaisPage() {
  const { state, protocolarPeticao } = useJustice();
  const [busca, setBusca] = useState("");
  const [classeFiltro, setClasseFiltro] = useState<string>("todas");
  const [processoSelecionado, setProcessoSelecionado] = useState<ProcessoJudicial | null>(
    state.processos[0] || null
  );

  // Modal / Form de petição intermediária
  const [modalPeticao, setModalPeticao] = useState(false);
  const [peticaoTitulo, setPeticaoTitulo] = useState("");
  const [peticaoDescricao, setPeticaoDescricao] = useState("");
  const [peticaoAdvogado, setPeticaoAdvogado] = useState("Dra. Aissatu Mané (OAB-GW nº 182)");
  const [sucessoMsg, setSucessoMsg] = useState("");

  const processosFiltrados = state.processos.filter((p) => {
    const matchBusca =
      p.numero.toLowerCase().includes(busca.toLowerCase()) ||
      p.autor.toLowerCase().includes(busca.toLowerCase()) ||
      p.reu.toLowerCase().includes(busca.toLowerCase()) ||
      p.assunto.toLowerCase().includes(busca.toLowerCase());

    const matchClasse = classeFiltro === "todas" || p.classe === classeFiltro;

    return matchBusca && matchClasse;
  });

  const handleProtocolarIntermediaria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!processoSelecionado || !peticaoTitulo || !peticaoDescricao) return;

    protocolarPeticao(processoSelecionado.id, peticaoTitulo, peticaoDescricao, peticaoAdvogado);
    setSucessoMsg("Petição intermediária protocolada e anexada aos autos com sucesso!");
    setPeticaoTitulo("");
    setPeticaoDescricao("");
    setModalPeticao(false);

    // Atualiza o selecionado
    const updated = state.processos.find((p) => p.id === processoSelecionado.id);
    if (updated) setProcessoSelecionado(updated);

    setTimeout(() => setSucessoMsg(""), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Autos & Processos Judiciais (PJe)
          </h2>
          <p className="text-sm text-ink-muted">
            Consulta pública e restrita de autos eletrônicos, despachos, intimações e juntadas.
          </p>
        </div>

        <Link href="/app/gw-justice/peticionar">
          <Button className="bg-purple-700 hover:bg-purple-800 text-white">
            <PlusCircle className="size-4 mr-1.5" /> Protocolar Nova Ação
          </Button>
        </Link>
      </div>

      {sucessoMsg && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
          <CheckCircle2 className="size-4" />
          <span>{sucessoMsg}</span>
        </div>
      )}

      {/* Barra de Busca e Filtros */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-faint" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por número unificado (ex: GW-JUS-2026-0042), autor, réu ou assunto..."
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="size-4 text-ink-faint" />
            <select
              value={classeFiltro}
              onChange={(e) => setClasseFiltro(e.target.value)}
              className="rounded-lg border border-border-subtle bg-surface px-3 py-2 text-xs text-ink"
            >
              <option value="todas">Todas as Classes</option>
              <option value="Ação Cível Ordinária">Ação Cível Ordinária</option>
              <option value="Processo Penal">Processo Penal</option>
              <option value="Contencioso Administrativo">Contencioso Administrativo</option>
              <option value="Reclamação Trabalhista">Reclamação Trabalhista</option>
              <option value="Execução Fiscal">Execução Fiscal</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Grid: Lista de Processos + Visualizador de Autos */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Coluna de Lista (5 cols) */}
        <div className="space-y-3 lg:col-span-5">
          <div className="flex items-center justify-between text-xs text-ink-muted px-1">
            <span>Resultados encontrados: {processosFiltrados.length}</span>
            <span>Ordenados por data</span>
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {processosFiltrados.length === 0 ? (
              <Card className="p-6 text-center text-ink-muted">
                <FileSearch className="size-8 mx-auto text-ink-faint mb-2" />
                <p className="text-xs">Nenhum processo localizado com os termos informados.</p>
              </Card>
            ) : (
              processosFiltrados.map((proc) => {
                const isSelected = processoSelecionado?.id === proc.id;
                return (
                  <Card
                    key={proc.id}
                    onClick={() => setProcessoSelecionado(proc)}
                    className={`p-4 cursor-pointer transition border ${
                      isSelected
                        ? "border-purple-600 bg-purple-50/50 dark:bg-purple-950/20 shadow-sm"
                        : "hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-300">
                        {proc.numero}
                      </span>
                      <Badge tone={proc.prioridade === "urgente" ? "danger" : "navy"} className="text-[10px]">
                        {proc.classe}
                      </Badge>
                    </div>

                    <h4 className="mt-1 text-xs font-semibold text-ink line-clamp-1">{proc.assunto}</h4>
                    <p className="text-[11px] text-ink-muted mt-0.5">
                      {proc.autor} <span className="text-ink-faint">vs</span> {proc.reu}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-ink-faint pt-1 border-t border-border-subtle">
                      <span>{proc.tribunal.split(" ")[1] || proc.tribunal}</span>
                      <span>{proc.movimentacoes.length} andamentos</span>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Coluna de Detalhes dos Autos (7 cols) */}
        <div className="lg:col-span-7">
          {processoSelecionado ? (
            <Card className="p-6 space-y-6">
              {/* Header do Processo */}
              <div className="flex flex-col gap-3 pb-4 border-b border-border-subtle sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-purple-700 dark:text-purple-300">
                      {processoSelecionado.numero}
                    </span>
                    <Badge tone="navy" className="text-xs">
                      {processoSelecionado.classe}
                    </Badge>
                    {processoSelecionado.prioridade === "urgente" && (
                      <Badge tone="danger" className="text-xs">
                        Urgência / Tutela
                      </Badge>
                    )}
                  </div>
                  <h3 className="mt-1 font-display text-lg font-bold text-ink">
                    {processoSelecionado.assunto}
                  </h3>
                  <p className="text-xs text-ink-muted mt-0.5">
                    {processoSelecionado.tribunal} &bull; {processoSelecionado.vara}
                  </p>
                </div>

                <Button
                  size="sm"
                  onClick={() => setModalPeticao(true)}
                  className="bg-purple-700 hover:bg-purple-800 text-white shrink-0"
                >
                  <Send className="size-3.5 mr-1" /> Juntar Petição
                </Button>
              </div>

              {/* Informações das Partes */}
              <div className="grid gap-3 sm:grid-cols-2 rounded-lg bg-surface-raised p-4 text-xs">
                <div>
                  <p className="font-semibold text-ink flex items-center gap-1">
                    <User className="size-3.5 text-purple-600" /> Polo Ativo (Autor)
                  </p>
                  <p className="text-ink-muted mt-0.5">{processoSelecionado.autor}</p>
                  <p className="text-[10px] text-ink-faint mt-1">
                    Patrono: {processoSelecionado.advogadoAutor}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-ink flex items-center gap-1">
                    <User className="size-3.5 text-ink-muted" /> Polo Passivo (Réu)
                  </p>
                  <p className="text-ink-muted mt-0.5">{processoSelecionado.reu}</p>
                  <p className="text-[10px] text-ink-faint mt-1">
                    Magistrado: {processoSelecionado.juiz}
                  </p>
                </div>
                <div className="border-t border-border-subtle pt-2 sm:col-span-2 flex items-center justify-between text-[11px]">
                  <span className="text-ink-muted">
                    Valor atribuído à causa:{" "}
                    <strong className="text-ink">
                      {processoSelecionado.valorCausa.toLocaleString("pt-GW")} FCFA
                    </strong>
                  </span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <ShieldCheck className="size-3.5" /> Assinado com Certificado ICP-GW
                  </span>
                </div>
              </div>

              {/* Linha do Tempo de Movimentações */}
              <div className="space-y-4">
                <h4 className="font-display text-sm font-bold text-ink flex items-center gap-2">
                  <Clock className="size-4 text-purple-600" /> Histórico de Movimentações e Andamentos
                </h4>

                <div className="relative pl-6 border-l-2 border-purple-200 dark:border-purple-900/50 space-y-6">
                  {processoSelecionado.movimentacoes.map((mov) => (
                    <div key={mov.id} className="relative">
                      {/* Ponto na timeline */}
                      <div className="absolute -left-[31px] top-0.5 size-3.5 rounded-full border-2 border-purple-600 bg-surface" />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-ink">{mov.titulo}</span>
                          <span className="text-[10px] font-mono text-ink-muted">{mov.data}</span>
                        </div>
                        <p className="text-xs text-ink-muted">{mov.descricao}</p>
                        <p className="text-[10px] text-ink-faint">
                          Responsável: <span className="font-medium text-ink-muted">{mov.responsavel}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center text-ink-muted">
              <Scale className="size-12 mx-auto text-ink-faint mb-3" />
              <p className="text-sm">Selecione um processo na lista ao lado para visualizar os autos.</p>
            </Card>
          )}
        </div>
      </div>

      {/* Modal / Diálogo de Juntada de Petição */}
      {modalPeticao && processoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-ink">Juntar Petição Intermediária</h3>
                <p className="text-xs text-ink-muted font-mono">{processoSelecionado.numero}</p>
              </div>
              <button onClick={() => setModalPeticao(false)} className="text-xs text-ink-muted hover:text-ink">
                Cancelar
              </button>
            </div>

            <form onSubmit={handleProtocolarIntermediaria} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-ink">Título da Petição</label>
                <Input
                  required
                  placeholder="Ex: Réplica à Contestação / Pedido de Juntada de Documentos"
                  value={peticaoTitulo}
                  onChange={(e) => setPeticaoTitulo(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-ink">Texto / Fundamentação Resumida</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Descreva os termos da petição ou síntese dos novos elementos probatórios..."
                  value={peticaoDescricao}
                  onChange={(e) => setPeticaoDescricao(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border-subtle bg-surface p-2.5 text-xs text-ink focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-ink">Patrono / Advogado Responsável</label>
                <Input
                  value={peticaoAdvogado}
                  onChange={(e) => setPeticaoAdvogado(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="rounded bg-purple-500/10 p-2.5 text-[11px] text-purple-900 dark:text-purple-200 border border-purple-500/20">
                <p className="font-semibold flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-purple-600" /> Assinatura Eletrônica Automática
                </p>
                <p className="mt-0.5 text-ink-muted">
                  O documento receberá o selo de autenticidade ICP-GW e será indexado instantaneamente aos autos.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalPeticao(false)}>
                  Voltar
                </Button>
                <Button type="submit" size="sm" className="bg-purple-700 hover:bg-purple-800 text-white">
                  Confirmar Juntada
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
