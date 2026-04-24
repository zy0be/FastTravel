import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpeedTravel — Budget Travel Deals",
  description: "Enter your budget. Get the best flight + hotel combo instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#07090f] text-[#e8eaf6]">
        {children}
        {/* Travelpayouts Drive — affiliate monetization */}
        <Script
          src="https://emrldtp.com/NTIyMjk3.js?t=522297"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
