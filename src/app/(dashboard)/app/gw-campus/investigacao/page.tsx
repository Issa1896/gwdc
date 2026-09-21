"use client";

import { useMemo, useState } from "react";
import { CirclePlus, FlaskConical, FileText, Landmark, Minus, Plus, Users } from "lucide-react";
import { KpiCard, PageHeader, EmptyState } from "@/components/dashboard/widgets";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BackLink, ResearchStatusBadge } from "@/components/campus/widgets";
import { useCampus } from "@/lib/campus-store";
import type { ResearchStatus } from "@/data/campus/types";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { value: ResearchStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Em curso" },
  { value: "pipeline", label: "Pipeline" },
  { value: "concluded", label: "Concluídos" },
];

const AREAS = ["Agronomia & Segurança Alimentar", "Saúde Pública", "Ciências do Mar", "Gestão & Economia", "Ciências da Educação", "TIC & Engenharia"];

export default function InvestigacaoPage() {
  const { state, addResearch, setResearchStatus, bumpResearch } = useCampus();
  const [filter, setFilter] = useState<ResearchStatus | "all">("all");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [area, setArea] = useState(AREAS[0]);
  const [lead, setLead] = useState("");
  const [funding, setFunding] = useState("");

  const rows = useMemo(() => {
    const list = [...state.research].sort((a, b) => (a.status === b.status ? b.funding - a.funding : a.status.localeCompare(b.status)));
    return filter === "all" ? list : list.filter((r) => r.status === filter);
  }, [state.research, filter]);

  const fundingTotal = state.research.filter((r) => r.status === "active").reduce((s, r) => s + r.funding, 0);
  const publications = (state.research[0]?.publications ?? 0) + 12;

  const submit = () => {
    if (!title.trim() || !lead.trim()) return;
    addResearch({ title: title.trim(), area, lead: lead.trim(), funding: Number(funding) || 0 });
    setTitle("");
    setLead("");
    setFunding("");
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <BackLink href="/app/gw-campus" label="Voltar à visão geral" />
      <PageHeader
        title="Investigação & Extensão"
        description="Projetos de investigação, financiamento e atividades de extensão à comunidade."
        actions={
          <Button onClick={() => setOpen(true)}>
            <CirclePlus className="size-4" /> Novo projeto
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Financiamento ativo" value={`${fundingTotal.toLocaleString("pt-PT")} FCFA`} delta={12.5} icon={Landmark} spark={[180, 240, fundingTotal]} tone="gold" />
        <KpiCard title="Projetos em curso" value={String(state.research.filter((r) => r.status === "active").length)} delta={18.2} icon={FlaskConical} spark={[8, 11, 13]} tone="brand" />
        <KpiCard title="Publicações" value={String(publications)} delta={6.9} icon={FileText} spark={[14, 18, publications]} tone="navy" />
        <KpiCard title="Investigadores" value={String(state.docentes.filter((d) => d.projetos > 0).length)} delta={2.4} icon={Users} spark={[22, 25, 28]} />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-base font-semibold text-ink">Projetos</h2>
            <p className="text-xs text-ink-muted">Avanço e estado dos projetos por fase</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  filter === f.value
                    ? "border-cyan-400 bg-cyan-50 text-cyan-800 dark:border-cyan-700 dark:bg-cyan-950 dark:text-cyan-300"
                    : "border-border bg-surface text-ink-muted hover:text-ink",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        {rows.length === 0 ? (
          <EmptyState title="Sem projetos" description="Não existem projetos para este filtro." icon={FlaskConical} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projeto</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Investigador principal</TableHead>
                <TableHead className="text-right">Financiamento</TableHead>
                <TableHead>Avanço</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Progresso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <p className="text-sm font-medium text-ink">{r.title}</p>
                    <p className="text-xs text-ink-faint">{r.members} investigadores · inicio {r.startedAt ?? "—"}</p>
                  </TableCell>
                  <TableCell className="text-sm text-ink-muted">{r.area}</TableCell>
                  <TableCell className="text-sm text-ink-muted">{r.lead}</TableCell>
                  <TableCell className="text-right text-sm font-semibold tabular-nums text-ink">{r.funding.toLocaleString("pt-PT")} FCFA</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={r.progress} tone={r.status === "concluded" ? "success" : "brand"} className="w-24" />
                      <span className="text-xs font-semibold tabular-nums text-ink-muted">{r.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <select
                        value={r.status}
                        onChange={(e) => setResearchStatus(r.id, e.target.value as ResearchStatus)}
                        className="rounded-lg border border-border bg-canvas px-2 py-1.5 text-xs text-ink outline-none focus:border-brand-400"
                        aria-label={`Estado do projeto ${r.title}`}
                      >
                        <option value="pipeline">Pipeline</option>
                        <option value="active">Em curso</option>
                        <option value="concluded">Concluído</option>
                      </select>
                      <ResearchStatusBadge status={r.status} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-7" disabled={r.progress <= 0 || r.status === "concluded"} onClick={() => bumpResearch(r.id, -5)} aria-label={`Reduzir progresso de ${r.title}`}>
                        <Minus className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-7" disabled={r.progress >= 100 || r.status === "concluded"} onClick={() => bumpResearch(r.id, 5)} aria-label={`Aumentar progresso de ${r.title}`}>
                        <Plus className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Card>
        <CardContent className="grid gap-1 text-sm text-ink-muted sm:grid-cols-2">
          <p className="font-medium text-ink">Parcerias de extensão</p>
          <p>· Centro de saúde comunitário — programa de triagem preventiva.</p>
          <p>· Escola da Praia — formação de professores de ciências.</p>
          <p>· Incubadora agro — apoio a cooperativas de agricultura familiar.</p>
        </CardContent>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Propor novo projeto">
        <div className="space-y-4">
          <div>
            <Label htmlFor="rs-title">Título do projeto</Label>
            <Input id="rs-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Reforço da resiliência costeira" />
          </div>
          <div>
            <Label htmlFor="rs-area">Área científica</Label>
            <select
              id="rs-area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand-400"
            >
              {AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="rs-lead">Investigador principal</Label>
            <select
              id="rs-lead"
              value={lead}
              onChange={(e) => setLead(e.target.value)}
              className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand-400"
            >
              <option value="">Selecionar docente…</option>
              {state.docentes.map((d) => (
                <option key={d.id} value={d.name}>{d.name} — {d.specialty}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="rs-funding">Financiamento (FCFA)</Label>
            <Input id="rs-funding" type="number" min={0} value={funding} onChange={(e) => setFunding(e.target.value)} placeholder="Ex.: 20000000" />
          </div>
          <Button className="w-full" size="lg" onClick={submit} disabled={!title.trim() || !lead.trim()}>
            Criar projeto
          </Button>
        </div>
      </Modal>
    </div>
  );
}