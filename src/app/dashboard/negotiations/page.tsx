"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MessageSquare,
  Search,
  Send,
  MapPin,
  SlidersHorizontal,
  X,
  Clock,
  User,
  Headphones,
  FileText,
  CircleDollarSign,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockNegotiations, Negotiation } from "@/lib/dummy-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CATEGORY_TABS = [
  "All",
  "Order",
  "Item",
  "Payment Notification",
  "Documents Received",
  "Item Received",
  "Expired",
] as const;

const formatUSD = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);

function txnBadgeClass(status: Negotiation["transactionStatus"]) {
  const map = {
    Active: "bg-amber-50 text-amber-700 ring-amber-200",
    Approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Rejected: "bg-red-50 text-red-700 ring-red-200",
    Expired: "bg-zinc-100 text-zinc-600 ring-zinc-200",
  };
  return map[status];
}

function payBadgeClass(status: Negotiation["paymentStatus"]) {
  const map = {
    Unpaid: "bg-red-50 text-red-700 ring-red-200",
    "Deposit Paid": "bg-sky-50 text-sky-700 ring-sky-200",
    Paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };
  return map[status];
}

function StatusBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset",
        className
      )}
    >
      {label}
    </span>
  );
}

function NegotiationsDashboard() {
  const [negotiations, setNegotiations] = useState<Negotiation[]>(mockNegotiations);
  const [selectedNegId, setSelectedNegId] = useState<string>(mockNegotiations[0]?.id ?? "");
  const [chatInput, setChatInput] = useState("");

  const [activeTab, setActiveTab] = useState<string>("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("All");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [refNo, setRefNo] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [txnStatus, setTxnStatus] = useState("All");
  const [payStatus, setPayStatus] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredNegotiations = useMemo(
    () =>
      negotiations
        .filter((n) => {
          const matchesTab = activeTab === "All" || n.category === activeTab;
          const matchesKeyword =
            keyword === "" ||
            n.makeModel.toLowerCase().includes(keyword.toLowerCase()) ||
            n.referenceNo.toLowerCase().includes(keyword.toLowerCase()) ||
            n.messages.some((m) => m.text.toLowerCase().includes(keyword.toLowerCase()));
          const matchesLocation = location === "All" || n.location === location;
          const matchesMake = make === "" || n.makeModel.toLowerCase().includes(make.toLowerCase());
          const matchesModel = model === "" || n.makeModel.toLowerCase().includes(model.toLowerCase());
          const matchesRef = refNo === "" || n.referenceNo.includes(refNo);
          const matchesInv = invoiceNo === "" || n.invoiceNo.includes(invoiceNo);
          const matchesTxn = txnStatus === "All" || n.transactionStatus === txnStatus;
          const matchesPay = payStatus === "All" || n.paymentStatus === payStatus;
          const matchesDateFrom = !dateFrom || n.latestDate >= dateFrom;
          const matchesDateTo = !dateTo || n.latestDate <= dateTo;

          return (
            matchesTab &&
            matchesKeyword &&
            matchesLocation &&
            matchesMake &&
            matchesModel &&
            matchesRef &&
            matchesInv &&
            matchesTxn &&
            matchesPay &&
            matchesDateFrom &&
            matchesDateTo
          );
        })
        .sort((a, b) => {
          if (sortBy === "Unread") return b.unreadMessagesCount - a.unreadMessagesCount;
          if (sortBy === "Not Replied") {
            const aLatest = a.messages[a.messages.length - 1]?.sender === "Agent" ? 1 : 0;
            const bLatest = b.messages[b.messages.length - 1]?.sender === "Agent" ? 1 : 0;
            return bLatest - aLatest;
          }
          return b.latestDate.localeCompare(a.latestDate);
        }),
    [
      negotiations,
      activeTab,
      keyword,
      location,
      make,
      model,
      refNo,
      invoiceNo,
      txnStatus,
      payStatus,
      dateFrom,
      dateTo,
      sortBy,
    ]
  );

  const activeNeg = negotiations.find((n) => n.id === selectedNegId);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { All: negotiations.length };
    for (const n of negotiations) {
      counts[n.category] = (counts[n.category] ?? 0) + 1;
    }
    return counts;
  }, [negotiations]);

  const unreadTotal = negotiations.reduce((sum, n) => sum + n.unreadMessagesCount, 0);
  const awaitingReply = negotiations.filter(
    (n) => n.messages[n.messages.length - 1]?.sender === "Agent"
  ).length;

  useEffect(() => {
    if (
      filteredNegotiations.length > 0 &&
      !filteredNegotiations.some((n) => n.id === selectedNegId)
    ) {
      setSelectedNegId(filteredNegotiations[0].id);
    }
  }, [filteredNegotiations, selectedNegId]);

  const clearFilters = () => {
    setKeyword("");
    setLocation("All");
    setMake("");
    setModel("");
    setRefNo("");
    setInvoiceNo("");
    setTxnStatus("All");
    setPayStatus("All");
    setDateFrom("");
    setDateTo("");
  };

  const hasActiveFilters =
    make || model || refNo || invoiceNo || location !== "All" || txnStatus !== "All" ||
    payStatus !== "All" || dateFrom || dateTo;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeNeg) return;

    const newMessage = {
      sender: "User" as const,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      text: chatInput.trim(),
    };

    setNegotiations((prev) =>
      prev.map((n) =>
        n.id === activeNeg.id
          ? {
              ...n,
              messages: [...n.messages, newMessage],
              latestDate: newMessage.timestamp.split(" ")[0],
              unreadMessagesCount: 0,
            }
          : n
      )
    );

    setChatInput("");

    setTimeout(() => {
      const responses = [
        "Received. I will present this counter-offer to the USS auction director immediately.",
        "Chassis inspections are looking solid. I will prepare container booking options for your review.",
        "Noted. We have requested high-resolution port photos of the frame rails. Stand by.",
      ];
      const agentMessage = {
        sender: "Agent" as const,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
        text: responses[Math.floor(Math.random() * responses.length)],
      };

      setNegotiations((prev) =>
        prev.map((n) =>
          n.id === activeNeg.id ? { ...n, messages: [...n.messages, agentMessage] } : n
        )
      );
      toast.info("SAS3 agent replied to your message");
    }, 1500);
  };

  const inputClass =
    "h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-brand-red focus:ring-2 focus:ring-brand-red/10";

  return (
    <div className="space-y-6">
      {/* Page intro */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Importer communications
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-zinc-900">
            Chat negotiations
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
            Review counter-offers, payment updates, and document threads with your SAS3
            auction agent. Select a conversation on the left to view the full message
            history and deal terms.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-center min-w-[100px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Threads</p>
            <p className="mt-0.5 text-xl font-black text-zinc-900">{negotiations.length}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-center min-w-[100px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Unread</p>
            <p className="mt-0.5 text-xl font-black text-brand-red">{unreadTotal}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-center min-w-[100px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Awaiting you</p>
            <p className="mt-0.5 text-xl font-black text-amber-600">{awaitingReply}</p>
          </div>
        </div>
      </div>

      {/* Search & filters */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search vehicle, reference, invoice, or message text…"
              className={cn(inputClass, "pl-9")}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={cn(inputClass, "sm:w-44 cursor-pointer")}
            aria-label="Sort conversations"
          >
            <option value="Latest">Latest activity</option>
            <option value="Unread">Unread first</option>
            <option value="Not Replied">Needs your reply</option>
          </select>
          <Button
            variant="outline"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="h-10 shrink-0 rounded-lg border-zinc-200 text-xs font-bold uppercase tracking-wide"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            {filtersOpen ? "Hide filters" : "More filters"}
          </Button>
        </div>

        {filtersOpen && (
          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-zinc-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <FilterField label="Make" value={make} onChange={setMake} placeholder="Nissan, Toyota" />
            <FilterField label="Model" value={model} onChange={setModel} placeholder="Skyline, Supra" />
            <FilterField label="Reference no." value={refNo} onChange={setRefNo} placeholder="REF-29402" />
            <FilterField label="Invoice no." value={invoiceNo} onChange={setInvoiceNo} placeholder="INV-2026-008" />
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Date range
              </label>
              <div className="flex gap-2">
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={inputClass} />
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={inputClass} />
              </div>
            </div>
            <FilterSelect label="Auction location" value={location} onChange={setLocation} options={[
              { value: "All", label: "All locations" },
              { value: "USS Tokyo", label: "USS Tokyo" },
              { value: "USS Nagoya", label: "USS Nagoya" },
              { value: "USS Yokohama", label: "USS Yokohama" },
            ]} />
            <FilterSelect label="Transaction status" value={txnStatus} onChange={setTxnStatus} options={[
              { value: "All", label: "All" },
              { value: "Active", label: "Active" },
              { value: "Approved", label: "Approved" },
              { value: "Rejected", label: "Rejected" },
              { value: "Expired", label: "Expired" },
            ]} />
            <FilterSelect label="Payment status" value={payStatus} onChange={setPayStatus} options={[
              { value: "All", label: "All" },
              { value: "Unpaid", label: "Unpaid" },
              { value: "Deposit Paid", label: "Deposit paid" },
              { value: "Paid", label: "Paid" },
            ]} />
            {hasActiveFilters && (
              <div className="flex items-end sm:col-span-2 lg:col-span-4">
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-zinc-600">
                  <X className="mr-1.5 h-3.5 w-3.5" />
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_TABS.map((tab) => {
          const count = tab === "All" ? tabCounts.All : tabCounts[tab] ?? 0;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition",
                isActive
                  ? "bg-brand-red text-white shadow-sm"
                  : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
              )}
            >
              {tab}
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                  isActive ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-600"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main workspace */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="grid min-h-[640px] lg:grid-cols-[320px_1fr] xl:grid-cols-[300px_1fr_280px]">
          {/* Conversation list */}
          <aside className="flex flex-col border-b border-zinc-200 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-4 py-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                Conversations
              </h3>
              <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-bold text-zinc-700">
                {filteredNegotiations.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
              {filteredNegotiations.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                  <MessageSquare className="h-8 w-8 text-zinc-300" />
                  <p className="mt-3 text-sm font-semibold text-zinc-700">No conversations found</p>
                  <p className="mt-1 text-xs text-zinc-500">Try a different category or clear your filters.</p>
                </div>
              ) : (
                filteredNegotiations.map((neg) => {
                  const latestMsg = neg.messages[neg.messages.length - 1];
                  const isSelected = neg.id === selectedNegId;
                  const needsReply = latestMsg?.sender === "Agent";

                  return (
                    <button
                      key={neg.id}
                      type="button"
                      onClick={() => setSelectedNegId(neg.id)}
                      className={cn(
                        "mb-1 w-full rounded-lg border p-3 text-left transition",
                        isSelected
                          ? "border-brand-red/40 bg-brand-red/5 ring-1 ring-brand-red/20"
                          : "border-transparent hover:border-zinc-200 hover:bg-zinc-50"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-bold text-zinc-500">
                          {neg.referenceNo}
                        </span>
                        <span className="shrink-0 text-[10px] text-zinc-400">{neg.latestDate}</span>
                      </div>
                      <p className="mt-1.5 text-sm font-bold leading-snug text-zinc-900 line-clamp-1">
                        {neg.makeModel}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-500 line-clamp-2">
                        {latestMsg ? (
                          <>
                            <span className="font-semibold text-zinc-600">
                              {latestMsg.sender === "Agent" ? "Agent: " : "You: "}
                            </span>
                            {latestMsg.text}
                          </>
                        ) : (
                          "No messages yet"
                        )}
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-zinc-600">
                          {neg.category}
                        </span>
                        {needsReply && (
                          <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-700">
                            Reply needed
                          </span>
                        )}
                        {neg.unreadMessagesCount > 0 && (
                          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1.5 text-[10px] font-bold text-white">
                            {neg.unreadMessagesCount}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Chat panel */}
          <section className="flex min-h-[480px] flex-col lg:min-h-0">
            {activeNeg ? (
              <>
                {/* Vehicle & deal header */}
                <div className="border-b border-zinc-100 bg-zinc-50/80 p-4">
                  <div className="flex gap-4">
                    <img
                      src={activeNeg.image}
                      alt={activeNeg.makeModel}
                      className="h-20 w-28 shrink-0 rounded-lg border border-zinc-200 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-brand-red">
                          {activeNeg.referenceNo}
                        </span>
                        <span className="text-zinc-300">·</span>
                        <span className="flex items-center gap-1 text-xs text-zinc-500">
                          <MapPin className="h-3 w-3" />
                          {activeNeg.location}
                        </span>
                      </div>
                      <h3 className="mt-1 text-lg font-black leading-tight text-zinc-900">
                        {activeNeg.makeModel}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <StatusBadge label={activeNeg.transactionStatus} className={txnBadgeClass(activeNeg.transactionStatus)} />
                        <StatusBadge label={activeNeg.paymentStatus} className={payBadgeClass(activeNeg.paymentStatus)} />
                        <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-zinc-600">
                          {activeNeg.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price summary — visible on smaller screens when deal panel hidden */}
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:hidden">
                    <PriceCell label="List price" value={formatUSD(activeNeg.originalPrice)} />
                    <PriceCell label="Your offer" value={formatUSD(activeNeg.offeredPrice)} highlight />
                    <PriceCell
                      label="Difference"
                      value={formatUSD(activeNeg.originalPrice - activeNeg.offeredPrice)}
                    />
                    <PriceCell label="Invoice" value={activeNeg.invoiceNo} mono />
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto bg-zinc-50/50 p-4 scrollbar-thin">
                  <p className="mb-4 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Message history · {activeNeg.messages.length} messages
                  </p>
                  <div className="space-y-4">
                    {activeNeg.messages.map((msg, mIdx) => {
                      const isUser = msg.sender === "User";
                      return (
                        <div
                          key={mIdx}
                          className={cn("flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}
                        >
                          <div
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                              isUser ? "bg-brand-red text-white" : "bg-zinc-200 text-zinc-600"
                            )}
                          >
                            {isUser ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Headphones className="h-4 w-4" />
                            )}
                          </div>
                          <div className={cn("max-w-[85%]", isUser ? "items-end" : "items-start")}>
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
                              {isUser ? "You" : "Yuki Tanaka · SAS3 Agent"}
                            </p>
                            <div
                              className={cn(
                                "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                                isUser
                                  ? "rounded-tr-sm bg-brand-red text-white"
                                  : "rounded-tl-sm border border-zinc-200 bg-white text-zinc-800 shadow-sm"
                              )}
                            >
                              {msg.text}
                            </div>
                            <p className="mt-1 flex items-center gap-1 text-[10px] text-zinc-400">
                              <Clock className="h-3 w-3" />
                              {msg.timestamp}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Composer */}
                <form
                  onSubmit={handleSendMessage}
                  className="border-t border-zinc-200 bg-white p-4"
                >
                  <label htmlFor="chat-input" className="sr-only">
                    Message to agent
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="chat-input"
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about condition, shipping, or submit a counter-offer…"
                      className={cn(inputClass, "flex-1 h-11")}
                    />
                    <Button
                      type="submit"
                      className="h-11 shrink-0 rounded-lg bg-brand-red px-4 hover:bg-brand-redDark"
                    >
                      <Send className="h-4 w-4" />
                      <span className="ml-2 hidden sm:inline">Send</span>
                    </Button>
                  </div>
                  <p className="mt-2 text-[10px] text-zinc-400">
                    Typical agent response time: under 2 hours during JST business hours.
                  </p>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <MessageSquare className="h-12 w-12 text-zinc-200" />
                <h4 className="mt-4 text-base font-bold text-zinc-700">Select a conversation</h4>
                <p className="mt-2 max-w-sm text-sm text-zinc-500">
                  Choose a thread from the list to view messages, pricing, and status details.
                </p>
              </div>
            )}
          </section>

          {/* Deal details sidebar — xl+ */}
          {activeNeg && (
            <aside className="hidden flex-col border-t border-zinc-200 bg-zinc-50/50 xl:flex xl:border-t-0 xl:border-l">
              <div className="border-b border-zinc-100 px-4 py-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                  Deal summary
                </h3>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin">
                <DetailBlock icon={CircleDollarSign} title="Pricing">
                  <dl className="space-y-2.5 text-sm">
                    <DetailRow label="Auction list price" value={formatUSD(activeNeg.originalPrice)} />
                    <DetailRow label="Your current offer" value={formatUSD(activeNeg.offeredPrice)} highlight />
                    <DetailRow
                      label="Below list"
                      value={formatUSD(activeNeg.originalPrice - activeNeg.offeredPrice)}
                      positive={activeNeg.offeredPrice < activeNeg.originalPrice}
                    />
                  </dl>
                </DetailBlock>

                <DetailBlock icon={FileText} title="References">
                  <dl className="space-y-2.5 text-sm">
                    <DetailRow label="Reference" value={activeNeg.referenceNo} mono />
                    <DetailRow label="Invoice" value={activeNeg.invoiceNo} mono />
                    <DetailRow label="Thread ID" value={activeNeg.id} mono />
                    <DetailRow label="Last activity" value={activeNeg.latestDate} />
                  </dl>
                </DetailBlock>

                <DetailBlock icon={MapPin} title="Auction">
                  <dl className="space-y-2.5 text-sm">
                    <DetailRow label="Hall" value={activeNeg.location} />
                    <DetailRow label="Category" value={activeNeg.category} />
                  </dl>
                </DetailBlock>

                <div className="rounded-lg border border-zinc-200 bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Quick actions
                  </p>
                  <div className="mt-2 space-y-1">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-md px-2 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                      onClick={() => toast.info("Invoice download simulated")}
                    >
                      View invoice
                      <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-md px-2 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                      onClick={() => toast.info("Vehicle spec sheet simulated")}
                    >
                      Vehicle spec sheet
                      <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10"
      />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function PriceCell({
  label,
  value,
  highlight,
  mono,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-500">{label}</p>
      <p
        className={cn(
          "mt-0.5 text-sm font-bold",
          highlight ? "text-brand-red" : "text-zinc-900",
          mono && "font-mono text-xs"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function DetailBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3">
      <div className="flex items-center gap-2 border-b border-zinc-100 pb-2">
        <Icon className="h-4 w-4 text-brand-red" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700">{title}</h4>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  highlight,
  positive,
  mono,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  positive?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd
        className={cn(
          "text-right text-xs font-bold",
          highlight && "text-brand-red",
          positive && "text-emerald-600",
          mono && "font-mono",
          !highlight && !positive && "text-zinc-900"
        )}
      >
        {value}
      </dd>
    </div>
  );
}


export default NegotiationsDashboard;
