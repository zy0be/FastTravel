"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import ComboCard from "@/components/ComboCard";
import type { SearchParams, TravelCombo } from "@/types/travel";

type State = "idle" | "loading" | "results" | "error";

export default function Home() {
  const [state, setState] = useState<State>("idle");
  const [combos, setCombos] = useState<TravelCombo[]>([]);
  const [error, setError] = useState<string>("");
  const [lastBudget, setLastBudget] = useState<number>(0);
  const [lastParams, setLastParams] = useState<SearchParams | null>(null);

  async function handleSearch(params: SearchParams) {
    setState("loading");
    setError("");
    setLastBudget(params.budget);
    setLastParams(params);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Search failed");

      setCombos(data.combos || []);
      setState("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }

  return (
    <main className="min-h-screen px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-indigo-400 text-sm font-medium mb-6">
          ✈️ Budget Travel Finder
        </div>
        <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 tracking-tight">
          Speed<span className="text-indigo-400">Travel</span>
        </h1>
        <p className="text-white/50 text-lg max-w-md mx-auto">
          Enter your budget. We find the best flight + hotel combo that fits.
        </p>
      </div>

      {/* Search form */}
      <SearchForm onSearch={handleSearch} loading={state === "loading"} />

      {/* Loading */}
      {state === "loading" && (
        <div className="mt-16 text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin" />
              <span className="absolute inset-0 flex items-center justify-center text-2xl">✈️</span>
            </div>
          </div>
          <p className="text-white/50 text-sm">
            Searching flights and hotels across destinations...
          </p>
          <p className="text-white/30 text-xs">This can take up to 20 seconds</p>
        </div>
      )}

      {/* Error */}
      {state === "error" && (
        <div className="mt-8 max-w-2xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
          <p className="text-red-400 font-medium">{error}</p>
          <button
            onClick={() => lastParams && handleSearch(lastParams)}
            className="mt-3 text-sm text-white/50 hover:text-white/80 transition-colors underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Results */}
      {state === "results" && (
        <div className="mt-12 max-w-2xl mx-auto space-y-4">
          {combos.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-4xl">😔</p>
              <p className="text-white/70 font-medium">No combos found within your budget</p>
              <p className="text-white/40 text-sm">
                Try increasing your budget or adjusting your dates
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white/70 text-sm">
                  <span className="font-bold text-white text-lg">{combos.length}</span> deal
                  {combos.length > 1 ? "s" : ""} within{" "}
                  <span className="text-indigo-400 font-bold">€{lastBudget}</span>
                </h2>
                <span className="text-xs text-white/30">sorted by price</span>
              </div>

              {combos.map((combo, i) => (
                <ComboCard
                  key={`${combo.flight.id}-${combo.hotel.hotelId}-${i}`}
                  combo={combo}
                  budget={lastBudget}
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 text-center text-white/20 text-xs">
        Powered by Amadeus Travel API · Prices may vary at booking
      </footer>
    </main>
  );
}
