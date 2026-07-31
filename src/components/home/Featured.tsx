"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, Flame, Loader2 } from "lucide-react";
import CifCalculatorModal from "@/components/customer/CifCalculatorModal";
import { type AuctionLot, searchLots } from "@/lib/auction-api";
import { formatAuctionPrice } from "@/features/auction/auction-utils";

type FeaturedProps = {
  onOpenChatModal?: () => void;
};

function lotTitle(lot: AuctionLot): string {
  return (
    [lot.modelYearEn, lot.company, lot.modelNameEn]
      .filter(Boolean)
      .join(" ")
      .trim() || `Lot ${lot.bid}`
  );
}

export default function Featured(_props: FeaturedProps) {
  const [lots, setLots] = useState<AuctionLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cifLot, setCifLot] = useState<AuctionLot | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await searchLots({
          result: ["available"],
          sort: "lot_date",
          seq: "DESC",
          page: 0,
          per_page: 8,
        });
        if (!cancelled) setLots(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load live auction lots",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="live-auctions"
      className="relative border-t border-zinc-200/80 bg-zinc-50/50 py-16 text-zinc-900"
    >
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-red-600">
              <Flame size={15} className="animate-soft-pulse text-red-600" />{" "}
              LIVE JAPAN AUCTION LOTS
            </div>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
              ALEADO VEHICLE AUCTIONS
            </h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-500">
              Real lots synced from Aleado — browse filters, grades, and sheets
              after signing in.
            </p>
          </div>

          <Link
            href="/vehicles/auction"
            className="red-gradient-btn inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-extrabold tracking-wider"
          >
            BROWSE ALL AUCTIONS
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-white py-16 text-sm font-semibold text-zinc-500">
            <Loader2 className="h-5 w-5 animate-spin text-red-600" />
            Loading live auction lots…
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
            <p className="text-sm font-semibold text-red-700">{error}</p>
            <Link
              href="/vehicles/auction"
              className="mt-4 inline-flex text-xs font-bold uppercase tracking-wider text-red-600 hover:underline"
            >
              Open auction search
            </Link>
          </div>
        )}

        {!loading && !error && lots.length === 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-12 text-center text-sm text-zinc-500">
            No available lots right now.{" "}
            <Link
              href="/vehicles/auction"
              className="font-bold text-red-600 hover:underline"
            >
              Open full search
            </Link>
          </div>
        )}

        {!loading && !error && lots.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {lots.map((lot) => {
              const img = lot.imageUrls[0];
              const title = lotTitle(lot);
              return (
                <article
                  key={lot.lotId}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-semibold text-zinc-400">
                        No photo
                      </div>
                    )}

                    <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                      <span className="h-1.5 w-1.5 animate-ping rounded-full bg-red-500" />
                      <span>
                        {lot.auctionName || "Auction"} • Lot #{lot.bid || "—"}
                      </span>
                    </div>

                    {lot.scoresEn && (
                      <div className="absolute right-3 top-3 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-black text-red-700 backdrop-blur-md">
                        GRADE {lot.scoresEn}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-2 line-clamp-1 text-sm font-extrabold tracking-wide text-zinc-900 transition group-hover:text-red-600">
                      {title}
                    </h3>

                    <div className="mb-4 flex flex-wrap gap-1.5 text-[11px] font-medium text-zinc-600">
                      {lot.modelYearEn && (
                        <span className="rounded-lg bg-zinc-100 px-2.5 py-1">
                          {lot.modelYearEn}
                        </span>
                      )}
                      {lot.mileage && (
                        <span className="rounded-lg bg-zinc-100 px-2.5 py-1">
                          {Number(lot.mileage).toLocaleString()} km
                        </span>
                      )}
                      {lot.transmissionEn && (
                        <span className="rounded-lg bg-zinc-100 px-2.5 py-1">
                          {lot.transmissionEn}
                        </span>
                      )}
                    </div>

                    <div className="mb-4 mt-auto space-y-1 rounded-xl border border-zinc-100 bg-zinc-50 p-3">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-medium text-zinc-500">
                          START PRICE
                        </span>
                        <span className="font-semibold capitalize text-zinc-600">
                          {lot.resultEn || "available"}
                        </span>
                      </div>
                      <div className="font-mono text-xl font-black text-zinc-900">
                        {formatAuctionPrice(lot.startPrice, { allowZero: true })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link
                        href={`/vehicles/auction/${encodeURIComponent(lot.lotId)}`}
                        className="red-gradient-btn flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold"
                      >
                        VIEW LOT DETAILS
                      </Link>

                      <button
                        type="button"
                        onClick={() => setCifLot(lot)}
                        className="flex w-full items-center justify-center gap-1 rounded-xl border border-red-200 bg-red-50 py-2 text-[11px] font-bold text-red-700 transition hover:bg-red-100"
                      >
                        <Calculator size={13} /> CIF Rates
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <CifCalculatorModal
        isOpen={Boolean(cifLot)}
        onClose={() => setCifLot(null)}
        initialFob={Number(cifLot?.startPrice) || 30000}
        carName={cifLot ? lotTitle(cifLot) : "Selected Car"}
      />
    </section>
  );
}
