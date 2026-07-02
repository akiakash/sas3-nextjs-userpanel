"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Gavel,
  MessageSquare,
  Heart,
  Star,
  User,
  Store,
  LogOut,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: number;
  exact?: boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, exact: true },
      { label: "Orders", to: "/dashboard/orders", icon: ShoppingBag, badge: 5 },
      { label: "Payments", to: "/dashboard/payments", icon: CreditCard },
    ],
  },
  {
    title: "Auctions",
    items: [
      { label: "Bids", to: "/dashboard/bids", icon: Gavel, badge: 8 },
      { label: "Negotiations", to: "/dashboard/negotiations", icon: MessageSquare, badge: 2 },
    ],
  },
  {
    title: "Saved",
    items: [
      { label: "Wishlist", to: "/dashboard/wishlist", icon: Heart, badge: 3 },
      { label: "Favourites", to: "/dashboard/favourites", icon: Star },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "My Portfolio", to: "/dashboard/portfolio", icon: Store },
      { label: "Profile", to: "/dashboard/profile", icon: User },
    ],
  },
];

function NavLink({
  item,
  onClose,
}: {
  item: NavItem;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const isActive = item.exact
    ? pathname === item.to
    : pathname === item.to || pathname.startsWith(`${item.to}/`);

  const Icon = item.icon;

  return (
    <Link
      href={item.to}
      onClick={onClose}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150",
        isActive
          ? "bg-brand-red/15 text-white"
          : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
      )}
    >
      {isActive && (
        <span
          className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-brand-red"
          aria-hidden
        />
      )}
      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive ? "text-brand-red" : "text-zinc-500 group-hover:text-zinc-300"
        )}
        strokeWidth={isActive ? 2.25 : 1.75}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge != null && (
        <span
          className={cn(
            "inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[10px] font-bold tabular-nums",
            isActive
              ? "bg-brand-red/25 text-white"
              : "bg-zinc-800 text-zinc-400 ring-1 ring-zinc-700/80"
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar({ className, onClose }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-64 shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950 text-zinc-100",
        className
      )}
    >
      {/* Brand */}
      <div className="border-b border-zinc-800/80 px-5 py-5">
        <Link
          href="/"
          onClick={onClose}
          className="block transition-opacity hover:opacity-90"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">
            Importer Portal
          </span>
          <span className="mt-1 block text-lg font-black tracking-tight">
            <span className="text-brand-red">SAS3</span>{" "}
            <span className="text-white">Trading</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 space-y-6 overflow-y-auto px-3 py-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700"
        aria-label="Dashboard navigation"
      >
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink item={item} onClose={onClose} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Marketplace link */}
      <div className="px-3 pb-2">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2.5 text-xs font-semibold text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-800/50 hover:text-zinc-200"
        >
          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-brand-red" />
          Browse live inventory
        </Link>
      </div>

      {/* User footer */}
      <div className="border-t border-zinc-800/80 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-zinc-900/80 p-3 ring-1 ring-zinc-800">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-red text-xs font-bold text-white">
            DK
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-100">
              Dharshini Kumar
            </p>
            <p className="truncate text-[10px] font-medium uppercase tracking-wide text-zinc-500">
              Gold Importer
            </p>
          </div>
          <Link
            href="/login"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-brand-red"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
