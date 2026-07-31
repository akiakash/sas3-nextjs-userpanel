"use client";

import { useState } from "react";
import { X, Calculator, ChevronRight } from "lucide-react";

const PORT_RATES: Record<string, { port: string; country: string; roroFreight: number; containerFreight: number; approxDutyPct: number }> = {
  mombasa: { port: "Mombasa", country: "Kenya 🇰🇪", roroFreight: 1450, containerFreight: 1850, approxDutyPct: 35 },
  kingston: { port: "Kingston", country: "Jamaica 🇯🇲", roroFreight: 1650, containerFreight: 2100, approxDutyPct: 40 },
  auckland: { port: "Auckland", country: "New Zealand 🇳🇿", roroFreight: 1100, containerFreight: 1400, approxDutyPct: 15 },
  durban: { port: "Durban", country: "South Africa 🇿🇦", roroFreight: 1300, containerFreight: 1700, approxDutyPct: 25 },
  colombo: { port: "Colombo", country: "Sri Lanka 🇱🇰", roroFreight: 1250, containerFreight: 1600, approxDutyPct: 50 },
  dar: { port: "Dar es Salaam", country: "Tanzania 🇹🇿", roroFreight: 1400, containerFreight: 1800, approxDutyPct: 30 },
  klang: { port: "Port Klang", country: "Malaysia 🇲🇾", roroFreight: 950, containerFreight: 1250, approxDutyPct: 20 },
  dubai: { port: "Jebel Ali / Dubai", country: "UAE 🇦🇪", roroFreight: 850, containerFreight: 1150, approxDutyPct: 5 },
};

type CifCalculatorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialFob?: number;
  carName?: string;
};

export default function CifCalculatorModal({
  isOpen,
  onClose,
  initialFob = 25000,
  carName = "Selected Vehicle",
}: CifCalculatorModalProps) {
  const [fobPrice, setFobPrice] = useState<number>(initialFob);
  const [selectedPortKey, setSelectedPortKey] = useState<string>("mombasa");
  const [shipType, setShipType] = useState<"roro" | "container">("roro");
  const [includeMarineInsurance, setIncludeMarineInsurance] = useState<boolean>(true);

  if (!isOpen) return null;

  const portData = PORT_RATES[selectedPortKey] || PORT_RATES["mombasa"];
  const oceanFreight = shipType === "roro" ? portData.roroFreight : portData.containerFreight;
  const inspectionFee = 250;
  const insuranceFee = includeMarineInsurance ? Math.max(150, Math.round(fobPrice * 0.008)) : 0;
  const systemFee = 450;

  const cifTotal = fobPrice + oceanFreight + inspectionFee + insuranceFee + systemFee;
  const estimatedDuty = Math.round(cifTotal * (portData.approxDutyPct / 100));
  const estimatedLandedTotal = cifTotal + estimatedDuty;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 p-4 sm:p-6 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white text-zinc-900 shadow-2xl overflow-hidden my-auto animate-fade-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100 font-bold">
              <Calculator size={20} />
            </span>
            <div>
              <h3 className="font-extrabold tracking-wide text-zinc-900 text-base">CIF & LANDED COST CALCULATOR</h3>
              <p className="text-xs text-zinc-500 font-medium">Instant Estimate for Shipping to Your Destination Port</p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200/60 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Target Vehicle Summary */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 flex items-center justify-between text-xs font-semibold">
            <span className="text-zinc-600">Target Car: <strong className="text-zinc-900">{carName}</strong></span>
            <span className="text-red-600 font-mono font-black text-sm">FOB: US$ {fobPrice.toLocaleString()}</span>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-extrabold uppercase text-zinc-700">
                FOB Vehicle Price (US$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-zinc-400">$</span>
                <input
                  type="number"
                  value={fobPrice}
                  onChange={(e) => setFobPrice(Number(e.target.value))}
                  className="glass-input pl-8 font-mono text-sm font-bold text-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-extrabold uppercase text-zinc-700">
                Destination Port
              </label>
              <select
                value={selectedPortKey}
                onChange={(e) => setSelectedPortKey(e.target.value)}
                className="glass-input font-bold"
              >
                {Object.entries(PORT_RATES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.country} - {val.port}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-extrabold uppercase text-zinc-700">
                Shipping Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShipType("roro")}
                  className={`rounded-xl py-2.5 text-xs font-bold border transition ${
                    shipType === "roro"
                      ? "border-red-600 bg-red-50 text-red-600"
                      : "border-zinc-200 bg-zinc-50 text-zinc-600"
                  }`}
                >
                  RoRo (Standard)
                </button>
                <button
                  type="button"
                  onClick={() => setShipType("container")}
                  className={`rounded-xl py-2.5 text-xs font-bold border transition ${
                    shipType === "container"
                      ? "border-red-600 bg-red-50 text-red-600"
                      : "border-zinc-200 bg-zinc-50 text-zinc-600"
                  }`}
                >
                  Container (Protected)
                </button>
              </div>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-zinc-200 bg-zinc-50 p-3 w-full text-xs text-zinc-700">
                <input
                  type="checkbox"
                  checked={includeMarineInsurance}
                  onChange={(e) => setIncludeMarineInsurance(e.target.checked)}
                  className="rounded border-zinc-300 text-red-600 focus:ring-red-500 h-4 w-4"
                />
                <span className="font-bold">Include Marine Insurance Coverage</span>
              </label>
            </div>
          </div>

          {/* Breakdown Calculation Output Table */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-red-600 flex items-center justify-between">
              <span>CIF COST BREAKDOWN ({portData.port.toUpperCase()})</span>
              <span className="font-mono text-zinc-900 text-base">US$ {cifTotal.toLocaleString()}</span>
            </h4>

            <div className="space-y-2 text-xs divide-y divide-zinc-200">
              <div className="flex justify-between py-1 text-zinc-700">
                <span>1. Vehicle Winning Bid / Price (FOB)</span>
                <span className="font-mono font-semibold">US$ {fobPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-zinc-700">
                <span>2. Ocean Freight ({shipType.toUpperCase()} to {portData.port})</span>
                <span className="font-mono font-semibold">US$ {oceanFreight.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-zinc-700">
                <span>3. Pre-Export Inspection (JAA / QISJ)</span>
                <span className="font-mono font-semibold">US$ {inspectionFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-zinc-700">
                <span>4. Full Marine Transit Insurance</span>
                <span className="font-mono font-semibold">US$ {insuranceFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 text-zinc-700">
                <span>5. SAS3 Export Handling Fee</span>
                <span className="font-mono font-semibold">US$ {systemFee.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-3 flex flex-wrap items-center justify-between text-xs">
              <div>
                <div className="font-extrabold text-zinc-900">Estimated Landed Cost (Duty Incl. ~{portData.approxDutyPct}%)</div>
                <div className="text-[11px] text-zinc-500 font-medium">Local customs assessment applies</div>
              </div>
              <div className="font-mono text-xl font-black text-red-600">
                ~ US$ {estimatedLandedTotal.toLocaleString()}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="red-gradient-btn w-full rounded-xl py-3 font-bold shadow-lg"
          >
            CONFIRM & REQUEST FORMAL CIF QUOTE
          </button>
        </div>
      </div>
    </div>
  );
}
