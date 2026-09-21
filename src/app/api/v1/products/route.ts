import { NextRequest } from "next/server";
import { PRODUCTS } from "@/data/products";
import { apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "25", 10);

  let filtered = PRODUCTS.map((p) => ({
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    category: p.category,
    color: p.color,
    summary: p.summary,
    status: p.status,
    kpis: p.metrics,
  }));

  if (category) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
  }

  if (status) {
    filtered = filtered.filter(
      (p) => p.status.toLowerCase() === status.toLowerCase(),
    );
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return apiSuccess(
    {
      data: paged,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    },
    200,
    {
      "X-Total-Count": String(total),
    },
  );
}
