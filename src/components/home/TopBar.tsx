"use client";

import { Globe, Clock, Phone, MessageCircle, TrendingUp, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function TopBar() {
  const [jstTime, setJstTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Tokyo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        weekday: "short",
      };
      setJstTime(new Intl.DateTimeFormat("en-US", options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-b border-zinc-200/80 bg-[#0F172A] text-xs text-zinc-300">
      <div className="mx-auto flex min-h-10 max-w-[1400px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 sm:px-6">
        {/* Left Section: Live Stats & JST Clock */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="flex items-center gap-1.5 font-bold text-red-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
            USS TOKYO & YOKOHAMA LIVE
          </span>

          <span className="hidden items-center gap-1.5 text-zinc-400 sm:flex">
            <Clock size={13} className="text-zinc-500" />
            <span>Japan (JST):</span>
            <span className="font-mono font-semibold text-white">{jstTime || "03:50 PM"}</span>
          </span>

          <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-zinc-300 md:flex">
            <TrendingUp size={12} className="text-red-400" />
            <span>USD/JPY: 155.80</span>
            <span className="text-emerald-400">+0.25%</span>
          </span>
        </div>

        {/* Right Section: Global Support & Quick Connect */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <a
            href="https://wa.me/818037237007"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 font-semibold text-emerald-400 transition hover:text-emerald-300"
          >
            <MessageCircle size={14} className="fill-emerald-400/20 text-emerald-400" />
            <span>VIP WhatsApp Desk</span>
          </a>

          <span className="hidden items-center gap-1.5 text-zinc-300 sm:flex">
            <Phone size={13} className="text-zinc-400" /> +81-3-6411-7501
          </span>

          <div className="flex items-center gap-2 border-l border-white/10 pl-3">
            <ShieldCheck size={14} className="text-amber-400" />
            <span className="hidden text-[11px] text-zinc-400 lg:inline">JAA Licensed Auction Member</span>
            <div className="flex items-center gap-1 text-zinc-400 hover:text-white cursor-pointer">
              <Globe size={13} />
              <span className="font-semibold text-white">EN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
