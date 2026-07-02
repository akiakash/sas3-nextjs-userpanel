import { ArrowRight } from "lucide-react";

const brands = [
  "TOYOTA",
  "NISSAN",
  "MAZDA",
  "SUZUKI",
  "MITSUBISHI",
  "HONDA",
  "LEXUS",
  "BMW",
  "MERCEDES-BENZ",
  "VOLKSWAGEN",
];

export default function Brands() {
  return (
    <section className="border-b border-zinc-200 py-12">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-5 items-center gap-4 md:grid-cols-10 md:gap-6">
          {brands.map((b) => (
            <div
              key={b}
              className="flex flex-col items-center gap-3 rounded-xl border border-zinc-200 bg-white/60 p-3 shadow-sm backdrop-blur-md transition hover:border-zinc-300 hover:bg-white/80"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-[10px] font-bold text-zinc-600">
                {b.split("-")[0].slice(0, 3)}
              </div>
              <span className="text-center text-[10px] font-semibold tracking-wide text-zinc-800">
                {b}
              </span>
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
