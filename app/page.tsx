export const dynamic = "force-dynamic";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import FeaturedEvents from "@/components/FeaturedEvents";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto text-center py-24 px-6">
        <p className="text-yellow-400 uppercase tracking-[0.3em] font-semibold">
          Welcome to Ticatility
        </p>

        <h1 className="text-5xl md:text-7xl font-extrabold mt-6 leading-tight">
          The World's Marketplace
          <br />
          <span className="text-blue-500">
            for Live Event Tickets
          </span>
        </h1>

        <p className="mt-8 text-slate-300 text-lg max-w-3xl mx-auto">
          Buy and sell verified tickets for concerts, sports, theatre,
          festivals, comedy shows, and unforgettable live experiences
          across the world.
        </p>

        <div className="mt-12 flex justify-center">
          <input
            type="text"
            placeholder="Search artists, teams, venues or events..."
            className="w-full max-w-xl rounded-l-xl px-5 py-4 text-black"
          />

          <button className="bg-blue-600 hover:bg-blue-700 px-8 rounded-r-xl font-semibold">
            Search
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-yellow-400 text-black hover:bg-yellow-300 px-8 py-4 rounded-xl font-bold">
            Explore Events
          </button>

          <button className="border border-slate-700 hover:bg-slate-800 px-8 py-4 rounded-xl font-bold">
            Sell Tickets
          </button>
        </div>
      </section>

      {/* ACCOMMODATION ASSISTANCE */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 p-8 md:p-12 shadow-2xl">

          <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl" />

          <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-10 items-center">

            <div>
              <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-semibold mb-5">
                🏨 Travel Assistance
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
                Need Accommodation for Your Event?
              </h2>

              <p className="mt-5 text-slate-300 text-lg leading-relaxed max-w-3xl">
                Traveling from out of town for an event? Ticatility can
                help you find suitable hotels and short-stay accommodation
                close to your event venue.
              </p>

              <p className="mt-3 text-slate-400">
                Contact our support team and tell us which event you're
                attending. We'll help you find accommodation options based
                on your location, dates, and preferences.
              </p>
            </div>

            <div className="flex md:flex-col gap-3 md:min-w-[190px]">
              <Link
                href="/contact"
                className="bg-yellow-400 hover:bg-yellow-300 text-black px-7 py-4 rounded-xl font-bold text-center transition"
              >
                Contact Support
              </Link>

              <p className="text-xs text-slate-500 text-center">
                We're here to help
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURED EVENTS */}
      <FeaturedEvents />

      {/* WHY CHOOSE US */}
      <WhyChooseUs />
    </main>
  );
}