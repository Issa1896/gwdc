"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardShell, RequireAuth } from "@/components/dashboard/shell";
import { AiAssistant } from "@/components/ai/assistant";
import { getSession, type DemoUser } from "@/lib/mvp/auth";
import { getProduct } from "@/data/products";

/** Layout do MVP: guarda de autenticação + shell + assistente de IA. */
export default function ProductLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ product: string }>();
  const productSlug = params?.product ?? "gw-citizen";
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    setUser(getSession());
  }, []);

  const product = getProduct(productSlug);

  return (
    <RequireAuth>
      {user && (
        <>
          <DashboardShell productSlug={productSlug} user={user}>
            {children}
          </DashboardShell>
          <AiAssistant productName={product?.name ?? "GWDC"} />
        </>
      )}
    </RequireAuth>
  );
}
