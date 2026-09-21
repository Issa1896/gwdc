"use client";

import { useState } from "react";
import { CheckCircle2, ClipboardList, FileCheck2, Hourglass, UserPlus, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, KpiCard, EmptyState } from "@/components/dashboard/widgets";
import { BackLink } from "@/components/education/widgets";
import { useEducation } from "@/lib/education-store";

type Decision = "aprovado" | "recusado";

/** Matrículas — fila de análise operacional (2026/2027). */
export default function MatriculasPage() {
  const { state, aprovarMatricula, recusarMatricula } = useEducation();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [lastName, setLastName] = useState("");

  const decide = (id: string, studentName: string, outcome: Decision) => {
    if (outcome === "aprovado") aprovarMatricula(id);
    else recusarMatricula(id);
    setDecision(outcome);
    setLastName(studentName);
    window.setTimeout(() => setDecision(null), 3200);
  };

  const aprovadas = state.recentes.filter((r) => r.status === "Confirmada").length;
  const pendenteDocs = state.fila.filter((m) => m.documents.length < 3).length;

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Matrículas — Processo Seletivo 2026/2027"
        description="Matrícula 100% digital com validação de documentos por IA: do pedido à confirmação sem papel."
        actions={
          <Badge tone="gold" className="self-start">
            1ª fase · até 05/09/2026
          </Badge>
        }
      />

      {decision && (
        <Alert tone={decision === "aprovado" ? "success" : "danger"} title={decision === "aprovado" ? "Matrícula aprovada" : "Pedido recusado"}>
          {decision === "aprovado"
            ? `${lastName} foi matriculado(a), inscrito(a) na turma do curso e notificado(a) por SMS e e-mail. A fatura da 1ª parcela da propina foi gerada automaticamente.`
            : `${lastName} foi notificado(a). Documentação poderá ser corrigida e reenviada.`}
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Pedidos recebidos" value={String(state.fila.length + state.recentes.length)} delta={12.4} icon={UserPlus} tone="brand" spark={[8, 12, 15, 18, 20, 22, 24, 26]} />
        <KpiCard title="Aprovações" value={String(aprovadas)} delta={9.1} icon={CheckCircle2} tone="navy" spark={[10, 12, 13, 15, 16, 17, 18, aprovadas]} />
        <KpiCard title="Em análise" value={String(state.fila.length)} delta={-4.3} icon={Hourglass} tone="gold" spark={[4, 6, 8, 9, 9, 10, 9, state.fila.length]} />
        <KpiCard title="Documentação pendente" value={String(pendenteDocs)} delta={-18.2} icon={FileCheck2} tone="brand" spark={[6, 5, 5, 4, 4, 3, 2, pendenteDocs]} />
      </div>

      {/* Fila de análise */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <ClipboardList className="size-4 text-brand-500" /> Fila de análise — validação por IA
          </CardTitle>
          <Badge tone="info">Ordem cronológica</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {state.fila.length === 0 && (
            <EmptyState title="Fila vazia" description="Todos os pedidos foram analisados. Novos pedidos aparecerão aqui automaticamente." icon={CheckCircle2} />
          )}
          {state.fila.map((m) => (
            <div key={m.id} className="flex flex-col gap-3 rounded-xl border border-border p-4 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{m.studentName}</p>
                <p className="text-xs text-ink-muted">
                  {m.course} · {m.preference}ª opção · Pedido em {m.requestedAt} · {m.regiao ?? "—"}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.documents.map((doc) => (
                    <Badge key={doc} tone="success">
                      <FileCheck2 className="size-3" /> {doc}
                    </Badge>
                  ))}
                  {m.documents.length < 4 && <Badge tone="warning">Validação IA concluída: 96%</Badge>}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="primary" onClick={() => decide(m.id, m.studentName, "aprovado")}>
                  <CheckCircle2 className="size-3.5" /> Aprovar
                </Button>
                <Button size="sm" variant="outline" onClick={() => decide(m.id, m.studentName, "recusado")} className="text-danger hover:border-danger hover:text-danger">
                  <XCircle className="size-3.5" /> Recusar
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Histórico recente */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Matrículas recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-2">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Estudante</TableHeader>
                <TableHeader>Curso</TableHeader>
                <TableHeader>Data</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.recentes.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-ink">{r.student}</TableCell>
                  <TableCell className="text-xs text-ink-muted">{r.course}</TableCell>
                  <TableCell className="text-xs text-ink-muted">{r.date}</TableCell>
                  <TableCell>
                    <Badge tone={r.status === "Confirmada" ? "success" : r.status === "Cobrança pendente" ? "warning" : "info"}>{r.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}