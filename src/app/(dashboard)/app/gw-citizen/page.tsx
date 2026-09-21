"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Phone,
  QrCode,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCitizen } from "@/lib/citizen-store";

export default function CitizenPortalPage() {
  const { state, solicitarServico } = useCitizen();
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("todos");
  const [feedbackPedido, setFeedbackPedido] = useState<string | null>(null);

  const servicosFiltrados =
    categoriaAtiva === "todos"
      ? state.servicos
      : state.servicos.filter((s) => s.categoria === categoriaAtiva);

  function handleSolicitar(id: string, nome: string) {
    const pedido = solicitarServico(id);
    setFeedbackPedido(`Pedido ${pedido.codigoAcompanhamento} registrado com sucesso para "${nome}".`);
    setTimeout(() => setFeedbackPedido(null), 5000);
  }

  return (
    <div className="space-y-6">
      {/* Banner Principal do Cidadão */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 p-6 text-white shadow-xl sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold tracking-wide text-blue-200 backdrop-blur-md">
            <ShieldCheck className="size-3.5 text-blue-300" /> Portal do Cidadão GOV.GW
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Olá, Bacari Djassi Embaló
          </h2>
          <p className="text-sm text-blue-100/90 sm:text-base">
            Todos os seus documentos soberanos, certidões públicas e serviços do Estado guineense acessíveis pelo celular ou computador.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link href="/app/gw-citizen/carteira">
              <Button className="bg-white text-blue-900 hover:bg-blue-50">
                <Wallet className="size-4" /> Minha Carteira Digital (4 documentos)
              </Button>
            </Link>
            <Link href="/app/gw-citizen/ussd">
              <Button variant="outline" className="border-blue-400/40 text-white hover:bg-blue-800/50">
                <Phone className="size-4" /> Acessar via USSD (*123#)
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {feedbackPedido && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
          <CheckCircle2 className="size-4 text-emerald-600" />
          <span>{feedbackPedido}</span>
        </div>
      )}

      {/* Atalho dos Documentos da Carteira */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-base font-bold text-ink">Minha Carteira Digital</h3>
          <Link href="/app/gw-citizen/carteira" className="text-xs font-medium text-blue-600 hover:underline">
            Abrir carteira completa &rarr;
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {state.documentos.map((doc) => (
            <Link key={doc.id} href="/app/gw-citizen/carteira">
              <Card className="p-4 transition hover:border-blue-500/40 hover:shadow-md cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">
                    {doc.numero}
                  </span>
                  <Badge tone="success" className="text-[9px]">Válido</Badge>
                </div>
                <h4 className="mt-2 text-xs font-bold text-ink truncate">{doc.titulo}</h4>
                <p className="mt-0.5 text-[11px] text-ink-muted">Validade: {doc.validade}</p>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                  <QrCode className="size-3" /> Ver código de autenticidade
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Meus Pedidos & Acompanhamento */}
      <div className="space-y-3">
        <h3 className="font-display text-base font-bold text-ink">Meus Pedidos & Protocolos</h3>
        <Card className="divide-y divide-border p-0">
          {state.pedidos.map((ped) => {
            const tone =
              ped.status === "concluido"
                ? "success"
                : ped.status === "pronto_para_retirada"
                  ? "info"
                  : "warning";

            return (
              <div key={ped.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-ink">{ped.codigoAcompanhamento}</span>
                    <Badge tone={tone} className="text-[10px] uppercase">
                      {ped.status.replace(/_/g, " ")}
                    </Badge>
                    <span className="text-[11px] text-ink-faint">Solicitado em: {ped.dataSolicitacao}</span>
                  </div>
                  <h4 className="mt-1 text-sm font-semibold text-ink">{ped.servicoNome}</h4>
                  <p className="text-xs text-ink-muted">{ped.orgaoResponsavel}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-ink">
                    {ped.taxaFCFA > 0 ? `${ped.taxaFCFA.toLocaleString()} FCFA` : "Gratuito"}
                  </span>
                  <p className="text-[10px] text-ink-muted">Prazo: {ped.prazoDiasUteis} dias úteis</p>
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Balcão Único de Serviços do Estado */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-base font-bold text-ink">Catálogo de Serviços GOV.GW</h3>
            <p className="text-xs text-ink-muted">Solicite certidões, atendimentos médicos e renovações online</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "todos", label: "Todos" },
              { id: "Identidade & Civil", label: "Civil & BI" },
              { id: "Saúde", label: "Saúde" },
              { id: "Transportes", label: "Transportes" },
              { id: "Finanças & Impostos", label: "Finanças" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoriaAtiva(cat.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  categoriaAtiva === cat.id
                    ? "bg-blue-600 text-white font-semibold"
                    : "border border-border bg-surface text-ink-muted hover:bg-surface-strong"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {servicosFiltrados.map((srv) => (
            <Card key={srv.id} className="p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <Badge tone="neutral" className="text-[9px]">{srv.categoria}</Badge>
                  <span className="text-xs font-bold text-ink">
                    {srv.taxaFCFA > 0 ? `${srv.taxaFCFA.toLocaleString()} FCFA` : "Isento"}
                  </span>
                </div>
                <h4 className="mt-2 text-sm font-bold text-ink">{srv.nome}</h4>
                <p className="mt-1 text-xs text-ink-muted leading-relaxed">{srv.descricao}</p>
              </div>

              <div className="border-t border-border/80 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] text-ink-faint">Prazo: {srv.prazoMedio}</span>
                <Button
                  size="sm"
                  onClick={() => handleSolicitar(srv.id, srv.nome)}
                  className="bg-blue-600 hover:bg-blue-700 text-xs"
                >
                  Solicitar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
