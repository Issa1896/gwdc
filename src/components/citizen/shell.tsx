"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronsUpDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Phone,
  ShieldCheck,
  Sun,
  User,
  Wallet,
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
    label: "Serviços ao Cidadão",
    items: [
      { href: "/app/gw-citizen", label: "Meu Portal", icon: LayoutDashboard, exact: true },
      { href: "/app/gw-citizen/carteira", label: "Carteira de Documentos", icon: Wallet },
      { href: "/app/gw-citizen/ussd", label: "Canal USSD (*123#)", icon: Phone },
    ],
  },
];

function NavMenu({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-5 overflow-y-auto p-3" aria-label="Menu do GW Citizen">
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
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 font-semibold"
                      : "text-ink-muted hover:bg-surface-strong hover:text-ink",
                  )}
                >
                  <item.icon className="size-4.5" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function ProductSwitcher() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-left text-xs font-semibold text-ink shadow-xs transition hover:bg-surface-strong"
      >
        <span className="flex items-center gap-2 truncate">
          <span className="grid size-5 place-items-center rounded bg-blue-600 text-white">
            <User className="size-3" />
          </span>
          <span className="truncate">GW Citizen</span>
        </span>
        <ChevronsUpDown className="size-3.5 text-ink-faint" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 z-50 mt-1.5 max-h-80 w-64 overflow-y-auto rounded-xl border border-border bg-surface p-1.5 shadow-lg">
            <p className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-ink-faint uppercase">
              Ecossistema GWDC
            </p>
            {PRODUCTS.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push(p.slug === "gw-citizen" ? "/app/gw-citizen" : `/app/${p.slug}`);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-xs transition",
                    p.slug === "gw-citizen"
                      ? "bg-blue-50 font-semibold text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                      : "text-ink hover:bg-surface-strong",
                  )}
                >
                  <Icon className="size-3.5" style={{ color: p.color }} />
                  <span className="truncate">{p.name}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function CitizenGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<DemoUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setUser(getSession());
  }, []);

  function handleSignOut() {
    signOut();
    router.push("/login");
  }

  return (
    <RequireAuth>
      <div className="flex min-h-screen bg-surface-muted text-ink">
        {/* Sidebar desktop */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <Link href="/" className="inline-flex">
              <Logo compact />
            </Link>
            <Badge tone="info" className="gap-1 text-[10px] font-semibold uppercase">
              <ShieldCheck className="size-3" /> Cidadão GW
            </Badge>
          </div>

          <div className="border-b border-border p-3">
            <ProductSwitcher />
          </div>

          <NavMenu />

          <div className="border-t border-border p-3">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-muted p-2">
              <Avatar name={user?.name || "Bacari Djassi"} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-ink">{user?.name || "Bacari Djassi"}</p>
                <p className="truncate text-[10px] text-ink-muted">Conta Gov Única</p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                title="Sair"
                className="rounded p-1 text-ink-faint hover:bg-surface hover:text-ink"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
            <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-surface shadow-2xl">
              <div className="flex h-16 items-center justify-between border-b border-border px-4">
                <Logo compact />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-strong"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="border-b border-border p-3">
                <ProductSwitcher />
              </div>
              <NavMenu onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        )}

        {/* Conteúdo principal */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header superior */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/90 px-4 backdrop-blur-md lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-lg border border-border p-2 text-ink lg:hidden hover:bg-surface-strong"
              >
                <Menu className="size-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-sm font-bold text-ink sm:text-base">
                    GOV.GW — Portal Único do Cidadão
                  </h1>
                  <Badge tone="info" className="hidden sm:inline-flex">
                    Autoatendimento Nacional
                  </Badge>
                </div>
                <p className="hidden text-xs text-ink-muted sm:block">
                  Acesso unificado a certidões, saúde, educação, transportes e carteira digital
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-lg border border-border p-2 text-ink-muted hover:bg-surface-strong hover:text-ink"
                title="Alternar tema"
              >
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </button>
              <div className="flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                <ShieldCheck className="size-3.5" />
                <span className="hidden sm:inline">Identidade Verificada</span>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}
