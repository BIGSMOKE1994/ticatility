"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <nav className="relative z-50 flex items-center justify-between px-8 py-6 border-b border-slate-800 bg-slate-950">

      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.png"
          alt="Ticatility Logo"
          width={220}
          height={60}
          priority
        />
      </Link>

      {/* Navigation */}
      <div className="hidden md:flex items-center gap-7 text-white">

        {/* CONCERTS */}
        <div
          className="relative"
          onMouseEnter={() => setOpenMenu("concerts")}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <button className="hover:text-blue-400 transition">
            Concerts ▾
          </button>

          {openMenu === "concerts" && (
            <div className="absolute left-0 top-full pt-3">
              <div className="w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3">

                <Link
                  href="/events?category=concerts"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  🎤 All Concerts
                </Link>

                <Link
                  href="/events?category=pop"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  🎵 Pop
                </Link>

                <Link
                  href="/events?category=rock"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  🎸 Rock
                </Link>

                <Link
                  href="/events?category=hip-hop"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  🎤 Hip-Hop & Rap
                </Link>

                <Link
                  href="/events?category=rnb"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  🎶 R&B
                </Link>

                <Link
                  href="/events?category=afrobeats"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  🌍 Afrobeats
                </Link>

                <Link
                  href="/events?category=festivals"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  🎪 Festivals
                </Link>

              </div>
            </div>
          )}
        </div>


        {/* SPORTS */}
        <div
          className="relative"
          onMouseEnter={() => setOpenMenu("sports")}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <button className="hover:text-blue-400 transition">
            Sports ▾
          </button>

          {openMenu === "sports" && (
            <div className="absolute left-0 top-full pt-3">
              <div className="w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3">

                <Link
                  href="/events?category=sports"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  🏆 All Sports
                </Link>

                <div className="border-t border-slate-800 my-2" />

                <p className="px-4 py-2 text-xs uppercase tracking-wider text-slate-500">
                  Football
                </p>

                <Link
                  href="/events?category=premier-league"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  ⚽ Premier League
                </Link>

                <Link
                  href="/events?category=mls"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  ⚽ MLS
                </Link>

                <Link
                  href="/events?category=champions-league"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  ⚽ Champions League
                </Link>

                <Link
                  href="/events?category=la-liga"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  ⚽ La Liga
                </Link>

                <Link
                  href="/events?category=serie-a"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  ⚽ Serie A
                </Link>

                <Link
                  href="/events?category=bundesliga"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  ⚽ Bundesliga
                </Link>

                <div className="border-t border-slate-800 my-2" />

                <Link
                  href="/events?category=f1"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  🏎️ Formula 1
                </Link>

                <Link
                  href="/events?category=nba"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  🏀 NBA
                </Link>

                <Link
                  href="/events?category=nfl"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  🏈 NFL
                </Link>

                <Link
                  href="/events?category=mlb"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  ⚾ MLB
                </Link>

                <Link
                  href="/events?category=tennis"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  🎾 Tennis
                </Link>

                <Link
                  href="/events?category=boxing"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  🥊 Boxing
                </Link>

                <Link
                  href="/events?category=ufc"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  🥋 UFC
                </Link>

              </div>
            </div>
          )}
        </div>


        {/* THEATRE */}
        <div
          className="relative"
          onMouseEnter={() => setOpenMenu("theatre")}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <button className="hover:text-blue-400 transition">
            Theatre ▾
          </button>

          {openMenu === "theatre" && (
            <div className="absolute left-0 top-full pt-3">
              <div className="w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3">

                <Link
                  href="/events?category=theatre"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  🎭 All Theatre
                </Link>

                <Link
                  href="/events?category=broadway"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  🎟️ Broadway
                </Link>

                <Link
                  href="/events?category=west-end"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  🎭 West End
                </Link>

                <Link
                  href="/events?category=musicals"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  🎶 Musicals
                </Link>

                <Link
                  href="/events?category=comedy"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  😂 Comedy
                </Link>

                <Link
                  href="/events?category=family"
                  className="block px-4 py-3 rounded-lg hover:bg-slate-800"
                >
                  👨‍👩‍👧 Family Shows
                </Link>

              </div>
            </div>
          )}
        </div>


        {/* CONTACT */}
        <Link
          href="/contact"
          className="hover:text-blue-400 transition"
        >
          Contact
        </Link>


        {/* LOGIN */}
        <Link
          href="/login"
          className="hover:text-blue-400 transition"
        >
          Login
        </Link>


        {/* SIGN UP */}
        <Link
          href="/signup"
          className="border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg transition"
        >
          Sign Up
        </Link>

      </div>


      {/* BUY TICKETS */}
      <Link
        href="/events"
        className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-semibold text-white transition"
      >
        Buy Tickets
      </Link>

    </nav>
  );
}