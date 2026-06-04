import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Legal Mentions — SpeedTravel",
  description: "Legal mentions for SpeedTravel.app",
};

export default function LegalPage() {
  return (
    <main className="min-h-screen px-4 py-12 max-w-3xl mx-auto">
      <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm mb-8 inline-block">
        ← Back to SpeedTravel
      </Link>

      <h1 className="text-3xl font-black text-white mb-2">Legal Mentions</h1>
      <p className="text-white/40 text-sm mb-10">Mentions légales — conformément à la loi française</p>

      <div className="space-y-8 text-white/70 leading-relaxed">

        <section className="space-y-3">
          <h2 className="text-white font-bold text-lg">Publisher</h2>
          <ul className="space-y-1">
            <li><span className="text-white/40">Site:</span> speedtravel.app</li>
            <li><span className="text-white/40">Owner:</span> Louis Bezieau</li>
            <li><span className="text-white/40">Country:</span> France</li>
            <li><span className="text-white/40">Email:</span>{" "}
              <a href="mailto:contact@speedtravel.app" className="text-indigo-400 hover:underline">
                contact@speedtravel.app
              </a>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-white font-bold text-lg">Hosting</h2>
          <ul className="space-y-1">
            <li><span className="text-white/40">Provider:</span> Vercel Inc.</li>
            <li><span className="text-white/40">Address:</span> 340 Pine Street, Suite 701, San Francisco, CA 94104, USA</li>
            <li><span className="text-white/40">Website:</span>{" "}
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                vercel.com
              </a>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-white font-bold text-lg">Nature of the service</h2>
          <p>
            SpeedTravel is a free travel search aggregator. It retrieves publicly available flight
            and hotel data via third-party APIs (SerpAPI / Google) and presents combinations within
            a user-defined budget. SpeedTravel does not sell travel products directly and is not a
            travel agency.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-white font-bold text-lg">Affiliate disclaimer</h2>
          <p>
            SpeedTravel participates in affiliate marketing programs. Links to Booking.com and other
            travel providers may include affiliate tracking codes. We may earn a commission if you
            complete a booking through these links, at no extra cost to you.
          </p>
          <p>
            Prices displayed are indicative and sourced from third-party APIs. Final prices are
            determined at the time of booking on the partner&apos;s website. SpeedTravel cannot be
            held responsible for price changes or availability discrepancies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-white font-bold text-lg">Intellectual property</h2>
          <p>
            The SpeedTravel brand, design and source code are the property of Louis Bezieau.
            Flight and hotel data is sourced from Google via SerpAPI and belongs to their respective
            owners. Airline logos and hotel images are property of their respective companies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-white font-bold text-lg">Limitation of liability</h2>
          <p>
            SpeedTravel provides information on an &quot;as is&quot; basis. We make no warranties regarding
            the accuracy, completeness or availability of travel offers. Users are encouraged to verify
            prices and availability directly with the booking platform before making any purchase decision.
          </p>
        </section>

      </div>

      <div className="mt-12 pt-8 border-t border-white/10 flex gap-6 text-sm text-white/30">
        <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
        <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
      </div>
    </main>
  );
}
