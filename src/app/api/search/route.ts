import { NextRequest, NextResponse } from "next/server";
import type { SearchParams, FlightOffer, HotelOffer, TravelCombo } from "@/types/travel";

const SERPAPI_KEY = process.env.SERPAPI_KEY;
const SERPAPI_BASE = "https://serpapi.com/search";
const BOOKING_AID = process.env.BOOKING_AFFILIATE_ID;
const SKYSCANNER_ID = process.env.SKYSCANNER_AFFILIATE_ID;
const TP_TOKEN = process.env.TRAVELPAYOUTS_TOKEN;

const POPULAR_DESTINATIONS = [
  { code: "BCN", name: "Barcelona", country: "spain" },
  { code: "LIS", name: "Lisbon", country: "portugal" },
  { code: "PRG", name: "Prague", country: "czech" },
  { code: "BUD", name: "Budapest", country: "hungary" },
  { code: "ATH", name: "Athens", country: "greece" },
  { code: "WAW", name: "Warsaw", country: "poland" },
  { code: "VIE", name: "Vienna", country: "austria" },
  { code: "DUB", name: "Dublin", country: "ireland" },
  { code: "CPH", name: "Copenhagen", country: "denmark" },
  { code: "BKK", name: "Bangkok", country: "thailand" },
  { code: "DXB", name: "Dubai", country: "uae" },
  { code: "IST", name: "Istanbul", country: "turkey" },
  { code: "MXP", name: "Milan", country: "italy" },
  { code: "FCO", name: "Rome", country: "italy" },
  { code: "AMS", name: "Amsterdam", country: "netherlands" },
  { code: "MAD", name: "Madrid", country: "spain" },
  { code: "CDG", name: "Paris", country: "france" },
  { code: "LYS", name: "Lyon", country: "france" },
  { code: "SKG", name: "Thessaloniki", country: "greece" },
  { code: "OPO", name: "Porto", country: "portugal" },
];

const POPULAR_ORIGINS = ["CDG", "LHR", "MAD", "BER", "ZRH"];

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function getTodayPlus(days: number): string {
  return addDays(new Date().toISOString().split("T")[0], days);
}

function buildFlightUrl(origin: string, destination: string, departureDate: string, returnDate: string, adults: number): string {
  // 1. Skyscanner affiliate (best — commission on booking)
  if (SKYSCANNER_ID && !SKYSCANNER_ID.startsWith("your_")) {
    const dep = departureDate.replace(/-/g, "");
    const ret = returnDate.replace(/-/g, "");
    return `https://www.skyscanner.net/transport/flights/${origin.toLowerCase()}/${destination.toLowerCase()}/${dep}/${ret}/?adults=${adults}&currency=EUR&associateid=${SKYSCANNER_ID}`;
  }
  // 2. Travelpayouts affiliate (commission via Aviasales/Jetradar)
  if (SKYSCANNER_ID && SKYSCANNER_ID.startsWith("TP-")) {
    const marker = SKYSCANNER_ID.replace("TP-", "");
    return `https://www.aviasales.com/search/${origin}${departureDate.replace(/-/g, "")}${destination}${returnDate.replace(/-/g, "")}1?marker=${marker}`;
  }
  // 3. Fallback: Google Flights (no commission but best UX)
  const q = `flights from ${origin} to ${destination} on ${departureDate} returning ${returnDate}`;
  return `https://www.google.com/travel/flights/search?q=${encodeURIComponent(q)}&adults=${adults}&curr=EUR`;
}

function buildHotelUrl(cityName: string, checkIn: string, checkOut: string, adults: number, hotelName?: string): string {
  const searchParams = new URLSearchParams({
    ss: hotelName ? `${hotelName}, ${cityName}` : cityName,
    checkin: checkIn,
    checkout: checkOut,
    no_rooms: "1",
    group_adults: String(adults),
    lang: "en-gb",
    selected_currency: "EUR",
  });

  const bookingUrl = `https://www.booking.com/searchresults.html?${searchParams}`;

  // CJ Affiliate tracking link format: click-{PID}-{AdvertiserID}
  // Booking.com FR advertiser ID on CJ = 4297313
  if (BOOKING_AID && !BOOKING_AID.startsWith("your_")) {
    return `https://www.anrdoezrs.net/click-${BOOKING_AID}-4297313?url=${encodeURIComponent(bookingUrl)}`;
  }

  return bookingUrl;
}

// Cache: origin -> list of flight prices (refreshed every 6h)
const flightCache = new Map<string, { data: TPFlight[]; fetchedAt: number }>();
const CACHE_TTL = 6 * 60 * 60 * 1000;

interface TPFlight {
  origin: string;
  destination: string;
  price: number;
  airline: string;
  departure_at: string;
  return_at: string;
  number_of_changes: number;
  duration: number;
}

async function fetchFlightPrices(origin: string, departureDate: string, returnDate: string): Promise<TPFlight[]> {
  const cacheKey = `${origin}-${departureDate.substring(0, 7)}`;
  const cached = flightCache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) return cached.data;

  const params = new URLSearchParams({
    origin,
    currency: "EUR",
    depart_date: departureDate.substring(0, 7),
    return_date: returnDate.substring(0, 7),
    limit: "1000",
    token: TP_TOKEN!,
  });

  const res = await fetch(`https://api.travelpayouts.com/v2/prices/latest?${params}`);
  if (!res.ok) return [];

  const data = await res.json();
  if (!data.success || !Array.isArray(data.data)) return [];

  flightCache.set(cacheKey, { data: data.data, fetchedAt: Date.now() });
  return data.data;
}

