"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardHeader from "@/components/layout/dashboard-header";
import DashboardNavbar from "@/components/layout/dashboard-navbar";
import { useAuth } from "@/contexts/auth-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-svh items-center justify-center bg-zinc-50 text-sm font-semibold text-zinc-500">
        Loading your account...
      </div>
    );
  }

  const getPageTitle = (path: string) => {
    if (path.includes("/dashboard/orders")) return "Order Ledger & Invoices";
    if (path.includes("/dashboard/payments")) return "Transaction Balances & History";
    if (path.includes("/dashboard/bids")) return "Live Bidding Ledger";
    if (path.includes("/dashboard/negotiations")) return "Chat Negotiations";
    if (path.includes("/dashboard/wishlist")) return "My Wishlist Inventory";
    if (path.includes("/dashboard/favourites")) return "Saved Specifications & Favourites";
    if (path.includes("/dashboard/portfolio")) return "My Portfolio";
    if (path.includes("/dashboard/profile")) return "Account Settings";
    return "Operations Center";
  };

  const title = getPageTitle(pathname);

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-zinc-50/80 text-zinc-900">
      {/* Top user panel bar */}
      <DashboardHeader />

      {/* Horizontal navigation */}
      <DashboardNavbar />

      {/* Page content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
          <div className="mb-6 border-b border-zinc-200 pb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
              SAS3 Premium Ledger
            </p>
            <h1 className="mt-1 text-xl font-black tracking-tight text-zinc-900 sm:text-2xl">
              {title}
            </h1>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

