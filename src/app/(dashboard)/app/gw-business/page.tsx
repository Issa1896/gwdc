"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart2,
  Briefcase,
  CheckCircle2,
  DollarSign,
  Kanban,
  PieChart,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useSchoolBusiness, type OportunidadeVenda } from "@/lib/school-business-store";
import { Badge } from "@/components/ui/badge";

export default function BusinessDashboardPage() {
  const { state, criarOportunidade } = useSchoolBusiness();
  const [isNovaOpen, setIsNovaOpen] = useState(false);
  const [notificacao, setNotificacao] = useState<string | null>(null);

  // Form State
  const [titulo, setTitulo] = useState("");
  const [empresaCliente, setEmpresaCliente] = useState("");
  const [valorFCFA, setValorFCFA] = useState(5000000);
  const [responsavel, setResponsavel] = useState("Carlos Mendonça");

  const showNotification = (msg: string) => {
    setNotificacao(msg);
    setTimeout(() => setNotificacao(null), 3500);
  };

  const handleCriar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !empresaCliente) return;

    const nova = criarOportunidade({
      titulo,
      empresaCliente,
      valorFCFA,
      etapa: "lead",
      responsavel,
      probabilidade: 25,
      previsaoFechamento: "2026-11-30",
    });

    setIsNovaOpen(false);
    setTitulo("");
    setEmpresaCliente("");
    showNotification(`Oportunidade "${nova.titulo}" inserida no funil de vendas!`);
  };

  const totalPipeline = state.oportunidades.reduce((acc, o) => acc + o.valorFCFA, 0);
  const totalGanhos = state.oportunidades
    .filter((o) => o.etapa === "ganho")
    .reduce((acc, o) => acc + o.valorFCFA, 0);

  const getEtapaBadge = (etapa: OportunidadeVenda["etapa"]) => {
    switch (etapa) {
      case "lead":
        return <Badge tone="neutral">Novo Lead</Badge>;
      case "qualificacao":
        return <Badge tone="info">Qualificação</Badge>;
      case "proposta":
        return <Badge tone="brand">Proposta Enviada</Badge>;
      case "negociacao":
        return <Badge tone="warning">Negociação</Badge>;
      case "ganho":
        return <Badge tone="success">Fechado Ganho</Badge>;
      case "perdido":
        return <Badge tone="danger">Perdido</Badge>;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Alert */}
      {notificacao && (
        <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border border-purple-500/30 bg-purple-950/90 px-4 py-3 text-sm text-purple-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="size-5 shrink-0 text-purple-400" />
          <span>{notificacao}</span>
        </div>
      )}

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 via-surface to-surface-ground p-6 sm:p-10 shadow-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="brand" className="gap-1.5 py-1 px-3 bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30 font-semibold">
              <Briefcase className="size-3.5" /> CRM & Aceleração Comercial
            </Badge>
            <span className="text-xs text-ink-muted">Soluções Corporativas • República da Guiné-Bissau</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-ink">
            Gestão Comercial, Pipeline e Clientes 360°
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-ink-muted">
            Monitore oportunidades de negócio em FCFA, gerencie contratos empresariais com NIF guineense,
            emita propostas comerciais com cálculo automático de IGV (19%) e utilize IA para previsão de receitas.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsNovaOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-purple-700 transition"
            >
              <Plus className="size-4" />
              <span>Nova Oportunidade de Negócio</span>
            </button>
            <Link
              href="/app/gw-business/pipeline"
              className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-surface px-5 py-2.5 text-sm font-semibold text-ink hover:border-purple-500 hover:text-purple-600 transition"
            >
              <Kanban className="size-4 text-purple-500" />
              <span>Ver Funil Kanban</span>
            </Link>
            <Link
              href="/app/gw-business/clientes"
              className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-surface px-5 py-2.5 text-sm font-semibold text-ink hover:border-purple-500 hover:text-purple-600 transition"
            >
              <Users className="size-4 text-emerald-500" />
              <span>Carteira de Clientes & NIF</span>
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <DollarSign className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">Pipeline Total</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">
            {(totalPipeline / 1000000).toFixed(1)} Mi FCFA
          </p>
          <p className="text-[11px] text-ink-muted">{state.oportunidades.length} oportunidades ativas</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">Fechado Ganho</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">
            {(totalGanhos / 1000000).toFixed(1)} Mi FCFA
          </p>
          <p className="text-[11px] text-ink-muted">Contratos convertidos este mês</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Sparkles className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">Conversão de Vendas</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">+34%</p>
          <p className="text-[11px] text-ink-muted">Aumento pós-adoção do GW Business</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Users className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">Empresas Cadastradas</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">{state.clientes.length}</p>
          <p className="text-[11px] text-ink-muted">Com NIF e histórico fiscal auditado</p>
        </div>
      </section>

      {/* Main Grid: Opportunities Feed & Top Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Oportunidades Recentes */}
        <div className="lg:col-span-8 rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div>
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <BarChart2 className="size-4 text-purple-600" />
                Oportunidades em Andamento no Pipeline
              </h2>
              <p className="text-xs text-ink-muted">Negociações prioritárias da equipe de vendas corporativas.</p>
            </div>
            <Link
              href="/app/gw-business/pipeline"
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              Abrir Kanban <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border-subtle space-y-3">
            {state.oportunidades.map((op) => (
              <div key={op.id} className="pt-3 first:pt-0 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink">{op.empresaCliente}</span>
                    {getEtapaBadge(op.etapa)}
                  </div>
                  <h3 className="text-sm font-semibold text-ink">{op.titulo}</h3>
                  <p className="text-[11px] text-ink-muted">
                    Responsável: <strong className="text-ink">{op.responsavel}</strong> • Previsão: {op.previsaoFechamento}
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-mono text-sm font-bold text-purple-600 dark:text-purple-400">
                    {op.valorFCFA.toLocaleString("pt-GW")} FCFA
                  </div>
                  <div className="text-[11px] text-ink-faint">
                    Probabilidade: <strong className="text-emerald-600">{op.probabilidade}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Principais Contas Empresariais */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <Users className="size-4 text-purple-600" />
                Carteira de Clientes Nacionais
              </h3>
              <Link href="/app/gw-business/clientes" className="text-xs text-purple-600 font-semibold hover:underline">
                Ver todos
              </Link>
            </div>

            <div className="space-y-2.5">
              {state.clientes.map((cli) => (
                <div key={cli.id} className="rounded-xl border border-border-subtle bg-surface-ground p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink">{cli.nomeEmpresa}</span>
                    <Badge tone="neutral" className="text-[9px]">{cli.cidade}</Badge>
                  </div>
                  <p className="text-[11px] text-ink-faint font-mono">{cli.nif}</p>
                  <p className="text-[11px] text-ink-muted">{cli.setor}</p>
                  <div className="pt-1 text-[11px] text-ink-muted flex justify-between">
                    <span>Faturamento Estimado:</span>
                    <strong className="text-ink font-mono">{(cli.volumeAnualFCFA / 1000000).toFixed(0)}M FCFA</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 text-xs space-y-2">
            <h4 className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
              <PieChart className="size-3.5" /> Integração com GW ERP & POS
            </h4>
            <p className="text-ink-muted leading-relaxed text-[11px]">
              Toda oportunidade ganha gera automaticamente um pedido de venda no **GW ERP** e libera emissão fiscal no **GW POS** com incidência regulamentar de IGV (19%).
            </p>
          </div>
        </div>
      </div>

      {/* Modal: Nova Oportunidade */}
      {isNovaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border-subtle bg-surface p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                <Briefcase className="size-5 text-purple-600" />
                Criar Oportunidade no Funil de Vendas
              </h3>
              <button
                onClick={() => setIsNovaOpen(false)}
                className="rounded-lg p-1 text-ink-faint hover:bg-surface-raised hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCriar} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink">Título da Proposta Comercial</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fornecimento de Software para Armazéns de Bafatá"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Empresa Cliente / Contratante</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: AgroExport Guiné Lda."
                  value={empresaCliente}
                  onChange={(e) => setEmpresaCliente(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink">Valor Estimado (FCFA)</label>
                  <input
                    type="number"
                    min={100000}
                    step={50000}
                    required
                    value={valorFCFA}
                    onChange={(e) => setValorFCFA(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs font-mono text-ink focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink">Responsável Comercial</label>
                  <select
                    value={responsavel}
                    onChange={(e) => setResponsavel(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Carlos Mendonça">Carlos Mendonça</option>
                    <option value="Aminata Seidi">Aminata Seidi</option>
                    <option value="Domingos Vieira">Domingos Vieira</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsNovaOpen(false)}
                  className="rounded-xl border border-border-subtle px-4 py-2 text-xs font-medium text-ink hover:bg-surface-raised transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-purple-700 transition"
                >
                  Adicionar ao Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
