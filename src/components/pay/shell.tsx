"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronsUpDown,
  Landmark,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Network,
  Plug,
  ReceiptText,
  ScanLine,
  Send,
  Settings,
  ShieldCheck,
  Sun,
  Wallet,
  X,
} from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
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
    label: "Principal",
    items: [
      { href: "/app/gw-pay", label: "Visão geral", icon: LayoutDashboard, exact: true },
      { href: "/app/gw-pay/pagar", label: "Pagar", icon: Send },
      { href: "/app/gw-pay/receber", label: "Receber", icon: ScanLine },
    ],
  },
  {
    label: "Conectores & Carteiras",
    items: [
      { href: "/app/gw-pay/provedores", label: "Provedores", icon: Plug },
      { href: "/app/gw-pay/carteiras", label: "Carteiras", icon: Wallet },
    ],
  },
  {
    label: "Extrato & Gestão",
    items: [
      { href: "/app/gw-pay/historico", label: "Histórico", icon: ReceiptText },
      { href: "/app/gw-pay/configuracao", label: "Configurações", icon: Settings },
    ],
  },
];

function NavMenu({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-5 overflow-y-auto p-3" aria-label="Menu do GW Pay">
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
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
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

/** Shell completo do GW Pay (Banco Digital) — substitui o MVP genérico do produto. */
export function PayShell({ children, user }: { children: React.ReactNode; user: DemoUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const otherProducts = PRODUCTS.filter((p) => p.slug !== "gw-pay");

  useEffect(() => {
    setSidebarOpen(false);
    setUserMenuOpen(false);
    setSwitcherOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      {/* ── Barra lateral ─────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Logo />
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold text-ink">GW Pay</p>
            <p className="truncate text-xs text-ink-muted">Banco Digital · Bissau</p>
          </div>
        </div>
        <div className="flex items-center gap-2 border-b border-border px-5 py-2.5">
          <Badge tone="success" dot>Sistema operacional</Badge>
          <Badge tone="info">Barramento GWDC</Badge>
        </div>
        <NavMenu />
        <div className="border-t border-border p-3">
          <div className="rounded-xl bg-surface-strong p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink">
              <ShieldCheck className="size-3.5 text-emerald-600" /> Conectores activos
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">
              Orange Money · MTN MoMo · GW PIX — liquidação em tempo real, assinada e auditada.
            </p>
          </div>
        </div>
        <footer className="border-t border-border px-5 py-3 text-[11px] text-ink-faint">
          GW Pay © 2026 — GW Digital Company · Conectado aos FSP
        </footer>
      </aside>

      {/* ── Área principal ───────────────────────────────── */}
      <div className="flex min-h-dvh flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu">
            <Menu className="size-5" />
          </Button>
          <div className="hidden items-center gap-2 lg:flex">
            <Network className="size-4 text-ink-muted" aria-hidden="true" />
            <span className="text-sm text-ink-muted">GW Pay</span>
            <span className="text-ink-faint">/</span>
            <span className="text-sm font-medium text-ink">Banco Digital</span>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Button variant="ghost" size="icon" aria-label="Notificações">
              <Bell className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Alternar tema">
              {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
            <div className="relative">
              <Button variant="ghost" size="icon" aria-label="Trocar produto" onClick={() => setSwitcherOpen((v) => !v)}>
                <Landmark className="size-5" />
              </Button>
              {switcherOpen && (
                <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
                  <p className="border-b border-border px-4 py-2.5 text-xs font-semibold text-ink-muted">Outros módulos GWDC</p>
                  <div className="max-h-72 overflow-y-auto p-1.5">
                    {otherProducts.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/app/${p.slug}`}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink hover:bg-surface-strong"
                      >
                        {p.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2.5 rounded-full border border-border py-1 pl-1 pr-3 hover:bg-surface-strong"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-expanded={userMenuOpen}
              >
                <Avatar name={user.name} className="size-8" />
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-medium leading-tight text-ink">{user.name}</span>
                  <span className="block text-[11px] leading-tight text-ink-muted">Gestor de Pagamentos</span>
                </span>
                <ChevronsUpDown className="size-3.5 text-ink-faint" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
                  <div className="border-b border-border px-4 py-3">
                    <p className="text-sm font-semibold text-ink">{user.name}</p>
                    <p className="text-xs text-ink-muted">{user.email}</p>
                  </div>
                  <div className="p-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        signOut();
                        router.push("/login");
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10"
                    >
                      <LogOut className="size-4" /> Terminar sessão
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-6">{children}</main>

        <footer className="border-t border-border px-4 py-4 text-center text-[11px] text-ink-faint lg:hidden">
          GW Pay © 2026 — GW Digital Company · Conectado aos FSP
        </footer>
      </div>

      {/* ── Drawer móvel ──────────────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu do GW Pay">
          <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col overflow-y-auto border-r border-border bg-surface p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <Logo />
              <Button variant="ghost" size="icon" aria-label="Fechar menu" onClick={() => setSidebarOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>
            <NavMenu onNavigate={() => setSidebarOpen(false)} />
            <button
              type="button"
              onClick={() => {
                signOut();
                router.push("/login");
              }}
              className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:bg-surface-strong hover:text-danger"
            >
              <LogOut className="size-4.5" /> Terminar sessão
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Guarda de acesso + shell do sistema (sessão simulada em localStorage). */
export function PayGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  useEffect(() => {
    setUser(getSession());
  }, []);
  return (
    <RequireAuth>
      {user && <PayShell user={user}>{children}</PayShell>}
    </RequireAuth>
  );
}