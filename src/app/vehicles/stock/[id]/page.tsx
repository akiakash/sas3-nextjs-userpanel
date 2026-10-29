"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";
import { getPortalStock, type PortalStock } from "@/lib/portal-api";
import StockInquireModal from "@/components/customer/StockInquireModal";
import StockPhotoCollage from "@/components/home/StockPhotoCollage";

function formatYen(val: number | null | undefined) {
  if (val == null || !Number.isFinite(val) || val <= 0) return "Ask for price";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(val);
}

function formatYearMonth(
  year: number | null | undefined,
  month: number | null | undefined,
) {
  if (year == null) return null;
  if (month != null && month >= 1 && month <= 12) {
    return `${year} / ${String(month).padStart(2, "0")}`;
  }
  return String(year);
}

type SpecRow = { label: string; value: string };

function buildSpecs(stock: PortalStock): { main: SpecRow[]; important: SpecRow[] } {
  const yearMonth = formatYearMonth(
    stock.manufactureYear,
    stock.manufactureMonth,
  );

  const main: SpecRow[] = [
    { label: "Sale price", value: formatYen(stock.salePrice) },
    { label: "Stock #", value: stock.stockNumber || "" },
    { label: "Chassis", value: stock.chassisNumber?.trim() || "" },
    { label: "Year / month", value: yearMonth || "" },
    { label: "Make", value: stock.make?.trim() || "" },
    { label: "Model", value: stock.modelName?.trim() || "" },
  ].filter((row) => row.value.length > 0);

  const important: SpecRow[] = [
    { label: "Model code", value: stock.modelCode?.trim() || "" },
    { label: "Color", value: stock.color?.trim() || "" },
    {
      label: "Mileage",
      value:
        stock.mileageKm != null && Number.isFinite(stock.mileageKm)
          ? `${stock.mileageKm.toLocaleString()} km`
          : "",
    },
    { label: "Fuel", value: stock.fuelType?.trim() || "" },
    { label: "Transmission", value: stock.transmission?.trim() || "" },
  ].filter((row) => row.value.length > 0);

  return { main, important };
}

function SpecSection({ title, rows }: { title: string; rows: SpecRow[] }) {
  if (rows.length === 0) return null;
  return (
    <div>
      <h3 className="mb-3 text-xs font-extrabold uppercase tracking-widest text-zinc-400">
        {title}
      </h3>
      <dl className="grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2.5"
          >
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
              {row.label}
            </dt>
            <dd className="mt-0.5 text-sm font-bold text-zinc-900">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function StockDetailPage() {
  const params = useParams<{ id: string }>();
  const [stock, setStock] = useState<PortalStock | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void getPortalStock(params.id)
      .then((row) => {
        if (!cancelled) setStock(row);
      })
      .catch((error) => {
        if (!cancelled) {
          toast.error(
            error instanceof ApiError ? error.message : "Stock not found",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const specs = useMemo(
    () => (stock ? buildSpecs(stock) : { main: [], important: [] }),
    [stock],
  );

  if (loading) {
    return (
      <p className="flex items-center gap-2 p-6 text-sm text-zinc-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading stock…
      </p>
    );
  }

  if (!stock) {
    return (
      <div className="mx-auto max-w-[1400px] space-y-4 p-4 sm:p-6">
        <Link
          href="/#featured"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-red-600"
        >
          <ArrowLeft size={16} /> Back to Featured
        </Link>
        <p className="text-sm text-zinc-500">Stock vehicle not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 p-4 sm:p-6">
      <Link
        href="/#featured"
        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 transition hover:text-red-600"
      >
        <ArrowLeft size={16} /> Back to Featured
      </Link>

      <header className="flex flex-col gap-6 border-b border-zinc-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-widest text-red-600">
            HP Stock · Stock #{stock.stockNumber}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            {stock.vehicleTitle}
          </h1>
          {stock.chassisNumber ? (
            <p className="mt-2 text-sm text-zinc-500">
              Chassis {stock.chassisNumber}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-3 text-right">
            <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-400">
              Sale price
            </p>
            <p className="font-mono text-2xl font-black text-zinc-900">
              {formatYen(stock.salePrice)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="red-gradient-btn inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-extrabold tracking-wider"
          >
            <MessageSquare className="h-4 w-4" />
            Inquire / Negotiate
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-extrabold text-zinc-900">Photos</h2>
            {stock.photos.length > 0 ? (
              <span className="text-xs font-semibold text-zinc-400">
                {stock.photos.length} image
                {stock.photos.length === 1 ? "" : "s"}
              </span>
            ) : null}
          </div>
          <StockPhotoCollage urls={stock.photos} alt={stock.vehicleTitle} />
        </section>

        <section className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-sm font-extrabold text-zinc-900">
            Vehicle details
          </h2>
          <SpecSection title="Main details" rows={specs.main} />
          <SpecSection title="Important specs" rows={specs.important} />
          {specs.main.length === 0 && specs.important.length === 0 ? (
            <p className="text-sm text-zinc-500">No details available.</p>
          ) : null}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-3 text-sm font-bold text-white"
          >
            <MessageSquare className="h-4 w-4" />
            Inquire / Negotiate
          </button>
        </section>
      </div>

      <StockInquireModal
        stock={stock}
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
