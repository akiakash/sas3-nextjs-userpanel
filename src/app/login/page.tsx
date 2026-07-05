"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/layout/site-nav";
import { Sas3Logo } from "@/components/layout/sas3-logo";
import { useAuth } from "@/contexts/auth-context";
import { ApiError } from "@/lib/api-client";

function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Invalid email format", {
        description: "Please enter a valid commercial importer email.",
      });
      return;
    }

    setLoading(true);

    try {
      const user = await login({ email, password });
      toast.success(`Welcome back, ${user.fullName}!`, {
        description: "Redirecting to your Operations Center...",
      });
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 403) {
          toast.error("Access not available", {
            description: error.message,
          });
        } else if (error.status === 401) {
          toast.error("Invalid email or password", {
            description: "Please check your credentials and try again.",
          });
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-zinc-50 via-white to-zinc-100 text-zinc-900">
      <SiteNav activeAuth="login" />

      <main className="mx-auto flex w-full max-w-[460px] flex-1 flex-col justify-center px-4 py-10 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/70 p-8 shadow-lg backdrop-blur-xl sm:p-10">
          <div className="absolute inset-x-0 top-0 mx-auto h-[3.5px] w-[90%] rounded-b bg-brand-red" />

          <div className="text-center">
            <div className="mx-auto mb-4 flex justify-center">
              <Sas3Logo height={72} linkTo="/" />
            </div>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand-red/20 bg-brand-red/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure Console Access
            </div>
            <h1 className="mt-5 text-2xl font-black tracking-tight text-zinc-900">Welcome Back</h1>
            <p className="mt-2 text-xs text-zinc-500">
              Enter your credentials below to access your auction operations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                Email / Login ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="importer@xorcodes.com"
                  className="w-full rounded-xl border border-zinc-200 bg-white/80 py-3 pl-10 pr-4 text-sm text-zinc-900 shadow-sm outline-none backdrop-blur-sm transition placeholder:text-zinc-400 focus:border-brand-red focus:ring-4 focus:ring-brand-red/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  Password
                </label>
                <a
                  href="#"
                  className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 transition hover:text-brand-red"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-zinc-200 bg-white/80 py-3 pl-10 pr-10 text-sm text-zinc-900 shadow-sm outline-none backdrop-blur-sm transition placeholder:text-zinc-400 focus:border-brand-red focus:ring-4 focus:ring-brand-red/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-brand-red"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50/80 p-3 text-[10px] font-medium leading-normal text-zinc-500 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 shrink-0 text-brand-red" />
              <span>Sign in with your registered importer email and password.</span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-xl border border-brand-red bg-brand-red py-6 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-md transition-all duration-150 hover:bg-brand-redDark active:translate-y-px"
            >
              {loading ? "Authenticating..." : "Login to Dashboard"}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-zinc-500">
          Don&apos;t have an importer account?{" "}
          <Link href="/register" className="font-bold text-brand-red hover:underline">
            Register Here
          </Link>
        </p>
      </main>

      <footer className="border-t border-zinc-200 bg-white/50 py-6 text-center text-[10px] font-semibold text-zinc-400 backdrop-blur-sm">
        © 2026 SAS3 Trading Group. Secured bank-grade importer console.
      </footer>
    </div>
  );
}


export default Login;
