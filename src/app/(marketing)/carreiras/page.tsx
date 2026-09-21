import type { Metadata } from "next";
import { ArrowRight, Briefcase, MapPin } from "lucide-react";
import { JOBS } from "@/data/content";
import { PageHero, SectionHeading, CTABand } from "@/components/marketing/sections";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Carreiras",
  description: "Trabalhe na GW Digital Company: engenharia, dados, IA, segurança, design e mais. Construa o futuro digital da Guiné-Bissau.",
};

const CULTURE = [
  "Missão com impacto real — seu código muda a vida de milhões",
  "Padrões enterprise globais (Microsoft, AWS, Palantir)",
  "Formação contínua: academia GW, certificações e conferências",
  "Ambiente inclusivo, crioulo e português em sala",
];

const FAQ = [
  {
    question: "Como funciona o processo seletivo?",
    answer:
      "Três etapas: (1) conversa inicial com o time de pessoas, (2) desafio técnico prático e contextualizado — nada de algoritmos fora de contexto — e (3) entrevista final com a liderança. Feedback em até 7 dias úteis.",
  },
  {
    question: "Preciso estar em Bissau?",
    answer:
      "Não necessariamente. Muitas posições são híbridas ou remotas. Priorizamos talento guineense e da diáspora, mas recebemos candidaturas de toda a África Ocidental e do mundo.",
  },
  {
    question: "Há programas para iniciantes?",
    answer:
      "Sim! A Academia GW forma desenvolvedores, analistas de dados e designers em programas de 6 meses com mentoria e contratação dos melhores talentos.",
  },
  {
    question: "O que a GWDC oferece?",
    answer:
      "Salário competitivo na região, participação em resultados, seguro de saúde, computador corporativo, formação contínua e a oportunidade de trabalhar em projetos de escala nacional e regional.",
  },
];

/** Página Carreiras. */
export default function CarreirasPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Início", href: "/" }, { label: "Carreiras" }]}
        eyebrow="Carreiras"
        title="Construa o futuro digital da Guiné-Bissau"
        description="Na GWDC, o seu trabalho transforma país: governo digital, inclusão financeira, educação e clima. Venha construir com padrão global, no coração da África Ocidental."
      />

      {/* Cultura */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading
                align="left"
                eyebrow="Cultura"
                title="Por que trabalhar na GWDC?"
              />
              <ul className="space-y-4">
                {CULTURE.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-xl border border-border bg-surface-alt p-4 text-sm text-ink-muted">
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Card className="flex flex-col justify-center bg-gradient-to-br from-navy-950 to-navy-900 p-8 text-white">
              <p className="font-display text-2xl font-bold leading-snug">
                «Não contratamos currículos. Contratamos pessoas que acreditam que a Guiné-Bissau pode ser digital — e têm coragem de construí-la.»
              </p>
              <p className="mt-4 text-sm text-navy-200">— Direção Executiva, GW Digital Company</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Vagas */}
      <section className="border-t border-border bg-surface-alt py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Vagas abertas" title="Junte-se à equipe" description="Posições atuais — candidatura simples por e-mail com currículo e portfólio." />
          <div className="space-y-5">
            {JOBS.map((job) => (
              <Card key={job.title} className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">{job.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge tone="brand">{job.department}</Badge>
                      <Badge tone="navy">{job.type}</Badge>
                      <Badge><MapPin className="size-3" /> {job.location}</Badge>
                    </div>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">{job.description}</p>
                  </div>
                  <a href="mailto:carreiras@gwdigital.company?subject=Candidatura — " className="hidden sm:block">
                    <Button>Candidatar-se <ArrowRight className="size-4" /></Button>
                  </a>
                </div>
                <div className="mt-4 border-t border-border pt-4">
                  <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-ink-faint uppercase">
                    <Briefcase className="size-3.5" /> Requisitos
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {job.requirements.map((req) => (
                      <span key={req} className="rounded-full bg-surface-strong px-3 py-1 text-xs text-ink-muted">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-ink-faint">
            Não encontrou sua vaga? Envie currículo para{" "}
            <a href="mailto:carreiras@gwdigital.company" className="font-semibold text-brand-600 dark:text-brand-300">
              carreiras@gwdigital.company
            </a>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHeading eyebrow="Perguntas frequentes" title="Tire suas dúvidas" />
          <Accordion items={FAQ.map((f) => ({ title: f.question, content: f.answer }))} />
        </div>
      </section>

      <CTABand
        title="Vamos construir juntos?"
        description="Envie seu currículo e faça parte do time que transforma a Guiné-Bissau."
        primaryLabel="Candidatar-se"
        primaryHref="mailto:carreiras@gwdigital.company"
        secondaryLabel="Conhecer os produtos"
        secondaryHref="/produtos"
      />
    </>
  );
}
