"use client";

import { ArrowRight, Search, Flame, Award, Zap, Globe } from "lucide-react";
import { useState } from "react";

export type SearchFilters = {
  make: string;
  model: string;
  grade: string;
  year: string;
  stockId: string;
};

type HeroProps = {
  onSearchSubmit?: (filters: SearchFilters) => void;
};

export default function Hero({ onSearchSubmit }: HeroProps) {
  const [activeTab, setActiveTab] = useState<"live" | "stock" | "sourcing">("live");

  // Search filter states
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [grade, setGrade] = useState("");
  const [year, setYear] = useState("");
  const [stockId, setStockId] = useState("");

  const handleSearch = () => {
    const filters: SearchFilters = { make, model, grade, year, stockId };
    if (onSearchSubmit) {
      onSearchSubmit(filters);
    }
    // Smooth scroll to live auctions grid
    const el = document.getElementById("live-auctions");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative border-b border-zinc-200/80 overflow-hidden min-h-[calc(100vh-110px)] flex flex-col justify-center py-8 sm:py-12 text-zinc-900">
      {/* Real Local Bright Background Video Layer (/car.mp4) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=80"
          className="h-full w-full object-cover scale-105 filter brightness-100 contrast-100"
        >
          <source src="/car.mp4" type="video/mp4" />
        </video>

        {/* Soft Edge Vignette Shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/30" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] w-full px-4 sm:px-6 flex flex-col justify-center my-auto">
        {/* Full-Width Liquid Glass Master Card Centered Over Video Watermark */}
        <div className="mx-auto max-w-[1340px] w-full">
          <div className="relative w-full rounded-[32px] border border-white/70 bg-white/40 shadow-[0_30px_70px_rgba(0,0,0,0.18)] backdrop-blur-3xl overflow-hidden text-zinc-900 ring-1 ring-white/60">
            {/* Specular Liquid Sheen Highlight */}
            <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-gradient-to-br from-white/70 via-white/20 to-transparent blur-2xl" />
            <div className="pointer-events-none absolute -right-32 -bottom-32 h-80 w-80 rounded-full bg-gradient-to-tl from-red-500/10 via-white/10 to-transparent blur-2xl" />

            {/* Top Section: Title, Messaging & Stats */}
            <div className="p-5 sm:p-7 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
              {/* Left Content Block */}
              <div className="space-y-2.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-200/80 bg-white/60 px-3.5 py-1 backdrop-blur-md shadow-sm">
                  <Flame size={13} className="text-red-600 animate-pulse" />
                  <span className="text-[11px] font-extrabold tracking-wider text-red-700 uppercase">
                    Direct USS, JAA & ARAI Bidding Portal
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-zinc-900 leading-tight">
                  Direct Vehicle{" "}
                  <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent">
                    Bids
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-zinc-700 font-medium leading-relaxed drop-shadow-sm">
                  150,000+ weekly Japanese auction lots with bilingual inspection & worldwide CIF shipping.
                </p>
              </div>

              {/* Right Action & Stats Block */}
              <div className="flex flex-col items-center md:items-end gap-4 flex-shrink-0">
                <a
                  href="#live-auctions"
                  className="red-gradient-btn group inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-xs font-extrabold tracking-wider shadow-red-600/40 whitespace-nowrap"
                >
                  <span>EXPLORE LIVE AUCTIONS</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </a>

                <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-zinc-900/10 pt-3 md:pt-0 md:pl-6 text-xs text-zinc-800">
                  <div className="text-center md:text-left">
                    <div className="font-mono text-base sm:text-lg font-extrabold text-zinc-900">150,000+</div>
                    <div className="text-zinc-600 font-medium text-[11px]">Weekly Cars</div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="font-mono text-base sm:text-lg font-extrabold text-red-600">100%</div>
                    <div className="text-zinc-600 font-medium text-[11px]">Inspected</div>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="font-mono text-base sm:text-lg font-extrabold text-zinc-900">120+</div>
                    <div className="text-zinc-600 font-medium text-[11px]">Global Ports</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Integrated Liquid Glass Search Section */}
            <div className="border-t border-zinc-900/10 bg-white/35 p-4 sm:p-6 backdrop-blur-2xl">
              {/* Filter Mode Tabs */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-900/10 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("live")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                      activeTab === "live"
                        ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                        : "bg-white/50 text-zinc-800 hover:bg-white/80 border border-white/60 backdrop-blur-md"
                    }`}
                  >
                    <Zap size={13} /> LIVE AUCTIONS (14,820)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("stock")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                      activeTab === "stock"
                        ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                        : "bg-white/50 text-zinc-800 hover:bg-white/80 border border-white/60 backdrop-blur-md"
                    }`}
                  >
                    <Award size={13} /> FIXED PRICE STOCK (840)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("sourcing")}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                      activeTab === "sourcing"
                        ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                        : "bg-white/50 text-zinc-800 hover:bg-white/80 border border-white/60 backdrop-blur-md"
                    }`}
                  >
                    <Globe size={13} /> CUSTOM SOURCING
                  </button>
                </div>

                <span className="hidden text-[11px] text-zinc-600 font-semibold lg:inline">
                  Real-Time Feed from USS Tokyo, Yokohama, & HAA Kobe
                </span>
              </div>

              {/* Search Inputs Grid */}
              <div className="grid grid-cols-12 gap-3.5 items-end">
                <Field label="Make" className="col-span-6 md:col-span-2">
                  <select
                    value={make}
                    onChange={(e) => {
                      setMake(e.target.value);
                      setModel("");
                    }}
                    className="glass-input text-xs font-semibold bg-white/70 border-white/80 focus:bg-white text-zinc-900"
                  >
                    <option value="">All Makes (Toyota...)</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Lexus">Lexus</option>
                    <option value="Nissan">Nissan</option>
                    <option value="Honda">Honda</option>
                    <option value="Mazda">Mazda</option>
                    <option value="BMW">BMW</option>
                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                  </select>
                </Field>

                <Field label="Model" className="col-span-6 md:col-span-2">
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="glass-input text-xs font-semibold bg-white/70 border-white/80 focus:bg-white text-zinc-900"
                  >
                    <option value="">All Models</option>
                    {make === "Toyota" || !make ? (
                      <>
                        <option value="Land Cruiser">Land Cruiser ZX</option>
                        <option value="Vellfire">Vellfire / Alphard</option>
                        <option value="Supra">GR Supra</option>
                      </>
                    ) : null}
                    {make === "Lexus" || !make ? (
                      <option value="LS 500">LS 500 F-Sport</option>
                    ) : null}
                    {make === "Nissan" || !make ? (
                      <option value="GT-R">GT-R Nismo</option>
                    ) : null}
                  </select>
                </Field>

                <Field label="Auction Grade" className="col-span-6 md:col-span-2">
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="glass-input text-xs font-semibold bg-white/70 border-white/80 focus:bg-white text-zinc-900"
                  >
                    <option value="">Any Grade (4.0+, 5.0)</option>
                    <option value="5.0">Grade 5.0 / S (Like New)</option>
                    <option value="4.5">Grade 4.5 (Excellent)</option>
                    <option value="4.0">Grade 4.0 (Good)</option>
                  </select>
                </Field>

                <Field label="Year Range" className="col-span-6 md:col-span-2">
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="glass-input text-xs font-semibold bg-white/70 border-white/80 focus:bg-white text-zinc-900"
                  >
                    <option value="">All Years</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                  </select>
                </Field>

                <Field label="Stock ID / Lot #" className="col-span-12 md:col-span-2">
                  <input
                    type="text"
                    value={stockId}
                    onChange={(e) => setStockId(e.target.value)}
                    className="glass-input text-xs font-semibold bg-white/70 border-white/80 focus:bg-white text-zinc-900 placeholder-zinc-500"
                    placeholder="e.g. Lot #8821, GT-R"
                  />
                </Field>

                <div className="col-span-12 md:col-span-2">
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="red-gradient-btn flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-extrabold tracking-wider"
                  >
                    <Search size={15} /> SEARCH LOTS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-[10px] font-extrabold tracking-wider text-zinc-700 uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}