async function searchFlights(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate: string,
  adults: number
): Promise<FlightOffer | null> {
  const allPrices = await fetchFlightPrices(origin, departureDate, returnDate);
  const matches = allPrices
    .filter((f) => f.destination === destination)
    .sort((a, b) => a.price - b.price);

  if (!matches.length) return null;

  const cheapest = matches[0];
  const price = cheapest.price * adults;

  const bookingUrl = `https://www.kiwi.com/en/search/results/${origin.toLowerCase()}/${destination.toLowerCase()}/${departureDate}/${returnDate}?currency=EUR&adults=${adults}`;

  return {
    id: `${origin}-${destination}-${departureDate}`,
    origin,
    destination,
    departureDate: cheapest.departure_at?.split("T")[0] || departureDate,
    returnDate: cheapest.return_at?.split("T")[0] || returnDate,
    airline: cheapest.airline || "",
    airlineLogo: cheapest.airline ? `https://images.kiwi.com/airlines/64/${cheapest.airline}.png` : "",
    price,
    currency: "EUR",
    duration: cheapest.duration ? `${Math.floor(cheapest.duration / 60)}h${String(cheapest.duration % 60).padStart(2, "0")}` : "",
    stops: cheapest.number_of_changes ?? 0,
    bookingUrl,
  };
}

async function searchHotels(
  destinationCode: string,
  destinationName: string,
  checkIn: string,
  checkOut: string,
  adults: number,
  maxPrice: number
): Promise<HotelOffer | null> {
  const params = new URLSearchParams({
    engine: "google_hotels",
    q: `Hotels in ${destinationName}`,
    check_in_date: checkIn,
    check_out_date: checkOut,
    adults: String(adults),
    currency: "EUR",
    hl: "en",
    sort_by: "3", // lowest price
    api_key: SERPAPI_KEY!,
  });

  const res = await fetch(`${SERPAPI_BASE}?${params}`);
  if (!res.ok) return null;

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties: any[] = data.properties || [];

  const nights = Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
  ) || 1;

  for (const hotel of properties) {
    const price = hotel.rate_per_night?.lowest
      ? parseFloat(hotel.rate_per_night.lowest.replace(/[^0-9.]/g, "")) * nights
      : hotel.total_rate?.lowest
      ? parseFloat(hotel.total_rate.lowest.replace(/[^0-9.]/g, ""))
      : 0;

    if (price > 0 && price <= maxPrice) {
      // Priority: Google Hotels direct link (exact property page) > Booking.com search
      // Travelpayouts Drive script handles affiliate conversion automatically
      const bookingUrl = hotel.link || buildHotelUrl(destinationName, checkIn, checkOut, adults, hotel.name);

      return {
        hotelId: String(hotel.property_token || hotel.name),
        hotelName: hotel.name || "Unknown Hotel",
        cityCode: destinationCode,
        cityName: destinationName,
        price: Math.round(price * 100) / 100,
        currency: "EUR",
        stars: hotel.stars || undefined,
        rating: hotel.overall_rating || undefined,
        thumbnail: hotel.images?.[0]?.thumbnail || undefined,
        checkIn,
        checkOut,
        nights,
        bookingUrl,
      };
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  if (!TP_TOKEN) {
    return NextResponse.json({ error: "TRAVELPAYOUTS_TOKEN is not configured" }, { status: 500 });
  }
  if (!SERPAPI_KEY) {
    return NextResponse.json({ error: "SERPAPI_KEY is not configured" }, { status: 500 });
  }

  try {
    const body: SearchParams = await req.json();
    const { budget, origin, departureDate, returnDate, adults = 1, destinationCountries } = body;

    if (!budget || budget <= 0) {
      return NextResponse.json({ error: "Budget is required" }, { status: 400 });
    }

    const depDate = departureDate || getTodayPlus(14);
    const retDate = returnDate || addDays(depDate, 5);
    const origins = origin ? [origin] : POPULAR_ORIGINS.slice(0, 2);

    let destinations = POPULAR_DESTINATIONS;
    if (destinationCountries?.length) {
      // Filter by country code (e.g. "italy", "greece") — exact match
      destinations = POPULAR_DESTINATIONS.filter((d) =>
        destinationCountries.includes(d.country)
      );
      if (!destinations.length) destinations = POPULAR_DESTINATIONS;
    }

    const combos: TravelCombo[] = [];

    const tasks = origins.flatMap((orig) =>
      destinations.map((dest) => ({ orig, dest }))
    );

    const BATCH_SIZE = 4;
    for (let i = 0; i < tasks.length && combos.length < 20; i += BATCH_SIZE) {
      const batch = tasks.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async ({ orig, dest }) => {
          try {
            const flight = await searchFlights(orig, dest.code, depDate, retDate, adults);
            if (!flight || flight.price >= budget) return;

            const hotelBudget = budget - flight.price;
            const hotel = await searchHotels(dest.code, dest.name, depDate, retDate, adults, hotelBudget);
            if (!hotel) return;

            const total = flight.price + hotel.price;
            if (total <= budget) {
              combos.push({
                flight,
                hotel,
                totalPrice: Math.round(total * 100) / 100,
                currency: "EUR",
                savings: Math.round((budget - total) * 100) / 100,
              });
            }
          } catch {
            // skip failed searches
          }
        })
      );
    }

    combos.sort((a, b) => a.totalPrice - b.totalPrice);

    return NextResponse.json({ combos: combos.slice(0, 20) });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

