import type { Metadata } from "next";
import { PARTNERS } from "@/data/content";
import { PageHero, SectionHeading, CTABand } from "@/components/marketing/sections";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Parceiros",
  description: "Parcerias institucionais da GW Digital Company: governo, bancos multilaterais, CEDEAO, União Africana e ecossistema de inovação.",
};

const PARTNER_TYPES = [
  { key: "governo", label: "Governo e Estado" },
  { key: "financeiro", label: "Financeiro e bancos" },
  { key: "educacao", label: "Educação" },
  { key: "internacional", label: "Internacional e multilateral" },
  { key: "tecnologia", label: "Tecnologia e inovação" },
] as const;

/** Página Parceiros. */
export default function ParceirosPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Início", href: "/" }, { label: "Parceiros" }]}
        eyebrow="Alianças"
        title="Transformação digital não se faz sozinho"
        description="Governos, bancos multilaterais, universidades e o ecossistema de inovação caminham com a GWDC rumo à Guiné-Bissau digital."
      />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {PARTNER_TYPES.map((group) => {
            const partners = PARTNERS.filter((p) => p.type === group.key);
            if (partners.length === 0) return null;
            return (
              <div key={group.key} className="mb-12 last:mb-0">
                <SectionHeading align="left" eyebrow={group.label} title={group.label} className="mb-6" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {partners.map((partner) => (
                    <Card key={partner.name} className="flex items-center gap-4 p-5">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
                        <partner.icon className="size-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-sm font-semibold text-ink">{partner.name}</p>
                        <p className="text-xs text-ink-faint">{partner.category}</p>
                      </div>
                      <Badge tone={partner.status === "Parceria ativa" ? "success" : partner.status === "Acordo de intenção" ? "gold" : "neutral"}>
                        {partner.status}
                      </Badge>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-surface-alt py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <SectionHeading
            eyebrow="Junte-se a nós"
            title="Quer ser parceiro da transformação?"
            description="Buscamos parceiros de tecnologia, financiadores do desenvolvimento e instituições que acreditem no potencial digital da Guiné-Bissau."
          />
          <a href="mailto:parcerias@gwdigital.company" className="inline-flex items-center gap-2 font-semibold text-brand-600 dark:text-brand-300">
            parcerias@gwdigital.company
          </a>
        </div>
      </section>

      <CTABand />
    </>
  );
}
