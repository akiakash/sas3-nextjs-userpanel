"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { getPortfolioSeller } from "@/lib/dummy-data";
import { PortfolioView } from "@/components/portfolio/portfolio-view";
import { SiteNav } from "@/components/layout/site-nav";

function PublicPortfolioPage() {
  const params = useParams();
  const sellerId = params.sellerId as string;
  const seller = getPortfolioSeller(sellerId);

  if (!seller) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-zinc-50 to-white">
        <SiteNav />
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-20">
          <div className="max-w-md rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-lg">
            <h1 className="text-xl font-bold text-zinc-900">Portfolio not found</h1>
            <p className="mt-2 text-sm text-zinc-600">This importer page does not exist or has been removed.</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-redDark"
            >
              <Home className="h-4 w-4" />
              Back to homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100 via-zinc-50 to-white">
      <SiteNav />

      {/* Page breadcrumb & intro */}
      <div className="border-b border-zinc-200/80 bg-white/60 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <nav className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <Link href="/" className="transition hover:text-brand-red">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-zinc-400">Importers</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-zinc-800">{seller.name}</span>
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <PortfolioView seller={seller} />
      </main>

      <footer className="mt-8 border-t border-zinc-200 bg-zinc-900 py-8 text-center">
        <p className="text-sm font-semibold text-white">SAS3 Trading</p>
        <p className="mt-1 text-xs text-zinc-500">
          Premium Japanese vehicle imports · Creating Value · Building Relationships
        </p>
        <p className="mt-4 text-[10px] text-zinc-600">© {new Date().getFullYear()} SAS3 Trading Group</p>
      </footer>
    </div>
  );
}

export default PublicPortfolioPage;
