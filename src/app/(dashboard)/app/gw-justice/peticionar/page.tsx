"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FileCheck2,
  Gavel,
  Scale,
  Send,
  ShieldAlert,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJustice, type ClasseProcessual } from "@/lib/justice-store";

export default function PeticionamentoPage() {
  const { distribuirProcesso } = useJustice();

  const [classe, setClasse] = useState<ClasseProcessual>("Ação Cível Ordinária");
  const [tribunal, setTribunal] = useState("Tribunal Regional de Bissau");
  const [vara, setVara] = useState("1ª Vara Cível e Comercial");
  const [autor, setAutor] = useState("");
  const [reu, setReu] = useState("");
  const [advogadoAutor, setAdvogadoAutor] = useState("Dra. Aissatu Mané (OAB-GW nº 182)");
  const [assunto, setAssunto] = useState("");
  const [valorCausa, setValorCausa] = useState<string>("5000000");
  const [prioridade, setPrioridade] = useState<"normal" | "urgente">("normal");

  const [processoCriado, setProcessoCriado] = useState<{ numero: string; id: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!autor || !reu || !assunto) return;

    const novo = distribuirProcesso({
      classe,
      tribunal,
      vara,
      juiz: "Juiz Titular da Vara (Distribuído por Sorteio)",
      autor,
      reu,
      advogadoAutor,
      assunto,
      valorCausa: Number(valorCausa) || 0,
      prioridade,
    });

    setProcessoCriado({ numero: novo.numero, id: novo.id });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Voltar e Título */}
      <div className="flex items-center gap-3">
        <Link href="/app/gw-justice">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="size-4" /> Voltar ao Painel
          </Button>
        </Link>
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Peticionamento Eletrônico Soberano
          </h2>
          <p className="text-xs text-ink-muted">
            Protocolo unificado de novas ações judiciais com distribuição automática e assinatura ICP-GW.
          </p>
        </div>
      </div>

      {processoCriado ? (
        <Card className="p-8 text-center space-y-4 border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20">
          <div className="grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-700 mx-auto dark:bg-emerald-900/60 dark:text-emerald-300">
            <CheckCircle2 className="size-8" />
          </div>

          <div className="space-y-1">
            <Badge tone="success" className="text-xs">
              Protocolo Concluído com Sucesso
            </Badge>
            <h3 className="font-display text-xl font-bold text-ink">
              Processo Autuado e Distribuído
            </h3>
            <p className="font-mono text-lg font-bold text-purple-700 dark:text-purple-300">
              {processoCriado.numero}
            </p>
          </div>

          <p className="text-xs text-ink-muted max-w-md mx-auto">
            A petição inicial foi assinada digitalmente com fé pública e distribuída aleatoriamente para a vara competente. O comprovante de distribuição foi encaminhado ao patrono.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link href={`/app/gw-justice/processos?id=${processoCriado.id}`}>
              <Button className="bg-purple-700 hover:bg-purple-800 text-white">
                <FileCheck2 className="size-4 mr-1.5" /> Acessar Autos do Processo
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                setProcessoCriado(null);
                setAutor("");
                setReu("");
                setAssunto("");
              }}
            >
              Protocolar Nova Ação
            </Button>
          </div>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Órgão Jurisdicional e Classe */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
              <Scale className="size-4 text-purple-600" />
              <h3 className="font-display text-sm font-bold text-ink">Competência e Classe Processual</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 text-xs">
              <div>
                <label className="font-semibold text-ink">Classe Processual</label>
                <select
                  value={classe}
                  onChange={(e) => setClasse(e.target.value as ClasseProcessual)}
                  className="mt-1 w-full rounded-lg border border-border-subtle bg-surface p-2 text-xs text-ink"
                >
                  <option value="Ação Cível Ordinária">Ação Cível Ordinária</option>
                  <option value="Processo Penal">Processo Penal</option>
                  <option value="Contencioso Administrativo">Contencioso Administrativo</option>
                  <option value="Reclamação Trabalhista">Reclamação Trabalhista</option>
                  <option value="Execução Fiscal">Execução Fiscal</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-ink">Tribunal Competente</label>
                <select
                  value={tribunal}
                  onChange={(e) => setTribunal(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border-subtle bg-surface p-2 text-xs text-ink"
                >
                  <option value="Tribunal Regional de Bissau">Tribunal Regional de Bissau</option>
                  <option value="Tribunal Setorial de Bafatá">Tribunal Setorial de Bafatá</option>
                  <option value="Tribunal Setorial de Gabú">Tribunal Setorial de Gabú</option>
                  <option value="Tribunal Regional de Cacheu">Tribunal Regional de Cacheu</option>
                  <option value="Supremo Tribunal de Justiça">Supremo Tribunal de Justiça</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-ink">Vara / Seção Especializada</label>
                <select
                  value={vara}
                  onChange={(e) => setVara(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border-subtle bg-surface p-2 text-xs text-ink"
                >
                  <option value="1ª Vara Cível e Comercial">1ª Vara Cível e Comercial</option>
                  <option value="2ª Vara Criminal">2ª Vara Criminal</option>
                  <option value="Vara Especial do Trabalho">Vara Especial do Trabalho</option>
                  <option value="Vara de Família e Sucessões">Vara de Família e Sucessões</option>
                  <option value="Gabinete do Plantão Judiciário">Gabinete do Plantão</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Card 2: Qualificação das Partes */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
              <Gavel className="size-4 text-purple-600" />
              <h3 className="font-display text-sm font-bold text-ink">Qualificação das Partes</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div>
                <label className="font-semibold text-ink">Autor / Requerente (Polo Ativo)</label>
                <Input
                  required
                  placeholder="Nome completo ou Razão Social do Autor"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-ink">Réu / Requerido (Polo Passivo)</label>
                <Input
                  required
                  placeholder="Nome completo ou Razão Social do Réu"
                  value={reu}
                  onChange={(e) => setReu(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-ink">Advogado Patrono / Defensor Público</label>
                <Input
                  required
                  value={advogadoAutor}
                  onChange={(e) => setAdvogadoAutor(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Card 3: Causa de Pedir e Valor */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
              <FileCheck2 className="size-4 text-purple-600" />
              <h3 className="font-display text-sm font-bold text-ink">Objeto da Ação e Valor da Causa</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-ink">Assunto / Síntese dos Fatos</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Descreva a pretensão jurídica, o litígio e os pedidos formulados..."
                  value={assunto}
                  onChange={(e) => setAssunto(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border-subtle bg-surface p-2.5 text-xs text-ink focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="font-semibold text-ink">Valor da Causa (FCFA)</label>
                  <Input
                    type="number"
                    required
                    value={valorCausa}
                    onChange={(e) => setValorCausa(e.target.value)}
                    className="mt-1"
                  />
                  <p className="mt-1 text-[10px] text-ink-muted">
                    Utilizado para cálculo das custas e determinação de alçada recursal.
                  </p>
                </div>

                <div>
                  <label className="font-semibold text-ink">Prioridade de Tramitação</label>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="prioridade"
                        checked={prioridade === "normal"}
                        onChange={() => setPrioridade("normal")}
                      />
                      <span>Normal</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="prioridade"
                        checked={prioridade === "urgente"}
                        onChange={() => setPrioridade("urgente")}
                      />
                      <span className="text-rose-600 font-semibold flex items-center gap-1">
                        <ShieldAlert className="size-3" /> Tutela de Urgência
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Upload Simulado */}
              <div className="rounded-lg border-2 border-dashed border-border-subtle p-4 text-center">
                <Upload className="size-6 mx-auto text-ink-faint mb-1.5" />
                <p className="font-semibold text-ink">Anexar Petição e Procuração em PDF</p>
                <p className="text-[11px] text-ink-muted mt-0.5">
                  Assinatura digital padrão ICP-GW será embutida automaticamente no protocolo.
                </p>
              </div>
            </div>
          </Card>

          {/* Botão de Envio */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>Transmissão criptografada e auditada pelo STJ</span>
            </div>

            <Button type="submit" className="bg-purple-700 hover:bg-purple-800 text-white">
              <Send className="size-4 mr-1.5" /> Protocolar e Distribuir Ação
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
