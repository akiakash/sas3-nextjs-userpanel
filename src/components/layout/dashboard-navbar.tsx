"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { dashboardNavItems } from "@/components/layout/dashboard-nav-config";

export function DashboardNavbar() {
  const pathname = usePathname();

  return (
    <nav
      className="border-b border-zinc-200 bg-white shadow-sm"
      aria-label="Dashboard navigation"
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-1 overflow-x-auto px-4 scrollbar-thin sm:gap-2 sm:px-6">
        {dashboardNavItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.to
            : pathname === item.to || pathname.startsWith(`${item.to}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              href={item.to}
              className={cn(
                "relative flex shrink-0 items-center gap-2 border-b-2 px-3 py-3.5 text-sm font-semibold transition-colors",
                isActive
                  ? "border-brand-red text-brand-red"
                  : "border-transparent text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={isActive ? 2.25 : 1.75} />
              <span>{item.label}</span>
              {item.badge != null && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                    isActive ? "bg-brand-red text-white" : "bg-zinc-100 text-zinc-600"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default DashboardNavbar;
