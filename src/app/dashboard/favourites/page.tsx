"use client";

import React, { useMemo, useState } from "react";
import { Star, Trash2, MessageSquare, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { mockFavourites, Vehicle } from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formatUSD = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);

const inputClass =
  "h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 shadow-sm";

function FavouritesDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockFavourites);
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [modelCode, setModelCode] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [monthFrom, setMonthFrom] = useState("");
  const [monthTo, setMonthTo] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [mileageMin, setMileageMin] = useState("");
  const [mileageMax, setMileageMax] = useState("");
  const [engineCC, setEngineCC] = useState("");
  const [fuel, setFuel] = useState("All");
  const [color, setColor] = useState("");
  const [steering, setSteering] = useState("All");
  const [drivetrain, setDrivetrain] = useState("All");
  const [transmission, setTransmission] = useState("All");

  const filteredVehicles = useMemo(
    () =>
      vehicles.filter((car) => {
        if (make && !car.make.toLowerCase().includes(make.toLowerCase())) return false;
        if (model && !car.model.toLowerCase().includes(model.toLowerCase())) return false;
        if (modelCode && !car.modelCode.toLowerCase().includes(modelCode.toLowerCase())) return false;
        if (yearFrom && car.year < parseInt(yearFrom)) return false;
        if (yearTo && car.year > parseInt(yearTo)) return false;
        if (monthFrom && car.month < parseInt(monthFrom)) return false;
        if (monthTo && car.month > parseInt(monthTo)) return false;
        if (priceMin && car.price < parseInt(priceMin)) return false;
        if (priceMax && car.price > parseInt(priceMax)) return false;
        if (mileageMin && car.mileage < parseInt(mileageMin)) return false;
        if (mileageMax && car.mileage > parseInt(mileageMax)) return false;
        if (engineCC && car.engineCC !== parseInt(engineCC)) return false;
        if (fuel !== "All" && car.fuel !== fuel) return false;
        if (color && !car.color.toLowerCase().includes(color.toLowerCase())) return false;
        if (steering !== "All" && car.steering !== steering) return false;
        if (drivetrain !== "All" && car.drivetrain !== drivetrain) return false;
        if (transmission !== "All" && car.transmission !== transmission) return false;
        return true;
      }),
    [
      vehicles,
      make,
      model,
      modelCode,
      yearFrom,
      yearTo,
      monthFrom,
      monthTo,
      priceMin,
      priceMax,
      mileageMin,
      mileageMax,
      engineCC,
      fuel,
      color,
      steering,
      drivetrain,
      transmission,
    ]
  );

  const hasActiveFilters =
    make ||
    model ||
    modelCode ||
    yearFrom ||
    yearTo ||
    monthFrom ||
    monthTo ||
    priceMin ||
    priceMax ||
    mileageMin ||
    mileageMax ||
    engineCC ||
    fuel !== "All" ||
    color ||
    steering !== "All" ||
    drivetrain !== "All" ||
    transmission !== "All";

  const clearFilters = () => {
    setMake("");
    setModel("");
    setModelCode("");
    setYearFrom("");
    setYearTo("");
    setMonthFrom("");
    setMonthTo("");
    setPriceMin("");
    setPriceMax("");
    setMileageMin("");
    setMileageMax("");
    setEngineCC("");
    setFuel("All");
    setColor("");
    setSteering("All");
    setDrivetrain("All");
    setTransmission("All");
  };

  const handleDelete = (id: string, name: string) => {
    setVehicles((prev) => prev.filter((car) => car.id !== id));
    toast.success(`${name} removed from favourites.`);
  };

  const handleStartNegotiation = (name: string) => {
    toast.success(`Negotiation requested for ${name}`, {
      description: "Our commercial agent will initialize a chat shortly.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page intro */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Saved specifications
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-zinc-900">
            Favourites
          </h2>
          <p className="mt-2 max-w-xl text-sm text-zinc-600">
            Filter saved vehicles by specification. Matching results appear below.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Showing</p>
          <p className="text-xl font-black text-zinc-900">
            {filteredVehicles.length}
            <span className="text-sm font-semibold text-zinc-500"> / {vehicles.length}</span>
          </p>
        </div>
      </div>

      {/* Specification search — top panel */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 shadow-sm">
              <SlidersHorizontal className="h-4 w-4 text-brand-red" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Specification search</h3>
              <p className="text-xs text-zinc-500">Filter by make, model, year, price, and more</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs font-semibold text-zinc-600"
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Clear all
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              className="rounded-lg border-zinc-200 text-xs font-bold uppercase tracking-wide shadow-sm"
            >
              {filtersExpanded ? "Collapse" : "Expand"} filters
            </Button>
          </div>
        </div>

        {filtersExpanded && (
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <FilterField label="Make" value={make} onChange={setMake} placeholder="Toyota, Nissan…" />
            <FilterField label="Model" value={model} onChange={setModel} placeholder="Supra, Skyline…" />
            <FilterField label="Model code" value={modelCode} onChange={setModelCode} placeholder="GF-BNR34" />
            <FilterRange label="Year" from={yearFrom} to={yearTo} onFromChange={setYearFrom} onToChange={setYearTo} />
            <FilterRange label="Month" from={monthFrom} to={monthTo} onFromChange={setMonthFrom} onToChange={setMonthTo} />
            <FilterRange label="Price (USD)" from={priceMin} to={priceMax} onFromChange={setPriceMin} onToChange={setPriceMax} />
            <FilterRange label="Mileage (km)" from={mileageMin} to={mileageMax} onFromChange={setMileageMin} onToChange={setMileageMax} />
            <FilterField label="Engine CC" value={engineCC} onChange={setEngineCC} placeholder="2600" type="number" />
            <FilterSelect
              label="Fuel type"
              value={fuel}
              onChange={setFuel}
              options={[
                { value: "All", label: "All fuels" },
                { value: "Petrol", label: "Petrol" },
                { value: "Diesel", label: "Diesel" },
                { value: "Hybrid", label: "Hybrid" },
                { value: "Electric", label: "Electric" },
              ]}
            />
            <FilterField label="Exterior color" value={color} onChange={setColor} placeholder="Blue, White…" />
            <FilterSelect
              label="Steering"
              value={steering}
              onChange={setSteering}
              options={[
                { value: "All", label: "All" },
                { value: "Right", label: "Right hand" },
                { value: "Left", label: "Left hand" },
              ]}
            />
            <FilterSelect
              label="Drivetrain"
              value={drivetrain}
              onChange={setDrivetrain}
              options={[
                { value: "All", label: "All" },
                { value: "2WD", label: "2WD" },
                { value: "4WD", label: "4WD" },
                { value: "AWD", label: "AWD" },
              ]}
            />
            <FilterSelect
              label="Transmission"
              value={transmission}
              onChange={setTransmission}
              options={[
                { value: "All", label: "All" },
                { value: "Automatic", label: "Automatic" },
                { value: "Manual", label: "Manual" },
                { value: "CVT", label: "CVT" },
              ]}
            />
          </div>
        )}
      </div>

      {/* Results grid */}
      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
        {filteredVehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 py-16 text-center shadow-inner">
            <Star className="mb-3 h-12 w-12 text-zinc-300" />
            <h3 className="text-base font-bold text-zinc-800">No favourites match your filters</h3>
            <p className="mt-1 text-sm text-zinc-500">Adjust the search criteria above or clear all filters.</p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredVehicles.map((car) => (
              <article
                key={car.id}
                className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative h-44 w-full overflow-hidden border-b border-zinc-100">
                  <img
                    src={car.image}
                    alt={`${car.make} ${car.model}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-lg border border-zinc-700/30 bg-zinc-900/90 px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-sm">
                    #{car.id}
                  </span>
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg border border-brand-red/30 bg-brand-red px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                    <Sparkles className="h-3 w-3" />
                    Grade {car.grade}
                  </span>
                </div>

                <div className="space-y-4 p-4">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-zinc-500">
                      {car.year}/{car.month.toString().padStart(2, "0")} · {car.modelCode}
                    </span>
                    <h4 className="mt-1 text-sm font-black leading-tight text-zinc-900">
                      {car.make} {car.model}
                    </h4>
                    <p className="mt-0.5 text-xs text-zinc-500">{car.color}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 rounded-lg border border-zinc-100 bg-zinc-50 p-2.5 text-[11px] font-medium text-zinc-600">
                    <div>
                      Mileage:{" "}
                      <span className="font-bold text-zinc-900">{car.mileage.toLocaleString()} km</span>
                    </div>
                    <div>
                      Engine: <span className="font-bold text-zinc-900">{car.engineCC} cc</span>
                    </div>
                    <div>
                      Gearbox: <span className="font-bold text-zinc-900">{car.transmission}</span>
                    </div>
                    <div>
                      Fuel: <span className="font-bold text-zinc-900">{car.fuel}</span>
                    </div>
                    <div>
                      Steering: <span className="font-bold text-zinc-900">{car.steering}</span>
                    </div>
                    <div>
                      Drive: <span className="font-bold text-zinc-900">{car.drivetrain}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wide text-zinc-500">
                        List price
                      </span>
                      <span className="text-base font-black text-brand-red">{formatUSD(car.price)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDelete(car.id, `${car.make} ${car.model}`)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 shadow-sm transition hover:bg-rose-600 hover:text-white"
                        title="Remove from favourites"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <Button
                        onClick={() => handleStartNegotiation(`${car.make} ${car.model}`)}
                        className="h-9 rounded-lg bg-brand-red px-3 text-[10px] font-bold uppercase tracking-wide shadow-sm hover:bg-brand-redDark"
                      >
                        <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                        Negotiate
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FilterField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

function FilterRange({
  label,
  from,
  to,
  onFromChange,
  onToChange,
}: {
  label: string;
  from: string;
  to: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{label}</label>
      <div className="flex gap-2">
        <input
          type="number"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          placeholder="Min"
          className={inputClass}
        />
        <input
          type="number"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          placeholder="Max"
          className={inputClass}
        />
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputClass, "cursor-pointer")}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}


export default FavouritesDashboard;
