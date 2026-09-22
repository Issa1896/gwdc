"use client";

import { useState } from "react";
import {
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  Gavel,
  Mic,
  MicOff,
  PhoneOff,
  PlusCircle,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJustice, type AudienciaVirtual } from "@/lib/justice-store";

export default function AudienciasVirtuaisPage() {
  const { state, agendarAudiencia, concluirAudiencia } = useJustice();

  const [audienciaAtiva, setAudienciaAtiva] = useState<AudienciaVirtual | null>(null);
  const [modalNova, setModalNova] = useState(false);

  // Estados da Sala Virtual
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [ataTexto, setAtaTexto] = useState(
    "10:32 - Aberta a sessão pelo MM. Juiz.\n10:35 - Tentativa de conciliação iniciada.\n10:41 - Apresentada proposta de acordo pelas partes."
  );

  // Form de nova audiência
  const [novoProcessoId, setNovoProcessoId] = useState(state.processos[0]?.id || "");
  const [novaData, setNovaData] = useState("2026-09-28");
  const [novoHorario, setNovoHorario] = useState("11:00");
  const [novoTipo, setNovoTipo] = useState<AudienciaVirtual["tipo"]>("Conciliação");
  const [novoMagistrado, setNovoMagistrado] = useState("Dr. Mamadu Serifo Djaló");
  const [novasPartes, setNovasPartes] = useState("Autor, Réu e Advogados constituídos");

  const handleAgendar = (e: React.FormEvent) => {
    e.preventDefault();
    const proc = state.processos.find((p) => p.id === novoProcessoId);
    if (!proc) return;

    agendarAudiencia({
      processoId: proc.id,
      processoNumero: proc.numero,
      data: novaData,
      horario: novoHorario,
      tipo: novoTipo,
      salaVirtualUrl: `https://justica.gov.gw/sala/v-${proc.numero.replace(/[^0-9]/g, "")}`,
      magistrado: novoMagistrado,
      partes: novasPartes.split(",").map((p) => p.trim()),
    });

    setModalNova(false);
  };

  const handleFinalizarSessao = () => {
    if (audienciaAtiva) {
      concluirAudiencia(audienciaAtiva.id);
      setAudienciaAtiva(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Pauta de Audiências Virtuais
          </h2>
          <p className="text-sm text-ink-muted">
            Teleconferência judicial segura e criptografada com gravação soberana e ata eletrônica.
          </p>
        </div>

        <Button
          onClick={() => setModalNova(true)}
          className="bg-purple-700 hover:bg-purple-800 text-white"
        >
          <PlusCircle className="size-4 mr-1.5" /> Designar Nova Audiência
        </Button>
      </div>

      {/* Se houver audiência aberta no simulador */}
      {audienciaAtiva ? (
        <Card className="p-6 border-purple-600 bg-slate-950 text-white shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="grid size-3 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-display text-base font-bold">
                Sala de Audiência Virtual — {audienciaAtiva.processoNumero}
              </h3>
              <Badge tone="navy" className="text-xs">{audienciaAtiva.tipo}</Badge>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Sessão iniciada às {audienciaAtiva.horario} &bull; WebRTC Seguro
            </span>
          </div>

          {/* Grid de Vídeo */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Câmera Magistrado */}
            <div className="relative aspect-video rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-end p-3">
              <div className="absolute inset-0 grid place-items-center text-slate-600">
                <Gavel className="size-16 opacity-30 text-purple-400" />
              </div>
              <div className="relative z-10 flex items-center justify-between text-xs bg-black/60 backdrop-blur-md rounded px-2 py-1">
                <span className="font-semibold text-purple-300">{audienciaAtiva.magistrado} (Juiz)</span>
                <span className="text-[10px] text-emerald-400 font-mono">Ao Vivo</span>
              </div>
            </div>

            {/* Câmera Partes */}
            <div className="relative aspect-video rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-end p-3">
              <div className="absolute inset-0 grid place-items-center text-slate-600">
                <Users className="size-16 opacity-30 text-indigo-400" />
              </div>
              <div className="relative z-10 flex items-center justify-between text-xs bg-black/60 backdrop-blur-md rounded px-2 py-1">
                <span className="font-semibold text-indigo-300">Polo Ativo & Patrono</span>
                <span className="text-[10px] text-emerald-400 font-mono">Ao Vivo</span>
              </div>
            </div>

            {/* Câmera Réu / Você */}
            <div className="relative aspect-video rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-end p-3">
              <div className="absolute inset-0 grid place-items-center text-slate-600">
                {camOff ? (
                  <VideoOff className="size-12 text-slate-600" />
                ) : (
                  <Camera className="size-16 opacity-30 text-slate-400" />
                )}
              </div>
              <div className="relative z-10 flex items-center justify-between text-xs bg-black/60 backdrop-blur-md rounded px-2 py-1">
                <span className="font-semibold text-slate-300">Polo Passivo / Defesa</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {micMuted ? "Mudo" : "Áudio Ativo"}
                </span>
              </div>
            </div>
          </div>

          {/* Ata em Tempo Real e Controles */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="size-3.5 text-purple-400" /> Registro da Ata Eletrônica da Audiência
              </label>
              <textarea
                rows={3}
                value={ataTexto}
                onChange={(e) => setAtaTexto(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900/80 p-2.5 text-xs text-slate-200 font-mono focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col justify-center gap-3">
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setMicMuted(!micMuted)}
                  className={`grid size-10 place-items-center rounded-full transition ${
                    micMuted ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                  title={micMuted ? "Ativar Microfone" : "Silenciar Microfone"}
                >
                  {micMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setCamOff(!camOff)}
                  className={`grid size-10 place-items-center rounded-full transition ${
                    camOff ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                  title={camOff ? "Ligar Câmera" : "Desligar Câmera"}
                >
                  {camOff ? <VideoOff className="size-4" /> : <Video className="size-4" />}
                </button>

                <Button
                  onClick={handleFinalizarSessao}
                  className="bg-rose-600 hover:bg-rose-700 text-white gap-1 text-xs"
                >
                  <PhoneOff className="size-4" /> Encerrar Audiência
                </Button>
              </div>

              <p className="text-center text-[10px] text-slate-400">
                A sessão está sendo gravada e a ata será certificada ao final pelo Juízo.
              </p>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Lista de Audiências da Pauta */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span className="font-semibold text-ink">Audiências Designadas ({state.audiencias.length})</span>
          <span>Horário Oficial de Bissau (GMT)</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {state.audiencias.map((aud) => (
            <Card key={aud.id} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                    <Calendar className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-ink">
                      {aud.data} às {aud.horario}
                    </p>
                    <p className="font-mono text-[11px] text-purple-700 dark:text-purple-300">
                      {aud.processoNumero}
                    </p>
                  </div>
                </div>

                <Badge
                  tone={aud.status === "concluida" ? "success" : "navy"}
                  className="text-xs"
                >
                  {aud.status === "concluida" ? "Concluída" : aud.tipo}
                </Badge>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-ink-muted">
                  <strong>Magistrado:</strong> {aud.magistrado}
                </p>
                <p className="text-ink-muted">
                  <strong>Partes notificadas:</strong> {aud.partes.join(", ")}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-border-subtle pt-3">
                <span className="text-[10px] text-ink-faint font-mono">
                  {aud.status === "concluida" ? "Ata lavrada" : "Aguardando início"}
                </span>

                {aud.status === "concluida" ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                    <CheckCircle2 className="size-3.5" /> Sessão Encerrada
                  </span>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setAudienciaAtiva(aud)}
                    className="bg-purple-700 hover:bg-purple-800 text-white text-xs gap-1.5"
                  >
                    <Video className="size-3.5" /> Acessar Sala Virtual
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal de Agendamento */}
      {modalNova && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="font-display text-base font-bold text-ink">Designar Nova Audiência</h3>
              <button onClick={() => setModalNova(false)} className="text-xs text-ink-muted hover:text-ink">
                Cancelar
              </button>
            </div>

            <form onSubmit={handleAgendar} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-ink">Processo Vinculado</label>
                <select
                  value={novoProcessoId}
                  onChange={(e) => setNovoProcessoId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border-subtle bg-surface p-2 text-xs text-ink"
                >
                  {state.processos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.numero} — {p.assunto}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-semibold text-ink">Data</label>
                  <Input
                    type="date"
                    required
                    value={novaData}
                    onChange={(e) => setNovaData(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink">Horário (GMT)</label>
                  <Input
                    type="time"
                    required
                    value={novoHorario}
                    onChange={(e) => setNovoHorario(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-semibold text-ink">Tipo de Audiência</label>
                  <select
                    value={novoTipo}
                    onChange={(e) => setNovoTipo(e.target.value as AudienciaVirtual["tipo"])}
                    className="mt-1 w-full rounded-lg border border-border-subtle bg-surface p-2 text-xs text-ink"
                  >
                    <option value="Conciliação">Conciliação</option>
                    <option value="Instrução e Julgamento">Instrução e Julgamento</option>
                    <option value="Oitiva de Testemunhas">Oitiva de Testemunhas</option>
                    <option value="Preliminar">Preliminar</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-ink">Magistrado Presidente</label>
                  <Input
                    required
                    value={novoMagistrado}
                    onChange={(e) => setNovoMagistrado(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-ink">Partes a Notificar</label>
                <Input
                  required
                  value={novasPartes}
                  onChange={(e) => setNovasPartes(e.target.value)}
                  placeholder="Separadas por vírgula..."
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalNova(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" className="bg-purple-700 hover:bg-purple-800 text-white">
                  Confirmar Designação
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
