"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  CreditCard,
  DollarSign,
  Gavel,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Activity,
  PlusCircle,
  History,
  FileSpreadsheet,
  Settings,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { dashboardStats, mockOrders } from "@/lib/dummy-data";
import { DataTable, Column } from "@/components/ui/data-table";

function DashboardHome() {
  const formatUSD = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Recent orders table columns
  const columns: Column<typeof mockOrders[number]>[] = [
    {
      header: "Stock ID",
      accessorKey: "stockId",
      cell: (row) => (
        <span className="font-mono font-bold text-zinc-900 dark:text-white">{row.stockId}</span>
      ),
    },
    {
      header: "Make & Model",
      accessorKey: "makeModel",
      cell: (row) => <span className="font-semibold text-zinc-800 dark:text-zinc-200">{row.makeModel}</span>,
    },
    {
      header: "Invoice Date",
      accessorKey: "invoiceDate",
    },
    {
      header: "Term",
      accessorKey: "term",
      cell: (row) => (
        <span className="inline-flex rounded bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[9.5px] font-bold text-zinc-600 dark:text-zinc-400">
          {row.term}
        </span>
      ),
    },
    {
      header: "Cost",
      accessorKey: "cost",
      cell: (row) => (
        <span className="font-bold text-zinc-900 dark:text-white">
          {formatUSD(row.cost)}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => {
        const colors = {
          "In Transit": "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
          "Customs Cleared": "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
          "Delivered": "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
          "Auction Secured": "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
        };
        return (
          <span
            className={`inline-flex rounded-md px-2 py-0.5 text-[9.5px] font-bold uppercase ${
              colors[row.status]
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
  ];

  // Quick Action Items
  const quickActions = [
    { label: "Live Bidding Desk", to: "/dashboard/bids", icon: Gavel, desc: "Stake in JDM auctions" },
    { label: "Submit Telegraphic Transfer", to: "/dashboard/payments", icon: CreditCard, desc: "Log wire deposits" },
    { label: "Negotiate Vehicle Price", to: "/dashboard/negotiations", icon: MessageSquare, desc: "Bilateral counters" },
    { label: "Importer Preferences", to: "/dashboard/profile", icon: Settings, desc: "Manage corporate details" },
  ];

  return (
    <div className="space-y-7 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Flat, Typographic Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 pb-5">
        <div>
          <span className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 block">
            Commercial Importer Dashboard
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Operations Center — Dharshini Kumar
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Account Status: <span className="font-bold text-emerald-600">Active (Verified)</span> · Authorized Importer for XorCodes Automotive Ltd.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Link
            href="/dashboard/bids"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 text-xs font-bold uppercase tracking-wider transition hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Place Auction Bid
          </Link>
        </div>
      </div>

      {/* Grid of 6 KPI Stat cards */}
      <section className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Orders"
          value={dashboardStats.totalOrders}
          description="Total commercial import transactions"
          icon={ShoppingBag}
          trend={{ value: "12% MoM", isPositive: true }}
        />
        <StatCard
          title="Total Invoice Amount"
          value={formatUSD(dashboardStats.totalInvoiceAmount)}
          description="Aggregated ledger obligations"
          icon={DollarSign}
          trend={{ value: "8% MoM", isPositive: true }}
        />
        <StatCard
          title="Total Payments"
          value={formatUSD(dashboardStats.totalPayments)}
          description="Disbursed wire transfers settled"
          icon={CreditCard}
          trend={{ value: "Cleared", isPositive: true }}
        />
        <StatCard
          title="Current Balance"
          value={formatUSD(dashboardStats.currentBalance)}
          description="Outstanding import steps due"
          icon={DollarSign}
        />
        <StatCard
          title="Pending Bids"
          value={dashboardStats.pendingBids}
          description="Active JDM auction stakes"
          icon={Gavel}
          trend={{ value: "4 tomorrow", isPositive: true }}
        />
        <StatCard
          title="Active Negotiations"
          value={dashboardStats.activeNegotiations}
          description="Offers under bilateral negotiation"
          icon={MessageSquare}
          trend={{ value: "2 pending", isPositive: true }}
        />
      </section>

      {/* Easy Corporate Access Action Shortcuts Grid */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
          Easy Corporate Access Shortcuts
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((act, idx) => (
            <Link
              key={idx}
              href={act.to}
              className="flex items-start gap-3.5 rounded-xl border border-border bg-card p-4 transition-all duration-150 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-secondary"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-zinc-600 dark:text-zinc-400 border border-border">
                <act.icon className="h-4.5 w-4.5 stroke-[1.8]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-tight">
                  {act.label}
                </h4>
                <p className="mt-1 text-[10px] text-zinc-400 dark:text-zinc-500 leading-snug">
                  {act.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Split panel: Invoices list & Activity log */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Table of active import orders */}
        <section className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              Active Import Shipments
            </h3>
            <Link
              href="/dashboard/orders"
              className="text-[9.5px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:underline inline-flex items-center gap-1"
            >
              Full Ledger <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <DataTable columns={columns} data={mockOrders.slice(0, 3)} />
        </section>

        {/* Activity log */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
            Operations Audit Log
          </h3>
          <div className="rounded-xl border border-border bg-card p-4.5 space-y-3.5">
            <div className="flex gap-3">
              <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded bg-secondary text-zinc-500 dark:text-zinc-400 border border-border">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-none">
                  Payment cleared successfully
                </p>
                <p className="mt-1 text-[10px] text-zinc-400 dark:text-zinc-500 leading-snug">
                  Deposit wire transfer credited for Toyota Supra.
                </p>
                <span className="mt-1 block text-[8.5px] text-zinc-400">
                  Yesterday, 18:40
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded bg-secondary text-zinc-500 dark:text-zinc-400 border border-border">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-none">
                  Negotiation counter received
                </p>
                <p className="mt-1 text-[10px] text-zinc-400 dark:text-zinc-500 leading-snug">
                  Agent responded on Nissan Skyline R32.
                </p>
                <span className="mt-1 block text-[8.5px] text-zinc-400">
                  Yesterday, 11:45
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded bg-secondary text-zinc-500 dark:text-zinc-400 border border-border">
                <Activity className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-none">
                  Customs status updated
                </p>
                <p className="mt-1 text-[10px] text-zinc-400 dark:text-zinc-500 leading-snug">
                  GC8 cleared customs at Osaka Port.
                </p>
                <span className="mt-1 block text-[8.5px] text-zinc-400">
                  May 18, 09:30
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashboardHome;
