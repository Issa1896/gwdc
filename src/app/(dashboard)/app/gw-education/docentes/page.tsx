"use client";

import { UserCheck, Users, Clock, School } from "lucide-react";
import { PageHeader } from "@/components/dashboard/widgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/progress";
import { BackLink, StatCard } from "@/components/education/widgets";
import { DOCENTES } from "@/data/education";

/** MÓDULO 6 — Corpo docente nacional. */
export default function DocentesPage() {
  const ativos = DOCENTES.filter((d) => d.status === "ativo").length;

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Docentes"
        description="Corpo docente das instituições conectadas — vinculação automática a disciplinas no início de cada semestre."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Docentes ativos" value={String(ativos)} detail={`${DOCENTES.length} no cadastro nacional`} icon={Users} tone="brand" />
        <StatCard title="Titulares (doutores)" value={String(DOCENTES.filter((d) => d.titulo.includes("Dr")).length)} detail="Acadêmico e pesquisadores" icon={UserCheck} tone="navy" />
        <StatCard title="Carga média semanal" value="17h" detail="Segundo plano de aulas 2026" icon={Clock} tone="gold" />
        <StatCard title="Faculdades atendidas" value="5" detail="34 unidades letivas" icon={School} tone="brand" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {DOCENTES.map((d) => (
          <Card key={d.id} className="p-5">
            <div className="flex items-start gap-4">
              <Avatar name={d.nome} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{d.nome}</p>
                <p className="text-xs text-ink-muted">{d.titulo} · {d.email}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge tone={d.status === "ativo" ? "success" : "warning"} dot>{d.status === "ativo" ? "Ativo" : "Afastado"}</Badge>
                  <Badge tone="neutral">{d.cargaSemanal}h/semana</Badge>
                </div>
              </div>
            </div>
            <div className="mt-4 border-t border-border pt-3">
              <p className="mb-2 text-[11px] font-semibold tracking-wider text-ink-faint uppercase">Disciplinas vinculadas</p>
              <div className="flex flex-wrap gap-1.5">
                {d.disciplinas.map((id) => {
                  const disco = Object.values({}); 
                  void disco;
                  const nome = d.disciplinas.length > 1 ? id : id;
                  return <Badge key={id} tone="brand">{nome}</Badge>;
                })}
              </div>
              <p className="mt-2 text-xs text-ink-faint">{d.faculdade}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Distribuição de carga por faculdade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["Faculdade de Engenharias e Tecnologias", "Faculdade de Ciências da Saúde", "Faculdade de Direito", "Faculdade de Economia e Gestão", "Faculdade de Agronomia"].map((fac) => {
              const docentes = DOCENTES.filter((d) => d.faculdade === fac);
              const carga = docentes.reduce((acc, d) => acc + d.cargaSemanal, 0);
              return (
                <div key={fac}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{fac}</span>
                    <span className="text-xs text-ink-faint">{docentes.length} docentes · {carga}h/semana</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-strong">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${(carga / 90) * 100}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-ink-faint">Coordenadores: {docentes.map((d) => d.nome.split(" ")[0]).join(", ") || "—"}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}