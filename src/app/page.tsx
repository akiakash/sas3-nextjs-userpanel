"use client";

import { useState } from "react";
import TopBar from "@/components/home/TopBar";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Brands from "@/components/home/Brands";
import Featured from "@/components/home/Featured";
import AuctionProcess from "@/components/home/AuctionProcess";
import CustomerConciergeWidget from "@/components/customer/CustomerConciergeWidget";
import CifCalculatorModal from "@/components/customer/CifCalculatorModal";

export default function Home() {
  const [isCifModalOpen, setIsCifModalOpen] = useState(false);
  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#FAFAFC] text-zinc-900 selection:bg-red-600 selection:text-white">
      {/* Live Exchange & JST Ticker TopBar */}
      <TopBar />

      {/* Glassmorphic Navigation Header */}
      <Header
        onOpenCifModal={() => setIsCifModalOpen(true)}
        onOpenChatModal={() => setIsChatWidgetOpen(true)}
      />

      {/* Minimal Hero Banner with Live Search */}
      <Hero onSearchSubmit={() => {}} />

      {/* Brand & Manufacturer Grid */}
      <Brands />

      {/* Real-time Bidding Hall Showcase */}
      <Featured onOpenChatModal={() => setIsChatWidgetOpen(true)} />

      {/* Step-by-Step Auction Import Process */}
      <AuctionProcess />

      {/* Minimal Global Footer */}
      <footer className="border-t border-zinc-200/80 bg-white py-12 text-xs text-zinc-600">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-extrabold text-zinc-900 text-sm tracking-wider">SAS3 TRADING CO., LTD. JAPAN</div>
            <div className="mt-1">Licensed Japanese Vehicle Exporter & Auction Member • Tokyo, Japan</div>
          </div>
          <div className="flex items-center gap-6 text-zinc-500 font-medium">
            <span>© 2026 SAS3 Trading Co., Ltd. All rights reserved.</span>
            <a href="https://wa.me/818037237007" target="_blank" rel="noreferrer" className="text-red-600 font-bold hover:underline">
              WhatsApp Support
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Customer VIP Concierge & Live Agent Chat */}
      <CustomerConciergeWidget
        isOpenExternal={isChatWidgetOpen}
        onCloseExternal={() => setIsChatWidgetOpen(false)}
      />

      {/* Top Header Triggered CIF Calculator Modal */}
      <CifCalculatorModal
        isOpen={isCifModalOpen}
        onClose={() => setIsCifModalOpen(false)}
        initialFob={28000}
        carName="General Vehicle Search"
      />
    </main>
  );
}
