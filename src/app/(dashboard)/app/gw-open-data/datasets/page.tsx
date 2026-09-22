"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  Copy,
  Database,
  Download,
  Eye,
  FileSpreadsheet,
  Filter,
  Plus,
  Search,
  Table as TableIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { useAnalytics, type DatasetAberto } from "@/lib/analytics-store";
import { Badge } from "@/components/ui/badge";

const CATEGORIAS = [
  "Todas",
  "Economia",
  "Educação",
  "Saúde",
  "Transportes",
  "Meio Ambiente",
  "Justiça",
] as const;

export default function DatasetsCatalogPage() {
  const { state, publicarDataset } = useAnalytics();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [activeDataset, setActiveDataset] = useState<DatasetAberto | null>(state.datasets[0] ?? null);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State for publishing a new dataset
  const [titulo, setTitulo] = useState("");
  const [orgao, setOrgao] = useState("");
  const [categoria, setCategoria] = useState<DatasetAberto["categoria"]>("Economia");
  const [descricao, setDescricao] = useState("");
  const [linhas, setLinhas] = useState(100);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredDatasets = state.datasets.filter((ds) => {
    const matchesSearch =
      ds.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ds.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ds.orgao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "Todas" || ds.categoria === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !orgao || !descricao) return;

    const slug = titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const novo = publicarDataset({
      slug,
      titulo,
      orgao,
      categoria,
      formatos: ["CSV", "JSON", "API"],
      descricao,
      tamanho: "1.0 MB",
      linhas,
      dadosAmostra: [
        { registro: 1, indicador: "Amostra preliminar", valor: 100, status: "Válido" },
        { registro: 2, indicador: "Registro complementar", valor: 250, status: "Auditado" },
      ],
    });

    setActiveDataset(novo);
    setIsPublishOpen(false);
    setTitulo("");
    setOrgao("");
    setDescricao("");
    showNotification("Novo dataset publicado com sucesso no catálogo DCAT!");
  };

  const downloadFile = (ds: DatasetAberto, format: "CSV" | "JSON") => {
    let content = "";
    let mimeType = "";
    let ext = "";

    if (format === "JSON") {
      content = JSON.stringify(ds.dadosAmostra, null, 2);
      mimeType = "application/json";
      ext = "json";
    } else {
      if (ds.dadosAmostra.length > 0) {
        const headers = Object.keys(ds.dadosAmostra[0]);
        const rows = ds.dadosAmostra.map((row) =>
          headers.map((field) => JSON.stringify(row[field] ?? "")).join(",")
        );
        content = [headers.join(","), ...rows].join("\n");
      }
      mimeType = "text/csv";
      ext = "csv";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${ds.slug}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification(`Download de ${ds.slug}.${ext} concluído.`);
  };

  const copyApiUrl = (ds: DatasetAberto) => {
    const url = `${window.location.origin}/api/v1/open-data/datasets?q=${encodeURIComponent(ds.slug)}`;
    navigator.clipboard.writeText(url);
    showNotification("URL da API copiada para a área de transferência!");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border border-teal-500/30 bg-teal-950/90 px-4 py-3 text-sm text-teal-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="size-5 shrink-0 text-teal-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
            <Link href="/app/gw-open-data" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="size-3.5" /> Portal da Transparência
            </Link>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-ink flex items-center gap-2">
            <Database className="size-6 text-teal-600" />
            Catálogo de Datasets Governamentais (DCAT-AP)
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Explore, filtre, visualize tabelas e baixe conjuntos de dados em formatos padronizados abertos.
          </p>
        </div>

        <button
          onClick={() => setIsPublishOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-teal-700 transition"
        >
          <Plus className="size-4" /> Publicar Novo Dataset
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-faint" />
          <input
            type="text"
            placeholder="Filtrar por nome, órgão ou palavra-chave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-border-subtle bg-surface py-2 pl-10 pr-4 text-xs text-ink placeholder-ink-faint focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <Filter className="size-3.5 text-ink-faint shrink-0 ml-1" />
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? "bg-teal-600 text-white font-semibold shadow-sm"
                  : "bg-surface border border-border-subtle text-ink-muted hover:text-ink hover:bg-surface-raised"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout: List on Left, Preview Table on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Datasets Cards */}
        <div className="lg:col-span-5 space-y-3">
          <p className="text-xs font-semibold text-ink-faint uppercase tracking-wider">
            {filteredDatasets.length} {filteredDatasets.length === 1 ? "Dataset Encontrado" : "Datasets Encontrados"}
          </p>

          {filteredDatasets.length === 0 ? (
            <div className="rounded-2xl border border-border-subtle bg-surface p-8 text-center text-xs text-ink-muted">
              Nenhum dataset encontrado com esses filtros.
            </div>
          ) : (
            filteredDatasets.map((ds) => {
              const isSelected = activeDataset?.id === ds.id;
              return (
                <div
                  key={ds.id}
                  onClick={() => setActiveDataset(ds)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? "border-teal-500 bg-teal-500/5 dark:bg-teal-500/10 shadow-sm ring-1 ring-teal-500"
                      : "border-border-subtle bg-surface hover:border-teal-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone="neutral" className="text-[10px] font-semibold">
                      {ds.categoria}
                    </Badge>
                    <span className="text-[11px] font-mono text-ink-faint">{ds.tamanho}</span>
                  </div>

                  <h3 className="mt-2 text-sm font-bold text-ink line-clamp-2">{ds.titulo}</h3>
                  <p className="mt-1 text-xs text-ink-muted line-clamp-2">{ds.descricao}</p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-border-subtle/60 text-[11px] text-ink-faint">
                    <span>{ds.orgao}</span>
                    <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium">
                      <Eye className="size-3.5" /> Explorar
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Dataset Details & Table Viewer */}
        <div className="lg:col-span-7">
          {activeDataset ? (
            <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm space-y-6">
              {/* Dataset Header */}
              <div className="space-y-2 border-b border-border-subtle pb-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge tone="brand" className="text-[10px] font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300">
                    {activeDataset.categoria}
                  </Badge>
                  <span className="text-xs text-ink-faint">Atualizado em {activeDataset.atualizadoEm}</span>
                </div>
                <h2 className="text-lg font-bold text-ink">{activeDataset.titulo}</h2>
                <p className="text-xs text-ink-muted leading-relaxed">{activeDataset.descricao}</p>
                <div className="flex flex-wrap gap-4 text-xs text-ink-muted pt-2">
                  <span>
                    Órgão: <strong className="text-ink">{activeDataset.orgao}</strong>
                  </span>
                  <span>
                    Licença: <strong className="text-ink">CC-BY 4.0</strong>
                  </span>
                  <span>
                    Registros: <strong className="text-ink">{activeDataset.linhas} linhas</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons: Downloads and API */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => downloadFile(activeDataset, "CSV")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-teal-700 transition"
                >
                  <Download className="size-3.5" /> Baixar CSV ({activeDataset.tamanho})
                </button>
                <button
                  onClick={() => downloadFile(activeDataset, "JSON")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border-subtle bg-surface-raised px-3.5 py-2 text-xs font-semibold text-ink hover:border-teal-500 transition"
                >
                  <Code2 className="size-3.5 text-blue-500" /> Baixar JSON
                </button>
                <button
                  onClick={() => copyApiUrl(activeDataset)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border-subtle bg-surface-raised px-3.5 py-2 text-xs font-semibold text-ink hover:border-teal-500 transition"
                >
                  <Copy className="size-3.5 text-teal-600" /> Copiar Link API
                </button>
              </div>

              {/* Data Table Viewer */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <TableIcon className="size-3.5 text-teal-600" /> Amostra de Dados Estruturados
                  </h3>
                  <span className="text-[11px] text-ink-faint">
                    Exibindo primeiras {activeDataset.dadosAmostra.length} linhas
                  </span>
                </div>

                {activeDataset.dadosAmostra.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-border-subtle">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-border-subtle bg-surface-raised text-ink-muted">
                        <tr>
                          {Object.keys(activeDataset.dadosAmostra[0]).map((header) => (
                            <th key={header} className="px-3.5 py-2.5 font-semibold capitalize">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle bg-surface">
                        {activeDataset.dadosAmostra.map((row, idx) => (
                          <tr key={idx} className="hover:bg-surface-raised/60 transition">
                            {Object.values(row).map((val, cellIdx) => (
                              <td key={cellIdx} className="px-3.5 py-2 text-ink font-mono text-[11px]">
                                {typeof val === "number" ? val.toLocaleString("pt-GW") : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border-subtle p-6 text-center text-xs text-ink-muted">
                    Nenhuma linha de amostra cadastrada para este dataset.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border-subtle bg-surface p-12 text-center text-xs text-ink-muted">
              Selecione um dataset à esquerda para visualizar metadados e prévia dos dados.
            </div>
          )}
        </div>
      </div>

      {/* Publish Modal */}
      {isPublishOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border-subtle bg-surface p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                <FileSpreadsheet className="size-5 text-teal-600" />
                Publicar Dataset no Padrão DCAT
              </h3>
              <button
                onClick={() => setIsPublishOpen(false)}
                className="rounded-lg p-1 text-ink-faint hover:bg-surface-raised hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink">Título do Dataset</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Censo Agropecuário de Oio e Bafatá"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink">Órgão Emissor</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ministério da Agricultura"
                    value={orgao}
                    onChange={(e) => setOrgao(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink">Categoria Temática</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as DatasetAberto["categoria"])}
                    className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Economia">Economia</option>
                    <option value="Educação">Educação</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Transportes">Transportes</option>
                    <option value="Meio Ambiente">Meio Ambiente</option>
                    <option value="Justiça">Justiça</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Descrição & Finalidade Pública</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Descreva o conteúdo dos dados e metodologia de coleta..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Estimativa de Registros / Linhas</label>
                <input
                  type="number"
                  min={1}
                  value={linhas}
                  onChange={(e) => setLinhas(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsPublishOpen(false)}
                  className="rounded-xl border border-border-subtle px-4 py-2 text-xs font-medium text-ink hover:bg-surface-raised transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-teal-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-teal-700 transition"
                >
                  Publicar no Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
