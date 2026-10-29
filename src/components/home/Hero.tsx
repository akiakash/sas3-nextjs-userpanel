"use client";

import Link from "next/link";
import { ArrowRight, Flame, MessageSquare } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-110px)] flex-col justify-center overflow-hidden border-b border-zinc-200/80 py-10 text-zinc-900 sm:py-14">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=2000&q=80"
          className="h-full w-full scale-105 object-cover brightness-100 contrast-100"
        >
          <source src="/car.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-black/35" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-white/70 bg-white/45 p-6 shadow-[0_30px_70px_rgba(0,0,0,0.18)] backdrop-blur-3xl ring-1 ring-white/60 sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200/80 bg-white/70 px-3.5 py-1 shadow-sm backdrop-blur-md">
            <Flame size={13} className="animate-pulse text-red-600" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-700">
              SAS3 · Japan auction &amp; export desk
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            Premium Japanese{" "}
            <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent">
              vehicles
            </span>{" "}
            to the world
          </h1>

          <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-zinc-700 sm:text-base">
            Live USS, JAA &amp; ARAI lots, curated HP stock, and bilingual
            support from Tokyo — inspected vehicles with worldwide shipping.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/vehicles/auction"
              className="red-gradient-btn group inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-xs font-extrabold tracking-wider shadow-red-600/40"
            >
              Go to Live Auctions
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/inquiry"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-900/15 bg-white/80 px-5 py-3.5 text-xs font-extrabold tracking-wider text-zinc-900 shadow-sm backdrop-blur-md transition hover:border-red-300 hover:text-red-700"
            >
              <MessageSquare size={15} />
              Send Inquiry
            </Link>
            <a
              href="/#featured"
              className="text-xs font-bold text-zinc-700 underline-offset-4 transition hover:text-red-600 hover:underline"
            >
              Browse HP stock
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 border-t border-zinc-900/10 pt-5 text-xs text-zinc-800 sm:gap-10">
            <div>
              <div className="font-mono text-lg font-extrabold text-zinc-900">
                150,000+
              </div>
              <div className="text-[11px] font-medium text-zinc-600">
                Weekly Cars
              </div>
            </div>
            <div>
              <div className="font-mono text-lg font-extrabold text-red-600">
                100%
              </div>
              <div className="text-[11px] font-medium text-zinc-600">
                Inspected
              </div>
            </div>
            <div>
              <div className="font-mono text-lg font-extrabold text-zinc-900">
                120+
              </div>
              <div className="text-[11px] font-medium text-zinc-600">
                Global Ports
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
