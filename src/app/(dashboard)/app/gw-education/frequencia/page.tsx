"use client";

import { useState } from "react";
import { CalendarCheck, CalendarDays, CheckCircle2, Plus, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { BackLink, StatCard } from "@/components/education/widgets";
import { ProgressBar } from "@/components/education/widgets";
import { useEducation } from "@/lib/education-store";

const hoje = () => new Date().toISOString().slice(0, 10);

/** MÓDULO 6 — Registro de frequência (chamadas persistidas). */
export default function FrequenciaPage() {
  const { state, getChamadas, salvarChamadas, registrarAula } = useEducation();
  const alunos = state.alunos;
  const [estudanteId, setEstudanteId] = useState(alunos[0]?.id ?? "");

  const estudante = alunos.find((e) => e.id === estudanteId);
  const chamadas = getChamadas(estudanteId);
  const presencas = chamadas.filter((c) => c.presenca).length;
  const freqPct = chamadas.length ? Math.round((presencas / chamadas.length) * 100) : 0;
  const aulaHoje = chamadas.some((c) => c.dia === hoje());

  const alternar = (dia: string) => {
    salvarChamadas(
      estudanteId,
      chamadas.map((c) => (c.dia === dia ? { ...c, presenca: !c.presenca } : c)),
    );
  };

  const registrarHoje = () => {
    registrarAula(estudanteId, { disciplinaId: "d2", disciplina: "Programação Web", presenca: true });
  };

  return (
    <div className="space-y-6">
      <BackLink />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-ink-faint">Últimos 10 dias letivos · semestre 1/2026 · as alterações são guardadas automaticamente.</p>
          <Select aria-label="Selecionar estudante" value={estudanteId} onChange={(e) => setEstudanteId(e.target.value)} className="mt-2 w-full max-w-sm">
            {alunos.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome} — {e.id}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={aulaHoje} onClick={registrarHoje}>
            <Plus className="size-3.5" /> {aulaHoje ? "Aula de hoje registada" : "Registrar aula de hoje"}
          </Button>
          <Badge tone={freqPct >= 85 ? "success" : freqPct >= 75 ? "warning" : "danger"} dot>
            {estudante?.nome}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Frequência geral" value={`${freqPct}%`} detail="Mínimo exigido: 75%" icon={CalendarCheck} tone={freqPct >= 85 ? "brand" : "gold"} />
        <StatCard title="Presenças" value={String(presencas)} detail="Aulas registadas" icon={CheckCircle2} tone="navy" />
        <StatCard title="Faltas" value={String(chamadas.length - presencas)} detail="Justificáveis por atestado" icon={XCircle} tone="gold" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <CalendarDays className="size-4 text-brand-500" /> Registro de chamada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {chamadas.length === 0 && <p className="py-4 text-sm text-ink-muted">Nenhuma chamada registada para este estudante.</p>}
            {chamadas.map((c) => (
              <div key={c.dia} className="flex items-center justify-between rounded-lg border border-border px-4 py-2.5">
                <span className="text-sm text-ink">
                  {new Date(c.dia).toLocaleDateString("pt-PT", { weekday: "long", day: "2-digit", month: "short" })}
                  {c.dia === hoje() && <Badge tone="brand" className="ml-2">Hoje</Badge>}
                </span>
                <Button
                  size="sm"
                  variant={c.presenca ? "secondary" : "outline"}
                  onClick={() => alternar(c.dia)}
                  aria-label={`Alternar presença de ${new Date(c.dia).toLocaleDateString("pt-PT")}`}
                >
                  <Badge tone={c.presenca ? "success" : "danger"} dot>
                    {c.presenca ? "Presente" : "Falta"}
                  </Badge>
                  Clique para alternar
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Resumo do período</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-ink-muted">Frequência geral</span>
                <span className="font-semibold text-ink">{freqPct}%</span>
              </div>
              <ProgressBar value={freqPct} tone={freqPct >= 85 ? "success" : freqPct >= 75 ? "gold" : "danger"} />
            </div>
            <p className="text-xs text-ink-faint">
              Presenças: {presencas} · Faltas: {chamadas.length - presencas} · Alerta automático para encarregados quando a
              frequência fica abaixo de 75%.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}