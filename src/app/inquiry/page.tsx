"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MessageSquare, Send } from "lucide-react";
import TopBar from "@/components/home/TopBar";
import Header from "@/components/home/Header";

const WHATSAPP_NUMBER = "818037237007";

const INTEREST_OPTIONS = [
  "Live auction",
  "HP stock",
  "Other",
] as const;

export default function InquiryPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] =
    useState<(typeof INTEREST_OPTIONS)[number]>("Live auction");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const body = [
      `SAS3 Inquiry`,
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      `Phone: ${phone.trim() || "—"}`,
      `Interest: ${interest}`,
      ``,
      message.trim(),
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-[#FAFAFC] text-zinc-900">
      <TopBar />
      <Header />

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 transition hover:text-red-600"
        >
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-red-700">
            <MessageSquare size={13} />
            Contact SAS3
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900">
            Send an inquiry
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Tell us what you need — live auction bidding, HP stock, or custom
            sourcing. We&apos;ll open WhatsApp with your message so our Tokyo
            desk can reply quickly.
          </p>

          {sent ? (
            <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
              <p className="mt-3 text-base font-bold text-emerald-900">
                WhatsApp opened with your inquiry
              </p>
              <p className="mt-1 text-sm text-emerald-800/80">
                If the chat didn&apos;t open,{" "}
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold underline"
                >
                  tap here to message us
                </a>
                .
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-4 text-sm font-semibold text-emerald-900 underline-offset-2 hover:underline"
              >
                Send another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <Field label="Full name" required>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium outline-none ring-red-500/30 focus:bg-white focus:ring-2"
                  placeholder="Your name"
                />
              </Field>
              <Field label="Email" required>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium outline-none ring-red-500/30 focus:bg-white focus:ring-2"
                  placeholder="you@company.com"
                />
              </Field>
              <Field label="Phone / WhatsApp">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium outline-none ring-red-500/30 focus:bg-white focus:ring-2"
                  placeholder="+1 …"
                />
              </Field>
              <Field label="I am interested in" required>
                <select
                  value={interest}
                  onChange={(e) =>
                    setInterest(
                      e.target.value as (typeof INTEREST_OPTIONS)[number],
                    )
                  }
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium outline-none ring-red-500/30 focus:bg-white focus:ring-2"
                >
                  {INTEREST_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Message" required>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-y rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm font-medium outline-none ring-red-500/30 focus:bg-white focus:ring-2"
                  placeholder="Lot numbers, budget, destination port, timeline…"
                />
              </Field>
              <button
                type="submit"
                className="red-gradient-btn inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-xs font-extrabold tracking-wider"
              >
                <Send size={15} />
                Send via WhatsApp
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-zinc-500">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
