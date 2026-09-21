"use client";

import { useState } from "react";
import { Building2, CalendarDays, GraduationCap, HeartHandshake, RotateCcw, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/dashboard/widgets";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { BackLink } from "@/components/campus/widgets";
import { useCampus } from "@/lib/campus-store";
import type { CampusConfig } from "@/data/campus/types";
import { cn } from "@/lib/utils";

const CONFIG_ROWS: { key: keyof CampusConfig; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    key: "acreditacao",
    label: "Acreditação institucional",
    description: "Mostrar aviso da avaliação externa no painel reitoral.",
    icon: ShieldCheck,
  },
  {
    key: "calendarioUnificado",
    label: "Calendário académico unificado",
    description: "Eventos e prazos partilhados por todos os cursos.",
    icon: CalendarDays,
  },
  {
    key: "bolsasAutomaticas",
    label: "Concessão automática de bolsas",
    description: "Atribuição de bolsas sociais conforme critérios aprovados.",
    icon: HeartHandshake,
  },
  {
    key: "alertasAcademicos",
    label: "Alertas académicos",
    description: "Notificações de ocupação plena e prazos de matrícula.",
    icon: GraduationCap,
  },
];

export default function ConfiguracoesPage() {
  const { state, toggleConfig, reset } = useCampus();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="space-y-6">
      <BackLink href="/app/gw-campus" label="Voltar à visão geral" />
      <PageHeader
        title="Configurações"
        description="Preferências institucionais e gestão dos dados de demonstração."
        actions={
          <>
            <Badge tone={state.config.acreditacao ? "success" : "warning"} dot>
              Instituição {state.config.acreditacao ? "acreditada" : "em avaliação"}
            </Badge>
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Políticas do campus</CardTitle>
          <CardDescription>Ativação de funcionalidades administrativas</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {CONFIG_ROWS.map((row) => {
            const enabled = state.config[row.key];
            return (
              <div key={row.key} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface-strong text-ink-muted">
                  <row.icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">{row.label}</p>
                  <p className="text-xs text-ink-muted">{row.description}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  aria-label={row.label}
                  onClick={() => toggleConfig(row.key, !enabled)}
                  className={cn(
                    "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                    enabled ? "bg-primary" : "bg-border-strong",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform",
                      enabled && "translate-x-5",
                    )}
                  />
                </button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-950">
        <CardHeader className="flex-row items-start justify-between">
          <div>
            <CardTitle>Repor dados de demonstração</CardTitle>
            <CardDescription>Restabelece o estado inicial do GW Campus — oferta, turmas, docentes e projetos.</CardDescription>
          </div>
          <Building2 className="size-5 text-ink-faint" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => setConfirmOpen(true)}>
            <RotateCcw className="size-4" /> Repor estado inicial
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-1 text-xs text-ink-faint sm:grid-cols-2">
          <p>GW Campus v1.0 · módulo de Gestão Universitária da GW Digital Company.</p>
          <p className="sm:text-right">Dados de demonstração — sem ligação a sistemas reais.</p>
        </CardContent>
      </Card>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Repor dados de demonstração?">
        <div className="space-y-4">
          <p className="text-sm text-ink-muted">
            Esta ação restaura o estado inicial do GW Campus, descartando todas as alterações feitas à oferta, turmas, professores e
            projetos de investigação.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                reset();
                setConfirmOpen(false);
              }}
            >
              Repor agora
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}