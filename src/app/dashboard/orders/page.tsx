"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { DataTable, Column } from "@/components/ui/data-table";
import { ApiError } from "@/lib/api-client";
import { getMyOrders, type PortalOrder } from "@/lib/portal-api";
import { toast } from "sonner";

function formatYen(val: number | null | undefined) {
  if (val == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(val);
}

function OrdersLedger() {
  const [orders, setOrders] = useState<PortalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [applied, setApplied] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void getMyOrders(applied || undefined)
      .then((res) => {
        if (!cancelled) setOrders(res.data);
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(
            error instanceof ApiError ? error.message : "Failed to load orders",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [applied]);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const q = searchTerm.toLowerCase();
    return orders.filter(
      (order) =>
        order.stockNumber.toLowerCase().includes(q) ||
        order.makeModel.toLowerCase().includes(q) ||
        (order.chassisNumber ?? "").toLowerCase().includes(q),
    );
  }, [orders, searchTerm]);

  const columns: Column<PortalOrder>[] = [
    {
      header: "No",
      cell: (_, idx) => (
        <span className="font-bold text-zinc-400">{idx + 1}</span>
      ),
      className: "w-12",
    },
    {
      header: "Stock ID",
      cell: (row) => (
        <span className="font-mono font-black text-[var(--brand)]">
          {row.stockNumber}
        </span>
      ),
    },
    {
      header: "Make & Model",
      cell: (row) => (
        <span className="font-bold text-zinc-900 dark:text-zinc-100">
          {row.makeModel || "—"}
        </span>
      ),
    },
    {
      header: "Chassis",
      cell: (row) => (
        <span className="font-mono text-xs text-zinc-500">
          {row.chassisNumber || "—"}
        </span>
      ),
    },
    {
      header: "Invoice Date",
      cell: (row) => row.invoiceDate || "—",
    },
    {
      header: "Term",
      cell: (row) => row.payTerms || "—",
    },
    {
      header: "Invoice",
      cell: (row) => formatYen(row.invoiceAmount),
    },
    {
      header: "Sale price",
      cell: (row) => formatYen(row.salePrice),
    },
    {
      header: "Status",
      cell: (row) => (
        <span className="inline-flex rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {row.logisticsStatus || (row.sold ? "Sold" : "Open")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter this page…"
            className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[var(--brand)] dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setApplied(searchTerm.trim());
          }}
        >
          <button
            type="submit"
            className="h-10 rounded-lg bg-[var(--brand)] px-4 text-sm font-bold text-white"
          >
            Search all
          </button>
        </form>
      </div>

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading your orders…
        </p>
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}
      {!loading && filtered.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No purchased vehicles linked to your account yet.
        </p>
      ) : null}
    </div>
  );
}

export default OrdersLedger;
