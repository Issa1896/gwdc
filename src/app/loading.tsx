import { Logo } from "@/components/ui/logo";
import { Skeleton } from "@/components/ui/progress";

/** Tela de carregamento (streaming) padrão. */
export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-3">
        <Logo />
        <p className="text-sm text-ink-muted">Carregando…</p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <Skeleton className="h-44" />
        <Skeleton className="h-44" />
        <Skeleton className="h-44" />
      </div>
    </main>
  );
}
