"use client";

import { useState } from "react";
import type { SearchParams } from "@/types/travel";

interface Props {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
}

const AIRPORT_OPTIONS = [
  { code: "CDG", label: "Paris (CDG)" },
  { code: "LHR", label: "London (LHR)" },
  { code: "AMS", label: "Amsterdam (AMS)" },
  { code: "MAD", label: "Madrid (MAD)" },
  { code: "FCO", label: "Rome (FCO)" },
  { code: "BER", label: "Berlin (BER)" },
  { code: "ZRH", label: "Zurich (ZRH)" },
  { code: "BCN", label: "Barcelona (BCN)" },
  { code: "LIS", label: "Lisbon (LIS)" },
  { code: "DXB", label: "Dubai (DXB)" },
  { code: "JFK", label: "New York (JFK)" },
  { code: "BKK", label: "Bangkok (BKK)" },
];

const DESTINATION_COUNTRIES = [
  { code: "italy", label: "Italy", flag: "🇮🇹" },
  { code: "greece", label: "Greece", flag: "🇬🇷" },
  { code: "portugal", label: "Portugal", flag: "🇵🇹" },
  { code: "spain", label: "Spain", flag: "🇪🇸" },
  { code: "france", label: "France", flag: "🇫🇷" },
  { code: "netherlands", label: "Netherlands", flag: "🇳🇱" },
  { code: "czech", label: "Czech Rep.", flag: "🇨🇿" },
  { code: "hungary", label: "Hungary", flag: "🇭🇺" },
  { code: "austria", label: "Austria", flag: "🇦🇹" },
  { code: "poland", label: "Poland", flag: "🇵🇱" },
  { code: "ireland", label: "Ireland", flag: "🇮🇪" },
  { code: "denmark", label: "Denmark", flag: "🇩🇰" },
  { code: "turkey", label: "Turkey", flag: "🇹🇷" },
  { code: "uae", label: "Dubai", flag: "🇦🇪" },
  { code: "thailand", label: "Thailand", flag: "🇹🇭" },
];

function getTodayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export default function SearchForm({ onSearch, loading }: Props) {
  const [budget, setBudget] = useState<string>("800");
  const [origin, setOrigin] = useState<string>("");
  const [departureDate, setDepartureDate] = useState<string>(getTodayPlus(14));
  const [returnDate, setReturnDate] = useState<string>(getTodayPlus(19));
  const [adults, setAdults] = useState<number>(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  function toggleCountry(code: string) {
    setSelectedCountries((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const budgetNum = parseFloat(budget);
    if (!budgetNum || budgetNum <= 0) return;

    onSearch({
      budget: budgetNum,
      origin: origin || undefined,
      departureDate: departureDate || undefined,
      returnDate: returnDate || undefined,
      adults,
      destinationCountries: selectedCountries.length > 0 ? selectedCountries : undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-5">
      {/* Budget — mandatory */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-indigo-300 uppercase tracking-wider">
          Your Total Budget
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-indigo-400">
            €
          </span>
          <input
            type="number"
            min={1}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="800"
            required
            className="w-full pl-10 pr-4 py-4 text-3xl font-bold bg-white/5 border-2 border-indigo-500/40 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-400 focus:bg-white/8 transition-all"
          />
        </div>
        <p className="text-xs text-white/40">Flight + hotel, all included</p>
      </div>

      {/* Destination countries */}
      <div className="space-y-2">
        <label className="block text-sm text-white/60">
          Destination countries
          {selectedCountries.length > 0 && (
            <span className="ml-2 text-indigo-400 font-semibold">{selectedCountries.length} selected</span>
          )}
          {selectedCountries.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedCountries([])}
              className="ml-2 text-white/30 hover:text-white/60 text-xs transition-colors"
            >
              clear
            </button>
          )}
        </label>
        <div className="flex flex-wrap gap-2">
          {DESTINATION_COUNTRIES.map((country) => {
            const selected = selectedCountries.includes(country.code);
            return (
              <button
                key={country.code}
                type="button"
                onClick={() => toggleCountry(country.code)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  selected
                    ? "bg-indigo-600 border border-indigo-400 text-white"
                    : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{country.flag}</span>
                <span>{country.label}</span>
              </button>
            );
          })}
        </div>
        {selectedCountries.length === 0 && (
          <p className="text-xs text-white/30">No filter = search everywhere</p>
        )}
      </div>

      {/* Departure airport */}
      <div className="space-y-2">
        <label className="block text-sm text-white/60">Departure airport</label>
        <select
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="w-full px-4 py-3 bg-[#13131f] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-400 transition-colors"
        >
          <option value="" className="bg-[#13131f] text-white">🌍 Anywhere (best prices)</option>
          {AIRPORT_OPTIONS.map((a) => (
            <option key={a.code} value={a.code} className="bg-[#13131f] text-white">
              {a.label}
            </option>
          ))}
        </select>
      </div>

      {/* Adults */}
      <div className="flex items-center gap-4">
        <label className="text-sm text-white/60">Travelers</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAdults(Math.max(1, adults - 1))}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold transition-colors"
          >
            −
          </button>
          <span className="w-6 text-center font-bold text-white">{adults}</span>
          <button
            type="button"
            onClick={() => setAdults(Math.min(9, adults + 1))}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Advanced toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        <span className={`transition-transform ${showAdvanced ? "rotate-90" : ""}`}>▶</span>
        {showAdvanced ? "Hide" : "Show"} filters (dates, departure city)
      </button>

      {showAdvanced && (
        <div className="space-y-4 p-4 bg-white/3 rounded-2xl border border-white/10">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-sm text-white/60">Departure</label>
              <input
                type="date"
                value={departureDate}
                min={getTodayPlus(1)}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-4 py-3 bg-[#13131f] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-400 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm text-white/60">Return</label>
              <input
                type="date"
                value={returnDate}
                min={departureDate || getTodayPlus(2)}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-4 py-3 bg-[#13131f] border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-400 transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !budget}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-white font-bold text-lg transition-all active:scale-98 shadow-lg shadow-indigo-900/40"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Searching best deals...
          </span>
        ) : (
          "✈️  Find my trip"
        )}
      </button>
    </form>
  );
}
