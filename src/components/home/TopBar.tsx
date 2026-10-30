"use client";

import { Clock, MessageCircle, Phone } from "lucide-react";
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
    <div className="border-b border-red-100 bg-white text-xs text-zinc-600">
      <div className="mx-auto flex min-h-9 max-w-[1400px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-1.5 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="flex items-center gap-1.5 font-bold tracking-wide text-red-600">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-600" />
            </span>
            USS TOKYO LIVE
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <Clock size={12} className="text-red-500" />
            JST {jstTime || "—"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="tel:+818037237007"
            className="hidden items-center gap-1.5 font-medium transition hover:text-red-600 sm:inline-flex"
          >
            <Phone size={12} /> +81 80-3723-7007
          </a>
          <a
            href="https://wa.me/818037237007"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-red-600 transition hover:text-red-700"
          >
            <MessageCircle size={12} /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
