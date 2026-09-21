import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "gold";
type Size = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  asChild?: never;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary-strong shadow-sm focus-visible:outline-brand-500 disabled:bg-brand-300",
  secondary:
    "bg-brand-50 text-brand-800 hover:bg-brand-100 dark:bg-brand-950 dark:text-brand-100 dark:hover:bg-brand-900",
  outline:
    "border border-border-strong bg-surface text-ink hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-300",
  ghost: "text-ink-muted hover:bg-surface-strong hover:text-ink",
  danger: "bg-danger text-white hover:opacity-90",
  gold: "bg-gold-500 text-white hover:bg-gold-600",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  icon: "h-10 w-10",
};

/** Botão da GWDC — componente base do Design System. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading = false, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-lg font-medium transition-all duration-150 select-none",
        "disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  ),
);
Button.displayName = "Button";
