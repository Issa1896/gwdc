import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

/** Layout do site institucional (marketing) com navbar e footer. */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="conteudo" className="min-h-[70vh]">
        {children}
      </main>
      <Footer />
    </>
  );
}
