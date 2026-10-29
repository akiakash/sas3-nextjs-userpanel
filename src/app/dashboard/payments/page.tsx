"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CreditCard, Loader2, Search, Wallet } from "lucide-react";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatCard } from "@/components/ui/stat-card";
import { ApiError } from "@/lib/api-client";
import {
  getMyPayments,
  type PortalPaymentRow,
  type PortalPaymentSummary,
} from "@/lib/portal-api";
import { toast } from "sonner";

function formatYen(val: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(val);
}

const EMPTY_SUMMARY: PortalPaymentSummary = {
  ttAvailable: 0,
  lcAvailable: 0,
  spent: 0,
  ttTotal: 0,
  lcTotal: 0,
};

function PaymentsDashboard() {
  const [rows, setRows] = useState<PortalPaymentRow[]>([]);
  const [summary, setSummary] = useState<PortalPaymentSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void getMyPayments()
      .then((res) => {
        if (!cancelled) {
          setRows(res.data);
          setSummary(res.summary ?? EMPTY_SUMMARY);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(
            error instanceof ApiError
              ? error.message
              : "Failed to load payments",
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
    if (!q) return rows;
    return rows.filter(
      (row) =>
        row.refNo.toLowerCase().includes(q) ||
        row.method.toLowerCase().includes(q) ||
        (row.date ?? "").toLowerCase().includes(q),
    );
  }, [rows, searchTerm]);

  const columns: Column<PortalPaymentRow>[] = [
    {
      header: "Method",
      cell: (row) => (
        <span className="inline-flex rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase dark:bg-zinc-800">
          {row.method}
        </span>
      ),
    },
    {
      header: "Ref",
      cell: (row) => (
        <span className="font-mono font-bold text-[var(--brand)]">
          {row.refNo}
        </span>
      ),
    },
    { header: "Date", cell: (row) => row.date || "—" },
    {
      header: "Amount",
      cell: (row) => formatYen(row.amount),
    },
    {
      header: "Spent",
      cell: (row) => formatYen(row.allocated),
    },
    {
      header: "Available",
      cell: (row) => (
        <span className="font-bold">{formatYen(row.available)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          title="TT Available"
          value={formatYen(summary.ttAvailable)}
          icon={Wallet}
        />
        <StatCard
          title="LC Available"
          value={formatYen(summary.lcAvailable)}
          icon={CreditCard}
        />
        <StatCard
          title="Spent"
          value={formatYen(summary.spent)}
          icon={Wallet}
        />
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search TT / LC payments…"
          className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[var(--brand)] dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading payments…
        </p>
      ) : (
        <DataTable columns={columns} data={filtered} />
      )}
      {!loading && filtered.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No TT or LC deposits linked to your account yet.
        </p>
      ) : null}
    </div>
  );
}

export default PaymentsDashboard;
