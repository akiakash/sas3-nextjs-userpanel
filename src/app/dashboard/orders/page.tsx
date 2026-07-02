"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, ArrowDownToLine } from "lucide-react";
import { DataTable, Column } from "@/components/ui/data-table";
import { mockOrders } from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";

function OrdersLedger() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Filter orders
  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.makeModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.stockId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.chassisNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Table columns definition
  const columns: Column<typeof mockOrders[number]>[] = [
    {
      header: "No",
      cell: (_, idx) => <span className="text-zinc-400 dark:text-zinc-500 font-bold">{idx + 1}</span>,
      className: "w-12",
    },
    {
      header: "Stock ID",
      accessorKey: "stockId",
      cell: (row) => (
        <span className="font-mono font-black text-[var(--brand)]">{row.stockId}</span>
      ),
    },
    {
      header: "Invoice No",
      accessorKey: "invoiceNo",
      cell: (row) => <span className="font-mono font-semibold">{row.invoiceNo}</span>,
    },
    {
      header: "Invoice Date",
      accessorKey: "invoiceDate",
    },
    {
      header: "Make & Model",
      accessorKey: "makeModel",
      cell: (row) => <span className="font-bold text-zinc-900 dark:text-zinc-100">{row.makeModel}</span>,
    },
    {
      header: "Chassis Number",
      accessorKey: "chassisNumber",
      cell: (row) => <span className="font-mono text-xs tracking-wider text-zinc-500">{row.chassisNumber}</span>,
    },
    {
      header: "Term",
      accessorKey: "term",
      cell: (row) => (
        <span className="inline-flex rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
          {row.term}
        </span>
      ),
    },
    {
      header: "Cost",
      accessorKey: "cost",
      cell: (row) => (
        <span className="font-black text-zinc-900 dark:text-zinc-100">
          {formatUSD(row.cost)}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => {
        const colors = {
          "In Transit": "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/25",
          "Customs Cleared": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25",
          "Delivered": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/25",
          "Auction Secured": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25",
        };
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              colors[row.status]
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Search and Filters panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 p-4.5 backdrop-blur-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search make, model, stock ID, invoice..."
            className="h-11 w-full rounded-xl border border-white/20 dark:border-white/10 bg-white dark:bg-zinc-900/60 pl-10.5 pr-4 text-xs font-semibold placeholder:text-zinc-400 outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[oklch(0.38_0.15_25/0.05)] dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["All", "Auction Secured", "In Transit", "Customs Cleared", "Delivered"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`h-9 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                statusFilter === st
                  ? "bg-[var(--brand)] text-white shadow-sm"
                  : "border border-white/20 bg-white/60 dark:border-white/10 dark:bg-zinc-800/60 text-[var(--ink)]/75 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-xl border-white/20 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 transition hover:bg-white"
          title="Export CSV"
        >
          <ArrowDownToLine className="h-4.5 w-4.5" />
        </Button>
      </div>

      {/* Main Ledger Table */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        emptyState={{
          title: "No orders match criteria",
          description: "Try adjusting your filters or lookups.",
        }}
      />
    </div>
  );
}

export default OrdersLedger;
