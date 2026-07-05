"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { User, Building2, ShieldCheck, Mail, Phone, Lock, Save, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { mockProfile } from "@/lib/dummy-data";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { updateProfile } from "@/lib/auth-api";
import { ApiError } from "@/lib/api-client";

function ProfileDashboard() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(mockProfile);
  const [password, setPassword] = useState("••••••••");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        title: user.title,
        name: user.fullName,
        country: user.country,
        email: user.email,
        telMobile: user.phone,
      }));
    }
  }, [user]);

  // Field change handler
  const handleChange = (key: keyof typeof mockProfile, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
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
      toast.success("Profile Updated Successfully!", {
        description: "Your importer ledger records have been securely synced.",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const labelCls = "block text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--ink)]/55 dark:text-zinc-400";
  const inputCls = "w-full rounded-xl border border-white/20 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 px-4 py-2.5 text-xs font-semibold outline-none transition focus:border-[var(--brand)] dark:text-white disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Profile Overview Card Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 p-6 backdrop-blur-xl flex flex-col sm:flex-row items-center gap-6">
        <div className="flex h-20 w-20 shrink-0 select-none items-center justify-center rounded-full bg-[var(--brand)] text-white text-3xl font-black shadow-md border-4 border-white/30">
          DK
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-black text-[var(--ink)] dark:text-white leading-none">
            {profile.title} {profile.name}
          </h2>
          <p className="mt-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            {profile.company} · Importer Ledger ID: <span className="font-mono font-bold text-[var(--brand)]">SAS3-DK-2026</span>
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Commercial Status Verified
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
          onClick={() => setIsEditing(!isEditing)}
          className={`h-10 px-5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
            isEditing
              ? "border border-rose-500/20 bg-rose-500/10 text-rose-600 hover:bg-rose-500/25"
              : "bg-gradient-to-b from-[var(--brand)] to-[var(--brand-dark)] text-white hover:brightness-110"
          }`}
        >
          {isEditing ? "Cancel Editing" : "Modify Credentials"}
        </button>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-xl border border-white/20 dark:border-white/10 bg-white/20 dark:bg-zinc-950/20 p-1.5 backdrop-blur-sm">
            <TabsTrigger value="personal" className="rounded-lg text-xs font-black uppercase tracking-wider py-2">
              Personal Contacts
            </TabsTrigger>
            <TabsTrigger value="company" className="rounded-lg text-xs font-black uppercase tracking-wider py-2">
              Corporate Details
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg text-xs font-black uppercase tracking-wider py-2">
              Securities & Subscriptions
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Personal Contacts */}
          <TabsContent value="personal" className="mt-4 focus-visible:outline-none">
            <div className="rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 p-6 backdrop-blur-xl grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Title Pick */}
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

              {/* Name */}
              <div className="space-y-2">
                <label className={labelCls}>Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className={labelCls}>Email Address</label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={profile.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Mobile Phone */}
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

              {/* Fax */}
              <div className="space-y-2">
                <label className={labelCls}>Fax Number</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.fax}
                  onChange={(e) => handleChange("fax", e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Skype */}
              <div className="space-y-2">
                <label className={labelCls}>Skype ID</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.skype}
                  onChange={(e) => handleChange("skype", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: Corporate & Address */}
          <TabsContent value="company" className="mt-4 focus-visible:outline-none">
            <div className="rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 p-6 backdrop-blur-xl grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Company Name */}
              <div className="space-y-2 sm:col-span-2">
                <label className={labelCls}>Company Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Address */}
              <div className="space-y-2 sm:col-span-2">
                <label className={labelCls}>Address</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className={labelCls}>City</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Province */}
              <div className="space-y-2">
                <label className={labelCls}>Province / State</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.province}
                  onChange={(e) => handleChange("province", e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Post Code */}
              <div className="space-y-2">
                <label className={labelCls}>Post Code</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.postCode}
                  onChange={(e) => handleChange("postCode", e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
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

          {/* TAB 3: Security & Subscriptions */}
          <TabsContent value="security" className="mt-4 focus-visible:outline-none">
            <div className="rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 p-6 backdrop-blur-xl space-y-6">
              {/* Password change */}
              <div className="space-y-2 max-w-sm">
                <label className={labelCls}>Console Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="password"
                    disabled={!isEditing}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/20 dark:border-white/10 bg-white dark:bg-zinc-900/60 pl-10 pr-4 py-2.5 text-xs font-semibold outline-none focus:border-[var(--brand)] disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="h-px bg-white/25" />

              {/* Newsletter Subscription checkbox */}
              <div className="space-y-2">
                <label className={labelCls}>Ledger Notifications & Subscriptions</label>
                <div className="mt-3 flex items-start gap-3">
                  <Checkbox
                    id="newsletter"
                    disabled={!isEditing}
                    checked={profile.newsletterSubscription}
                    onCheckedChange={(checked) => handleChange("newsletterSubscription", checked === true)}
                    className="mt-0.5 cursor-pointer disabled:opacity-50"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="newsletter"
                      className="text-xs font-bold text-[var(--ink)] dark:text-zinc-200 cursor-pointer"
                    >
                      Subscribe to SAS3 Newsletter
                    </label>
                    <p className="text-[10px] text-zinc-400">
                      Receive JDM auction forecasts, USS Tokyo loop notifications, and freight updates weekly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save button */}
        {isEditing && (
          <div className="flex justify-end animate-in fade-in slide-in-from-bottom-1 duration-150">
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-b from-[var(--brand)] to-[var(--brand-dark)] text-white text-xs font-bold uppercase tracking-wider h-11 px-6 shadow-md hover:brightness-110 active:translate-y-px transition duration-150 cursor-pointer"
            >
              <Save className="mr-2 h-4.5 w-4.5" />
              {loading ? "Saving Changes..." : "Save Settings"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

export default ProfileDashboard;
