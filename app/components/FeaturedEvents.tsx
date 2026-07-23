import EventCard from "./EventCard";

export default function FeaturedEvents() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold mb-10">
        🔥 Featured Events
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        <EventCard
          title="FIFA World Cup 2026"
          location="New York, USA"
          date="July 19, 2026"
          price="$250"
          image="/images/worldcup.jpeg"
          slug="world-cup-2026"
        />

        <EventCard
          title="Taylor Swift"
          location="London, UK"
          date="August 15, 2026"
          price="$180"
          image="/images/taylorswift.jpeg"
          slug="taylor-swift"
        />

        <EventCard
          title="NBA Finals"
          location="Los Angeles, USA"
          date="June 8, 2026"
          price="$320"
          image="/images/nbafinals.jpeg"
          slug="nba-finals"
        />
      </div>
    </section>
  );
}