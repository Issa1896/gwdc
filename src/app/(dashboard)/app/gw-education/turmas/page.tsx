"use client";

import { useState } from "react";
import { DoorOpen, Plus, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { BackLink, StatCard } from "@/components/education/widgets";
import { PageHeader } from "@/components/dashboard/widgets";
import { EduTable } from "@/components/education/widgets";
import { badge, text, type Cell } from "@/data/education/types";
import { CURSOS, DOCENTES, ESTUDANTE_BY_ID, getCurso, getProfessor } from "@/data/education";
import { useEducation } from "@/lib/education-store";

interface NovaTurmaForm {
  nome: string;
  cursoId: string;
  turno: string;
  horario: string;
  sala: string;
  coordenadorId: string;
}

const FORM_VAZIO: NovaTurmaForm = {
  nome: "",
  cursoId: "c1",
  turno: "Diurno",
  horario: "08h00 – 13h00",
  sala: "L-101",
  coordenadorId: "p1",
};

/** MÓDULO 6 — Turmas e horários (criação operacional). */
export default function TurmasPage() {
  const { state, criarTurma } = useEducation();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<NovaTurmaForm>(FORM_VAZIO);

  const nomeAluno = (id: string) =>
    state.alunos.find((a) => a.id === id)?.nome ?? ESTUDANTE_BY_ID.get(id)?.nome ?? id;

  const guardar = () => {
    if (!form.nome.trim()) return;
    criarTurma({ ...form, nome: form.nome.trim().toUpperCase(), estudantes: [] });
    setModalOpen(false);
    setForm(FORM_VAZIO);
  };

  const rows: Cell[][] = state.turmas.map((t) => [
    text(t.nome),
    text(getCurso(t.cursoId)?.nome ?? "—"),
    text(t.turno),
    text(t.horario),
    text(t.sala),
    text(getProfessor(t.coordenadorId)?.name ?? "—"),
    text(t.estudantes.map(nomeAluno).map((n) => n.split(" ")[0]).join(", ")),
    badge(String(t.estudantes.length), "info"),
  ]);

  const totalAlunos = state.turmas.reduce((acc, t) => acc + t.estudantes.length, 0);

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Turmas"
        description="Alocação de turmas, salas e docentes coordenadores por turno."
        actions={
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setModalOpen(true)}>
              <Plus className="size-4" /> Nova turma
            </Button>
            <Badge tone="brand" className="self-start">{state.turmas.length} turmas ativas</Badge>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Turmas" value={String(state.turmas.length)} detail="Ano letivo 2026/2027" icon={DoorOpen} tone="brand" />
        <StatCard title="Alunos alocados" value={String(totalAlunos)} detail="Turmas 1º–4º ano" icon={Users} tone="navy" />
        <StatCard title="Turnos" value="2" detail="Diurno e noturno" icon={Clock} tone="gold" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Alocação de turmas</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-2">
          <EduTable
            columns={["Turma", "Curso", "Turno", "Horário", "Sala", "Coordenador(a)", "Alunos", "N.º"]}
            rows={rows}
          />
        </CardContent>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nova turma"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={guardar}><Plus className="size-4" /> Criar turma</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label>Nome da turma</Label>
            <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex.: INF-3A" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Curso</Label>
              <Select value={form.cursoId} onChange={(e) => setForm({ ...form, cursoId: e.target.value })}>
                {CURSOS.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Turno</Label>
              <Select value={form.turno} onChange={(e) => setForm({ ...form, turno: e.target.value })}>
                <option>Diurno</option>
                <option>Noturno</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Horário</Label>
              <Input value={form.horario} onChange={(e) => setForm({ ...form, horario: e.target.value })} placeholder="08h00 – 13h00" />
            </div>
            <div>
              <Label>Sala</Label>
              <Input value={form.sala} onChange={(e) => setForm({ ...form, sala: e.target.value })} placeholder="L-101" />
            </div>
          </div>
          <div>
            <Label>Docente coordenador(a)</Label>
            <Select value={form.coordenadorId} onChange={(e) => setForm({ ...form, coordenadorId: e.target.value })}>
              {DOCENTES.map((d) => (
                <option key={d.id} value={d.id}>{d.nome}</option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
}