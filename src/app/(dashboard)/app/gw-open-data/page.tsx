"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart2,
  BookOpen,
  CheckCircle2,
  Code2,
  Database,
  Download,
  FileSpreadsheet,
  Globe2,
  HeartPulse,
  Scale,
  Search,
  ShieldCheck,
  Ship,
  Sparkles,
  Trees,
} from "lucide-react";
import { useAnalytics } from "@/lib/analytics-store";
import { Badge } from "@/components/ui/badge";

export default function GwOpenDataPage() {
  const { state } = useAnalytics();
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const filteredDatasets = state.datasets.filter(
    (ds) =>
      ds.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ds.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ds.orgao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const triggerDownload = (datasetTitle: string, format: string) => {
    setDownloadSuccess(`Download iniciado: ${datasetTitle} (.${format.toLowerCase()})`);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Alert toast for simulated download */}
      {downloadSuccess && (
        <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border border-teal-500/30 bg-teal-950/90 px-4 py-3 text-sm text-teal-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="size-5 shrink-0 text-teal-400" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-950/40 via-surface to-surface-ground p-6 sm:p-10 shadow-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="brand" className="gap-1.5 py-1 px-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 font-semibold">
              <Globe2 className="size-3.5" /> Portal Nacional de Dados Abertos
            </Badge>
            <span className="text-xs text-ink-muted">Padrão Internacional DCAT-AP v2.0 • Guiné-Bissau</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-ink">
            Transparência Pública e Acesso Livre aos Dados do Estado
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-ink-muted">
            Acesso irrestrito e gratuito a bases de dados estruturadas da República da Guiné-Bissau.
            Acompanhe a execução orçamentária do OGE, indicadores de saúde, mobilidade nacional e meio ambiente.
          </p>

          {/* Quick Search */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-faint" />
              <input
                type="text"
                placeholder="Pesquisar datasets por ministério, categoria ou termo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-border-subtle bg-surface/90 py-2.5 pl-10 pr-4 text-sm text-ink placeholder-ink-faint focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-sm"
              />
            </div>
            <Link
              href="/app/gw-open-data/datasets"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-teal-700 transition"
            >
              <span>Ver Todo o Catálogo</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
            <Database className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">Datasets Públicos</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">{state.datasets.length}</p>
          <p className="text-[11px] text-ink-muted">Total de bases auditadas</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <BarChart2 className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">OGE Monitorado</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">98.0 Bi FCFA</p>
          <p className="text-[11px] text-ink-muted">Execução orçamentária 2026</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">Licença Aberta</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">CC-BY 4.0</p>
          <p className="text-[11px] text-ink-muted">Uso governamental e civil livre</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Code2 className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">Formatos Abertos</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">CSV, JSON, API</p>
          <p className="text-[11px] text-ink-muted">Pronto para cientistas de dados</p>
        </div>
      </section>

      {/* Featured Section: OGE 2026 Visual Breakdown */}
      <section className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
          <div>
            <h2 className="text-lg font-bold text-ink flex items-center gap-2">
              <FileSpreadsheet className="size-5 text-teal-600" />
              Execução do Orçamento Geral do Estado (OGE 2026)
            </h2>
            <p className="text-xs text-ink-muted mt-1">
              Dados consolidados pela Direção-Geral do Orçamento e Tesouro Público.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerDownload("OGE-2026-Execucao", "CSV")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-raised px-3 py-1.5 text-xs font-medium text-ink hover:border-teal-500 transition"
            >
              <Download className="size-3.5 text-teal-600" /> Baixar CSV
            </button>
            <button
              onClick={() => triggerDownload("OGE-2026-Execucao", "JSON")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-raised px-3 py-1.5 text-xs font-medium text-ink hover:border-teal-500 transition"
            >
              <Code2 className="size-3.5 text-blue-600" /> Baixar JSON
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { orgao: "Educação Nacional", orcado: "34.0 Bi FCFA", executado: "25.8 Bi FCFA", pct: 75.8, cor: "bg-blue-500" },
            { orgao: "Saúde Pública", orcado: "29.5 Bi FCFA", executado: "23.1 Bi FCFA", pct: 78.3, cor: "bg-emerald-500" },
            { orgao: "Obras Públicas e Transportes", orcado: "22.0 Bi FCFA", executado: "17.4 Bi FCFA", pct: 79.1, cor: "bg-amber-500" },
            { orgao: "Justiça e Direitos Humanos", orcado: "12.5 Bi FCFA", executado: "9.8 Bi FCFA", pct: 78.4, cor: "bg-purple-500" },
          ].map((item) => (
            <div key={item.orgao} className="rounded-xl border border-border-subtle bg-surface-ground p-4">
              <div className="flex justify-between items-center text-sm font-semibold text-ink">
                <span>{item.orgao}</span>
                <span className="text-xs font-mono text-teal-600 dark:text-teal-400">{item.pct}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-raised">
                <div className={`h-full rounded-full ${item.cor}`} style={{ width: `${item.pct}%` }} />
              </div>
              <div className="mt-2.5 flex justify-between text-xs text-ink-muted">
                <span>Executado: <strong className="text-ink">{item.executado}</strong></span>
                <span>Orçado: {item.orcado}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categorias Temáticas */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-ink">Explore por Área Temática</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { nome: "Economia", icon: BarChart2, color: "text-blue-500", bg: "bg-blue-500/10" },
            { nome: "Saúde", icon: HeartPulse, color: "text-rose-500", bg: "bg-rose-500/10" },
            { nome: "Educação", icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-500/10" },
            { nome: "Transportes", icon: Ship, color: "text-amber-500", bg: "bg-amber-500/10" },
            { nome: "Justiça", icon: Scale, color: "text-purple-500", bg: "bg-purple-500/10" },
            { nome: "Clima", icon: Trees, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          ].map((cat) => (
            <Link
              key={cat.nome}
              href={`/app/gw-open-data/datasets?cat=${encodeURIComponent(cat.nome)}`}
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-border-subtle bg-surface hover:border-teal-500 hover:shadow-sm transition text-center group"
            >
              <div className={`p-3 rounded-full ${cat.bg} mb-2 group-hover:scale-110 transition-transform`}>
                <cat.icon className={`size-5 ${cat.color}`} />
              </div>
              <span className="text-xs font-semibold text-ink">{cat.nome}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Datasets Catalog Preview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Datasets em Destaque</h2>
            <p className="text-xs text-ink-muted">Formatos abertos disponíveis para consulta e download direto.</p>
          </div>
          <Link
            href="/app/gw-open-data/datasets"
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 flex items-center gap-1"
          >
            Ver todos ({state.datasets.length}) <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredDatasets.map((ds) => (
            <div
              key={ds.id}
              className="flex flex-col justify-between rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm hover:border-teal-500/50 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge tone="neutral" className="text-[10px] font-semibold">
                    {ds.categoria}
                  </Badge>
                  <span className="text-[11px] font-mono text-ink-faint">{ds.tamanho}</span>
                </div>
                <h3 className="text-sm font-bold text-ink line-clamp-2">{ds.titulo}</h3>
                <p className="text-xs text-ink-muted line-clamp-3 leading-relaxed">{ds.descricao}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-border-subtle flex items-center justify-between">
                <span className="text-[11px] text-ink-faint">Atualizado: {ds.atualizadoEm}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => triggerDownload(ds.titulo, "CSV")}
                    className="p-1.5 rounded-lg border border-border-subtle bg-surface-raised hover:bg-teal-500/10 text-ink hover:text-teal-600 transition"
                    title="Baixar CSV"
                  >
                    <Download className="size-3.5" />
                  </button>
                  <Link
                    href={`/app/gw-open-data/datasets`}
                    className="p-1.5 rounded-lg border border-border-subtle bg-surface-raised hover:bg-teal-500/10 text-ink hover:text-teal-600 transition"
                    title="Ver Detalhes"
                  >
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Developer API Card */}
      <section className="rounded-2xl border border-teal-500/30 bg-teal-950/10 dark:bg-teal-950/30 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-teal-600" />
              <h3 className="text-sm font-bold text-ink">API Aberta para Desenvolvedores e Pesquisadores</h3>
            </div>
            <p className="text-xs text-ink-muted">
              Consuma os metadados dos datasets programaticamente via cURL ou qualquer linguagem de programação.
            </p>
          </div>
          <div className="rounded-xl border border-border-subtle bg-surface-ground px-4 py-2 font-mono text-xs text-teal-700 dark:text-teal-300">
            <code>GET /api/v1/open-data/datasets</code>
          </div>
        </div>
      </section>
    </div>
  );
}
