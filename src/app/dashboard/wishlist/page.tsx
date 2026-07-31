"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Gavel,
  Heart,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";
import {
  listCustomerWishlist,
  removeWishlistItem,
  type CustomerWishlistItem,
} from "@/lib/customer-wishlist-api";
import SendForBidModal from "@/components/customer/SendForBidModal";
import type { AuctionLot } from "@/lib/auction-api";
import { formatAuctionPrice } from "@/features/auction/auction-utils";

function toAuctionLot(item: CustomerWishlistItem): AuctionLot {
  return {
    lotId: item.lotId,
    bid: item.bid || "",
    auctRef: item.auctRef || "",
    lotDate: item.lotDate || "",
    auctionName: item.auctionName || "",
    company: item.company || "",
    modelNameEn: item.modelNameEn || "",
    modelTypeEn: item.modelTypeEn || "",
    gradeEn: item.gradeEn || "",
    colorEn: item.colorEn || "",
    scoresEn: item.scoresEn || "",
    modelYearEn: item.modelYearEn || "",
    mileage: item.mileage || "",
    displacement: item.displacement || "",
    transmissionEn: item.transmissionEn || "",
    equipmentEn: item.equipmentEn || undefined,
    startPrice: item.startPrice || "",
    endPrice: item.endPrice || "",
    resultEn: item.resultEn || undefined,
    imageUrls: item.imageUrls ?? [],
  };
}

function WishlistDashboard() {
  const [items, setItems] = useState<CustomerWishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [bidItem, setBidItem] = useState<CustomerWishlistItem | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await listCustomerWishlist();
      setItems(data);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to load wishlist",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleRemove = async (item: CustomerWishlistItem) => {
    setRemovingId(item.id);
    try {
      await removeWishlistItem(item.id);
      setItems((prev) => prev.filter((x) => x.id !== item.id));
      toast.success(`${item.vehicleTitle} removed from wishlist`);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to remove item",
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Saved lots
          </p>
          <h2 className="text-lg font-black text-zinc-900">
            Wishlist ({items.length})
          </h2>
        </div>
        <Link
          href="/vehicles/auction"
          className="red-gradient-btn inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold"
        >
          <Gavel size={14} /> Browse live auctions
        </Link>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white py-16 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading wishlist…
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
          <Heart className="mx-auto h-10 w-10 text-zinc-300" />
          <p className="mt-3 text-sm font-semibold text-zinc-700">
            No saved lots yet
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Heart lots on Live Auction to save them here.
          </p>
          <Link
            href="/vehicles/auction"
            className="mt-4 inline-flex text-xs font-bold text-brand-red hover:underline"
          >
            Go to live auctions →
          </Link>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const img = item.imageUrls?.[0];
            return (
              <article
                key={item.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-zinc-100">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img}
                      alt={item.vehicleTitle}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                      No photo
                    </div>
                  )}
                  <div className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-bold text-white">
                    Lot #{item.bid || "—"}
                  </div>
                  {item.scoresEn && (
                    <div className="absolute right-3 top-3 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-black text-red-700">
                      {item.scoresEn}
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-2 text-sm font-extrabold text-zinc-900">
                    {item.vehicleTitle}
                  </h3>
                  <p className="mt-1 text-[11px] font-semibold text-zinc-500">
                    {item.auctionName || "Auction"} · {item.lotDate || "—"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-medium text-zinc-600">
                    {item.modelTypeEn && (
                      <span className="rounded-lg bg-zinc-100 px-2 py-1">
                        {item.modelTypeEn}
                      </span>
                    )}
                    {item.mileage && (
                      <span className="rounded-lg bg-zinc-100 px-2 py-1">
                        {Number(item.mileage).toLocaleString()} km
                      </span>
                    )}
                    {item.transmissionEn && (
                      <span className="rounded-lg bg-zinc-100 px-2 py-1">
                        {item.transmissionEn}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2">
                    <p className="text-[10px] font-bold uppercase text-zinc-500">
                      Start price
                    </p>
                    <p className="font-mono text-base font-black text-zinc-900">
                      {formatAuctionPrice(item.startPrice, { allowZero: true })}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href={`/vehicles/auction/${encodeURIComponent(item.lotId)}`}
                      className="flex items-center justify-center rounded-xl border border-zinc-200 py-2 text-[11px] font-bold text-zinc-700 hover:bg-zinc-50"
                    >
                      View lot
                    </Link>
                    <button
                      type="button"
                      onClick={() => setBidItem(item)}
                      className="red-gradient-btn rounded-xl py-2 text-[11px] font-bold"
                    >
                      Send for Bid
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={removingId === item.id}
                    onClick={() => void handleRemove(item)}
                    className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50 py-2 text-[11px] font-bold text-red-700 hover:bg-red-100 disabled:opacity-60"
                  >
                    {removingId === item.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <SendForBidModal
        lot={bidItem ? toAuctionLot(bidItem) : null}
        open={Boolean(bidItem)}
        onClose={() => setBidItem(null)}
      />
    </div>
  );
}

export default WishlistDashboard;
