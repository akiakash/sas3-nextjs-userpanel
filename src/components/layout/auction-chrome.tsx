"use client";

import Link from "next/link";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import { Sas3Logo } from "@/components/layout/sas3-logo";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

export function AuctionChrome({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <div className="flex min-h-svh flex-col bg-zinc-50 text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Sas3Logo height={44} className="h-10 sm:h-11" linkTo="/" />
            <div className="hidden border-l border-zinc-200 pl-3 sm:block">
              <span className="block text-[11px] font-extrabold tracking-widest text-red-600">
                LIVE AUCTIONS
              </span>
              <span className="block text-[10px] font-medium text-zinc-500">
                Aleado vehicle lots
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/vehicles/auction"
              className="rounded-lg bg-red-50 px-3 py-2 text-xs font-extrabold tracking-wider text-red-600"
            >
              BROWSE
            </Link>
            {!isLoading && isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="hidden items-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-bold text-zinc-700 transition hover:bg-zinc-50 sm:flex"
                >
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>
                <span
                  className={cn(
                    "hidden max-w-[160px] truncate text-xs font-semibold text-zinc-600 md:inline",
                  )}
                  title={user?.fullName}
                >
                  <User size={14} className="mr-1 inline text-zinc-400" />
                  {user?.fullName}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-bold text-zinc-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-3 py-5 sm:px-6 sm:py-6">
        {children}
      </main>
    </div>
  );
}
