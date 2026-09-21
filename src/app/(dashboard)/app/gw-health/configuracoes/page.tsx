"use client";

import { useState } from "react";
import { Activity, FileHeart, HeartPulse, Pill, RotateCcw, ShieldCheck, Video } from "lucide-react";
import { PageHeader } from "@/components/dashboard/widgets";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { BackLink } from "@/components/health/widgets";
import { useHealth } from "@/lib/health-store";
import type { HealthConfig } from "@/data/health/types";
import { cn } from "@/lib/utils";

const CONFIG_ROWS: { key: keyof HealthConfig; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    key: "prontuarioUnico",
    label: "Prontuário Eletrónico Único",
    description: "Histórico clínico partilhado entre todas as unidades de saúde.",
    icon: FileHeart,
  },
  {
    key: "telemedicina",
    label: "Telemedicina",
    description: "Teleconsultas por vídeo com assinatura no prontuário.",
    icon: Video,
  },
  {
    key: "alertaSurtos",
    label: "Alertas de surtos",
    description: "Notificação automática de doenças de declaração obrigatória.",
    icon: Activity,
  },
  {
    key: "stockCritico",
    label: "Stock crítico",
    description: "Avisos de reposição automáticos para a farmácia central.",
    icon: Pill,
  },
  {
    key: "carteiraVacinacao",
    label: "Carteira de vacinação",
    description: "Registo vacinal digital sincronizado com o PNV.",
    icon: ShieldCheck,
  },
];

export default function ConfiguracoesPage() {
  const { state, toggleConfig, reset } = useHealth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="space-y-6">
      <BackLink href="/app/gw-health" label="Voltar à visão geral" />
      <PageHeader
        title="Configurações"
        description="Políticas do sistema de saúde e gestão dos dados de demonstração."
        actions={
          <Badge tone={state.config.alertaSurtos ? "success" : "warning"} dot>
            Central epidemiológica {state.config.alertaSurtos ? "ativa" : "pausada"}
          </Badge>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Políticas do sistema</CardTitle>
          <CardDescription>Ativação de funcionalidades do GW Health</CardDescription>
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
                  className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", enabled ? "bg-primary" : "bg-border-strong")}
                >
                  <span className={cn("absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform", enabled && "translate-x-5")} />
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
            <CardDescription>Restabelece o estado inicial do GW Health — cadastro, consultas, vacinas e vigilância.</CardDescription>
          </div>
          <HeartPulse className="size-5 text-ink-faint" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => setConfirmOpen(true)}>
            <RotateCcw className="size-4" /> Repor estado inicial
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-1 text-xs text-ink-faint sm:grid-cols-2">
          <p>GW Health v1.0 · módulo de Saúde Digital da GW Digital Company.</p>
          <p className="sm:text-right">Dados de demonstração — sem ligação a sistemas reais.</p>
        </CardContent>
      </Card>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Repor dados de demonstração?">
        <div className="space-y-4">
          <p className="text-sm text-ink-muted">
            Esta ação restaura o estado inicial do GW Health, descartando todas as alterações a pacientes, consultas, vacinas,
            medicamentos e surtos.
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