"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { DataTable, Column } from "@/components/ui/data-table";
import { ApiError } from "@/lib/api-client";
import {
  listNegotiations,
  type NegotiationThreadSummary,
} from "@/lib/negotiations-api";
import { toast } from "sonner";

function formatYen(amount: number) {
  return `¥${amount.toLocaleString("en-US")}`;
}

function BidsDashboard() {
  const router = useRouter();
  const [threads, setThreads] = useState<NegotiationThreadSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let cancelled = false;
    void listNegotiations()
      .then((list) => {
        if (!cancelled) {
          setThreads(
            list.filter((thread) => thread.sourceType !== "stock"),
          );
        }
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(
            error instanceof ApiError ? error.message : "Failed to load bids",
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

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    if (!q) return threads;
    return threads.filter(
      (thread) =>
        thread.vehicleTitle.toLowerCase().includes(q) ||
        thread.referenceCode.toLowerCase().includes(q) ||
        (thread.lotNo ?? "").toLowerCase().includes(q),
    );
  }, [threads, searchTerm]);

  const columns: Column<NegotiationThreadSummary>[] = [
    {
      header: "Reference",
      cell: (row) => (
        <span className="font-mono font-bold text-[var(--brand)]">
          {row.referenceCode}
        </span>
      ),
    },
    {
      header: "Vehicle",
      cell: (row) => (
        <div>
          <div className="font-bold">{row.vehicleTitle}</div>
          <div className="text-xs text-zinc-500">
            {(row.sourceType === "stock" ? "Stock" : "Lot") +
              ` #${row.lotNo || "—"}`}
          </div>
        </div>
      ),
    },
    {
      header: "Offer",
      cell: (row) => formatYen(row.offerAmount),
    },
    {
      header: "Status",
      cell: (row) => (
        <span className="inline-flex rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase dark:bg-zinc-800">
          {row.status}
        </span>
      ),
    },
    {
      header: "Updated",
      cell: (row) => new Date(row.lastMessageAt).toLocaleString(),
    },
  ];

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search bids…"
          className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[var(--brand)] dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading bids…
        </p>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(row) =>
            router.push(`/dashboard/negotiations?thread=${row.id}`)
          }
        />
      )}
      {!loading && filtered.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No auction bids yet. Use Send for Bid on Live Auction.
        </p>
      ) : null}
    </div>
  );
}

export default BidsDashboard;
