"use client";

import { useMemo, useState } from "react";
import { CalendarPlus, ShieldCheck, Syringe, Users } from "lucide-react";
import { KpiCard, PageHeader, EmptyState } from "@/components/dashboard/widgets";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BackLink } from "@/components/health/widgets";
import { useHealth } from "@/lib/health-store";
import { fmtDate } from "@/data/health/types";
import type { Paciente } from "@/data/health/types";

const VACINAS_PNV = ["BCG", "Pentavalente", "Poliomielite (VOPb)", "Rotavírus", "SRP (Sarampo-Rubéola)", "Febre Amarela", "COVID-19"];

const COBERTURA = [
  { nome: "BCG", cobertura: 94 },
  { nome: "Pentavalente", cobertura: 89 },
  { nome: "Poliomielite", cobertura: 88 },
  { nome: "SRP", cobertura: 76 },
  { nome: "Febre Amarela", cobertura: 82 },
];

export default function VacinacaoPage() {
  const { state, registrarVacina } = useHealth();
  const [open, setOpen] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [nome, setNome] = useState(VACINAS_PNV[0]);
  const [dose, setDose] = useState("1.ª dose");

  const rows = useMemo(
    () =>
      [...state.vacinas]
        .map((v) => ({ v, paciente: state.pacientes.find((p) => p.id === v.patientId) }))
        .sort((a, b) => b.v.data.localeCompare(a.v.data))
        .slice(0, 30),
    [state.vacinas, state.pacientes],
  );

  const comVacina = new Set(state.vacinas.map((v) => v.patientId)).size;
  const coberturaMedia = Math.round(COBERTURA.reduce((s, c) => s + c.cobertura, 0) / COBERTURA.length);
  const dosesUltimoMes = state.vacinas.filter((v) => Date.now() - new Date(v.data).getTime() < 30 * 86400_000).length;

  const submit = () => {
    const paciente = state.pacientes.find((p) => p.id === patientId) as Paciente | undefined;
    if (!paciente) return;
    registrarVacina({ patientId, nome, dose, unidade: paciente.unidade });
    setPatientId("");
    setDose("1.ª dose");
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <BackLink href="/app/gw-health" label="Voltar à visão geral" />
      <PageHeader
        title="Vacinação"
        description="Carteira vacinal digital e cobertura do Programa Nacional de Vacinação (PNV)."
        actions={
          <Button onClick={() => setOpen(true)}>
            <CalendarPlus className="size-4" /> Registar dose
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Utentes vacinados" value={String(comVacina)} delta={6.2} icon={Users} spark={[4, 6, comVacina]} tone="navy" />
        <KpiCard title="Doses no último mês" value={String(dosesUltimoMes)} delta={12.4} icon={Syringe} spark={[5, 9, dosesUltimoMes]} tone="brand" />
        <KpiCard title="Cobertura média" value={`${coberturaMedia}%`} delta={3.8} icon={ShieldCheck} spark={[70, 76, 82, coberturaMedia]} tone="gold" />
        <KpiCard title="Vacinas no PNV" value="7" delta={0} icon={ShieldCheck} spark={[7, 7, 7]} tone="brand" />
      </div>

      <Card>
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-display text-base font-semibold text-ink">Cobertura vacinal por antigénio</h2>
          <p className="text-xs text-ink-muted">Percentagem de população elegível vacinada (2026)</p>
        </div>
        <CardContent className="space-y-4 p-5">
          {COBERTURA.map((c) => (
            <div key={c.nome} className="flex items-center gap-3">
              <span className="w-36 shrink-0 text-sm font-medium text-ink">{c.nome}</span>
              <Progress value={c.cobertura} tone={c.cobertura >= 85 ? "success" : c.cobertura >= 75 ? "brand" : "gold"} className="flex-1" />
              <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums text-ink">{c.cobertura}%</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-display text-base font-semibold text-ink">Registo recente de doses</h2>
          <p className="text-xs text-ink-muted">Últimas administrações registadas na carteira digital</p>
        </div>
        {rows.length === 0 ? (
          <EmptyState title="Sem registos" description="Administração ainda não registada." icon={Syringe} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utente</TableHead>
                <TableHead>Vacina</TableHead>
                <TableHead>Dose</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Unidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ v, paciente }) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium text-ink">{paciente?.name ?? v.patientId}</TableCell>
                  <TableCell className="text-sm text-ink">{v.nome}</TableCell>
                  <TableCell>
                    <Badge tone="navy">{v.dose}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-ink-muted">{fmtDate(v.data)}</TableCell>
                  <TableCell className="text-sm text-ink-muted">{v.unidade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Registar administração de vacina">
        <div className="space-y-4">
          <div>
            <Label htmlFor="vc-patient">Utente</Label>
            <select
              id="vc-patient"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand-400"
            >
              <option value="">Selecionar utente…</option>
              {state.pacientes.map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {p.idade} anos</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="vc-nome">Vacina</Label>
            <select
              id="vc-nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand-400"
            >
              {VACINAS_PNV.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="vc-dose">Dose</Label>
            <select
              id="vc-dose"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand-400"
            >
              {["Dose única", "1.ª dose", "2.ª dose", "3.ª dose", "Reforço"].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <Button className="w-full" size="lg" onClick={submit} disabled={!patientId}>
            Registar dose
          </Button>
          <p className="text-xs text-ink-faint">A dose fica associada à carteira digital do utente e sincronizada com o PNV.</p>
        </div>
      </Modal>
    </div>
  );
}