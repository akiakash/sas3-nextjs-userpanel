"use client";

import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  MessageSquare,
  Send,
  Gavel,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";
import {
  getNegotiation,
  listNegotiations,
  sendNegotiationMessage,
  type NegotiationThreadDetail,
  type NegotiationThreadSummary,
} from "@/lib/negotiations-api";

const POLL_MS = 4000;

function formatYen(amount: number | null | undefined): string {
  if (amount == null || !Number.isFinite(amount)) return "—";
  return `¥${amount.toLocaleString("en-US")}`;
}

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function NegotiationsDashboard() {
  const searchParams = useSearchParams();
  const threadParam = searchParams.get("thread");

  const [threads, setThreads] = useState<NegotiationThreadSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(threadParam);
  const [detail, setDetail] = useState<NegotiationThreadDetail | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const refreshList = useCallback(async () => {
    try {
      const list = await listNegotiations();
      setThreads(list);
      return list;
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
      return [] as NegotiationThreadSummary[];
    } finally {
      setLoadingList(false);
    }
  }, []);

  const loadDetail = useCallback(async (id: string, soft = false) => {
    if (!soft) setLoadingDetail(true);
    try {
      const thread = await getNegotiation(id);
      setDetail(thread);
    } catch (error) {
      if (!soft && error instanceof ApiError) {
        toast.error(error.message);
      }
    } finally {
      if (!soft) setLoadingDetail(false);
    }
  }, []);

  useEffect(() => {
    void refreshList().then((list) => {
      if (threadParam) {
        setSelectedId(threadParam);
        return;
      }
      if (!selectedId && list[0]) {
        setSelectedId(list[0].id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshList, threadParam]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    void loadDetail(selectedId);
  }, [selectedId, loadDetail]);

  useEffect(() => {
    if (!selectedId) return;
    const t = window.setInterval(() => {
      void loadDetail(selectedId, true);
      void refreshList();
    }, POLL_MS);
    return () => window.clearInterval(t);
  }, [selectedId, loadDetail, refreshList]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [detail?.messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !draft.trim()) return;
    setSending(true);
    try {
      const updated = await sendNegotiationMessage(selectedId, draft.trim());
      setDetail(updated);
      setDraft("");
      void refreshList();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to send message",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100svh-220px)] min-h-[480px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      {/* Thread list */}
      <aside className="flex w-full max-w-[320px] flex-col border-r border-zinc-200 bg-zinc-50/80">
        <div className="border-b border-zinc-200 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
            Negotiations
          </p>
          <h2 className="text-sm font-black text-zinc-900">Your bid chats</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingList && (
            <div className="flex items-center justify-center gap-2 py-10 text-xs text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          )}
          {!loadingList && threads.length === 0 && (
            <div className="space-y-3 px-4 py-10 text-center text-xs text-zinc-500">
              <MessageSquare className="mx-auto h-8 w-8 text-zinc-300" />
              <p>No negotiations yet.</p>
              <Link
                href="/vehicles/auction"
                className="inline-flex items-center gap-1 font-bold text-brand-red hover:underline"
              >
                <Gavel size={12} /> Browse auctions
              </Link>
            </div>
          )}
          {threads.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedId(t.id)}
              className={cn(
                "w-full border-b border-zinc-100 px-4 py-3 text-left transition hover:bg-white",
                selectedId === t.id && "bg-white ring-inset ring-1 ring-red-100",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="line-clamp-1 text-xs font-bold text-zinc-900">
                  {t.vehicleTitle}
                </p>
                {t.replyNeeded === false && (
                  <span className="shrink-0 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-700">
                    Replied
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[10px] font-semibold text-zinc-500">
                {t.referenceCode} · Lot #{t.lotNo || "—"}
              </p>
              <p className="mt-1 text-xs font-black text-red-600">
                {formatYen(t.offerAmount)}
              </p>
              <p className="mt-0.5 text-[10px] text-zinc-400">
                {formatWhen(t.lastMessageAt)}
              </p>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat */}
      <section className="flex min-w-0 flex-1 flex-col">
        {!selectedId && (
          <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
            Select a negotiation to chat
          </div>
        )}
        {selectedId && loadingDetail && !detail && (
          <div className="flex flex-1 items-center justify-center gap-2 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading chat…
          </div>
        )}
        {detail && (
          <>
            <header className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-200 px-4 py-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  {detail.referenceCode} · {detail.auctionName || "Auction"}
                </p>
                <h3 className="truncate text-sm font-black text-zinc-900">
                  {detail.vehicleTitle}
                </h3>
                <p className="text-xs text-zinc-500">
                  Lot #{detail.lotNo || "—"} · {detail.lotDate || "—"} ·{" "}
                  {detail.modelTypeEn || "—"}
                </p>
              </div>
              <div className="rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2 text-right">
                <p className="text-[10px] font-bold uppercase text-zinc-500">
                  Your offer
                </p>
                <p className="text-sm font-black text-red-600">
                  {formatYen(detail.offerAmount)}
                </p>
                {detail.listPriceYen != null && (
                  <p className="text-[10px] text-zinc-400">
                    Start ~ {formatYen(detail.listPriceYen)}
                  </p>
                )}
              </div>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {detail.messages.map((m) => {
                const mine = m.senderType === "customer";
                return (
                  <div
                    key={m.id}
                    className={cn(
                      "flex",
                      mine ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm",
                        mine
                          ? "rounded-br-md bg-red-600 text-white"
                          : "rounded-bl-md border border-zinc-200 bg-white text-zinc-800",
                      )}
                    >
                      <p
                        className={cn(
                          "mb-1 text-[10px] font-bold uppercase tracking-wide",
                          mine ? "text-red-100" : "text-zinc-400",
                        )}
                      >
                        {m.senderName}
                      </p>
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {m.body}
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-[10px]",
                          mine ? "text-red-100/80" : "text-zinc-400",
                        )}
                      >
                        {formatWhen(m.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSend}
              className="flex items-end gap-2 border-t border-zinc-200 bg-zinc-50/80 px-4 py-3"
            >
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={2}
                placeholder={
                  detail.status === "active"
                    ? "Reply to SAS3…"
                    : "This negotiation is closed"
                }
                disabled={detail.status !== "active" || sending}
                className="min-h-[44px] flex-1 resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={
                  detail.status !== "active" || sending || !draft.trim()
                }
                className="red-gradient-btn inline-flex h-11 items-center gap-2 rounded-xl px-4 text-xs font-bold disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                Send
              </button>
            </form>
          </>
        )}
      </section>

      {/* Vehicle snapshot */}
      {detail && (
        <aside className="hidden w-[260px] flex-col border-l border-zinc-200 bg-zinc-50/50 lg:flex">
          <div className="border-b border-zinc-200 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              Vehicle
            </p>
          </div>
          <div className="space-y-3 overflow-y-auto p-4 text-xs">
            {detail.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={detail.imageUrl}
                alt=""
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-zinc-200 text-zinc-500">
                No photo
              </div>
            )}
            <dl className="space-y-2">
              <div>
                <dt className="font-semibold text-zinc-400">Status</dt>
                <dd className="font-bold capitalize text-zinc-800">
                  {detail.status}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-400">Grade</dt>
                <dd className="font-bold text-zinc-800">
                  {detail.scoresEn || detail.gradeEn || "—"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-400">Mileage</dt>
                <dd className="font-bold text-zinc-800">
                  {detail.mileage
                    ? `${Number(detail.mileage).toLocaleString()} km`
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-zinc-400">Chassis</dt>
                <dd className="font-bold text-zinc-800">
                  {detail.modelTypeEn || "—"}
                </dd>
              </div>
              <Link
                href={`/vehicles/auction/${encodeURIComponent(detail.lotId)}`}
                className="inline-block font-bold text-brand-red hover:underline"
              >
                View lot details →
              </Link>
            </dl>
          </div>
        </aside>
      )}
    </div>
  );
}

export default function NegotiationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-sm text-zinc-500">
          Loading negotiations…
        </div>
      }
    >
      <NegotiationsDashboard />
    </Suspense>
  );
}
