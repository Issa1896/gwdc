"use client";

import { useState } from "react";
import { CalendarClock, Handshake, Plus, Share2 } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/dashboard/widgets";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Switch } from "@/components/education/widgets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BackLink, ConsentStatusBadge } from "@/components/bank/widgets";
import { useBank } from "@/lib/bank-store";

const SCOPES = [
  "Saldos",
  "Movimentações",
  "Comprovantes",
  "Perfil de fluxo",
  "Saldos agregados",
  "Limites de exposição",
  "Contrapartes",
];

export default function OpenFinancePage() {
  const { state, toggleConfig, revokeConsent, renewConsent, grantConsent } = useBank();
  const [modalOpen, setModalOpen] = useState(false);
  const [partner, setPartner] = useState("");
  const [entity, setEntity] = useState("");
  const [scopes, setScopes] = useState<string[]>(["Saldos"]);

  const active = state.consents.filter((c) => c.status === "active");
  const revoked = state.consents.filter((c) => c.status === "revoked");
  const expiringSoon = active.filter((c) => {
    const days = (new Date(c.expiresAt).getTime() - Date.now()) / 864e5;
    return days <= 30;
  }).length;

  function toggleScope(scope: string) {
    setScopes((prev) => (prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]));
  }

  function submitConsent() {
    if (!partner.trim() || !entity.trim() || scopes.length === 0) return;
    grantConsent({ partner: partner.trim(), entity: entity.trim(), scopes });
    setPartner("");
    setEntity("");
    setScopes(["Saldos"]);
    setModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <BackLink />
      <PageHeader
        title="Open Finance"
        description="Partilha de dados bancários com terceiros sob o padrão BCEAO — consenso transparente e revogável."
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="size-4" /> Novo consentimento
          </Button>
        }
      />

      <Card className="flex flex-wrap items-center justify-between gap-3 border-sky-200 bg-sky-50/60 p-4 dark:border-sky-900 dark:bg-sky-950/30">
        <div className="flex items-start gap-3">
          <Share2 className="mt-0.5 size-4 shrink-0 text-sky-600" />
          <p className="text-sm text-ink-muted">
            <strong className="text-ink">Open Banking regulado.</strong> Os dados só são partilhados com o consentimento
            explícito e auditável, revogável a qualquer momento, com prazo máximo de 180 dias por concessão.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-muted">Programa ativo</span>
          <Switch checked={state.config.openFinance} onChange={(v) => toggleConfig("openFinance", v)} />
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-5"><p className="text-xs text-ink-muted">Consentimentos ativos</p><p className="mt-1 font-display text-2xl font-bold text-ink">{active.length}</p></Card>
        <Card className="p-5"><p className="text-xs text-ink-muted">Revogados</p><p className="mt-1 font-display text-2xl font-bold text-ink">{revoked.length}</p></Card>
        <Card className="p-5"><p className="text-xs text-ink-muted">A expirar &lt; 30 dias</p><p className="mt-1 font-display text-2xl font-bold text-ink">{expiringSoon}</p></Card>
      </div>

      <Card>
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Handshake className="size-4 text-ink-muted" />
          <div>
            <h2 className="font-display text-base font-semibold text-ink">Matriz de consentimentos</h2>
            <p className="text-xs text-ink-muted">Quem acede, a que dados e até quando.</p>
          </div>
        </div>
        {state.consents.length === 0 ? (
          <EmptyState title="Sem consentimentos" description="Concessões de dados aparecerão aqui." icon={Handshake} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parceiro</TableHead>
                <TableHead>Finalidade</TableHead>
                <TableHead>Âmbitos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Concedido em</TableHead>
                <TableHead>Expira em</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.consents.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <p className="text-sm font-semibold text-ink">{c.partner}</p>
                    <p className="text-xs text-ink-muted">{c.entity}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex max-w-56 flex-wrap gap-1">
                      {c.scopes.map((s) => (
                        <Badge key={s} tone="neutral">{s}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell><ConsentStatusBadge status={c.status} /></TableCell>
                  <TableCell className="text-sm text-ink-muted">{c.grantedAt}</TableCell>
                  <TableCell className="text-sm text-ink-muted">{c.expiresAt}</TableCell>
                  <TableCell>
                    {c.status === "active" ? (
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="sm" onClick={() => renewConsent(c.id)}>
                          <CalendarClock className="size-3.5" /> Renovar
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => revokeConsent(c.id)}>Revogar</Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => renewConsent(c.id)}>Reativar</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo consentimento (Open Finance)">
        <div className="space-y-4">
          <div>
            <label htmlFor="ofpartner" className="mb-1.5 block text-sm font-medium text-ink">Instituição parceira</label>
            <input id="ofpartner" type="text" value={partner} onChange={(e) => setPartner(e.target.value)}
              placeholder="Ex.: GW Lend (fintech)" className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand-400" />
          </div>
          <div>
            <label htmlFor="ofentity" className="mb-1.5 block text-sm font-medium text-ink">Finalidade</label>
            <input id="ofentity" type="text" value={entity} onChange={(e) => setEntity(e.target.value)}
              placeholder="Ex.: Análise de crédito" className="w-full rounded-xl border border-border bg-canvas px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand-400" />
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink">Âmbitos de dados</p>
            <div className="flex flex-wrap gap-2">
              {SCOPES.map((s) => (
                <button key={s} type="button" onClick={() => toggleScope(s)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${scopes.includes(s) ? "border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300" : "border-border text-ink-muted hover:border-sky-300"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-ink-muted">Concessão máxima de 180 dias, renovável apenas com novo consenso.</p>
          <Button className="w-full" onClick={submitConsent} disabled={!partner.trim() || !entity.trim() || scopes.length === 0}>
            Conceder consentimento
          </Button>
        </div>
      </Modal>
    </div>
  );
}