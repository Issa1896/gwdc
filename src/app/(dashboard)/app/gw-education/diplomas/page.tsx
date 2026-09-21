"use client";

import { useState } from "react";
import { BadgeCheck, FileCheck2, Printer, ScrollText, ShieldCheck, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PageHeader, KpiCard } from "@/components/dashboard/widgets";
import { BackLink } from "@/components/education/widgets";
import { CURSO_BY_ID } from "@/data/education";
import { useEducation } from "@/lib/education-store";

/** Diplomas — emissão digital e verificação pública por QR Code. */
export default function DiplomasPage() {
  const { state, emitirDiploma, verificarDiploma } = useEducation();
  const [verifyId, setVerifyId] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [emitir, setEmitir] = useState(false);
  const [escolhido, setEscolhido] = useState("");

  const diploma = state.diplomas.find((d) => d.id === verifyId) ?? null;

  const candidatos = state.alunos
    .filter((a) => !state.diplomas.some((d) => d.studentName === a.nome))
    .sort((a, b) => (a.status === "concluinte" ? -1 : 1) - (b.status === "concluinte" ? -1 : 1));

  const openVerification = (id: string) => {
    setVerified(false);
    setVerifyId(id);
    window.setTimeout(() => {
      setVerified(true);
      verificarDiploma(id, "Validação de autenticidade — portal público");
    }, 900);
  };

  const confirmarEmissao = () => {
    const aluno = state.alunos.find((a) => a.id === escolhido);
    if (!aluno) return;
    const curso = CURSO_BY_ID.get(aluno.cursoId);
    emitirDiploma(aluno.nome, `Licenciatura em ${curso?.nome ?? "Estudos Gerais"}`, "Universidade Amílcar Cabral");
    setEmitir(false);
    setEscolhido("");
  };

  const totalChecks = state.diplomas.reduce((acc, d) => acc + d.verifiedCount, 0);

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Diplomas e Certificados"
        description="Emissão digital com assinatura da instituição e verificação pública por QR Code — fim das falsificações."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { setEmitir(true); setEscolhido(candidatos[0]?.id ?? ""); }}>
              <UserPlus className="size-3.5" /> Emitir diploma
            </Button>
            <Badge tone="brand" className="self-start">Livro aberto nacional</Badge>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Emitidos no semestre" value={String(state.diplomas.length)} delta={3.2} icon={ScrollText} tone="brand" spark={[2, 3, 3, 4, 5, 5, 6, state.diplomas.length]} />
        <KpiCard title="Emitidos historicamente" value="18.420" delta={8.4} icon={FileCheck2} tone="navy" spark={[9800, 11200, 12400, 13600, 15000, 16200, 17400, 18420]} />
        <KpiCard title="Verificações públicas" value={totalChecks.toLocaleString("pt-PT")} delta={14.1} icon={ShieldCheck} tone="gold" spark={[6800, 7900, 9100, 10800, 12200, 13500, 14200, totalChecks]} />
        <KpiCard title="Instituições integradas" value="18" delta={1.0} icon={BadgeCheck} tone="brand" spark={[10, 12, 13, 14, 15, 16, 17, 18]} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Emissões */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Registo de diplomas emitidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.diplomas.map((d) => (
              <div key={d.id} className="flex flex-col gap-3 rounded-xl border border-border p-4 lg:flex-row lg:items-center">
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
                  <ScrollText className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">{d.studentName}</p>
                  <p className="text-xs text-ink-muted">
                    {d.course} · {d.institution}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-ink-faint">{d.code} · emitido em {d.issuedAt}</p>
                </div>
                <Badge tone={d.status === "Verificado" ? "success" : d.status === "Emitido" ? "info" : "warning"} dot>
                  {d.status}
                </Badge>
                <Button size="sm" variant="outline" onClick={() => openVerification(d.id)}>
                  <ShieldCheck className="size-3.5" /> Verificar
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Livro de verificações */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Livro público de verificações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.log.map((v) => (
              <div key={v.hash} className="rounded-xl border border-border p-3">
                <p className="font-mono text-xs text-ink">Hash: {v.hash}</p>
                <p className="mt-1 text-xs text-ink-muted">{v.holder}</p>
                <p className="text-[11px] text-ink-faint">{v.date}</p>
              </div>
            ))}
            <p className="pt-1 text-xs text-ink-faint">
              Cada verificação gera um registo imutável, auditável por empregadores e instituições.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Verificação por QR Code */}
      <Modal
        open={Boolean(diploma)}
        onClose={() => setVerifyId(null)}
        title={verified ? "Diploma autêntico" : "Verificando diploma…"}
      >
        {diploma && (
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <div className="grid size-44 place-items-center rounded-xl border border-border bg-white p-4 dark:bg-surface-strong">
              {verified ? (
                <div className="grid grid-cols-7 gap-1" aria-hidden="true">
                  {Array.from({ length: 49 }).map((_, i) => (
                    <span key={i} className="size-3 bg-navy-950" style={{ opacity: [1, 0, 1, 1, 0, 0, 1][i % 7] }} />
                  ))}
                </div>
              ) : (
                <span className="size-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" aria-hidden="true" />
              )}
            </div>
            {verified ? (
              <>
                <div>
                  <p className="font-display text-lg font-bold text-ink">
                    {diploma.studentName} — {diploma.course}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {diploma.institution} · {diploma.code}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge tone="success">
                    <ShieldCheck className="size-3" /> Assinatura digital válida
                  </Badge>
                  <Badge tone="brand">{diploma.verifiedCount} verificações registadas</Badge>
                </div>
                <Button size="sm" variant="outline" onClick={() => setVerifyId(null)}>
                  <Printer className="size-3.5" /> Imprimir comprovativo
                </Button>
              </>
            ) : (
              <p className="text-sm text-ink-muted">Consultando o livro aberto nacional…</p>
            )}
          </div>
        )}
      </Modal>

      {/* Emissão */}
      <Modal
        open={emitir}
        onClose={() => setEmitir(false)}
        title="Emitir diploma digital"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEmitir(false)}>Cancelar</Button>
            <Button onClick={confirmarEmissao}><UserPlus className="size-4" /> Emitir diploma</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label>Estudante</Label>
            <Select value={escolhido} onChange={(e) => setEscolhido(e.target.value)}>
              {candidatos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome} — {CURSO_BY_ID.get(a.cursoId)?.nome ?? "—"}
                </option>
              ))}
            </Select>
          </div>
          {escolhido && (
            <p className="text-xs text-ink-faint">
              Será gerado o código de verificação, a assinatura digital da instituição e o registo no livro aberto nacional.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}