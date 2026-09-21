"use client";

import { useState } from "react";
import { Bomb, CheckCircle2, Clock, PlayCircle, ShieldCheck, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Alert } from "@/components/ui/alert";
import { PageHeader, KpiCard } from "@/components/dashboard/widgets";
import { BackLink } from "@/components/education/widgets";
import { EXAMS, getDiscipline, getExam } from "@/data/education";
import { cn } from "@/lib/utils";

/** Avaliações online com anti-cópia — prova simulada interativa. */
export default function AvaliacoesPage() {
  const [openExamId, setOpenExamId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<{ correct: number; total: number } | null>(null);

  const exam = openExamId ? getExam(openExamId) : undefined;
  const discipline = exam ? getDiscipline(exam.disciplineId) : undefined;

  const openExam = (id: string) => {
    setAnswers({});
    setSubmitted(null);
    setOpenExamId(id);
  };

  const submit = () => {
    if (!exam) return;
    let correct = 0;
    exam.questions.forEach((q) => {
      if (answers[q.id] === q.answer) correct += 1;
    });
    setSubmitted({ correct, total: exam.questions.length });
  };

  const answeredCount = exam ? Object.keys(answers).length : 0;
  const canSubmit = exam ? answeredCount === exam.questions.length : false;

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Avaliações Online"
        description="Provas com monitoramento por IA anti-cópia, correção automática e resultado instantâneo."
        actions={
          <Badge tone="info" className="self-start">
            Ambiente seguro ativo
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Avaliações do semestre" value={String(EXAMS.length)} delta={0} icon={PlayCircle} tone="brand" spark={[2, 2, 3, 3, 3, 4, 4, EXAMS.length]} />
        <KpiCard title="Mini-testes realizados" value="412" delta={14.8} icon={ShieldCheck} tone="navy" spark={[240, 280, 310, 340, 360, 380, 400, 412]} />
        <KpiCard title="Tentativas ativas" value="536" delta={9.2} icon={Timer} tone="gold" spark={[380, 410, 450, 470, 490, 510, 520, 536]} />
        <KpiCard title="Alertas anti-cópia" value="3" delta={-40.0} icon={Bomb} tone="brand" spark={[9, 8, 7, 6, 5, 4, 4, 3]} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {EXAMS.map((e) => {
          const d = getDiscipline(e.disciplineId);
          return (
            <Card key={e.id}>
              <CardHeader className="flex-row items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-xs text-ink-faint">
                    {d?.code} · {e.duration} · {e.attempts.toLocaleString("pt-PT")} tentativas
                  </p>
                  <CardTitle className="mt-0.5">{e.title}</CardTitle>
                </div>
                <Badge tone={e.status === "Disponível" ? "success" : e.status === "Agendada" ? "gold" : "neutral"} dot>
                  {e.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="flex items-center gap-2 text-xs text-ink-muted">
                  <Clock className="size-3.5" /> Janela: {e.window}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {e.antiFraud.map((f) => (
                    <Badge key={f} tone="info">
                      <ShieldCheck className="size-3" /> {f}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" disabled={e.status === "Encerrada"} onClick={() => openExam(e.id)}>
                    <PlayCircle className="size-3.5" /> Iniciar (simulação)
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Prova simulada */}
      <Modal
        open={Boolean(exam)}
        onClose={() => setOpenExamId(null)}
        title={exam ? `${exam.title} — ${discipline?.name}` : ""}
        className="max-w-2xl"
        footer={
          exam && !submitted ? (
            <Button disabled={!canSubmit} onClick={submit}>
              Entregar prova ({answeredCount}/{exam.questions.length})
            </Button>
          ) : undefined
        }
      >
        {submitted ? (
          <div className="space-y-4 py-2 text-center">
            <span className={cn("mx-auto grid size-20 place-items-center rounded-full", submitted.correct / submitted.total >= 0.66 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300")}>
              <CheckCircle2 className="size-10" />
            </span>
            <p className="font-display text-2xl font-bold text-ink">
              {submitted.correct}/{submitted.total} corretas
            </p>
            <p className="text-sm text-ink-muted">
              Nota sugerida: <strong className="text-ink">{((submitted.correct / submitted.total) * 20).toFixed(1).replace(".", ",")} / 20</strong> ·
              correção automática concluída sem alertas de anti-cópia.
            </p>
            <Badge tone={submitted.correct / submitted.total >= 0.66 ? "success" : "warning"}>
              {submitted.correct / submitted.total >= 0.66 ? "Aprovado(a) no mini-teste" : "Consulte materiais antes da próxima janela"}
            </Badge>
          </div>
        ) : exam ? (
          <div className="space-y-5">
            <Alert tone="info" title="Ambiente de simulação monitorado">
              Em produção, a prova exige câmera, bloqueio de abas e detecção de múltiplos dispositivos. Aqui você pode
              responder livremente para experimentar o fluxo.
            </Alert>
            {exam.questions.map((q, i) => (
              <fieldset key={q.id}>
                <legend className="text-sm font-semibold text-ink">
                  {i + 1}. {q.question}
                </legend>
                <div className="mt-2.5 space-y-2">
                  {q.options.map((option, j) => (
                    <label
                      key={j}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm transition-colors",
                        answers[q.id] === j ? "border-brand-500 bg-brand-50 dark:bg-brand-950" : "hover:bg-surface-alt",
                      )}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        checked={answers[q.id] === j}
                        onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: j }))}
                        className="accent-[var(--color-brand-500)]"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}