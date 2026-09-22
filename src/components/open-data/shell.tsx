"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Database,
  Globe,
  LogOut,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { Logo } from "@/components/ui/logo";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/progress";
import { useTheme } from "@/components/theme-provider";
import { RequireAuth } from "@/components/dashboard/shell";
import { getSession, signOut, type DemoUser } from "@/lib/mvp/auth";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Transparência Governamental",
    items: [
      { href: "/app/gw-open-data", label: "Portal da Transparência", icon: Globe, exact: true },
      { href: "/app/gw-open-data/datasets", label: "Catálogo de Datasets (DCAT)", icon: Database },
      { href: "/app/gw-analytics", label: "Inteligência & BI do Estado", icon: BarChart3 },
    ],
  },
];

function NavMenu({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-5 overflow-y-auto p-3" aria-label="Menu do GW Open Data">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-3 pb-1.5 text-[11px] font-semibold tracking-wider text-ink-faint uppercase">{group.label}</p>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-teal-500/10 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300 font-semibold"
                      : "text-ink-muted hover:bg-surface-raised hover:text-ink"
                  )}
                >
                  <item.icon className={cn("size-4 shrink-0", isActive ? "text-teal-600 dark:text-teal-400" : "text-ink-faint")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function OpenDataGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<DemoUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const u = getSession();
    if (u) setUser(u);
  }, []);

  const handleLogout = () => {
    signOut();
    router.push("/login");
  };

  return (
    <RequireAuth>
      <div className="flex min-h-screen flex-col bg-surface-ground">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border-subtle bg-surface/90 px-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="grid size-8 place-items-center rounded-lg border border-border-subtle text-ink-muted hover:bg-surface-raised lg:hidden"
              aria-label="Abrir navegação"
            >
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>

            <Link href="/" className="flex items-center gap-2">
              <Logo compact />
            </Link>

            <span className="hidden text-ink-faint sm:inline">/</span>

            <div className="flex items-center gap-2">
              <div className="grid size-6 place-items-center rounded-md bg-teal-600 text-white shadow-sm">
                <Globe className="size-3.5" />
              </div>
              <span className="font-display text-sm font-bold tracking-tight text-ink">GW Open Data</span>
              <Badge tone="info" className="hidden text-[10px] sm:inline-flex">
                Transparência Pública
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Seletor rápido de produto */}
            <select
              aria-label="Trocar de produto"
              className="hidden rounded-lg border border-border-subtle bg-surface px-2.5 py-1 text-xs font-medium text-ink md:inline-block"
              defaultValue="gw-open-data"
              onChange={(e) => {
                if (e.target.value !== "gw-open-data") {
                  router.push(`/app/${e.target.value}`);
                }
              }}
            >
              {PRODUCTS.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Tema claro/escuro */}
            <button
              onClick={toggleTheme}
              className="grid size-8 place-items-center rounded-lg border border-border-subtle text-ink-muted hover:bg-surface-raised"
              aria-label="Alternar tema"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            {/* Usuário logado */}
            {user && (
              <div className="flex items-center gap-2 border-l border-border-subtle pl-2">
                <Avatar name={user.name} />
                <div className="hidden flex-col text-left xl:flex">
                  <span className="text-xs font-semibold text-ink leading-tight">{user.name}</span>
                  <span className="text-[10px] text-teal-600 font-semibold leading-none capitalize">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="grid size-8 place-items-center rounded-lg text-ink-muted hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                  title="Sair do Portal da Transparência"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Layout com Sidebar e Conteúdo */}
        <div className="flex flex-1">
          {/* Sidebar Desktop */}
          <aside className="hidden w-64 shrink-0 flex-col border-r border-border-subtle bg-surface lg:flex">
            <NavMenu />
            <div className="border-t border-border-subtle p-3">
              <div className="rounded-lg bg-teal-500/5 p-3 text-xs text-teal-900 dark:text-teal-200 border border-teal-500/20">
                <p className="font-semibold flex items-center gap-1.5">
                  <Globe className="size-4 text-teal-600" /> Padrão Aberto DCAT
                </p>
                <p className="mt-1 text-[11px] text-ink-muted">
                  Metadados e APIs públicas em conformidade com a Carta Internacional de Dados Abertos (ODC).
                </p>
              </div>
            </div>
          </aside>

          {/* Drawer Mobile */}
          {mobileOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
              <div className="relative flex w-72 flex-col bg-surface shadow-2xl">
                <div className="flex h-14 items-center justify-between border-b border-border-subtle px-4">
                  <span className="font-display font-bold text-ink">GW Open Data</span>
                  <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1 text-ink-muted hover:bg-surface-raised">
                    <X className="size-4" />
                  </button>
                </div>
                <NavMenu onNavigate={() => setMobileOpen(false)} />
              </div>
            </div>
          )}

          {/* Área Principal */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}
