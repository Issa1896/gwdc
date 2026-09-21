import { Target, Compass, HeartHandshake, Flag } from "lucide-react";
import { branding } from "@/lib/branding";
import { PageHero, SectionHeading, CTABand, StatBand } from "@/components/marketing/sections";
import { Card } from "@/components/ui/card";
import { Timeline } from "@/components/ui/timeline";
import { Badge } from "@/components/ui/badge";

/** Página Sobre — história, missão, visão, valores, manifesto e posicionamento. */
export default function SobrePage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Início", href: "/" }, { label: "Sobre" }]}
        eyebrow="Quem somos"
        title="Construímos o futuro digital da Guiné-Bissau"
        description={branding.vision}
      />

      {/* Missão / Visão / Valores */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="p-7">
              <Target className="size-7 text-brand-500" aria-hidden="true" />
              <h2 className="mt-4 font-display text-lg font-semibold text-ink">Nossa Missão</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{branding.mission}</p>
            </Card>
            <Card className="p-7">
              <Compass className="size-7 text-gold-500" aria-hidden="true" />
              <h2 className="mt-4 font-display text-lg font-semibold text-ink">Nossa Visão</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{branding.vision}</p>
            </Card>
            <Card className="p-7">
              <HeartHandshake className="size-7 text-navy-500" aria-hidden="true" />
              <h2 className="mt-4 font-display text-lg font-semibold text-ink">Nosso Compromisso</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {branding.slogan} — com padrões enterprise globais, soberania de dados e inclusão digital para todos os guineenses.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="border-y border-border bg-surface-alt py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Valores" title="O que guia cada decisão" description="Seis valores inegociáveis que definem como construímos, entregamos e servimos." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {branding.values.map((value) => (
              <Card key={value.title} className="p-6">
                <Badge tone="brand" className="mb-3">{value.title}</Badge>
                <p className="text-sm leading-relaxed text-ink-muted">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.4fr]">
            <div className="lg:sticky lg:top-24">
              <SectionHeading
                align="left"
                eyebrow="Manifesto"
                title="Não esperamos. Construímos."
              />
              <p className="text-sm text-ink-faint">— GW Digital Company, Bissau</p>
            </div>
            <div className="space-y-6">
              {branding.manifesto.map((paragraph, i) => (
                <p key={i} className="border-l-2 border-brand-500 pl-5 text-base leading-relaxed text-ink-muted first:border-gold-500">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* História */}
      <section className="border-t border-border bg-surface-alt py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <SectionHeading
                align="left"
                eyebrow="História"
                title="De Bissau para a África Ocidental"
                description="Uma trajetória curta, intensa e orientada a resultados."
              />
              <div className="mt-6 space-y-4">
                <StatBand stats={branding.stats.map((s) => ({ value: String(s.value), label: s.label }))} />
              </div>
            </div>
            <Timeline
              items={branding.history.map((entry) => ({
                title: entry.title,
                description: entry.description,
                date: entry.year,
                badge: { label: entry.year, tone: "brand" },
              }))}
            />
          </div>
        </div>
      </section>

      {/* Posicionamento */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <Card className="p-8">
              <Flag className="size-7 text-brand-500" aria-hidden="true" />
              <h2 className="mt-4 font-display text-xl font-bold text-ink">Posicionamento estratégico</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{branding.positioning.category}</p>
              <h3 className="mt-6 text-sm font-semibold text-ink">Públicos prioritários</h3>
              <ul className="mt-2 space-y-1.5">
                {branding.positioning.audience.map((audience) => (
                  <li key={audience} className="flex items-center gap-2 text-sm text-ink-muted">
                    <span className="size-1.5 rounded-full bg-gold-500" aria-hidden="true" /> {audience}
                  </li>
                ))}
              </ul>
              <h3 className="mt-6 text-sm font-semibold text-ink">O que nos diferencia</h3>
              <ul className="mt-2 space-y-1.5">
                {branding.positioning.differentiators.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink-muted">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-8">
              <h2 className="font-display text-xl font-bold text-ink">Tom de voz</h2>
              <p className="mt-3 text-sm font-medium text-brand-600 dark:text-brand-300">{branding.toneOfVoice.personality}</p>
              <ul className="mt-4 space-y-2.5">
                {branding.toneOfVoice.principles.map((principle) => (
                  <li key={principle} className="flex items-start gap-2.5 text-sm text-ink-muted">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" /> {principle}
                  </li>
                ))}
              </ul>
              <h3 className="mt-6 text-sm font-semibold text-ink">Evitamos</h3>
              <ul className="mt-2 space-y-2.5">
                {branding.toneOfVoice.avoid.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-ink-muted">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-danger" aria-hidden="true" /> {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-xl border border-border bg-surface-alt p-5">
                <p className="text-xs font-semibold tracking-wider text-ink-faint uppercase">Identidade visual</p>
                <div className="mt-3 flex gap-3">
                  {[branding.visualIdentity.palette.primary, branding.visualIdentity.palette.navy, branding.visualIdentity.palette.gold].map((color) => (
                    <div key={color.hex} className="text-center">
                      <span className="block size-12 rounded-lg border border-border" style={{ background: color.hex }} />
                      <p className="mt-1.5 text-[10px] font-medium text-ink-muted">{color.name}</p>
                      <p className="text-[10px] text-ink-faint">{color.hex}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-relaxed text-ink-muted">
                  <strong className="text-ink">Logotipo:</strong> {branding.visualIdentity.logoConcept}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                  <strong className="text-ink">Tipografia:</strong> {branding.visualIdentity.typography.display} · {branding.visualIdentity.typography.body}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
