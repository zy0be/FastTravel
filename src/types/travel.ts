export interface SearchParams {
  budget: number;
  origin?: string;
  departureDate?: string;
  returnDate?: string;
  adults?: number;
  destinationCountries?: string[];
}

export interface FlightOffer {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  airline: string;
  airlineLogo?: string;
  price: number;
  currency: string;
  duration: string;
  stops: number;
}

export interface HotelOffer {
  hotelId: string;
  hotelName: string;
  cityCode: string;
  price: number;
  currency: string;
  stars?: number;
  rating?: number;
  thumbnail?: string;
  checkIn: string;
  checkOut: string;
  nights: number;
}

export interface TravelCombo {
  flight: FlightOffer;
  hotel: HotelOffer;
  totalPrice: number;
  currency: string;
  savings: number;
}
