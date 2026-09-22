"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Megaphone,
  Radio,
  Smartphone,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClimate, type AlertaClimatico } from "@/lib/climate-store";

export default function AlertasClimaticosPage() {
  const { state, emitirAlerta, desativarAlerta } = useClimate();

  const [modalNovo, setModalNovo] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [severidade, setSeveridade] = useState<AlertaClimatico["severidade"]>("alto");
  const [regiao, setRegiao] = useState("Região de Bafatá / Rio Geba");
  const [descricaoPt, setDescricaoPt] = useState("");
  const [descricaoCrioulo, setDescricaoCrioulo] = useState("");
  const [validoAte, setValidoAte] = useState("2026-09-24 18:00");
  const [sucessoMsg, setSucessoMsg] = useState("");

  const handleSalvarAlerta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !regiao) return;

    emitirAlerta({
      titulo,
      severidade,
      regiao,
      descricaoPt: descricaoPt || titulo,
      descricaoCrioulo: descricaoCrioulo || titulo,
      validoAte,
      canais: ["SMS em Crioulo", "Defesa Civil", "Rádio Nacional", "GW Citizen"],
    });

    setSucessoMsg("Alerta meteorológico emitido e transmitido para as redes de telecomunicações e Defesa Civil!");
    setModalNovo(false);
    setTitulo("");
    setDescricaoPt("");
    setDescricaoCrioulo("");
    setTimeout(() => setSucessoMsg(""), 6000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Central de Alertas Precoces & Defesa Civil
          </h2>
          <p className="text-sm text-ink-muted">
            Transmissão de avisos meteorológicos de emergência via SMS em Crioulo e Rádio Nacional.
          </p>
        </div>

        <Button
          onClick={() => setModalNovo(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          <Megaphone className="size-4 mr-1.5" /> Disparar Novo Alerta
        </Button>
      </div>

      {sucessoMsg && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-4 text-sm text-emerald-900 dark:text-emerald-200 border border-emerald-500/20">
          <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
          <span>{sucessoMsg}</span>
        </div>
      )}

      {/* Lista de Alertas Ativos e Histórico */}
      <div className="space-y-4">
        <h3 className="font-display text-base font-bold text-ink">
          Feed de Alertas Meteorológicos ({state.alertas.length})
        </h3>

        <div className="space-y-4">
          {state.alertas.map((alt) => (
            <Card
              key={alt.id}
              className={`p-5 space-y-4 border-l-4 ${
                alt.severidade === "critico"
                  ? "border-l-rose-600"
                  : alt.severidade === "alto"
                  ? "border-l-amber-600"
                  : "border-l-sky-600"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-ink-faint">
                    {alt.codigo}
                  </span>
                  <Badge
                    tone={
                      alt.severidade === "critico"
                        ? "danger"
                        : alt.severidade === "alto"
                        ? "warning"
                        : "info"
                    }
                  >
                    {alt.severidade.toUpperCase()}
                  </Badge>
                  {alt.ativo ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                      <Radio className="size-3 animate-pulse" /> Em Vigor
                    </span>
                  ) : (
                    <Badge tone="neutral">Encerrado</Badge>
                  )}
                </div>

                <span className="text-xs text-ink-muted">
                  Emitido em: {alt.emitidoEm} &bull; Válido até: {alt.validoAte}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-ink">{alt.titulo}</h4>
                <p className="text-xs text-ink-muted mt-0.5 font-medium">
                  Área Afetada: <strong className="text-ink">{alt.regiao}</strong>
                </p>
                <p className="text-xs text-ink mt-2 leading-relaxed">{alt.descricaoPt}</p>
              </div>

              {/* Mensagem em Crioulo */}
              <div className="rounded-xl bg-emerald-500/10 p-3.5 border border-emerald-500/20 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <Smartphone className="size-3.5" /> Mensagem Transmitida por SMS (Crioulo Guineense):
                  </span>
                  <span className="text-[10px] text-ink-faint font-mono">Orange GW / MTN</span>
                </div>
                <p className="italic text-ink leading-relaxed">&ldquo;{alt.descricaoCrioulo}&rdquo;</p>
              </div>

              {/* Canais de Disparo */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-border-subtle text-xs">
                <div className="flex flex-wrap gap-1.5">
                  {alt.canais.map((c) => (
                    <span
                      key={c}
                      className="rounded bg-surface-raised px-2 py-0.5 text-[11px] font-medium text-ink-muted border border-border-subtle"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                {alt.ativo && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => desativarAlerta(alt.id)}
                    className="text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    Encerrar Alerta
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal Disparar Alerta */}
      {modalNovo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="font-display text-base font-bold text-ink">Disparar Alerta Meteorológico</h3>
              <button onClick={() => setModalNovo(false)} className="text-xs text-ink-muted hover:text-ink">
                Cancelar
              </button>
            </div>

            <form onSubmit={handleSalvarAlerta} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-ink">Título do Alerta</label>
                <Input
                  required
                  placeholder="Ex: Alerta de Monção Forte e Inundação em Bafatá"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-semibold text-ink">Severidade do Risco</label>
                  <select
                    value={severidade}
                    onChange={(e) => setSeveridade(e.target.value as AlertaClimatico["severidade"])}
                    className="mt-1 w-full rounded-lg border border-border-subtle bg-surface p-2 text-xs text-ink"
                  >
                    <option value="critico">Crítico (Perigo Iminente)</option>
                    <option value="alto">Alto (Requer Ação Imediata)</option>
                    <option value="moderado">Moderado (Atenção)</option>
                    <option value="informativo">Informativo</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-ink">Região / Província</label>
                  <Input
                    required
                    value={regiao}
                    onChange={(e) => setRegiao(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-ink">Descrição Oficial (Português)</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explicação técnica da situação e orientações da Defesa Civil..."
                  value={descricaoPt}
                  onChange={(e) => setDescricaoPt(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border-subtle bg-surface p-2 text-xs text-ink focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-ink flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                  <Smartphone className="size-3.5" /> Texto para Disparo por SMS (Crioulo Guineense)
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ex: Tchuba pisadu dimás na Rio Geba. Povu di Bafatá dibi di toma kuidadu..."
                  value={descricaoCrioulo}
                  onChange={(e) => setDescricaoCrioulo(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border-subtle bg-surface p-2 text-xs text-ink focus:border-emerald-600 focus:outline-none italic"
                />
              </div>

              <div>
                <label className="font-semibold text-ink">Validade do Alerta</label>
                <Input
                  required
                  value={validoAte}
                  onChange={(e) => setValidoAte(e.target.value)}
                  className="mt-1 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalNovo(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                  Confirmar e Transmitir
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
