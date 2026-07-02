"use client";

import Link from "next/link";
import { Store } from "lucide-react";
import { getPortfolioSeller } from "@/lib/dummy-data";
import { PortfolioView } from "@/components/portfolio/portfolio-view";

const DEFAULT_SELLER_ID = "dharshini-kumar";

function DashboardPortfolioPage() {
  const seller = getPortfolioSeller(DEFAULT_SELLER_ID);

  if (!seller) {
    return (
      <p className="text-sm text-zinc-600">
        Portfolio not configured.{" "}
        <Link href="/dashboard/profile" className="font-semibold text-brand-red hover:underline">
          Complete your profile
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            <Store className="h-4 w-4" />
            Public storefront
          </p>
          <h2 className="mt-1 text-2xl font-black text-zinc-900">My portfolio</h2>
          <p className="mt-2 max-w-xl text-sm text-zinc-600">
            Share this page with customers so they can browse your listed vehicles and send
            inquiries with their contact details.
          </p>
        </div>
      </div>
      <PortfolioView seller={seller} ownerMode />
    </div>
  );
}

export default DashboardPortfolioPage;
