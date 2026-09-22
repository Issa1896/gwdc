"use client";

import {
  Leaf,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClimate } from "@/lib/climate-store";

export default function MangaisPage() {
  const { state } = useClimate();

  const totalHectares = state.mangais.reduce((acc, m) => acc + m.areaHectares, 0);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
          Observatório de Manguezais & Carbono Azul
        </h2>
        <p className="text-sm text-ink-muted">
          Monitoramento por satélite e índice NDVI dos tarrafes, estuários e arrozais de bolanha da Guiné-Bissau.
        </p>
      </div>

      {/* Banner Informativo */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-950 p-6 text-white shadow-lg space-y-3">
        <div className="flex items-center gap-2">
          <Leaf className="size-5 text-emerald-400" />
          <h3 className="font-display text-lg font-bold">
            Guiné-Bissau: Segundo Maior Ecossistema de Mangais da África Ocidental
          </h3>
        </div>
        <p className="text-xs text-emerald-100/90 max-w-3xl leading-relaxed">
          Os manguezais (*tarrafes*) cobrem mais de 300 mil hectares do litoral guineense, sustentando a reprodução marinha, filtragem estuarina e a tradicional cultura do arroz de bolanha. Este observatório utiliza dados de sensoriamento remoto para detectar desmatamento e subsidiar créditos de carbono azul soberanos.
        </p>
        <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-emerald-200">
          <span>Área Monitorada: <strong>{totalHectares.toLocaleString("pt-GW")} hectares</strong></span>
          <span>&bull;</span>
          <span>Índice NDVI Médio: <strong>0.77 (Saúde Ótima)</strong></span>
          <span>&bull;</span>
          <span>UNESCO: <strong>Reserva da Biosfera dos Bijagós</strong></span>
        </div>
      </div>

      {/* Grid de Zonas de Mangais */}
      <div className="grid gap-4 sm:grid-cols-2">
        {state.mangais.map((zona) => (
          <Card key={zona.id} className="p-6 space-y-4 hover:border-emerald-500/40 transition">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {zona.regiao}
                </span>
                <h4 className="text-base font-bold text-ink">{zona.nome}</h4>
                <p className="text-xs text-ink-muted">{zona.bioma}</p>
              </div>

              <Badge
                tone={
                  zona.status === "Excelente"
                    ? "success"
                    : zona.status === "Vulnerável"
                    ? "warning"
                    : "danger"
                }
              >
                {zona.status}
              </Badge>
            </div>

            {/* Barra de Saúde NDVI */}
            <div className="space-y-1.5 rounded-lg bg-surface-raised p-3 border border-border-subtle">
              <div className="flex justify-between text-xs">
                <span className="text-ink-muted">Densidade Vegetal (NDVI Satelital):</span>
                <strong className="font-mono text-ink">{zona.indiceNDVI.toFixed(2)} / 1.00</strong>
              </div>

              <div className="w-full bg-border-subtle rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${zona.indiceNDVI * 100}%` }}
                />
              </div>

              <p className="text-[10px] text-ink-faint pt-1">
                Valores acima de 0.70 indicam dossel denso e regeneração contínua.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs border-t border-border-subtle pt-3 text-ink-muted">
              <span>Extensão: <strong>{zona.areaHectares.toLocaleString("pt-GW")} ha</strong></span>
              <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="size-3.5" /> Área Protegida
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
