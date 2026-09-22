"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Boxes,
  LogOut,
  Moon,
  Store,
  Sun,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/progress";
import { useTheme } from "@/components/theme-provider";
import { RequireAuth } from "@/components/dashboard/shell";
import { getSession, signOut, type DemoUser } from "@/lib/mvp/auth";
import { useErp } from "@/lib/erp-store";
import { cn } from "@/lib/utils";

export function PosGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { state } = useErp();
  const [user, setUser] = useState<DemoUser | null>(null);
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
        {/* Top Header do PDV */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border-subtle bg-surface/90 px-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Link href="/app/gw-erp" className="flex items-center gap-2">
              <Logo compact />
            </Link>

            <span className="hidden text-ink-faint sm:inline">/</span>

            <div className="flex items-center gap-2">
              <div className="grid size-6 place-items-center rounded-md bg-pink-600 text-white shadow-sm">
                <Store className="size-3.5" />
              </div>
              <span className="font-display text-sm font-bold tracking-tight text-ink">GW POS</span>
              <Badge
                tone={state.caixaAtual.status === "aberto" ? "success" : "danger"}
                className="text-[10px]"
              >
                {state.caixaAtual.status === "aberto" ? "Caixa Aberto" : "Caixa Fechado"}
              </Badge>
            </div>

            {/* Abas Rápidas do POS */}
            <div className="hidden sm:flex items-center gap-1 ml-4 border-l border-border-subtle pl-4">
              <Link
                href="/app/gw-pos"
                className={cn(
                  "px-2.5 py-1 rounded text-xs font-semibold transition",
                  pathname === "/app/gw-pos"
                    ? "bg-pink-500/10 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300"
                    : "text-ink-muted hover:text-ink"
                )}
              >
                Frente de Caixa
              </Link>
              <Link
                href="/app/gw-pos/caixa"
                className={cn(
                  "px-2.5 py-1 rounded text-xs font-semibold transition",
                  pathname === "/app/gw-pos/caixa"
                    ? "bg-pink-500/10 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300"
                    : "text-ink-muted hover:text-ink"
                )}
              >
                Controle de Turno & Caixa
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Atalho Retaguarda ERP */}
            <Link
              href="/app/gw-erp"
              className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface px-2.5 py-1 text-xs font-medium text-ink hover:bg-surface-raised"
            >
              <Boxes className="size-3.5 text-amber-600" />
              <span>Retaguarda ERP</span>
            </Link>

            {/* Tema claro/escuro */}
            <button
              onClick={toggleTheme}
              className="grid size-8 place-items-center rounded-lg border border-border-subtle text-ink-muted hover:bg-surface-raised"
              aria-label="Alternar tema"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            {/* Operador de Caixa */}
            {user && (
              <div className="flex items-center gap-2 border-l border-border-subtle pl-2">
                <Avatar name={user.name} />
                <div className="hidden flex-col text-left xl:flex">
                  <span className="text-xs font-semibold text-ink leading-tight">{user.name}</span>
                  <span className="text-[10px] text-pink-600 font-semibold leading-none">
                    Operador: {state.caixaAtual.operador}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="grid size-8 place-items-center rounded-lg text-ink-muted hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                  title="Sair do Caixa"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Área de Conteúdo */}
        <main className="flex-1 p-3 sm:p-5 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </RequireAuth>
  );
}
