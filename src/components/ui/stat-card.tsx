import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5.5 transition-all duration-200 hover:border-red-300 dark:hover:border-red-900 hover:shadow-[0_8px_24px_-6px_rgba(136,28,38,0.04)] shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
          {title}
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-950/50 shrink-0">
          <Icon className="h-4.5 w-4.5 stroke-[1.8]" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-bold tracking-wide",
              trend.isPositive
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
            )}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}
          </span>
        )}
      </div>

      {description && (
        <p className="mt-1.5 text-[10.5px] text-zinc-400 dark:text-zinc-500 font-medium">
          {description}
        </p>
      )}
    </div>
  );
}
export default StatCard;
