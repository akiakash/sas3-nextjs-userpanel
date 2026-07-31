"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import {
  User,
  UserPlus,
  Calculator,
  Headset,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Sas3Logo } from "@/components/layout/sas3-logo";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Live Auctions", href: "/vehicles/auction", badge: "LIVE" },
  { label: "Featured Inventory", href: "#featured", badge: "" },
  { label: "How to Buy", href: "#process", badge: "" },
  { label: "Company & Bank", href: "#company", badge: "" },
];

type HeaderProps = {
  activeAuth?: "login" | "register";
  onOpenCifModal?: () => void;
  onOpenChatModal?: () => void;
};

export default function Header({
  activeAuth,
  onOpenCifModal,
  onOpenChatModal,
}: HeaderProps) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const firstName = user?.fullName?.split(" ")[0]?.trim();

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function handleNavClick(href: string, e: MouseEvent) {
    if (href === "#cif-calculator" && onOpenCifModal) {
      e.preventDefault();
      onOpenCifModal();
    }
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:h-[4.5rem] sm:gap-5 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex min-w-0 items-center gap-3">
          <Sas3Logo
            height={48}
            priority
            className="h-10 sm:h-12 lg:h-[3.25rem]"
            linkTo="/"
          />
          <div className="hidden border-l border-zinc-200 pl-3 lg:block">
            <span className="block text-[11px] font-extrabold tracking-[0.14em] text-red-600">
              JAPAN VEHICLE AUCTIONS
            </span>
            <span className="block text-[10px] font-medium text-zinc-500">
              Premium Global Import Desk
            </span>
          </div>
        </div>

        {/* Center nav — desktop */}
        <nav
          className="hidden items-center justify-center gap-0.5 xl:flex"
          aria-label="Primary"
        >
          {navItems.map((item) => {
            const isRoute = item.href.startsWith("/");
            const className =
              "group inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[13px] font-semibold text-zinc-700 transition-colors hover:bg-red-50 hover:text-red-700";
            const content = (
              <>
                {item.label}
                {item.badge ? (
                  <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white">
                    {item.badge}
                  </span>
                ) : null}
              </>
            );

            if (isRoute) {
              return (
                <Link key={item.label} href={item.href} className={className}>
                  {content}
                </Link>
              );
            }

            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(item.href, e)}
                className={className}
              >
                {content}
              </a>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onOpenCifModal}
            className="hidden items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-semibold text-red-700 transition hover:bg-red-100 lg:inline-flex"
          >
            <Calculator size={14} strokeWidth={2.25} />
            CIF Calculator
          </button>

          <button
            type="button"
            onClick={onOpenChatModal}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-[12px] font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 sm:px-3"
            aria-label="Ask Advisor"
          >
            <Headset size={14} className="text-red-600" strokeWidth={2.25} />
            <span className="hidden md:inline">Ask Advisor</span>
          </button>

          {!isLoading && isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex max-w-[9.5rem] items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-[12px] font-semibold capitalize text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50 sm:px-3"
              >
                <LayoutDashboard size={14} strokeWidth={2.25} />
                <span className="truncate">{firstName || "Account"}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-[12px] font-semibold text-zinc-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 sm:px-3"
                aria-label="Log out"
              >
                <LogOut size={14} strokeWidth={2.25} />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-[12px] font-semibold text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-50 sm:px-3",
                  activeAuth === "login" &&
                    "border-red-600 bg-red-50 text-red-700",
                )}
              >
                <User size={14} strokeWidth={2.25} />
                <span className="hidden min-[420px]:inline">Log in</span>
              </Link>
              <Link
                href="/register"
                className="red-gradient-btn inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold"
              >
                <UserPlus size={14} strokeWidth={2.25} />
                <span className="hidden min-[420px]:inline">Register</span>
              </Link>
            </>
          )}

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 p-2 text-zinc-700 transition hover:bg-zinc-50 xl:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile / tablet nav panel */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="border-t border-zinc-100 bg-white xl:hidden"
        >
          <nav className="mx-auto flex max-w-[1440px] flex-col gap-1 px-4 py-3 sm:px-6" aria-label="Mobile">
            {navItems.map((item) => {
              const isRoute = item.href.startsWith("/");
              const className =
                "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-red-50 hover:text-red-700";
              const badge = item.badge ? (
                <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  {item.badge}
                </span>
              ) : null;

              if (isRoute) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={className}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                    {badge}
                  </Link>
                );
              }

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={className}
                  onClick={(e) => handleNavClick(item.href, e)}
                >
                  {item.label}
                  {badge}
                </a>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenCifModal?.();
              }}
              className="mt-1 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 lg:hidden"
            >
              <Calculator size={16} />
              CIF Calculator
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
