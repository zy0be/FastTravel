import { NextRequest, NextResponse } from "next/server";
import type { SearchParams, FlightOffer, HotelOffer, TravelCombo } from "@/types/travel";

const SERPAPI_KEY = process.env.SERPAPI_KEY;
const SERPAPI_BASE = "https://serpapi.com/search";
const BOOKING_AID = process.env.BOOKING_AFFILIATE_ID;
const SKYSCANNER_ID = process.env.SKYSCANNER_AFFILIATE_ID;

const POPULAR_DESTINATIONS = [
  { code: "BCN", name: "Barcelona" },
  { code: "LIS", name: "Lisbon" },
  { code: "PRG", name: "Prague" },
  { code: "BUD", name: "Budapest" },
  { code: "ATH", name: "Athens" },
  { code: "WAW", name: "Warsaw" },
  { code: "VIE", name: "Vienna" },
  { code: "DUB", name: "Dublin" },
  { code: "CPH", name: "Copenhagen" },
  { code: "BKK", name: "Bangkok" },
  { code: "DXB", name: "Dubai" },
  { code: "IST", name: "Istanbul" },
  { code: "MXP", name: "Milan" },
  { code: "FCO", name: "Rome" },
  { code: "AMS", name: "Amsterdam" },
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
  const params = new URLSearchParams({
    ss: hotelName ? `${hotelName}, ${cityName}` : cityName,
    checkin: checkIn,
    checkout: checkOut,
    no_rooms: "1",
    group_adults: String(adults),
    lang: "en-gb",
    selected_currency: "EUR",
  });
  // Inject Booking.com affiliate ID if available
  if (BOOKING_AID && !BOOKING_AID.startsWith("your_")) {
    params.set("aid", BOOKING_AID);
  }
  return `https://www.booking.com/searchresults.html?${params}`;
}

async function searchFlights(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate: string,
  adults: number
): Promise<FlightOffer | null> {
  const params = new URLSearchParams({
    engine: "google_flights",
    departure_id: origin,
    arrival_id: destination,
    outbound_date: departureDate,
    return_date: returnDate,
    adults: String(adults),
    currency: "EUR",
    hl: "en",
    api_key: SERPAPI_KEY!,
  });

  const res = await fetch(`${SERPAPI_BASE}?${params}`);
  if (!res.ok) return null;

  const data = await res.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allFlights: any[] = [
    ...(data.best_flights || []),
    ...(data.other_flights || []),
  ];

  if (!allFlights.length) return null;

  const cheapest = allFlights[0];
  const price = cheapest.price;
  const leg = cheapest.flights?.[0];

  if (!price || !leg) return null;

  // Use SerpAPI's booking link if available, otherwise build Skyscanner/Google Flights URL
  const bookingUrl: string = cheapest.booking_token
    ? `https://www.google.com/travel/flights/booking?tfs=${cheapest.booking_token}`
    : buildFlightUrl(origin, destination, departureDate, returnDate, adults);

  return {
    id: `${origin}-${destination}-${departureDate}`,
    origin,
    destination,
    departureDate,
    returnDate,
    airline: leg.airline || "",
    airlineLogo: leg.airline_logo || "",
    price,
    currency: "EUR",
    duration: cheapest.total_duration
      ? `${Math.floor(cheapest.total_duration / 60)}h${String(cheapest.total_duration % 60).padStart(2, "0")}`
      : "",
    stops: (cheapest.flights?.length || 1) - 1,
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
      // If affiliate ID is set → Booking.com with hotel name (commission tracked)
      // Otherwise → Google Hotels direct link (exact property, best UX, no commission)
      const hasAffiliateId = BOOKING_AID && !BOOKING_AID.startsWith("your_");
      const bookingUrl = hasAffiliateId
        ? buildHotelUrl(destinationName, checkIn, checkOut, adults, hotel.name)
        : (hotel.link || buildHotelUrl(destinationName, checkIn, checkOut, adults, hotel.name));

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
      destinations = POPULAR_DESTINATIONS.filter((d) =>
        destinationCountries.some((c) => d.name.toLowerCase().includes(c.toLowerCase()))
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
