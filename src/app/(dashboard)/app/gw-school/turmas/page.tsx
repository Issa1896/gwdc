"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Edit2,
  Filter,
  Save,
  Search,
  Users,
  X,
} from "lucide-react";
import { useSchoolBusiness, type AlunoEscola } from "@/lib/school-business-store";
import { Badge } from "@/components/ui/badge";

export default function TurmasPage() {
  const { state, atualizarNotaFrequencia } = useSchoolBusiness();
  const [searchTerm, setSearchTerm] = useState("");
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>("Todas");
  const [editingAluno, setEditingAluno] = useState<AlunoEscola | null>(null);
  const [notaInput, setNotaInput] = useState<number>(14);
  const [frequenciaInput, setFrequenciaInput] = useState<number>(90);
  const [notificacao, setNotificacao] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotificacao(msg);
    setTimeout(() => setNotificacao(null), 3000);
  };

  const filteredAlunos = state.alunos.filter((a) => {
    const matchesSearch =
      a.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.responsavelNome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTurma = turmaSelecionada === "Todas" || a.turma === turmaSelecionada;
    return matchesSearch && matchesTurma;
  });

  const turmasDisponiveis = ["Todas", ...Array.from(new Set(state.alunos.map((a) => a.turma)))];

  const handleSalvarNotaFrequencia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAluno) return;
    atualizarNotaFrequencia(editingAluno.id, notaInput, frequenciaInput);
    setEditingAluno(null);
    showNotification(`Caderneta de ${editingAluno.nomeCompleto} atualizada.`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Alert */}
      {notificacao && (
        <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border border-indigo-500/30 bg-indigo-950/90 px-4 py-3 text-sm text-indigo-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="size-5 shrink-0 text-indigo-400" />
          <span>{notificacao}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Link href="/app/gw-school" className="hover:underline flex items-center gap-1">
            <ArrowLeft className="size-3.5" /> Painel da Escola
          </Link>
        </div>
        <h1 className="mt-1 text-2xl font-extrabold text-ink flex items-center gap-2">
          <Users className="size-6 text-indigo-600" />
          Turmas & Caderneta Digital de Avaliação
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          Acompanhamento de frequência diária, faltas justificadas e notas bimestrais da 1ª à 6ª classe.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-faint" />
          <input
            type="text"
            placeholder="Buscar por nome do aluno, matrícula ou encarregado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-border-subtle bg-surface py-2 pl-10 pr-4 text-xs text-ink placeholder-ink-faint focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <Filter className="size-3.5 text-ink-faint shrink-0 ml-1" />
          {turmasDisponiveis.map((t) => (
            <button
              key={t}
              onClick={() => setTurmaSelecionada(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                turmaSelecionada === t
                  ? "bg-indigo-600 text-white font-semibold shadow-sm"
                  : "bg-surface border border-border-subtle text-ink-muted hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Caderneta Table */}
      <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <h2 className="text-base font-bold text-ink">
            Livro de Registro de Classe ({filteredAlunos.length} Alunos)
          </h2>
          <Badge tone="brand" className="text-[10px]">Escala Oficial: 0 a 20 Valores</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border-subtle bg-surface-raised text-ink-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Matrícula</th>
                <th className="px-4 py-3 font-semibold">Nome Completo</th>
                <th className="px-4 py-3 font-semibold">Turma</th>
                <th className="px-4 py-3 font-semibold">Assiduidade</th>
                <th className="px-4 py-3 font-semibold">Nota Média</th>
                <th className="px-4 py-3 font-semibold">Encarregado de Educação</th>
                <th className="px-4 py-3 font-semibold text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-surface">
              {filteredAlunos.map((aluno) => (
                <tr key={aluno.id} className="hover:bg-surface-raised/60 transition">
                  <td className="px-4 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {aluno.matricula}
                  </td>
                  <td className="px-4 py-3 font-bold text-ink">{aluno.nomeCompleto}</td>
                  <td className="px-4 py-3">
                    <Badge tone="neutral" className="text-[10px]">
                      {aluno.turma}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-semibold ${
                        aluno.frequenciaPercentual >= 90
                          ? "text-emerald-600 dark:text-emerald-400"
                          : aluno.frequenciaPercentual >= 80
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}
                    >
                      {aluno.frequenciaPercentual}%
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-ink">
                    {aluno.notaMedia.toFixed(1)} / 20
                  </td>
                  <td className="px-4 py-3 text-ink-muted text-[11px]">
                    {aluno.responsavelNome} ({aluno.responsavelTelefone})
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        setEditingAluno(aluno);
                        setNotaInput(aluno.notaMedia);
                        setFrequenciaInput(aluno.frequenciaPercentual);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-raised px-2.5 py-1 text-xs font-semibold text-ink hover:border-indigo-500 hover:text-indigo-600 transition"
                    >
                      <Edit2 className="size-3" />
                      Lançar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Lançamento de Notas e Frequência */}
      {editingAluno && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                <Award className="size-5 text-indigo-600" />
                Lançar Notas & Frequência
              </h3>
              <button
                onClick={() => setEditingAluno(null)}
                className="rounded-lg p-1 text-ink-faint hover:bg-surface-raised hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarNotaFrequencia} className="mt-4 space-y-4">
              <div>
                <span className="text-[10px] uppercase text-ink-faint font-semibold">Aluno</span>
                <p className="text-sm font-bold text-ink">{editingAluno.nomeCompleto}</p>
                <p className="text-xs text-ink-muted">{editingAluno.turma} • {editingAluno.matricula}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">
                  Nota Média Bimestral (0 a 20)
                </label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  step={0.1}
                  required
                  value={notaInput}
                  onChange={(e) => setNotaInput(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs font-mono text-ink focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">
                  Assiduidade / Frequência Percentual (0% a 100%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={frequenciaInput}
                  onChange={(e) => setFrequenciaInput(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs font-mono text-ink focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setEditingAluno(null)}
                  className="rounded-xl border border-border-subtle px-4 py-2 text-xs font-medium text-ink hover:bg-surface-raised transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition"
                >
                  <Save className="size-3.5" /> Salvar Caderneta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
