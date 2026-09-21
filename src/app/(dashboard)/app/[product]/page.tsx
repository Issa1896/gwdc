"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { MvpView } from "@/components/dashboard/mvp-view";
import { getMvpData } from "@/data/mvp";
import {
  AcademicCalendarExtra,
  AiReportExtra,
  BankTransactionsExtra,
  ClimateGaugesExtra,
  TransportMapExtra,
  TransportTicketsExtra,
} from "@/components/dashboard/sections";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

/** Seções especiais por produto (Módulos 6-11). */
function extrasFor(slug: string): React.ReactNode {
  switch (slug) {
    case "gw-education":
      return <AcademicCalendarExtra />;
    case "gw-bank":
      return <BankTransactionsExtra />;
    case "gw-transport":
      return (
        <>
          <TransportTicketsExtra />
          <TransportMapExtra />
        </>
      );
    case "gw-climate":
      return <ClimateGaugesExtra />;
    case "gw-analytics":
      return <AiReportExtra />;
    default:
      return null;
  }
}

/** Página do MVP navegável de cada produto (Módulo 5). */
export default function ProductMvpPage() {
  const params = useParams<{ product: string }>();
  const slug = params.product;
  const data = getMvpData(slug);

  if (!data) {
    return (
      <main className="grid min-h-[60vh] place-items-center px-4">
        <div className="text-center">
          <p className="font-display text-6xl font-bold text-brand-500">404</p>
          <h1 className="mt-3 font-display text-xl font-bold text-ink">MVP não encontrado</h1>
          <p className="mt-2 text-sm text-ink-muted">O produto solicitado não possui demonstração disponível.</p>
          <Link href="/mvps" className="mt-6 inline-block">
            <Button>
              <Compass className="size-4" /> Ver todos os MVPs
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return <MvpView data={data} extras={extrasFor(slug)} />;
}
