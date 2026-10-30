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
    <main className="min-h-screen bg-white text-zinc-900 selection:bg-red-600 selection:text-white">
      <TopBar />

      <Header onOpenChatModal={() => setIsChatWidgetOpen(true)} />

      <Hero />

      <Brands />

      <FeaturedStock />

      <Featured />

      <AuctionProcess />

      <footer className="border-t border-red-100 bg-white py-14 text-xs text-zinc-600">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-6 px-4 sm:px-6">
          <div>
            <div className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-red-600">
              SAS3
            </div>
            <div className="mt-1 text-sm font-semibold text-zinc-900">
              Trading Co., Ltd. · Japan
            </div>
            <div className="mt-1">
              Licensed Japanese Vehicle Exporter &amp; Auction Member • Tokyo
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 font-medium text-zinc-500">
            <span>© 2026 SAS3 Trading Co., Ltd.</span>
            <a
              href="/inquiry"
              className="font-semibold text-red-600 hover:underline"
            >
              Send Inquiry
            </a>
            <a
              href="https://wa.me/818037237007"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-red-600 hover:underline"
            >
              WhatsApp
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
