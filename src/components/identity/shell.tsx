"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CheckCircle2,
  FileCheck2,
  Fingerprint,
  LogOut,
  Menu,
  Moon,
  Shield,
  ShieldCheck,
  Sun,
  UserCheck,
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
    label: "Identificação Soberana",
    items: [
      { href: "/app/gw-identity", label: "Identidades Nacionais", icon: Fingerprint, exact: true },
      { href: "/app/gw-identity/validar", label: "Validador de Assinaturas (ICP)", icon: FileCheck2 },
      { href: "/app/gw-security", label: "Defesa Cibernética (SOC)", icon: Shield },
    ],
  },
];

function NavMenu({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-5 overflow-y-auto p-3" aria-label="Menu do GW Identity">
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
                      ? "bg-violet-500/10 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 font-semibold"
                      : "text-ink-muted hover:bg-surface-raised hover:text-ink"
                  )}
                >
                  <item.icon className={cn("size-4 shrink-0", isActive ? "text-violet-600 dark:text-violet-400" : "text-ink-faint")} />
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

export function IdentityGate({ children }: { children: React.ReactNode }) {
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
              className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-raised hover:text-ink md:hidden"
              aria-label="Abrir menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Logo compact />
              <span className="hidden text-xs text-ink-faint sm:inline">/</span>
              <div className="flex items-center gap-1.5">
                <Fingerprint className="size-4 text-violet-600 dark:text-violet-400" />
                <span className="text-xs font-bold text-ink">GW Identity</span>
              </div>
            </Link>

            {/* ICP-Guiné Sovereign Badge */}
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-border-subtle">
              <Badge tone="brand" className="gap-1.5 py-0.5 px-2.5 bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/30 text-[11px] font-semibold">
                <ShieldCheck className="size-3 text-violet-500" />
                ICP-Guiné Raiz
              </Badge>
              <span className="text-[11px] text-ink-faint">Identidade Soberana & Biometria</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Ecosystem Switcher */}
            <div className="relative group">
              <button
                className="hidden md:flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-raised px-2.5 py-1 text-xs font-medium text-ink-muted hover:text-ink"
                aria-label="Alternar produto"
              >
                <UserCheck className="size-3.5 text-violet-500" />
                <span>Ecossistema GW</span>
              </button>
              <div className="absolute right-0 top-full mt-1 hidden w-56 rounded-xl border border-border-subtle bg-surface p-2 shadow-xl group-hover:block group-focus-within:block z-50">
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">Módulos Soberanos</p>
                <div className="max-h-64 overflow-y-auto space-y-0.5">
                  {PRODUCTS.slice(0, 10).map((p) => (
                    <Link
                      key={p.slug}
                      href={`/app/${p.slug}`}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-ink-muted hover:bg-surface-raised hover:text-ink transition-colors"
                    >
                      <p.icon className="size-3.5 shrink-0" style={{ color: p.color }} />
                      <span className="truncate">{p.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-ink-muted hover:bg-surface-raised hover:text-ink"
              aria-label="Alternar tema"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            {/* User Profile & Logout */}
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-border-subtle">
                <Avatar name={user.name} />
                <button
                  onClick={handleLogout}
                  className="rounded-lg p-2 text-ink-muted hover:bg-surface-raised hover:text-ink"
                  title="Sair da conta"
                  aria-label="Sair da conta"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Body with Sidebar */}
        <div className="flex flex-1">
          {/* Desktop Sidebar */}
          <aside className="hidden w-64 shrink-0 border-r border-border-subtle bg-surface md:block">
            <div className="sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col justify-between">
              <NavMenu />
              <div className="border-t border-border-subtle p-4">
                <div className="rounded-xl border border-border-subtle bg-surface-ground p-3 text-[11px] text-ink-muted space-y-1">
                  <p className="font-semibold text-ink flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-violet-500" />
                    Padrão ICAO / ISO 3166
                  </p>
                  <p className="text-[10px] text-ink-faint leading-relaxed">
                    Credenciais digitais seguras com criptografia assimétrica e biometria multifatorial.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Drawer */}
          {mobileOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
              <div className="relative flex w-64 flex-col bg-surface p-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="size-4 text-violet-500" />
                    <span className="text-xs font-bold text-ink">GW Identity</span>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1 text-ink-muted hover:bg-surface-raised">
                    <X className="size-4" />
                  </button>
                </div>
                <NavMenu onNavigate={() => setMobileOpen(false)} />
              </div>
            </div>
          )}

          {/* Main Workspace Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}
