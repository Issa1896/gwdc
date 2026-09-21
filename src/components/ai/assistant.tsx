"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { detectFraud, mockOcr, summarize, translate } from "@/lib/ai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Resuma os últimos dados do painel",
  "Traduza para crioulo",
  "Analise risco de transação",
  "Digitalize um documento (OCR)",
];

/** Regras do assistente (demonstração de IA conversacional). */
function reply(input: string, productName: string): string {
  const text = input.toLowerCase();

  if (text.includes("resum") || text.includes("sumar")) {
    return summarize(
      `O painel ${productName} mostra crescimento de 12,4% no mês. KPIs principais: receita 48,2M FCFA, satisfação 84 NPS e tempo médio de atendimento 3 minutos. Recomendações da IA: priorizar estoque crítico e intensificar canal mobile, que cresce 33% ao mês.`,
    );
  }
  if (text.includes("crioulo") || text.includes("franc") || text.includes("traduz")) {
    return `Tradução automática: "${translate("Bem-vindo ao futuro digital da Guiné-Bissau", "crioulo")}". (Demonstração com dicionário local — em produção, modelo neural multilíngue.)`;
  }
  if (text.includes("fraude") || text.includes("risco") || text.includes("transa")) {
    const { risk, score, reasons } = detectFraud(3200000, 2, true, 4);
    return `Análise antifraude (IA): risco ${risk} (score ${score}/100). Motivos: ${reasons.join("; ")}. Ação sugerida: exigir dupla verificação biométrica.`;
  }
  if (text.includes("ocr") || text.includes("document") || text.includes("digitaliz")) {
    const ocr = mockOcr("certidao-nascimento-08421.jpg");
    return `OCR concluído com ${ocr.confidence}% de confiança.\n${ocr.text}\nCampos extraídos: ${Object.entries(ocr.fields)
      .map(([k, v]) => `${k}: ${v}`)
      .join(" · ")}`;
  }
  if (text.includes("olá") || text.includes("ola") || text.includes("bom dia") || text.includes("oi")) {
    return `Olá! Sou o assistente virtual da GWDC. Posso resumir relatórios, traduzir para crioulo/francês, analisar riscos de transação e extrair documentos com OCR. Experimente!`;
  }
  if (text.includes("ajuda") || text.includes("help")) {
    return `Posso ajudar com:\n1. Resumo de relatórios\n2. Tradução automática (crioulo/francês)\n3. Análise antifraude\n4. OCR de documentos\n5. Previsão de receita`;
  }
  return `Entendi! No contexto do ${productName}, posso resumir dados, traduzir textos, verificar fraudes, extrair documentos (OCR) e prever tendências. Tente uma dessas ações — ou pergunte "o que você sabe fazer?".`;
}

/** Assistente virtual flutuante (Módulo 13 — IA). */
export function AiAssistant({ productName }: { productName: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Olá! Sou a IA da GWDC, seu assistente no ${productName}. Posso resumir relatórios, traduzir para crioulo, analisar fraudes e extrair documentos. Como posso ajudar?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = (raw?: string) => {
    const value = (raw ?? input).trim();
    if (!value) return;
    setMessages((prev) => [...prev, { role: "user", content: value }]);
    setInput("");
    setThinking(true);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", content: reply(value, productName) }]);
      setThinking(false);
    }, 700);
  };

  return (
    <>
      {/* Botão flutuante */}
      <Button
        size="icon"
        className="fixed right-5 bottom-5 z-40 rounded-full shadow-2xl"
        aria-label={open ? "Fechar assistente de IA" : "Abrir assistente de IA"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-5" /> : <Bot className="size-5" />}
      </Button>

      {/* Painel */}
      {open && (
        <div
          role="dialog"
          aria-label="Assistente virtual GWDC"
          className="fixed right-5 bottom-20 z-40 flex w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
        >
          <div className="flex items-center gap-3 border-b border-border bg-gradient-to-r from-brand-600 to-brand-800 px-4 py-3 text-white">
            <span className="grid size-9 place-items-center rounded-full bg-white/15">
              <Sparkles className="size-4.5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold">Assistente GWDC</p>
              <p className="text-[11px] opacity-80">IA · respondendo sobre {productName}</p>
            </div>
          </div>

          <div ref={listRef} className="max-h-80 min-h-64 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((message, i) => (
              <div key={i} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                <p
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line",
                    message.role === "user"
                      ? "rounded-br-md bg-brand-500 text-white"
                      : "rounded-bl-md bg-surface-strong text-ink",
                  )}
                >
                  {message.content}
                </p>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start">
                <p className="rounded-2xl rounded-bl-md bg-surface-strong px-3.5 py-2.5 text-sm text-ink-muted">
                  <span className="inline-flex gap-1">
                    <span className="size-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:0ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:120ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:240ms]" />
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 border-t border-border px-3 pt-2.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="cursor-pointer rounded-full border border-border-strong px-2.5 py-1 text-[11px] text-ink-muted transition-colors hover:border-brand-400 hover:text-brand-600"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            className="flex gap-2 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte à IA…"
              aria-label="Mensagem para o assistente"
              className="h-10"
            />
            <Button type="submit" size="icon" aria-label="Enviar mensagem">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
