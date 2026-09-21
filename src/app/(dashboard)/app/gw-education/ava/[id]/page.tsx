"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import { BookOpen, CalendarClock, CheckCircle2, Download, MessageSquareText, PenLine, PlayCircle, Plus, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/dashboard/widgets";
import { BackLink } from "@/components/education/widgets";
import { getDiscipline, getAva, getProfessor, studentsOf, getStudent } from "@/data/education";
import type { Material } from "@/data/education/types";
import { shortDate } from "@/data/mvp/types";
import { cn } from "@/lib/utils";
import { useEducation } from "@/lib/education-store";

const typeIcon = { Aula: BookOpen, PDF: BookOpen, Vídeo: PlayCircle, Exercício: PenLine, Laboratório: PenLine };
const typeTone = {
  Aula: "bg-brand-500",
  PDF: "bg-navy-600",
  Vídeo: "bg-rose-500",
  Exercício: "bg-gold-500",
  Laboratório: "bg-sky-500",
} as const;

/** Detalhe da disciplina no AVA: materiais, fórum e atividades. */
export default function AvaDisciplinePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const discipline = getDiscipline(id);
  if (!discipline) notFound();

  const ava = getAva(id);
  if (!ava) notFound();

  const { state, publicarMaterial, toggleEntrega } = useEducation();
  const [publicar, setPublicar] = useState(false);
  const [material, setMaterial] = useState<{ title: string; type: Material["type"] }>({ title: "", type: "PDF" });

  const professor = getProfessor(discipline.professorId);
  const enrolled = studentsOf(id).map(getStudent).filter(Boolean);
  const occupation = Math.round((discipline.enrolled / discipline.vacancies) * 100);

  const materiais = [...ava.materials, ...(state.materiais[id] ?? [])];
  const entregues = (activityId: string) => state.entregas[id]?.includes(activityId) ?? false;

  const confirmarPublicacao = () => {
    if (!material.title.trim()) return;
    publicarMaterial(id, { title: material.title.trim(), type: material.type });
    setPublicar(false);
    setMaterial({ title: "", type: "PDF" });
  };

  return (
    <div className="space-y-6">
      <BackLink href="/app/gw-education/ava" label="Voltar às disciplinas" />
      <PageHeader
        title={discipline.name}
        description={`${discipline.code} · ${discipline.department} · ${discipline.credits} ECTS · ${discipline.hours}h`}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Sobre a disciplina</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-ink-muted">
            <p className="leading-relaxed">{discipline.description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge tone="navy">{discipline.year}º ano</Badge>
              <Badge tone={discipline.mandatory ? "brand" : "gold"}>{discipline.mandatory ? "Obrigatória" : "Optativa"}</Badge>
              <Badge tone={occupation >= 95 ? "danger" : "success"}>Ocupação {occupation}%</Badge>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-alt p-3">
              <span className="grid size-10 place-items-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                <UserRound className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{professor?.name}</p>
                <p className="truncate text-xs text-ink-faint">
                  {professor?.title} · {professor?.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Turma inscrita</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-ink-muted">
              {discipline.enrolled} de {discipline.vacancies} vagas ocupadas ({occupation}%)
            </p>
            <div className="flex flex-wrap gap-1.5">
              {enrolled.map((s) => (
                <Link key={s!.id} href={`/app/gw-education/aluno/${s!.id}`}>
                  <Badge tone="neutral" className="transition-colors hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
                    {s!.name}
                  </Badge>
                </Link>
              ))}
              <Badge tone="info">+ {discipline.enrolled - enrolled.length} estudantes</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        items={[
          { label: `Materiais (${materiais.length})`, value: "materiais", icon: <BookOpen className="size-4" /> },
          { label: `Fórum (${ava.forum.length})`, value: "forum", icon: <MessageSquareText className="size-4" /> },
          { label: `Atividades (${ava.activities.length})`, value: "atividades", icon: <CalendarClock className="size-4" /> },
        ]}
        defaultValue="materiais"
      >
        {(active) => (
          <Card className="mt-4">
            {active === "materiais" && (
              <>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-sm">Conteúdos publicados pelo docente</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => setPublicar(true)}>
                    <Plus className="size-3.5" /> Publicar material
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  {materiais.map((m) => {
                    const Icon = typeIcon[m.type];
                    return (
                      <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-surface-alt">
                        <span className={cn("grid size-10 shrink-0 place-items-center rounded-lg text-white", typeTone[m.type])}>
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ink">{m.title}</p>
                          <p className="text-xs text-ink-faint">
                            {m.type} · {shortDate(m.publishedAt)} · {m.downloads.toLocaleString("pt-PT")} downloads
                          </p>
                        </div>
                        <Download className="size-4 shrink-0 text-ink-faint" aria-label="Baixar material" />
                      </div>
                    );
                  })}
                </CardContent>
              </>
            )}
            {active === "forum" && (
              <>
                <CardHeader>
                  <CardTitle className="text-sm">Discussões recentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {ava.forum.map((t) => (
                    <div key={t.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-strong text-ink-faint">
                        <MessageSquareText className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{t.title}</p>
                        <p className="text-xs text-ink-faint">
                          {t.author} · {t.replies} respostas · última atividade {shortDate(t.lastActivity)}
                        </p>
                      </div>
                      <Badge tone="info">Abrir</Badge>
                    </div>
                  ))}
                </CardContent>
              </>
            )}
            {active === "atividades" && (
              <>
                <CardHeader>
                  <CardTitle className="text-sm">Entregas e avaliações</CardTitle>
                </CardHeader>
                <CardContent className="p-0 pb-2">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>Atividade</TableHeader>
                        <TableHeader>Tipo</TableHeader>
                        <TableHeader>Prazo</TableHeader>
                        <TableHeader>Peso</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader className="text-right">Ações</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ava.activities.map((a) => {
                        const entregue = a.submitted || entregues(a.id);
                        return (
                          <TableRow key={a.id}>
                            <TableCell className="font-medium text-ink">{a.title}</TableCell>
                            <TableCell>
                              <Badge tone={a.kind === "Mini-teste" ? "danger" : a.kind === "Projeto" ? "gold" : a.kind === "Trabalho" ? "brand" : "info"}>{a.kind}</Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-xs text-ink-muted">{shortDate(a.due)}</TableCell>
                            <TableCell className="tabular-nums">{a.weight}</TableCell>
                            <TableCell>
                              <Badge tone={entregue ? "success" : "warning"}>{entregue ? "Entregue" : "Pendente"}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant={entregue ? "outline" : "secondary"} onClick={() => toggleEntrega(id, a.id)}>
                                <CheckCircle2 className="size-3.5" /> {entregue ? "Anular entrega" : "Marcar entrega"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </>
            )}
          </Card>
        )}
      </Tabs>

      <Modal
        open={publicar}
        onClose={() => setPublicar(false)}
        title="Publicar material"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPublicar(false)}>Cancelar</Button>
            <Button onClick={confirmarPublicacao}><Plus className="size-4" /> Publicar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label>Título do material</Label>
            <Input value={material.title} onChange={(e) => setMaterial({ ...material, title: e.target.value })} placeholder="Ex.: Aula 25 — Segurança de API" />
          </div>
          <div>
            <Label>Tipo</Label>
            <Select value={material.type} onChange={(e) => setMaterial({ ...material, type: e.target.value as Material["type"] })}>
              <option value="Aula">Aula</option>
              <option value="PDF">PDF</option>
              <option value="Vídeo">Vídeo</option>
              <option value="Exercício">Exercício</option>
              <option value="Laboratório">Laboratório</option>
            </Select>
          </div>
          <p className="text-xs text-ink-faint">O material fica imediatamente visível para a turma no Ambiente Virtual de Aprendizagem.</p>
        </div>
      </Modal>
    </div>
  );
}