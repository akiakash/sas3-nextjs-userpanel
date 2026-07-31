"use client";

import { ArrowRight } from "lucide-react";

const BRANDS = [
  { name: "TOYOTA", lots: "4,820 Lots", logo: "TOY" },
  { name: "LEXUS", lots: "1,240 Lots", logo: "LEX" },
  { name: "NISSAN", lots: "3,150 Lots", logo: "NIS" },
  { name: "HONDA", lots: "2,400 Lots", logo: "HON" },
  { name: "MAZDA", lots: "1,650 Lots", logo: "MAZ" },
  { name: "BMW", lots: "890 Lots", logo: "BMW" },
  { name: "MERCEDES", lots: "1,120 Lots", logo: "BENZ" },
  { name: "SUBARU", lots: "940 Lots", logo: "SUB" },
  { name: "PORSCHE", lots: "310 Lots", logo: "POR" },
  { name: "LAND ROVER", lots: "430 Lots", logo: "ROV" },
];

export default function Brands() {
  return (
    <section className="border-b border-zinc-200/80 bg-white py-12 text-zinc-900">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-6 text-center">
          <span className="text-xs font-extrabold text-red-600 uppercase tracking-widest">GLOBAL MANUFACTURERS</span>
          <h3 className="text-xl font-extrabold text-zinc-900 sm:text-2xl mt-0.5">BROWSE BY JAPANESE & EUROPEAN MAKES</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 md:grid-cols-10 sm:gap-4">
          {BRANDS.map((b) => (
            <div
              key={b.name}
              className="group flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 text-center transition hover:border-red-500/40 hover:bg-white hover:shadow-md hover:-translate-y-1 cursor-pointer"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-red-100 bg-red-50 font-mono text-xs font-black text-red-600 group-hover:bg-red-600 group-hover:text-white transition">
                {b.logo}
              </div>
              <span className="text-xs font-extrabold text-zinc-900 tracking-wider">{b.name}</span>
              <span className="mt-1 text-[10px] text-zinc-500 font-medium">{b.lots}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-zinc-900 bg-zinc-900/90 px-6 py-3 text-sm font-semibold text-white shadow-md backdrop-blur-sm transition hover:bg-black"
          >
            VIEW ALL MAKES <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
