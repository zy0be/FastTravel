"use client";

import Image from "next/image";
import { useState } from "react";
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

interface Activity {
  name: string;
  emoji: string;
  price: number;
}

const CITY_ACTIVITIES: Record<string, Activity[]> = {
  BCN: [
    { name: "Sagrada Família", emoji: "⛪", price: 26 },
    { name: "Park Güell", emoji: "🌿", price: 10 },
    { name: "Camp Nou tour", emoji: "⚽", price: 28 },
    { name: "Picasso Museum", emoji: "🎨", price: 12 },
    { name: "Las Ramblas tapas tour", emoji: "🍢", price: 35 },
  ],
  LIS: [
    { name: "Sintra day trip", emoji: "🏰", price: 15 },
    { name: "Belém Tower", emoji: "🗼", price: 6 },
    { name: "Tuk-tuk city tour", emoji: "🛺", price: 20 },
    { name: "Fado dinner show", emoji: "🎸", price: 45 },
    { name: "Jerónimos Monastery", emoji: "⛪", price: 10 },
  ],
  PRG: [
    { name: "Prague Castle", emoji: "🏰", price: 15 },
    { name: "Old Town walking tour", emoji: "🚶", price: 12 },
    { name: "Beer spa", emoji: "🍺", price: 65 },
    { name: "Boat cruise on Vltava", emoji: "⛵", price: 18 },
    { name: "Czech cuisine dinner", emoji: "🍖", price: 25 },
  ],
  BUD: [
    { name: "Széchenyi thermal bath", emoji: "♨️", price: 22 },
    { name: "Parliament tour", emoji: "🏛️", price: 8 },
    { name: "Ruin bar crawl", emoji: "🍻", price: 30 },
    { name: "Danube evening cruise", emoji: "🚢", price: 20 },
    { name: "Hungarian food tour", emoji: "🍲", price: 35 },
  ],
  ATH: [
    { name: "Acropolis + museum", emoji: "🏛️", price: 20 },
    { name: "Cape Sounion day trip", emoji: "🌅", price: 25 },
    { name: "Athens food tour", emoji: "🥙", price: 45 },
    { name: "Aegina island ferry", emoji: "⛴️", price: 18 },
    { name: "Monastiraki flea market", emoji: "🛍️", price: 0 },
  ],
  VIE: [
    { name: "Schönbrunn Palace", emoji: "🏰", price: 16 },
    { name: "Vienna State Opera", emoji: "🎭", price: 15 },
    { name: "Kunsthistorisches Museum", emoji: "🎨", price: 21 },
    { name: "Prater & Riesenrad", emoji: "🎡", price: 12 },
    { name: "Coffee house pastry tour", emoji: "☕", price: 20 },
  ],
  AMS: [
    { name: "Anne Frank House", emoji: "📖", price: 16 },
    { name: "Rijksmuseum", emoji: "🎨", price: 22 },
    { name: "Canal boat tour", emoji: "⛵", price: 18 },
    { name: "Keukenhof Gardens", emoji: "🌷", price: 22 },
    { name: "Van Gogh Museum", emoji: "🖼️", price: 20 },
  ],
  MAD: [
    { name: "Prado Museum", emoji: "🎨", price: 15 },
    { name: "Flamenco show", emoji: "💃", price: 40 },
    { name: "Bernabéu stadium tour", emoji: "⚽", price: 25 },
    { name: "Toledo day trip", emoji: "🏙️", price: 20 },
    { name: "Mercado de San Miguel", emoji: "🥘", price: 20 },
  ],
  CDG: [
    { name: "Eiffel Tower (summit)", emoji: "🗼", price: 29 },
    { name: "Louvre Museum", emoji: "🎨", price: 22 },
    { name: "Versailles Palace", emoji: "🏰", price: 20 },
    { name: "Seine river cruise", emoji: "⛵", price: 17 },
    { name: "Montmartre food tour", emoji: "🥐", price: 40 },
  ],
  ROM: [
    { name: "Colosseum + Forum", emoji: "🏛️", price: 18 },
    { name: "Vatican Museums", emoji: "⛪", price: 20 },
    { name: "Borghese Gallery", emoji: "🎨", price: 13 },
    { name: "Roman food tour", emoji: "🍝", price: 45 },
    { name: "Pompeii day trip", emoji: "🌋", price: 30 },
  ],
  MIL: [
    { name: "The Last Supper", emoji: "🖼️", price: 17 },
    { name: "Duomo rooftop", emoji: "⛪", price: 14 },
    { name: "Pinacoteca di Brera", emoji: "🎨", price: 15 },
    { name: "Lake Como day trip", emoji: "🏞️", price: 25 },
    { name: "Navigli aperitivo tour", emoji: "🍷", price: 30 },
  ],
  IST: [
    { name: "Hagia Sophia", emoji: "🕌", price: 0 },
    { name: "Topkapi Palace", emoji: "🏰", price: 15 },
    { name: "Bosphorus cruise", emoji: "⛴️", price: 20 },
    { name: "Grand Bazaar", emoji: "🛍️", price: 0 },
    { name: "Turkish hammam", emoji: "🛁", price: 35 },
  ],
  BKK: [
    { name: "Grand Palace", emoji: "🏯", price: 15 },
    { name: "Floating market tour", emoji: "🛶", price: 25 },
    { name: "Muay Thai match", emoji: "🥊", price: 30 },
    { name: "Street food night tour", emoji: "🍜", price: 20 },
    { name: "Wat Pho temple", emoji: "🛕", price: 5 },
  ],
  DXB: [
    { name: "Burj Khalifa (top)", emoji: "🏙️", price: 37 },
    { name: "Desert safari", emoji: "🐪", price: 55 },
    { name: "Dubai Mall ice rink", emoji: "⛸️", price: 25 },
    { name: "Dubai Frame", emoji: "🖼️", price: 14 },
    { name: "Gold Souk", emoji: "💛", price: 0 },
  ],
  CPH: [
    { name: "Tivoli Gardens", emoji: "🎡", price: 17 },
    { name: "Nyhavn canal walk", emoji: "🚶", price: 0 },
    { name: "Louisiana Museum", emoji: "🎨", price: 22 },
    { name: "Christiansborg Palace", emoji: "🏰", price: 18 },
    { name: "New Nordic food tour", emoji: "🍱", price: 50 },
  ],
  WAW: [
    { name: "Warsaw Rising Museum", emoji: "🏛️", price: 8 },
    { name: "Old Town walking tour", emoji: "🚶", price: 10 },
    { name: "Chopin concert", emoji: "🎹", price: 25 },
    { name: "Łazienki Park", emoji: "🌳", price: 0 },
    { name: "Pierogi cooking class", emoji: "🥟", price: 40 },
  ],
  DUB: [
    { name: "Guinness Storehouse", emoji: "🍺", price: 25 },
    { name: "Cliffs of Moher tour", emoji: "🌊", price: 35 },
    { name: "Trinity College & Book of Kells", emoji: "📚", price: 16 },
    { name: "Dublin pub crawl", emoji: "🎵", price: 20 },
    { name: "Kilmainham Gaol", emoji: "🏚️", price: 8 },
  ],
  LYS: [
    { name: "Traboules walking tour", emoji: "🚶", price: 12 },
    { name: "Institut Lumière", emoji: "🎬", price: 8 },
    { name: "Lyon food tour (bouchons)", emoji: "🍷", price: 50 },
    { name: "Fourvière Basilica", emoji: "⛪", price: 0 },
    { name: "Les Halles de Lyon", emoji: "🧀", price: 15 },
  ],
  SKG: [
    { name: "White Tower", emoji: "🗼", price: 4 },
    { name: "Archaeological Museum", emoji: "🏛️", price: 8 },
    { name: "Thessaloniki food tour", emoji: "🥗", price: 35 },
    { name: "Mount Olympus day trip", emoji: "⛰️", price: 20 },
    { name: "Ladadika bar district", emoji: "🍻", price: 15 },
  ],
  OPO: [
    { name: "Livraria Lello bookshop", emoji: "📚", price: 5 },
    { name: "Douro Valley wine tour", emoji: "🍷", price: 55 },
    { name: "Dom Luís I bridge walk", emoji: "🌉", price: 0 },
    { name: "Porto food tour", emoji: "🥩", price: 40 },
    { name: "Serralves Museum", emoji: "🎨", price: 12 },
  ],
};

