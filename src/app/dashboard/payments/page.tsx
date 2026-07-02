"use client";

import React, { useState } from "react";
import { CreditCard, DollarSign, Wallet, FileSpreadsheet, PlusCircle, Search } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable, Column } from "@/components/ui/data-table";
import { mockPayments, dashboardStats } from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";

function PaymentsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Filter payment entries
  const filteredPayments = mockPayments.filter((p) => {
    return (
      p.invoiceOrPayment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Columns definition
  const columns: Column<typeof mockPayments[number]>[] = [
    {
      header: "Invoice / Payment Reference",
      accessorKey: "invoiceOrPayment",
      cell: (row) => (
        <span className="font-mono font-bold text-[var(--brand)]">{row.invoiceOrPayment}</span>
      ),
    },
    {
      header: "Date",
      accessorKey: "date",
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (row) => (
        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
          {row.description}
        </span>
      ),
      className: "max-w-xs sm:max-w-md",
    },
    {
      header: "Debit (Charges)",
      accessorKey: "debit",
      cell: (row) =>
        row.debit > 0 ? (
          <span className="font-bold text-rose-600 dark:text-rose-400">
            {formatUSD(row.debit)}
          </span>
        ) : (
          <span className="text-zinc-400 dark:text-zinc-600">—</span>
        ),
    },
    {
      header: "Credit (Deposits)",
      accessorKey: "credit",
      cell: (row) =>
        row.credit > 0 ? (
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {formatUSD(row.credit)}
          </span>
        ) : (
          <span className="text-zinc-400 dark:text-zinc-600">—</span>
        ),
    },
    {
      header: "Running Balance",
      accessorKey: "balance",
      cell: (row) => (
        <span className="font-mono font-black text-zinc-900 dark:text-white">
          {formatUSD(row.balance)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* 3 Summary Cards */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Invoice Amount"
          value={formatUSD(dashboardStats.totalInvoiceAmount)}
          description="Consolidated aggregate purchases"
          icon={DollarSign}
        />
        <StatCard
          title="Total Payment"
          value={formatUSD(dashboardStats.totalPayments)}
          description="Total funds received & cleared"
          icon={CreditCard}
        />
        <StatCard
          title="Total Balance as of Now"
          value={formatUSD(dashboardStats.currentBalance)}
          description="Due outstanding obligations"
          icon={Wallet}
        />
      </section>

      {/* Ledgers Header and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-black tracking-tight text-[var(--ink)] dark:text-white uppercase">
            Ledger & Payment History
          </h3>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transaction..."
                className="h-10 w-52 rounded-xl border border-white/20 dark:border-white/10 bg-white dark:bg-zinc-900/60 pl-9.5 pr-4 text-xs font-semibold placeholder:text-zinc-400 outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[oklch(0.38_0.15_25/0.05)] dark:text-white"
              />
            </div>

            <Button
              className="rounded-xl bg-gradient-to-b from-[var(--brand)] to-[var(--brand-dark)] text-white text-xs font-bold uppercase tracking-wider h-10 px-4 cursor-pointer"
            >
              <PlusCircle className="mr-2 h-4.5 w-4.5" />
              Submit TT Receipt
            </Button>
          </div>
        </div>

        {/* Ledger Table */}
        <DataTable
          columns={columns}
          data={filteredPayments}
          emptyState={{
            title: "No payment receipts found",
            description: "Try clearing search filters.",
          }}
        />
      </div>
    </div>
  );
}

export default PaymentsDashboard;
