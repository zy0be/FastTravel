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
  MIL: "Milan", ROM: "Rome", MXP: "Milan", FCO: "Rome",
  AMS: "Amsterdam", MAD: "Madrid", CDG: "Paris", LYS: "Lyon",
  SKG: "Thessaloniki", OPO: "Porto", LHR: "London", BER: "Berlin", ZRH: "Zurich",
};

const CITY_EMOJIS: Record<string, string> = {
  BCN: "🇪🇸", LIS: "🇵🇹", PRG: "🇨🇿", BUD: "🇭🇺", ATH: "🇬🇷",
  WAW: "🇵🇱", VIE: "🇦🇹", DUB: "🇮🇪", CPH: "🇩🇰", BKK: "🇹🇭",
  DXB: "🇦🇪", IST: "🇹🇷", MIL: "🇮🇹", ROM: "🇮🇹", MXP: "🇮🇹", FCO: "🇮🇹",
  AMS: "🇳🇱", MAD: "🇪🇸", CDG: "🇫🇷", LYS: "🇫🇷", SKG: "🇬🇷", OPO: "🇵🇹",
};

const CITY_PHOTOS: Record<string, string> = {
  BCN: "photo-1539037116277-4db20889f2d4",
  LIS: "photo-1555881400-74d7acaacd8b",
  PRG: "photo-1561485132-59468cd0b820",
  BUD: "photo-1565426873118-a17ed65d74b9",
  ATH: "photo-1555993539-1732b0258235",
  WAW: "photo-1519197924294-4ba991a11128",
  VIE: "photo-1516550893923-42d28e5677af",
  DUB: "photo-1549918864-48ac978761a4",
  CPH: "photo-1513622470522-26c3c8a854bc",
  BKK: "photo-1508009603885-50cf7c579365",
  DXB: "photo-1512453979798-5ea266f8880c",
  IST: "photo-1524231757912-21f4fe3a7200",
  MIL: "photo-1558618666-fcd25c85cd64",
  ROM: "photo-1552832230-c0197dd311b5",
  AMS: "photo-1576924542622-772281b13578",
  MAD: "photo-1543785734-4b6e564642f8",
  CDG: "photo-1499856871958-5b9357976b82",
  LYS: "photo-1578662996442-48f60103fc96",
  SKG: "photo-1601392272847-57ac2662f119",
  OPO: "photo-1555881400-74d7acaacd8b",
};

export default function ComboCard({ combo, budget }: Props) {
  const { flight, hotel, totalPrice, savings } = combo;
  const pct = Math.round((totalPrice / budget) * 100);
  const city = CITY_NAMES[flight.destination] || flight.destination;
  const flag = CITY_EMOJIS[flight.destination] || "🌍";
  const photoId = CITY_PHOTOS[flight.destination];
  const cityPhoto = photoId ? `https://images.unsplash.com/${photoId}?w=600&q=80&fit=crop` : null;

  return (
    <div className="group bg-white/4 border border-white/8 rounded-3xl overflow-hidden hover:border-indigo-500/40 hover:bg-white/6 transition-all duration-300">
      {/* City photo */}
      <div className="relative h-36 w-full overflow-hidden bg-indigo-900/40">
        {cityPhoto && (
          <Image
            src={cityPhoto}
            alt={city}
            fill
            className="object-cover opacity-75 group-hover:opacity-90 transition-opacity"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090f] via-[#07090f]/30 to-transparent" />
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

      <div className="p-5 space-y-4">
        <p className="text-sm text-white/40">
          {formatDate(flight.departureDate)} → {flight.returnDate ? formatDate(flight.returnDate) : "–"} · {hotel.nights} nights
        </p>

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

        {/* Book buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={flight.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 hover:border-indigo-400/60 rounded-xl text-indigo-300 hover:text-white text-sm font-semibold transition-all"
          >
            ✈️ Book flight
          </a>
          <a
            href={hotel.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 hover:border-blue-400/60 rounded-xl text-blue-300 hover:text-white text-sm font-semibold transition-all"
          >
            🏨 Book hotel
          </a>
        </div>
      </div>
    </div>
  );
}