export default function ComboCard({ combo, budget }: Props) {
  const { flight, hotel, totalPrice, savings } = combo;
  const city = CITY_NAMES[flight.destination] || flight.destination;
  const flag = CITY_EMOJIS[flight.destination] || "🌍";
  const photoId = CITY_PHOTOS[flight.destination];
  const cityPhoto = photoId ? `https://images.unsplash.com/${photoId}?w=600&q=80&fit=crop` : null;
  const activities = CITY_ACTIVITIES[flight.destination] || [];

  const [showActivities, setShowActivities] = useState(false);
  const [checkedActivities, setCheckedActivities] = useState<Set<number>>(new Set());

  const activitiesTotal = Array.from(checkedActivities).reduce(
    (sum, idx) => sum + (activities[idx]?.price ?? 0),
    0
  );
  const grandTotal = totalPrice + activitiesTotal;
  const pct = Math.round((grandTotal / budget) * 100);

  function toggleActivity(idx: number) {
    setCheckedActivities((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

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

        {/* Activities toggle */}
        {activities.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowActivities(!showActivities)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white/4 hover:bg-white/8 border border-white/8 hover:border-white/16 transition-all text-sm text-white/60 hover:text-white"
            >
              <span className="flex items-center gap-2">
                <span>🎯</span>
                <span>Activities{checkedActivities.size > 0 && <span className="ml-1.5 text-indigo-400 font-semibold">+€{activitiesTotal}</span>}</span>
              </span>
              <span className={`text-white/30 transition-transform duration-200 ${showActivities ? "rotate-180" : ""}`}>▼</span>
            </button>

            {showActivities && (
              <div className="mt-2 space-y-1.5 px-1">
                {activities.map((act, idx) => {
                  const checked = checkedActivities.has(idx);
                  return (
                    <label
                      key={idx}
                      className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all ${
                        checked
                          ? "bg-indigo-600/20 border border-indigo-500/30"
                          : "bg-white/3 border border-transparent hover:bg-white/6"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleActivity(idx)}
                          className="w-4 h-4 accent-indigo-500 cursor-pointer"
                        />
                        <span className="text-base">{act.emoji}</span>
                        <span className="text-sm text-white/80">{act.name}</span>
                      </div>
                      <span className={`text-sm font-semibold shrink-0 ${act.price === 0 ? "text-emerald-400" : "text-white/60"}`}>
                        {act.price === 0 ? "Free" : `€${act.price}`}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Budget bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-white/30">
            <span>Budget used</span>
            <span className={pct > 100 ? "text-red-400 font-semibold" : ""}>{pct}% of €{budget}</span>
          </div>
          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                pct > 100
                  ? "bg-gradient-to-r from-red-600 to-red-400"
                  : "bg-gradient-to-r from-indigo-600 to-indigo-400"
              }`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-1 border-t border-white/6">
          <span className="text-sm text-white/40">
            {checkedActivities.size > 0 ? `Trip + ${checkedActivities.size} activit${checkedActivities.size > 1 ? "ies" : "y"}` : "Total for trip"}
          </span>
          <span className={`text-2xl font-black ${pct > 100 ? "text-red-400" : "text-indigo-300"}`}>
            €{grandTotal.toFixed(0)}
          </span>
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
