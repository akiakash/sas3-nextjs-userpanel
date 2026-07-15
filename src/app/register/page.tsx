"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Globe, Phone, Lock, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/layout/site-nav";
import { useAuth } from "@/contexts/auth-context";
import { ApiError } from "@/lib/api-client";

function Register() {
  const router = useRouter();
  const { register } = useAuth();

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

  const handleRegister = async (e: React.FormEvent) => {
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

    if (password.length < 8) {
      toast.error("Weak password", {
        description: "Password must be at least 8 characters.",
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

    try {
      const result = await register({
        title,
        name,
        country,
        telephone,
        email,
        password,
      });
      toast.success("Access request submitted!", {
        description: `Your customer reference is ${result.referenceCode}. An admin will review your application.`,
      });
      router.push("/login");
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        toast.error("Email or phone already registered", {
          description: "Please sign in or use different contact details.",
        });
      } else if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-b from-zinc-50 via-white to-zinc-100 text-zinc-900">
      <SiteNav activeAuth="register" />

      <main className="mx-auto flex w-full min-w-0 max-w-4xl flex-1 flex-col justify-center px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-lg backdrop-blur-xl sm:p-8 md:p-10 lg:p-12">
          <div className="absolute inset-x-0 top-0 mx-auto h-[3.5px] w-[90%] rounded-b bg-brand-red" />

          <div className="border-b border-zinc-100 pb-6 text-center sm:pb-8">
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">
              Create  Account
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Fill in your details below to apply for  portal access.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleRegister}
            className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 md:grid-cols-2 md:gap-x-6 md:gap-y-5"
          >
            {/* Title Selection */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                Title
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {["Mr.", "Mrs.", "Ms.", "Company"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTitle(t)}
                    className={`min-w-[4.5rem] flex-1 rounded-xl border px-3 py-2.5 text-xs font-semibold tracking-tight transition sm:min-w-0 sm:flex-initial sm:flex-1 ${
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
            <div className="space-y-2 md:col-span-2">
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
                  placeholder="Enter your full name"
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
                  placeholder="Enter phone with country code"
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
                  placeholder="you@company.com"
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
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-xl border border-zinc-200 bg-white pl-10.5 pr-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/5 shadow-sm"
                />
              </div>
            </div>

            {/* Captcha Verification Widget */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                Security Verification
              </label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                {/* Distorted Captcha Block */}
                <div className="relative flex h-11 w-full select-none items-center justify-center overflow-hidden rounded-xl border border-dashed border-red-300 bg-red-50/30 text-sm font-black tracking-widest text-red-700 shadow-inner sm:w-40 sm:shrink-0 md:w-48">
                  {/* Distorted noise lines */}
                  <div className="absolute inset-0 skew-x-12 bg-gradient-to-r from-transparent via-red-950 to-transparent opacity-5" />
                  <div className="absolute left-1/4 h-full w-px rotate-45 bg-red-400/20" />
                  <div className="absolute right-1/4 h-full w-px -rotate-45 bg-red-400/20" />
                  <span className="relative pointer-events-none select-none text-md leading-none tracking-widest italic">
                    {captchaCode}
                  </span>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="absolute right-1.5 bottom-1 text-red-500 transition hover:text-red-700"
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
                  placeholder="Enter the code shown above"
                  className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-600/5"
                />
              </div>
            </div>

            {/* Submit Register */}
            <div className="md:col-span-2">
              <Button
                type="submit"
                disabled={loading}
                className="mt-2 w-full cursor-pointer rounded-xl border border-red-600 bg-red-600 py-5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-md transition-all duration-150 hover:bg-red-700 hover:shadow-lg active:translate-y-px sm:py-6 sm:tracking-[0.2em]"
              >
                {loading ? "Registering account..." : "Reqister"}
              </Button>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-zinc-500 sm:mt-8">
          Already have an importer account?{" "}
          <Link href="/login" className="font-bold text-red-600 hover:underline">
            Sign In
          </Link>
        </p>
      </main>

      <footer className="border-t border-zinc-200 bg-white/50 px-4 py-4 text-center text-[10px] font-semibold leading-relaxed text-zinc-400 backdrop-blur-sm sm:py-6">
        © 2026 SAS3 Trading Group. All accounts subject to commercial verification.
      </footer>
    </div>
  );
}

export default Register;
