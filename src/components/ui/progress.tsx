import { cn } from "@/lib/utils";

/** Barra de progresso — Design System GWDC. */
export function Progress({
  value,
  tone = "brand",
  className,
  ariaLabel,
}: {
  value: number;
  tone?: "brand" | "gold" | "danger" | "success" | "info";
  className?: string;
  ariaLabel?: string;
}) {
  const toneClasses = {
    brand: "bg-brand-500",
    gold: "bg-gold-500",
    danger: "bg-danger",
    success: "bg-success",
    info: "bg-info",
  };
  const clamped = Math.min(Math.max(value, 0), 100);
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-strong", className)}
    >
      <div className={cn("h-full rounded-full transition-all duration-500", toneClasses[tone])} style={{ width: `${clamped}%` }} />
    </div>
  );
}

/** Avatar com iniciais. */
export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-navy-700 text-xs font-bold text-white",
        className,
      )}
    >
      {initials}
    </span>
  );
}

/** Esqueleto de carregamento. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-surface-strong", className)} />;
}
