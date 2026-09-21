import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Página 404 personalizada. */
export default function NotFound() {
  return (
    <main className="grid min-h-[60vh] place-items-center px-4">
      <div className="text-center">
        <p className="font-display text-7xl font-bold text-brand-500">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-ink">Página não encontrada</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
          O endereço que você procura não existe ou foi movido. Volte ao início e continue explorando o futuro digital da Guiné-Bissau.
        </p>
        <Link href="/" className="mt-8 inline-block">
          <Button size="lg">
            <Compass className="size-4" /> Voltar ao início
          </Button>
        </Link>
      </div>
    </main>
  );
}
