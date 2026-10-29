"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const HERO_CAR = "/images/hero-land-cruiser-300.jpg";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-7rem)] flex-col justify-end overflow-hidden bg-zinc-900 text-white">
      {/* Full-bleed car background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_CAR}
        alt=""
        aria-hidden
        className="absolute inset-0 z-0 h-full w-full object-cover object-[center_65%] animate-[hero-car-in_1.1s_ease-out]"
        fetchPriority="high"
      />

      {/* Readability overlays — red/white theme wash */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/35 to-black/20" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/55 via-transparent to-black/40" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/2 bg-gradient-to-t from-red-950/40 to-transparent" />

      {/* Soft giant type over the photo */}
      <p
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[14%] z-[2] w-[140%] -translate-x-1/2 select-none text-center font-[family-name:var(--font-display)] text-[clamp(4.5rem,18vw,14rem)] font-bold leading-none tracking-[-0.04em] text-white/[0.12]"
      >
        JAPAN CARS
      </p>

      {/* Content over image */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] gap-8 px-4 pb-12 pt-28 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:pb-16">
        <div className="animate-[hero-fade-up_0.8s_ease-out]">
          <p className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.28em] text-red-400">
            SAS3
          </p>
          <h1 className="mt-2 max-w-xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Drive the legacy
            <br />
            of Japan
          </h1>
        </div>

        <div className="flex flex-col items-start gap-5 animate-[hero-fade-up_0.9s_ease-out] lg:items-end lg:text-right">
          <p className="max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
            Live USS, JAA &amp; ARAI auctions, curated HP stock, and bilingual
            Tokyo support — inspected vehicles shipped worldwide.
          </p>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <Link
              href="/vehicles/auction"
              className="group inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_12px_30px_rgba(220,38,38,0.45)] transition hover:bg-red-500"
            >
              Go to Live Auctions
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <Link
              href="/inquiry"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white bg-white/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition hover:bg-white hover:text-red-600"
            >
              Send Inquiry
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
          <a
            href="/#featured"
            className="text-xs font-semibold text-white/70 underline-offset-4 transition hover:text-white hover:underline"
          >
            Browse HP stock
          </a>
        </div>
      </div>
    </section>
  );
}
