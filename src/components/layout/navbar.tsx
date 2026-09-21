"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/solucoes", label: "Soluções" },
  { href: "/produtos", label: "Produtos" },
  { href: "/mvps", label: "MVPs" },
  { href: "/parceiros", label: "Parceiros" },
  { href: "/carreiras", label: "Carreiras" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
] as const;

/** Barra de navegação institucional responsiva. */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="GW Digital Company — Início" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.slice(0, 4).map((link) => (
            <NavItem key={link.href} {...link} active={pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))} />
          ))}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSolutionsOpen((v) => !v)}
              aria-expanded={solutionsOpen}
              className={cn(
                "flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith("/solutions") ? "text-brand-600" : "text-ink-muted hover:text-ink",
              )}
            >
              Setores
              <ChevronDown className={cn("size-3.5 transition-transform", solutionsOpen && "rotate-180")} />
            </button>
            {solutionsOpen && (
              <div
                role="menu"
                className="absolute top-full left-0 mt-2 w-64 rounded-xl border border-border bg-surface p-2 shadow-xl"
              >
                {SOLUTIONS_MENU.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setSolutionsOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-alt hover:text-ink"
                  >
                    <span className="grid size-7 place-items-center rounded-md bg-brand-50 text-brand-600 dark:bg-brand-950">
                      <item.icon className="size-4" aria-hidden="true" />
                    </span>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {NAV_LINKS.slice(4).map((link) => (
            <NavItem key={link.href} {...link} active={pathname === link.href || pathname.startsWith(link.href)} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
          >
            {theme === "dark" ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
          </Button>
          <Button asChild={undefined} className="hidden sm:inline-flex">
            <Link href="/login" className="px-4 py-2">
              Acessar demo
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu móvel">
          <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-80 max-w-[85vw] flex-col overflow-y-auto border-l border-border bg-surface p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <Button variant="ghost" size="icon" aria-label="Fechar menu" onClick={() => setOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>
            <nav aria-label="Menu móvel" className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-alt hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
              <p className="mt-4 px-3 text-xs font-semibold tracking-wider text-ink-faint uppercase">Setores</p>
              {SOLUTIONS_MENU.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink-muted hover:bg-surface-alt hover:text-ink"
                >
                  <item.icon className="size-4 text-brand-600" aria-hidden="true" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <Button className="mt-6 w-full">
              <Link href="/login" onClick={() => setOpen(false)}>
                Acessar demo
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

function NavItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active ? "text-brand-600" : "text-ink-muted hover:text-ink",
      )}
    >
      {label}
    </Link>
  );
}

import { Building2, Bus, CloudSun, GraduationCap, HeartPulse, Landmark, Scale, TrendingUp } from "lucide-react";

const SOLUTIONS_MENU = [
  { href: "/governo-digital", label: "Governo Digital", icon: Landmark },
  { href: "/educacao", label: "Educação", icon: GraduationCap },
  { href: "/saude", label: "Saúde", icon: HeartPulse },
  { href: "/justica", label: "Justiça", icon: Scale },
  { href: "/banco-digital", label: "Banco Digital", icon: Building2 },
  { href: "/empresas", label: "Empresas", icon: TrendingUp },
  { href: "/transporte", label: "Transporte", icon: Bus },
  { href: "/meio-ambiente", label: "Meio Ambiente", icon: CloudSun },
] as const;
