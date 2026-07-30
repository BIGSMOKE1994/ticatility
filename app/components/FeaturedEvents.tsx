import EventCard from "./EventCard";
import { getEvents } from "@/lib/events";

export default async function FeaturedEvents() {
  const events = await getEvents();

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold mb-10">
        🔥 Featured Events
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {events.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            location={event.location}
            date={event.date}
            price={`$${event.price}`}
            image={event.image}
            slug={event.slug}
          />
        ))}
      </div>
    </section>
  );
}