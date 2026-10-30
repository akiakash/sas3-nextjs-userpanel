"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Gavel,
  Heart,
  Loader2,
  MessageSquare,
  ShoppingBag,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable, Column } from "@/components/ui/data-table";
import { ApiError } from "@/lib/api-client";
import { getMyOrders, type PortalOrder } from "@/lib/portal-api";
import { usePortalSummary } from "@/hooks/use-portal-summary";
import { toast } from "sonner";

function formatYen(val: number | null | undefined) {
  if (val == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(val);
}

function DashboardHome() {
  const { summary } = usePortalSummary();
  const [orders, setOrders] = useState<PortalOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void getMyOrders()
      .then((res) => {
        if (!cancelled) setOrders(res.data.slice(0, 8));
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(
            error instanceof ApiError ? error.message : "Failed to load dashboard",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const columns: Column<PortalOrder>[] = [
    {
      header: "Stock ID",
      cell: (row) => (
        <span className="font-mono font-bold text-zinc-900 dark:text-white">
          {row.stockNumber}
        </span>
      ),
    },
    {
      header: "Make & Model",
      cell: (row) => row.makeModel || "—",
    },
    {
      header: "Invoice",
      cell: (row) => formatYen(row.invoiceAmount),
    },
    {
      header: "Status",
      cell: (row) => row.logisticsStatus || (row.sold ? "Sold" : "Open"),
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Orders" value={String(summary.orders)} icon={ShoppingBag} />
        <StatCard title="Open bids" value={String(summary.bids)} icon={Gavel} />
        <StatCard
          title="Negotiations"
          value={String(summary.negotiations)}
          icon={MessageSquare}
        />
        <StatCard
          title="Wishlist"
          value={String(summary.wishlist)}
          icon={Heart}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/vehicles/auction"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-bold text-white"
        >
          Live Auction <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/dashboard/portfolio"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-bold dark:border-zinc-700"
        >
          HP Stock Portfolio
        </Link>
        <Link
          href="/dashboard/negotiations"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-bold dark:border-zinc-700"
        >
          Negotiations
        </Link>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wide text-zinc-500">
            Recent purchased vehicles
          </h2>
          <Link
            href="/dashboard/orders"
            className="text-xs font-bold text-[var(--brand)]"
          >
            View all
          </Link>
        </div>
        {loading ? (
          <p className="flex items-center gap-2 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </p>
        ) : (
          <DataTable columns={columns} data={orders} />
        )}
      </section>
    </div>
  );
}

export default DashboardHome;
