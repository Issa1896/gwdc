"use client";

import { useState } from "react";
import { Bell, CalendarCheck, RotateCcw, Save, ShieldCheck, Sparkles, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Select } from "@/components/ui/input";
import { BackLink, Switch } from "@/components/education/widgets";
import { PageHeader } from "@/components/dashboard/widgets";
import { CALENDAR_CATEGORIES } from "@/data/education";
import { useEducation } from "@/lib/education-store";

const groups = [
  {
    title: "Notificações",
    description: "Canais e eventos que geram avisos automáticos.",
    icon: Bell,
    items: [
      { id: "sms", label: "SMS para encarregados de educação", hint: "Faltas, notas e comunicados escolares." },
      { id: "email", label: "Resumo semanal por e-mail", hint: "Boletim de indicadores da instituição." },
      { id: "prazos", label: "Alertas de prazos acadêmicos", hint: "Matrículas, provas e entrega de notas." },
    ],
  },
  {
    title: "Acadêmico",
    description: "Políticas de funcionamento dos portais.",
    icon: CalendarCheck,
    items: [
      { id: "matricula-auto", label: "Matrícula automática na 2ª fase", hint: "Alunos com documentos validados por IA são matriculados sem análise manual." },
      { id: "freq75", label: "Bloqueio de avaliação abaixo de 75%", hint: "Estudantes com frequência insuficiente não podem realizar provas." },
      { id: "boletim-range", label: "Publicação de boletim por faixa", hint: "Notas liberadas por curso para evitar sobrecarga." },
    ],
  },
  {
    title: "Inteligência e segurança",
    description: "Assistência por IA e proteção do sistema.",
    icon: Sparkles,
    items: [
      { id: "ia-evasao", label: "Modelo preditivo de evasão", hint: "Alerta semanal de estudantes em risco, por região." },
      { id: "ia-correcao", label: "Correção assistida de provas", hint: "Sugestão de notas com revisão do docente." },
      { id: "anti-copia", label: "Monitoramento anti-cópia", hint: "Câmera, bloqueio de abas e detecção de múltiplos dispositivos." },
    ],
  },
];

/** MÓDULO 6 — Configurações do sistema acadêmico (persistidas). */
export default function ConfiguracoesPage() {
  const { state, setConfig, setAnoLetivo, setInstituicao, resetar } = useEducation();
  const enabled = state.config;
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => {
    setConfig(id, !enabled[id]);
  };

  const confirmarRestauro = () => {
    if (!window.confirm("Restaurar os dados iniciais do sistema? Todas as alterações feitas serão perdidas.")) return;
    resetar();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Configurações"
        description="Políticas do sistema nacional: notificações, regras acadêmicas e assistência por IA."
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={confirmarRestauro}>
              <RotateCcw className="size-4" /> Restaurar dados iniciais
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setSaved(true);
                window.setTimeout(() => setSaved(false), 2500);
              }}
            >
              <Save className="size-4" /> Guardar alterações
            </Button>
          </div>
        }
      />

      {saved && <Alert tone="success" title="Configurações guardadas">Aplicadas em todas as instituições conectadas na próxima sincronização.</Alert>}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="ano-letivo">
            Ano letivo vigente
          </label>
          <Select id="ano-letivo" value={state.anoLetivo} onChange={(e) => setAnoLetivo(e.target.value)}>
            <option value="2026/2027">2026/2027</option>
            <option value="2025/2026">2025/2026</option>
            <option value="2027/2028">2027/2028</option>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="regiao">
            Instituição-padrão
          </label>
          <Select id="regiao" value={state.instituicao} onChange={(e) => setInstituicao(e.target.value)}>
            <option value="uac">Universidade Amílcar Cabral</option>
            <option value="ise">Instituto Superior de Ciências de Educação</option>
            <option value="inep">Instituto Nacional de Estudos e Pesquisa</option>
            <option value="mec">Ministério da Educação (visão nacional)</option>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.title} className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <group.icon className="size-4 text-brand-500" /> {group.title}
              </CardTitle>
              <p className="text-xs text-ink-muted">{group.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {group.items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{item.label}</p>
                    <p className="mt-0.5 text-xs text-ink-faint">{item.hint}</p>
                  </div>
                  <Switch checked={enabled[item.id] ?? false} onChange={() => toggle(item.id)} label={item.label} />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ShieldCheck className="size-4 text-brand-500" /> Acesso e permissões
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div className="flex items-center justify-between border-b border-border py-2.5">
            <span className="flex items-center gap-2 text-ink"><UserCheck className="size-4 text-ink-faint" /> Secretaria Acadêmica</span>
            <Badge tone="info">Todas as permissões</Badge>
          </div>
          <div className="flex items-center justify-between border-b border-border py-2.5">
            <span className="flex items-center gap-2 text-ink"><ShieldCheck className="size-4 text-ink-faint" /> Direção regional</span>
            <Badge tone="neutral">Sua região + relatórios</Badge>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="flex items-center gap-2 text-ink"><CalendarCheck className="size-4 text-ink-faint" /> Docente</span>
            <Badge tone="neutral" className="inline-flex items-center gap-1">{CALENDAR_CATEGORIES.length} eventos do calendário</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}