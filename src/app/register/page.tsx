"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, User, Mail, Globe, Phone, Lock, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/layout/site-nav";
import { Sas3Logo } from "@/components/layout/sas3-logo";

function Register() {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState("Mr.");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("Japan");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Generate random Captcha Code
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXY3456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !telephone || !email || !password || !captchaInput) {
      toast.error("Please fill in all registration fields.");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Invalid email address", {
        description: "Please enter a valid commercial importer email.",
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Weak password", {
        description: "Password must be at least 6 characters.",
      });
      return;
    }

    if (captchaInput.toUpperCase() !== captchaCode) {
      toast.error("Invalid Captcha verification code.", {
        description: "Please check the letters and try again.",
      });
      generateCaptcha();
      setCaptchaInput("");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success("Account Created Successfully!", {
        description: "Welcome to SAS3 Trading! Please sign in with your credentials.",
      });
      router.push("/login");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-zinc-50 via-white to-zinc-100 text-zinc-900">
      <SiteNav activeAuth="register" />

      <main className="mx-auto flex w-full max-w-[540px] flex-1 flex-col px-4 py-10 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 p-8 shadow-lg backdrop-blur-xl sm:p-10">
          <div className="absolute inset-x-0 top-0 mx-auto h-[3.5px] w-[90%] rounded-b bg-brand-red" />

          <div className="text-center">
            <div className="mx-auto mb-4 flex justify-center">
              <Sas3Logo height={72} linkTo="/" />
            </div>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand-red/20 bg-brand-red/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              SAS3 Trading Ledger
            </div>
            <h1 className="mt-5 text-2xl font-black tracking-tight text-zinc-900">
              Importer Registration
            </h1>
            <p className="mt-2 text-xs text-zinc-500">
              Apply to join our elite dealer portal for private Japanese auctions.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="mt-8 space-y-4">
            {/* Title Selection */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                Title
              </label>
              <div className="flex gap-2.5">
                {["Mr.", "Mrs.", "Ms.", "Company"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTitle(t)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold tracking-tight transition ${
                      title === t
                        ? "border-red-600 bg-red-600 text-white font-bold"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dharshini Kumar"
                  className="w-full rounded-xl border border-zinc-200 bg-white pl-10.5 pr-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/5 shadow-sm"
                />
              </div>
            </div>

            {/* Country Picker */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                Country
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-zinc-200 bg-white pl-10.5 pr-8 py-3 text-sm text-zinc-900 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/5 shadow-sm"
                >
                  <option>Japan</option>
                  <option>Sri Lanka</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>New Zealand</option>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Kenya</option>
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                  ▼
                </div>
              </div>
            </div>

            {/* Telephone Input */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                Telephone / Mobile
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="tel"
                  required
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  placeholder="+81 90-8841-2940"
                  className="w-full rounded-xl border border-zinc-200 bg-white pl-10.5 pr-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/5 shadow-sm"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                Email / Login ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="importer@xorcodes.com"
                  className="w-full rounded-xl border border-zinc-200 bg-white pl-10.5 pr-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/5 shadow-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-zinc-200 bg-white pl-10.5 pr-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/5 shadow-sm"
                />
              </div>
            </div>

            {/* Captcha Verification Widget */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                Security Verification
              </label>
              <div className="flex gap-3">
                {/* Distorted Captcha Block */}
                <div className="relative flex h-11 w-32 select-none items-center justify-center rounded-xl border border-dashed border-red-300 bg-red-50/30 overflow-hidden font-black tracking-widest text-red-700 text-sm shadow-inner shrink-0">
                  {/* Distorted noise lines */}
                  <div className="absolute inset-0 skew-x-12 opacity-5 bg-gradient-to-r from-transparent via-red-950 to-transparent" />
                  <div className="absolute left-1/4 h-full w-[1px] rotate-45 bg-red-400/20" />
                  <div className="absolute right-1/4 h-full w-[1px] -rotate-45 bg-red-400/20" />
                  <span className="relative select-none italic text-md pointer-events-none tracking-widest leading-none">
                    {captchaCode}
                  </span>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="absolute right-1.5 bottom-1 text-red-500 hover:text-red-700 transition"
                    title="Refresh Code"
                  >
                    <RotateCw className="h-3 w-3" />
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  placeholder="Type verification code"
                  className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/5 shadow-sm"
                />
              </div>
            </div>

            {/* Submit Register */}
            <Button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-red-600 hover:bg-red-700 py-6 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-md hover:shadow-lg active:translate-y-px transition-all duration-150 cursor-pointer border border-red-600"
            >
              {loading ? "Registering account..." : "Request Access"}
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-zinc-500">
          Already have an importer account?{" "}
          <Link href="/login" className="font-bold text-red-600 hover:underline">
            Sign In
          </Link>
        </p>
      </main>

      <footer className="border-t border-zinc-200 bg-white/50 py-6 text-center text-[10px] font-semibold text-zinc-400 backdrop-blur-sm">
        © 2026 SAS3 Trading Group. All accounts subject to commercial verification.
      </footer>
    </div>
  );
}

export default Register;
