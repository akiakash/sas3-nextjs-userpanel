import { Heart, ArrowRight, ChevronRight } from "lucide-react";

const cars = [
  {
    name: "2021 TOYOTA LAND CRUISER ZX",
    id: "123456",
    price: "57,800",
    img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "2020 LEXUS LS 500 F SPORT",
    id: "654321",
    price: "48,600",
    img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "2019 NISSAN X-TRAIL 20XI",
    id: "112233",
    price: "18,900",
    img: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "2020 HONDA STEP WGN SPADA",
    id: "332211",
    price: "22,400",
    img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Featured() {
  return (
    <section className="relative border-t border-zinc-200 bg-zinc-950 py-12 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]" />

      <div className="relative mx-auto max-w-[1400px] px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
            <h2 className="text-2xl font-bold tracking-wide">FEATURED VEHICLES</h2>
            <div className="mt-2 h-[3px] w-16 rounded-full bg-brand-red" />
          </div>
          <a
            href="#"
            className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md transition hover:border-white/25 hover:bg-white/15"
          >
            VIEW ALL STOCK <ArrowRight size={14} />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {cars.map((c) => (
            <article
              key={c.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/10 shadow-lg backdrop-blur-xl transition hover:border-white/20 hover:bg-white/15"
            >
              <div className="relative aspect-[4/3] bg-black/40">
                <img src={c.img} alt={c.name} className="h-full w-full object-cover" />
                <button
                  type="button"
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/90 text-zinc-700 backdrop-blur-sm transition hover:bg-white"
                >
                  <Heart size={16} />
                </button>
              </div>
              <div className="border-t border-white/10 p-4">
                <h3 className="mb-3 text-sm font-bold tracking-wide">{c.name}</h3>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Stock ID: {c.id}</span>
                  <span className="text-base font-bold text-brand-red">US$ {c.price}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/90 text-zinc-800 shadow-lg backdrop-blur-md lg:flex"
      >
        <ChevronRight size={20} />
      </button>
    </section>
  );
}
