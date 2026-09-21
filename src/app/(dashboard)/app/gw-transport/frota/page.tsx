"use client";

import { useState } from "react";
import {
  Bus,
  MapPin,
  Ship,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTransport } from "@/lib/transport-store";

export default function FrotaPage() {
  const { state, atualizarStatusVeiculo } = useTransport();
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const frotaFiltrada = state.frota.filter((v) => {
    if (filtroTipo === "rodoviario") return v.tipo.includes("Ônibus");
    if (filtroTipo === "maritimo") return v.tipo.includes("Navio") || v.tipo.includes("Ferryboat");
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
            Rastreamento de Frotas & Rotas Soberanas
          </h2>
          <p className="text-xs text-ink-muted sm:text-sm">
            Monitoramento de comboios rodoviários e embarcações da costa e ilhas dos Bijagós.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink focus:outline-hidden"
          >
            <option value="todos">Todos os Veículos & Barcos</option>
            <option value="rodoviario">Ônibus Interurbanos</option>
            <option value="maritimo">Navios & Ferryboats</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {frotaFiltrada.map((v) => {
          const isMaritimo = v.tipo.includes("Navio") || v.tipo.includes("Ferry");
          const tone =
            v.status === "em_transito"
              ? "success"
              : v.status === "parado_estacao"
                ? "warning"
                : "danger";

          return (
            <Card key={v.id} className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`grid size-11 place-items-center rounded-xl ${
                      isMaritimo
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300"
                        : "bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300"
                    }`}
                  >
                    {isMaritimo ? <Ship className="size-6" /> : <Bus className="size-6" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-400">
                        {v.identificador}
                      </span>
                      <Badge tone={tone} className="text-[10px] uppercase">
                        {v.status === "em_transito" ? "Em Viagem" : "Parado na Estação"}
                      </Badge>
                    </div>
                    <h3 className="font-display text-sm font-bold text-ink">{v.nome}</h3>
                    <p className="text-xs text-ink-muted">{v.tipo}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-ink">{v.velocidadeAtual}</span>
                  <p className="text-[10px] text-ink-muted">Velocidade</p>
                </div>
              </div>

              {/* Trajeto e Paradas */}
              <div className="rounded-xl border border-border bg-surface-muted/60 p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">Linha em Curso:</span>
                  <strong className="text-ink">{v.rotaNome}</strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">Próxima Parada:</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-sky-700 dark:text-sky-400">
                    <MapPin className="size-3" /> {v.proximaParada}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-ink-muted">Tempo Estimado (ETA):</span>
                  <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                    {v.eta}
                  </span>
                </div>
              </div>

              {/* Ocupação e Ações */}
              <div className="flex items-center justify-between pt-1">
                <div className="text-xs text-ink-muted">
                  Ocupação: <strong className="text-ink">{v.assentosOcupados} / {v.capacidadeTotal}</strong> passageiros
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      atualizarStatusVeiculo(
                        v.id,
                        v.status === "em_transito" ? "parado_estacao" : "em_transito",
                      )
                    }
                    className="text-[11px]"
                  >
                    {v.status === "em_transito" ? "Pausar Viagem" : "Iniciar Viagem"}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
