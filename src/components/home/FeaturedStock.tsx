"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, MessageSquare, Star } from "lucide-react";
import StockInquireModal from "@/components/customer/StockInquireModal";
import PhotoSlideshow from "@/components/home/PhotoSlideshow";
import { ApiError } from "@/lib/api-client";
import { listPortalStock, type PortalStock } from "@/lib/portal-api";

function formatYen(val: number | null | undefined) {
  if (val == null || !Number.isFinite(val) || val <= 0) return "Ask for price";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(val);
}

function photoUrls(photos: string[] | undefined): string[] {
  if (!Array.isArray(photos)) return [];
  return photos
    .map((photo) => (typeof photo === "string" ? photo.trim() : ""))
    .filter((url) => url.length > 0);
}

export default function FeaturedStock() {
  const [items, setItems] = useState<PortalStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inquire, setInquire] = useState<PortalStock | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    void listPortalStock()
      .then((res) => {
        if (!cancelled) {
          const withPhotos = res.data.filter(
            (item) => photoUrls(item.photos).length > 0,
          );
          setItems(withPhotos.slice(0, 12));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : "Could not load HP stock",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="featured"
      className="relative scroll-mt-12 border-t border-zinc-200/80 bg-white py-16 text-zinc-900"
    >
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-red-600">
              <Star size={15} /> Featured inventory
            </div>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
              HP stock from New Entry
            </h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-500">
              Vehicles marked HP on the New Entry sheet. Inquire opens a
              negotiation with vehicle details and a link for the SAS3 team.
            </p>
          </div>
          <Link
            href="/dashboard/portfolio"
            className="red-gradient-btn inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-extrabold tracking-wider"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <p className="flex items-center gap-2 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading HP stock…
          </p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-zinc-500">No HP stock matches.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
              >
                <Link
                  href={`/vehicles/stock/${encodeURIComponent(item.id)}`}
                  className="block shrink-0 overflow-hidden"
                >
                  <PhotoSlideshow
                    urls={photoUrls(item.photos)}
                    alt={item.vehicleTitle}
                    aspectClassName="aspect-[16/10]"
                  />
                </Link>
                <div className="flex flex-1 flex-col space-y-3 p-4">
                  <div className="min-h-[3.25rem]">
                    <h3 className="line-clamp-2 font-bold text-zinc-900">
                      <Link
                        href={`/vehicles/stock/${encodeURIComponent(item.id)}`}
                        className="hover:text-red-600"
                      >
                        {item.vehicleTitle}
                      </Link>
                    </h3>
                    <p className="mt-1 truncate text-xs text-zinc-500">
                      Stock #{item.stockNumber}
                      {item.chassisNumber ? ` · ${item.chassisNumber}` : ""}
                    </p>
                  </div>
                  <p className="text-sm font-black">{formatYen(item.salePrice)}</p>
                  <button
                    type="button"
                    onClick={() => setInquire(item)}
                    className="mt-auto inline-flex w-full items-center justify-center gap-1 rounded-lg bg-[var(--brand)] px-3 py-2 text-xs font-bold text-white"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Inquire
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <StockInquireModal
        stock={inquire}
        open={Boolean(inquire)}
        onClose={() => setInquire(null)}
      />
    </section>
  );
}
