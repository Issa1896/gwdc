"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  School,
  User,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/progress";
import { Tabs } from "@/components/ui/tabs";
import { BackLink, ProgressBar } from "@/components/education/widgets";
import { EduTable } from "@/components/education/widgets";
import { badge as cellBadge, currency, date, number, percent, text, type Cell } from "@/data/education/types";
import {
  CURSO_BY_ID,
  STATUS_ALUNO_LABEL,
  STATUS_PAGAMENTO_LABEL,
  situacaoLabel,
} from "@/data/education";
import { useEducation } from "@/lib/education-store";

/** MÓDULO 6 — Ficha individual do aluno (perfil, boletim, frequência e financeiro). */
export default function AlunoDetalhePage() {
  const params = useParams<{ id: string }>();
  const { state, alunoPorId, getNotas, getChamadas } = useEducation();
  const aluno = alunoPorId(params.id);

  if (!aluno) {
    return (
      <main className="grid min-h-[60vh] place-items-center px-4">
        <div className="text-center">
          <p className="font-display text-6xl font-bold text-brand-500">404</p>
          <h1 className="mt-3 font-display text-xl font-bold text-ink">Aluno não encontrado</h1>
          <p className="mt-2 text-sm text-ink-muted">O processo solicitado não existe no cadastro nacional.</p>
          <Link href="/app/gw-education/alunos" className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary">
            <ArrowLeft className="size-4" /> Voltar aos alunos
          </Link>
        </div>
      </main>
    );
  }

  const curso = CURSO_BY_ID.get(aluno.cursoId);
  const st = STATUS_ALUNO_LABEL[aluno.status];
  const notas = getNotas(aluno.id, aluno.cursoId);
  const comMedia = notas.filter((n) => n.media !== null);
  const mediaGeral = comMedia.length ? Math.round((comMedia.reduce((acc, n) => acc + n.media!, 0) / comMedia.length) * 10) / 10 : 0;
  const chamadas = getChamadas(aluno.id);
  const freqPct = Math.round((chamadas.filter((c) => c.presenca).length / chamadas.length) * 100);
  const faturas = state.faturas.filter((f) => f.estudanteId === aluno.id);
  const turma = state.turmas.find((t) => t.estudantes.includes(aluno.id));

  const boletimRows: Cell[][] = notas.map((n) => [
    text(n.disciplina),
    number(n.av1 ?? 0),
    number(n.av2 ?? 0),
    n.provaFinal !== null ? number(n.provaFinal) : text("—"),
    n.media !== null ? number(n.media) : text("—"),
    percent(n.frequencia),
    cellBadge(situacaoLabel(n.situacao).label, situacaoLabel(n.situacao).tone),
  ]);

  const financeiroRows: Cell[][] = faturas.map((f) => {
    const stP = STATUS_PAGAMENTO_LABEL[f.status];
    return [
      text(f.referencia),
      text(f.descricao),
      date(f.vencimento),
      currency(f.valor),
      currency(f.pago),
      f.pago >= f.valor ? currency(f.valor) : currency(f.valor - f.pago),
      cellBadge(stP.label, stP.tone),
    ];
  });

  return (
    <div className="space-y-6">
      <BackLink href="/app/gw-education/alunos" label="Voltar aos alunos" />

      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-5">
          <Avatar name={aluno.nome} className="size-16 text-xl" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-ink">{aluno.nome}</h1>
              <Badge tone={st.tone}>{st.label}</Badge>
              <Badge tone="neutral">Processo {aluno.id}</Badge>
            </div>
            <p className="mt-1 text-sm text-ink-muted">
              {curso?.nome} · {curso?.faculdade} · Ingresso em {aluno.anoIngresso}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-faint">
              <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" /> {aluno.regiao}</span>
              <span className="inline-flex items-center gap-1.5"><Mail className="size-3.5" /> {aluno.email}</span>
              <span className="inline-flex items-center gap-1.5"><Phone className="size-3.5" /> {aluno.telefone}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-border px-4 py-3">
              <p className="font-display text-xl font-bold text-ink">{mediaGeral.toFixed(1)}</p>
              <p className="text-[11px] text-ink-faint">Média geral</p>
            </div>
            <div className="rounded-xl border border-border px-4 py-3">
              <p className="font-display text-xl font-bold text-ink">{freqPct}%</p>
              <p className="text-[11px] text-ink-faint">Frequência</p>
            </div>
            <div className="rounded-xl border border-border px-4 py-3">
              <p className="font-display text-xl font-bold text-ink">{notas.length}</p>
              <p className="text-[11px] text-ink-faint">Disciplinas</p>
            </div>
          </div>
        </div>
      </Card>

      <Tabs
        defaultValue="overview"
        items={[
          { label: "Visão geral", value: "overview", icon: <User className="size-4" /> },
          { label: "Boletim", value: "boletim", icon: <BookOpen className="size-4" /> },
          { label: "Frequência", value: "frequencia", icon: <CalendarDays className="size-4" /> },
          { label: "Financeiro", value: "financeiro", icon: <Wallet className="size-4" /> },
        ]}
      >
        {(active) => (
          <div className="space-y-4 pt-4">
            {active === "overview" && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm"><User className="size-4 text-brand-500" /> Dados pessoais</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <p className="text-ink-muted">Nome</p><p className="font-medium text-ink">{aluno.nome}</p>
                      <p className="text-ink-muted">N.º processo</p><p className="font-medium text-ink">{aluno.id}</p>
                      <p className="text-ink-muted">Data de nascimento</p><p className="font-medium text-ink">{aluno.nascimento}</p>
                      <p className="text-ink-muted">Região de origem</p><p className="font-medium text-ink">{aluno.regiao}</p>
                      <p className="text-ink-muted">Contacto</p><p className="font-medium text-ink">{aluno.telefone}</p>
                      <p className="text-ink-muted">E-mail</p><p className="truncate font-medium text-ink">{aluno.email}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm"><School className="size-4 text-navy-500" /> Percurso acadêmico</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      <p className="text-ink-muted">Curso</p><p className="font-medium text-ink">{curso?.nome}</p>
                      <p className="text-ink-muted">Grau</p><p className="font-medium text-ink">{curso?.grau}</p>
                      <p className="text-ink-muted">Faculdade</p><p className="font-medium text-ink">{curso?.faculdade}</p>
                      <p className="text-ink-muted">Ano de ingresso</p><p className="font-medium text-ink">{aluno.anoIngresso}</p>
                      <p className="text-ink-muted">Turma atual</p><p className="font-medium text-ink">{turma ? `${turma.nome} · ${turma.turno}` : "—"}</p>
                      <p className="text-ink-muted">Horário</p><p className="font-medium text-ink">{turma?.horario ?? "—"}</p>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm"><GraduationCap className="size-4 text-gold-500" /> Desempenho por disciplina</CardTitle>
                    <CardDescription>Médias das avaliações realizadas até o semestre 1/2026.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {notas.map((n) => (
                      <div key={n.disciplinaId}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-medium text-ink">{n.disciplina}</span>
                          <span className="flex items-center gap-2">
                            <span className="tabular-nums text-ink-muted">{n.media !== null ? n.media.toFixed(1) : "Em curso"}</span>
                            <Badge tone={situacaoLabel(n.situacao).tone}>{situacaoLabel(n.situacao).label}</Badge>
                          </span>
                        </div>
                        <ProgressBar value={n.media !== null ? (n.media / 20) * 100 : 0} tone={n.situacao === "aprovado" ? "success" : n.situacao === "em_curso" ? "info" : "danger"} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </>
            )}

            {active === "boletim" && (
              <EduTable
                columns={["Disciplina", "1ª AV", "2ª AV", "Prova final", "Média", "Frequência", "Situação"]}
                rows={boletimRows}
              />
            )}

            {active === "frequencia" && (
              <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-sm">Registro de chamada — últimos 10 dias letivos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {chamadas.map((c) => (
                      <div key={c.dia} className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
                        <span className="text-sm text-ink">{new Date(c.dia).toLocaleDateString("pt-PT", { weekday: "long", day: "2-digit", month: "short" })}</span>
                        <Badge tone={c.presenca ? "success" : "danger"} dot>{c.presenca ? "Presente" : "Falta"}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Resumo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-ink-muted">Frequência geral</span>
                        <span className="font-semibold text-ink">{freqPct}%</span>
                      </div>
                      <ProgressBar value={freqPct} tone={freqPct >= 85 ? "success" : freqPct >= 75 ? "gold" : "danger"} />
                    </div>
                    <p className="text-xs text-ink-faint">Presenças: {chamadas.filter((c) => c.presenca).length} · Faltas: {chamadas.filter((c) => !c.presenca).length} · Mínimo exigido para aprovação: 75%.</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {active === "financeiro" && (
              faturas.length === 0 ? (
                <Card>
                  <CardContent className="text-sm text-ink-muted">Nenhuma fatura gerada para este aluno no período vigente.</CardContent>
                </Card>
              ) : (
                <EduTable
                  columns={["Referência", "Descrição", "Vencimento", "Valor", "Pago", "Saldo", "Status"]}
                  rows={financeiroRows}
                />
              )
            )}
          </div>
        )}
      </Tabs>
    </div>
  );
}