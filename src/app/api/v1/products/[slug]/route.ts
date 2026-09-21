import { NextRequest } from "next/server";
import { PRODUCTS } from "@/data/products";
import { apiError, apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return apiError(404, "PRODUCT_NOT_FOUND", `O produto com slug '${slug}' não foi encontrado.`);
  }

  return apiSuccess({
    slug: product.slug,
    name: product.name,
    tagline: product.tagline,
    category: product.category,
    color: product.color,
    summary: product.summary,
    objective: product.objective,
    audience: product.audience,
    features: product.features,
    benefits: product.benefits,
    flow: product.flow,
    tech: product.tech,
    status: product.status,
    metrics: product.metrics,
  });
}
