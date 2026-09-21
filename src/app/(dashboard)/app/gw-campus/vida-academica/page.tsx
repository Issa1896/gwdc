"use client";

import { useMemo } from "react";
import { Building2, HeartHandshake, Home, Megaphone, Users } from "lucide-react";
import { KpiCard, PageHeader } from "@/components/dashboard/widgets";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { BackLink, WelfareKindBadge, WelfareStatusBadge } from "@/components/campus/widgets";
import { useCampus } from "@/lib/campus-store";
import type { WelfareStatus } from "@/data/campus/types";

const EVENTS: { date: string; label: string; tone?: "brand" | "gold" | "danger" | "info" }[] = [
  { date: "2026-09-14", label: "Abertura do ano letivo 2026/27", tone: "info" },
  { date: "2026-09-28", label: "Feira de clubes e associações", tone: "brand" },
  { date: "2026-10-05", label: "Visita da comissão de acreditação", tone: "gold" },
  { date: "2026-10-16", label: "Jornadas científicas do BIJAGÓS", tone: "brand" },
  { date: "2026-11-02", label: "Entrega de bolsas de mérito", tone: "gold" },
];

const CLUBES = [
  { id: "club-1", name: "Associação de Estudantes (AE-UNGB)", area: "Representação estudantil", members: 612 },
  { id: "club-2", name: "Núcleo de Empreendedorismo", area: "Inovação e start-ups", members: 128 },
  { id: "club-3", name: "Cineclube Kirida", area: "Cultura e cinema", members: 94 },
  { id: "club-4", name: "Liga de Futsal Universitário", area: "Desporto", members: 156 },
  { id: "club-5", name: "Comunidade Sénior TIC", area: "Inclusão digital", members: 67 },
  { id: "club-6", name: "Coro e Danças Tradicionais", area: "Artes", members: 83 },
];

export default function VidaAcademicaPage() {
  const { state, setWelfareStatus } = useCampus();

  const stats = useMemo(() => {
    const bolsas = state.welfare.filter((w) => w.kind === "bolsa" && w.status === "ativa").length;
    const ocupacaoResidencias = Math.round(
      (state.residencias.reduce((s, r) => s + r.occupants, 0) / state.residencias.reduce((s, r) => s + r.capacity, 0)) * 100,
    );
    const extensao = state.extension.reduce((s, e) => s + e.beneficiaries, 0);
    return { bolsas, ocupacaoResidencias, extensao };
  }, [state.welfare, state.residencias, state.extension]);

  return (
    <div className="space-y-6">
      <BackLink href="/app/gw-campus" label="Voltar à visão geral" />
      <PageHeader
        title="Vida Académica"
        description="Bem-estar estudantil, residências, bolsas, extensão à comunidade e cultura universitária."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Bolsas ativas" value={String(stats.bolsas)} delta={12.5} icon={HeartHandshake} spark={[5, 7, 9, stats.bolsas]} tone="gold" />
        <KpiCard title="Estudantes em residência" value={String(state.residencias.reduce((s, r) => s + r.occupants, 0))} delta={4.2} icon={Home} spark={[150, 180, 195]} tone="navy" />
        <KpiCard title="Ocupação das residências" value={`${stats.ocupacaoResidencias}%`} delta={3.4} icon={Building2} spark={[72, 78, 82, stats.ocupacaoResidencias]} />
        <KpiCard title="Beneficiários de extensão" value={stats.extensao.toLocaleString("pt-PT")} delta={21.8} icon={Users} spark={[740, 980, stats.extensao]} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Bolsa e apoios sociais</CardTitle>
            <CardDescription>Programas de apoio ao estudante por beneficio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.welfare.map((w) => (
              <div key={w.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-3.5">
                <WelfareKindBadge kind={w.kind} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{w.title}</p>
                  <p className="text-xs text-ink-muted">{w.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={w.status}
                    onChange={(e) => setWelfareStatus(w.id, e.target.value as WelfareStatus)}
                    className="rounded-lg border border-border bg-canvas px-2 py-1.5 text-xs text-ink outline-none focus:border-brand-400"
                    aria-label={`Estado do programa ${w.title}`}
                  >
                    <option value="ativa">Ativa</option>
                    <option value="candidatura">Candidatura</option>
                    <option value="suspensa">Suspensa</option>
                  </select>
                  <WelfareStatusBadge status={w.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Residências universitárias</CardTitle>
            <CardDescription>Capacidade e ocupação em tempo real</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.residencias.map((r) => {
              const pct = Math.round((r.occupants / r.capacity) * 100);
              return (
                <div key={r.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{r.name}</span>
                    <span className="text-xs tabular-nums text-ink-muted">{r.occupants}/{r.capacity}</span>
                  </div>
                  <Progress value={pct} tone={pct >= 95 ? "danger" : pct >= 80 ? "gold" : "brand"} />
                </div>
              );
            })}
            {state.residencias.some((r) => r.occupants >= r.capacity) && (
              <p className="rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                Uma residência está com ocupação plena — lista de espera ativa.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Clubes e associações</CardTitle>
            <CardDescription>Comunidade estudantil e atividades extracurriculares</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {CLUBES.map((c) => (
                <div key={c.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-strong text-ink-muted">
                    <Users className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{c.name}</p>
                    <p className="text-xs text-ink-muted">{c.area} · {c.members} membros</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendário académico</CardTitle>
            <CardDescription>Eventos do semestre de outono</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar events={EVENTS} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-start justify-between">
          <div>
            <CardTitle>Extensão à comunidade</CardTitle>
            <CardDescription>Impacto da Universidade para além do campus</CardDescription>
          </div>
          <Megaphone className="size-5 text-ink-faint" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {state.extension.map((e) => (
              <div key={e.id} className="rounded-xl border border-border p-4">
                <p className="text-sm font-medium text-ink">{e.title}</p>
                <p className="mt-1 text-xs text-ink-muted">{e.community} · {e.type}</p>
                <p className="mt-3 inline-flex rounded-full bg-surface-strong px-2.5 py-1 text-xs font-semibold text-ink">
                  {e.beneficiaries} beneficiários
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="py-2 text-xs text-ink-faint">GW Campus · Vida académica — Universidade Nacional da Guiné-Bissau, 2026/27.</p>
    </div>
  );
}