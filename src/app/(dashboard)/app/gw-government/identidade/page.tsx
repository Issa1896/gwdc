"use client";

import { useState } from "react";
import {
  Fingerprint,
  Plus,
  Search,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGovernment } from "@/lib/government-store";
import type { CidadaoGW } from "@/data/government/types";

export default function IdentidadePage() {
  const { state, cadastrarCidadao } = useGovernment();

  const [busca, setBusca] = useState("");
  const [regiaoFiltro, setRegiaoFiltro] = useState("todas");
  const [cidadaoSelecionado, setCidadaoSelecionado] = useState<CidadaoGW>(state.cidadaos[0]);
  const [modalNovo, setModalNovo] = useState(false);

  // Form novo cidadão
  const [nome, setNome] = useState("");
  const [sexo, setSexo] = useState<"M" | "F">("M");
  const [dataNasc, setDataNasc] = useState("1995-05-15");
  const [naturalidade, setNaturalidade] = useState("Bissau");
  const [regiao, setRegiao] = useState<CidadaoGW["regiao"]>("Bissau");
  const [pai, setPai] = useState("");
  const [mae, setMae] = useState("");
  const [estadoCivil] = useState<CidadaoGW["estadoCivil"]>("Solteiro(a)");

  const cidadaosFiltrados = state.cidadaos.filter((c) => {
    const matchBusca =
      c.nomeCompleto.toLowerCase().includes(busca.toLowerCase()) ||
      c.numeroBI.toLowerCase().includes(busca.toLowerCase()) ||
      c.nif.includes(busca);

    const matchRegiao = regiaoFiltro === "todas" || c.regiao === regiaoFiltro;

    return matchBusca && matchRegiao;
  });

  function handleCadastrar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome) return;

    const randNum = Math.floor(100000 + Math.random() * 900000);
    const randNif = Math.floor(500000000 + Math.random() * 99999999);
    const anoAtual = new Date().getFullYear();

    const novo = cadastrarCidadao({
      numeroBI: `GW-${randNum}-${anoAtual}`,
      nif: String(randNif),
      nomeCompleto: nome,
      dataNascimento: dataNasc,
      sexo,
      naturalidade,
      regiao,
      filiacaoPai: pai || "Não declarado",
      filiacaoMae: mae || "Não declarada",
      estadoCivil,
      dataEmissao: `${anoAtual}-01-10`,
      validade: `${anoAtual + 5}-01-10`,
      biometriaStatus: "validada",
    });

    setCidadaoSelecionado(novo);
    setModalNovo(false);
    setNome("");
    setPai("");
    setMae("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
            GW Identity — Registo e Identidade Nacional
          </h2>
          <p className="text-xs text-ink-muted sm:text-sm">
            Bilhete de Identidade Único e Cadastro Nacional Biométrico da Guiné-Bissau.
          </p>
        </div>

        <Button onClick={() => setModalNovo(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="size-4" /> Registar Novo Cidadão
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Lista e Busca de Cidadãos */}
        <div className="space-y-4 lg:col-span-7">
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[200px] flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome, BI ou NIF..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface py-2 pr-3 pl-9 text-xs text-ink placeholder:text-ink-faint focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <select
                value={regiaoFiltro}
                onChange={(e) => setRegiaoFiltro(e.target.value)}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:outline-hidden"
              >
                <option value="todas">Todas as regiões</option>
                <option value="Bissau">Bissau</option>
                <option value="Bafatá">Bafatá</option>
                <option value="Gabú">Gabú</option>
                <option value="Cacheu">Cacheu</option>
                <option value="Biombo">Biombo</option>
                <option value="Oio">Oio</option>
              </select>
            </div>
          </Card>

          <div className="space-y-2.5">
            {cidadaosFiltrados.map((c) => {
              const isSelected = cidadaoSelecionado?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setCidadaoSelecionado(c)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/30"
                      : "border-border bg-surface hover:border-emerald-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 font-bold text-xs">
                      {c.nomeCompleto.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink">{c.nomeCompleto}</p>
                      <p className="text-[11px] text-ink-muted">
                        BI: <span className="font-mono font-medium">{c.numeroBI}</span> · NIF: {c.nif}
                      </p>
                      <p className="text-[10px] text-ink-faint">
                        {c.regiao} · Nasc.: {c.dataNascimento}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge tone={c.biometriaStatus === "validada" ? "success" : "warning"} className="text-[9px]">
                      {c.biometriaStatus === "validada" ? "Biometria OK" : "Pendente"}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visualização do Bilhete de Identidade Digital (Cartão Soberano) */}
        <div className="lg:col-span-5">
          {cidadaoSelecionado && (
            <div className="sticky top-20 space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-emerald-600/30 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 p-6 text-white shadow-2xl">
                {/* Cabeçalho do Cartão Soberano */}
                <div className="flex items-start justify-between border-b border-emerald-500/30 pb-3">
                  <div>
                    <p className="text-[10px] font-semibold tracking-widest text-emerald-300 uppercase">
                      REPÚBLICA DA GUINÉ-BISSAU
                    </p>
                    <p className="font-display text-sm font-bold text-white">BILHETE DE IDENTIDADE</p>
                  </div>
                  <div className="grid size-8 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <ShieldCheck className="size-5" />
                  </div>
                </div>

                {/* Corpo do Cartão */}
                <div className="mt-4 flex gap-4">
                  <div className="grid size-20 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-md">
                    <User className="size-10 text-white/70" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-[10px] text-emerald-300/80 uppercase">Nome Completo</p>
                    <p className="truncate text-xs font-bold text-white">{cidadaoSelecionado.nomeCompleto}</p>

                    <p className="text-[10px] text-emerald-300/80 uppercase pt-1">Nº de Identificação</p>
                    <p className="font-mono text-xs font-bold text-amber-300">{cidadaoSelecionado.numeroBI}</p>
                  </div>
                </div>

                {/* Metadados e Biometria */}
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/15 pt-3 text-[11px]">
                  <div>
                    <span className="text-[10px] text-emerald-300/80 block">Data de Nascimento</span>
                    <span className="font-medium text-white">{cidadaoSelecionado.dataNascimento}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-300/80 block">Naturalidade / Região</span>
                    <span className="font-medium text-white">{cidadaoSelecionado.naturalidade}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-300/80 block">Validade</span>
                    <span className="font-medium text-white">{cidadaoSelecionado.validade}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-300/80 block">Autenticação</span>
                    <span className="inline-flex items-center gap-1 font-medium text-emerald-300">
                      <Fingerprint className="size-3" /> Biometria Validada
                    </span>
                  </div>
                </div>
              </div>

              {/* Ficha Completa do Registo Civil */}
              <Card className="p-4 space-y-2 text-xs">
                <h4 className="font-display text-xs font-bold text-ink uppercase tracking-wider">
                  Assento do Registo Civil Nacional
                </h4>
                <div className="space-y-1 text-ink-muted">
                  <p><span className="font-semibold text-ink">Filiação Paterna:</span> {cidadaoSelecionado.filiacaoPai}</p>
                  <p><span className="font-semibold text-ink">Filiação Materna:</span> {cidadaoSelecionado.filiacaoMae}</p>
                  <p><span className="font-semibold text-ink">Estado Civil:</span> {cidadaoSelecionado.estadoCivil}</p>
                  <p><span className="font-semibold text-ink">NIF Nacional:</span> {cidadaoSelecionado.nif}</p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modal Novo Cidadão */}
      {modalNovo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-base font-bold text-ink">
                Registo de Cidadão no Cadastro Único
              </h3>
              <button
                type="button"
                onClick={() => setModalNovo(false)}
                className="rounded p-1 text-ink-muted hover:bg-surface-strong"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCadastrar} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-ink">Nome Completo:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Domingos Manuel Pereira"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink">Data de Nascimento:</label>
                  <input
                    type="date"
                    required
                    value={dataNasc}
                    onChange={(e) => setDataNasc(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink">Sexo:</label>
                  <select
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value as "M" | "F")}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-emerald-600 focus:outline-hidden"
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink">Naturalidade:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Canchungo"
                    value={naturalidade}
                    onChange={(e) => setNaturalidade(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink">Região de Residência:</label>
                  <select
                    value={regiao}
                    onChange={(e) => setRegiao(e.target.value as CidadaoGW["regiao"])}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-emerald-600 focus:outline-hidden"
                  >
                    <option value="Bissau">Bissau</option>
                    <option value="Bafatá">Bafatá</option>
                    <option value="Gabú">Gabú</option>
                    <option value="Cacheu">Cacheu</option>
                    <option value="Biombo">Biombo</option>
                    <option value="Oio">Oio</option>
                    <option value="Quinara">Quinara</option>
                    <option value="Tombali">Tombali</option>
                    <option value="Bolama/Bijagós">Bolama/Bijagós</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink">Nome do Pai:</label>
                  <input
                    type="text"
                    placeholder="Nome do pai"
                    value={pai}
                    onChange={(e) => setPai(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink">Nome da Mãe:</label>
                  <input
                    type="text"
                    placeholder="Nome da mãe"
                    value={mae}
                    onChange={(e) => setMae(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setModalNovo(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Emitir Bilhete de Identidade
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
