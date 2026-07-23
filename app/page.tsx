import Navbar from "./components/Navbar";
import FeaturedEvents from "./components/FeaturedEvents";
import WhyChooseUs from "./components/WhyChooseUs";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

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
      <FeaturedEvents />
      <WhyChooseUs />
    </main>
  );
}