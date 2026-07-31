"use client";

import { UserCheck, Search, Gavel, Ship, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "REGISTER & DEPOSIT",
    desc: "Create your free SAS3 account and place a 100% refundable security deposit to activate live bidding access across all Japanese auction houses.",
    icon: UserCheck,
  },
  {
    step: "02",
    title: "SELECT & TRANSLATE",
    desc: "Browse 150,000+ weekly vehicles. Our bilingual team translates official Japanese inspection sheets (USS/JAA) and provides chassis health reports.",
    icon: Search,
  },
  {
    step: "03",
    title: "LIVE BIDDING",
    desc: "Place direct live bids or set automatic proxy max bids. Our live auction desk executes your bids in real-time on the auction floor in Japan.",
    icon: Gavel,
  },
  {
    step: "04",
    title: "EXPORT & SHIPPING",
    desc: "Once won, we handle customs export de-registration, pre-shipment inspections (JAA/QISJ), marine insurance, and fast RoRo/Container shipping.",
    icon: Ship,
  },
];

export default function AuctionProcess() {
  return (
    <section id="process" className="relative border-b border-zinc-200/80 bg-white py-20 text-zinc-900 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-bold text-red-700">
            <ShieldCheck size={14} /> LICENSED JAPAN EXPORT SYSTEM
          </div>
          <h2 className="mt-3 text-3xl font-extrabold text-zinc-900 tracking-tight sm:text-5xl">
            HOW TO IMPORT VEHICLES FROM JAPAN
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-sm text-zinc-600">
            Simple, transparent 4-step process designed for individual buyers, car dealers, and global importers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative flex flex-col rounded-2xl border border-zinc-200 bg-zinc-50/60 p-6 shadow-sm transition hover:border-red-500/40 hover:bg-white hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100 font-bold">
                    <Icon size={24} />
                  </span>
                  <span className="font-mono text-3xl font-black text-zinc-300">{s.step}</span>
                </div>

                <h3 className="mb-2 text-base font-extrabold tracking-wider text-zinc-900">{s.title}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
