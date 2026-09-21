"use client";

import { useMemo, useState } from "react";
import { Activity, Search, Syringe, User } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/dashboard/widgets";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BackLink, ConsultaStatusBadge, ConsultaTipoBadge } from "@/components/health/widgets";
import { useHealth } from "@/lib/health-store";
import { fmtDate } from "@/data/health/types";
import { cn } from "@/lib/utils";

const SEGUIMENTO: Record<string, { label: string; tone: "success" | "info" | "danger" }> = {
  estavel: { label: "Estável", tone: "success" },
  seguimento: { label: "Em acompanhamento", tone: "info" },
  critico: { label: "Crítico", tone: "danger" },
};

export default function PacientesPage() {
  const { state } = useHealth();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...state.pacientes].sort((a, b) => a.name.localeCompare(b.name));
    return q ? list.filter((p) => p.name.toLowerCase().includes(q) || p.niss.toLowerCase().includes(q) || p.localidade.toLowerCase().includes(q)) : list;
  }, [state.pacientes, query]);

  const selected = state.pacientes.find((p) => p.id === selectedId) ?? null;
  const selectedVacinas = selected ? state.vacinas.filter((v) => v.patientId === selected.id).sort((a, b) => b.data.localeCompare(a.data)) : [];
  const selectedConsultas = selected ? state.consultas.filter((c) => c.patientId === selected.id).sort((a, b) => b.data.localeCompare(a.data)) : [];

  return (
    <div className="space-y-6">
      <BackLink href="/app/gw-health" label="Voltar à visão geral" />
      <PageHeader
        title="Pacientes"
        description="Cadastro nacional de utentes e prontuário eletrónico único (PEP)."
        actions={
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Procurar por nome, NISS ou localidade…"
              className="w-64 rounded-xl border border-border bg-canvas py-2.5 pr-3 pl-9 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-brand-400"
            />
          </div>
        }
      />

      {rows.length === 0 ? (
        <Card>
          <EmptyState title="Nenhum paciente encontrado" description="Ajuste a pesquisa ou verifique o cadastro nacional." icon={User} />
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utente</TableHead>
                <TableHead>NISS</TableHead>
                <TableHead>Idade/Sexo</TableHead>
                <TableHead>Sangue</TableHead>
                <TableHead>Localidade</TableHead>
                <TableHead>Doenças crónicas</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-ink">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs text-ink-muted">{p.niss}</TableCell>
                  <TableCell className="text-sm text-ink-muted">{p.idade} anos · {p.sexo}</TableCell>
                  <TableCell className="text-sm text-ink">{p.sangue}</TableCell>
                  <TableCell className="text-sm text-ink-muted">{p.localidade}</TableCell>
                  <TableCell className="text-sm text-ink-muted">{p.cronicas.length > 0 ? p.cronicas.join(", ") : "—"}</TableCell>
                  <TableCell>
                    <Badge tone={SEGUIMENTO[p.seguimento]?.tone ?? "neutral"} dot>
                      {SEGUIMENTO[p.seguimento]?.label ?? p.seguimento}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => setSelectedId(p.id)}>
                      Prontuário
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Modal open={selected !== null} onClose={() => setSelectedId(null)} title={selected ? `Prontuário — ${selected.name}` : "Prontuário"}>
        {selected && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="navy">{selected.niss}</Badge>
              <Badge tone={SEGUIMENTO[selected.seguimento]?.tone ?? "neutral"} dot>{SEGUIMENTO[selected.seguimento]?.label ?? selected.seguimento}</Badge>
              <Badge tone="neutral">{selected.idade} anos · {selected.sexo} · sangue {selected.sangue}</Badge>
            </div>
            <div>
              <p className="mb-1.5 text-sm font-medium text-ink">Doenças crónicas</p>
              <p className="text-sm text-ink-muted">{selected.cronicas.length > 0 ? selected.cronicas.join(" · ") : "Sem doenças crónicas registadas."}</p>
              <p className="mb-1.5 mt-3 text-sm font-medium text-ink">Alergias</p>
              <p className="text-sm text-ink-muted">{selected.alergias.length > 0 ? selected.alergias.join(" · ") : "Sem alergias conhecidas."}</p>
            </div>
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink">
                <Syringe className="size-4 text-rose-600" aria-hidden="true" /> Carteira de vacinação
              </p>
              {selectedVacinas.length === 0 ? (
                <p className="text-sm text-ink-muted">Sem vacinas registadas.</p>
              ) : (
                <Table className="text-xs">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vacina</TableHead>
                      <TableHead>Dose</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Unidade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedVacinas.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="text-sm font-medium text-ink">{v.nome}</TableCell>
                        <TableCell className="text-sm text-ink-muted">{v.dose}</TableCell>
                        <TableCell className="text-sm text-ink-muted">{fmtDate(v.data)}</TableCell>
                        <TableCell className="text-sm text-ink-muted">{v.unidade}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-ink">
                <Activity className="size-4 text-rose-600" aria-hidden="true" /> Consultas recentes
              </p>
              {selectedConsultas.length === 0 ? (
                <p className="text-sm text-ink-muted">Sem consultas registadas.</p>
              ) : (
                <div className="space-y-2">
                  {selectedConsultas.map((c) => (
                    <div key={c.id} className={cn("flex items-center gap-3 rounded-xl border border-border p-3")}>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{c.motivo}</p>
                        <p className="text-xs text-ink-muted">{fmtDate(c.data)}</p>
                      </div>
                      <ConsultaTipoBadge tipo={c.tipo} />
                      <ConsultaStatusBadge status={c.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}