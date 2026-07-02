import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative border-b border-zinc-200">
      <div
        className="relative h-[480px] bg-cover bg-center sm:h-[520px]"
        style={{
          backgroundImage:
            "linear-gradient(105deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 50%, rgba(255,255,255,0.15) 100%), url('https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=2000&q=80')",
        }}
      >
        <div className="mx-auto flex h-full max-w-[1400px] flex-col justify-center px-6">
          <div className="max-w-3xl rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-md sm:p-8">
            <h1 className="text-4xl font-bold leading-[1.1] text-white md:text-6xl">
              Quality Japanese
              <br />
              Vehicles. Trusted Worldwide.
            </h1>
            <p className="mt-4 max-w-md text-base text-zinc-200">
              Your reliable partner in premium Japanese vehicles. Delivering value, worldwide.
            </p>
            <button
              type="button"
              className="mt-6 inline-flex w-fit items-center gap-3 rounded-lg border border-white/20 bg-brand-red px-7 py-4 text-sm font-semibold tracking-wide text-white shadow-md transition hover:bg-brand-redDark"
            >
              BROWSE INVENTORY <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto max-w-[1400px] px-6 py-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-red/20 bg-brand-red/10 text-brand-red">
                <Search size={16} />
              </span>
              <h3 className="font-bold tracking-wide text-zinc-900">FIND YOUR PERFECT CAR</h3>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-zinc-600 backdrop-blur-sm transition hover:border-zinc-300 hover:text-zinc-900"
            >
              Advanced Search <SlidersHorizontal size={14} />
            </button>
          </div>

          <div className="grid grid-cols-12 gap-3 rounded-xl border border-zinc-200 bg-white/50 p-4 shadow-sm backdrop-blur-md">
            <Field label="Make" className="col-span-12 md:col-span-2">
              <select className="glass-input">
                <option>All Makes</option>
              </select>
            </Field>
            <Field label="Model" className="col-span-12 md:col-span-2">
              <select className="glass-input">
                <option>All Models</option>
              </select>
            </Field>
            <Field label="Year From" className="col-span-6 md:col-span-1">
              <select className="glass-input">
                <option>Any</option>
              </select>
            </Field>
            <Field label="Year To" className="col-span-6 md:col-span-1">
              <select className="glass-input">
                <option>Any</option>
              </select>
            </Field>
            <Field label="Stock ID or Keywords" className="col-span-12 md:col-span-4">
              <input className="glass-input" placeholder="e.g. Stock ID, Model, etc." />
            </Field>
            <div className="col-span-12 flex items-end md:col-span-2">
              <button
                type="button"
                className="w-full rounded-lg border border-brand-red bg-brand-red py-3 font-bold tracking-wider text-white shadow-sm transition hover:bg-brand-redDark"
              >
                SEARCH
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
      <label className="mb-2 block text-xs font-semibold text-zinc-600">{label}</label>
      {children}
    </div>
  );
}
