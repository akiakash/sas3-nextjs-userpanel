"use client";

import React, { useState } from "react";
import { Search, Gavel, Calendar, Building, Landmark, Tag } from "lucide-react";
import { DataTable, Column } from "@/components/ui/data-table";
import { mockBids } from "@/lib/dummy-data";

function BidsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [lotNo, setLotNo] = useState("");
  const [bidStatus, setBidStatus] = useState("All");
  const [auctionHall, setAuctionHall] = useState("All");
  
  // Date states
  const [bidDateFrom, setBidDateFrom] = useState("");
  const [bidDateTo, setBidDateTo] = useState("");
  const [auctionDateFrom, setAuctionDateFrom] = useState("");
  const [auctionDateTo, setAuctionDateTo] = useState("");

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Filter bid records
  const filteredBids = mockBids.filter((bid) => {
    const matchesKeyword =
      bid.makeModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesLot = lotNo === "" || bid.lotNo.includes(lotNo);
    const matchesStatus = bidStatus === "All" || bid.status === bidStatus;
    const matchesHall = auctionHall === "All" || bid.auctionHall === auctionHall;

    // Optional date range checks
    const matchesBidFrom = !bidDateFrom || bid.bidDate >= bidDateFrom;
    const matchesBidTo = !bidDateTo || bid.bidDate <= bidDateTo;
    const matchesAuctionFrom = !auctionDateFrom || bid.auctionDate >= auctionDateFrom;
    const matchesAuctionTo = !auctionDateTo || bid.auctionDate <= auctionDateTo;

    return (
      matchesKeyword &&
      matchesLot &&
      matchesStatus &&
      matchesHall &&
      matchesBidFrom &&
      matchesBidTo &&
      matchesAuctionFrom &&
      matchesAuctionTo
    );
  });

  // Table columns definition
  const columns: Column<typeof mockBids[number]>[] = [
    {
      header: "Reference ID",
      accessorKey: "id",
      cell: (row) => (
        <span className="font-mono font-bold text-[var(--brand)]">{row.id}</span>
      ),
    },
    {
      header: "Lot No",
      accessorKey: "lotNo",
      cell: (row) => <span className="font-mono font-black text-zinc-950 dark:text-white">#{row.lotNo}</span>,
    },
    {
      header: "Make & Model",
      accessorKey: "makeModel",
      cell: (row) => <span className="font-bold text-zinc-900 dark:text-zinc-100">{row.makeModel}</span>,
    },
    {
      header: "My Bid Amount",
      accessorKey: "bidAmount",
      cell: (row) => <span className="font-black">{formatUSD(row.bidAmount)}</span>,
    },
    {
      header: "Maximum Limit",
      accessorKey: "maxBid",
      cell: (row) => <span className="font-semibold text-zinc-400">{formatUSD(row.maxBid)}</span>,
    },
    {
      header: "Bid Date",
      accessorKey: "bidDate",
    },
    {
      header: "Auction Date",
      accessorKey: "auctionDate",
    },
    {
      header: "Auction Hall",
      accessorKey: "auctionHall",
      cell: (row) => (
        <span className="inline-flex items-center gap-1.5 font-semibold text-xs text-zinc-700 dark:text-zinc-300">
          <Landmark className="h-3.5 w-3.5 text-zinc-400" />
          {row.auctionHall}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => {
        const colors = {
          Won: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25",
          Outbid: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25",
          Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25",
          Cancelled: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
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
      {/* Advanced Filter panel */}
      <div className="rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 p-6 backdrop-blur-xl space-y-5">
        <div className="flex items-center gap-2 border-b border-white/25 pb-3">
          <Gavel className="h-5 w-5 text-[var(--brand)]" />
          <h3 className="text-sm font-black uppercase tracking-wider text-[var(--ink)] dark:text-white">
            Filter Live Auctions & Stakes
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Keyword Search */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--ink)]/55 dark:text-zinc-400">
              Keyword Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Toyota, Supra, Nissan..."
                className="h-10 w-full rounded-xl border border-white/20 dark:border-white/10 bg-white dark:bg-zinc-900/60 pl-9.5 pr-4 text-xs font-semibold"
              />
            </div>
          </div>

          {/* Lot No */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--ink)]/55 dark:text-zinc-400">
              Lot Number
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={lotNo}
                onChange={(e) => setLotNo(e.target.value)}
                placeholder="e.g. 1192"
                className="h-10 w-full rounded-xl border border-white/20 dark:border-white/10 bg-white dark:bg-zinc-900/60 pl-9.5 pr-4 text-xs font-semibold"
              />
            </div>
          </div>

          {/* Auction Hall */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--ink)]/55 dark:text-zinc-400">
              Auction Hall
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <select
                value={auctionHall}
                onChange={(e) => setAuctionHall(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-white/20 dark:border-white/10 bg-white dark:bg-zinc-900/60 pl-9.5 pr-8 text-xs font-semibold"
              >
                <option value="All">All Halls</option>
                <option value="USS Tokyo">USS Tokyo</option>
                <option value="USS Yokohama">USS Yokohama</option>
                <option value="USS Nagoya">USS Nagoya</option>
                <option value="JU Gifu">JU Gifu</option>
                <option value="CAA Chubu">CAA Chubu</option>
              </select>
            </div>
          </div>

          {/* Bid Status */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--ink)]/55 dark:text-zinc-400">
              Bid Status
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <select
                value={bidStatus}
                onChange={(e) => setBidStatus(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-white/20 dark:border-white/10 bg-white dark:bg-zinc-900/60 pl-9.5 pr-8 text-xs font-semibold"
              >
                <option value="All">All Statuses</option>
                <option value="Won">Won</option>
                <option value="Outbid">Outbid</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Bid Order Dates */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--ink)]/55 dark:text-zinc-400">
              Bid Date (From / To)
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={bidDateFrom}
                onChange={(e) => setBidDateFrom(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/20 dark:border-white/10 bg-white dark:bg-zinc-900/60 px-3 text-xs font-semibold"
              />
              <input
                type="date"
                value={bidDateTo}
                onChange={(e) => setBidDateTo(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/20 dark:border-white/10 bg-white dark:bg-zinc-900/60 px-3 text-xs font-semibold"
              />
            </div>
          </div>

          {/* Auction Dates */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--ink)]/55 dark:text-zinc-400">
              Auction Date (From / To)
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={auctionDateFrom}
                onChange={(e) => setAuctionDateFrom(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/20 dark:border-white/10 bg-white dark:bg-zinc-900/60 px-3 text-xs font-semibold"
              />
              <input
                type="date"
                value={auctionDateTo}
                onChange={(e) => setAuctionDateTo(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/20 dark:border-white/10 bg-white dark:bg-zinc-900/60 px-3 text-xs font-semibold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bid History Table */}
      <div className="space-y-4">
        <h3 className="text-base font-black tracking-tight text-[var(--ink)] dark:text-white uppercase">
          My Bid History & Stakes
        </h3>
        <DataTable
          columns={columns}
          data={filteredBids}
          emptyState={{
            title: "No bid history records matching filters",
            description: "Try adjusting your lot numbers or bid dates.",
          }}
        />
      </div>
    </div>
  );
}

export default BidsDashboard;
