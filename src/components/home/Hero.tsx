"use client";

import { ArrowRight, Search, Flame, Award, Zap, Globe } from "lucide-react";
import { useState } from "react";

type HeroProps = {
  onSearchSubmit?: (query: string) => void;
};

export default function Hero({ onSearchSubmit }: HeroProps) {
  const [activeTab, setActiveTab] = useState<"live" | "stock" | "sourcing">("live");

  return (
    <section className="relative border-b border-zinc-200/80 bg-gradient-to-b from-red-50/40 via-white to-zinc-50/80 overflow-hidden py-12 sm:py-16">
      {/* Subtle Red Ambient Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-red-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-red-600/5 blur-[120px]" />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading & Messaging */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 shadow-sm">
              <Flame size={14} className="text-red-600 animate-soft-pulse" />
              <span className="text-xs font-bold tracking-wider text-red-700 uppercase">
                Direct USS & JAA Japan Bidding Portal
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl leading-[1.1]">
              BID DIRECTLY ON <br />
              <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                JAPANESE VEHICLES
              </span>
            </h1>

            <p className="max-w-xl text-base text-zinc-600 leading-relaxed sm:text-lg">
              Access 150,000+ weekly auction listings across USS, JAA, ARAI, and TAA halls. Includes bilingual inspection translations, chassis reports, & worldwide CIF shipping.
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
              <a
                href="/vehicles/auction"
                className="red-gradient-btn group flex items-center gap-3 rounded-xl px-7 py-4 text-sm font-extrabold tracking-wider"
              >
                <span>EXPLORE LIVE AUCTIONS</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>

              <div className="flex items-center gap-6 border-l border-zinc-200 pl-6 text-xs text-zinc-600">
                <div>
                  <div className="font-mono text-xl font-extrabold text-zinc-900">150,000+</div>
                  <div className="text-zinc-500 font-medium">Weekly Cars</div>
                </div>
                <div>
                  <div className="font-mono text-xl font-extrabold text-red-600">100%</div>
                  <div className="text-zinc-500 font-medium">Inspected</div>
                </div>
                <div>
                  <div className="font-mono text-xl font-extrabold text-zinc-900">120+</div>
                  <div className="text-zinc-500 font-medium">Global Ports</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Spotlight Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-200 shadow-2xl bg-white p-2">
              <img
                src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
                alt="Japanese Supercar Auction Spotlight"
                className="h-full w-full object-cover rounded-2xl transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/40 bg-white/90 p-4 shadow-xl backdrop-blur-md flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">LIVE AUCTION SPOTLIGHT</span>
                  <div className="font-extrabold text-sm text-zinc-900">NISSAN GT-R NISMO EDITION</div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs text-zinc-500">CURRENT BID</div>
                  <div className="text-base font-extrabold text-red-600">US$ 142,000</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Search & Filter Box */}
        <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl sm:p-6">
          {/* Filter Mode Tabs */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("live")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeTab === "live"
                    ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                <Zap size={14} /> LIVE AUCTIONS (14,820)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("stock")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeTab === "stock"
                    ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                <Award size={14} /> FIXED PRICE STOCK (840)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sourcing")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeTab === "sourcing"
                    ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                <Globe size={14} /> CUSTOM SOURCING
              </button>
            </div>

            <span className="hidden text-xs text-zinc-500 font-medium lg:inline">
              Real-Time Feed from USS Tokyo, Yokohama, & HAA Kobe
            </span>
          </div>

          {/* Search Inputs Grid */}
          <div className="grid grid-cols-12 gap-3.5">
            <Field label="Make" className="col-span-6 md:col-span-2">
              <select className="glass-input">
                <option value="">All Makes (Toyota, Nissan...)</option>
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
              <select className="glass-input">
                <option value="">All Models</option>
                <option value="Land Cruiser">Land Cruiser ZX</option>
                <option value="LS 500">LS 500 F-Sport</option>
                <option value="GT-R">GT-R Nismo</option>
                <option value="Vellfire">Vellfire / Alphard</option>
                <option value="Supra">GR Supra</option>
              </select>
            </Field>

            <Field label="Auction Grade" className="col-span-6 md:col-span-2">
              <select className="glass-input">
                <option value="">Any Grade (4.0+, 4.5+, 5.0)</option>
                <option value="5.0">Grade 5.0 / S (Like New)</option>
                <option value="4.5">Grade 4.5 (Excellent)</option>
                <option value="4.0">Grade 4.0 (Good)</option>
              </select>
            </Field>

            <Field label="Year Range" className="col-span-6 md:col-span-2">
              <select className="glass-input">
                <option value="">2018 - 2024</option>
                <option value="2022+">2022 - 2024</option>
                <option value="2018-2021">2018 - 2021</option>
                <option value="2015-2017">2015 - 2017</option>
              </select>
            </Field>

            <Field label="Stock ID / Lot #" className="col-span-12 md:col-span-2">
              <input className="glass-input" placeholder="e.g. Lot #8821, GT-R" />
            </Field>

            <div className="col-span-12 flex items-end md:col-span-2">
              <button
                type="button"
                onClick={() => onSearchSubmit && onSearchSubmit("all")}
                className="red-gradient-btn flex w-full items-center justify-center gap-2 rounded-xl py-3 font-extrabold tracking-wider text-white"
              >
                <Search size={16} /> SEARCH LOTS
              </button>
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
      <label className="mb-1.5 block text-[11px] font-extrabold tracking-wider text-zinc-600 uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}
