"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  ChevronsUpDown,
  ClipboardCheck,
  ClipboardList,
  DoorOpen,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  MonitorPlay,
  Moon,
  PenLine,
  ScrollText,
  Search,
  Settings,
  Sun,
  UserCheck,
  UserRound,
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
      { href: "/app/gw-education", label: "Visão geral", icon: LayoutDashboard, exact: true },
      { href: "/app/gw-education/aluno", label: "Portal do Aluno", icon: GraduationCap },
      { href: "/app/gw-education/professor", label: "Portal do Professor", icon: UserRound },
      { href: "/app/gw-education/gestor", label: "Portal do Gestor", icon: Landmark },
    ],
  },
  {
    label: "Acadêmico",
    items: [
      { href: "/app/gw-education/alunos", label: "Alunos", icon: UserCheck },
      { href: "/app/gw-education/docentes", label: "Docentes", icon: BookOpen },
      { href: "/app/gw-education/cursos", label: "Cursos", icon: DoorOpen },
      { href: "/app/gw-education/turmas", label: "Turmas", icon: DoorOpen },
      { href: "/app/gw-education/matriculas", label: "Matrículas", icon: ClipboardList },
    ],
  },
  {
    label: "Avaliação",
    items: [
      { href: "/app/gw-education/notas", label: "Notas & Boletim", icon: ClipboardCheck },
      { href: "/app/gw-education/frequencia", label: "Frequência", icon: CalendarCheck },
      { href: "/app/gw-education/avaliacoes", label: "Avaliações online", icon: PenLine },
    ],
  },
  {
    label: "Operacional",
    items: [
      { href: "/app/gw-education/calendario", label: "Calendário", icon: CalendarDays },
      { href: "/app/gw-education/financeiro", label: "Financeiro", icon: Wallet },
      { href: "/app/gw-education/ava", label: "AVA", icon: MonitorPlay },
      { href: "/app/gw-education/biblioteca", label: "Biblioteca", icon: Library },
      { href: "/app/gw-education/diplomas", label: "Diplomas", icon: ScrollText },
    ],
  },
  {
    label: "Gestão",
    items: [
      { href: "/app/gw-education/relatorios", label: "Relatórios", icon: BarChart3 },
      { href: "/app/gw-education/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
];

function NavMenu({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-5 overflow-y-auto p-3" aria-label="Menu do sistema acadêmico">
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
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
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

/** Shell completo do sistema GW Education (substitui o MVP do produto). */
export function EducationShell({ children, user }: { children: React.ReactNode; user: DemoUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const otherProducts = PRODUCTS.filter((p) => p.slug !== "gw-education");

  useEffect(() => {
    setSidebarOpen(false);
    setUserMenuOpen(false);
    setSwitcherOpen(false);
  }, [pathname]);

  const education = PRODUCTS.find((p) => p.slug === "gw-education");

  return (
    <div className="flex min-h-screen bg-surface-alt">
      {/* ── Sidebar (desktop) ─────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          <Link href="/app/gw-education" aria-label="GW Education — Início">
            <Logo />
          </Link>
          <Badge tone="brand" className="ml-auto">Sistema</Badge>
        </div>
        <NavMenu />
        <div className="border-t border-border p-3">
          <Link
            href="/mvps"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-strong hover:text-ink"
          >
            <LayoutDashboard className="size-4.5" /> Outros módulos GWDC
          </Link>
          <button
            type="button"
            onClick={() => {
              signOut();
              router.push("/login");
            }}
            className="mt-1 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-strong hover:text-danger"
          >
            <LogOut className="size-4.5" /> Terminar sessão
          </button>
        </div>
      </aside>

      {/* ── Área principal ────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur-md sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu" onClick={() => setSidebarOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-ink">
              {education?.name} <span className="font-normal text-ink-faint">· Sistema de gestão acadêmica</span>
            </p>
            <p className="hidden truncate text-xs text-ink-faint sm:block">República da Guiné-Bissau · Ano letivo 2026</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
              <input
                aria-label="Busca global no sistema"
                placeholder="Buscar aluno, disciplina, matrícula…"
                className="h-9 w-56 rounded-lg border border-border-strong bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 xl:w-72"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === "dark" ? "Tema claro" : "Tema escuro"}>
              {theme === "dark" ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notificações">
              <Bell className="size-4.5" />
              <span className="absolute mt-[-14px] ml-[14px] grid size-4 place-items-center rounded-full bg-danger text-[9px] font-bold text-white">4</span>
            </Button>

            {/* Alternador de produtos */}
            <div className="relative">
              <Button variant="outline" size="sm" className="hidden md:inline-flex" onClick={() => setSwitcherOpen((v) => !v)} aria-expanded={switcherOpen}>
                {education?.icon && <education.icon className="size-4" style={{ color: education.color }} aria-hidden="true" />}
                Alternar módulo
                <ChevronsUpDown className="size-3.5 text-ink-faint" />
              </Button>
              {switcherOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-border bg-surface p-2 shadow-2xl">
                  <p className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-ink-faint uppercase">Ecossistema GWDC</p>
                  <div className="max-h-80 overflow-y-auto">
                    {otherProducts.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/app/${p.slug}`}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-strong"
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
                  <span className="block text-[10px] text-ink-faint">Secretaria Acadêmica Nacional</span>
                </span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-border bg-surface p-2 shadow-2xl">
                  <div className="border-b border-border px-3 py-2.5">
                    <p className="text-sm font-semibold text-ink">{user.name}</p>
                    <p className="text-xs text-ink-faint">{user.email}</p>
                    <Badge tone="brand" className="mt-2">Perfil gestor nacional</Badge>
                  </div>
                  <Link href="/app/gw-education/configuracoes" className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-strong hover:text-ink">
                    <Settings className="size-4" /> Configurações da conta
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      router.push("/login");
                    }}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-strong hover:text-danger"
                  >
                    <LogOut className="size-4" /> Terminar sessão
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>

        <footer className="border-t border-border px-6 py-4 text-center text-xs text-ink-faint">
          GW Education © 2026 — GW Digital Company · Conectado ao barramento nacional GWDC
        </footer>
      </div>

      {/* ── Drawer móvel ──────────────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu do sistema">
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
              <LogOut className="size-4.5" /> Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Guarda de acesso + shell do sistema (sessão simulada em localStorage). */
export function EducationGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  useEffect(() => {
    setUser(getSession());
  }, []);
  return (
    <RequireAuth>
      {user && <EducationShell user={user}>{children}</EducationShell>}
    </RequireAuth>
  );
}