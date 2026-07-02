import React, { useMemo, useState } from "react";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  MessageSquare,
  Copy,
  ExternalLink,
  Gauge,
  Calendar,
  Car,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortfolioSeller, PortfolioProduct } from "@/lib/dummy-data";
import { InquiryDialog } from "@/components/portfolio/inquiry-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formatUSD = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);

function statusClass(status: PortfolioProduct["status"]) {
  const map = {
    Available: "bg-emerald-500/90 text-white shadow-sm",
    Reserved: "bg-amber-500/90 text-white shadow-sm",
    Sold: "bg-zinc-600/90 text-white shadow-sm",
  };
  return map[status];
}

const FILTER_TABS = ["All", "Available", "Reserved", "Sold"] as const;

type PortfolioViewProps = {
  seller: PortfolioSeller;
  ownerMode?: boolean;
};

export function PortfolioView({ seller, ownerMode }: PortfolioViewProps) {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PortfolioProduct | null>(null);
  const [statusFilter, setStatusFilter] = useState<(typeof FILTER_TABS)[number]>("All");

  const portfolioUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/portfolio/${seller.id}`
      : `/portfolio/${seller.id}`;

  const openInquiry = (product: PortfolioProduct | null) => {
    setSelectedProduct(product);
    setInquiryOpen(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(portfolioUrl);
    toast.success("Portfolio link copied to clipboard");
  };

  const counts = useMemo(() => {
    const c = { All: seller.products.length, Available: 0, Reserved: 0, Sold: 0 };
    for (const p of seller.products) {
      c[p.status]++;
    }
    return c;
  }, [seller.products]);

  const filteredProducts = useMemo(
    () =>
      statusFilter === "All"
        ? seller.products
        : seller.products.filter((p) => p.status === statusFilter),
    [seller.products, statusFilter]
  );

  const initials = seller.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <>
      {/* Profile hero */}
      <section className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=1200&auto=format&fit=crop&q=40')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />

        <div className="relative px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-2 border-white/20 bg-brand-red text-3xl font-black text-white shadow-xl ring-4 ring-white/10">
                {initials}
              </div>
              <div className="min-w-0 text-white">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{seller.name}</h1>
                  {seller.verified && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300 backdrop-blur-sm">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified importer
                    </span>
                  )}
                </div>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-brand-red">
                  <Award className="h-4 w-4" />
                  {seller.title}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-zinc-300">
                  <Building2 className="h-4 w-4 shrink-0" />
                  {seller.company}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {seller.city}, {seller.country}
                </p>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => openInquiry(null)}
              className="w-full shrink-0 rounded-xl bg-brand-red px-8 shadow-lg shadow-brand-red/25 hover:bg-brand-redDark sm:w-auto"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Contact importer
            </Button>
          </div>

          <p className="relative mt-6 max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            {seller.bio}
          </p>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Total listings" value={String(seller.products.length)} />
            <StatCard label="Available now" value={String(counts.Available)} accent />
            <StatCard label="Member since" value={seller.memberSince} />
            <StatCard label="Response" value="< 2 hrs" />
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-wrap gap-4 text-sm text-zinc-600">
          <a
            href={`mailto:${seller.email}`}
            className="flex items-center gap-2 font-medium transition hover:text-brand-red"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100">
              <Mail className="h-4 w-4 text-zinc-600" />
            </span>
            {seller.email}
          </a>
          <a
            href={`tel:${seller.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 font-medium transition hover:text-brand-red"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100">
              <Phone className="h-4 w-4 text-zinc-600" />
            </span>
            {seller.phone}
          </a>
        </div>
        {ownerMode && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={copyLink} className="rounded-lg">
              <Copy className="mr-1.5 h-3.5 w-3.5" />
              Copy link
            </Button>
            <Button variant="outline" size="sm" asChild className="rounded-lg">
              <a href={`/portfolio/${seller.id}`} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Preview
              </a>
            </Button>
          </div>
        )}
      </div>

      {ownerMode && (
        <p className="mt-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-2.5 font-mono text-xs text-zinc-500">
          Public URL: {portfolioUrl}
        </p>
      )}

      {/* Inventory */}
      <section className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-black text-zinc-900">
              <Car className="h-6 w-6 text-brand-red" />
              Vehicle inventory
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Browse listed stock and send an inquiry for pricing, inspection, or shipping.
            </p>
          </div>
        </div>

        {/* Status filters */}
        <div className="mt-5 flex flex-wrap gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition",
                statusFilter === tab
                  ? "border-brand-red bg-brand-red text-white shadow-sm"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
              )}
            >
              {tab}
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                  statusFilter === tab ? "bg-white/20" : "bg-zinc-100 text-zinc-600"
                )}
              >
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/80 py-16 text-center">
            <Car className="mx-auto h-10 w-10 text-zinc-300" />
            <p className="mt-3 font-semibold text-zinc-700">No vehicles in this category</p>
            <p className="mt-1 text-sm text-zinc-500">Try another filter or send a general inquiry.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => openInquiry(null)}
            >
              General inquiry
            </Button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onInquire={() => openInquiry(product)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trust footer CTA */}
      {!ownerMode && (
        <section className="mt-12 rounded-2xl border border-zinc-200 bg-gradient-to-r from-zinc-900 to-zinc-800 p-8 text-center text-white shadow-lg sm:p-10">
          <h3 className="text-xl font-bold">Interested in multiple vehicles?</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
            Send one message to {seller.name} and our team will coordinate inspections, quotes,
            and export logistics.
          </p>
          <Button
            size="lg"
            className="mt-6 rounded-xl bg-brand-red hover:bg-brand-redDark"
            onClick={() => openInquiry(null)}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Start a conversation
          </Button>
        </section>
      )}

      <InquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        seller={seller}
        product={selectedProduct}
      />
    </>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{label}</p>
      <p className={cn("mt-0.5 text-xl font-black", accent ? "text-brand-red" : "text-white")}>
        {value}
      </p>
    </div>
  );
}

function ProductCard({
  product,
  onInquire,
}: {
  product: PortfolioProduct;
  onInquire: () => void;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        <span
          className={cn(
            "absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide",
            statusClass(product.status)
          )}
        >
          {product.status}
        </span>
        <span className="absolute left-3 top-3 rounded-lg border border-white/20 bg-black/70 px-2.5 py-1 font-mono text-[10px] font-bold text-white backdrop-blur-sm">
          {product.id}
        </span>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {product.year}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {product.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5" />
            {product.mileage.toLocaleString()} km
          </span>
        </div>

        <h3 className="mt-3 text-lg font-black leading-snug text-zinc-900 group-hover:text-brand-red transition-colors">
          {product.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600">
          {product.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-zinc-100 pt-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">List price</p>
            <p className="text-2xl font-black text-brand-red">{formatUSD(product.price)}</p>
          </div>
          <Button
            disabled={product.status === "Sold"}
            onClick={onInquire}
            className="rounded-xl bg-zinc-900 px-5 hover:bg-brand-red disabled:opacity-40"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Inquire
          </Button>
        </div>
      </div>
    </article>
  );
}
