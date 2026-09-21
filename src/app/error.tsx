"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Página de erro global (production). */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-surface px-4">
      <div className="text-center">
        <AlertTriangle className="mx-auto size-10 text-gold-500" aria-hidden="true" />
        <h1 className="mt-4 font-display text-2xl font-bold text-ink">Algo deu errado</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
          Ocorreu um erro inesperado. Tente novamente — se o problema persistir, contate nossa equipe.
        </p>
        {error.digest && <p className="mt-2 text-xs text-ink-faint">Referência do erro: {error.digest}</p>}
        <Button className="mt-8" onClick={reset}>
          Tentar novamente
        </Button>
      </div>
    </main>
  );
}
