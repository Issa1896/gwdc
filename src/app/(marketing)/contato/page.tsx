"use client";

import { useState } from "react";
import { CheckCircle2, Clock3, MapPin, Mail, Phone, Send } from "lucide-react";
import { PageHero, CTABand } from "@/components/marketing/sections";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

const CHANNELS = [
  { icon: MapPin, title: "Sede", text: "Avenida Amílcar Cabral, Bissau — Guiné-Bissau" },
  { icon: Mail, title: "E-mail geral", text: "contato@gwdigital.company" },
  { icon: Mail, title: "Parcerias", text: "parcerias@gwdigital.company" },
  { icon: Phone, title: "Telefone", text: "+245 95 000 0000" },
  { icon: Clock3, title: "Atendimento", text: "Segunda a sexta, 8h–18h" },
];

const DEPARTMENTS = [
  "Governo e Estado",
  "Bancos e financeiro",
  "Empresas",
  "Educação",
  "Saúde e justiça",
  "Transporte e clima",
  "Investidores",
  "Imprensa",
  "Outro",
];

/** Página Contato com formulário (front-end, dados fictícios). */
export default function ContatoPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", department: DEPARTMENTS[0], message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  };

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Início", href: "/" }, { label: "Contato" }]}
        eyebrow="Fale conosco"
        title="Vamos transformar a Guiné-Bissau juntos"
        description="Governo, investidores, empresas e parceiros: nossa equipe responde em até 24 horas úteis."
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
            {/* Canais */}
            <div className="space-y-4">
              {CHANNELS.map(({ icon: Icon, title, text }) => (
                <Card key={title} className="flex items-center gap-4 p-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{title}</p>
                    <p className="text-sm text-ink-muted">{text}</p>
                  </div>
                </Card>
              ))}
              <Card className="bg-gradient-to-br from-navy-950 to-navy-900 p-6 text-white">
                <p className="font-display font-semibold">Agenda da direção</p>
                <p className="mt-2 text-sm text-navy-100">
                  A direção executiva da GWDC está disponível para apresentações à Presidência, ministérios,
                  bancos multilaterais e investidores.
                </p>
                <a href="mailto:executivo@gwdigital.company" className="mt-3 inline-block text-sm font-semibold text-brand-300 hover:text-brand-200">
                  executivo@gwdigital.company
                </a>
              </Card>
            </div>

            {/* Formulário */}
            <Card className="p-7 sm:p-9">
              {sent ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
                  <CheckCircle2 className="size-12 text-success" aria-hidden="true" />
                  <h2 className="font-display text-2xl font-bold text-ink">Mensagem enviada!</h2>
                  <p className="max-w-md text-sm text-ink-muted">
                    Obrigado, {form.name.split(" ")[0] || "equipe"}. Nossa equipe responderá em até 24 horas úteis para {form.email}.
                  </p>
                  <Button variant="outline" onClick={() => setSent(false)}>Enviar outra mensagem</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} aria-label="Formulário de contato" className="space-y-5">
                  <h2 className="font-display text-xl font-bold text-ink">Envie sua mensagem</h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label>Nome completo</Label>
                      <Input
                        required
                        placeholder="Ex.: Mamadu Gomes"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>E-mail profissional</Label>
                      <Input
                        required
                        type="email"
                        placeholder="nome@instituicao.gw"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Assunto</Label>
                    <select
                      className="h-10 w-full cursor-pointer rounded-lg border border-border-strong bg-surface px-3 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25"
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Mensagem</Label>
                    <Textarea
                      required
                      rows={6}
                      placeholder="Conte-nos sobre sua instituição, seu projeto ou sua proposta de parceria…"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>
                  <Alert tone="info" title="Privacidade">
                    Seus dados são usados apenas para responder sua solicitação, conforme nossa política de privacidade (CEPD).
                  </Alert>
                  <Button type="submit" size="lg" loading={loading} className="w-full sm:w-auto">
                    Enviar mensagem <Send className="size-4" />
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>

      <CTABand
        title="Prefere ver primeiro?"
        description="Explore os MVPs navegáveis antes de falar conosco."
        primaryLabel="Ver demonstrações"
        primaryHref="/mvps"
        secondaryLabel="Conhecer a empresa"
        secondaryHref="/sobre"
      />
    </>
  );
}
