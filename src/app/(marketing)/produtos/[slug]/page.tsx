import type { Metadata } from "next";
import { ProductPage } from "@/components/marketing/product-page";
import { getProduct, PRODUCTS } from "@/data/products";

interface Props {
  params: Promise<{ slug: string }>;
}

/** Geração estática dos produtos na build (SSG). */
export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Produto não encontrado" };
  return {
    title: product.name,
    description: `${product.tagline}. ${product.summary}`,
  };
}

/** Página dedicada de produto (Módulo 4). */
export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params;
  return <ProductPage slug={slug} />;
}
