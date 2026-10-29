"use client";

import { useState } from "react";
import TopBar from "@/components/home/TopBar";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Brands from "@/components/home/Brands";
import Featured from "@/components/home/Featured";
import FeaturedStock from "@/components/home/FeaturedStock";
import AuctionProcess from "@/components/home/AuctionProcess";
import CustomerConciergeWidget from "@/components/customer/CustomerConciergeWidget";

export default function Home() {
  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#FAFAFC] text-zinc-900 selection:bg-red-600 selection:text-white">
      <TopBar />

      <Header onOpenChatModal={() => setIsChatWidgetOpen(true)} />

      <Hero />

      <Brands />

      <FeaturedStock />

      <Featured />

      <AuctionProcess />

      <footer className="border-t border-zinc-200/80 bg-white py-12 text-xs text-zinc-600">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
          <div>
            <div className="text-sm font-extrabold tracking-wider text-zinc-900">
              SAS3 TRADING CO., LTD. JAPAN
            </div>
            <div className="mt-1">
              Licensed Japanese Vehicle Exporter &amp; Auction Member • Tokyo,
              Japan
            </div>
          </div>
          <div className="flex items-center gap-6 font-medium text-zinc-500">
            <span>© 2026 SAS3 Trading Co., Ltd. All rights reserved.</span>
            <a
              href="https://wa.me/818037237007"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-red-600 hover:underline"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </footer>

      <CustomerConciergeWidget
        isOpenExternal={isChatWidgetOpen}
        onCloseExternal={() => setIsChatWidgetOpen(false)}
      />
    </main>
  );
}
