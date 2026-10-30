"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Loader2, MessageSquare, Search } from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";
import { listPortalStock, type PortalStock } from "@/lib/portal-api";
import StockInquireModal from "@/components/customer/StockInquireModal";

function PortfolioDashboard() {
  const [items, setItems] = useState<PortalStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [applied, setApplied] = useState("");
  const [inquire, setInquire] = useState<PortalStock | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listPortalStock({ q: applied || undefined });
      setItems(res.data);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to load stock",
      );
    } finally {
      setLoading(false);
    }
  }, [applied]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setApplied(q.trim());
        }}
      >
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search HP stock (make, model, chassis, stock id)…"
            className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[var(--brand)] dark:border-zinc-700 dark:bg-zinc-950"
          />
        </div>
        <button
          type="submit"
          className="h-10 rounded-lg bg-[var(--brand)] px-4 text-sm font-bold text-white"
        >
          Search
        </button>
      </form>

      <p className="text-xs text-zinc-500">
        Vehicles with the New Entry HP checkbox selected. Inquire opens
        Negotiations with vehicle details and a link for the SAS3 team.
      </p>

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading stock…
        </p>
      ) : items.length === 0 ? (
        <p className="text-sm text-zinc-500">No HP stock matches.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="relative aspect-[16/10] bg-zinc-100 dark:bg-zinc-800">
                {item.photos[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.photos[0]}
                    alt={item.vehicleTitle}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white">
                    {item.vehicleTitle}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Stock #{item.stockNumber}
                    {item.chassisNumber ? ` · ${item.chassisNumber}` : ""}
                  </p>
                </div>
                <p className="text-sm font-black">
                  {item.salePrice != null
                    ? `¥${Number(item.salePrice).toLocaleString()}`
                    : "Ask for price"}
                </p>
                <button
                  type="button"
                  onClick={() => setInquire(item)}
                  className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-[var(--brand)] px-3 py-2 text-xs font-bold text-white"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Inquire
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <StockInquireModal
        stock={inquire}
        open={Boolean(inquire)}
        onClose={() => setInquire(null)}
      />
    </div>
  );
}

export default PortfolioDashboard;
