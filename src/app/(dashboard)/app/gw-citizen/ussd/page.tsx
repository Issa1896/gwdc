"use client";

import { useState } from "react";
import {
  ChevronRight,
  Info,
  PhoneCall,
  RotateCcw,
  ShieldCheck,
  Signal,
  WifiOff,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCitizen } from "@/lib/citizen-store";

export default function UssdSimulatorPage() {
  const { state, enviarComandoUssd, reiniciarUssd } = useCitizen();
  const [displayEntrada, setDisplayEntrada] = useState("");

  function handleDigito(d: string) {
    setDisplayEntrada((prev) => prev + d);
  }

  function handleEnviar() {
    if (!displayEntrada) return;
    enviarComandoUssd(displayEntrada);
    setDisplayEntrada("");
  }

  function handleLimpar() {
    setDisplayEntrada("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
            Simulador de Canal USSD (*123#)
          </h2>
          <p className="text-xs text-ink-muted sm:text-sm">
            Inclusão digital offline-first: acesso a serviços do Estado via sinal GSM básico, sem necessidade de internet ou smartphone.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge tone="info" className="gap-1.5 text-xs">
            <WifiOff className="size-3.5" /> Funciona Sem Internet
          </Badge>
          <Badge tone="success" className="gap-1.5 text-xs">
            <Signal className="size-3.5" /> Cobertura Nacional GSM
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Celular Virtual / Terminal USSD */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-[340px] rounded-3xl border-4 border-slate-700 bg-slate-900 p-5 shadow-2xl text-slate-100">
            {/* Topo do Celular */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] text-slate-400">
              <span className="font-semibold text-emerald-400">Orange GW / MTN</span>
              <div className="flex items-center gap-1">
                <Signal className="size-3 text-slate-300" />
                <span>3G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Tela LCD Verde do Celular */}
            <div className="my-4 rounded-xl border border-emerald-900/60 bg-emerald-950/80 p-4 font-mono text-xs text-emerald-300 shadow-inner">
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
                {state.ussd.respostaTela}
              </pre>

              {/* Campo de Entrada de Dígito */}
              <div className="mt-3 flex items-center gap-1 border-t border-emerald-800/60 pt-2 text-emerald-200">
                <span className="text-[11px] font-bold">&gt;</span>
                <span className="font-mono text-sm font-bold min-h-[20px] tracking-widest">
                  {displayEntrada || "_"}
                </span>
              </div>
            </div>

            {/* Botões de Ação do Celular */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={handleEnviar}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-500 active:scale-95 transition"
              >
                <PhoneCall className="size-3.5" /> Enviar
              </button>
              <button
                type="button"
                onClick={handleLimpar}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 active:scale-95 transition"
              >
                Limpar
              </button>
            </div>

            {/* Teclado Numérico Físico */}
            <div className="grid grid-cols-3 gap-2 text-center font-bold">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((btn) => (
                <button
                  key={btn}
                  type="button"
                  onClick={() => handleDigito(btn)}
                  className="rounded-xl border border-slate-800 bg-slate-800/80 py-2.5 text-sm text-white hover:bg-slate-700 active:bg-slate-600 transition shadow-xs"
                >
                  {btn}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={reiniciarUssd}
              className="mt-3 w-full flex items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] text-slate-400 hover:text-slate-200"
            >
              <RotateCcw className="size-3" /> Reiniciar Sessão (*123#)
            </button>
          </div>
        </div>

        {/* Explicação da Tecnologia e Árvore de Menus */}
        <div className="space-y-4 lg:col-span-6">
          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-blue-600" />
              <h3 className="font-display text-base font-bold text-ink">
                Como Funciona a Inclusão Digital por USSD?
              </h3>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Na Guiné-Bissau, grande parte da população no interior e ilhas não possui pacotes de dados de internet móvel.
              O canal **`*123#`** do **GOV.GW** utiliza a rede de sinalização celular GSM (mesma usada para recarga de créditos telefónicos), garantindo que qualquer cidadão com um celular simples (feature phone) consiga:
            </p>

            <ul className="space-y-2 text-xs text-ink-muted border-t border-border pt-3">
              <li className="flex items-start gap-2">
                <ChevronRight className="size-4 shrink-0 text-blue-600" />
                <span><strong>Opção 1 (Certidões):</strong> Consultar certidões de nascimento emitidas e receber o código autenticado por SMS.</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="size-4 shrink-0 text-blue-600" />
                <span><strong>Opção 2 (Vacinas):</strong> Checar status vacinal (Febre Amarela e Cólera) antes de viajar.</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="size-4 shrink-0 text-blue-600" />
                <span><strong>Opção 3 (Transportes):</strong> Ver horários e tarifas das linhas de ônibus e barcos dos Bijagós.</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="size-4 shrink-0 text-blue-600" />
                <span><strong>Opção 4 (Processos):</strong> Consultar o status de despachos no Protocolo Único do Estado.</span>
              </li>
            </ul>
          </Card>

          <Card className="p-4 bg-blue-50/50 border-blue-500/20 dark:bg-blue-950/20 text-xs text-blue-900 dark:text-blue-200">
            <div className="flex items-center gap-2 font-semibold">
              <Info className="size-4 text-blue-600" />
              <span>Experimente no teclado ao lado:</span>
            </div>
            <p className="mt-1 leading-relaxed text-[11px] text-blue-800/80 dark:text-blue-300/80">
              Digite <strong>1</strong> e clique em <strong>Enviar</strong> para abrir o menu de certidões, ou <strong>4</strong> para acompanhar o andamento do seu processo do Estado!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
