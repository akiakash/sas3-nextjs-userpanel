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
    <section className="border-b border-zinc-200/80 bg-white py-12 text-zinc-900">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-6 text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-red-600">
            GLOBAL MANUFACTURERS
          </span>
          <h3 className="mt-0.5 text-xl font-extrabold text-zinc-900 sm:text-2xl">
            BROWSE BY JAPANESE &amp; EUROPEAN MAKES
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4 md:grid-cols-10">
          {BRANDS.map((b) => (
            <Link
              key={b.name}
              href={`/vehicles/auction?make=${encodeURIComponent(b.make)}`}
              className="group flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-4 text-center transition hover:-translate-y-1 hover:border-red-500/40 hover:shadow-md"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://cdn.simpleicons.org/${b.slug}/18181b`}
                  alt={`${b.name} logo`}
                  className="h-8 w-auto max-w-[2.5rem] object-contain opacity-90 transition group-hover:opacity-100"
                  loading="lazy"
                />
              </div>
              <span className="text-xs font-extrabold tracking-wider text-zinc-900">
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
