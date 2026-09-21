import type { ReactNode } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertTone = "info" | "success" | "warning" | "danger";

const config: Record<AlertTone, { icon: typeof Info; classes: string }> = {
  info: { icon: Info, classes: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-100" },
  success: { icon: CheckCircle2, classes: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100" },
  warning: { icon: AlertTriangle, classes: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100" },
  danger: { icon: AlertCircle, classes: "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100" },
};

/** Alerta de status — Design System GWDC. */
export function Alert({ tone = "info", title, children, className }: { tone?: AlertTone; title: string; children?: ReactNode; className?: string }) {
  const { icon: Icon, classes } = config[tone];
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("flex items-start gap-3 rounded-lg border p-4 text-sm", classes, className)}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div>
        <p className="font-semibold">{title}</p>
        {children && <div className="mt-1 opacity-90">{children}</div>}
      </div>
    </div>
  );
}
