"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronsUpDown,
  Home,
  LogOut,
  Menu,
  Moon,
  PanelLeft,
  Sun,
  X,
} from "lucide-react";
import { PRODUCTS, getProduct } from "@/data/products";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import { getSession, signOut, type DemoUser } from "@/lib/mvp/auth";
import { cn } from "@/lib/utils";

/** Guarda de autenticação dos MVPs (sessão simulada em localStorage). */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getSession()) {
      router.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) return null;
  return <>{children}</>;
}

const NAV_ITEMS = [
  { id: "visao-geral", label: "Visão geral", icon: Home },
  { id: "operacoes", label: "Operações", icon: PanelLeft },
] as const;

/** Shell do dashboard MVP: topbar + sidebar + conteúdo responsivo. */
export function DashboardShell({
  productSlug,
  children,
  user,
}: {
  productSlug: string;
  children: React.ReactNode;
  user: DemoUser;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("visao-geral");

  const product = getProduct(productSlug);
  const otherProducts = useMemo(() => PRODUCTS.filter((p) => p.slug !== productSlug), [productSlug]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-surface-alt">
      {/* ── Sidebar (desktop) ─────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex h-16 items-center border-b border-border px-4">
          <Link href="/" aria-label="Voltar ao site GWDC">
            <Logo />
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3" aria-label="Menu do produto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              aria-current={activeSection === item.id ? "page" : undefined}
              className={cn(
                "mb-1 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                activeSection === item.id
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                  : "text-ink-muted hover:bg-surface-strong hover:text-ink",
              )}
            >
              <item.icon className="size-4.5" aria-hidden="true" />
              {item.label}
            </button>
          ))}

          <div className="mt-6 flex items-center justify-between px-3">
            <p className="text-[11px] font-semibold tracking-wider text-ink-faint uppercase">Outros produtos</p>
          </div>
          <div className="mt-2 flex flex-col gap-0.5">
            {otherProducts.slice(0, 7).map((p) => (
              <Link
                key={p.slug}
                href={`/app/${p.slug}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-strong hover:text-ink"
              >
                <span className="size-2 rounded-full" style={{ background: p.color }} aria-hidden="true" />
                <span className="truncate">{p.name}</span>
              </Link>
            ))}
          </div>
        </nav>
        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={() => signOut()}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-strong hover:text-danger"
          >
            <LogOut className="size-4.5" /> Sair da demonstração
          </button>
        </div>
      </aside>

      {/* ── Área principal ────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur-md sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu" onClick={() => setSidebarOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-ink">
              {product?.name ?? "GWDC"} <span className="font-normal text-ink-faint">· MVP</span>
            </p>
            <p className="hidden truncate text-xs text-ink-faint sm:block">{product?.tagline}</p>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === "dark" ? "Tema claro" : "Tema escuro"}>
              {theme === "dark" ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notificações">
              <Bell className="size-4.5" />
              <span className="absolute mt-[-14px] ml-[14px] grid size-4 place-items-center rounded-full bg-danger text-[9px] font-bold text-white">
                3
              </span>
            </Button>

            {/* Seletor de produto */}
            <div className="relative">
              <Button variant="outline" size="sm" className="hidden md:inline-flex" onClick={() => setSwitcherOpen((v) => !v)} aria-expanded={switcherOpen}>
                {product?.icon && <product.icon className="size-4" style={{ color: product.color }} aria-hidden="true" />}
                Alternar produto
                <ChevronsUpDown className="size-3.5 text-ink-faint" />
              </Button>
              {switcherOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-border bg-surface p-2 shadow-2xl">
                  <p className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-ink-faint uppercase">Ecossistema GWDC</p>
                  <div className="max-h-80 overflow-y-auto">
                    {PRODUCTS.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/app/${p.slug}`}
                        onClick={() => setSwitcherOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-surface-strong",
                          p.slug === productSlug ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300" : "text-ink-muted",
                        )}
                      >
                        <span className="grid size-7 place-items-center rounded-md text-white" style={{ background: p.color }}>
                          <p.icon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="truncate">{p.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Usuário */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-expanded={userMenuOpen}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-surface-strong"
              >
                <Avatar name={user.name} />
                <span className="hidden text-left lg:block">
                  <span className="block text-xs font-semibold text-ink">{user.name}</span>
                  <span className="block text-[10px] text-ink-faint">{user.role}</span>
                </span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-border bg-surface p-2 shadow-2xl">
                  <div className="border-b border-border px-3 py-2.5">
                    <p className="text-sm font-semibold text-ink">{user.name}</p>
                    <p className="text-xs text-ink-faint">{user.email}</p>
                    <Badge tone="brand" className="mt-2">Conta de demonstração</Badge>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      router.push("/login");
                    }}
                    className="mt-1 flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-strong hover:text-danger"
                  >
                    <LogOut className="size-4" /> Sair da demonstração
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* ── Sidebar móvel (drawer) ────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu do produto">
          <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col overflow-y-auto border-r border-border bg-surface p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <Logo />
              <Button variant="ghost" size="icon" aria-label="Fechar menu" onClick={() => setSidebarOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className="mb-1 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-surface-strong hover:text-ink"
              >
                <item.icon className="size-4.5" aria-hidden="true" /> {item.label}
              </button>
            ))}
            <p className="mt-6 px-3 text-[11px] font-semibold tracking-wider text-ink-faint uppercase">Outros produtos</p>
            {otherProducts.slice(0, 10).map((p) => (
              <Link key={p.slug} href={`/app/${p.slug}`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-surface-strong hover:text-ink">
                <span className="size-2 rounded-full" style={{ background: p.color }} aria-hidden="true" />
                <span className="truncate">{p.name}</span>
              </Link>
            ))}
            <Button
              variant="ghost"
              className="mt-6 justify-start text-danger"
              onClick={() => {
                signOut();
                router.push("/login");
              }}
            >
              <LogOut className="size-4" /> Sair
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
