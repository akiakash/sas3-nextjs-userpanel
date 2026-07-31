"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Gavel, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import type { AuctionLot } from "@/lib/auction-api";
import { ApiError } from "@/lib/api-client";
import { createNegotiation } from "@/lib/negotiations-api";
import { formatAuctionPrice } from "@/features/auction/auction-utils";

type SendForBidModalProps = {
  lot: AuctionLot | null;
  open: boolean;
  onClose: () => void;
};

function vehicleTitle(lot: AuctionLot): string {
  return (
    [lot.modelYearEn, lot.company, lot.modelNameEn]
      .filter(Boolean)
      .join(" ")
      .trim() || `Lot ${lot.bid}`
  );
}

export default function SendForBidModal({
  lot,
  open,
  onClose,
}: SendForBidModalProps) {
  const router = useRouter();
  const [offer, setOffer] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !lot) return;
    const startYen = Number(String(lot.startPrice || "").replace(/,/g, ""));
    if (Number.isFinite(startYen) && startYen > 0) {
      setOffer(String(Math.round(startYen * 1000)));
    } else {
      setOffer("");
    }
    setNote("");
  }, [open, lot]);

  if (!open || !lot) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(String(offer).replace(/,/g, ""));
    if (!Number.isFinite(amount) || amount < 1 || !Number.isInteger(amount)) {
      toast.error("Enter a whole-yen offer amount (¥).");
      return;
    }

    setSubmitting(true);
    try {
      const thread = await createNegotiation({
        lotId: lot.lotId,
        offerAmount: amount,
        note: note.trim() || undefined,
      });
      toast.success(
        thread.reused
          ? "Opened your existing negotiation for this lot"
          : "Bid sent — starting chat with SAS3",
      );
      onClose();
      router.push(`/dashboard/negotiations?thread=${thread.id}`);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Could not send bid. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="send-for-bid-title"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-zinc-100 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-600">
              Send for Bid
            </p>
            <h2
              id="send-for-bid-title"
              className="mt-1 text-lg font-black tracking-tight text-zinc-900"
            >
              {vehicleTitle(lot)}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-xs text-zinc-600">
            <div>
              <span className="font-semibold text-zinc-500">Lot</span>
              <p className="font-bold text-zinc-900">#{lot.bid || "—"}</p>
            </div>
            <div>
              <span className="font-semibold text-zinc-500">Hall</span>
              <p className="font-bold text-zinc-900">{lot.auctionName || "—"}</p>
            </div>
            <div>
              <span className="font-semibold text-zinc-500">Date</span>
              <p className="font-bold text-zinc-900">{lot.lotDate || "—"}</p>
            </div>
            <div>
              <span className="font-semibold text-zinc-500">Start price</span>
              <p className="font-bold text-zinc-900">
                {formatAuctionPrice(lot.startPrice, { allowZero: true })}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              Your offer (¥ JPY)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={offer}
              onChange={(e) => setOffer(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="1480000"
              className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              required
            />
            <p className="text-[11px] text-zinc-500">
              Enter the full yen amount you want to bid (e.g. 1,480,000).
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="Any instructions for the SAS3 desk…"
              className="w-full resize-none rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="red-gradient-btn flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Gavel size={14} />
              )}
              {submitting ? "Sending…" : "Send & Open Chat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
