"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquare, X } from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";
import { createNegotiation } from "@/lib/negotiations-api";
import type { PortalStock } from "@/lib/portal-api";
import { useAuth } from "@/contexts/auth-context";

type StockInquireModalProps = {
  stock: PortalStock | null;
  open: boolean;
  onClose: () => void;
};

export default function StockInquireModal({
  stock,
  open,
  onClose,
}: StockInquireModalProps) {
  const router = useRouter();
  const { user, token } = useAuth();
  const [offer, setOffer] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !stock) return;
    if (stock.salePrice != null && Number(stock.salePrice) > 0) {
      setOffer(String(Math.round(Number(stock.salePrice))));
    } else {
      setOffer("");
    }
    setNote("");
  }, [open, stock]);

  if (!open || !stock) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) {
      onClose();
      router.push(
        `/login?from=${encodeURIComponent(`/dashboard/portfolio`)}`,
      );
      return;
    }
    const amount = Number(String(offer).replace(/,/g, ""));
    if (!Number.isFinite(amount) || amount < 1 || !Number.isInteger(amount)) {
      toast.error("Enter a whole-yen offer amount (¥).");
      return;
    }

    setSubmitting(true);
    try {
      const thread = await createNegotiation({
        orderEntryId: stock.id,
        offerAmount: amount,
        note: note.trim() || undefined,
      });
      toast.success(
        thread.reused
          ? "Opened your existing negotiation for this vehicle"
          : "Inquiry sent — opening chat with SAS3",
      );
      onClose();
      router.push(`/dashboard/negotiations?thread=${thread.id}`);
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Could not send inquiry. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
            <MessageSquare className="h-4 w-4 text-[var(--brand)]" />
            Inquire / Negotiate
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              {stock.vehicleTitle}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Stock #{stock.stockNumber}
              {stock.chassisNumber ? ` · ${stock.chassisNumber}` : ""}
            </p>
          </div>
          <label className="block space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Your offer (¥)
            </span>
            <input
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              inputMode="numeric"
              className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-[var(--brand)] dark:border-zinc-700 dark:bg-zinc-950"
              required
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-zinc-500">
              Note (optional)
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--brand)] dark:border-zinc-700 dark:bg-zinc-950"
              placeholder="Tell the team what you need…"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand)] text-sm font-bold text-white disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MessageSquare className="h-4 w-4" />
            )}
            {submitting ? "Sending…" : "Send & open Negotiations"}
          </button>
        </form>
      </div>
    </div>
  );
}
