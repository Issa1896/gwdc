import Link from "next/link";
import { Linkedin, Mail, MapPin, Twitter } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const FOOTER_COLUMNS = [
  {
    title: "Soluções",
    links: [
      { href: "/governo-digital", label: "Governo Digital" },
      { href: "/educacao", label: "Educação" },
      { href: "/saude", label: "Saúde" },
      { href: "/justica", label: "Justiça" },
      { href: "/banco-digital", label: "Banco Digital" },
      { href: "/empresas", label: "Empresas" },
      { href: "/transporte", label: "Transporte" },
      { href: "/meio-ambiente", label: "Meio Ambiente" },
    ],
  },
  {
    title: "Produtos",
    links: [
      { href: "/produtos/gw-government", label: "GW Government" },
      { href: "/produtos/gw-citizen", label: "GW Citizen" },
      { href: "/produtos/gw-education", label: "GW Education" },
      { href: "/produtos/gw-erp", label: "GW ERP" },
      { href: "/produtos/gw-bank", label: "GW Bank" },
      { href: "/produtos/gw-pay", label: "GW Pay" },
      { href: "/produtos/gw-transport", label: "GW Transport" },
      { href: "/produtos/gw-climate", label: "GW Climate" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/sobre", label: "Sobre nós" },
      { href: "/carreiras", label: "Carreiras" },
      { href: "/parceiros", label: "Parceiros" },
      { href: "/blog", label: "Blog" },
      { href: "/mvps", label: "Demonstrações (MVPs)" },
      { href: "/contato", label: "Contato" },
    ],
  },
] as const;

/** Rodapé institucional — Design System GWDC. */
export function Footer() {
  return (
    <footer className="border-t border-border bg-navy-950 text-navy-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo className="[&_span:last-child]:text-white" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-200">
              Tecnologia que transforma a Guiné-Bissau e conecta o futuro da África Ocidental.
              Plataforma digital nacional: Estado, empresas e cidadãos em um único ecossistema.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { href: "#", label: "LinkedIn", icon: Linkedin },
                { href: "#", label: "Twitter / X", icon: Twitter },
                { href: "mailto:contato@gwdigital.company", label: "E-mail", icon: Mail },
              ].map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-lg bg-white/5 text-navy-200 transition-colors hover:bg-brand-500 hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="mb-3 text-sm font-semibold tracking-wide text-white uppercase">{col.title}</h3>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link href={link.href} className="text-sm text-navy-200 transition-colors hover:text-brand-300">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-navy-300 sm:flex-row">
          <p>© {new Date().getFullYear()} GW Digital Company. Todos os direitos reservados. Bissau, Guiné-Bissau.</p>
          <p className="flex items-center gap-1.5">
            <MapPin className="size-3.5" /> Bissau · Guiné-Bissau · África Ocidental
          </p>
        </div>
      </div>
    </footer>
  );
}
