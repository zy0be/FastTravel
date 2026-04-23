"use client";

import Image from "next/image";
import type { TravelCombo } from "@/types/travel";

interface Props {
  combo: TravelCombo;
  budget: number;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

const CITY_NAMES: Record<string, string> = {
  BCN: "Barcelona", LIS: "Lisbon", PRG: "Prague", BUD: "Budapest",
  ATH: "Athens", WAW: "Warsaw", VIE: "Vienna", DUB: "Dublin",
  CPH: "Copenhagen", BKK: "Bangkok", DXB: "Dubai", IST: "Istanbul",
  MXP: "Milan", FCO: "Rome", AMS: "Amsterdam", CDG: "Paris",
  LHR: "London", MAD: "Madrid", BER: "Berlin", ZRH: "Zurich",
};

const CITY_EMOJIS: Record<string, string> = {
  BCN: "🇪🇸", LIS: "🇵🇹", PRG: "🇨🇿", BUD: "🇭🇺", ATH: "🇬🇷",
  WAW: "🇵🇱", VIE: "🇦🇹", DUB: "🇮🇪", CPH: "🇩🇰", BKK: "🇹🇭",
  DXB: "🇦🇪", IST: "🇹🇷", MXP: "🇮🇹", FCO: "🇮🇹", AMS: "🇳🇱",
};

export default function ComboCard({ combo, budget }: Props) {
  const { flight, hotel, totalPrice, savings } = combo;
  const pct = Math.round((totalPrice / budget) * 100);
  const city = CITY_NAMES[flight.destination] || flight.destination;
  const flag = CITY_EMOJIS[flight.destination] || "🌍";

  return (
    <div className="group bg-white/4 border border-white/8 rounded-3xl overflow-hidden hover:border-indigo-500/40 hover:bg-white/6 transition-all duration-300">
      {/* Hotel thumbnail if available */}
      {hotel.thumbnail && (
        <div className="relative h-36 w-full overflow-hidden">
          <Image
            src={hotel.thumbnail}
            alt={hotel.hotelName}
            fill
            className="object-cover opacity-70 group-hover:opacity-90 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090f] via-[#07090f]/40 to-transparent" />
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <span className="text-2xl">{flag}</span>
            <span className="text-white font-bold text-xl drop-shadow">{city}</span>
          </div>
          {savings > 0 && (
            <div className="absolute top-3 right-3 bg-emerald-500/80 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-full">
              €{savings.toFixed(0)} left
            </div>
          )}
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Destination (if no thumbnail) */}
        {!hotel.thumbnail && (
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{flag}</span>
              <div>
                <h3 className="text-xl font-bold text-white">{city}</h3>
                <p className="text-sm text-white/40">
                  {formatDate(flight.departureDate)} → {flight.returnDate ? formatDate(flight.returnDate) : "–"} · {hotel.nights}n
                </p>
              </div>
            </div>
            {savings > 0 && (
              <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full">
                €{savings.toFixed(0)} left
              </span>
            )}
          </div>
        )}

        {hotel.thumbnail && (
          <p className="text-sm text-white/40">
            {formatDate(flight.departureDate)} → {flight.returnDate ? formatDate(flight.returnDate) : "–"} · {hotel.nights} nights
          </p>
        )}

        <div className="border-t border-white/6" />

        {/* Flight */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {flight.airlineLogo ? (
              <Image src={flight.airlineLogo} alt={flight.airline} width={24} height={24} className="rounded object-contain bg-white p-0.5" />
            ) : (
              <span className="text-lg">✈️</span>
            )}
            <div>
              <p className="text-sm font-semibold text-white">
                {flight.origin} → {flight.destination}
              </p>
              <p className="text-xs text-white/40">
                {flight.airline} · {flight.duration} · {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
          <span className="text-white font-bold">€{flight.price.toFixed(0)}</span>
        </div>

        {/* Hotel */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">🏨</span>
            <div>
              <p className="text-sm font-semibold text-white line-clamp-1 max-w-[190px]">
                {hotel.hotelName}
              </p>
              <p className="text-xs text-white/40 flex items-center gap-1.5">
                {hotel.stars && (
                  <span className="text-yellow-400/80">{"★".repeat(Math.min(hotel.stars, 5))}</span>
                )}
                {hotel.rating && (
                  <span className="bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    {hotel.rating.toFixed(1)}
                  </span>
                )}
                <span>{hotel.nights} nights</span>
              </p>
            </div>
          </div>
          <span className="text-white font-bold">€{hotel.price.toFixed(0)}</span>
        </div>

        {/* Budget bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-white/30">
            <span>Budget used</span>
            <span>{pct}% of €{budget}</span>
          </div>
          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full"
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-1 border-t border-white/6">
          <span className="text-sm text-white/40">Total for {flight.stops === 0 ? "direct" : ""} trip</span>
          <span className="text-2xl font-black text-indigo-300">€{totalPrice.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}
