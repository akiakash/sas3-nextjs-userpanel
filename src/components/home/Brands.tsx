"use client";

import Link from "next/link";

const BRANDS = [
  { name: "TOYOTA", lots: "4,820 Lots", slug: "toyota", make: "Toyota" },
  { name: "LEXUS", lots: "1,240 Lots", slug: "lexus", make: "Lexus" },
  { name: "NISSAN", lots: "3,150 Lots", slug: "nissan", make: "Nissan" },
  { name: "HONDA", lots: "2,400 Lots", slug: "honda", make: "Honda" },
  { name: "MAZDA", lots: "1,650 Lots", slug: "mazda", make: "Mazda" },
  { name: "BMW", lots: "890 Lots", slug: "bmw", make: "BMW" },
  { name: "MERCEDES", lots: "1,120 Lots", slug: "mercedes", make: "Mercedes-Benz" },
  { name: "SUBARU", lots: "940 Lots", slug: "subaru", make: "Subaru" },
  { name: "PORSCHE", lots: "310 Lots", slug: "porsche", make: "Porsche" },
  { name: "LAND ROVER", lots: "430 Lots", slug: "landrover", make: "Land Rover" },
];

export default function Brands() {
  return (
    <section className="border-y border-red-50 bg-white py-14 text-zinc-900">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-8 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-red-600">
            Global manufacturers
          </span>
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-wide text-zinc-900 sm:text-4xl">
            Browse Japanese &amp; European makes
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4 md:grid-cols-10">
          {BRANDS.map((b) => (
            <Link
              key={b.name}
              href={`/vehicles/auction?make=${encodeURIComponent(b.make)}`}
              className="group flex flex-col items-center justify-center rounded-2xl border border-zinc-100 bg-zinc-50/60 p-4 text-center transition hover:-translate-y-1 hover:border-red-200 hover:bg-white hover:shadow-[0_12px_30px_rgba(220,38,38,0.08)]"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://cdn.simpleicons.org/${b.slug}/dc2626`}
                  alt={`${b.name} logo`}
                  className="h-8 w-auto max-w-[2.5rem] object-contain opacity-90 transition group-hover:opacity-100"
                  loading="lazy"
                />
              </div>
              <span className="text-xs font-bold tracking-wider text-zinc-900">
                {b.name}
              </span>
              <span className="mt-1 text-[10px] font-medium text-zinc-500">
                {b.lots}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
