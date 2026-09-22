"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Apple,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  MessageSquare,
  Plus,
  School,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useSchoolBusiness } from "@/lib/school-business-store";
import { Badge } from "@/components/ui/badge";

export default function SchoolDashboardPage() {
  const { state, matricularAluno } = useSchoolBusiness();
  const [isMatriculaOpen, setIsMatriculaOpen] = useState(false);
  const [notificacao, setNotificacao] = useState<string | null>(null);

  // Form State
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [turma, setTurma] = useState("3º Ano A");
  const [idade, setIdade] = useState(8);
  const [genero, setGenero] = useState<"M" | "F">("F");
  const [responsavelNome, setResponsavelNome] = useState("");
  const [responsavelTelefone, setResponsavelTelefone] = useState("+245 ");

  const showNotification = (msg: string) => {
    setNotificacao(msg);
    setTimeout(() => setNotificacao(null), 3500);
  };

  const handleMatricular = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeCompleto || !responsavelNome) return;

    const novo = matricularAluno({
      nomeCompleto,
      turma,
      idade,
      genero,
      responsavelNome,
      responsavelTelefone: responsavelTelefone || "+245 955 000 000",
      frequenciaPercentual: 100,
      notaMedia: 14.0,
      recebeMerenda: true,
    });

    setIsMatriculaOpen(false);
    setNomeCompleto("");
    setResponsavelNome("");
    showNotification(`Aluno(a) ${novo.nomeCompleto} matriculado(a) com sucesso (${novo.matricula})!`);
  };

  const mediaPresenca = Math.round(
    state.alunos.reduce((acc, a) => acc + a.frequenciaPercentual, 0) / (state.alunos.length || 1)
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Alert */}
      {notificacao && (
        <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border border-indigo-500/30 bg-indigo-950/90 px-4 py-3 text-sm text-indigo-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="size-5 shrink-0 text-indigo-400" />
          <span>{notificacao}</span>
        </div>
      )}

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-surface to-surface-ground p-6 sm:p-10 shadow-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="brand" className="gap-1.5 py-1 px-3 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 font-semibold">
              <School className="size-3.5" /> Educação Básica Soberana
            </Badge>
            <span className="text-xs text-ink-muted">Ministério da Educação Nacional • Guiné-Bissau</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-ink">
            Gestão Escolar, Alimentação e Acompanhamento Infantil
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-ink-muted">
            Registro civil de matrículas, caderneta eletrônica com controle de frequência diária,
            gestão nutricional da merenda escolar (PNAE/PAM) e comunicação direta com as famílias em Crioulo Guineense.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsMatriculaOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition"
            >
              <Plus className="size-4" />
              <span>Matricular Nova Criança</span>
            </button>
            <Link
              href="/app/gw-school/turmas"
              className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-surface px-5 py-2.5 text-sm font-semibold text-ink hover:border-indigo-500 hover:text-indigo-600 transition"
            >
              <Users className="size-4 text-indigo-500" />
              <span>Acessar Caderneta de Turmas</span>
            </Link>
            <Link
              href="/app/gw-school/merenda"
              className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-surface px-5 py-2.5 text-sm font-semibold text-ink hover:border-indigo-500 hover:text-indigo-600 transition"
            >
              <Apple className="size-4 text-emerald-500" />
              <span>Estoque de Merenda Escolar</span>
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Stats */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Users className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">Alunos Registrados</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">{state.alunos.length} Alunos</p>
          <p className="text-[11px] text-ink-muted">Nesta unidade escolar piloto</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">Assiduidade Média</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">{mediaPresenca}%</p>
          <p className="text-[11px] text-ink-muted">Presença monitorada diariamente</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Apple className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">Merenda Escolar</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">100% Cobertura</p>
          <p className="text-[11px] text-ink-muted">Refeição quente diária garantida</p>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Award className="size-4" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-faint">Média de Aproveitamento</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">15.6 / 20</p>
          <p className="text-[11px] text-ink-muted">Avaliação pedagógica bimestral</p>
        </div>
      </section>

      {/* Main Grid: Classes Preview and Merenda Quick Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Alunos e Turmas */}
        <div className="lg:col-span-7 rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div>
              <h2 className="text-base font-bold text-ink flex items-center gap-2">
                <BookOpen className="size-4 text-indigo-600" />
                Alunos em Destaque no Ensino Básico
              </h2>
              <p className="text-xs text-ink-muted">Acompanhamento contínuo contra a evasão escolar.</p>
            </div>
            <Link
              href="/app/gw-school/turmas"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border-subtle space-y-3">
            {state.alunos.map((aluno) => (
              <div key={aluno.id} className="pt-3 first:pt-0 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {aluno.matricula}
                    </span>
                    <Badge tone="neutral" className="text-[10px]">
                      {aluno.turma}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold text-ink">{aluno.nomeCompleto}</h3>
                  <p className="text-[11px] text-ink-muted">
                    Responsável: <strong className="text-ink">{aluno.responsavelNome}</strong> ({aluno.responsavelTelefone})
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {aluno.frequenciaPercentual}% Presença
                  </div>
                  <div className="text-xs text-ink-muted">
                    Nota: <strong className="text-ink">{aluno.notaMedia} / 20</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Merenda Escolar & Comunicados em Crioulo */}
        <div className="lg:col-span-5 space-y-6">
          {/* Merenda Escolar Widget */}
          <div className="rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                <Apple className="size-4 text-emerald-600" />
                Estoque da Merenda (Alimentação)
              </h3>
              <Link href="/app/gw-school/merenda" className="text-xs text-indigo-600 font-semibold hover:underline">
                Gerenciar
              </Link>
            </div>

            <div className="space-y-2">
              {state.itensMerenda.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-xl border border-border-subtle bg-surface-ground p-3 text-xs flex justify-between items-center">
                  <div>
                    <p className="font-bold text-ink">{item.alimento}</p>
                    <span className="text-[10px] text-ink-faint">Origem: {item.origem}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {item.quantidadeEstoque} {item.unidade}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-medium">~{item.diasRestantes} dias</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comunicados Escolares Bilíngues */}
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="size-3.5" /> Avisos para as Famílias (SMS em Crioulo)
            </h3>

            {state.comunicados.map((com) => (
              <div key={com.id} className="rounded-xl border border-border-subtle bg-surface p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[11px] text-ink-faint">
                  <span className="font-bold text-ink">{com.titulo}</span>
                  <span>{com.data}</span>
                </div>
                <p className="text-ink-muted text-[11px]">{com.textoPt}</p>
                <div className="rounded-lg bg-surface-raised p-2 text-[11px] font-medium text-indigo-700 dark:text-indigo-300 italic">
                  &quot;{com.textoCrioulo}&quot;
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Matricular Aluno */}
      {isMatriculaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border-subtle bg-surface p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-base font-bold text-ink flex items-center gap-2">
                <GraduationCap className="size-5 text-indigo-600" />
                Matrícula no Ensino Básico Nacional
              </h3>
              <button
                onClick={() => setIsMatriculaOpen(false)}
                className="rounded-lg p-1 text-ink-faint hover:bg-surface-raised hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleMatricular} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink">Nome Completo da Criança</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Malam Sambú de Oliveira"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink">Turma</label>
                  <select
                    value={turma}
                    onChange={(e) => setTurma(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="1º Ano A">1º Ano A</option>
                    <option value="2º Ano A">2º Ano A</option>
                    <option value="3º Ano A">3º Ano A</option>
                    <option value="4º Ano B">4º Ano B</option>
                    <option value="5º Ano B">5º Ano B</option>
                    <option value="6º Ano A">6º Ano A</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink">Idade</label>
                  <input
                    type="number"
                    min={5}
                    max={16}
                    value={idade}
                    onChange={(e) => setIdade(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink">Gênero</label>
                  <select
                    value={genero}
                    onChange={(e) => setGenero(e.target.value as "M" | "F")}
                    className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="F">Feminino</option>
                    <option value="M">Masculino</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Nome do Responsável / Encarregado</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Aminata Baldé Sambú"
                  value={responsavelNome}
                  onChange={(e) => setResponsavelNome(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Telefone para Notificações por SMS</label>
                <input
                  type="text"
                  placeholder="+245 955 000 000"
                  value={responsavelTelefone}
                  onChange={(e) => setResponsavelTelefone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-ground px-3.5 py-2 text-xs text-ink focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setIsMatriculaOpen(false)}
                  className="rounded-xl border border-border-subtle px-4 py-2 text-xs font-medium text-ink hover:bg-surface-raised transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition"
                >
                  Concluir Matrícula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
