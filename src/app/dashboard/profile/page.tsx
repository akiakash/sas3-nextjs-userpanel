"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Lock, Save, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { updateProfile } from "@/lib/auth-api";
import { ApiError } from "@/lib/api-client";

type ProfileForm = {
  title: string;
  name: string;
  country: string;
  email: string;
  telMobile: string;
};

function ProfileDashboard() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<ProfileForm>({
    title: "Mr.",
    name: "",
    country: "",
    email: "",
    telMobile: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setProfile({
      title: user.title || "Mr.",
      name: user.fullName || "",
      country: user.country || "",
      email: user.email || "",
      telMobile: user.phone || "",
    });
  }, [user]);

  const initials = useMemo(() => {
    const parts = profile.name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "—";
    return parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");
  }, [profile.name]);

  const statusLabel =
    user?.status === "permitted"
      ? "Account permitted"
      : user?.status === "blocked"
        ? "Account blocked"
        : "Pending approval";

  const handleChange = (key: keyof ProfileForm, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        title: profile.title,
        name: profile.name,
        country: profile.country,
        telephone: profile.telMobile,
      });
      await refreshUser();
      setIsEditing(false);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Failed to update profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const labelCls =
    "block text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--ink)]/55 dark:text-zinc-400";
  const inputCls =
    "w-full rounded-xl border border-white/20 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 px-4 py-2.5 text-xs font-semibold outline-none transition focus:border-[var(--brand)] dark:text-white disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl border border-white/20 bg-white/40 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40 sm:flex-row">
        <div className="flex h-20 w-20 shrink-0 select-none items-center justify-center rounded-full border-4 border-white/30 bg-[var(--brand)] text-2xl font-black text-white shadow-md">
          {initials}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-black leading-none text-[var(--ink)] dark:text-white">
            {profile.title} {profile.name}
          </h2>
          <p className="mt-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            {profile.email || "—"} · Customer reference:{" "}
            <span className="font-mono font-bold text-[var(--brand)]">
              {user?.referenceCode ?? "—"}
            </span>
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" /> {statusLabel}
            </span>
            <Link
              href="/dashboard/portfolio"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-700 hover:border-brand-red hover:text-brand-red"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View portfolio
            </Link>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`h-10 rounded-xl px-5 text-xs font-bold uppercase tracking-wider transition ${
            isEditing
              ? "border border-rose-500/20 bg-rose-500/10 text-rose-600 hover:bg-rose-500/25"
              : "bg-gradient-to-b from-[var(--brand)] to-[var(--brand-dark)] text-white hover:brightness-110"
          }`}
        >
          {isEditing ? "Cancel Editing" : "Edit Profile"}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-xl border border-white/20 bg-white/20 p-1.5 backdrop-blur-sm dark:border-white/10 dark:bg-zinc-950/20">
            <TabsTrigger
              value="personal"
              className="rounded-lg py-2 text-xs font-black uppercase tracking-wider"
            >
              Personal Contacts
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-lg py-2 text-xs font-black uppercase tracking-wider"
            >
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-4 focus-visible:outline-none">
            <div className="grid grid-cols-1 gap-5 rounded-2xl border border-white/20 bg-white/40 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40 sm:grid-cols-2">
              <div className="space-y-2">
                <label className={labelCls}>Title</label>
                <select
                  disabled={!isEditing}
                  value={profile.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className={inputCls}
                >
                  <option>Mr.</option>
                  <option>Mrs.</option>
                  <option>Ms.</option>
                  <option>Dr.</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className={labelCls}>Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={inputCls}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className={labelCls}>Email Address</label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className={inputCls}
                />
                <p className="text-[10px] text-zinc-400">
                  Email is managed by SAS3 support and cannot be changed here.
                </p>
              </div>

              <div className="space-y-2">
                <label className={labelCls}>Tel / Mobile</label>
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={profile.telMobile}
                  onChange={(e) => handleChange("telMobile", e.target.value)}
                  className={inputCls}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className={labelCls}>Country</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-4 focus-visible:outline-none">
            <div className="space-y-4 rounded-2xl border border-white/20 bg-white/40 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40">
              <div className="flex items-start gap-3 rounded-xl border border-zinc-200/60 bg-white/50 p-4 dark:border-zinc-700 dark:bg-zinc-950/40">
                <Lock className="mt-0.5 h-4 w-4 text-zinc-400" />
                <div>
                  <p className="text-xs font-bold text-[var(--ink)] dark:text-zinc-200">
                    Password changes
                  </p>
                  <p className="mt-1 text-[10px] text-zinc-400">
                    Contact SAS3 support to reset your console password.
                  </p>
                </div>
              </div>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className={labelCls}>Reference code</dt>
                  <dd className="mt-1 font-mono font-bold">
                    {user?.referenceCode ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className={labelCls}>Status</dt>
                  <dd className="mt-1 font-semibold capitalize">
                    {user?.status ?? "—"}
                  </dd>
                </div>
              </dl>
            </div>
          </TabsContent>
        </Tabs>

        {isEditing && (
          <div className="flex justify-end animate-in fade-in slide-in-from-bottom-1 duration-150">
            <Button
              type="submit"
              disabled={loading}
              className="h-11 rounded-xl bg-gradient-to-b from-[var(--brand)] to-[var(--brand-dark)] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md transition duration-150 hover:brightness-110 active:translate-y-px"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving…" : "Save Settings"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

export default ProfileDashboard;
