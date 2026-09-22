"use client";

import { useState } from "react";
import {
  CheckCircle2,
  CloudRain,
  Radio,
  Search,
  Thermometer,
  Wind,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClimate, type EstacaoMeteorologica } from "@/lib/climate-store";

export default function EstacoesPage() {
  const { state, atualizarEstacao } = useClimate();
  const [busca, setBusca] = useState("");
  const [estacaoSelecionada, setEstacaoSelecionada] = useState<EstacaoMeteorologica | null>(
    state.estacoes[0] || null
  );

  const [modalEditar, setModalEditar] = useState(false);
  const [novaTemp, setNovaTemp] = useState("");
  const [novaChuva, setNovaChuva] = useState("");
  const [sucessoMsg, setSucessoMsg] = useState("");

  const estacoesFiltradas = state.estacoes.filter((e) => {
    return (
      e.nome.toLowerCase().includes(busca.toLowerCase()) ||
      e.regiao.toLowerCase().includes(busca.toLowerCase()) ||
      e.codigo.toLowerCase().includes(busca.toLowerCase())
    );
  });

  const handleSalvarTelemetria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!estacaoSelecionada) return;

    atualizarEstacao(estacaoSelecionada.id, {
      temperatura: Number(novaTemp) || estacaoSelecionada.temperatura,
      precipitacaoMm: Number(novaChuva) || estacaoSelecionada.precipitacaoMm,
      atualizadoEm: "Atualizado agora",
    });

    setSucessoMsg(`Telemetria da estação ${estacaoSelecionada.nome} atualizada!`);
    setModalEditar(false);
    setTimeout(() => setSucessoMsg(""), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Rede de Estações Meteorológicas & Telemetria
          </h2>
          <p className="text-sm text-ink-muted">
            Sensores pluviométricos e estações automáticas interligadas em todo o território nacional.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge tone="success" className="text-xs">
            <Radio className="size-3 mr-1 animate-pulse" /> Rede IoT Ativa
          </Badge>
        </div>
      </div>

      {sucessoMsg && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
          <CheckCircle2 className="size-4" />
          <span>{sucessoMsg}</span>
        </div>
      )}

      {/* Busca */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-faint" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome da estação, região (ex: Bafatá, Bijagós, Cacheu) ou código..."
            className="pl-9"
          />
        </div>
      </Card>

      {/* Grid de Estações */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {estacoesFiltradas.map((est) => (
          <Card
            key={est.id}
            className="p-5 space-y-4 hover:border-emerald-500/40 transition border"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] text-ink-faint font-bold uppercase">
                  {est.codigo}
                </span>
                <h3 className="text-sm font-bold text-ink leading-tight">{est.nome}</h3>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  {est.regiao}
                </p>
              </div>

              <Badge tone={est.status === "alerta" ? "danger" : "success"} className="text-[10px]">
                {est.status === "alerta" ? "Alerta Monção" : "Operacional"}
              </Badge>
            </div>

            {/* Sensores em Grid */}
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-surface-raised p-3 border border-border-subtle text-center text-xs">
              <div>
                <span className="text-[10px] text-ink-faint flex items-center justify-center gap-1">
                  <Thermometer className="size-3 text-rose-500" /> Temp
                </span>
                <strong className="font-mono text-sm text-ink">{est.temperatura}°C</strong>
              </div>

              <div>
                <span className="text-[10px] text-ink-faint flex items-center justify-center gap-1">
                  <CloudRain className="size-3 text-sky-500" /> Chuva
                </span>
                <strong className="font-mono text-sm text-ink">{est.precipitacaoMm} mm</strong>
              </div>

              <div>
                <span className="text-[10px] text-ink-faint flex items-center justify-center gap-1">
                  <Wind className="size-3 text-teal-500" /> Vento
                </span>
                <strong className="font-mono text-sm text-ink">{est.ventoKmH} km/h</strong>
              </div>

              <div className="pt-2 border-t border-border-subtle">
                <span className="text-[10px] text-ink-faint">Umidade</span>
                <p className="font-mono font-semibold text-ink">{est.umidade}%</p>
              </div>

              <div className="pt-2 border-t border-border-subtle">
                <span className="text-[10px] text-ink-faint">Pressão</span>
                <p className="font-mono font-semibold text-ink">{est.pressaoHpa} hPa</p>
              </div>

              <div className="pt-2 border-t border-border-subtle">
                <span className="text-[10px] text-ink-faint">Índice UV</span>
                <p className="font-mono font-semibold text-ink">{est.indiceUv}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-ink-muted pt-1">
              <span>{est.atualizadoEm}</span>
              <button
                onClick={() => {
                  setEstacaoSelecionada(est);
                  setNovaTemp(String(est.temperatura));
                  setNovaChuva(String(est.precipitacaoMm));
                  setModalEditar(true);
                }}
                className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
              >
                Calibrar Sensor &rarr;
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de Calibração / Ajuste do Sensor */}
      {modalEditar && estacaoSelecionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-ink">Calibrar Sensor Meteorológico</h3>
                <p className="text-xs text-ink-muted">{estacaoSelecionada.nome}</p>
              </div>
              <button onClick={() => setModalEditar(false)} className="text-xs text-ink-muted hover:text-ink">
                Cancelar
              </button>
            </div>

            <form onSubmit={handleSalvarTelemetria} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-ink">Temperatura Calibrada (°C)</label>
                <Input
                  type="number"
                  step="0.1"
                  required
                  value={novaTemp}
                  onChange={(e) => setNovaTemp(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-ink">Precipitação Pluvial (mm/24h)</label>
                <Input
                  type="number"
                  step="0.1"
                  required
                  value={novaChuva}
                  onChange={(e) => setNovaChuva(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalEditar(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Gravar Telemetria
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
