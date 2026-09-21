"use client";

import { useEffect, useState } from "react";
import { ClipboardCheck, GraduationCap, RotateCcw, Save, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Input, Select } from "@/components/ui/input";
import { BackLink, StatCard } from "@/components/education/widgets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEducation } from "@/lib/education-store";
import { situacaoLabel, type NotaMateria, type SituacaoMateria } from "@/data/education";

const parseNota = (v: string): number | null => {
  if (v.trim() === "") return null;
  const n = Number(v.replace(",", "."));
  if (Number.isNaN(n)) return null;
  return Math.min(20, Math.max(0, n));
};

function recalcular(n: NotaMateria): NotaMateria {
  const { av1, av2, provaFinal: pf } = n;
  let media: number | null = null;
  let situacao: SituacaoMateria = "em_curso";
  if (av1 !== null && av2 !== null) {
    media = pf !== null ? (av1 + av2 + pf) / 3 : (av1 + av2) / 2;
    situacao = media >= 10 ? "aprovado" : pf !== null ? "reprovado" : "em_curso";
  }
  return { ...n, media: media !== null ? Math.round(media * 10) / 10 : null, situacao };
}

/** MÓDULO 6 — Lançamento de notas por estudante, com recálculo automático. */
export default function NotasPage() {
  const { state, getNotas, salvarNotas } = useEducation();
  const alunos = state.alunos;
  const [estudanteId, setEstudanteId] = useState(alunos[0]?.id ?? "");
  const [rascunho, setRascunho] = useState<NotaMateria[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const estudante = alunos.find((e) => e.id === estudanteId);

  useEffect(() => {
    if (!estudante) return;
    setRascunho(getNotas(estudante.id, estudante.cursoId));
    setDirty(false);
    setSaved(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estudanteId]);

  useEffect(() => {
    if (!dirty) return;
    const t = window.setTimeout(() => setSaved(false), 200);
    return () => window.clearTimeout(t);
  }, [dirty]);

  if (!estudante) {
    return <p className="p-6 text-sm text-ink-muted">Nenhum estudante no registo. Cadastre alunos no módulo Alunos.</p>;
  }

  const notas = rascunho;
  const media = (() => {
    const comMedia = notas.filter((n) => n.media !== null);
    if (!comMedia.length) return 0;
    return Math.round((comMedia.reduce((acc, n) => acc + n.media!, 0) / comMedia.length) * 10) / 10;
  })();
  const aprovadas = notas.filter((n) => n.situacao === "aprovado").length;

  const definir = (index: number, campo: "av1" | "av2" | "provaFinal" | "frequencia", valor: string) => {
    const atual = notas[index];
    if (!atual) return;
    let proxima: NotaMateria;
    if (campo === "frequencia") {
      const f = Math.min(100, Math.max(0, Number(valor) || 0));
      proxima = { ...atual, frequencia: f };
    } else {
      const nota = parseNota(valor);
      if (atual[campo] === nota && valor === String(atual[campo])) return;
      proxima = recalcular({ ...atual, [campo]: nota });
    }
    const nova = [...notas];
    nova[index] = proxima;
    setRascunho(nova);
    setDirty(true);
  };

  const guardar = () => {
    salvarNotas(estudante.id, notas);
    setDirty(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3200);
  };

  return (
    <div className="space-y-6">
      <BackLink />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-ink-faint">Lançamento do semestre 1/2026 · escala 0–20 · a média é recalculada automaticamente.</p>
          <Select aria-label="Selecionar estudante" value={estudanteId} onChange={(e) => setEstudanteId(e.target.value)} className="mt-2 w-full max-w-sm">
            {alunos.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome} — {e.id}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={!dirty} onClick={() => { setRascunho(getNotas(estudante.id, estudante.cursoId)); setDirty(false); }}>
            <RotateCcw className="size-3.5" /> Repor valores
          </Button>
          <Button size="sm" disabled={!dirty} onClick={guardar}>
            <Save className="size-3.5" /> Guardar alterações
          </Button>
        </div>
      </div>

      {saved && <Alert tone="success" title="Notas guardadas">Boletim de {estudante.nome} atualizado no registo nacional.</Alert>}
      {dirty && <Alert tone="warning" title="Alterações não guardadas">Existem valores editados. Guarde para aplicar ao boletim.</Alert>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Média geral" value={media.toFixed(1).replace(".", ",")} detail="Escala 0–20" icon={GraduationCap} tone="brand" />
        <StatCard title="Disciplinas" value={String(notas.length)} detail="Semestre avaliado" icon={ClipboardCheck} tone="navy" />
        <StatCard title="Aprovações" value={String(aprovadas)} detail={`${notas.length ? Math.round((aprovadas / notas.length) * 100) : 0}% de aprovação`} icon={TrendingUp} tone="gold" />
        <StatCard title="Frequência média" value={`${notas.length ? Math.round(notas.reduce((acc, n) => acc + n.frequencia, 0) / notas.length) : 0}%`} detail="Mínimo: 75%" icon={Users} tone="brand" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Boletim — {estudante.nome} ({estudante.id})</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-2">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Disciplina</TableHeader>
                <TableHeader className="w-28">1ª AV</TableHeader>
                <TableHeader className="w-28">2ª AV</TableHeader>
                <TableHeader className="w-28">Prova final</TableHeader>
                <TableHeader className="w-28">Frequência %</TableHeader>
                <TableHeader className="w-20">Média</TableHeader>
                <TableHeader>Situação</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {notas.map((n, i) => {
                const st = situacaoLabel(n.situacao);
                return (
                  <TableRow key={n.disciplinaId}>
                    <TableCell className="font-medium text-ink">{n.disciplina}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        max={20}
                        step={0.1}
                        value={n.av1 ?? ""}
                        onChange={(e) => definir(i, "av1", e.target.value)}
                        className="h-8 w-24"
                        aria-label={`1ª avaliação de ${n.disciplina}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        max={20}
                        step={0.1}
                        value={n.av2 ?? ""}
                        onChange={(e) => definir(i, "av2", e.target.value)}
                        className="h-8 w-24"
                        aria-label={`2ª avaliação de ${n.disciplina}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        max={20}
                        step={0.1}
                        value={n.provaFinal ?? ""}
                        onChange={(e) => definir(i, "provaFinal", e.target.value)}
                        className="h-8 w-24"
                        aria-label={`Prova final de ${n.disciplina}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={n.frequencia}
                        onChange={(e) => definir(i, "frequencia", e.target.value)}
                        className="h-8 w-24"
                        aria-label={`Frequência de ${n.disciplina}`}
                      />
                    </TableCell>
                    <TableCell className="tabular-nums font-semibold text-ink">{n.media !== null ? n.media.toFixed(1).replace(".", ",") : "—"}</TableCell>
                    <TableCell>
                      <Badge tone={st.tone}>{st.label}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}