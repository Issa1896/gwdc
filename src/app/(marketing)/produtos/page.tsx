import type { Metadata } from "next";
import { ProductGrid } from "@/components/marketing/product-page";
import { PageHero, CTABand } from "@/components/marketing/sections";

export const metadata: Metadata = {
  title: "Produtos",
  description: "Ecossistema de 18 produtos GWDC: Governo, Cidadão, Justiça, Educação, ERP, Banco, Pagamentos, Saúde, Transporte, Clima e mais.",
};

/** Página Produtos — índice do ecossistema GWDC (Módulo 4). */
export default function ProdutosPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Início", href: "/" }, { label: "Produtos" }]}
        eyebrow="Ecossistema GWDC"
        title="A família GW: 18 produtos, uma identidade"
        description="Cada produto resolve um problema real do país. Todos compartilham a mesma plataforma, os mesmos dados e o mesmo padrão de excelência."
      />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ProductGrid />
        </div>
      </section>
      <CTABand />
    </>
  );
}
