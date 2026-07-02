"use client";

import React, { useState } from "react";
import { Search, Heart, Trash2, Calendar, Gavel, Sparkles } from "lucide-react";
import { mockWishlist, Vehicle } from "@/lib/dummy-data";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function WishlistDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockWishlist);

  // Filters State
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [keyword, setKeyword] = useState("");

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Filter logic
  const filteredVehicles = vehicles.filter((car) => {
    const matchesMake = make === "" || car.make.toLowerCase().includes(make.toLowerCase());
    const matchesModel = model === "" || car.model.toLowerCase().includes(model.toLowerCase());

    const matchesMinYear = minYear === "" || car.year >= parseInt(minYear);
    const matchesMaxYear = maxYear === "" || car.year <= parseInt(maxYear);

    const matchesKeyword =
      keyword === "" ||
      car.make.toLowerCase().includes(keyword.toLowerCase()) ||
      car.model.toLowerCase().includes(keyword.toLowerCase()) ||
      car.modelCode.toLowerCase().includes(keyword.toLowerCase());

    // Mock date checks (using production date limits or added dates)
    const carProdDate = `${car.year}-${car.month.toString().padStart(2, "0")}-01`;
    const matchesFromDate = !fromDate || carProdDate >= fromDate;
    const matchesToDate = !toDate || carProdDate <= toDate;

    return matchesMake && matchesModel && matchesMinYear && matchesMaxYear && matchesKeyword && matchesFromDate && matchesToDate;
  });

  const handleRemove = (id: string, name: string) => {
    setVehicles((prev) => prev.filter((car) => car.id !== id));
    toast.success(`${name} removed from your Wishlist.`);
  };

  const handlePlaceBidRequest = (name: string) => {
    toast.success(`Bid request initiated for ${name}!`, {
      description: "Our USS auction desk will register your request.",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Search and Filters panel */}
      <div className="rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 p-5.5 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-white/25 pb-3">
          <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
          <h3 className="text-sm font-black uppercase tracking-wider text-[var(--ink)] dark:text-white">
            Search Wishlist Stock
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Keyword Search */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Search Keywords</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="R34, V-Spec, Spirit R..."
                className="h-9.5 w-full rounded-lg border border-white/25 bg-white px-3 pl-9 text-xs"
              />
            </div>
          </div>

          {/* Make */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Make</label>
            <input
              type="text"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="Nissan, Toyota"
              className="h-9.5 w-full rounded-lg border border-white/25 bg-white px-3 text-xs"
            />
          </div>

          {/* Model */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Skyline, Supra"
              className="h-9.5 w-full rounded-lg border border-white/25 bg-white px-3 text-xs"
            />
          </div>

          {/* Year limits */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Year (Min / Max)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
                placeholder="1990"
                className="h-9.5 w-full rounded-lg border border-white/25 bg-white px-2.5 text-xs"
              />
              <input
                type="number"
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
                placeholder="2005"
                className="h-9.5 w-full rounded-lg border border-white/25 bg-white px-2.5 text-xs"
              />
            </div>
          </div>

          {/* From / To Date */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Added Date range</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-9.5 w-full rounded-lg border border-white/25 bg-white px-2.5 text-xs"
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-9.5 w-full rounded-lg border border-white/25 bg-white px-2.5 text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 p-16 text-center">
          <Heart className="mx-auto h-12 w-12 text-zinc-300" />
          <h3 className="mt-4 text-base font-black text-[var(--ink)] dark:text-white">Your wishlist is empty</h3>
          <p className="mt-1 text-xs text-zinc-400">Search Japanese auctions to add import wishlists.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVehicles.map((car) => (
            <div
              key={car.id}
              className="relative overflow-hidden rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl shadow-sm hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 group"
            >
              {/* Image box */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={car.image}
                  alt={car.model}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {car.lotNo && (
                  <span className="absolute left-3 top-3 inline-flex rounded-lg bg-zinc-900/80 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur">
                    Lot #{car.lotNo}
                  </span>
                )}
                {car.grade && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg bg-[var(--brand)] px-2.5 py-1 text-[9px] font-black text-white shadow-sm">
                    <Sparkles className="h-3 w-3" /> Grade {car.grade}
                  </span>
                )}
              </div>

              {/* Spec Details */}
              <div className="p-5 space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 font-mono">
                    {car.year}/{car.month.toString().padStart(2, "0")} · {car.modelCode}
                  </span>
                  <h4 className="mt-1 text-base font-black tracking-tight text-[var(--ink)] dark:text-white leading-tight">
                    {car.make} {car.model}
                  </h4>
                </div>

                {/* Specs Pill Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex rounded-lg bg-zinc-100 dark:bg-zinc-800/60 px-2 py-0.5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                    {car.mileage.toLocaleString()} km
                  </span>
                  <span className="inline-flex rounded-lg bg-zinc-100 dark:bg-zinc-800/60 px-2 py-0.5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                    {car.engineCC} CC
                  </span>
                  <span className="inline-flex rounded-lg bg-zinc-100 dark:bg-zinc-800/60 px-2 py-0.5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                    {car.transmission}
                  </span>
                  <span className="inline-flex rounded-lg bg-zinc-100 dark:bg-zinc-800/60 px-2 py-0.5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                    {car.drivetrain}
                  </span>
                </div>

                {/* Pricing & Actions */}
                <div className="flex items-center justify-between border-t border-white/20 dark:border-white/10 pt-4.5">
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-zinc-400">Estimate Price</span>
                    <span className="text-lg font-black text-[var(--brand)]">{formatUSD(car.price)}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleRemove(car.id, `${car.make} ${car.model}`)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/10 text-rose-500 bg-rose-500/5 hover:bg-rose-500 hover:text-white transition"
                      title="Remove wishlist"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                    <Button
                      onClick={() => handlePlaceBidRequest(`${car.make} ${car.model}`)}
                      className="rounded-xl bg-gradient-to-b from-[var(--brand)] to-[var(--brand-dark)] text-white text-[10px] font-black uppercase tracking-wider h-9 px-3 cursor-pointer"
                    >
                      <Gavel className="mr-1.5 h-3.5 w-3.5" />
                      Place Bid
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default WishlistDashboard;
