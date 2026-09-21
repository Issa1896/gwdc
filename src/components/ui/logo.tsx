import { cn } from "@/lib/utils";

/** Logotipo GWDC (conceito: 'G' conectado ao infinito, tipografia Sora). */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-navy-800 font-display text-lg font-bold text-white shadow-sm"
      >
        G
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-base font-bold tracking-tight text-ink">
            GW DIGITAL
          </span>
          <span className="block text-[10px] font-semibold tracking-[0.28em] text-ink-muted uppercase">
            Company
          </span>
        </span>
      )}
    </span>
  );
}
