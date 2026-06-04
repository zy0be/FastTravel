import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — SpeedTravel",
  description: "Privacy Policy for SpeedTravel.app",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-4 py-12 max-w-3xl mx-auto">
      <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm mb-8 inline-block">
        ← Back to SpeedTravel
      </Link>

      <h1 className="text-3xl font-black text-white mb-2">Privacy Policy</h1>
      <p className="text-white/40 text-sm mb-10">Last updated: June 2025</p>

      <div className="space-y-8 text-white/70 leading-relaxed">

        <section className="space-y-3">
          <h2 className="text-white font-bold text-lg">1. Who we are</h2>
          <p>
            SpeedTravel (<strong className="text-white">speedtravel.app</strong>) is a travel deals aggregator
            operated by Louis Bezieau, based in France. We help users find flight and hotel combinations
            within their budget.
          </p>
          <p>Contact: <a href="mailto:contact@speedtravel.app" className="text-indigo-400 hover:underline">contact@speedtravel.app</a></p>
        </section>

        <section className="space-y-3">
          <h2 className="text-white font-bold text-lg">2. Data we collect</h2>
          <p>SpeedTravel does <strong className="text-white">not</strong> create user accounts or store personal data on our servers. When you use our search tool, the following data may be processed:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Search parameters you enter (budget, dates, origin city)</li>
            <li>Anonymous usage data via cookies (see section 4)</li>
          </ul>
          <p>We do not sell, share or rent your personal data to third parties.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-white font-bold text-lg">3. Affiliate disclosure</h2>
          <p>
            SpeedTravel participates in affiliate programs. When you click on a flight or hotel link and
            make a booking, we may receive a commission from our partners at no additional cost to you.
            Our affiliate partners include:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-white">Booking.com</strong> — via CJ Affiliate (Commission Junction)</li>
            <li><strong className="text-white">Travelpayouts</strong> — flight and hotel affiliate network</li>
            <li><strong className="text-white">SerpAPI</strong> — used to retrieve flight and hotel data from Google</li>
          </ul>
          <p>
            This affiliate relationship does not influence the results displayed — we always show the
            best available deals for your budget.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-white font-bold text-lg">4. Cookies</h2>
          <p>We use the following cookies and tracking technologies:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-white">Travelpayouts Drive</strong> — affiliate tracking script to attribute commissions</li>
            <li><strong className="text-white">CJ Affiliate</strong> — conversion tracking for Booking.com referrals</li>
          </ul>
          <p>
            These cookies are used solely for affiliate tracking purposes. They do not collect personally
            identifiable information beyond what is necessary to attribute a referral commission.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-white font-bold text-lg">5. Third-party services</h2>
          <p>Our service relies on the following third-party providers, each with their own privacy policies:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong className="text-white">Vercel</strong> — hosting and deployment (vercel.com/privacy)</li>
            <li><strong className="text-white">SerpAPI</strong> — travel data retrieval (serpapi.com/privacy)</li>
            <li><strong className="text-white">Booking.com</strong> — hotel bookings (booking.com/content/privacy.html)</li>
            <li><strong className="text-white">Travelpayouts</strong> — flight affiliate links (travelpayouts.com/en/pages/privacy)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-white font-bold text-lg">6. Your rights (GDPR)</h2>
          <p>As a user based in the European Union, you have the right to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Access any personal data we hold about you</li>
            <li>Request correction or deletion of your data</li>
            <li>Object to data processing</li>
            <li>Lodge a complaint with the CNIL (France&apos;s data protection authority)</li>
          </ul>
          <p>
            To exercise these rights, contact us at{" "}
            <a href="mailto:contact@speedtravel.app" className="text-indigo-400 hover:underline">
              contact@speedtravel.app
            </a>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-white font-bold text-lg">7. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page
            with an updated date. Continued use of SpeedTravel after changes constitutes acceptance
            of the updated policy.
          </p>
        </section>

      </div>

      <div className="mt-12 pt-8 border-t border-white/10 flex gap-6 text-sm text-white/30">
        <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
        <Link href="/legal" className="hover:text-white/60 transition-colors">Legal Mentions</Link>
      </div>
    </main>
  );
}
