"use client";

import { useState, useEffect } from "react";
import { X, Gavel, FileText, Clock, ShieldCheck, CheckCircle2, ChevronRight, User, TrendingUp } from "lucide-react";

export type CarBiddingData = {
  id: string;
  name: string;
  lotNo: string;
  auctionHall: string;
  currentBid: number;
  startingBid: number;
  reserveMet: boolean;
  grade: string;
  interiorGrade: string;
  mileage: string;
  year: string;
  engine: string;
  transmission: string;
  img: string;
  timeLeftSeconds: number;
};

type BiddingModalProps = {
  car: CarBiddingData | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCifCalculator?: (car: CarBiddingData) => void;
};

export default function BiddingModal({ car, isOpen, onClose, onOpenCifCalculator }: BiddingModalProps) {
  const [activeTab, setActiveTab] = useState<"bidding" | "inspection">("bidding");
  const [customBidAmount, setCustomBidAmount] = useState<number>(0);
  const [userMaxAutoBid, setUserMaxAutoBid] = useState<number>(0);
  const [bidHistory, setBidHistory] = useState<
    { bidderId: string; country: string; amount: number; time: string; status: string }[]
  >([]);
  const [bidSubmitted, setBidSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (car) {
      setCustomBidAmount(car.currentBid + 200);
      setUserMaxAutoBid(car.currentBid + 1000);
      setTimeLeft(car.timeLeftSeconds || 185);

      setBidHistory([
        { bidderId: "Bidder #482", country: "🇯🇵 Tokyo", amount: car.currentBid, time: "1 min ago", status: "Active High Bid" },
        { bidderId: "Bidder #910", country: "🇬🇧 London", amount: car.currentBid - 200, time: "3 mins ago", status: "Outbid" },
        { bidderId: "Bidder #104", country: "🇰🇪 Mombasa", amount: car.currentBid - 500, time: "7 mins ago", status: "Outbid" },
        { bidderId: "Bidder #305", country: "🇦🇪 Dubai", amount: car.startingBid, time: "12 mins ago", status: "Starting Bid" },
      ]);
    }
  }, [car]);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  if (!isOpen || !car) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}m : ${s.toString().padStart(2, "0")}s`;
  };

  const handlePlaceBid = (amount: number) => {
    const newEntry = {
      bidderId: "You (VIP Buyer)",
      country: "🌐 VIP Account",
      amount,
      time: "Just now",
      status: "Active High Bid",
    };
    setBidHistory([newEntry, ...bidHistory]);
    setBidSubmitted(true);
    setTimeout(() => setBidSubmitted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-3 sm:p-6 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-zinc-200 bg-white text-zinc-900 shadow-2xl overflow-hidden my-auto animate-fade-in">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100 font-bold">
              <Gavel size={20} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold tracking-wide text-zinc-900 text-base sm:text-lg">{car.name}</h3>
                <span className="rounded-lg bg-zinc-200/80 px-2.5 py-0.5 text-xs font-mono font-bold text-zinc-700">
                  {car.auctionHall} - Lot #{car.lotNo}
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-medium">Direct USS Live Auction Desk • JAA Verification Guaranteed</p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200/60 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Tab Controls */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-2.5">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("bidding")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "bidding"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              <Gavel size={14} /> LIVE BIDDING CONSOLE
            </button>
            <button
              onClick={() => setActiveTab("inspection")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === "inspection"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              <FileText size={14} /> INSPECTION SHEET & GRADE ({car.grade})
            </button>
          </div>

          {onOpenCifCalculator && (
            <button
              onClick={() => onOpenCifCalculator(car)}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 transition"
            >
              <span>Calculate CIF Cost</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === "bidding" ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left Column: Car Image & Live Timer */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100">
                  <img src={car.img} alt={car.name} className="h-full w-full object-cover" />
                  <div className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-bold text-red-400 backdrop-blur-md flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                    <span>AUCTION SESSION LIVE</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-zinc-200 bg-white/95 p-3 backdrop-blur-md text-center shadow-lg">
                    <div className="text-[11px] font-extrabold tracking-wider text-zinc-500 uppercase">
                      TIME REMAINING TO BID
                    </div>
                    <div className="font-mono text-2xl font-black text-red-600 flex items-center justify-center gap-2 mt-0.5">
                      <Clock size={20} className="animate-spin text-red-600" />
                      <span>{formatTime(timeLeft)}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Specs Grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2.5">
                    <div className="text-zinc-500 text-[10px] font-bold">GRADE</div>
                    <div className="font-black text-red-600">{car.grade}</div>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2.5">
                    <div className="text-zinc-500 text-[10px] font-bold">YEAR</div>
                    <div className="font-bold text-zinc-900">{car.year}</div>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2.5">
                    <div className="text-zinc-500 text-[10px] font-bold">MILEAGE</div>
                    <div className="font-bold text-zinc-900">{car.mileage}</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Bidding Controls & History */}
              <div className="lg:col-span-7 space-y-5">
                {/* Current Bid & Status Card */}
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-zinc-500 uppercase">CURRENT HIGHEST BID</span>
                    <div className="text-3xl font-black text-zinc-900 font-mono flex items-baseline gap-2">
                      US$ {car.currentBid.toLocaleString()}
                      <span className="text-xs font-normal text-zinc-500 font-sans">
                        (~¥{(car.currentBid * 155.8).toLocaleString()})
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-xs text-zinc-500 font-bold uppercase">RESERVE PRICE</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 size={13} /> RESERVE MET
                    </span>
                  </div>
                </div>

                {/* Fast Incremental Bidding Buttons */}
                <div>
                  <label className="mb-2 block text-xs font-extrabold uppercase text-zinc-700 tracking-wider">
                    Quick Bid Increments
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[200, 500, 1000].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => handlePlaceBid(car.currentBid + inc)}
                        className="rounded-xl border border-red-200 bg-red-50 py-2.5 text-xs font-bold text-red-700 hover:bg-red-600 hover:text-white transition shadow-sm"
                      >
                        + ${inc} (US$ {(car.currentBid + inc).toLocaleString()})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Maximum Auto-Bid Box */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold uppercase text-zinc-800 tracking-wider flex items-center gap-1.5">
                      <TrendingUp size={14} className="text-red-600" /> SET MAXIMUM AUTO-BID (PROXY)
                    </label>
                    <span className="text-[11px] text-zinc-500 font-medium">System bids up to your limit</span>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-zinc-400">$</span>
                      <input
                        type="number"
                        value={userMaxAutoBid}
                        onChange={(e) => setUserMaxAutoBid(Number(e.target.value))}
                        className="glass-input pl-8 font-mono text-sm font-bold text-zinc-900"
                        placeholder="Enter max bid..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePlaceBid(userMaxAutoBid)}
                      className="red-gradient-btn rounded-xl px-6 py-2.5 text-xs font-extrabold"
                    >
                      PLACE MAX BID
                    </button>
                  </div>
                  {bidSubmitted && (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs font-bold text-emerald-800 text-center">
                      ✓ Bid successfully registered! You are currently the highest bidder.
                    </div>
                  )}
                </div>

                {/* Live Bid Logs Table */}
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs text-zinc-600 font-extrabold uppercase tracking-wider">
                    <span>Recent Live Bids Log</span>
                    <span className="text-[10px] text-red-600">Real-Time Sync</span>
                  </div>

                  <div className="max-h-36 overflow-y-auto rounded-xl border border-zinc-200 bg-white scrollbar-thin">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-zinc-200 bg-zinc-50 text-[10px] font-bold text-zinc-500 uppercase">
                        <tr>
                          <th className="px-3 py-2">Bidder</th>
                          <th className="px-3 py-2">Location</th>
                          <th className="px-3 py-2">Amount</th>
                          <th className="px-3 py-2">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 font-mono">
                        {bidHistory.map((item, idx) => (
                          <tr key={idx} className={idx === 0 ? "bg-red-50 text-red-700 font-bold" : "text-zinc-700"}>
                            <td className="px-3 py-2 flex items-center gap-1.5">
                              <User size={12} className="text-zinc-400" /> {item.bidderId}
                            </td>
                            <td className="px-3 py-2">{item.country}</td>
                            <td className="px-3 py-2 font-bold">US$ {item.amount.toLocaleString()}</td>
                            <td className="px-3 py-2 text-zinc-400 text-[11px]">{item.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Inspection Sheet & Evaluation Tab */
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-900 p-4 text-center">
                  <div className="mb-2 text-xs font-bold text-red-400">
                    OFFICIAL JAPANESE AUCTION INSPECTION SHEET (USS TOKYO)
                  </div>
                  <div className="relative aspect-[4/3] rounded-xl border border-white/10 overflow-hidden bg-zinc-950 flex items-center justify-center p-4">
                    <div className="w-full h-full p-4 flex flex-col justify-between text-left text-[11px] font-mono text-zinc-300 bg-[#161B26] rounded-lg">
                      <div className="flex justify-between border-b border-white/10 pb-2">
                        <div>
                          <span className="text-red-400 font-bold">LOT #{car.lotNo}</span> | MODEL: {car.name}
                        </div>
                        <div className="text-emerald-400 font-bold">OVERALL GRADE: {car.grade}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 my-2 border-b border-white/10 pb-2">
                        <div>Engine: {car.engine} OK</div>
                        <div>Transmission: {car.transmission} OK</div>
                        <div>Interior Grade: {car.interiorGrade}</div>
                        <div>Mileage: {car.mileage} Verified</div>
                      </div>
                      <div className="rounded border border-red-500/30 bg-red-500/10 p-2 text-[10px] text-red-200">
                        Inspector Notes: Single owner vehicle, complete service record books available, non-smoker interior, minor body scratch A1 on front bumper. Clean chassis frame.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-red-600" /> JAPAN INSPECTION MARK KEY
                  </h4>
                  <ul className="space-y-2 text-xs text-zinc-700">
                    <li className="flex justify-between border-b border-zinc-200 pb-1">
                      <span className="font-bold text-red-600">Grade 5.0 / S</span>
                      <span>Like New / Under 10,000km</span>
                    </li>
                    <li className="flex justify-between border-b border-zinc-200 pb-1">
                      <span className="font-bold text-red-600">Grade 4.5</span>
                      <span>Excellent Condition, Minor Wear</span>
                    </li>
                    <li className="flex justify-between border-b border-zinc-200 pb-1">
                      <span className="font-bold text-red-600">A1 / U1</span>
                      <span>Tiny Scratch / Tiny Dent (Minor)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
