"use client";

import { useMemo, useState } from "react";
import { CalendarPlus, Stethoscope, Video } from "lucide-react";
import { KpiCard, PageHeader, EmptyState } from "@/components/dashboard/widgets";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BackLink, ConsultaStatusBadge, ConsultaTipoBadge, TriagemBadge } from "@/components/health/widgets";
import { useHealth } from "@/lib/health-store";
import { fmtDate } from "@/data/health/types";
import type { ConsultaStatus, ConsultaTipo } from "@/data/health/types";

const UNIDADE_LABEL: Record<string, string> = {
  "Hospital Nacional Simão Mendes": "HNSM · Bissau",
  "Centro de Saúde de Bissau": "CS Bissau",
  "Hospital Regional de Bafatá": "HR Bafatá",
  "Hospital Regional de Bolama": "HR Bolama",
  "Hospital Regional de Gabú": "HR Gabú",
  "Centro de Saúde de Quelele": "CS Quelele",
  "Centro de Saúde de Cacheu": "CS Cacheu",
};

export default function ConsultasPage() {
  const { state, agendarConsulta, setConsultaStatus } = useHealth();
  const [open, setOpen] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [medicoId, setMedicoId] = useState("");
  const [tipo, setTipo] = useState<ConsultaTipo>("presencial");
  const [data, setData] = useState("");
  const [motivo, setMotivo] = useState("");
  const [filter, setFilter] = useState<ConsultaStatus | "all">("all");

  const rows = useMemo(() => {
    const list = [...state.consultas]
      .map((c) => ({
        c,
        paciente: state.pacientes.find((p) => p.id === c.patientId),
        medico: state.medicos.find((m) => m.id === c.medicoId),
      }))
      .sort((a, b) => b.c.data.localeCompare(a.c.data));
    return filter === "all" ? list : list.filter(({ c }) => c.status === filter);
  }, [state.consultas, state.pacientes, state.medicos, filter]);

  const pendentes = state.consultas.filter((c) => c.status === "agendada").length;
  const tele = state.consultas.filter((c) => c.tipo === "teleconsulta" && c.status === "realizada").length;
  const alertas = state.consultas.filter((c) => c.triagem === "alerta" || c.triagem === "critica").length;

  const submit = () => {
    if (!patientId || !medicoId || !data || !motivo.trim()) return;
    agendarConsulta({ patientId, medicoId, tipo, data: new Date(data).toISOString(), motivo: motivo.trim() });
    setPatientId("");
    setMedicoId("");
    setData("");
    setMotivo("");
    setTipo("presencial");
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <BackLink href="/app/gw-health" label="Voltar à visão geral" />
      <PageHeader
        title="Consultas & Telemedicina"
        description="Agenda clínica, atendimentos presenciais e teleconsultas do Sistema Nacional de Saúde."
        actions={
          <Button onClick={() => setOpen(true)}>
            <CalendarPlus className="size-4" /> Agendar consulta
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Consultas agendadas" value={String(pendentes)} delta={8.4} icon={CalendarPlus} spark={[8, 12, pendentes]} tone="navy" />
        <KpiCard title="Teleconsultas realizadas" value={String(tele)} delta={27.8} icon={Video} spark={[3, 6, tele]} />
        <KpiCard title="Triagens com alerta" value={String(alertas)} delta={5.2} icon={Stethoscope} spark={[4, 5, alertas]} tone="gold" />
        <KpiCard title="Médicos disponíveis" value={String(state.medicos.filter((m) => m.disponivel).length)} delta={0} icon={Stethoscope} spark={[4, 5, 5]} />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-base font-semibold text-ink">Agenda clínica</h2>
            <p className="text-xs text-ink-muted">Histórico e registos de atendimento</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["all", "agendada", "realizada", "cancelada"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === f
                    ? "border-rose-400 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300"
                    : "border-border bg-surface text-ink-muted hover:text-ink"
                }`}
              >
                {f === "all" ? "Todas" : f === "agendada" ? "Agendadas" : f === "realizada" ? "Realizadas" : "Canceladas"}
              </button>
            ))}
          </div>
        </div>
        {rows.length === 0 ? (
          <EmptyState title="Sem consultas" description="Não existem consultas para este filtro." icon={Stethoscope} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quando</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Médico</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Triagem</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ c, paciente, medico }) => (
                <TableRow key={c.id}>
                  <TableCell className="text-sm text-ink-muted">{fmtDate(c.data)}</TableCell>
                  <TableCell className="text-sm font-medium text-ink">{paciente?.name ?? c.patientId}</TableCell>
                  <TableCell className="text-sm text-ink-muted">{c.motivo}</TableCell>
                  <TableCell className="text-sm text-ink-muted">
                    <p>{medico?.name ?? "—"}</p>
                    <p className="text-xs text-ink-faint">{medico ? (UNIDADE_LABEL[medico.unidade] ?? medico.unidade) : ""}</p>
                  </TableCell>
                  <TableCell><ConsultaTipoBadge tipo={c.tipo} /></TableCell>
                  <TableCell><TriagemBadge triagem={c.triagem} /></TableCell>
                  <TableCell><ConsultaStatusBadge status={c.status} /></TableCell>
                  <TableCell>
                    <select
                      value={c.status}
                      onChange={(e) => setConsultaStatus(c.id, e.target.value as ConsultaStatus)}
                      className="rounded-lg border border-border bg-canvas px-2 py-1.5 text-xs text-ink outline-none focus:border-brand-400"
                      aria-label={`Estado da consulta de ${paciente?.name ?? ""}`}
                    >
                      <option value="agendada">Agendada</option>
                      <option value="realizada">Realizada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Agendar consulta">
        <div className="space-y-4">
          <div>
            <Label htmlFor="cs-patient">Paciente</Label>
            <select
              id="cs-patient"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand-400"
            >
              <option value="">Selecionar utente…</option>
              {state.pacientes.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {p.niss}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="cs-medico">Médico</Label>
            <select
              id="cs-medico"
              value={medicoId}
              onChange={(e) => setMedicoId(e.target.value)}
              className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand-400"
            >
              <option value="">Selecionar médico…</option>
              {state.medicos.filter((m) => m.disponivel).map((m) => (
                <option key={m.id} value={m.id}>{m.name} — {m.specialty}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="cs-tipo">Tipo de atendimento</Label>
            <div className="flex gap-2">
              {(["presencial", "teleconsulta"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipo(t)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                    tipo === t
                      ? "border-rose-400 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      : "border-border bg-surface text-ink-muted hover:text-ink"
                  }`}
                >
                  {t === "teleconsulta" ? <Video className="size-4" /> : <Stethoscope className="size-4" />}
                  {t === "teleconsulta" ? "Teleconsulta" : "Presencial"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="cs-data">Data e hora</Label>
            <Input id="cs-data" type="datetime-local" value={data} onChange={(e) => setData(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="cs-motivo">Motivo</Label>
            <Input id="cs-motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex.: Febre e cefaleias" />
          </div>
          <Button className="w-full" size="lg" onClick={submit} disabled={!patientId || !medicoId || !data || !motivo.trim()}>
            Agendar consulta
          </Button>
          {tipo === "teleconsulta" && (
            <p className="flex items-start gap-2 rounded-xl bg-sky-50 p-3 text-xs text-sky-800 dark:bg-sky-950/40 dark:text-sky-200">
              <Video className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              A teleconsulta gera um link seguro de vídeo e um registo no prontuário após o atendimento.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}