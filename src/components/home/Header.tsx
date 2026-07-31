"use client";

import Link from "next/link";
import { User, UserPlus, Calculator, Headset, LayoutDashboard, LogOut } from "lucide-react";
import { Sas3Logo } from "@/components/layout/sas3-logo";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "LIVE AUCTIONS", href: "/vehicles/auction", badge: "LIVE" },
  { label: "FEATURED INVENTORY", href: "#featured", badge: "" },
  { label: "HOW TO BUY", href: "#process", badge: "" },
  { label: "CALCULATE CIF", href: "#cif-calculator", badge: "" },
  { label: "COMPANY & BANK", href: "#company", badge: "" },
];

type HeaderProps = {
  activeAuth?: "login" | "register";
  onOpenCifModal?: () => void;
  onOpenChatModal?: () => void;
};

export default function Header({ activeAuth, onOpenCifModal, onOpenChatModal }: HeaderProps) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-22">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-4">
          <Sas3Logo height={54} priority className="h-12 sm:h-14 lg:h-16" linkTo="/" />
          <div className="hidden border-l border-zinc-200 pl-3 md:block">
            <span className="block text-[11px] font-extrabold tracking-widest text-red-600">JAPAN VEHICLE AUCTIONS</span>
            <span className="block text-[10px] text-zinc-500 font-medium">Premium Global Import Desk</span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => {
            const isRoute = item.href.startsWith("/");
            const className =
              "group relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-extrabold tracking-wider text-zinc-700 transition-all hover:bg-red-50 hover:text-red-600";
            const badge = item.badge ? (
              <span className="animate-soft-pulse rounded-full bg-red-600 px-1.5 py-0.5 text-[9px] font-black text-white">
                {item.badge}
              </span>
            ) : null;

            if (isRoute) {
              return (
                <Link key={item.label} href={item.href} className={className}>
                  {item.label}
                  {badge}
                </Link>
              );
            }

            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.href === "#cif-calculator" && onOpenCifModal) {
                    e.preventDefault();
                    onOpenCifModal();
                  }
                }}
                className={className}
              >
                {item.label}
                {badge}
              </a>
            );
          })}
        </nav>

        {/* Quick Action Tools & Auth */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick CIF Tool */}
          <button
            type="button"
            onClick={onOpenCifModal}
            className="hidden items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 md:flex"
          >
            <Calculator size={15} />
            <span>CIF Calculator</span>
          </button>

          {/* Quick Concierge Support Trigger */}
          <button
            type="button"
            onClick={onOpenChatModal}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-bold text-zinc-700 transition hover:bg-zinc-100"
          >
            <Headset size={15} className="text-red-600" />
            <span className="hidden sm:inline">Ask Advisor</span>
          </button>

          {/* Auth Buttons */}
          {!isLoading && isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3.5 py-2 text-xs font-bold tracking-wider text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50 sm:px-4 sm:py-2.5"
              >
                <LayoutDashboard size={15} />
                <span className="hidden max-w-[120px] truncate min-[420px]:inline">
                  {user?.fullName?.split(" ")[0] || "Dashboard"}
                </span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3.5 py-2 text-xs font-bold tracking-wider text-zinc-800 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 sm:px-4 sm:py-2.5"
              >
                <LogOut size={15} />
                <span className="hidden min-[420px]:inline">LOGOUT</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  "flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3.5 py-2 text-xs font-bold tracking-wider text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50 sm:px-4 sm:py-2.5",
                  activeAuth === "login" && "border-red-600 bg-red-50 text-red-600"
                )}
              >
                <User size={15} /> <span className="hidden min-[420px]:inline">LOGIN</span>
              </Link>

              <Link
                href="/register"
                className="red-gradient-btn flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold tracking-wider"
              >
                <UserPlus size={15} /> <span className="hidden min-[420px]:inline">REGISTER</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
