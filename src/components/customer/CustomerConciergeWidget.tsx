"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Headset, Phone, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";

type ChatMessage = {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
};

type CustomerConciergeWidgetProps = {
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
};

export default function CustomerConciergeWidget({ isOpenExternal, onCloseExternal }: CustomerConciergeWidgetProps) {
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const isOpen = isOpenExternal !== undefined ? isOpenExternal : isOpenInternal;

  const handleToggle = (state?: boolean) => {
    const nextState = state !== undefined ? state : !isOpen;
    if (onCloseExternal && !nextState) {
      onCloseExternal();
    }
    setIsOpenInternal(nextState);
  };

  const [activeTab, setActiveTab] = useState<"chat" | "sourcing" | "call">("chat");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      text: "Konnichiwa! Welcome to SAS3 Live Bidding & Import Desk. How can I assist with your Japanese vehicle search or auction inquiry today?",
      timestamp: "Just now",
    },
  ]);

  const [sourcingMake, setSourcingMake] = useState("");
  const [sourcingModel, setSourcingModel] = useState("");
  const [sourcingBudget, setSourcingBudget] = useState("");
  const [sourcingSubmitted, setSourcingSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");

    setTimeout(() => {
      let replyText = "Thank you for reaching out! Our Tokyo auction specialists are reviewing your request. For immediate assistance with bidding deposits, please contact our WhatsApp line at +81-80-3723-7007.";

      const lower = query.toLowerCase();
      if (lower.includes("shipping") || lower.includes("cif") || lower.includes("fob")) {
        replyText = "Our FOB handling fee is fixed at $450, which includes auction bidding, translation, and export de-registration. Ocean freight depends on your port (e.g. Mombasa is $1,450, Kingston is $1,650). Use our CIF calculator tool above for exact rates!";
      } else if (lower.includes("bid") || lower.includes("deposit") || lower.includes("how to buy")) {
        replyText = "To bid in USS or JAA auctions, register an account and place a standard security deposit of $1,000 USD. If your bid is unsuccessful, your deposit is 100% refundable!";
      } else if (lower.includes("inspection") || lower.includes("sheet") || lower.includes("grade")) {
        replyText = "Every car has an official Japanese Evaluation Sheet (Grade 3.5 to 5.0). Our bilingual Japanese team translates every note and chassis diagram before bidding.";
      }

      const botReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botReply]);
    }, 800);
  };

  const handleSourcingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSourcingSubmitted(true);
    setTimeout(() => {
      setSourcingSubmitted(false);
      setSourcingMake("");
      setSourcingModel("");
      setSourcingBudget("");
    }, 4000);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => handleToggle(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full red-gradient-btn shadow-2xl transition hover:scale-105"
        >
          <MessageSquare size={24} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-white"></span>
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="relative flex h-[580px] w-[360px] sm:w-[400px] flex-col rounded-3xl border border-zinc-200 bg-white text-zinc-900 shadow-2xl overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between bg-red-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white font-bold">
                  <Headset size={20} />
                </span>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-white" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  SAS3 VIP CONCIERGE <Sparkles size={13} className="text-amber-300" />
                </h4>
                <p className="text-[11px] text-white/90 font-medium">Live • Tokyo Headquarters</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleToggle(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-zinc-200 bg-zinc-50 text-xs font-bold">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-2.5 text-center transition ${
                activeTab === "chat" ? "border-b-2 border-red-600 text-red-600 bg-white" : "text-zinc-500"
              }`}
            >
              Live Chat Desk
            </button>
            <button
              onClick={() => setActiveTab("sourcing")}
              className={`flex-1 py-2.5 text-center transition ${
                activeTab === "sourcing" ? "border-b-2 border-red-600 text-red-600 bg-white" : "text-zinc-500"
              }`}
            >
              Custom Sourcing
            </button>
            <button
              onClick={() => setActiveTab("call")}
              className={`flex-1 py-2.5 text-center transition ${
                activeTab === "call" ? "border-b-2 border-red-600 text-red-600 bg-white" : "text-zinc-500"
              }`}
            >
              Contact Desk
            </button>
          </div>

          {/* Tab 1: Live Interactive Chat */}
          {activeTab === "chat" && (
            <div className="flex flex-1 flex-col overflow-hidden bg-zinc-50/50">
              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-medium leading-relaxed ${
                        m.sender === "user"
                          ? "bg-red-600 text-white rounded-br-none shadow-sm"
                          : "bg-white text-zinc-800 rounded-bl-none border border-zinc-200 shadow-sm"
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="mt-1 text-[10px] text-zinc-400 font-medium">{m.timestamp}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Quick Prompts */}
              <div className="flex gap-1.5 overflow-x-auto p-2 border-t border-zinc-200 bg-white text-[11px] scrollbar-thin">
                <button
                  type="button"
                  onClick={() => handleSendMessage("How do I deposit to place a bid?")}
                  className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-zinc-700 hover:border-red-500 hover:text-red-600 transition"
                >
                  How to Deposit?
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage("Tell me FOB & CIF shipping rates")}
                  className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-zinc-700 hover:border-red-500 hover:text-red-600 transition"
                >
                  Shipping & CIF Costs
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage("Can I view Japanese inspection sheet for Lot #8821?")}
                  className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-zinc-700 hover:border-red-500 hover:text-red-600 transition"
                >
                  Inspection Sheet Help
                </button>
              </div>

              {/* Chat Input Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 border-t border-zinc-200 bg-white p-3"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask advisor or inquire about lot..."
                  className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-red-600"
                />
                <button
                  type="submit"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white hover:bg-red-700 transition shadow-sm"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Custom Vehicle Sourcing */}
          {activeTab === "sourcing" && (
            <div className="flex-1 overflow-y-auto p-5 bg-white space-y-4">
              <div className="text-xs text-zinc-600 leading-relaxed font-medium">
                Can't find your target vehicle? Submit your desired specifications and our Japan buyers will source directly from USS/JAA auctions.
              </div>

              {sourcingSubmitted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center text-xs text-emerald-800 space-y-2">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-600" />
                  <div className="font-bold text-sm text-zinc-900">Sourcing Request Received!</div>
                  <p>Our Tokyo buyer will contact you on WhatsApp with 3 matching auction options within 2 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSourcingSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-zinc-700 mb-1">Vehicle Make</label>
                    <input
                      type="text"
                      required
                      value={sourcingMake}
                      onChange={(e) => setSourcingMake(e.target.value)}
                      placeholder="e.g. Toyota, Lexus, Nissan"
                      className="glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-zinc-700 mb-1">Model & Trim</label>
                    <input
                      type="text"
                      required
                      value={sourcingModel}
                      onChange={(e) => setSourcingModel(e.target.value)}
                      placeholder="e.g. Land Cruiser 300 ZX, GT-R"
                      className="glass-input text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold uppercase text-zinc-700 mb-1">Max Budget (FOB USD)</label>
                    <input
                      type="number"
                      required
                      value={sourcingBudget}
                      onChange={(e) => setSourcingBudget(e.target.value)}
                      placeholder="e.g. 35000"
                      className="glass-input text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="red-gradient-btn w-full rounded-xl py-3 text-xs font-bold"
                  >
                    SUBMIT VEHICLE SOURCE REQUEST
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Tab 3: Direct Contact Desk */}
          {activeTab === "call" && (
            <div className="flex-1 overflow-y-auto p-5 bg-white space-y-4">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
                <div className="font-extrabold text-xs text-red-600 flex items-center gap-2">
                  <Phone size={16} /> TOKYO HEAD OFFICE
                </div>
                <div className="text-xs text-zinc-700 space-y-1">
                  <p><strong>Phone:</strong> +81-3-6411-7501</p>
                  <p><strong>Mobile/WhatsApp:</strong> +81-80-3723-7007</p>
                  <p><strong>Office Hours:</strong> Mon - Sat (9:00 AM - 7:00 PM JST)</p>
                </div>
              </div>

              <a
                href="https://wa.me/818037237007"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-lg hover:bg-emerald-700 transition"
              >
                <span>OPEN DIRECT WHATSAPP CHAT</span>
                <ChevronRight size={16} />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
